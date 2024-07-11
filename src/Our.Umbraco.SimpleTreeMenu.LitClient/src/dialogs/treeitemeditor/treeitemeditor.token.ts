import { UmbModalToken } from "@umbraco-cms/backoffice/modal";

export interface TreeItemEditorModalData {
    headline: string;
    doctype: string;
    data: any;
}

export interface TreeItemEditorModalValue {
    data: any
}

export const TREE_ITEM_EDITOR_MODAL = new UmbModalToken<TreeItemEditorModalData, TreeItemEditorModalValue>(
    "treeitem.editor.modal",
    {
        modal: {
            type: 'sidebar',
            size: 'medium'
        }
    }
);