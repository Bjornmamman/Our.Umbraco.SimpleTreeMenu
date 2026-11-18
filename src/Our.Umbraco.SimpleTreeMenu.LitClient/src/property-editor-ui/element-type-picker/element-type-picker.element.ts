import { UmbInputDocumentTypeElement } from '@umbraco-cms/backoffice/document-type';
import { html, css, customElement, property, state, type PropertyValues } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { UmbPropertyValueChangeEvent } from '@umbraco-cms/backoffice/property-editor';
import { isElementTypeKey, resolveElementType } from '../../api/element-types';

import type {
    UmbPropertyEditorUiElement,
} from '@umbraco-cms/backoffice/property-editor';

const ELEMENT_NAME = 'simpletreemenu-doctype-picker';
@customElement(ELEMENT_NAME)
export class SimpleTreeMenuDoctypePicker extends UmbLitElement implements UmbPropertyEditorUiElement {
    @property()
    public value?: string;

    @state()
    private _resolvedValue?: string;

    @state()
    private _legacyAlias?: string;

    @state()
    private _notFound = false;

    #resolveRequest = 0;

    static styles = css`
        .legacy-note {
            margin: var(--uui-size-2) 0 0;
            color: var(--uui-color-text-alt);
            font-size: var(--uui-type-small-size);
        }

        .legacy-note code {
            font-family: var(--uui-font-monospace, monospace);
        }
    `;

    override updated(changedProperties: PropertyValues<this>) {
        if (changedProperties.has('value')) {
            void this.#resolveValue();
        }
    }

    async #resolveValue() {
        const request = ++this.#resolveRequest;
        const value = this.value?.trim();

        if (!value) {
            this.#setResolved(undefined, undefined, false);
            return;
        }

        if (isElementTypeKey(value)) {
            this.#setResolved(value, undefined, false);
            return;
        }

        try {
            const elementType = await resolveElementType(value);
            if (request !== this.#resolveRequest) return;

            this.#setResolved(elementType?.id, value, !elementType);
        } catch {
            if (request !== this.#resolveRequest) return;

            this.#setResolved(undefined, value, true);
        }
    }

    #setResolved(resolvedValue: string | undefined, legacyAlias: string | undefined, notFound: boolean) {
        this._resolvedValue = resolvedValue;
        this._legacyAlias = legacyAlias;
        this._notFound = notFound;
    }

    #onChange(event: CustomEvent & { target: UmbInputDocumentTypeElement }) {
        this.value = event.target.value;
        this.dispatchEvent(new UmbPropertyValueChangeEvent());
    }

    override render() {
        return html`
            <umb-input-document-type
				.min=${1}
				.max=${1}
				.value=${this._resolvedValue}
				.elementTypesOnly=${true}
				?showOpenButton=${false}
				@change=${this.#onChange}>
			</umb-input-document-type>

            ${this._legacyAlias
                ? html`
                    <p class="legacy-note">
                        ${this._notFound
                            ? html`The legacy element type alias <code>${this._legacyAlias}</code> could not be found. Select an element type to replace it.`
                            : html`This editor is configured with the legacy element type alias <code>${this._legacyAlias}</code>. Select an element type to store its key instead.`}
                    </p>
                `
                : ''}
        `;
    }
}

export default SimpleTreeMenuDoctypePicker;

declare global {
    interface HTMLElementTagNameMap {
        ELEMENT_NAME: SimpleTreeMenuDoctypePicker;
    }
}
