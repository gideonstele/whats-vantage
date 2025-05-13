import { ListResponseType, SearchByOptions, SoryByOptions } from 'types/common';
import { SendLogItem } from 'types/domain/send-logs';

export type AddSendLogItem = Omit<SendLogItem, 'id' | 'createdAt'>;

export type PutSendLogItem = AddSendLogItem;

export type UpdateSendLogItem = Partial<Omit<SendLogItem, 'id' | 'createdAt'>>;

export type SendLogDbQuerySortBy = SoryByOptions<'createdAt' | 'updatedAt'>;

export interface SendLogDbListParams {
  offset: number;
  limit: number;
  orderBy?: SendLogDbQuerySortBy[];
  searchs?: SearchByOptions<SendLogItem>[];
}

export type SendLogDbListResult = ListResponseType<SendLogItem, Error>;
