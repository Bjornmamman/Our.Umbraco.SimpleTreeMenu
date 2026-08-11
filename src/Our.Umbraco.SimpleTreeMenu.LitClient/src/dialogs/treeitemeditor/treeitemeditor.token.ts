import { UmbModalToken } from "@umbraco-cms/backoffice/modal";

export interface TreeItemEditorModalData {
    doctype: string;
    key: string;
    data: any;
    properties: any;
}

export interface TreeItemEditorModalValue {
    value: any
}

export const TREE_ITEM_EDITOR_MODAL_TOKEN = new UmbModalToken<TreeItemEditorModalData, TreeItemEditorModalValue>(
    "treeitem.editor.modal",
    {
        modal: {
            type: 'sidebar',
            size: 'medium'
        }
    }
);