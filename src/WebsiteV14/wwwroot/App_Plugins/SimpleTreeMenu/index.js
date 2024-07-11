const t = {
  type: "modal",
  alias: "treeitem.editor.modal",
  name: "SimpleTree Editor Modal",
  js: () => import("./treeitemeditor.element.js")
}, i = {
  type: "propertyEditorUi",
  alias: "SimpleTreeMenu",
  name: "SimpleTreeMenu",
  element: () => import("./simpletreemenu.element.js"),
  meta: {
    label: "SimpleTreeMenu",
    icon: "icon-network-alt",
    group: "common",
    propertyEditorSchemaAlias: "Umbraco.Plain.Json",
    settings: {
      properties: [
        {
          alias: "doctype",
          label: "Doctype",
          description: "Allowed doctype",
          propertyEditorUiAlias: "Umb.PropertyEditorUi.TextArea"
        },
        {
          alias: "nameTemplate",
          label: "nameTemplate",
          description: "",
          propertyEditorUiAlias: "Umb.PropertyEditorUi.TextArea"
        },
        {
          alias: "Levels",
          label: "levels",
          description: "Max number of levels",
          propertyEditorUiAlias: "Umb.PropertyEditorUi.TextArea"
        }
      ],
      defaultData: [
        {
          alias: "doctype",
          value: "MenuNode"
        },
        {
          alias: "levels",
          value: "3"
        }
      ]
    }
  }
}, r = (o, e) => {
  e.registerMany([
    t,
    //schema,
    i
  ]);
};
export {
  r as onInit
};
//# sourceMappingURL=index.js.map
