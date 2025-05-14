import { useMemo } from 'react';

import { useSize } from 'ahooks';
import { Button, Flex, Popconfirm, Result, Space, Table, Tooltip } from 'antd';
import { ColumnType } from 'antd/es/table';

import { TableUglyStyleOverrideWrapper } from '@content-scripts/components/antd-table-fixed.styled';
import { MessageTemplateItem } from 'types/domain/message-templates';

import { useQueryMessageTemplates } from '../../query/message-templates';

import { TemplateAddButton } from './components/add-template-button';
import { EditTemplateButton } from './components/edit-template-button';
import { StyledTemplateCell } from './components/template-cell';
import { useDeleteItem } from './hooks/use-delete-item';

export interface MessageTemplatesViewProps {
  parentRef?: HTMLDivElement | null;
  fixedHeightValue?: number;
}

export const MessageTemplatesView = ({ parentRef, fixedHeightValue = 0 }: MessageTemplatesViewProps) => {
  const parentSize = useSize(parentRef);

  const scrollInfo = useMemo(() => {
    if (parentSize) {
      return { y: parentSize.height - fixedHeightValue, x: parentSize.width - 64 };
    }

    return { y: 'auto', x: 'auto' };
  }, [fixedHeightValue, parentSize]);

  const { data, isError, isLoading } = useQueryMessageTemplates();

  const { handleDelete, isDeleting, deletingKey } = useDeleteItem();

  const columns = useMemo<ColumnType<MessageTemplateItem>[]>(
    () => [
      {
        title: '模板名称',
        dataIndex: 'title',
        key: 'title',
        align: 'center',
        width: 150,
      },
      {
        title: '模板内容',
        dataIndex: 'content',
        key: 'content',
        ellipsis: true,
        align: 'center',
        render: (content: string, _record) => {
          return <StyledTemplateCell>{content}</StyledTemplateCell>;
        },
      },
      {
        title: '操作',
        key: 'action',
        width: 150,
        render: (_, record) => {
          return (
            <Space size="small">
              <EditTemplateButton
                templateId={record.id}
                value={record}
                type="link"
              />
              <Popconfirm
                title="确定要删除吗？"
                onConfirm={() => handleDelete(record.id)}
                okText="删除"
                cancelText="取消"
              >
                <Button
                  type="link"
                  loading={isDeleting && deletingKey === record.id}
                >
                  删除
                </Button>
              </Popconfirm>
            </Space>
          );
        },
      },
    ],
    [deletingKey, handleDelete, isDeleting],
  );

  if (isError) {
    return (
      <Result
        status="error"
        title="获取模板失败"
        subTitle="请重新安装插件或联系客服"
      />
    );
  }

  return (
    <TableUglyStyleOverrideWrapper>
      <Table
        size="small"
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={isLoading}
        pagination={false}
        scroll={scrollInfo}
        footer={() => (
          <Flex justify="flex-end">
            <TemplateAddButton />
          </Flex>
        )}
      />
    </TableUglyStyleOverrideWrapper>
  );
};
