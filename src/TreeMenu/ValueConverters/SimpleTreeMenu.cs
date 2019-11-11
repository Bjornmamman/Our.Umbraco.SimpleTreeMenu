using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Our.Umbraco.SimpleTreeMenu
{
    public class SimpleTreeMenu : ISimpleTreeMenu
    {
        public IEnumerable<ISimpleTreeItem> Items { get; set; }
        IEnumerator IEnumerable.GetEnumerator()
        {
            return (IEnumerator)Items;
        }

        public static explicit operator SimpleTreeMenu(List<ISimpleTreeItem> b) {
            return new SimpleTreeMenu()
            {
                Items = b
            };
        }

        public static implicit operator List<ISimpleTreeItem>(SimpleTreeMenu d)
        {
            return d.Items.ToList();
        }
    }
}