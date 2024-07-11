import { html, css, customElement, property, state } from "@umbraco-cms/backoffice/external/lit";
import type { UmbPropertyEditorUiElement } from "@umbraco-cms/backoffice/extension-registry";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { UmbPropertyEditorConfigCollection } from "@umbraco-cms/backoffice/property-editor";


const ELEMENT_NAME = 'simpletreemenu-list';

interface TreeNode {
    key: string,
    name: string,
    oldKey?: string,
    level: number,
    items?: TreeNode[]
}

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement(ELEMENT_NAME)
export class SimpleTreeMenuElement extends UmbLitElement implements UmbPropertyEditorUiElement {

    @property({ type: String })
    public value = "";

    @state()
    _doctype?: string;

    @state()
    _nameTemplate?: string;

    @state()
    _levels?: number;

    @property({ attribute: false })
    public set config(config: UmbPropertyEditorConfigCollection | undefined) {
        this._doctype = config?.getValueByAlias('doctype') ?? 'MenuNode';
        this._nameTemplate = config?.getValueByAlias('nameTemplate');
        this._levels = parseInt(config?.getValueByAlias('levels') ?? '5', 10);
    }

    treeData: TreeNode[] = [
        {
            key: '00000000-0000-0000-0000-000000000001',
            level: 0,
            name: 'test',
            items: [
                {
                    key: '00000000-0000-0000-0000-000000000002',
                    name: 'child1',
                    level: 1
                },
                {
                    key: '00000000-0000-0000-0000-000000000003',
                    name: 'child2',
                    level: 1
                }, {
                    key: '00000000-0000-0000-0000-000000000004',
                    name: 'child3',
                    level: 1
                }, {
                    key: '00000000-0000-0000-0000-000000000005',
                    name: 'child4',
                    level: 1
                }
            ]
        },
        {
            key: '00000000-0000-0000-0000-000000000010',
            name: 'test2',
            level: 0
        }
    ];

    render() {
        return html`
            <div class="draggable-tree">
                ${this.treeData.map((node) => this.renderTreeNode(node, null, 0))}
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
        }

        h1 {
            font-size: var(--uui-type-h5-size);
            margin: 0;
        }
      
        .tree-node:not(:last-child) >.drop-zone.after {
            display:none;
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
            min-height: 10px;
            border-radius: 3px;
        }

        .tree-node > .node-children:has( > .tree-node > .drop-zone.drag-over) {
            //background-color: var(--uui-palette-spanish-pink-dimmed) !important;
            outline: dashed 2px var(--uui-palette-spanish-pink-dimmed);
        }
      
        .tree-node .drop-zone.drag-over, .tree-node .node-handle.drag-over {
            background-color: var(--uui-color-current) !important;
        }

        .tree-node .node-handle.drag-over {
            outline: dashed 2px var(--uui-palette-spanish-pink-dimmed);
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

                    <uui-button look="primary" color="default" label="Edit">
                      <uui-icon name="edit"></uui-icon>
                    </uui-button>

                    <uui-button look="primary" color="default" label="Add">
                      <uui-icon name="add"></uui-icon>
                    </uui-button>

                    <uui-button look="primary" color="default" label="Delete">
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

        if (event.dataTransfer && !event.dataTransfer.getData('text/plain')) {
            const draggedData = {
                key: this.generateGUID(),
                oldKey: node.key,
                name: node.name,
                items: node.items || []
            };

            console.log(draggedData);

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

    findNodeById(tree: TreeNode[], key: string): TreeNode | null {
        if (!tree || !key) {
            return null;
        }

        for (const node of tree) {
            if (node.key === key) {
                return node;
            }

            if (node.items) {
                const foundNode = this.findNodeById(node.items, key);
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

        console.log("REMOVE", draggedData.oldKey);
        // Remove dragged node from its original position
        const removeNode = (node: TreeNode, tree: TreeNode[]) => {
            console.log("TREE", tree);            
            for (let i = 0; i < tree.length; i++) {
                console.log(tree[i].key, draggedData.oldKey, tree[i].key === draggedData.oldKe);
                if (tree[i].key === draggedData.oldKey) {
                    tree.splice(i, 1);
                    return true;
                    console.log("REMOVED", i, tree[i].key, draggedData.oldKey, tree[i].key === draggedData.oldKe);
                }
                if (tree[i].items && removeNode(node, tree[i].items)) {
                    return true;
                }
            }

            return false;
        };
        console.log(this.treeData);
        removeNode(draggedData, this.treeData);


        this.requestUpdate();
    }

    removeNodeFromTree(nodeToRemove: TreeNode, tree = this.treeData) {
        tree.forEach((node, index) => {
            if (node === nodeToRemove) {
                tree.splice(index, 1);
                return;
            }
            if (node.items) {
                this.removeNodeFromTree(nodeToRemove, node.items);
            }
        });
    }
    
}

export { SimpleTreeMenuElement as element };

declare global {
    interface HTMLElementTagNameMap {
        [ELEMENT_NAME]: SimpleTreeMenuElement
    }
}
