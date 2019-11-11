using System.Collections;
using System.Collections.Generic;

namespace Our.Umbraco.SimpleTreeMenu
{
    public interface ISimpleTreeMenu : IEnumerable
    {
        IEnumerable<ISimpleTreeItem> Items { get; set; }
    }
}