using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Umbraco.Core.Models.PublishedContent;

namespace Our.Umbraco.SimpleTreeMenu
{
    public class SimpleTreeItem : IPublishedElement, ISimpleTreeItem
    {

        public int Level { get; set; } = 1;

        public IPublishedElement Item { get; set; }

        public IEnumerable<ISimpleTreeItem> Items { get; set; } = new List<SimpleTreeItem>();

        public IEnumerable<ISimpleTreeItem> Children => Items;

        public IPublishedContentType ContentType => Item.ContentType;

        public Guid Key => Item.Key;
        public string Name { get; set; }
        public IEnumerable<IPublishedProperty> Properties => Item.Properties;

        public IPublishedProperty GetProperty(string alias)
        {
            return Item.GetProperty(alias);
        }



        IEnumerator IEnumerable.GetEnumerator()
        {
            return (IEnumerator)Items.GetEnumerator();
        }

        public bool Any()
        {
            return Items.Any();
        }


        public List<ISimpleTreeItem> ToList()
        {
            return Items.ToList();
        }

        public int Count()
        {
            return Items.Count();
        }
    }
}