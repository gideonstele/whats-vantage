import { memo, useMemo } from 'react';

import { useMemoizedFn } from 'ahooks';
import { Button, Dropdown, MenuProps, Space } from 'antd';
import { ChevronDownIcon, FileDownIcon } from 'lucide-react';

import { useLogsData } from '../providers/data';
import { exportMessageLogs } from '../utils/exports';

export const ExportButton = memo(({ parentViewRef }: { parentViewRef?: HTMLElement | null }) => {
  const { selectedLogs, data } = useLogsData();

  const hasSelectedLogs = useMemo(() => {
    return selectedLogs.length > 0;
  }, [selectedLogs]);

  const hasPaginatedLogs = useMemo(() => {
    return data?.data && data.data.length > 0;
  }, [data]);

  const onClickMainButton = useMemoizedFn(() => {
    if (hasSelectedLogs) {
      exportMessageLogs(selectedLogs);
    } else {
      exportMessageLogs(data?.data || []);
    }
  });

  const menuItems = useMemo<MenuProps['items']>(() => {
    return [
      {
        label: '导出本页日志',
        key: 'export-logs',
        disabled: !hasPaginatedLogs,
      },
      hasSelectedLogs
        ? {
            label: '导出全部日志',
            key: 'export-all-logs',
          }
        : null,
    ].filter(Boolean) as MenuProps['items'];
  }, [hasPaginatedLogs, hasSelectedLogs]);

  const onClickMenu = useMemoizedFn<Required<MenuProps>['onClick']>((info) => {
    if (info.key === 'export-logs') {
      exportMessageLogs(data?.data || []);
    } else if (info.key === 'export-all-logs') {
      exportMessageLogs(selectedLogs);
    }
  });

  return (
    <Space.Compact>
      <Button
        variant="filled"
        color="primary"
        icon={<FileDownIcon />}
        onClick={onClickMainButton}
        disabled={!hasPaginatedLogs}
      >
        {hasSelectedLogs ? '导出选中的日志' : '导出全部日志'}
      </Button>
      <Dropdown
        menu={{ items: menuItems, onClick: onClickMenu }}
        placement="bottomRight"
        disabled={!hasPaginatedLogs}
        getPopupContainer={() => parentViewRef || document.body}
      >
        <Button
          variant="filled"
          color="primary"
          icon={<ChevronDownIcon />}
        ></Button>
      </Dropdown>
    </Space.Compact>
  );
});
