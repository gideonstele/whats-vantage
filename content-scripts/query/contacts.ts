import dayjs from 'dayjs';
import { isNil } from 'lodash-es';

import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { sendMessageToBackground } from '@services/background-message';
import { sendMessageToWppInjected } from '@services/injected-messager';
import { AddContactItem, ContactDbListParams, DbFormattedContactItem, UpdateContactPayload } from 'types/db/contacts';
import { ValidateAccountsPayload } from 'types/domain/send-message';

import { QueryContactsKey, QueryContactsOption } from './type';

export const useQueryContacts = (params?: ContactDbListParams | undefined, options: QueryContactsOption = {}) => {
  return useQuery({
    queryKey: ['background/db/contacts/list', params] as QueryContactsKey,
    queryFn: async ({ queryKey: [, params] }) => {
      try {
        const result = await sendMessageToBackground('db:contacts:list', params);
        return (
          result || {
            data: [],
            success: false,
            total: 0,
            error: new Error('获取联系人列表失败'),
          }
        );
      } catch (e) {
        console.error(e);
        return {
          data: [],
          total: 0,
          success: false,
          error: e as Error,
        };
      }
    },
    placeholderData: keepPreviousData,
    ...options,
    networkMode: 'always',
  });
};

// 获取单个联系人
export const useQueryContactItem = (id: string) => {
  return useQuery({
    queryKey: ['background/db/contacts/item', id] as const,
    queryFn: async ({ queryKey: [, id] }) => {
      return await sendMessageToBackground('db:contacts:item', id);
    },
    enabled: !!id,
  });
};

// 添加联系人
export const useMutationContactAdd = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['background/db/contacts/add'],
    mutationFn: async (contact: AddContactItem) => {
      return await sendMessageToBackground('db:contacts:add', contact);
    },
    onSuccess: (id, contact) => {
      const newItem = { ...contact, createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss') };

      queryClient.setQueryData<DbFormattedContactItem>(['background/db/contacts/item', id], (prev) => {
        if (isNil(prev)) {
          return undefined;
        }

        return {
          ...prev,
          ...newItem,
        };
      });

      queryClient.invalidateQueries({ queryKey: ['background/db/contacts/list'] });
    },
    networkMode: 'always',
  });
};

// 批量添加联系人
export const useMutationContactsBulkAdd = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['background/db/contacts/bulk-add'],
    mutationFn: async (contacts: AddContactItem[]) => {
      return await sendMessageToBackground('db:contacts:bulk-add', contacts);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['background/db/contacts/list'] });
    },
    networkMode: 'always',
  });
};

// 更新联系人
export const useMutationContactUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['background/db/contacts/update'],
    mutationFn: async (params: UpdateContactPayload) => {
      return await sendMessageToBackground('db:contacts:update', params);
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['background/db/contacts/item', id] });
      queryClient.invalidateQueries({ queryKey: ['background/db/contacts/list'] });
    },
    networkMode: 'always',
  });
};

// 删除联系人
export const useMutationContactDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['background/db/contacts/delete'],
    mutationFn: async (id: string) => {
      return await sendMessageToBackground('db:contacts:delete', id);
    },
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['background/db/contacts/item', id] });
      queryClient.invalidateQueries({ queryKey: ['background/db/contacts/list'] });
    },
    networkMode: 'always',
  });
};

// 批量删除联系人
export const useMutationContactsBulkDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['background/db/contacts/bulk-delete'],
    mutationFn: async (ids: string[]) => {
      return await sendMessageToBackground('db:contacts:bulk-delete', ids);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['background/db/contacts/list'] });
    },
    networkMode: 'always',
  });
};

// 清空所有联系人
export const useMutationContactsClear = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['background/db/contacts/clear'],
    mutationFn: async () => {
      return await sendMessageToBackground('db:contacts:clear', undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['background/db/contacts/list'] });
    },
    networkMode: 'always',
  });
};

export const useValidateAccountsMutation = () => {
  return useMutation({
    mutationKey: ['injected/contacts/validate-accounts'],
    mutationFn: async (ids: ValidateAccountsPayload) => {
      return await sendMessageToWppInjected('injected:validate-accounts', ids);
    },
    networkMode: 'always',
  });
};
