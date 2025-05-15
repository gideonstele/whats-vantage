import { UseQueryOptions } from '@tanstack/react-query';

import { ContactDbListParams, ContactDbListResult } from 'types/db/contacts';
import { SendLogDbListParams, SendLogDbListResult } from 'types/db/send-logs';

// 联系人列表查询
export type QueryContactsKey = [string, ContactDbListParams | undefined];

export type QueryContactsOption = Omit<
  UseQueryOptions<ContactDbListResult, Error, ContactDbListResult, QueryContactsKey>,
  'queryFn' | 'queryKey' | 'placeholderData'
>;

// 发送日志列表查询
export type QuerySendLogsKey = [string, SendLogDbListParams | undefined];

export type QuerySendLogsOption = Omit<
  UseQueryOptions<SendLogDbListResult, Error, SendLogDbListResult, QuerySendLogsKey>,
  'queryFn' | 'queryKey' | 'placeholderData'
>;
