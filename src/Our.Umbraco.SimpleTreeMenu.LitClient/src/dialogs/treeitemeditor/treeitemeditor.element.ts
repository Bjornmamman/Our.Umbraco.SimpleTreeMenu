import { customElement, html, repeat, state } from "@umbraco-cms/backoffice/external/lit";
import { UmbModalBaseElement } from "@umbraco-cms/backoffice/modal";
import { TreeItemEditorModalData} from "./treeitemeditor.token";
import { DataTypeService, DocumentTypeResponseModel, DocumentTypeService } from "@umbraco-cms/backoffice/external/backend-api";
import { UmbPropertyDatasetElement, UmbPropertyValueData } from "@umbraco-cms/backoffice/property";
import { UmbPropertyEditorConfigCollection } from "@umbraco-cms/backoffice/property-editor";

//import { UUIInputEvent } from "@umbraco-cms/backoffice/external/uui";

@customElement('item-editor-modal')
export class ItemEditorModalElement extends UmbModalBaseElement<TreeItemEditorModalData, TreeItemEditorModalData>
{
    constructor() {
        super();
        console.log(this.data)
    }



    override async connectedCallback() {
        super.connectedCallback();
        
        const doctypeAlias = this.data?.doctype ?? "";
        
        let doctypes = await DocumentTypeService.getItemDocumentTypeSearch({ query: doctypeAlias });
        let doctype = doctypes.items.find((x) => x.isElement && x.name.toLowerCase() === doctypeAlias.toLowerCase());
        
        if (!doctype) {
            console.error(`Document type with alias ${doctypeAlias} not found.`);
            return;
        }

        let doctypeData = await DocumentTypeService.getDocumentTypeById({ id: doctype.id });
        
        if (doctypeData.alias.toLowerCase() !== doctypeAlias.toLowerCase()) {
            console.error(`Document type with alias ${doctypeAlias} is invalid.`);
            return;
        }
        let datatypeIds = doctypeData.properties.map(x => x.dataType.id);

        for (let datatypeId of datatypeIds) {
            let datatype = await DataTypeService.getDataTypeById({ id: datatypeId });
            this._dataTypes[datatypeId] = datatype;
            
        }

        this._doctype = doctypeData;

        const values = this.value as any;
        
        this._values = Object.keys(values).map(key => ({ alias: key, value: values[key] }));
        console.log("IN VALUE", this._values);

        this.dataValue = values;
    }

    @state()
    _values: Array<UmbPropertyValueData> = [];

    @state()
    _doctype?: DocumentTypeResponseModel;

    @state()
    _dataTypes: any = {};

    dataValue: any = {};

    #handleConfirm() {
        console.log("DATA VALUE", this.dataValue);
        this.value = this.dataValue ?? {};
        this.modalContext?.submit();
    }

    #handleCancel() {
        this.modalContext?.reject();
    }

    #onPropertyDataChange(e: Event) {
        const value = (e.target as UmbPropertyDatasetElement).value;
        this.dataValue = value.reduce((acc, curr) => ({ ...acc, [curr.alias]: curr.value }), {});
    }
    
    render() {
        return html`
            <umb-body-layout>
                <uui-box>
                <umb-property-dataset
                    .value=${this._values}
                    @change=${this.#onPropertyDataChange}>
                        ${repeat(
                            this._doctype?.properties ?? [],
                            (itm) => itm.alias,
                            (itm) => html`<umb-property
                        alias=${itm.alias}
                        label=${itm.name}
                        description=${itm.description}
                        property-editor-ui-alias=${this._dataTypes[itm.dataType.id].editorUiAlias}
                        .config=${new UmbPropertyEditorConfigCollection([{ alias: "maxNumber", value: 1}])}>
                    </umb-property>`)}
                </umb-property-dataset>
                </uui-box>

                <div slot="actions">
                        <uui-button id="cancel" label="Cancel" @click="${this.#handleCancel}">Cancel</uui-button>
                        <uui-button
                            id="submit"
                            color='positive'
                            look="primary"
                            label="Submit"
                            @click=${this.#handleConfirm}></uui-button>
            </div>
            </umb-body-layout>
        `;
    }

}

export default ItemEditorModalElement;