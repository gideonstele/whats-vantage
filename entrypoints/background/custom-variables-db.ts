import { onMessageToBackground } from '@services/background-messager';
import { CustomVariablesService } from '@services/db';

export const initCustomVariablesDbService = () => {
  const customVariablesService = CustomVariablesService.mount();

  onMessageToBackground('db:custom-variables:list', async () => {
    return await customVariablesService.listCustomVariables();
  });

  onMessageToBackground('db:custom-variables:item', async ({ data: payload }) => {
    return await customVariablesService.getCustomVariable(payload);
  });

  onMessageToBackground('db:custom-variables:add', async ({ data: payload }) => {
    return await customVariablesService.addCustomVariable(payload);
  });

  onMessageToBackground('db:custom-variables:update', async ({ data: payload }) => {
    return await customVariablesService.updateCustomVariable(payload.id, payload.item);
  });

  onMessageToBackground('db:custom-variables:delete', async ({ data: payload }) => {
    return await customVariablesService.deleteCustomVariable(payload);
  });

  onMessageToBackground('db:custom-variables:clear', async () => {
    return await customVariablesService.clearCustomVariables();
  });
};
