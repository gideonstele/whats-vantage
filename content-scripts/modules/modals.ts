import { CustomVariablesModal } from './auto-send/custom-variables';
import { MessageTemplatesModal } from './auto-send/message-templates';
import { AccountValidateModal } from './contacts/account-validate';
import { ContactsModal } from './contacts/management';
import { SettingsModal } from './settings';

export const configModals = {
  contacts: ContactsModal,
  accountValidate: AccountValidateModal,
  customVariables: CustomVariablesModal,
  messageTemplates: MessageTemplatesModal,
  settings: SettingsModal,
} as const;

export type ConfigModals = typeof configModals;
