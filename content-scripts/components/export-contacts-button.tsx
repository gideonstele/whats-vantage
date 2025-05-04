import { useMemo } from 'react';

import { useMemoizedFn } from 'ahooks';
import { Button, Dropdown, MenuProps, Space } from 'antd';
import { ArrowRightFromLineIcon, ChevronDownIcon } from 'lucide-react';

import { exportContacts } from '@services/helpers/exports';
import { FormattedContact } from 'types/domain/contacts';

export interface ExportContactsButtonProps {
  disabled?: boolean;
  viewRef?: HTMLDivElement | null;
  allContacts: FormattedContact[];
  paginatedContacts?: FormattedContact[];
  selectedContacts: FormattedContact[];
}

export const ExportContactsButton = ({
  disabled,
  viewRef,
  allContacts,
  paginatedContacts,
  selectedContacts,
}: ExportContactsButtonProps) => {
  const hasSelectedContacts = useMemo(() => {
    return selectedContacts.length > 0;
  }, [selectedContacts]);

  const hasPaginatedContacts = useMemo(() => {
    return paginatedContacts && paginatedContacts.length > 0;
  }, [paginatedContacts]);

  const hasContacts = useMemo(() => {
    return allContacts.length > 0;
  }, [allContacts]);

  const onClickMainButton = useMemoizedFn(() => {
    if (hasSelectedContacts) {
      exportContacts(selectedContacts);
    } else {
      exportContacts(allContacts);
    }
  });

  const menuItems = useMemo<MenuProps['items']>(() => {
    return [
      hasPaginatedContacts
        ? {
            label: '导出本页联系人',
            key: 'export-contacts',
            disabled: !hasPaginatedContacts,
          }
        : null,
      hasSelectedContacts
        ? {
            label: '导出全部联系人',
            key: 'export-all-contacts',
          }
        : null,
    ].filter(Boolean) as MenuProps['items'];
  }, [hasPaginatedContacts, hasSelectedContacts]);

  const onClickMenu = useMemoizedFn<Required<MenuProps>['onClick']>((info) => {
    if (info.key === 'export-contacts') {
      exportContacts(paginatedContacts || []);
    } else if (info.key === 'export-all-contacts') {
      exportContacts(allContacts);
    }
  });

  return (
    <Space.Compact>
      <Button
        variant="filled"
        color="primary"
        icon={<ArrowRightFromLineIcon />}
        onClick={onClickMainButton}
        disabled={!hasContacts || disabled}
      >
        {hasSelectedContacts ? '导出选中的联系人' : '导出全部联系人'}
      </Button>
      {menuItems?.length ? (
        <Dropdown
          menu={{ items: menuItems, onClick: onClickMenu }}
          placement="bottomRight"
          disabled={!hasContacts}
          getPopupContainer={() => viewRef || document.body}
        >
          <Button
            variant="filled"
            color="primary"
            icon={<ChevronDownIcon />}
          ></Button>
        </Dropdown>
      ) : null}
    </Space.Compact>
  );
};
