import { useMemo } from 'react';

import { useMemoizedFn, useSize } from 'ahooks';
import { Button, Flex, Popconfirm, Result, Space, Table } from 'antd';
import { ColumnType } from 'antd/es/table';

import { CustomVariablesItem } from 'types/db/custom-variables';

import { TableUglyStyleOverrideWrapper } from '../../components/antd-table-fixed.styled';
import { useQueryCustomVariables } from '../../query/custom-variables';

import { CustomVariableAddButton } from './components/add-item';
import { useDeleteItem } from './hooks/use-delete-item';

export interface CustomVariablesViewrops {
  parentRef?: HTMLDivElement | null;
  fixedHeightValue?: number;
}

export const CustomVariablesView = ({ parentRef, fixedHeightValue = 0 }: CustomVariablesViewrops) => {
  const parentSize = useSize(parentRef);

  const scrollInfo = useMemo(() => {
    if (parentSize) {
      return { y: parentSize.height - fixedHeightValue, x: parentSize.width - 64 };
    }

    return { y: 'auto', x: 'auto' };
  }, [fixedHeightValue, parentSize]);

  const { data, isError, isLoading } = useQueryCustomVariables();
  const { deletingKey, handleDelete, isDeleting } = useDeleteItem();

  const columns = useMemo<ColumnType<CustomVariablesItem>[]>(
    () => [
      {
        title: '名称',
        dataIndex: 'label',
        key: 'label',
        width: 120,
        align: 'center',
      },
      {
        title: '值',
        dataIndex: 'value',
        key: 'value',
        width: 150,
        align: 'center',
        ellipsis: true,
      },
      {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        width: 90,
        align: 'center',
        render: (_, record) => {
          return record.type === 'intergration' ? '内置' : '自定义';
        },
      },
      {
        title: '描述',
        dataIndex: 'description',
        key: 'description',
        minWidth: 180,
        ellipsis: true,
      },
      {
        title: '操作',
        key: 'action',
        align: 'center',
        render: (_, record) => {
          const isIntegration = record.type === 'intergration';

          if (isIntegration) {
            return null;
          }

          return (
            <Space size="small">
              <Button type="link"></Button>
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

  const footerRender = useMemoizedFn(() => (
    <Flex justify="flex-end">
      <CustomVariableAddButton />
    </Flex>
  ));

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
        footer={footerRender}
      />
    </TableUglyStyleOverrideWrapper>
  );
};
