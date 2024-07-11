import { customElement, html, state } from "@umbraco-cms/backoffice/external/lit";
import { UmbModalBaseElement } from "@umbraco-cms/backoffice/modal";
import { TreeItemEditorModalData, TreeItemEditorModalValue } from "./treeitemeditor.token";
//import { UUIInputEvent } from "@umbraco-cms/backoffice/external/uui";

@customElement('item-editor-modal')
export class ItemEditorModalElement extends
    UmbModalBaseElement<TreeItemEditorModalData, TreeItemEditorModalValue>
{
    constructor() {
        super();
    }

    connectedCallback(): void {
        super.connectedCallback();
        this.updateValue({ data: this.data?.data });
    }

    @state()
    content: string = '';

    #handleConfirm() {
        this.value = { data: this.data?.data ?? '' };
        this.modalContext?.submit();
    }

    #handleCancel() {
        this.modalContext?.reject();
    }
    
    render() {
        return html`
            <umb-body-layout .headline=${this.data?.headline ?? 'Custom dialog'}>
                <uui-box>
                </uui-box>
                <uui-box>
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