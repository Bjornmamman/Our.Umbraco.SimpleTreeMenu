using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Umbraco.Core;
using Umbraco.Core.Models.PublishedContent;
using Umbraco.Core.PropertyEditors;
using Umbraco.Web.PropertyEditors;
using Umbraco.Web.PropertyEditors.ValueConverters;
using Umbraco.Web.PublishedCache;
using UmbracoCore = Umbraco.Core;

namespace Our.Umbraco.SimpleTreeMenu.ValueConverters
{
    public class SimpleTreeMenuConverter : NestedContentValueConverterBase, IPropertyValueConverter
    {
        private readonly IPublishedSnapshotAccessor _publishedSnapshotAccessor;
        
        public SimpleTreeMenuConverter(IPublishedSnapshotAccessor publishedSnapshotAccessor, IPublishedModelFactory publishedModelFactory) : base(publishedSnapshotAccessor, publishedModelFactory)
        {
            _publishedSnapshotAccessor = publishedSnapshotAccessor;
        }

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

        /// <inheritdoc />
        public override object ConvertIntermediateToObject(IPublishedElement owner, IPublishedPropertyType propertyType, PropertyCacheLevel referenceCacheLevel, object inter, bool preview)
        {
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
                    Name =sourceObject["name"]?.ToObject<string>()
                };

                var children = sourceObject["items"]?.ToObject<List<JObject>>();

                if(children != null && children.Any())
                    item.Items = convertToItem(children, referenceCacheLevel, preview);

                items.Add(item);
            }

            return items;
        }

    }

}