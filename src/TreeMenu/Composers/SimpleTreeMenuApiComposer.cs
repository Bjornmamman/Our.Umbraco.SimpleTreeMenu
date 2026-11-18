using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Our.Umbraco.SimpleTreeMenu.Controllers;
using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.DependencyInjection;

namespace Our.Umbraco.SimpleTreeMenu.Composers;

public class SimpleTreeMenuApiComposer : IComposer
{
    public void Compose(IUmbracoBuilder builder)
        => builder.Services
            .AddControllers()
            .AddApplicationPart(typeof(SimpleTreeMenuApiController).Assembly);
}
