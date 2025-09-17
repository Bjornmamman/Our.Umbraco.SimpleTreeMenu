import { html as b, css as w, state as g, property as x, customElement as M } from "@umbraco-cms/backoffice/external/lit";
import { UmbPropertyValueChangeEvent as $ } from "@umbraco-cms/backoffice/property-editor";
import { UmbModalToken as L, UMB_MODAL_MANAGER_CONTEXT as A } from "@umbraco-cms/backoffice/modal";
import { UmbModalRouteRegistrationController as I } from "@umbraco-cms/backoffice/router";
import { UmbLitElement as U } from "@umbraco-cms/backoffice/lit-element";
const P = new L(
  "treeitem.editor.modal",
  {
    modal: {
      type: "sidebar",
      size: "medium"
    }
  }
);
var R = Object.defineProperty, C = Object.getOwnPropertyDescriptor, S = (e) => {
  throw TypeError(e);
}, u = (e, t, r, i) => {
  for (var a = i > 1 ? void 0 : i ? C(t, r) : t, h = e.length - 1, m; h >= 0; h--)
    (m = e[h]) && (a = (i ? m(t, r, a) : m(a)) || a);
  return i && a && R(t, r, a), a;
}, q = (e, t, r) => t.has(e) || S("Cannot " + r), B = (e, t, r) => t.has(e) ? S("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), d = (e, t, r) => (q(e, t, "access private method"), r), l, z, E, _, p;
const J = "simpletreemenu-list";
let o = class extends U {
  constructor() {
    super(), B(this, l), this.treeData = [], this._value = {}, this._dragging = !1, this._doctype = "MenuNode", this._testData = { headline: "hehe" }, this._testFormat = "{=headline}", this.consumeContext(A, (e) => {
      this._modalContext = e;
    }), this.editModal = new I(
      this,
      P
    ).addAdditionalPath(":key").addUniquePaths(["propertyAlias", "variantId"]).onSetup((e) => {
      let t = this.findNodeById(e.key);
      return console.log(t), {
        data: {
          doctype: this._doctype,
          key: e.key,
          properties: (t == null ? void 0 : t.properties) ?? {}
        }
      };
    }).onSubmit((e) => {
      var r;
      if (!e || !e.value) return;
      let t = this.findNodeById((r = this.editModal.modalContext) == null ? void 0 : r.data.key);
      t && (t.properties = e.value), d(this, l, p).call(this);
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
    this._doctype = (e == null ? void 0 : e.getValueByAlias("doctype")) ?? "MenuNode", this._nameTemplate = e == null ? void 0 : e.getValueByAlias("nameTemplate"), this._levels = parseInt((e == null ? void 0 : e.getValueByAlias("levels")) ?? "5", 10), this.value && this.value.items ? this.treeData = JSON.parse(JSON.stringify(this.value.items)) : this.treeData = [];
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
    var i;
    return b`
      <div
        class="tree-node"
        @dragover=${(a) => this.handleDragOver(a)}
        @dragleave=${(a) => this.handleDragLeave(a)}
        @drop=${(a) => this.handleDrop(a, e, t)}
        @dragend=${(a) => this.handleDragEnd(a)}
        draggable="true"
        @dragstart=${(a) => this.handleDragStart(a, e)}
      >
        <div class="drop-zone before"></div>
        <div class="node-handle">
            <h1><umb-ufm-render inline .markdown="${this._nameTemplate}" .value=${e.properties}></umb-ufm-render></h1>
            
            <div class="node-settings">
                ${e.items && e.items.length > 0 ? b`
                    <uui-badge style="--uui-badge-position: relative; --uui-badge-inset: 0" look="secondary" color="default">${e.items.length} children</uui-badge>
                ` : ""}
                <uui-badge style="--uui-badge-position: relative; --uui-badge-inset: 0" look="secondary" color="default">Level ${e.level + 1} of 3</uui-badge>
                
                <uui-icon-registry-essential>
                  <uui-action-bar>

                    <uui-button look="primary" color="default" label="Edit" href=${(i = this._modalRoute) == null ? void 0 : i.call(this, { key: e.key })}>
                      <uui-icon name="edit"></uui-icon>
                    </uui-button>

                    <uui-button look="primary" color="default" label="Add" @click=${() => this.addNodeToTree(e)}>
                      <uui-icon name="add"></uui-icon>
                    </uui-button>

                    <uui-button look="primary" color="default" label="Delete" @click=${() => this.removeNodeFromTree(e.key)}>
                      <uui-icon name="delete"></uui-icon>
                    </uui-button>

                  </uui-action-bar>
                </uui-icon-registry-essential>
            </div>
        </div>

        ${e.items && e.items.length > 0 ? b`
            <div class="node-children">
            ${e.items.map((a) => this.renderTreeNode(a, e, r + 1))}
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
    var r, i;
    if ((i = (r = this.shadowRoot) == null ? void 0 : r.querySelector(".draggable-tree")) == null || i.classList.add("dragging"), e.dataTransfer && !e.dataTransfer.getData("text/plain")) {
      const a = {
        key: this.generateGUID(),
        oldKey: t.key,
        name: t.name,
        items: t.items || [],
        properties: t.properties || {}
      };
      e.dataTransfer.setData("text/plain", JSON.stringify(a));
    }
  }
  getParentNode(e, t) {
    for (const r of t) {
      if (r.items && r.items.includes(e))
        return r;
      if (r.items) {
        const i = this.getParentNode(e, r.items);
        if (i)
          return i;
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
    var t, r;
    (r = (t = this.shadowRoot) == null ? void 0 : t.querySelector(".draggable-tree")) == null || r.classList.remove("dragging"), d(this, l, z).call(this, e), d(this, l, p).call(this);
  }
  findNodeById(e, t = this.treeData) {
    if (!t || !e)
      return null;
    for (const r of t) {
      if (r.key === e)
        return r;
      if (r.items) {
        const i = this.findNodeById(e, r.items);
        if (i)
          return i;
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
    if (e.preventDefault(), e.stopPropagation(), t && this._levels && t.level >= this._levels - 1) {
      this.requestUpdate();
      return;
    }
    d(this, l, E).call(this, t);
    const i = e.dataTransfer != null ? JSON.parse(e.dataTransfer.getData("text/plain")) : {}, a = this.isDescendantOrSelf(i, t.key);
    if (e.currentTarget == null || a) {
      this.requestUpdate();
      return;
    }
    const h = e.target, m = h.classList.contains("drop-zone") ?? !1, v = h.closest(".tree-node");
    if (v == null || v.parentElement == null)
      return;
    let y = null;
    const D = (k, n) => {
      for (let s = 0; s < n.length; s++) {
        if (n[s].key === i.oldKey)
          return y;
        if (n[s].items) {
          y = n[s];
          const f = D(k, n[s].items);
          if (f) return f;
        }
      }
      return null;
    };
    D(i, this.treeData), ((k, n) => {
      for (let s = 0; s < n.length; s++) {
        if (n[s].key === i.oldKey)
          return y;
        if (n[s].items) {
          y = n[s];
          const f = D(k, n[s].items);
          if (f) return f;
        }
      }
      return null;
    })(i, this.treeData);
    const O = [...v.parentElement.children].indexOf(v), N = h.classList.contains("before") ? "before" : "after";
    let c = m ? r : t;
    c != null && !c.items && (c.items = []);
    var T = c == null ? this.treeData : c.items;
    i.level = c == null ? 0 : c.level + 1, T && (N === "before" ? T.splice(O, 0, i) : T.splice(O + 1, 0, i), this.removeNodeFromTree(i.oldKey, this.treeData), d(this, l, _).call(this), d(this, l, p).call(this));
  }
  removeNodeFromTree(e, t = this.treeData) {
    return t.forEach((r, i) => {
      if (r.key === e)
        return t.splice(i, 1), this.requestUpdate(), !0;
      if (r.items && this.removeNodeFromTree(e, r.items))
        return !0;
    }), d(this, l, _).call(this), d(this, l, p).call(this), !1;
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
      level: e ? e.level + 1 : 0,
      items: []
    };
    e ? e.items.push(t) : this.treeData.push(t), d(this, l, _).call(this), this.requestUpdate(), d(this, l, p).call(this);
  }
};
l = /* @__PURE__ */ new WeakSet();
z = function(e) {
  var t;
  try {
    Array.from(((t = this.shadowRoot) == null ? void 0 : t.querySelectorAll(".drag-over")) || []).forEach((r) => {
      r.classList.remove("drag-over");
    });
  } catch {
  }
  e && e.dataTransfer && e.dataTransfer.clearData();
};
E = function(e) {
  if (this._levels === void 0) return !1;
  if (e.level >= this._levels)
    return !0;
  if (e.items) {
    for (const t of e.items)
      if (d(this, l, E).call(this, t))
        return !0;
  }
  return !1;
};
_ = function() {
  const e = (t, r) => {
    for (let i = 0; i < t.length; i++)
      t[i].level = r, t[i].items && t[i].items.length > 0 && e(t[i].items, r + 1);
  };
  e(this.treeData, 0);
};
p = function() {
  const e = {
    items: JSON.parse(JSON.stringify(this.treeData))
  };
  this.value = e, this.dispatchEvent(new $());
};
o.styles = w`
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
    `;
u([
  g()
], o.prototype, "_dragging", 2);
u([
  g()
], o.prototype, "_modalRoute", 2);
u([
  g()
], o.prototype, "_doctype", 2);
u([
  g()
], o.prototype, "_nameTemplate", 2);
u([
  g()
], o.prototype, "_levels", 2);
u([
  x({ type: Object })
], o.prototype, "value", 1);
u([
  x()
], o.prototype, "alias", 1);
u([
  x()
], o.prototype, "variantId", 1);
u([
  x({ attribute: !1 })
], o.prototype, "config", 1);
o = u([
  M(J)
], o);
export {
  o as SimpleTreeMenuElement,
  o as element
};
//# sourceMappingURL=simpletreemenu.element.js.map
