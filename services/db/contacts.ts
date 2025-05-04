/* eslint-disable @typescript-eslint/no-explicit-any */

import dayjs from 'dayjs';
import Dexie, { Entity, EntityTable } from 'dexie';
import { omit } from 'lodash-es';

import { fuzzyMatch } from '@utils/fuzzy-search';
import { SearchByOptions } from 'types/common';
import { AddContactItem, ContactDbQuerySortBy, DbFormattedContactItem, UpdateContactItem } from 'types/db/contacts';
import { FormattedContact } from 'types/domain/contacts';

const contactsTableName = 'contacts' as const;
const contactsTableColumnLiteral =
  'id,&userhash,name,phoneNumber,server,wid,createdAt,updatedAt,avatar,isMyContact,isConsumer,isGroup,isManualAdded';

class ContactModel extends Entity<ContactService> implements DbFormattedContactItem {
  id!: string;
  name!: string;
  phoneNumber?: string;
  userhash?: string;
  server?: string;
  avatar?: string;
  isMyContact?: boolean;
  isConsumer?: boolean;
  isGroup?: boolean;
  isManualAdded?: boolean;
  createdAt!: string;
  updatedAt!: string;
  wid?: any;
  groups?: any[];
}

export class ContactService extends Dexie {
  private static instance?: ContactService;

  static mount() {
    if (!ContactService.instance) {
      ContactService.instance = new ContactService();
    }

    return ContactService.instance;
  }

  static unmount() {
    if (ContactService.instance) {
      ContactService.instance.close();
      delete ContactService.instance;
    }
  }

  private constructor() {
    super(contactsTableName);

    this.version(1).stores({
      [contactsTableName]: contactsTableColumnLiteral,
    });

    this.contacts.mapToClass(ContactModel);
  }

  private contacts!: EntityTable<DbFormattedContactItem, 'id'>;

  /**
   * 添加联系人，如果联系人已存在且overwrite为true，则更新联系人
   * @param item
   * @param overwrite
   * @returns
   */
  async addContact(item: AddContactItem, overwrite = false) {
    const existingContact = await this.contacts.get(item.id);

    if (existingContact) {
      if (overwrite) {
        await this.contacts.update(item.id, {
          ...omit(item, ['id']),
          updatedAt: dayjs().format('YYYY-MM-DD HH:mm:SS'),
        });
      }

      return existingContact.id;
    }

    const atNow = dayjs().format('YYYY-MM-DD HH:mm:SS');

    return this.contacts.add({
      ...item,
      createdAt: atNow,
      updatedAt: atNow,
    });
  }

  async addContacts(items: AddContactItem[], overwrite = false) {
    if (!items.length) {
      return [];
    }

    const ids: string[] = [];

    // If override is true, check each contact and update if it exists
    if (overwrite) {
      for (const item of items) {
        const existingContact = await this.contacts.get(item.id);
        const formattedDate = dayjs().format('YYYY-MM-DD HH:mm:SS');

        if (existingContact) {
          // Update existing contact
          await this.contacts.update(item.id, {
            ...item,
            updatedAt: formattedDate,
          });
        } else {
          // Add new contact
          await this.contacts.add({
            ...item,
            createdAt: formattedDate,
            updatedAt: formattedDate,
          });
        }
        ids.push(item.id);
      }
    } else {
      const itemsToAdd: DbFormattedContactItem[] = [];

      // Check if contacts already exist
      const existingPrimaryKeys = await this.contacts
        .where('id')
        .anyOf(items.map((item) => item.id))
        .toArray()
        .then((contacts) => contacts.map((c) => c.id));

      console.log('existingPrimaryKeys', existingPrimaryKeys);

      // Filter out existing contacts
      for (const item of items) {
        if (!existingPrimaryKeys.includes(item.id)) {
          itemsToAdd.push({
            ...item,
            createdAt: dayjs().format('YYYY-MM-DD HH:mm:SS'),
            updatedAt: dayjs().format('YYYY-MM-DD HH:mm:SS'),
          });
        } else {
          ids.push(item.id);
        }
      }

      // Add new contacts
      if (itemsToAdd.length > 0) {
        const newIds = (await this.contacts.bulkAdd(itemsToAdd, { allKeys: true })) as string[];
        ids.push(...newIds);
      }
    }

    return ids;
  }

  async updateContact(id: string, item: UpdateContactItem) {
    const formattedDate = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:SS');

    return this.contacts.update(id, {
      ...item,
      updatedAt: formattedDate,
    });
  }

  async getContacts(
    offset = 0,
    limit = 50,
    orderBy?: ContactDbQuerySortBy[],
    searchs?: SearchByOptions<FormattedContact>[],
  ) {
    const querying = this.contacts;
    let collection = querying.toCollection();

    if (orderBy && orderBy.length > 0) {
      const { field, order } = orderBy[0]; // Using only first sort criteria to simplify
      collection = querying.orderBy(field);
      if (order === 'desc') {
        collection = collection.reverse();
      }
    }

    if (searchs && searchs.length > 0) {
      for (const searchItem of searchs) {
        const { key, search } = searchItem;

        collection = collection.filter((contact): boolean => {
          if (typeof contact[key] === 'string') {
            const isMatch = fuzzyMatch(contact[key], search);
            return isMatch;
          } else if (typeof contact[key] === 'number') {
            return contact[key] === Number(search);
          } else if (typeof contact[key] === 'boolean') {
            return contact[key] === !!Number(search);
          } else if (Array.isArray(contact[key])) {
            return contact[key].some((item) => fuzzyMatch(item, search));
          }
          return false;
        });
      }
    }

    const total = await collection.count();
    const data = await collection.offset(offset).limit(limit).toArray();

    return {
      success: true,
      data,
      total,
    };
  }

  async getAllContacts() {
    try {
      const list = await this.contacts.toArray();

      return {
        success: true,
        data: list,
        total: list.length,
      };
    } catch (error) {
      return {
        success: false,
        error: error as Error,
      };
    }
  }

  async getContact(id: string) {
    return this.contacts.get(id);
  }

  async getContactByPhoneNumber(phoneNumber: string) {
    return this.contacts.get({ phoneNumber });
  }

  async deleteContact(id: string) {
    return this.contacts.delete(id);
  }

  async bulkDeleteContacts(ids: string[]) {
    return this.contacts.bulkDelete(ids);
  }

  async clearContacts() {
    return this.contacts.clear();
  }
}
