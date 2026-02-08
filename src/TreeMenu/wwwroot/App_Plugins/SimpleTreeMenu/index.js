const t = {
  type: "modal",
  alias: "treeitem.editor.modal",
  name: "SimpleTree Editor Modal",
  js: () => import("./treeitemeditor.element.js")
}, i = {
  type: "propertyEditorSchema",
  name: "SimpleTreeMenu Schema",
  alias: "Simple Tree Menu",
  meta: {
    defaultPropertyEditorUiAlias: "SimpleTreeMenu.PropertyEditorUi"
  }
}, r = {
  type: "propertyEditorUi",
  alias: "SimpleTreeMenu.PropertyEditorUi",
  name: "SimpleTreeMenu Editor UI",
  element: () => import("./simpletreemenu.element.js"),
  meta: {
    label: "SimpleTreeMenu",
    icon: "icon-network-alt",
    group: "common",
    propertyEditorSchemaAlias: "SimpleTreeMenu",
    settings: {
      properties: [
        {
          alias: "doctype",
          label: "Doctype",
          description: "Allowed doctype",
          propertyEditorUiAlias: "SimpleTreeMenu.ElementTypePicker"
        },
        {
          alias: "nameTemplate",
          label: "Name template",
          description: "",
          propertyEditorUiAlias: "Umb.PropertyEditorUi.TextArea"
        },
        {
          alias: "levels",
          label: "Levels",
          description: "Max number of levels",
          propertyEditorUiAlias: "Umb.PropertyEditorUi.Integer"
        }
      ],
      defaultData: [
        {
          alias: "levels",
          value: "3"
        }
      ]
    }
  }
}, o = {
  type: "propertyEditorUi",
  alias: "SimpleTreeMenu.ElementTypePicker",
  name: "SimpleTreeMenuElementTypePicker",
  element: () => import("./element-type-picker.element.js"),
  meta: {
    label: "ElementTypePicker",
    icon: "icon-network-alt",
    group: "common"
  }
}, a = (l, e) => {
  e.registerMany([
    t,
    r,
    o,
    i
  ]);
};
export {
  a as onInit
};
//# sourceMappingURL=index.js.map
