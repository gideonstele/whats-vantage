import { UseQueryOptions } from '@tanstack/react-query';

import { ContactDbListParams, ContactDbListResult } from 'types/db/contacts';

// 联系人列表查询
export type QueryContactsKey = [string, ContactDbListParams | undefined];

export type QueryContactsOption = Omit<
  UseQueryOptions<ContactDbListResult, Error, ContactDbListResult, QueryContactsKey>,
  'queryFn' | 'queryKey' | 'placeholderData'
>;
