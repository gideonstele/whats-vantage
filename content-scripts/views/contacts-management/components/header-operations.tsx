import { i18n } from '#i18n';

import { useState } from 'react';

import { useMemoizedFn } from 'ahooks';
import { Button, Flex } from 'antd';
import { RefreshCwIcon } from 'lucide-react';

import { useMessage } from '@hooks/use-message';
import { sendMessageToWppInjected } from '@services/injected-messager';

import { useMutationContactsBulkAdd } from '../../../query/contacts';

import { DownloadTemplateButton } from './operations/download-template-button';
import { ImportContactsButton } from './operations/import-contacts-button';
import { ManualInputButton } from './operations/manual-input-button';

export const HeaderOperations = () => {
  const messageApi = useMessage();
  const { mutateAsync: addContacts, isPending: isAddingContacts } = useMutationContactsBulkAdd();

  const [isFetching, setIsFetching] = useState(false);

  const fetchContacts = useMemoizedFn(async () => {
    setIsFetching(true);
    const { success, data, message } = await sendMessageToWppInjected('injected:fetch-contacts', undefined);

    if (success && data) {
      addContacts(data);
      messageApi.success(message || i18n.t('MODULES.CONTACTS.VIEWS.MANAGEMENT.MESSAGES.FETCH_CONTACTS_SUCCESS'));
    } else {
      messageApi.error(message || i18n.t('MODULES.CONTACTS.VIEWS.MANAGEMENT.MESSAGES.FETCH_CONTACTS_ERROR'));
    }
    setIsFetching(false);
  });

  return (
    <Flex
      justify="space-between"
      gap={8}
    >
      <Flex
        justify="flex-start"
        gap={8}
      >
        <Button
          variant="filled"
          color="primary"
          icon={<RefreshCwIcon />}
          onClick={fetchContacts}
          loading={isFetching || isAddingContacts}
        >
          {i18n.t('MODULES.CONTACTS.VIEWS.MANAGEMENT.HEADER_OPERATIONS.FETCH_CONTACTS')}
        </Button>
      </Flex>
      <Flex
        justify="flex-start"
        gap={8}
      >
        <ManualInputButton />
        <ImportContactsButton />
        <DownloadTemplateButton />
      </Flex>
    </Flex>
  );
};
