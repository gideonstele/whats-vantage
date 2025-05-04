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
      messageApi.success(message || '获取联系人成功');
    } else {
      messageApi.error(message || '获取联系人失败');
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
          从 WhatsApp 同步联系人
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
