import { ReactNode } from 'react';

import { AccountValidateRecordContextProvider } from '@content-scripts/views/contacts-new/account-validate/provider';

import { PaginatedContactsProvider, SelectedContactsProvider } from '../../components/contacts-table';

export const AccountsCombinedProviders = ({ children }: { children: ReactNode }) => {
  return (
    <PaginatedContactsProvider>
      <SelectedContactsProvider>
        <AccountValidateRecordContextProvider>{children}</AccountValidateRecordContextProvider>
      </SelectedContactsProvider>
    </PaginatedContactsProvider>
  );
};
