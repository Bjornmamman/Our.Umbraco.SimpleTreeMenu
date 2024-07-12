import { UmbEntryPointOnInit } from '@umbraco-cms/backoffice/extension-api';
import { ManifestModal, ManifestPropertyEditorSchema, ManifestPropertyEditorUi, ManifestTypes } from '@umbraco-cms/backoffice/extension-registry';
import { UMB_AUTH_CONTEXT } from '@umbraco-cms/backoffice/auth';
import { OpenAPI } from '@umbraco-cms/backoffice/external/backend-api';


const modal: ManifestModal = {
    type: 'modal',
    alias: 'treeitem.editor.modal',
    name: 'SimpleTree Editor Modal',
    js: () => import('./dialogs/treeitemeditor/treeitemeditor.element')
}

const schema: ManifestPropertyEditorSchema = {
    type: 'propertyEditorSchema',
    name: 'SimpleTreeMenu Schema',
    alias: 'SimpleTreeMenu',
    meta: {
        defaultPropertyEditorUiAlias: 'SimpleTreeMenu.Ui',
        settings: {
            properties: [
                {
                    alias: 'doctype',
                    label: 'Doctype',
                    description: 'Allowed doctype',
                    propertyEditorUiAlias: 'Umb.PropertyEditorUi.TextArea'
                },
                {
                    alias: 'nameTemplate',
                    label: 'nameTemplate',
                    description: '',
                    propertyEditorUiAlias: 'Umb.PropertyEditorUi.TextArea'
                },
                {
                    alias: 'Levels',
                    label: 'levels',
                    description: 'Max number of levels',
                    propertyEditorUiAlias: 'Umb.PropertyEditorUi.TextArea'
                }
            ],
            defaultData: [
                {
                    alias: 'doctype',
                    value: 'MenuNode'
                },
                {
                    alias: 'levels',
                    value: '3'
                }
            ]
        }
    }
}
const editorUi: ManifestPropertyEditorUi =
{
    type: 'propertyEditorUi',
    alias: 'SimpleTreeMenu',
    name: 'SimpleTreeMenu',
    element: () => import('./property-editor-ui/simpletreemenu/simpletreemenu.element'),
    meta: {
        label: 'SimpleTreeMenu',
        icon: 'icon-network-alt',
        group: 'common',
        propertyEditorSchemaAlias: 'Umbraco.Plain.Json',
        settings: {
            properties: [
                {
                    alias: 'doctype',
                    label: 'Doctype',
                    description: 'Allowed doctype',
                    propertyEditorUiAlias: 'Umb.PropertyEditorUi.TextArea'
                },
                {
                    alias: 'nameTemplate',
                    label: 'nameTemplate',
                    description: '',
                    propertyEditorUiAlias: 'Umb.PropertyEditorUi.TextArea'
                },
                {
                    alias: 'Levels',
                    label: 'levels',
                    description: 'Max number of levels',
                    propertyEditorUiAlias: 'Umb.PropertyEditorUi.TextArea'
                }
            ],
            defaultData: [
                {
                    alias: 'doctype',
                    value: 'MenuNode'
                },
                {
                    alias: 'levels',
                    value: '3'
                }
            ]
        }
    }

}
export const onInit: UmbEntryPointOnInit = (_host, extensionRegistry) => {
    extensionRegistry.registerMany([
        modal,
        //schema,
        editorUi,
    ]);

    _host.consumeContext(UMB_AUTH_CONTEXT, (_auth) => {
        const umbOpenApi = _auth.getOpenApiConfiguration();
        OpenAPI.TOKEN = umbOpenApi.token;
        OpenAPI.BASE = umbOpenApi.base;
        OpenAPI.WITH_CREDENTIALS = umbOpenApi.withCredentials;
    });
};
