import { html, css, customElement, property, state, LitElement } from "@umbraco-cms/backoffice/external/lit";
import { UmbPropertyValueChangeEvent } from "@umbraco-cms/backoffice/property-editor";
import { UMB_MODAL_MANAGER_CONTEXT, UmbModalManagerContext } from "@umbraco-cms/backoffice/modal";
import { TREE_ITEM_EDITOR_MODAL_TOKEN, TreeItemEditorModalValue } from "../../dialogs/treeitemeditor/treeitemeditor.token";
import { UmbModalRouteBuilder, UmbModalRouteRegistrationController } from "@umbraco-cms/backoffice/router";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import { UmbVariantId } from "@umbraco-cms/backoffice/variant";
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';

import type {
    UmbPropertyEditorConfigCollection,
    UmbPropertyEditorUiElement,
} from '@umbraco-cms/backoffice/property-editor';



const ELEMENT_NAME = 'simpletreemenu-list';

interface TreeNode {
    key: string,
    name: string,
    oldKey?: string,
    level: number,
    properties?: object,
    items: TreeNode[]
}

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement(ELEMENT_NAME)
export class SimpleTreeMenuElement extends UmbLitElement implements UmbPropertyEditorUiElement {

    @state()
    treeData: TreeNode[] = [];

    _value: TreeNode = {} as TreeNode;
    editModal:UmbModalRouteRegistrationController;

    @state()
    _dragging: boolean = false;
    
    @state()
    private _modalRoute?: UmbModalRouteBuilder;

    @state()
    _doctype: string = "MenuNode";

    @state()
    _nameTemplate?: string;

    @state()
    _levels?: number;

    @property({ type: Object })
    public set value(value: TreeNode | string | undefined) {
        if (typeof value === "string")
            this._value = JSON.parse(value);
        else if (typeof value == "object")
            this._value = value as TreeNode;
        else
            this._value = {} as TreeNode;
    }
    public get value(): TreeNode | undefined {
        return this._value;
    }

    @property()
    public set alias(value: string | undefined) {
        this.editModal.setUniquePathValue('propertyAlias', value);
    }

    @property()
    public set variantId(value: string | UmbVariantId | undefined) {
        this.editModal.setUniquePathValue('variantId', value?.toString());
    }

    @property({ attribute: false })
    public set config(config: UmbPropertyEditorConfigCollection | undefined) {
        this._doctype = config?.getValueByAlias('doctype') ?? 'MenuNode';
        this._nameTemplate = config?.getValueByAlias('nameTemplate');
        this._levels = parseInt(config?.getValueByAlias('levels') ?? '5', 10);

        if (this.value && this.value.items) {
            this.treeData = JSON.parse(JSON.stringify(this.value.items));
        } else {
            this.treeData = [];
        }
        
    }

    private _modalContext?: UmbModalManagerContext;

    constructor() {
        super();
        this.consumeContext(UMB_MODAL_MANAGER_CONTEXT, (_instance) => {
            this._modalContext = _instance;
        });

        this.editModal = new UmbModalRouteRegistrationController(
            this,
            TREE_ITEM_EDITOR_MODAL_TOKEN
        )
            .addAdditionalPath(`:key`)
            .addUniquePaths(['propertyAlias', 'variantId'])
            .onSetup((params) => {
                let node = this.findNodeById(params.key)
                console.log(node);
                return {
                    data: {
                        doctype: this._doctype,
                        key: params.key,
                        properties: node?.properties ?? {},
                    }
                };
            })
            .onSubmit((submit) => {
                if (!submit || !submit.value) return;


                let node = this.findNodeById(this.editModal.modalContext?.data.key);

                if (node)
                    node.properties = submit.value as object;

                this.#onChange();
            })
            .observeRouteBuilder((routeBuilder) => {
                this._modalRoute = routeBuilder;
            });
        
    }

    render() {
        return html`
            <div class="draggable-tree">
                ${this.treeData.map((node) => this.renderTreeNode(node, null, 0))}
                <uui-button class="add-new" look="placeholder" color="default" label=${this.localize.term('general_add')} title=${this.localize.term('general_add')} @click=${() => this.addNodeToTree()}>
                    <umb-localize key='general_add'></umb-localize>
                </uui-button>

            </div>
        `
    }

    static get properties() {
        return {
            treeData: { type: Array },
            dragOverIndex: { type: Number },
        };
    }
    
    static styles = css`
        .tree-node {
            padding-left: 10px;
            cursor: pointer;
            //background: rgb(0 0 0 / 4%);
            border-radius: var(--uui-border-radius);
            margin: 3px 0;
        }

        .draggable-tree > .tree-node {
            padding-left: 0;
        }

        h1 {
            font-size: var(--uui-type-h5-size);
            margin: 0;
        }
      
        .tree-node:not(:last-child) > .drop-zone.after {
            display:none;
        }

        .draggable-tree > .tree-node:last-of-type > .drop-zone.after {
            display:block !important;
        }
      
        .tree-node .node-handle {
            display: block;
            padding: var(--uui-size-2) var(--uui-size-2) var(--uui-size-2) var(--uui-size-4);
            background: var(--uui-color-surface-alt);
            border-radius: var(--uui-border-radius, 3px);
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            transition: background-color 0.3s;
            cursor: grab;
        }

        .tree-node .node-handle:active {
            cursor: grabbing;
        }

        .tree-node .node-settings {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            gap: var(--uui-size-4);
        }

        .drop-zone {
            //margin-left: -20px;
            height: 0px;
            border-radius: 3px;
            margin: 0;
            transition: background-color 0.3s, height 0.3s;
        }

        .tree-node > .node-children:has( > .tree-node > .drop-zone.drag-over) {
            //background-color: var(--uui-palette-spanish-pink-dimmed) !important;
            outline: dashed 1px var(--uui-palette-spanish-pink-dimmed);
        }

        .tree-node:has(> .node-children > .tree-node > .drop-zone.drag-over) > .node-handle {
            background-color: var(--uui-color-current) !important;
        }
      
        .tree-node .drop-zone.drag-over, .tree-node .node-handle.drag-over {
            background-color: var(--uui-color-current) !important;
        }

        .draggable-tree.dragging .drop-zone {
            background-color: var(--umb-body-layout-color-background);
            height: 10px;
            margin: 3px 0;
        }



        .add-new {
            width: 100%;
        }

        .add-new:not(:first-child) {
            margin-top:  var(--uui-size-6);
        }
    `

    _testData = { headline: "hehe" };;
    _testFormat = "{=headline}"

    renderTreeNode(node: TreeNode, parent: TreeNode | null, level: number) : any {
        return html`
      <div
        class="tree-node"
        @dragover=${(e: DragEvent) => this.handleDragOver(e)}
        @dragleave=${(e: DragEvent) => this.handleDragLeave(e)}
        @drop=${(e: DragEvent) => this.handleDrop(e, node, parent)}
        @dragend=${(e: DragEvent) => this.handleDragEnd(e)}
        draggable="true"
        @dragstart=${(e: DragEvent) => this.handleDragStart(e, node)}
      >
        <div class="drop-zone before"></div>
        <div class="node-handle">
            <h1><umb-ufm-render inline .markdown="${this._nameTemplate}" .value=${node.properties}></umb-ufm-render></h1>
            
            <div class="node-settings">
                ${node.items && node.items.length > 0 ? html`
                    <uui-badge style="--uui-badge-position: relative; --uui-badge-inset: 0" look="secondary" color="default">${node.items.length} children</uui-badge>
                `: ''}
                <uui-badge style="--uui-badge-position: relative; --uui-badge-inset: 0" look="secondary" color="default">Level ${node.level + 1} of 3</uui-badge>
                
                <uui-icon-registry-essential>
                  <uui-action-bar>

                    <uui-button look="primary" color="default" label="Edit" href=${this._modalRoute?.({ key: node.key })}>
                      <uui-icon name="edit"></uui-icon>
                    </uui-button>

                    <uui-button look="primary" color="default" label="Add" @click=${() =>this.addNodeToTree(node)}>
                      <uui-icon name="add"></uui-icon>
                    </uui-button>

                    <uui-button look="primary" color="default" label="Delete" @click=${() => this.deleteNode(node.key)}>
                      <uui-icon name="delete"></uui-icon>
                    </uui-button>

                  </uui-action-bar>
                </uui-icon-registry-essential>
            </div>
        </div>

        ${node.items && node.items.length > 0 ? html`
            <div class="node-children">
            ${node.items.map((child) => this.renderTreeNode(child, node, level + 1))}
            </div>
        `: ''}
        <div class="drop-zone after"></div>
      </div>
    `;
    }
    
    generateGUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    handleDragStart(event: DragEvent, node: TreeNode) {
        this.shadowRoot?.querySelector('.draggable-tree')?.classList.add("dragging");
        if (event.dataTransfer && !event.dataTransfer.getData('text/plain')) {
            const draggedData = {
                key: this.generateGUID(),
                oldKey: node.key,
                name: node.name,
                items: node.items || [],
                properties: node.properties || {},
            };

            event.dataTransfer.setData('text/plain', JSON.stringify(draggedData));
        }
    }

    getParentNode(node: TreeNode, tree: TreeNode[]): TreeNode | null {
        for (const item of tree) {
            if (item.items && item.items.includes(node)) {
                return item;
            } else if (item.items) {
                const parent = this.getParentNode(node, item.items);
                if (parent) {
                    return parent;
                }
            }
        }
        return null;
    }

    handleDragOver(event: DragEvent) {
        event.preventDefault();
        if (event.target)
            (event.target as Element).classList.add('drag-over');
    }

    handleDragLeave(event: DragEvent) {
        if (event.target)
            (event.target as Element).classList.remove('drag-over');
    }

    handleDragEnd(event: DragEvent) {
        this.shadowRoot?.querySelector('.draggable-tree')?.classList.remove("dragging");
        this.#dragClean(event);
        this.#onChange();
    }

    #dragClean(event: DragEvent) {
        try {
            Array.from(this.shadowRoot?.querySelectorAll('.drag-over') || []).forEach(x => {
                x.classList.remove("drag-over");
            });
        } catch { }

        if (event && event.dataTransfer)
            event.dataTransfer.clearData();
    }

    findNodeById(key: string, tree = this.treeData): TreeNode | null {
        if (!tree || !key) {
            return null;
        }

        for (const node of tree) {
            if (node.key === key) {
                return node;
            }

            if (node.items) {
                const foundNode = this.findNodeById(key, node.items);
                if (foundNode) {
                    return foundNode;
                }
            }
        }

        return null;
    }

    isDescendantOrSelf(parent: TreeNode, key: string) {
        if (!parent || !key) {
            return false;
        }
        if (parent.key == key || parent.oldKey == key) {
            return true;
        }
        if (parent.items) {
            for (const child of parent.items) {
                if (child.oldKey === key || child.key === key) {
                    return true;
                }
                if (this.isDescendantOrSelf(child, key)) {
                    return true;
                }
            }
        }
        return false;
    }

    handleDrop(event: DragEvent, dropNode: TreeNode, parentNode: TreeNode | null) {
        event.preventDefault();
        event.stopPropagation();

        if (dropNode && this._levels && dropNode.level >= this._levels - 1)
        {
            this.requestUpdate();
            return;
        }

        //Reursive loop throught dropNode.items and check level
        const checkLevels = this.#checkLevels(dropNode);


        const draggedData = event.dataTransfer != null ? JSON.parse(event.dataTransfer.getData('text/plain')) : {};
        const isDescendantOrSelf = this.isDescendantOrSelf(draggedData, dropNode.key);

        if (event.currentTarget == undefined || isDescendantOrSelf) {
            this.requestUpdate();
            return;
        }

        

        const eventTarget = (event.target as Element);
        const isDropZone = eventTarget.classList.contains("drop-zone") ?? false;
        const target = eventTarget.closest('.tree-node');

        if (target == null || target.parentElement == null) {

            return;
        }

        let parent: TreeNode | null = null;
        const findParent = (node: TreeNode, tree: TreeNode[]): TreeNode | null => {
            for (let i = 0; i < tree.length; i++) {
                if (tree[i].key === draggedData.oldKey) {
                    return parent;
                }
                if (tree[i].items) {
                    parent = tree[i];
                    const found = findParent(node, tree[i].items);
                    if (found) return found;
                }
            }
            return null;
        };

        findParent(draggedData, this.treeData);

        const checkTarget = (node: TreeNode, tree: TreeNode[]): TreeNode | null => {
            for (let i = 0; i < tree.length; i++) {
                if (tree[i].key === draggedData.oldKey) {
                    return parent;
                }
                if (tree[i].items) {
                    parent = tree[i];
                    const found = findParent(node, tree[i].items);
                    if (found) return found;
                }
            }
            return null;
        };

        checkTarget(draggedData, this.treeData);

        // Determine the position where the node should be inserted (before or after siblings)
        const index = [...target.parentElement.children].indexOf(target);
        const position = eventTarget.classList.contains('before') ? 'before' : 'after';;

        let dropTarget = isDropZone ? parentNode : dropNode;

        // Add dragged node as a child of the drop node
        if (dropTarget != null && !dropTarget.items) {
            dropTarget.items = [];
        }

        var targetList = dropTarget == null ? this.treeData : dropTarget.items;
        draggedData.level = dropTarget == null ? 0 : dropTarget.level + 1;

        if (!targetList) {
            return;
        }

        if (position === "before") {
            targetList.splice(index, 0, draggedData);
        } else {
            targetList.splice(index + 1, 0, draggedData);
        }
        
        this.removeNodeFromTree(draggedData.oldKey, this.treeData);
        this.build();
    }

    removeNodeFromTree(key: string, tree = this.treeData) {
        tree.forEach((node, index) => {
            if (node.key === key) {
                tree.splice(index, 1);

                this.requestUpdate();

                return true;
            }
            if (node.items && this.removeNodeFromTree(key, node.items)) {
                return true;
            }
        });

        return false;
    }

    build() {
        this.#setLevels();
        this.requestUpdate();
        this.#onChange();
    }

    deleteNode(key: string) {
        this.removeNodeFromTree(key);
        this.build();
    }

    #checkLevels(node: TreeNode): boolean {
        if (this._levels === undefined) return false;
        if (node.level >= this._levels) {
            return true;
        }
        if (node.items) {
            
            for (const child of node.items) {
                if (this.#checkLevels(child)) {
                    return true;
                }
            }
        }
        return false;

    }

    #setLevels() {
        const setLevelsRecursive = (list: TreeNode[], depth: number) => {
            for (let i = 0; i < list.length; i++) {
                list[i].level = depth;
                if (list[i].items && list[i].items.length > 0) {
                    setLevelsRecursive(list[i].items, depth + 1);
                }
            }
        };

        setLevelsRecursive(this.treeData, 0);
    }

    addNodeToTree(parentNode?: TreeNode) {

        if (parentNode) {
            if (this._levels && parentNode.level >= this._levels - 1) {
                this.requestUpdate();
                return;
            }

            if (!parentNode.items) {
                parentNode.items = [];
            }
        } else {
            // Ensure _value is extensible
            this.treeData = [...this.treeData];
        }

        const newNode: TreeNode = {
            key: this.generateGUID(),
            name: "Item",
            level: parentNode ? parentNode.level + 1 : 0,
            items: []
        };

        if (parentNode) {
            parentNode.items.push(newNode);
        } else {
            this.treeData.push(newNode);
        }

        this.build();
    }

    //async editNode(node?: TreeNode) {
    //    if (!node) {
    //        return;
    //    }

    //    const customContext = this._modalContext?.open(this, TREE_ITEM_EDITOR_MODAL_TOKEN, {
    //        data: {
    //            doctype: this._doctype,
    //            data: node.properties ?? {}
    //        }
    //    });

    //    const data = await customContext?.onSubmit();

    //    this.#setLevels();
    //    this.#onChange();

    //    if (!data) return;

    //}

    #onChange() {
        this._value = { items: structuredClone(this.treeData) } as TreeNode;
        this.dispatchEvent(new UmbPropertyValueChangeEvent());
    }
}

export { SimpleTreeMenuElement as element };

declare global {
    interface HTMLElementTagNameMap {
        [ELEMENT_NAME]: SimpleTreeMenuElement
    }
}
