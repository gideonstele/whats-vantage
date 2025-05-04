import { useMemoizedFn } from 'ahooks';
import { useImmer } from 'use-immer';

import createContextContainer from '@hooks/create-context-container';

export interface AccountValidateData {
  id: string;
  phone: string;
  isExists: boolean;
}

/**
 * 缓存联系人查询记录
 */
export const [AccountValidateRecordContextProvider, useAccountValidateRecord] = createContextContainer(
  function useAccountValidateRecordContext() {
    const [accountValidateRecords, setAccountValidateRecords] = useImmer<AccountValidateData[]>([]);

    const addAccountValidateRecord = useMemoizedFn((record: AccountValidateData) => {
      setAccountValidateRecords((draft) => {
        const index = draft.findIndex((item) => item.id === record.id);
        if (index !== -1) {
          draft[index] = record;
        } else {
          draft.push(record);
        }
      });
    });

    const clearAccountValidateRecords = useMemoizedFn(() => {
      setAccountValidateRecords([]);
    });

    return {
      accountValidateRecords,
      addAccountValidateRecord,
      clearAccountValidateRecords,
    };
  },
);
