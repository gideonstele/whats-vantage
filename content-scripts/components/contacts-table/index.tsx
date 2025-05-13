/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode, useMemo } from 'react';

import { useMemoizedFn, useSize } from 'ahooks';
import { Avatar, Space, Table, Typography } from 'antd';
import { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { SearchIcon } from 'lucide-react';

import { FormattedContact } from 'types/domain/contacts';

import { TableUglyStyleOverrideWrapper } from '../antd-table-fixed.styled';

import { FilterContactName } from './components/filter-contact-name';
import { FilterContactPhoneNumber } from './components/filter-contact-phone-number';
import { ContactTableFilterDropdown } from './components/filter-contact-status';
import { FilterIcon } from './components/filter-icon';
import { StatusList } from './components/status';

export {
  PaginatedContactsProvider,
  SelectedContactsProvider,
  usePaginatedContactsData,
  useSelectedContacts,
} from './contexts/contacts';

export interface ContactsDataSource {
  data?: FormattedContact[];
  selectedData?: FormattedContact[];
  setSelectedData?: (data: FormattedContact[]) => void;
  isLoading?: boolean;
  pageSize?: number;
  page?: number;
  total?: number;
  setPage?: (page: number) => void;
  setPageSize?: (pageSize: number) => void;
  searchParams?: Record<string, any>;
  setSearchName?: (name: string) => void;
  setSearchPhoneNumber?: (phoneNumber: string) => void;
  setIsMyContactQuery?: (value?: boolean) => void;
  setIsManualAddedQuery?: (value?: boolean) => void;
  setIsBusinessQuery?: (value?: boolean) => void;
  resetQuery?: () => void;
}

export interface ContactsTableProps {
  viewRef?: HTMLDivElement | null;
  dataSource: ContactsDataSource;
  renderPhoneNumberAction?: (record: FormattedContact) => ReactNode;
}

export const ContactsTable = ({ viewRef, dataSource, renderPhoneNumberAction }: ContactsTableProps) => {
  const {
    data,
    selectedData,
    setSelectedData,
    isLoading,
    pageSize = 10,
    page = 1,
    total = 0,
    setPage,
    setPageSize,
    searchParams = {},
    setSearchName,
    setSearchPhoneNumber,
    setIsMyContactQuery,
    setIsManualAddedQuery,
    setIsBusinessQuery,
    resetQuery,
  } = dataSource;

  const size = useSize(viewRef);

  const scrollInfo = useMemo(() => {
    if (size) {
      return { y: size.height - 278, x: size.width - 64 };
    }

    // virtual table must set a number size
    return { y: 768, x: 540 };
  }, [size]);

  const columns = useMemo<ColumnsType<FormattedContact>>(
    () => [
      {
        title: '联系人',
        dataIndex: 'name',
        key: 'name',
        align: 'left',
        className: 'table-cell-left',
        width: 200,
        filterIcon() {
          return (
            <FilterIcon
              filterKeys={['name']}
              Icon={SearchIcon}
              searchParams={searchParams}
            />
          );
        },
        filterDropdown(props) {
          return (
            <FilterContactName
              {...props}
              setSearchName={setSearchName}
              initialValue={searchParams.name}
            />
          );
        },
        render: (text, record) => {
          return (
            <Space>
              <Avatar src={record.avatar} />
              <Typography.Text>{text}</Typography.Text>
            </Space>
          );
        },
      },
      {
        title: '联系方式',
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
        align: 'left',
        className: 'table-cell-left',
        width: 200,
        filterIcon() {
          return (
            <FilterIcon
              filterKeys={['phoneNumber']}
              Icon={SearchIcon}
              searchParams={searchParams}
            />
          );
        },
        filterDropdown(props) {
          return (
            <FilterContactPhoneNumber
              {...props}
              setSearchPhoneNumber={setSearchPhoneNumber}
              initialValue={searchParams.phoneNumber}
            />
          );
        },
        render: (text, record) => {
          if (renderPhoneNumberAction && record.isManualAdded) {
            return renderPhoneNumberAction(record);
          }
          return <Typography.Text>{text}</Typography.Text>;
        },
      },
      {
        title: '状态',
        dataIndex: 'id',
        key: 'status',
        align: 'center',
        className: 'table-cell-center',
        width: 150,
        filterIcon() {
          return (
            <FilterIcon
              filterKeys={['isBusiness', 'isMyContact', 'isManualAdded']}
              searchParams={searchParams}
            />
          );
        },
        filterDropdown(props) {
          return (
            <ContactTableFilterDropdown
              {...props}
              searchParams={searchParams}
              setIsMyContactQuery={setIsMyContactQuery}
              setIsManualAddedQuery={setIsManualAddedQuery}
              setIsBusinessQuery={setIsBusinessQuery}
              resetQuery={resetQuery}
            />
          );
        },
        render: (_, record) => {
          return <StatusList {...record} />;
        },
      },
    ],
    [
      renderPhoneNumberAction,
      searchParams,
      setSearchName,
      setSearchPhoneNumber,
      setIsMyContactQuery,
      setIsManualAddedQuery,
      setIsBusinessQuery,
      resetQuery,
    ],
  );

  const handleSelectionChange = useMemoizedFn((_, selectedRows: FormattedContact[]) => {
    setSelectedData?.(selectedRows);
  });

  const pagination = useMemo<false | TablePaginationConfig>(() => {
    if (setPage && setPageSize) {
      return {
        showTotal: (total, range) => `${range[0]}-${range[1]}，共 ${total} 条`,
        pageSize,
        current: page,
        total,
        size: 'small',
        pageSizeOptions: [10, 20, 50, 100, 200],
        onChange: (page, pageSize) => {
          setPage(page);
          setPageSize(pageSize);
        },
        onShowSizeChange(current, size) {
          setPage(current);
          setPageSize(size);
        },
        showSizeChanger: true,
      };
    }

    return false;
  }, [page, pageSize, setPage, setPageSize, total]);

  return (
    <TableUglyStyleOverrideWrapper>
      <Table
        sticky
        size="small"
        virtual
        getPopupContainer={() => viewRef || document.querySelector('[data-wxt-integrated]') || document.body}
        rowSelection={{
          type: 'checkbox',
          columnWidth: 50,
          selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
          selectedRowKeys: selectedData?.map((contact) => contact.id) || [],
          onChange: handleSelectionChange,
        }}
        scroll={scrollInfo}
        rowKey="id"
        dataSource={data || []}
        loading={isLoading}
        columns={columns}
        pagination={pagination}
      />
    </TableUglyStyleOverrideWrapper>
  );
};
