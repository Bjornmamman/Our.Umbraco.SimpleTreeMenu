import { html as p, state as v, customElement as b } from "@umbraco-cms/backoffice/external/lit";
import { UmbModalBaseElement as _ } from "@umbraco-cms/backoffice/modal";
var f = Object.defineProperty, C = Object.getOwnPropertyDescriptor, u = (t) => {
  throw TypeError(t);
}, c = (t, e, a, n) => {
  for (var o = n > 1 ? void 0 : n ? C(e, a) : e, l = t.length - 1, s; l >= 0; l--)
    (s = t[l]) && (o = (n ? s(e, a, o) : s(o)) || o);
  return n && o && f(e, a, o), o;
}, E = (t, e, a) => e.has(t) || u("Cannot " + a), x = (t, e, a) => e.has(t) ? u("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, a), d = (t, e, a) => (E(t, e, "access private method"), a), i, m, h;
let r = class extends _ {
  constructor() {
    super(), x(this, i), this.content = "";
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), this.updateValue({ data: (t = this.data) == null ? void 0 : t.data });
  }
  render() {
    var t;
    return p`
            <umb-body-layout .headline=${((t = this.data) == null ? void 0 : t.headline) ?? "Custom dialog"}>
                <uui-box>
                </uui-box>
                <uui-box>
                </uui-box>

                <div slot="actions">
                        <uui-button id="cancel" label="Cancel" @click="${d(this, i, h)}">Cancel</uui-button>
                        <uui-button
                            id="submit"
                            color='positive'
                            look="primary"
                            label="Submit"
                            @click=${d(this, i, m)}></uui-button>
            </div>
            </umb-body-layout>
        `;
  }
};
i = /* @__PURE__ */ new WeakSet();
m = function() {
  var t, e;
  this.value = { data: ((t = this.data) == null ? void 0 : t.data) ?? "" }, (e = this.modalContext) == null || e.submit();
};
h = function() {
  var t;
  (t = this.modalContext) == null || t.reject();
};
c([
  v()
], r.prototype, "content", 2);
r = c([
  b("item-editor-modal")
], r);
const w = r;
export {
  r as ItemEditorModalElement,
  w as default
};
//# sourceMappingURL=treeitemeditor.element.js.map
