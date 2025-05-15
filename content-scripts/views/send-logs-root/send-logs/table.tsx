import { useMemo } from 'react';

import { useSize } from 'ahooks';
import { Avatar, Badge, Space, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { TablePaginationConfig, TableRowSelection } from 'antd/es/table/interface';

import { TableUglyStyleOverrideWrapper } from '@content-scripts/components/antd-table-fixed.styled';
import { SendLogItem } from 'types/domain/send-logs';

import { DeleteItemButton } from './components/delete-item-button';
import { RenderItemDisplayTime } from './components/render-item-display-time';
import { useLogsData } from './providers/data';

interface SendLogsTableProps {
  parentViewRef?: HTMLElement | null;
}

export const SendLogsTable = ({ parentViewRef }: SendLogsTableProps) => {
  const size = useSize(parentViewRef);

  const columns = useMemo<ColumnsType<SendLogItem>>(
    () => [
      {
        title: '联系人',
        dataIndex: 'contact',
        key: 'contact',
        align: 'left',
        width: 120,
        ellipsis: true,
        render: (contact: SendLogItem['contact']) => {
          return (
            <Space>
              <Avatar src={contact.avatar} />
              <Typography.Text>{contact.name}</Typography.Text>
            </Space>
          );
        },
      },
      {
        title: '消息内容',
        dataIndex: 'message',
        key: 'message',
        align: 'left',
        ellipsis: true,
        minWidth: 150,
        width: 220,
        render: (message: SendLogItem['message']) => {
          return <Typography.Text ellipsis>{message}</Typography.Text>;
        },
      },
      {
        title: '发送时间',
        dataIndex: 'createdAt',
        key: 'createdAt',
        align: 'center',
        width: 160,
        render: (createdAt: SendLogItem['createdAt']) => {
          return <RenderItemDisplayTime value={createdAt}></RenderItemDisplayTime>;
        },
      },
      {
        title: '状态',
        dataIndex: 'success',
        key: 'success',
        align: 'center',
        width: 120,
        render: (success: SendLogItem['success']) => {
          return success ? (
            <Badge
              status="success"
              text="成功"
            />
          ) : (
            <Badge
              status="error"
              text="失败"
            />
          );
        },
      },
      {
        title: '操作',
        key: 'actions',
        align: 'center',
        width: 90,
        render: (_, record) => (
          <Space size="small">
            <DeleteItemButton id={record.id} />
          </Space>
        ),
      },
    ],
    [],
  );

  const { page, pageSize, setPage, setPageSize, data, selectedLogs, setSelectedLogs, isLoading } = useLogsData();

  const rowSelection = useMemo<TableRowSelection<SendLogItem>>(() => {
    return {
      type: 'checkbox',
      columnWidth: 50,
      selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
      selectedRowKeys: selectedLogs.map((log) => log.id),
      onChange: (_, selectedRows) => {
        setSelectedLogs(selectedRows);
      },
    };
  }, [selectedLogs, setSelectedLogs]);

  const pagination = useMemo<TablePaginationConfig>(() => {
    return {
      showTotal: (total, range) => `${range[0]}-${range[1]}，共 ${total} 条`,
      pageSize,
      current: page,
      total: data?.total || 0,
      size: 'small',
      onChange: (page, pageSize) => {
        setPage(page);
        setPageSize(pageSize);
      },
      onShowSizeChange(current, size) {
        setPage(current);
        setPageSize(size);
      },
      showSizeChanger: true,
      showQuickJumper: true,
    };
  }, [page, pageSize, setPage, setPageSize, data?.total]);

  return (
    <TableUglyStyleOverrideWrapper>
      <Table<SendLogItem>
        sticky
        rowKey="id"
        size="small"
        getPopupContainer={() => parentViewRef || document.querySelector('[data-wxt-integrated]') || document.body}
        columns={columns}
        dataSource={data?.data}
        loading={isLoading}
        rowSelection={rowSelection}
        pagination={pagination}
        scroll={{ y: size?.height ? size?.height - 120 : 'auto' }}
      ></Table>
    </TableUglyStyleOverrideWrapper>
  );
};
