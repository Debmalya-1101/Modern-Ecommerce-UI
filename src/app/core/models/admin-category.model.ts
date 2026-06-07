export type AttributeType = 'TEXT' | 'NUMBER';

export interface AdminAttributeKeyDTO {
  id: number;
  keyName: string;
  type: AttributeType;
  categoryId: number;
  categoryName: string;
}

export interface CategoryDTO {
  id: number;
  name: string;
  attributeKeys: AdminAttributeKeyDTO[];
}

export interface CreateCategoryRequest {
  name: string;
}

export interface CreateAttributeKeyRequest {
  keyName: string;
  type: AttributeType;
  categoryId: number;
}
