import { html as v, repeat as $, property as _, state as h, customElement as g } from "@umbraco-cms/backoffice/external/lit";
import { DocumentTypeService as y, DataTypeService as D } from "@umbraco-cms/backoffice/external/backend-api";
import { UmbPropertyEditorConfigCollection as E } from "@umbraco-cms/backoffice/property-editor";
import { UmbLitElement as I } from "@umbraco-cms/backoffice/lit-element";
var x = Object.defineProperty, V = Object.getOwnPropertyDescriptor, f = (t) => {
  throw TypeError(t);
}, p = (t, e, a, i) => {
  for (var o = i > 1 ? void 0 : i ? V(e, a) : e, l = t.length - 1, d; l >= 0; l--)
    (d = t[l]) && (o = (i ? d(e, a, o) : d(o)) || o);
  return i && o && x(e, a, o), o;
}, q = (t, e, a) => e.has(t) || f("Cannot " + a), P = (t, e, a) => e.has(t) ? f("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, a), m = (t, e, a) => (q(t, e, "access private method"), a), n, b, C, w;
let r = class extends I {
  constructor() {
    super(), P(this, n), this._values = [], this._dataTypes = {}, this.dataValue = {};
  }
  async connectedCallback() {
    var l, d;
    super.connectedCallback();
    const t = ((l = this.data) == null ? void 0 : l.doctype) ?? "";
    let e, a;
    if (console.log(this.data), t.length === 36)
      e = await y.getDocumentTypeById({ path: { id: t } }), a = e.data;
    else {
      let u = (await y.getItemDocumentTypeSearch({ query: t })).data.items.find((c) => c.isElement && (c.id == t || c.name.toLowerCase() === t.toLowerCase()));
      if (!u) {
        console.error(`Document type with alias ${t} not found.`);
        return;
      }
      if (e = await y.getDocumentTypeById({ id: u.id }), a = e.data, a.id == t || a.alias.toLowerCase() !== t.toLowerCase()) {
        console.error(`Document type with alias ${t} is invalid.`);
        return;
      }
    }
    console.log(a);
    let i = a.properties.map((s) => s.dataType.id);
    for (let s of i) {
      let u = (await D.getDataTypeById({ path: { id: s } })).data;
      this._dataTypes[s] = u;
    }
    this._doctype = a;
    const o = (d = this.data) == null ? void 0 : d.properties;
    this._values = Object.keys(o).map((s) => ({ alias: s, value: o[s] })), this.dataValue = o;
  }
  render() {
    var t;
    return v`
            <umb-body-layout>
                <uui-box>
                <umb-property-dataset
                    .value=${this._values}
                    @change=${m(this, n, w)}>
                        ${$(
      ((t = this._doctype) == null ? void 0 : t.properties) ?? [],
      (e) => e.alias,
      (e) => v`<umb-property
                        alias=${e.alias}
                        label=${e.name}
                        description=${e.description}
                        property-editor-ui-alias=${this._dataTypes[e.dataType.id].editorUiAlias}
                        .config=${new E([{ alias: "maxNumber", value: 1 }])}>
                    </umb-property>`
    )}
                </umb-property-dataset>
                </uui-box>

                <div slot="actions">
                        <uui-button id="cancel" label="Cancel" @click="${m(this, n, C)}">Cancel</uui-button>
                        <uui-button
                            id="submit"
                            color='positive'
                            look="primary"
                            label="Submit"
                            @click=${m(this, n, b)}></uui-button>
            </div>
            </umb-body-layout>
        `;
  }
};
n = /* @__PURE__ */ new WeakSet();
b = function() {
  var t, e;
  (t = this.modalContext) == null || t.updateValue({ value: this.dataValue ?? {} }), (e = this.modalContext) == null || e.submit();
};
C = function() {
  var t;
  (t = this.modalContext) == null || t.reject();
};
w = function(t) {
  var a;
  const e = t.target.value;
  this.dataValue = e.reduce((i, o) => ({ ...i, [o.alias]: o.value }), {}), (a = this.modalContext) == null || a.updateValue({ value: this.dataValue ?? {} });
};
p([
  _({ attribute: !1 })
], r.prototype, "modalContext", 2);
p([
  _({ attribute: !1 })
], r.prototype, "data", 2);
p([
  h()
], r.prototype, "_values", 2);
p([
  h()
], r.prototype, "_doctype", 2);
p([
  h()
], r.prototype, "_dataTypes", 2);
r = p([
  g("item-editor-modal")
], r);
const M = r;
export {
  r as ItemEditorModalElement,
  M as default
};
//# sourceMappingURL=treeitemeditor.element.js.map
