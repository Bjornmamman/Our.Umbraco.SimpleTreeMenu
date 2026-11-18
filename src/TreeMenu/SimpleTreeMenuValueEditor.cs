#if NET9_0_OR_GREATER
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Nodes;
using Umbraco.Cms.Core.Cache;
using Umbraco.Cms.Core.IO;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Models.Editors;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.Serialization;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Core.Strings;

namespace Our.Umbraco.SimpleTreeMenu
{
	/// <summary>
	///     Runs every nested property value through the value editor of its own property editor,
	///     so values are persisted in their storage format (e.g. UDIs for the multi url picker)
	///     and converted back to the editor format when loaded in the backoffice.
	/// </summary>
	public class SimpleTreeMenuValueEditor : DataValueEditor
	{
		private readonly PropertyEditorCollection _propertyEditors;
		private readonly IDataTypeConfigurationCache _dataTypeConfigurationCache;
		private readonly IContentTypeService _contentTypeService;
		private readonly IJsonSerializer _jsonSerializer;

		public SimpleTreeMenuValueEditor(
			IShortStringHelper shortStringHelper,
			IJsonSerializer jsonSerializer,
			IIOHelper ioHelper,
			DataEditorAttribute attribute,
			PropertyEditorCollection propertyEditors,
			IDataTypeConfigurationCache dataTypeConfigurationCache,
			IContentTypeService contentTypeService)
			: base(shortStringHelper, jsonSerializer, ioHelper, attribute)
		{
			_propertyEditors = propertyEditors;
			_dataTypeConfigurationCache = dataTypeConfigurationCache;
			_contentTypeService = contentTypeService;
			_jsonSerializer = jsonSerializer;
		}

		public override object? FromEditor(ContentPropertyData editorValue, object? currentValue)
		{
			var root = ParseNode(editorValue.Value);
			if (root is not JsonObject rootObject)
				return base.FromEditor(editorValue, currentValue);

			ProcessItems(rootObject["items"] as JsonArray, new Dictionary<string, IContentType?>(), ConvertFromEditor);

			return rootObject.ToJsonString();
		}

		public override object? ToEditor(IProperty property, string? culture = null, string? segment = null)
		{
			var value = property.GetValue(culture, segment);
			var root = ParseNode(value);
			if (root is not JsonObject rootObject)
				return base.ToEditor(property, culture, segment);

			ProcessItems(rootObject["items"] as JsonArray, new Dictionary<string, IContentType?>(), ConvertToEditor);

			return rootObject;
		}

		private void ProcessItems(JsonArray? items, Dictionary<string, IContentType?> contentTypes, Func<IPropertyType, JsonNode?, JsonNode?> convert)
		{
			if (items == null)
				return;

			foreach (var item in items.OfType<JsonObject>())
			{
				var contentType = GetContentType(item["contentTypeAlias"]?.GetValue<string>(), contentTypes);

				if (contentType != null && item["properties"] is JsonObject properties)
				{
					foreach (var propertyType in contentType.CompositionPropertyTypes)
					{
						if (!properties.ContainsKey(propertyType.Alias))
							continue;

						try
						{
							properties[propertyType.Alias] = convert(propertyType, properties[propertyType.Alias]);
						}
						catch (Exception)
						{
							// Keep the original value if the nested editor cannot convert it
						}
					}
				}

				ProcessItems(item["items"] as JsonArray, contentTypes, convert);
			}
		}

		private JsonNode? ConvertFromEditor(IPropertyType propertyType, JsonNode? value)
		{
			if (!_propertyEditors.TryGet(propertyType.PropertyEditorAlias, out var propertyEditor))
				return value?.DeepClone();

			var configuration = _dataTypeConfigurationCache.GetConfiguration(propertyType.DataTypeKey);
			var valueEditor = propertyEditor.GetValueEditor(configuration);

			var result = valueEditor.FromEditor(new ContentPropertyData(ToEditorObject(value), configuration), null);

			return ToNode(result);
		}

		private JsonNode? ConvertToEditor(IPropertyType propertyType, JsonNode? value)
		{
			if (!_propertyEditors.TryGet(propertyType.PropertyEditorAlias, out var propertyEditor))
				return value?.DeepClone();

			var configuration = _dataTypeConfigurationCache.GetConfiguration(propertyType.DataTypeKey);
			var valueEditor = propertyEditor.GetValueEditor(configuration);

			var tempProperty = new Property(propertyType);
			tempProperty.SetValue(ToStorageObject(value));

			var result = valueEditor.ToEditor(tempProperty);

			if (result is string s)
				return JsonValue.Create(s);

			return ToNode(result is null ? null : _jsonSerializer.Serialize(result), parseStrings: true);
		}

		private IContentType? GetContentType(string? aliasOrKey, Dictionary<string, IContentType?> cache)
		{
			if (string.IsNullOrWhiteSpace(aliasOrKey))
				return null;

			if (!cache.TryGetValue(aliasOrKey, out var contentType))
			{
				contentType = Guid.TryParse(aliasOrKey, out var key)
					? _contentTypeService.Get(key)
					: _contentTypeService.Get(aliasOrKey);
				cache[aliasOrKey] = contentType;
			}

			return contentType;
		}

		private JsonNode? ParseNode(object? value)
		{
			try
			{
				return value switch
				{
					null => null,
					JsonNode node => node.DeepClone(),
					string s when string.IsNullOrWhiteSpace(s) => null,
					string s => JsonNode.Parse(s),
					_ => JsonNode.Parse(_jsonSerializer.Serialize(value)),
				};
			}
			catch (JsonException)
			{
				return null;
			}
		}

		// Editor values are handed to nested value editors the same way the Management API does:
		// primitives as CLR values, arrays/objects as JsonNodes.
		private static object? ToEditorObject(JsonNode? value)
		{
			if (value is JsonValue jsonValue)
			{
				return jsonValue.GetValueKind() switch
				{
					JsonValueKind.String => jsonValue.GetValue<string>(),
					JsonValueKind.True => true,
					JsonValueKind.False => false,
					JsonValueKind.Number => long.TryParse(jsonValue.ToJsonString(), out var l) ? l : decimal.Parse(jsonValue.ToJsonString(), System.Globalization.CultureInfo.InvariantCulture),
					_ => null,
				};
			}

			return value?.DeepClone();
		}

		// Stored values are handed to nested value editors as they would be stored in the database:
		// primitives as CLR values, arrays/objects as JSON strings.
		private static object? ToStorageObject(JsonNode? value)
		{
			if (value is JsonValue)
				return ToEditorObject(value);

			return value?.ToJsonString();
		}

		private static JsonNode? ToNode(object? value, bool parseStrings = false)
		{
			switch (value)
			{
				case null:
					return null;
				case JsonNode node:
					return node.DeepClone();
				case string s when parseStrings:
					try { return JsonNode.Parse(s); }
					catch (JsonException) { return JsonValue.Create(s); }
				case string s:
					return JsonValue.Create(s);
				case bool b:
					return JsonValue.Create(b);
				case int i:
					return JsonValue.Create(i);
				case long l:
					return JsonValue.Create(l);
				case decimal d:
					return JsonValue.Create(d);
				case double db:
					return JsonValue.Create(db);
				default:
					return JsonValue.Create(value.ToString());
			}
		}
	}
}
#endif
