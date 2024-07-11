import { html as h, css as E, property as T, state as x, customElement as N } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as O } from "@umbraco-cms/backoffice/lit-element";
var z = Object.defineProperty, _ = Object.getOwnPropertyDescriptor, u = (e, r, a, t) => {
  for (var n = t > 1 ? void 0 : t ? _(r, a) : r, o = e.length - 1, c; o >= 0; o--)
    (c = e[o]) && (n = (t ? c(r, a, n) : c(n)) || n);
  return t && n && z(r, a, n), n;
};
const S = "simpletreemenu-list";
let l = class extends O {
  constructor() {
    super(...arguments), this.value = "", this.treeData = [
      {
        key: "00000000-0000-0000-0000-000000000001",
        level: 0,
        name: "test",
        items: [
          {
            key: "00000000-0000-0000-0000-000000000002",
            name: "child1",
            level: 1
          },
          {
            key: "00000000-0000-0000-0000-000000000003",
            name: "child2",
            level: 1
          },
          {
            key: "00000000-0000-0000-0000-000000000004",
            name: "child3",
            level: 1
          },
          {
            key: "00000000-0000-0000-0000-000000000005",
            name: "child4",
            level: 1
          }
        ]
      },
      {
        key: "00000000-0000-0000-0000-000000000010",
        name: "test2",
        level: 0
      }
    ];
  }
  set config(e) {
    this._doctype = (e == null ? void 0 : e.getValueByAlias("doctype")) ?? "MenuNode", this._nameTemplate = e == null ? void 0 : e.getValueByAlias("nameTemplate"), this._levels = parseInt((e == null ? void 0 : e.getValueByAlias("levels")) ?? "5", 10);
  }
  render() {
    return h`
            <div class="draggable-tree">
                ${this.treeData.map((e) => this.renderTreeNode(e, null, 0))}
            </div>
        `;
  }
  static get properties() {
    return {
      treeData: { type: Array },
      dragOverIndex: { type: Number }
    };
  }
  renderTreeNode(e, r, a) {
    return h`
      <div
        class="tree-node"
        @dragover=${(t) => this.handleDragOver(t)}
        @dragleave=${(t) => this.handleDragLeave(t)}
        @drop=${(t) => this.handleDrop(t, e, r)}
        @dragend=${(t) => this.handleDragEnd(t)}
        draggable="true"
        @dragstart=${(t) => this.handleDragStart(t, e)}
      >
        <div class="drop-zone before"></div>
        <div class="node-handle">
            <h1>${e.name}</h1>

            <div class="node-settings">
                ${e.items && e.items.length > 0 ? h`
                    <uui-badge style="--uui-badge-position: relative; --uui-badge-inset: 0" look="secondary" color="default">${e.items.length} children</uui-badge>
                ` : ""}
                <uui-badge style="--uui-badge-position: relative; --uui-badge-inset: 0" look="secondary" color="default">Level ${e.level + 1} of 3</uui-badge>
                
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

        ${e.items && e.items.length > 0 ? h`
            <div class="node-children">
            ${e.items.map((t) => this.renderTreeNode(t, e, a + 1))}
            </div>
        ` : ""}
        <div class="drop-zone after"></div>
      </div>
    `;
  }
  generateGUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(e) {
      const r = Math.random() * 16 | 0;
      return (e == "x" ? r : r & 3 | 8).toString(16);
    });
  }
  handleDragStart(e, r) {
    if (e.dataTransfer && !e.dataTransfer.getData("text/plain")) {
      const a = {
        key: this.generateGUID(),
        oldKey: r.key,
        name: r.name,
        items: r.items || []
      };
      console.log(a), e.dataTransfer.setData("text/plain", JSON.stringify(a));
    }
  }
  getParentNode(e, r) {
    for (const a of r) {
      if (a.items && a.items.includes(e))
        return a;
      if (a.items) {
        const t = this.getParentNode(e, a.items);
        if (t)
          return t;
      }
    }
    return null;
  }
  handleDragOver(e) {
    e.preventDefault(), e.target && e.target.classList.add("drag-over");
  }
  handleDragLeave(e) {
    e.target && e.target.classList.remove("drag-over");
  }
  handleDragEnd(e) {
    this.dragClean(e);
  }
  dragClean(e) {
    var r;
    try {
      Array.from(((r = this.shadowRoot) == null ? void 0 : r.querySelectorAll(".drag-over")) || []).forEach((a) => {
        a.classList.remove("drag-over");
      });
    } catch {
    }
    e && e.dataTransfer && e.dataTransfer.clearData();
  }
  findNodeById(e, r) {
    if (!e || !r)
      return null;
    for (const a of e) {
      if (a.key === r)
        return a;
      if (a.items) {
        const t = this.findNodeById(a.items, r);
        if (t)
          return t;
      }
    }
    return null;
  }
  isDescendantOrSelf(e, r) {
    if (!e || !r)
      return !1;
    if (e.key == r || e.oldKey == r)
      return !0;
    if (e.items) {
      for (const a of e.items)
        if (a.oldKey === r || a.key === r || this.isDescendantOrSelf(a, r))
          return !0;
    }
    return !1;
  }
  handleDrop(e, r, a) {
    e.preventDefault(), e.stopPropagation();
    const t = e.dataTransfer != null ? JSON.parse(e.dataTransfer.getData("text/plain")) : {}, n = this.isDescendantOrSelf(t, r.key);
    if (e.currentTarget == null || n) {
      this.requestUpdate();
      return;
    }
    const o = e.target, c = o.classList.contains("drop-zone") ?? !1, f = o.closest(".tree-node");
    if (f == null || f.parentElement == null)
      return;
    let g = null;
    const v = (p, s) => {
      for (let i = 0; i < s.length; i++) {
        if (s[i].key === t.oldKey)
          return g;
        if (s[i].items) {
          g = s[i];
          const m = v(p, s[i].items);
          if (m) return m;
        }
      }
      return null;
    };
    v(t, this.treeData), ((p, s) => {
      for (let i = 0; i < s.length; i++) {
        if (s[i].key === t.oldKey)
          return g;
        if (s[i].items) {
          g = s[i];
          const m = v(p, s[i].items);
          if (m) return m;
        }
      }
      return null;
    })(t, this.treeData);
    const b = [...f.parentElement.children].indexOf(f), k = o.classList.contains("before") ? "before" : "after";
    let d = c ? a : r;
    d != null && !d.items && (d.items = []);
    var y = d == null ? this.treeData : d.items;
    if (t.level = d == null ? 0 : d.level + 1, !y)
      return;
    k === "before" ? y.splice(b, 0, t) : y.splice(b + 1, 0, t), console.log("REMOVE", t.oldKey);
    const D = (p, s) => {
      console.log("TREE", s);
      for (let i = 0; i < s.length; i++) {
        if (console.log(s[i].key, t.oldKey, s[i].key === t.oldKe), s[i].key === t.oldKey)
          return s.splice(i, 1), !0;
        if (s[i].items && D(p, s[i].items))
          return !0;
      }
      return !1;
    };
    console.log(this.treeData), D(t, this.treeData), this.requestUpdate();
  }
  removeNodeFromTree(e, r = this.treeData) {
    r.forEach((a, t) => {
      if (a === e) {
        r.splice(t, 1);
        return;
      }
      a.items && this.removeNodeFromTree(e, a.items);
    });
  }
};
l.styles = E`
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
    `;
u([
  T({ type: String })
], l.prototype, "value", 2);
u([
  x()
], l.prototype, "_doctype", 2);
u([
  x()
], l.prototype, "_nameTemplate", 2);
u([
  x()
], l.prototype, "_levels", 2);
u([
  T({ attribute: !1 })
], l.prototype, "config", 1);
l = u([
  N(S)
], l);
export {
  l as SimpleTreeMenuElement,
  l as element
};
//# sourceMappingURL=simpletreemenu.element.js.map
