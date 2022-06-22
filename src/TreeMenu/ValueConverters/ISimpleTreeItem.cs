using System;
using System.Collections;
using System.Collections.Generic;
#if NETFRAMEWORK
using Umbraco.Core.Models.PublishedContent;
#else
using Umbraco.Cms.Core.Models.PublishedContent;
#endif


namespace Our.Umbraco.SimpleTreeMenu
{
    public interface ISimpleTreeItem : IEnumerable
    {
        IEnumerable<ISimpleTreeItem> Children { get; }
        IPublishedContentType ContentType { get; }
        IPublishedElement Item { get; set; }
        IEnumerable<ISimpleTreeItem> Items { get; set; }
        Guid Key { get; }
        string Name { get; }
        int Level { get; set; }
        IEnumerable<IPublishedProperty> Properties { get; }

        bool Any();
        int Count();
        IPublishedProperty GetProperty(string alias);
        List<ISimpleTreeItem> ToList();
    }
}