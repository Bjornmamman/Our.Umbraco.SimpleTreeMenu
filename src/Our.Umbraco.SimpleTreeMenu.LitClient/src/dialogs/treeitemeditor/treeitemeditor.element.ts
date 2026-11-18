import { customElement, html, repeat, property, state } from "@umbraco-cms/backoffice/external/lit";
import { UmbModalExtensionElement } from "@umbraco-cms/backoffice/modal";
import { TreeItemEditorModalData, TreeItemEditorModalValue } from "./treeitemeditor.token";
import { DataTypeService, DocumentTypeResponseModel, DocumentTypeService } from "@umbraco-cms/backoffice/external/backend-api";
import { UmbPropertyDatasetElement, UmbPropertyValueData } from "@umbraco-cms/backoffice/property";
import { UmbPropertyEditorConfigCollection } from "@umbraco-cms/backoffice/property-editor";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import type { UmbModalContext } from '@umbraco-cms/backoffice/modal';
import { resolveElementType } from '../../api/element-types';

//import { UUIInputEvent } from "@umbraco-cms/backoffice/external/uui";

@customElement('item-editor-modal')
export class ItemEditorModalElement extends UmbLitElement
    implements UmbModalExtensionElement<TreeItemEditorModalData, TreeItemEditorModalValue>
{

    @property({ attribute: false })
    modalContext?: UmbModalContext<TreeItemEditorModalData, TreeItemEditorModalValue>;


    @property({ attribute: false })
    data?: TreeItemEditorModalData;


    constructor() {
        super();
        
    }



    override async connectedCallback() {
        super.connectedCallback();
        
        const doctypeKey = this.data?.doctype ?? "";

        const elementType = await resolveElementType(doctypeKey);
        if (!elementType) {
            console.error(`Element type with alias or key ${doctypeKey} not found.`);
            return;
        }

        const doctypeRequest = await DocumentTypeService.getDocumentTypeById({ path: { id: elementType.id } });
        const doctypeData = doctypeRequest.data;

        if (!doctypeData) {
            console.error(`Element type with alias or key ${doctypeKey} not found.`);
            return;
        }

        let datatypeIds = doctypeData.properties.map(x => x.dataType.id);

        for (let datatypeId of datatypeIds) {
            let datatypeRequest = await DataTypeService.getDataTypeById({ path: { id: datatypeId } });
            let datatype = datatypeRequest.data;
            this._dataTypes[datatypeId] = datatype;
            
        }

        this._doctype = doctypeData;

        const values = this.data?.properties as any;
        this._values = Object.keys(values).map(key => ({ alias: key, value: values[key] }));
        

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
        this.modalContext?.updateValue({ value: this.dataValue ?? {} });
        this.modalContext?.submit();
    }

    #handleCancel() {
        this.modalContext?.reject();
    }

    #onPropertyDataChange(e: Event) {
        const value = (e.target as UmbPropertyDatasetElement).value;
        this.dataValue = value.reduce((acc, curr) => ({ ...acc, [curr.alias]: curr.value }), {});
        this.modalContext?.updateValue({ value: this.dataValue ?? {} });
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