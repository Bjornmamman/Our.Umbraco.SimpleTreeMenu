import { html as b, css as $, state as g, property as x, customElement as L } from "@umbraco-cms/backoffice/external/lit";
import { UmbPropertyValueChangeEvent as I } from "@umbraco-cms/backoffice/property-editor";
import { UmbModalToken as U } from "@umbraco-cms/backoffice/modal";
import { UmbModalRouteRegistrationController as M } from "@umbraco-cms/backoffice/router";
import { UmbLitElement as N } from "@umbraco-cms/backoffice/lit-element";
import { i as P, r as R } from "./element-types.js";
const q = new U(
  "treeitem.editor.modal",
  {
    modal: {
      type: "sidebar",
      size: "medium"
    }
  }
);
var C = Object.defineProperty, B = Object.getOwnPropertyDescriptor, E = (e) => {
  throw TypeError(e);
}, l = (e, t, r, a) => {
  for (var i = a > 1 ? void 0 : a ? B(t, r) : t, d = e.length - 1, c; d >= 0; d--)
    (c = e[d]) && (i = (a ? c(t, r, i) : c(i)) || i);
  return a && i && C(t, r, i), i;
}, K = (e, t, r) => t.has(e) || E("Cannot " + r), G = (e, t, r) => t.has(e) ? E("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), p = (e, t, r) => (K(e, t, "access private method"), r), u, z, S, w, _;
const V = "simpletreemenu-list";
let o = class extends N {
  //private _modalContext?: UmbModalManagerContext;
  constructor() {
    super(), G(this, u), this.treeData = [], this._value = {}, this._dragging = !1, this._doctype = "MenuNode", this._testData = { headline: "hehe" }, this._testFormat = "{=headline}", this.editModal = new M(
      this,
      q
    ).addAdditionalPath(":key").addUniquePaths(["propertyAlias", "variantId"]).onSetup((e) => {
      let t = this.findNodeById(e.key);
      return {
        data: {
          doctype: this._doctype,
          key: e.key,
          data: (t == null ? void 0 : t.properties) ?? {},
          properties: (t == null ? void 0 : t.properties) ?? {}
        },
        value: { value: (t == null ? void 0 : t.properties) ?? {} }
      };
    }).onSubmit((e) => {
      var r;
      if (!e || !e.value) return;
      let t = this.findNodeById((r = this.editModal.modalContext) == null ? void 0 : r.data.key);
      t && (t.properties = e.value), this.requestUpdate(), p(this, u, _).call(this);
    }).observeRouteBuilder((e) => {
      this._modalRoute = e;
    });
  }
  set value(e) {
    typeof e == "string" ? this._value = JSON.parse(e) : typeof e == "object" ? this._value = e : this._value = {};
  }
  get value() {
    return this._value;
  }
  set alias(e) {
    this.editModal.setUniquePathValue("propertyAlias", e);
  }
  set variantId(e) {
    this.editModal.setUniquePathValue("variantId", e == null ? void 0 : e.toString());
  }
  set config(e) {
    this._doctype = (e == null ? void 0 : e.getValueByAlias("doctype")) ?? "MenuNode", this._nameTemplate = e == null ? void 0 : e.getValueByAlias("nameTemplate"), this._levels = parseInt((e == null ? void 0 : e.getValueByAlias("levels")) ?? "5", 10), p(this, u, z).call(this, this._doctype), this.value && this.value.items ? this.treeData = JSON.parse(JSON.stringify(this.value.items)) : this.treeData = [];
  }
  render() {
    return b`
            <div class="draggable-tree">
                ${this.treeData.map((e) => this.renderTreeNode(e, null, 0))}
                <uui-button class="add-new" look="placeholder" color="default" label=${this.localize.term("general_add")} title=${this.localize.term("general_add")} @click=${() => this.addNodeToTree()}>
                    <umb-localize key='general_add'></umb-localize>
                </uui-button>

            </div>
        `;
  }
  static get properties() {
    return {
      treeData: { type: Array },
      dragOverIndex: { type: Number }
    };
  }
  renderTreeNode(e, t, r) {
    var a;
    return b`
      <div
        class="tree-node"
        @dragover=${(i) => this.handleDragOver(i)}
        @dragleave=${(i) => this.handleDragLeave(i)}
        @drop=${(i) => this.handleDrop(i, e, t)}
        @dragend=${(i) => this.handleDragEnd(i)}
        draggable="true"
        @dragstart=${(i) => this.handleDragStart(i, e)}
      >
        <div class="drop-zone before"></div>
        <div class="node-handle">
            <h1><umb-ufm-render inline .markdown="${this._nameTemplate}" .value=${e.properties}></umb-ufm-render></h1>
            
            <div class="node-settings">
                ${e.items && e.items.length > 0 ? b`
                    <uui-badge style="--uui-badge-position: relative; --uui-badge-inset: 0" look="secondary" color="default">${e.items.length} children</uui-badge>
                ` : ""}
                <uui-badge style="--uui-badge-position: relative; --uui-badge-inset: 0" look="secondary" color="default">Level ${e.level + 1} of ${this._levels}</uui-badge>
                
                <uui-icon-registry-essential>
                  <uui-action-bar>

                    <uui-button look="primary" color="default" label="Edit" href=${(a = this._modalRoute) == null ? void 0 : a.call(this, { key: e.key })}>
                      <uui-icon name="edit"></uui-icon>
                    </uui-button>

                    <uui-button look="primary" color="default" label="Add" @click=${() => this.addNodeToTree(e)}>
                      <uui-icon name="add"></uui-icon>
                    </uui-button>

                    <uui-button look="primary" color="default" label="Delete" @click=${() => this.deleteNode(e.key)}>
                      <uui-icon name="delete"></uui-icon>
                    </uui-button>

                  </uui-action-bar>
                </uui-icon-registry-essential>
            </div>
        </div>

        ${e.items && e.items.length > 0 ? b`
            <div class="node-children">
            ${e.items.map((i) => this.renderTreeNode(i, e, r + 1))}
            </div>
        ` : ""}
        <div class="drop-zone after"></div>
      </div>
    `;
  }
  generateGUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(e) {
      const t = Math.random() * 16 | 0;
      return (e == "x" ? t : t & 3 | 8).toString(16);
    });
  }
  handleDragStart(e, t) {
    var r, a, i;
    if (e.stopPropagation(), (a = (r = this.shadowRoot) == null ? void 0 : r.querySelector(".draggable-tree")) == null || a.classList.add("dragging"), console.log("DRAGING START"), (i = e.currentTarget) == null || i.classList.add("dragging"), e.dataTransfer && !e.dataTransfer.getData("text/plain")) {
      const d = {
        key: this.generateGUID(),
        oldKey: t.key,
        name: t.name,
        contentTypeAlias: t.contentTypeAlias ?? this._doctype,
        items: t.items || [],
        properties: t.properties || {}
      };
      e.dataTransfer.setData("text/plain", JSON.stringify(d));
    }
  }
  getParentNode(e, t) {
    for (const r of t) {
      if (r.items && r.items.includes(e))
        return r;
      if (r.items) {
        const a = this.getParentNode(e, r.items);
        if (a)
          return a;
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
    var t, r, a;
    (r = (t = this.shadowRoot) == null ? void 0 : t.querySelector(".draggable-tree")) == null || r.classList.remove("dragging"), (a = e.currentTarget) == null || a.classList.remove("dragging"), p(this, u, S).call(this, e), p(this, u, _).call(this);
  }
  findNodeById(e, t = this.treeData) {
    if (!t || !e)
      return null;
    for (const r of t) {
      if (r.key === e)
        return r;
      if (r.items) {
        const a = this.findNodeById(e, r.items);
        if (a)
          return a;
      }
    }
    return null;
  }
  isDescendantOrSelf(e, t) {
    if (!e || !t)
      return !1;
    if (e.key == t || e.oldKey == t)
      return !0;
    if (e.items) {
      for (const r of e.items)
        if (r.oldKey === t || r.key === t || this.isDescendantOrSelf(r, t))
          return !0;
    }
    return !1;
  }
  handleDrop(e, t, r) {
    e.preventDefault(), e.stopPropagation();
    const a = e.dataTransfer != null ? JSON.parse(e.dataTransfer.getData("text/plain")) : {}, i = this.isDescendantOrSelf(a, t.key);
    if (e.currentTarget == null || i) {
      this.requestUpdate();
      return;
    }
    const d = e.target, c = d.classList.contains("drop-zone") ?? !1, f = d.closest(".tree-node");
    if (f == null || f.parentElement == null)
      return;
    const O = c ? (t == null ? void 0 : t.level) - 1 : t == null ? void 0 : t.level;
    if (this._levels !== void 0 && O >= this._levels - 1) {
      this.requestUpdate();
      return;
    }
    let v = null;
    const D = (T, n) => {
      for (let s = 0; s < n.length; s++) {
        if (n[s].key === a.oldKey)
          return v;
        if (n[s].items) {
          v = n[s];
          const m = D(T, n[s].items);
          if (m) return m;
        }
      }
      return null;
    };
    D(a, this.treeData), ((T, n) => {
      for (let s = 0; s < n.length; s++) {
        if (n[s].key === a.oldKey)
          return v;
        if (n[s].items) {
          v = n[s];
          const m = D(T, n[s].items);
          if (m) return m;
        }
      }
      return null;
    })(a, this.treeData);
    const k = [...f.parentElement.children].indexOf(f), A = d.classList.contains("before") ? "before" : "after";
    let h = c ? r : t;
    h != null && !h.items && (h.items = []);
    var y = h == null ? this.treeData : h.items;
    a.level = h == null ? 0 : h.level + 1, y && (c ? A === "before" ? y.splice(k, 0, a) : y.splice(k + 1, 0, a) : y.push(a), this.removeNodeFromTree(a.oldKey, this.treeData), this.build());
  }
  removeNodeFromTree(e, t = this.treeData) {
    return t.forEach((r, a) => {
      if (r.key === e)
        return t.splice(a, 1), this.requestUpdate(), !0;
      if (r.items && this.removeNodeFromTree(e, r.items))
        return !0;
    }), !1;
  }
  build() {
    p(this, u, w).call(this), this.requestUpdate(), p(this, u, _).call(this);
  }
  deleteNode(e) {
    this.removeNodeFromTree(e), this.build();
  }
  addNodeToTree(e) {
    if (e) {
      if (this._levels && e.level >= this._levels - 1) {
        this.requestUpdate();
        return;
      }
      e.items || (e.items = []);
    } else
      this.treeData = [...this.treeData];
    const t = {
      key: this.generateGUID(),
      name: "Item",
      contentTypeAlias: this._doctype,
      level: e ? e.level + 1 : 0,
      items: []
    };
    e ? e.items.push(t) : this.treeData.push(t), this.build();
  }
};
u = /* @__PURE__ */ new WeakSet();
z = async function(e) {
  if (P(e))
    return;
  const t = await R(e);
  t && this._doctype === e && (this._doctype = t.id);
};
S = function(e) {
  var t;
  try {
    Array.from(((t = this.shadowRoot) == null ? void 0 : t.querySelectorAll(".drag-over")) || []).forEach((r) => {
      r.classList.remove("drag-over");
    });
  } catch {
  }
  e && e.dataTransfer && e.dataTransfer.clearData();
};
w = function() {
  const e = (t, r) => {
    for (let a = 0; a < t.length; a++)
      t[a].level = r, t[a].key == null && (t[a].key = this.generateGUID()), t[a].contentTypeAlias == null && (t[a].contentTypeAlias = this._doctype), t[a].items && t[a].items.length > 0 && e(t[a].items, r + 1);
  };
  e(this.treeData, 0);
};
_ = function() {
  this._value = { items: structuredClone(this.treeData) }, this.dispatchEvent(new I());
};
o.styles = $`
        .tree-node {
            padding-left: 10px;
            cursor: pointer;
            //background: rgb(0 0 0 / 4%);
            border-radius: var(--uui-border-radius);
            margin: 3px 0;
        }

        .tree-node .node-handle:hover {
            outline: solid 1px var(--uui-color-border);
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

        .tree-node.dragging .node-handle {
            --uui-color-current: var(--uui-color-surface-alt);
            filter: grayscale(1);
        }

        .tree-node.dragging .node-handle h1 {
            opacity: 0.4;
        }

        .tree-node.dragging .node-handle .node-settings {
            opacity: 0.4;
            filter: grayscale(1);
        }



        .add-new {
            width: 100%;
        }

        .add-new:not(:first-child) {
            margin-top:  var(--uui-size-6);
        }
    `;
l([
  g()
], o.prototype, "treeData", 2);
l([
  g()
], o.prototype, "_dragging", 2);
l([
  g()
], o.prototype, "_modalRoute", 2);
l([
  g()
], o.prototype, "_doctype", 2);
l([
  g()
], o.prototype, "_nameTemplate", 2);
l([
  g()
], o.prototype, "_levels", 2);
l([
  x({ type: Object })
], o.prototype, "value", 1);
l([
  x()
], o.prototype, "alias", 1);
l([
  x()
], o.prototype, "variantId", 1);
l([
  x({ attribute: !1 })
], o.prototype, "config", 1);
o = l([
  L(V)
], o);
export {
  o as SimpleTreeMenuElement,
  o as element
};
//# sourceMappingURL=simpletreemenu.element.js.map
