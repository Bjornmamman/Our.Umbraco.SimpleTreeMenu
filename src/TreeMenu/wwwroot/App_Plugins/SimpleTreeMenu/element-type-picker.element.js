import { html as u, css as $, property as w, state as _, customElement as T } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as P } from "@umbraco-cms/backoffice/lit-element";
import { UmbPropertyValueChangeEvent as S } from "@umbraco-cms/backoffice/property-editor";
import { i as A, r as M } from "./element-types.js";
var C = Object.defineProperty, O = Object.getOwnPropertyDescriptor, m = (e) => {
  throw TypeError(e);
}, p = (e, t, a, s) => {
  for (var r = s > 1 ? void 0 : s ? O(t, a) : t, h = e.length - 1, v; h >= 0; h--)
    (v = e[h]) && (r = (s ? v(t, a, r) : v(r)) || r);
  return s && r && C(t, a, r), r;
}, y = (e, t, a) => t.has(e) || m("Cannot " + a), d = (e, t, a) => (y(e, t, "read from private field"), a ? a.call(e) : t.get(e)), f = (e, t, a) => t.has(e) ? m("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, a), D = (e, t, a, s) => (y(e, t, "write to private field"), t.set(e, a), a), n = (e, t, a) => (y(e, t, "access private method"), a), V = (e, t, a, s) => ({
  set _(r) {
    D(e, t, r);
  },
  get _() {
    return d(e, t, s);
  }
}), c, i, g, l, E;
const k = "simpletreemenu-doctype-picker";
let o = class extends P {
  constructor() {
    super(...arguments), f(this, i), this._notFound = !1, f(this, c, 0);
  }
  updated(e) {
    e.has("value") && n(this, i, g).call(this);
  }
  render() {
    return u`
            <umb-input-document-type
				.min=${1}
				.max=${1}
				.value=${this._resolvedValue}
				.elementTypesOnly=${!0}
				?showOpenButton=${!1}
				@change=${n(this, i, E)}>
			</umb-input-document-type>

            ${this._legacyAlias ? u`
                    <p class="legacy-note">
                        ${this._notFound ? u`The legacy element type alias <code>${this._legacyAlias}</code> could not be found. Select an element type to replace it.` : u`This editor is configured with the legacy element type alias <code>${this._legacyAlias}</code>. Select an element type to store its key instead.`}
                    </p>
                ` : ""}
        `;
  }
};
c = /* @__PURE__ */ new WeakMap();
i = /* @__PURE__ */ new WeakSet();
g = async function() {
  var a;
  const e = ++V(this, c)._, t = (a = this.value) == null ? void 0 : a.trim();
  if (!t) {
    n(this, i, l).call(this, void 0, void 0, !1);
    return;
  }
  if (A(t)) {
    n(this, i, l).call(this, t, void 0, !1);
    return;
  }
  try {
    const s = await M(t);
    if (e !== d(this, c)) return;
    n(this, i, l).call(this, s == null ? void 0 : s.id, t, !s);
  } catch {
    if (e !== d(this, c)) return;
    n(this, i, l).call(this, void 0, t, !0);
  }
};
l = function(e, t, a) {
  this._resolvedValue = e, this._legacyAlias = t, this._notFound = a;
};
E = function(e) {
  this.value = e.target.value, this.dispatchEvent(new S());
};
o.styles = $`
        .legacy-note {
            margin: var(--uui-size-2) 0 0;
            color: var(--uui-color-text-alt);
            font-size: var(--uui-type-small-size);
        }

        .legacy-note code {
            font-family: var(--uui-font-monospace, monospace);
        }
    `;
p([
  w()
], o.prototype, "value", 2);
p([
  _()
], o.prototype, "_resolvedValue", 2);
p([
  _()
], o.prototype, "_legacyAlias", 2);
p([
  _()
], o.prototype, "_notFound", 2);
o = p([
  T(k)
], o);
const q = o;
export {
  o as SimpleTreeMenuDoctypePicker,
  q as default
};
//# sourceMappingURL=element-type-picker.element.js.map
