import Dexie, { Table } from 'dexie';

import { AddCustomVariablesItem, CustomVariablesItem, UpdateCustomVariablesItem } from 'types/db/custom-variables';

export const integrationVariables: CustomVariablesItem[] = [
  {
    id: 0.1,
    type: 'intergration',
    label: '当前时间',
    value: 'common.current_time',
  },
  {
    id: 0.2,
    type: 'intergration',
    label: '用户名',
    value: 'currentUser.username',
  },
  {
    id: 0.3,
    type: 'intergration',
    label: '手机号',
    value: 'currentUser.phoneNumber',
  },
  {
    id: 0.4,
    type: 'intergration',
    label: '用户称呼',
    value: 'currentUser.callname',
  },
];

const customVariablesTableName = 'customVariables' as const;
const customVariablesTableColumnLiteral = '++id,label,value,description,type';

export class CustomVariablesService extends Dexie {
  private static instance?: CustomVariablesService;

  customVariables!: Table<CustomVariablesItem, number>;

  constructor() {
    super('CustomVariablesDatabase');
    this.version(1).stores({
      [customVariablesTableName]: customVariablesTableColumnLiteral,
    });
  }

  static mount(): CustomVariablesService {
    if (!this.instance) {
      this.instance = new CustomVariablesService();
    }
    return this.instance;
  }

  async listCustomVariables(): Promise<CustomVariablesItem[]> {
    const items = await this.customVariables.toArray();
    return [...integrationVariables, ...items];
  }

  async getCustomVariable(id: number): Promise<CustomVariablesItem | undefined> {
    return await this.customVariables.get(id);
  }

  async addCustomVariable(item: AddCustomVariablesItem): Promise<number> {
    const count = await this.customVariables.count();
    if (count >= 500) {
      throw new Error('自定义变量数量超过500个');
    }
    return await this.customVariables.add(item as CustomVariablesItem);
  }

  async updateCustomVariable(id: number, item: UpdateCustomVariablesItem): Promise<number> {
    if (!id) {
      return 0;
    }
    return await this.customVariables.update(id, item);
  }

  async deleteCustomVariable(id: number): Promise<void> {
    await this.customVariables.delete(id);
  }

  async clearCustomVariables(): Promise<void> {
    await this.customVariables.clear();
  }
}
