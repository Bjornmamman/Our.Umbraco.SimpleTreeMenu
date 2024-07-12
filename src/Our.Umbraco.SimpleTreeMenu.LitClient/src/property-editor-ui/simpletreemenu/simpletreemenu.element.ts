import { html, css, customElement, property, state } from "@umbraco-cms/backoffice/external/lit";
import type { UmbPropertyEditorUiElement } from "@umbraco-cms/backoffice/extension-registry";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { UmbPropertyEditorConfigCollection } from "@umbraco-cms/backoffice/property-editor";
import { UMB_MODAL_MANAGER_CONTEXT, UmbModalManagerContext } from "@umbraco-cms/backoffice/modal";
import { TREE_ITEM_EDITOR_MODAL_TOKEN } from "../../dialogs/treeitemeditor/treeitemeditor.token";
import { UmbModalRouteRegistrationController } from "@umbraco-cms/backoffice/router";


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

    @property({ type: String })
    public value = "";

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
                    },
                    value: node?.properties ?? {}
                };
            })
            .onSubmit((value) => {
                if (!value) return;

                let node = this.findNodeById(this.editModal.modalContext?.data.key);
                console.log("SUBMITVALUE", value);
                if (node)
                    node.properties = value as object;
            })
            .observeRouteBuilder((routeBuilder) => {
                this._modalRoute = routeBuilder;
            });
        
    }

    treeData: TreeNode[] = [
        {
            key: '00000000-0000-0000-0000-000000000001',
            level: 0,
            name: 'test',
            properties: {},
            items: [
                {
                    key: '00000000-0000-0000-0000-000000000002',
                    name: 'child1',
                    properties: {},
                    items:[],
                    level: 1
                },
                {
                    key: '00000000-0000-0000-0000-000000000003',
                    name: 'child2',
                    properties: {},
                    items: [],
                    level: 1
                }, {
                    key: '00000000-0000-0000-0000-000000000004',
                    name: 'child3',
                    properties: {},
                    items: [],
                    level: 1
                }, {
                    key: '00000000-0000-0000-0000-000000000005',
                    name: 'child4',
                    properties: {},
                    items: [],
                    level: 1
                }
            ]
        },
        {
            key: '00000000-0000-0000-0000-000000000010',
            name: 'test2',
            properties: {},
            items: [],
            level: 0
        }
    ];

    render() {
        return html`
            <div class="draggable-tree">
                ${this.treeData.map((node) => this.renderTreeNode(node, null, 0))}

                <uui-button class="add-new" look="primary" color="default" label="Add" @click=${() => this.addNodeToTree()}>
                    <uui-icon name="add"></uui-icon>
                </uui-button>

                <umb-property-dataset .value=${{ }}>
					<umb-property
						label="test"
						description="test"
						alias="test"
						.config=${[]}
						property-editor-ui-alias="Umb.PropertyEditorUi.MultiUrlPicker"></umb-property>
				</umb-property-dataset>
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
      
        .tree-node .drop-zone.drag-over, .tree-node .node-handle.drag-over {
            background-color: var(--uui-color-current) !important;
        }

        .draggable-tree.dragging .drop-zone {
            background-color: var(--uui-palette-white-dark);
            height: 10px;
            margin: 3px 0;
        }



        .add-new {
            margin-top:  var(--uui-size-6)
        }
    `

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
            <h1>${node.name}</h1>

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

                    <uui-button look="primary" color="default" label="Delete" @click=${() => this.removeNodeFromTree(node.key)}>
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
                items: node.items || []
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
        this.dragClean(event);
    }

    dragClean(event: DragEvent) {
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

    addNodeToTreeKey(key: string) {
        var parentNode = this.findNodeById(key);

        if (parentNode == null) {
            return;
        }

        this.addNodeToTree(parentNode);
    }

    addNodeToTree(parentNode?: TreeNode) {
        console.log("ADD");
        if (parentNode && !parentNode.items)
            parentNode.items = [];

        (parentNode ? parentNode.items : this.treeData)?.push(<TreeNode>{
            key: this.generateGUID(),
            name: "Item",
            level: parentNode ? parentNode.level + 1 : 0,
        });

        this.requestUpdate();
    }

    async editNode(node?: TreeNode) {
        if (!node) {
            return;
        }

        const customContext = this._modalContext?.open(this, TREE_ITEM_EDITOR_MODAL_TOKEN, {
            data: {
                headline: 'A Custom modal',
                doctype: this._doctype,
                data: node.properties ?? {}
            }
        });

        const data = await customContext?.onSubmit();

        if (!data) return;

        console.log('data', data);
    }
}

export { SimpleTreeMenuElement as element };

declare global {
    interface HTMLElementTagNameMap {
        [ELEMENT_NAME]: SimpleTreeMenuElement
    }
}
