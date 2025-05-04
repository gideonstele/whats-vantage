# Contacts Table 组件

这是一个通用的联系人表格组件，用于显示联系人数据，支持分页、过滤搜索和选择功能。

## 特点

- 标准化的联系人表格界面
- 支持分页显示
- 支持过滤搜索（姓名、电话号码、类型）
- 支持多选功能
- 支持自定义操作功能
- 与业务逻辑解耦，更易于复用

## 基本用法

```tsx
import { ContactsTable } from '@services/wpp/content-scripts/components/contacts-table';
import { FormattedContact } from '@services/wpp/type';

// 基本用法
const MyComponent = () => {
  const [data, setData] = useState<FormattedContact[]>([]);
  const [selectedData, setSelectedData] = useState<FormattedContact[]>([]);

  const dataSource = {
    data,
    selectedData,
    setSelectedData,
  };

  return <ContactsTable dataSource={dataSource} />;
};
```

## 添加自定义操作

如果需要添加自定义操作（如删除功能），可以使用 `renderPhoneNumberAction` 属性：

```tsx
const MyComponent = () => {
  // ...
  const dataSource = {
    data,
    selectedData,
    setSelectedData,
  };

  const renderPhoneNumberAction = (record: FormattedContact) => {
    if (record.isManualAdded) {
      return (
        <HoverWrapper>
          <Typography.Text>{record.phoneNumber}</Typography.Text>
          <Popconfirm
            title="确定要删除该联系人吗？"
            okText="删除"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(record.id)}
          >
            <Tooltip
              title="删除"
              trigger="hover"
            >
              <Button
                className="suffix"
                shape="circle"
                icon={<DeleteIcon />}
                size="small"
                type="text"
              />
            </Tooltip>
          </Popconfirm>
        </HoverWrapper>
      );
    }
    return <Typography.Text>{record.phoneNumber}</Typography.Text>;
  };

  return (
    <ContactsTable
      dataSource={dataSource}
      renderPhoneNumberAction={renderPhoneNumberAction}
    />
  );
};
```

## 结合已有的 useHooks 使用

如果你已经有一个提供分页和搜索功能的 useHooks（如 `usePaginatedContactsData`），可以轻松集成：

```tsx
const MyComponent = () => {
  // 获取分页和过滤功能的数据源
  const paginatedContactsData = usePaginatedContactsData();
  // 获取选中数据的管理
  const { selectedContacts, setSelectedContacts } = useSelectedContacts();

  // 合并数据源
  const dataSource = {
    ...paginatedContactsData,
    selectedData: selectedContacts,
    setSelectedData: setSelectedContacts,
  };

  return <ContactsTable dataSource={dataSource} />;
};
```

## 属性说明

| 属性                    | 类型                                    | 描述                           | 默认值 |
| ----------------------- | --------------------------------------- | ------------------------------ | ------ |
| viewRef                 | HTMLDivElement \| null                  | 表格容器的 ref                 | -      |
| dataSource              | ContactsDataSource                      | 数据源对象，包含所有数据和方法 | -      |
| renderPhoneNumberAction | (record: FormattedContact) => ReactNode | 自定义渲染联系电话列的回调     | -      |

### ContactsDataSource 接口

| 属性                  | 类型                               | 描述                               | 默认值 |
| --------------------- | ---------------------------------- | ---------------------------------- | ------ |
| data                  | FormattedContact[]                 | 联系人数据                         | []     |
| selectedData          | FormattedContact[]                 | 选中的联系人数据                   | []     |
| setSelectedData       | (data: FormattedContact[]) => void | 设置选中的联系人数据的回调         | -      |
| isLoading             | boolean                            | 是否加载中                         | false  |
| pageSize              | number                             | 每页显示的条数                     | 10     |
| page                  | number                             | 当前页码                           | 1      |
| total                 | number                             | 数据总条数                         | 0      |
| setPage               | (page: number) => void             | 设置页码的回调                     | -      |
| setPageSize           | (pageSize: number) => void         | 设置每页条数的回调                 | -      |
| searchParams          | Record<string, any>                | 搜索参数                           | {}     |
| setSearchName         | (name: string) => void             | 设置姓名搜索的回调                 | -      |
| setSearchPhoneNumber  | (phoneNumber: string) => void      | 设置电话号码搜索的回调             | -      |
| setIsMyContactQuery   | (value?: boolean) => void          | 设置是否为我的联系人搜索的回调     | -      |
| setIsManualAddedQuery | (value?: boolean) => void          | 设置是否为手动添加联系人搜索的回调 | -      |
| setIsBusinessQuery    | (value?: boolean) => void          | 设置是否为商业账号搜索的回调       | -      |
| resetQuery            | () => void                         | 重置搜索的回调                     | -      |
