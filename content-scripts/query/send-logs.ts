import { isNil } from 'lodash-es';

import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { sendMessageToBackground } from '@services/background-messager';
import { AddSendLogItem, SendLogDbListParams } from 'types/db/send-logs';
import { SendLogItem } from 'types/domain/send-logs';

import { QuerySendLogsKey, QuerySendLogsOption } from './type';

export const useQuerySendLogs = (params?: SendLogDbListParams | undefined, options: QuerySendLogsOption = {}) => {
  return useQuery({
    queryKey: ['background/db/send-logs/list', params] as QuerySendLogsKey,
    queryFn: async ({ queryKey: [, params] }) => {
      try {
        console.log('params:', params);
        const result = await sendMessageToBackground('db:send-logs:list', params);
        return (
          result || {
            data: [],
            success: false,
            total: 0,
            error: new Error('获取发送日志列表失败'),
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
  });
};

// 获取单个发送日志
export const useQuerySendLogItem = (id: number) => {
  return useQuery({
    queryKey: ['background/db/send-logs/item', id] as const,
    queryFn: async ({ queryKey: [, id] }) => {
      return await sendMessageToBackground('db:send-logs:item', id);
    },
    enabled: !!id,
  });
};

// 添加发送日志
export const useMutationSendLogAdd = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['background/db/send-logs/add'],
    mutationFn: async (log: AddSendLogItem) => {
      return await sendMessageToBackground('db:send-logs:add', log);
    },
    onSuccess: (id, log) => {
      const newId = id || Number(`${Math.random()}`.slice(2, 11));
      const newItem = { ...log, id: newId, createdAt: Date.now() };

      queryClient.setQueryData<SendLogItem>(['background/db/send-logs/item', id], (prev) => {
        if (isNil(prev)) {
          return undefined;
        }

        return {
          ...prev,
          ...newItem,
        };
      });

      // 在成功添加后，更新缓存
      queryClient.invalidateQueries({ queryKey: ['background/db/send-logs/list'] });
    },
  });
};

// 删除发送日志
export const useMutationSendLogDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['background/db/send-logs/delete'],
    mutationFn: async (id: number) => {
      return await sendMessageToBackground('db:send-logs:delete', id);
    },
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['background/db/send-logs/item', id] });
      queryClient.invalidateQueries({ queryKey: ['background/db/send-logs/list'] });
    },
  });
};

// 批量删除发送日志
export const useMutationSendLogsBulkDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['background/db/send-logs/bulk-delete'],
    mutationFn: async (ids: number[]) => {
      return await sendMessageToBackground('db:send-logs:bulk-delete', ids);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['background/db/send-logs/list'] });
    },
  });
};

// 清空所有发送日志
export const useMutationSendLogsClear = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['background/db/send-logs/clear'],
    mutationFn: async () => {
      return await sendMessageToBackground('db:send-logs:clear', undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['background/db/send-logs/list'] });
    },
  });
};
