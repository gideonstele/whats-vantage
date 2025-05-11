export type VariableType = 'intergration' | 'custom';

export interface CustomVariablesItem {
  id: number;
  label: string;
  value: string;
  type: VariableType;
  description?: string;
}

export type AddCustomVariablesItem = Omit<CustomVariablesItem, 'id'>;

export type PutCustomVariablesItem = AddCustomVariablesItem;

export type UpdateCustomVariablesItem = Partial<Omit<CustomVariablesItem, 'id'>>;
