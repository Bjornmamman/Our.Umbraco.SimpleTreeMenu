import { UmbInputDocumentTypeElement } from '@umbraco-cms/backoffice/document-type';
import { html, customElement, property } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { UmbPropertyValueChangeEvent } from '@umbraco-cms/backoffice/property-editor';

import type {
    UmbPropertyEditorUiElement,
} from '@umbraco-cms/backoffice/property-editor';

const ELEMENT_NAME = 'simpletreemenu-doctype-picker';
@customElement(ELEMENT_NAME)
export class SimpleTreeMenuDoctypePicker extends UmbLitElement implements UmbPropertyEditorUiElement {
    @property()
    public value?: string;

    #onChange(event: CustomEvent & { target: UmbInputDocumentTypeElement }) {
        this.value = event.target.value;
        this.dispatchEvent(new UmbPropertyValueChangeEvent());
    }

    override render() {
        console.log(this.value)
        return html`
            <umb-input-document-type
				.min=${1}
				.max=${1}
				.value=${this.value}
				.elementTypesOnly=${true}
				?showOpenButton=${false}
				@change=${this.#onChange}>
			</umb-input-document-type>
        `;
    }
}

export default SimpleTreeMenuDoctypePicker;

declare global {
    interface HTMLElementTagNameMap {
        ELEMENT_NAME: SimpleTreeMenuDoctypePicker;
    }
}