import { umbHttpClient } from '@umbraco-cms/backoffice/http-client';

export interface ElementTypeInfo {
    id: string;
    alias: string;
    name: string;
}

const ELEMENT_TYPES_ENDPOINT = '/umbraco/management/api/v1/simpletreemenu/element-types';

let elementTypesRequest: Promise<ElementTypeInfo[]> | undefined;

export const isElementTypeKey = (value: string): boolean =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);

export const getElementTypes = (): Promise<ElementTypeInfo[]> => {
    if (!elementTypesRequest) {
        elementTypesRequest = umbHttpClient
            .get<ElementTypeInfo[]>({
                url: ELEMENT_TYPES_ENDPOINT,
                security: [{ scheme: 'bearer', type: 'http' }],
            })
            .then((response) => {
                if (response.error) throw response.error;
                return response.data ?? [];
            })
            .catch((error) => {
                elementTypesRequest = undefined;
                throw error;
            });
    }

    return elementTypesRequest;
};

export const resolveElementType = async (value: string | undefined): Promise<ElementTypeInfo | undefined> => {
    const normalized = value?.trim();
    if (!normalized) {
        return undefined;
    }

    const elementTypes = await getElementTypes();
    const lowerCaseValue = normalized.toLowerCase();

    return elementTypes.find(
        (elementType) =>
            elementType.id.toLowerCase() === lowerCaseValue ||
            elementType.alias.toLowerCase() === lowerCaseValue
    );
};
