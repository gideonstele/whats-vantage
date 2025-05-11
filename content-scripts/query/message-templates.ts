import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { sendMessageToBackground, UpdateMessageTemplateItemPayload } from '@services/background-messager';
import { AddMessageTemplateItem } from 'types/db/message-templates';
import { MessageTemplateItem } from 'types/domain/message-templates';

// Get all message templates
export const useQueryMessageTemplates = () => {
  return useQuery({
    queryKey: ['background/db/message-templates/list'],
    queryFn: async () => {
      try {
        return await sendMessageToBackground('db:message-templates:list', undefined);
      } catch (e) {
        console.error(e);
        return [];
      }
    },
    placeholderData: keepPreviousData,
  });
};

// Get a single message template
export const useQueryMessageTemplateItem = (id: number) => {
  return useQuery({
    queryKey: ['background/db/message-templates/item', id] as const,
    queryFn: async ({ queryKey: [, id] }) => {
      return await sendMessageToBackground('db:message-templates:item', id);
    },
    enabled: !!id,
  });
};

// Add a message template
export const useMutationMessageTemplateAdd = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['background/db/message-templates/add'],
    mutationFn: async (template: AddMessageTemplateItem) => {
      return await sendMessageToBackground('db:message-templates:add', template);
    },
    onSuccess: (id, template) => {
      const newItem = { ...template, id };

      queryClient.setQueryData<MessageTemplateItem>(['background/db/message-templates/item', id], () => {
        return newItem as MessageTemplateItem;
      });

      queryClient.invalidateQueries({ queryKey: ['background/db/message-templates/list'] });
    },
  });
};

// Update a message template
export const useMutationMessageTemplateUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['background/db/message-templates/update'],
    mutationFn: async (params: UpdateMessageTemplateItemPayload) => {
      return await sendMessageToBackground('db:message-templates:update', params);
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['background/db/message-templates/item', id] });
      queryClient.invalidateQueries({ queryKey: ['background/db/message-templates/list'] });
    },
  });
};

// Delete a message template
export const useMutationMessageTemplateDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['background/db/message-templates/delete'],
    mutationFn: async (id: number) => {
      return await sendMessageToBackground('db:message-templates:delete', id);
    },
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: ['background/db/message-templates/item', id] });
      queryClient.invalidateQueries({ queryKey: ['background/db/message-templates/list'] });
    },
  });
};
