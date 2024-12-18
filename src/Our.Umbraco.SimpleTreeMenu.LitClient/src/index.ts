import { UmbEntryPointOnInit } from '@umbraco-cms/backoffice/extension-api';
import { ManifestModal, ManifestPropertyEditorSchema, ManifestPropertyEditorUi } from '@umbraco-cms/backoffice/extension-registry';
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
    alias: 'Simple Tree Menu',
    meta: {
        defaultPropertyEditorUiAlias: 'SimpleTreeMenu.PropertyEditorUi',
        
    }
}

const editorUi: UmbExtensionManifest =
{
    type: 'propertyEditorUi',
    alias: 'SimpleTreeMenu.PropertyEditorUi',
    name: 'SimpleTreeMenu Editor UI',
    element: () => import('./property-editor-ui/simpletreemenu/simpletreemenu.element'),
    meta: {
        label: 'SimpleTreeMenu',
        icon: 'icon-network-alt',
        group: 'common',
        propertyEditorSchemaAlias: 'SimpleTreeMenu',
        settings: {
            properties: [
                {
                    alias: 'doctype',
                    label: 'Doctype',
                    description: 'Allowed doctype',
                    propertyEditorUiAlias: 'SimpleTreeMenu.ElementTypePicker'
                },
                {
                    alias: 'nameTemplate',
                    label: 'Name template',
                    description: '',
                    propertyEditorUiAlias: 'Umb.PropertyEditorUi.TextArea'
                },
                {
                    alias: 'levels',
                    label: 'Levels',
                    description: 'Max number of levels',
                    propertyEditorUiAlias: 'Umb.PropertyEditorUi.Integer'
                }
            ],
            defaultData: [
                {
                    alias: 'levels',
                    value: '3'
                }
            ]
        }
    }

}

const elementTypePickerUi: UmbExtensionManifest =
{
    type: 'propertyEditorUi',
    alias: 'SimpleTreeMenu.ElementTypePicker',
    name: 'SimpleTreeMenuElementTypePicker',
    element: () => import('./property-editor-ui/element-type-picker/element-type-picker.element'),
    meta: {
        label: 'ElementTypePicker',
        icon: 'icon-network-alt',
        group: 'common',
    }

}
export const onInit: UmbEntryPointOnInit = (_host, extensionRegistry) => {
    extensionRegistry.registerMany([
        modal,
        editorUi,
        elementTypePickerUi,
        schema
    ]);

    _host.consumeContext(UMB_AUTH_CONTEXT, (_auth) => {
        const umbOpenApi = _auth.getOpenApiConfiguration();
        OpenAPI.TOKEN = umbOpenApi.token;
        OpenAPI.BASE = umbOpenApi.base;
        OpenAPI.WITH_CREDENTIALS = umbOpenApi.withCredentials;
    });
};
