# Our.Umbraco.SimpleTreeMenu

### A simple treemenu propertyeditor that uses a doc-type (element) for menu items.

With a valueconverter that utilize the built in nestedcontent for type conversion of menu items.
Every item can be cast to an IPublishedElement for propertyaccess through Umbracos extension-methods.

It will work without the valueconverter, just remove the binary and use JObject instead of IEnumerable<ISimpleTreeItem>


Example:


```
@{

  var navigationModel = Model.Value<IEnumerable<ISimpleTreeItem>>("navigation", defaultValue: new List<ISimpleTreeItem>());
  
   @:<ul>


    foreach (var item in navigationModel)
    {

        var element = (IPublishedElement)item;
        var url = element.Value<IPublishedContent>("linkedContent")?.Url ?? element.Value<string>("linkedUrl") ?? "#";

        @:<li><a class="nav-link" href="@url">@(element.Value<string>("title"))</a></li>




        if (item.Children.Any())
        {
            @:<ul>
                foreach (var child in item.Children)
                {
                    var cElement = (IPublishedElement)child;
                    var cUrl = cElement.Value<IPublishedContent>("linkedContent")?.Url ?? cElement.Value<string>("linkedUrl") ?? "#";
                    @:<!--<li>--><a class="nav-link" href="@cUrl">@(cElement.Value<string>("title"))</a></li>
                }
            @:</ul>
        }
    }

    @:</ul>
}
```
