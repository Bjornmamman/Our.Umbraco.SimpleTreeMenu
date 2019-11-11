using System;
using System.Collections;
using System.Collections.Generic;
using Umbraco.Core.Models.PublishedContent;

namespace Our.Umbraco.SimpleTreeMenu
{
    public interface ISimpleTreeItem : IEnumerable
    {
        IEnumerable<ISimpleTreeItem> Children { get; }
        IPublishedContentType ContentType { get; }
        IPublishedElement Item { get; set; }
        IEnumerable<ISimpleTreeItem> Items { get; set; }
        Guid Key { get; }
        int Level { get; set; }
        IEnumerable<IPublishedProperty> Properties { get; }

        bool Any();
        int Count();
        IPublishedProperty GetProperty(string alias);
        List<ISimpleTreeItem> ToList();
    }
}