import { AccountValidateModal } from './contacts/account-validate';
import { ContactsModal } from './contacts/management';
import { SettingsModal } from './settings';

export const configModals = {
  contacts: ContactsModal,
  accountValidate: AccountValidateModal,
  settings: SettingsModal,
} as const;

export type ConfigModals = typeof configModals;
