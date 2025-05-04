import { useMemo } from 'react';

import { Table, Tag } from 'antd';

import { useWindowSize } from '@hooks/use-window-size';

import { useAccountValidateRecord } from '../provider';

export const AccountValidateRecord = () => {
  const columns = useMemo(
    () => [
      {
        title: '账号',
        dataIndex: 'phone',
        key: 'phone',
        ellipsis: true,
      },
      {
        title: '是否存在',
        dataIndex: 'isExists',
        key: 'isExists',
        render: (isExists: boolean) => <Tag color={isExists ? 'green' : 'red'}>{isExists ? '存在' : '不存在'}</Tag>,
      },
    ],
    [],
  );

  const { height } = useWindowSize();

  const scrollHeight = useMemo(() => {
    return height - 480;
  }, [height]);

  const { accountValidateRecords } = useAccountValidateRecord();

  if (accountValidateRecords.length === 0) {
    return null;
  }

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={accountValidateRecords}
      pagination={false}
      scroll={{ y: scrollHeight }}
    />
  );
};
