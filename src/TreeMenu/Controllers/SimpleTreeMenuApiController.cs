using System;
using System.Collections.Generic;
using System.Linq;
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Api.Management.Controllers;
using Umbraco.Cms.Api.Management.Routing;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Web.Common.Authorization;

namespace Our.Umbraco.SimpleTreeMenu.Controllers;

[ApiVersion("1.0")]
[Authorize(Policy = AuthorizationPolicies.BackOfficeAccess)]
[VersionedApiBackOfficeRoute("simpletreemenu")]
[ApiExplorerSettings(GroupName = "SimpleTreeMenu")]
public class SimpleTreeMenuApiController : ManagementApiControllerBase
{
    private readonly IContentTypeService _contentTypeService;

    public SimpleTreeMenuApiController(IContentTypeService contentTypeService)
        => _contentTypeService = contentTypeService;

    [HttpGet("element-types")]
    [ProducesResponseType(typeof(IEnumerable<ElementTypeResponseModel>), StatusCodes.Status200OK)]
    public IActionResult GetElementTypes()
    {
        IEnumerable<ElementTypeResponseModel> elementTypes = _contentTypeService
            .GetAll()
            .Where(x => x.IsElement)
            .OrderBy(x => x.Name)
            .Select(x => new ElementTypeResponseModel
            {
                Id = x.Key,
                Alias = x.Alias,
                Name = x.Name ?? string.Empty,
            });

        return Ok(elementTypes);
    }

    public sealed class ElementTypeResponseModel
    {
        public Guid Id { get; init; }

        public string Alias { get; init; } = string.Empty;

        public string Name { get; init; } = string.Empty;
    }
}
