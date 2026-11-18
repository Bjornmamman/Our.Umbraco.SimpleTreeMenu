import { html as m, repeat as E, property as h, state as c, customElement as T } from "@umbraco-cms/backoffice/external/lit";
import { DocumentTypeService as $, DataTypeService as w } from "@umbraco-cms/backoffice/external/backend-api";
import { UmbPropertyEditorConfigCollection as x } from "@umbraco-cms/backoffice/property-editor";
import { UmbLitElement as D } from "@umbraco-cms/backoffice/lit-element";
import { r as g } from "./element-types.js";
var I = Object.defineProperty, V = Object.getOwnPropertyDescriptor, v = (e) => {
  throw TypeError(e);
}, n = (e, t, a, r) => {
  for (var o = r > 1 ? void 0 : r ? V(t, a) : t, s = e.length - 1, p; s >= 0; s--)
    (p = e[s]) && (o = (r ? p(t, a, o) : p(o)) || o);
  return r && o && I(t, a, o), o;
}, P = (e, t, a) => t.has(e) || v("Cannot " + a), k = (e, t, a) => t.has(e) ? v("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, a), u = (e, t, a) => (P(e, t, "access private method"), a), d, _, f, b;
let i = class extends D {
  constructor() {
    super(), k(this, d), this._values = [], this._dataTypes = {}, this.dataValue = {};
  }
  async connectedCallback() {
    var p, y;
    super.connectedCallback();
    const e = ((p = this.data) == null ? void 0 : p.doctype) ?? "", t = await g(e);
    if (!t) {
      console.error(`Element type with alias or key ${e} not found.`);
      return;
    }
    const r = (await $.getDocumentTypeById({ path: { id: t.id } })).data;
    if (!r) {
      console.error(`Element type with alias or key ${e} not found.`);
      return;
    }
    let o = r.properties.map((l) => l.dataType.id);
    for (let l of o) {
      let C = (await w.getDataTypeById({ path: { id: l } })).data;
      this._dataTypes[l] = C;
    }
    this._doctype = r;
    const s = (y = this.data) == null ? void 0 : y.properties;
    this._values = Object.keys(s).map((l) => ({ alias: l, value: s[l] })), this.dataValue = s;
  }
  render() {
    var e;
    return m`
            <umb-body-layout>
                <uui-box>
                <umb-property-dataset
                    .value=${this._values}
                    @change=${u(this, d, b)}>
                        ${E(
      ((e = this._doctype) == null ? void 0 : e.properties) ?? [],
      (t) => t.alias,
      (t) => m`<umb-property
                        alias=${t.alias}
                        label=${t.name}
                        description=${t.description}
                        property-editor-ui-alias=${this._dataTypes[t.dataType.id].editorUiAlias}
                        .config=${new x([{ alias: "maxNumber", value: 1 }])}>
                    </umb-property>`
    )}
                </umb-property-dataset>
                </uui-box>

                <div slot="actions">
                        <uui-button id="cancel" label="Cancel" @click="${u(this, d, f)}">Cancel</uui-button>
                        <uui-button
                            id="submit"
                            color='positive'
                            look="primary"
                            label="Submit"
                            @click=${u(this, d, _)}></uui-button>
            </div>
            </umb-body-layout>
        `;
  }
};
d = /* @__PURE__ */ new WeakSet();
_ = function() {
  var e, t;
  (e = this.modalContext) == null || e.updateValue({ value: this.dataValue ?? {} }), (t = this.modalContext) == null || t.submit();
};
f = function() {
  var e;
  (e = this.modalContext) == null || e.reject();
};
b = function(e) {
  var a;
  const t = e.target.value;
  this.dataValue = t.reduce((r, o) => ({ ...r, [o.alias]: o.value }), {}), (a = this.modalContext) == null || a.updateValue({ value: this.dataValue ?? {} });
};
n([
  h({ attribute: !1 })
], i.prototype, "modalContext", 2);
n([
  h({ attribute: !1 })
], i.prototype, "data", 2);
n([
  c()
], i.prototype, "_values", 2);
n([
  c()
], i.prototype, "_doctype", 2);
n([
  c()
], i.prototype, "_dataTypes", 2);
i = n([
  T("item-editor-modal")
], i);
const j = i;
export {
  i as ItemEditorModalElement,
  j as default
};
//# sourceMappingURL=treeitemeditor.element.js.map
