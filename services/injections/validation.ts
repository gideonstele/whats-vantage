import { validateAccount, validateAccounts } from '../helpers/validate-exists';
import { onMessageToWppInjected } from '../injected-messager';

export const initValidation = () => {
  onMessageToWppInjected('injected:validate-account', async ({ data: contactId }) => {
    return validateAccount(contactId);
  });

  onMessageToWppInjected('injected:validate-accounts', async ({ data: contactIds }) => {
    return validateAccounts(contactIds);
  });
};
