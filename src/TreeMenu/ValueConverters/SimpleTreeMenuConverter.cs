using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;


#if NETFRAMEWORK
#else
#endif

#if NETFRAMEWORK
using Umbraco.Core.Models.PublishedContent;
using Umbraco.Core.PropertyEditors;
using Umbraco.Web.PropertyEditors;
using Umbraco.Web.PropertyEditors.ValueConverters;
using Umbraco.Web.PublishedCache;
using Umbraco.Core;
using UmbracoCore = Umbraco.Core;

#else
using Umbraco.Cms.Core.Logging;
using Umbraco.Cms.Core.Models.Blocks;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.PublishedCache;
using Umbraco.Extensions;
#endif


namespace Our.Umbraco.SimpleTreeMenu.ValueConverters
{
#if NETFRAMEWORK
    public class SimpleTreeMenuConverter : NestedContentValueConverterBase, IPropertyValueConverter
    {
        private readonly IPublishedSnapshotAccessor _publishedSnapshotAccessor;
        public SimpleTreeMenuConverter(IPublishedSnapshotAccessor publishedSnapshotAccessor, IPublishedModelFactory publishedModelFactory) : base(publishedSnapshotAccessor, publishedModelFactory)
        {
            _publishedSnapshotAccessor = publishedSnapshotAccessor;
        }

#elif NET8_0_OR_GREATER
    public class SimpleTreeMenuConverter : PropertyValueConverterBase, IPropertyValueConverter
    {

        private readonly IPublishedSnapshotAccessor _publishedSnapshotAccessor;
        private readonly IPublishedModelFactory _publishedModelFactory;

        public SimpleTreeMenuConverter(
            IPublishedSnapshotAccessor publishedSnapshotAccessor, 
            IPublishedModelFactory publishedModelFactory)
        {
            _publishedSnapshotAccessor = publishedSnapshotAccessor;
            _publishedModelFactory = publishedModelFactory;
        }
#else
    
        public class SimpleTreeMenuConverter : global::Umbraco.Cms.Core.PropertyEditors.ValueConverters.NestedContentValueConverterBase, IPropertyValueConverter
    {
        private readonly IPublishedSnapshotAccessor _publishedSnapshotAccessor;
        public SimpleTreeMenuConverter(IPublishedSnapshotAccessor publishedSnapshotAccessor, IPublishedModelFactory publishedModelFactory, IProfilingLogger proflog) : base(publishedSnapshotAccessor, publishedModelFactory)
        {
            _publishedSnapshotAccessor = publishedSnapshotAccessor;
        }
#endif

        public override PropertyCacheLevel GetPropertyCacheLevel(IPublishedPropertyType propertyType)
            => PropertyCacheLevel.Element;

        public override bool IsConverter(IPublishedPropertyType publishedProperty)
        {
            var alias = publishedProperty.EditorAlias;
            return publishedProperty.EditorAlias.EndsWith("SimpleTreeMenu");
        }


        public override object ConvertSourceToIntermediate(IPublishedElement owner, IPublishedPropertyType propertyType, object source, bool preview)
        {
            return source?.ToString();
        }

        public override object ConvertIntermediateToObject(IPublishedElement owner, IPublishedPropertyType propertyType, PropertyCacheLevel referenceCacheLevel, object inter, bool preview)
        {
            if(inter == null)
                return Enumerable.Empty<SimpleTreeItem>();
                
            var jsonObject = JsonConvert.DeserializeObject<JObject>((string)inter);

            if (jsonObject == null)
                return Enumerable.Empty<SimpleTreeItem>();

            var items = jsonObject["items"].ToObject<List<JObject>>();

            if (items == null || !items.Any())
                return Enumerable.Empty<SimpleTreeItem>();

            return convertToItem(items, referenceCacheLevel, preview);

        }
        public override Type GetPropertyValueType(IPublishedPropertyType propertyType)
            => typeof (IEnumerable<SimpleTreeItem>);

        private IEnumerable<SimpleTreeItem> convertToItem(List<JObject> objects, PropertyCacheLevel referenceCacheLevel, bool preview)    
        {
            if (!objects.Any())
                return Enumerable.Empty<SimpleTreeItem>();

            var items = new List<SimpleTreeItem>();

            foreach (var sourceObject in objects)
            {
                var elementObject = sourceObject["properties"]?.ToObject<JObject>() ?? new JObject();

                elementObject["ncContentTypeAlias"] = sourceObject["contentTypeAlias"]?.ToObject<string>() ?? "menuNode";
                elementObject["name"] = sourceObject["name"]?.ToObject<string>();
                elementObject["key"] = sourceObject["key"]?.ToObject<string>() ?? Guid.NewGuid().ToString();

                var element = ConvertToElement(elementObject, referenceCacheLevel, preview);

                if (element == null)
                    continue;

                var item = new SimpleTreeItem()
                {
                    Item = element,
                    Name =sourceObject["name"]?.ToObject<string>(),
                    Level = (int)sourceObject["level"]?.ToObject<int>()
                };

                var children = sourceObject["items"]?.ToObject<List<JObject>>();

                if(children != null && children.Any())
                    item.Items = convertToItem(children, referenceCacheLevel, preview);

                items.Add(item);
            }

            return items;
        }

#if NET8_0_OR_GREATER
        protected IPublishedElement ConvertToElement(JObject sourceObject, PropertyCacheLevel referenceCacheLevel, bool preview)
        {
            var elementTypeAlias = sourceObject["ncContentTypeAlias"]?.ToObject<string>();
            if (string.IsNullOrEmpty(elementTypeAlias))
            {
                return null;
            }

            IPublishedSnapshot publishedSnapshot = _publishedSnapshotAccessor.GetRequiredPublishedSnapshot();

            // Only convert element types - content types will cause an exception when PublishedModelFactory creates the model
            IPublishedContentType? publishedContentType = publishedSnapshot.Content?.GetContentType(elementTypeAlias);
            if (publishedContentType is null || publishedContentType.IsElement == false)
            {
                return null;
            }

            Dictionary<string, object?>? propertyValues = sourceObject.ToObject<Dictionary<string, object?>>();
            if (propertyValues is null || !propertyValues.TryGetValue("key", out var keyo) ||
                !Guid.TryParse(keyo?.ToString(), out Guid key))
            {
                key = Guid.Empty;
            }

            IPublishedElement element = new PublishedElement(publishedContentType, key, propertyValues, preview, referenceCacheLevel, _publishedSnapshotAccessor);
            element = _publishedModelFactory.CreateModel(element);

            return element;
        }
#endif
    }
}
