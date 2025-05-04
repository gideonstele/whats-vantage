import { uniqBy } from 'lodash-es';

import { ImportedGroupItem } from 'types/domain/contacts';

import { importExcel } from 'extend-excel';

export interface ImportContactItem {
  phoneNumber: string;
  name: string;
}

export const importContacts = async (file: File) => {
  const data = (await importExcel(file, {
    onlyFirst: true,
    keyMapping: {
      联系电话: 'phoneNumber',
      电话: 'phoneNumber',
      姓名: 'name',
      名称: 'name',
      跳过验证: 'ignoreValidate',
    },
  })) as { data: ImportContactItem[] };

  const contacts = uniqBy(data.data, 'phoneNumber');

  return contacts;
};

export interface ImportGroupItem {
  id: string;
  name?: string;
  inviteLink: string;
  site?: string;
  description?: string;
  dataSource?: string;
}

const mapping = {
  标题: 'name',
  群组Url: 'inviteLink',
  数据源: 'dataSource',
  链接: 'site',
  描述: 'description',
} satisfies Record<string, keyof Omit<ImportGroupItem, 'id'>>;

export const importGroups = async (file: File): Promise<ImportedGroupItem[]> => {
  const data = (await importExcel(file, {
    keyMapping: mapping,
  })) as { data: ImportGroupItem[] };

  if (!data.data || data.data.length === 0) {
    return [];
  }

  const groups = data.data.map((item) => ({
    id: globalThis.crypto.randomUUID(),
    name: item.name,
    inviteLink: item.inviteLink,
    site: item.site,
    description: item.description,
    dataSource: item.dataSource,
  }));

  return groups;
};
