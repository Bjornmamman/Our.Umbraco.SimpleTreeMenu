const t = [
  {
    type: "propertyEditorUi",
    alias: "SimpleTreeMenu",
    name: "SimpleTreeMenu",
    element: () => import("./simpletreemenu.element.js"),
    meta: {
      label: "SimpleTreeMenu",
      icon: "icon-network-alt",
      group: "common"
    }
  }
], o = [
  {
    type: "modal",
    alias: "treeitem.editor.modal",
    name: "SimpleTree Editor Modal",
    js: () => import("./treeitemeditor.element.js")
  }
], i = [
  ...t,
  ...o
], m = (n, e) => {
  e.registerMany(i);
};
export {
  m as onInit
};
//# sourceMappingURL=index.js.map
