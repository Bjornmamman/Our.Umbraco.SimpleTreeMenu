import { UmbModalToken } from "@umbraco-cms/backoffice/modal";

export interface TreeItemEditorModalData {
    doctype: string;
    data: any;
}

export interface TreeItemEditorModalValue {
    data: any
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