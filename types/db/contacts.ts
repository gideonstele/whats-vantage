import { ListResponseType, SearchByOptions, SoryByOptions } from '../common';
import { FormattedContact } from '../domain/contacts';

export type AddContactItem = FormattedContact;

export type UpdateContactItem = Partial<FormattedContact>;

export type UpdateContactPayload = {
  id: string;
  item: UpdateContactItem;
};

export type ContactDbQuerySortBy = SoryByOptions<'id' | 'name' | 'createdAt'>;

export interface DbFormattedContactItem extends FormattedContact {
  createdAt: string;
  updatedAt: string;
}

export interface ContactDbListParams {
  offset: number;
  limit: number;
  orderBy?: ContactDbQuerySortBy[];
  searchs?: SearchByOptions<FormattedContact>[];
}

export type ContactDbListResult = ListResponseType<DbFormattedContactItem, Error>;
