import Dexie, { Entity, EntityTable } from 'dexie';

import { fuzzyMatch } from '@utils/fuzzy-search';
import { SearchByOptions } from 'types/common';
import { AddSendLogItem, SendLogDbListResult, SendLogDbQuerySortBy, UpdateSendLogItem } from 'types/db/send-logs';
import { FormattedContact } from 'types/domain/contacts';
import { SendLogItem } from 'types/domain/send-logs';

const sendLogsTableName = 'sendLogs' as const;
const sendLogsTableColumnLiteral = '++id,contact,message,attachmentCount,createdAt,success,reason';

class SendLogModel extends Entity<SendLogService> implements SendLogItem {
  id!: number;
  contact!: FormattedContact;
  message!: string;
  createdAt!: number;
  attachmentCount?: number;
  success?: boolean;
  reason?: string;
}

export class SendLogService extends Dexie {
  private static instance?: SendLogService;

  static mount() {
    if (!SendLogService.instance) {
      SendLogService.instance = new SendLogService();
    }

    return SendLogService.instance;
  }

  static unmount() {
    if (SendLogService.instance) {
      SendLogService.instance.close();
      delete SendLogService.instance;
    }
  }

  private constructor() {
    super(sendLogsTableName);

    this.version(1).stores({
      [sendLogsTableName]: sendLogsTableColumnLiteral,
    });

    this.sendLogs.mapToClass(SendLogModel);
  }

  private sendLogs!: EntityTable<SendLogItem, 'id'>;

  async addSendLog(item: AddSendLogItem): Promise<number> {
    return this.sendLogs.add({
      ...item,
      createdAt: Date.now(),
    });
  }

  async updateSendLog(id: number, item: UpdateSendLogItem): Promise<number> {
    return this.sendLogs.update(id, item);
  }

  async listSendLogs(
    offset = 0,
    limit = 10,
    orderBy?: SendLogDbQuerySortBy[],
    searchs?: SearchByOptions<SendLogItem>[],
  ): Promise<SendLogDbListResult> {
    const querying = this.sendLogs;
    let collection = querying.toCollection();

    console.log('searchs:', searchs);

    if (orderBy && orderBy.length > 0) {
      for (const orderItem of orderBy) {
        const { field, order } = orderItem;
        collection = querying.orderBy(field);
        if (order === 'desc') {
          collection = collection.reverse();
        }
      }
    } else {
      collection = querying.orderBy('createdAt');
    }

    if (searchs && searchs.length > 0) {
      for (const searchItem of searchs) {
        const { key, search } = searchItem;

        console.log('searchItem:', 'key:', key, 'value:', search);

        collection = collection.filter((item) => {
          console.log('item[key]:', item[key]);

          if (typeof item[key] === 'string') {
            const isMatch = fuzzyMatch(item[key], search);
            return isMatch;
          } else if (typeof item[key] === 'number') {
            return item[key] === Number(search);
          } else if (typeof item[key] === 'boolean') {
            return item[key] === !!Number(search);
          } else if (Array.isArray(item[key])) {
            return item[key].some((item) => fuzzyMatch(item, search));
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

  async getLog(id: number) {
    return this.sendLogs.get(id);
  }

  async deleteLog(id: number) {
    return this.sendLogs.delete(id);
  }

  async bulkDeleteLogs(ids: number[]) {
    return this.sendLogs.bulkDelete(ids);
  }

  async clearLogs() {
    return this.sendLogs.clear();
  }
}
