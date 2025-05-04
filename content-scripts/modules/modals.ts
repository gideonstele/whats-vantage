import { AccountValidateModal } from './contacts/account-validate';
import { ContactsModal } from './contacts/management';

export const configModals = {
  contacts: ContactsModal,
  accountValidate: AccountValidateModal,
} as const;

export type ConfigModals = typeof configModals;
