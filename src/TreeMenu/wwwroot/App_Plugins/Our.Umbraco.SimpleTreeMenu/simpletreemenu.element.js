import { LitElement as N, html as x, css as O, property as T, customElement as E } from "@umbraco-cms/backoffice/external/lit";
var S = Object.defineProperty, I = Object.getOwnPropertyDescriptor, m = (e, r, n, t) => {
  for (var d = t > 1 ? void 0 : t ? I(r, n) : r, l = e.length - 1, s; l >= 0; l--)
    (s = e[l]) && (d = (t ? s(r, n, d) : s(d)) || d);
  return t && d && S(r, n, d), d;
};
const L = "simpletreemenu";
let h = class extends N {
  constructor() {
    super(...arguments), this.docsHint = "Click on the Vite and Lit logos to learn more", this.value = "", this.treeData = [];
  }
  render() {
    return x`
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
  renderTreeNode(e, r, n) {
    return x`
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
        <span class="node-name">${e.name}</span>
        ${e.children && e.children.length > 0 ? x`
              <div>
                ${e.children.map((t) => this.renderTreeNode(t, e, n + 1))}
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
      const n = {
        id: this.generateGUID(),
        oldId: r.id,
        name: r.name,
        children: r.children || []
      };
      e.dataTransfer.setData("text/plain", JSON.stringify(n));
    }
  }
  getParentNode(e, r) {
    for (const n of r) {
      if (n.children && n.children.includes(e))
        return n;
      if (n.children) {
        const t = this.getParentNode(e, n.children);
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
      Array.from(((r = this.shadowRoot) == null ? void 0 : r.querySelectorAll(".drag-over")) || []).forEach((n) => {
        n.classList.remove("drag-over");
      });
    } catch {
    }
    e && e.dataTransfer && e.dataTransfer.clearData();
  }
  findNodeById(e, r) {
    if (!e || !r)
      return null;
    for (const n of e) {
      if (n.id === r)
        return n;
      if (n.children) {
        const t = this.findNodeById(n.children, r);
        if (t)
          return t;
      }
    }
    return null;
  }
  isDescendantOrSelf(e, r) {
    if (!e || !r)
      return !1;
    if (e.id == r || e.oldId == r)
      return !0;
    if (e.children) {
      for (const n of e.children)
        if (n.oldId === r || n.id === r || this.isDescendantOrSelf(n, r))
          return !0;
    }
    return !1;
  }
  handleDrop(e, r, n) {
    e.preventDefault(), e.stopPropagation();
    const t = e.dataTransfer != null ? JSON.parse(e.dataTransfer.getData("text/plain")) : {}, d = this.isDescendantOrSelf(t, r.id);
    if (e.currentTarget == null || d) {
      this.requestUpdate();
      return;
    }
    const l = e.target, s = l.classList.contains("drop-zone") ?? !1, u = l.closest(".tree-node");
    if (u == null || u.parentElement == null)
      return;
    let g = null;
    const p = (c, i) => {
      for (let a = 0; a < i.length; a++) {
        if (i[a].id === t.oldId)
          return g;
        if (i[a].children) {
          g = i[a];
          const f = p(c, i[a].children);
          if (f) return f;
        }
      }
      return null;
    };
    p(t, this.treeData), ((c, i) => {
      for (let a = 0; a < i.length; a++) {
        if (i[a].id === t.oldId)
          return g;
        if (i[a].children) {
          g = i[a];
          const f = p(c, i[a].children);
          if (f) return f;
        }
      }
      return null;
    })(t, this.treeData);
    const D = [...u.parentElement.children].indexOf(u), b = l.classList.contains("before") ? "before" : "after";
    let o = s ? n : r;
    o != null && !o.children && (o.children = []);
    var v = o == null ? this.treeData : o.children;
    b === "before" ? v.splice(D, 0, t) : v.splice(D + 1, 0, t);
    const y = (c, i) => {
      for (let a = 0; a < i.length; a++) {
        if (i[a].id === t.oldId)
          return i.splice(a, 1), !0;
        if (i[a].children && y(c, i[a].children))
          return !0;
      }
      return !1;
    };
    y(t, this.treeData), this.requestUpdate();
  }
  removeNodeFromTree(e, r = this.treeData) {
    r.forEach((n, t) => {
      if (n === e) {
        r.splice(t, 1);
        return;
      }
      n.children && this.removeNodeFromTree(e, n.children);
    });
  }
};
h.styles = O`
        .tree-node {
            padding-left: 10px;
            cursor: pointer;
            background: rgb(0 0 0 / 4%);
        }
      
        .tree-node:not(:last-child) >.drop-zone.after {
            display:none;
        }
      
        .tree-node .node-name {
            display: block;
            padding: 5px;
            background: rgb(0 0 0 / 4%);
        }

        .drop-zone {
            //margin-left: -20px;
            min-height: 10px;
            border-radius: 3px;
        }

      
        .tree-node .drop-zone.drag-over, .tree-node .node-name.drag-over {
            background-color: lightblue !important;
        }
    `;
m([
  T()
], h.prototype, "docsHint", 2);
m([
  T({ type: String })
], h.prototype, "value", 2);
h = m([
  E(L)
], h);
export {
  h as SimpleTreeMenuElement,
  h as element
};
//# sourceMappingURL=simpletreemenu.element.js.map
