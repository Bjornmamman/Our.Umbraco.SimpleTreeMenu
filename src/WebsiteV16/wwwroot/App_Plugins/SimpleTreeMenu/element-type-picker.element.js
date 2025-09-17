import { html as m, property as v, customElement as h } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as _ } from "@umbraco-cms/backoffice/lit-element";
import { UmbPropertyValueChangeEvent as d } from "@umbraco-cms/backoffice/property-editor";
var f = Object.defineProperty, y = Object.getOwnPropertyDescriptor, i = (e) => {
  throw TypeError(e);
}, u = (e, t, r, a) => {
  for (var n = a > 1 ? void 0 : a ? y(t, r) : t, p = e.length - 1, s; p >= 0; p--)
    (s = e[p]) && (n = (a ? s(t, r, n) : s(n)) || n);
  return a && n && f(t, r, n), n;
}, E = (e, t, r) => t.has(e) || i("Cannot " + r), P = (e, t, r) => t.has(e) ? i("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), $ = (e, t, r) => (E(e, t, "access private method"), r), c, l;
const g = "simpletreemenu-doctype-picker";
let o = class extends _ {
  constructor() {
    super(...arguments), P(this, c);
  }
  render() {
    return console.log(this.value), m`
            <umb-input-document-type
				.min=${1}
				.max=${1}
				.value=${this.value}
				.elementTypesOnly=${!0}
				?showOpenButton=${!1}
				@change=${$(this, c, l)}>
			</umb-input-document-type>
        `;
  }
};
c = /* @__PURE__ */ new WeakSet();
l = function(e) {
  this.value = e.target.value, this.dispatchEvent(new d());
};
u([
  v()
], o.prototype, "value", 2);
o = u([
  h(g)
], o);
const O = o;
export {
  o as SimpleTreeMenuDoctypePicker,
  O as default
};
//# sourceMappingURL=element-type-picker.element.js.map
