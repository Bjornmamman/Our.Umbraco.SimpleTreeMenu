import { umbHttpClient as s } from "@umbraco-cms/backoffice/http-client";
const i = "/umbraco/management/api/v1/simpletreemenu/element-types";
let t;
const f = (e) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(e), m = () => (t || (t = s.get({ url: i }).then((e) => {
  if (e.error) throw e.error;
  return e.data ?? [];
}).catch((e) => {
  throw t = void 0, e;
})), t), l = async (e) => {
  const r = e == null ? void 0 : e.trim();
  if (!r)
    return;
  const a = await m(), o = r.toLowerCase();
  return a.find(
    (n) => n.id.toLowerCase() === o || n.alias.toLowerCase() === o
  );
};
export {
  f as i,
  l as r
};
//# sourceMappingURL=element-types.js.map
