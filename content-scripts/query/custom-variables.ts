import { isNil } from 'lodash-es';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { sendMessageToBackground, UpdateCustomVariablesItemPayload } from '@services/background-messager';
import { AddCustomVariablesItem, CustomVariablesItem } from 'types/db/custom-variables';

export const useQueryCustomVariables = () => {
  return useQuery({
    queryKey: ['background/db/custom-variables/list'],
    queryFn: async () => {
      const result = await sendMessageToBackground('db:custom-variables:list', undefined);
      return result || [];
    },
  });
};

export const useQueryCustomVariable = (id: number) => {
  return useQuery({
    queryKey: ['background/db/custom-variables/item', id] as const,
    queryFn: async ({ queryKey: [, id] }) => {
      const result = await sendMessageToBackground('db:custom-variables:item', id);
      return result || {};
    },
    enabled: !isNil(id),
  });
};

export const useMutationCustomVariableAdd = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['background/db/custom-variables/add'],
    mutationFn: async (item: AddCustomVariablesItem) => {
      return await sendMessageToBackground('db:custom-variables:add', item);
    },
    onSuccess: (data, item) => {
      const newId = data || Number(`${Math.random()}`.slice(2, 11));

      const newItem = { ...item, id: newId };

      queryClient.setQueryData<CustomVariablesItem>(['background/db/custom-variables/item', data], (prev) => {
        if (isNil(prev)) {
          return undefined;
        }

        return {
          ...prev,
          ...newItem,
        };
      });
      queryClient.setQueryData<CustomVariablesItem[]>(['background/db/custom-variables/list'], (prev) => {
        if (isNil(prev)) {
          return [];
        }

        return [...prev, newItem];
      });
    },
  });
};

export const useMutationCustomVariableUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['background/db/custom-variables/update'],
    mutationFn: async (payload: UpdateCustomVariablesItemPayload) => {
      return await sendMessageToBackground('db:custom-variables:update', payload);
    },
    onSuccess: (data, payload) => {
      if (data !== undefined) {
        queryClient.setQueryData<CustomVariablesItem>(['background/db/custom-variables/item', payload.id], (prev) => {
          if (isNil(prev)) {
            return undefined;
          }

          return {
            ...prev,
            ...payload.item,
          };
        });

        queryClient.setQueryData<CustomVariablesItem[]>(['background/db/custom-variables/list'], (prev) => {
          if (isNil(prev)) {
            return [];
          }

          return prev.map((item) => (item.id === payload.id ? { ...item, ...payload.item } : item));
        });
      }
    },
  });
};

export const useMutationCustomVariableDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['background/db/custom-variables/delete'],
    mutationFn: async (id: number) => {
      return await sendMessageToBackground('db:custom-variables:delete', id);
    },
    onSuccess: (_, id) => {
      queryClient.setQueryData<CustomVariablesItem[]>(['background/db/custom-variables/list'], (prev) => {
        if (isNil(prev)) {
          return [];
        }

        return prev.filter((item) => item.id !== id);
      });
    },
  });
};

export const useMutationCustomVariableClear = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['background/db/custom-variables/clear'],
    mutationFn: async () => {
      return await sendMessageToBackground('db:custom-variables:clear', undefined);
    },
    onSuccess: () => {
      queryClient.setQueryData<CustomVariablesItem[]>(['background/db/custom-variables/list'], []);
    },
  });
};
