import { ForwardRefExoticComponent, RefAttributes, useMemo } from 'react';

import { Flex } from 'antd';
import { BookUserIcon, ImportIcon, LucideProps, StoreIcon } from 'lucide-react';

import { FormattedContact } from 'types/domain/contacts';

import { StatusItem, StatusItemProps } from './status-item';

type StatusListInfo = Omit<StatusItemProps, 'value'> & {
  Icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
};

const statusListInfo: {
  [key: string]: StatusListInfo;
} = {
  isMyContact: {
    Icon: BookUserIcon,
    color: '#52c41a',
    trueValue: {
      title: '通讯录联系人',
      tooltip: '此联系人已保存在我的手机通讯录中',
    },
    falseValue: {
      title: '非通讯录联系人',
      tooltip: '此联系人未保存在我的手机通讯录中',
    },
  },
  isManualAdded: {
    Icon: ImportIcon,
    color: '#faad14',
    falseColor: '#52c41a',
    falseTextColor: '#fff',
    hiddenFalse: true,
    trueValue: {
      title: '导入的联系人',
      tooltip: '此联系人是从外部导入的，不在 WhatsApp 原生列表中',
    },
    falseValue: {
      title: '原生联系人',
      tooltip: '此联系人来自 WhatsApp 原生列表',
    },
  },
  isBusiness: {
    Icon: StoreIcon,
    color: '#4096ff',
    falseColor: '#52c41a',
    falseTextColor: '#fff',
    trueValue: {
      title: '商业账号',
      tooltip: '此联系人是一个商业账号',
    },
    falseValue: {
      title: '个人账号',
      tooltip: '此联系人是一个个人账号',
    },
  },
};

export const StatusList = ({ isMyContact, isManualAdded, isBusiness }: FormattedContact) => {
  const statusList = useMemo(() => {
    const status = [
      {
        value: isMyContact,
        key: `isMyContact-${isMyContact}`,
        ...statusListInfo.isMyContact,
      },
      {
        value: isManualAdded,
        key: `isManualAdded-${isManualAdded}`,
        ...statusListInfo.isManualAdded,
      },
      {
        value: isBusiness,
        key: `isBusiness-${isBusiness}`,
        ...statusListInfo.isBusiness,
      },
    ].sort((a, b) => {
      if (a.value === b.value) return 0;
      if (a.value) return 1;
      return -1;
    });

    return status;
  }, [isMyContact, isManualAdded, isBusiness]);

  return (
    <Flex
      align="center"
      vertical
      gap={8}
    >
      {statusList.map((status) => (
        <StatusItem
          {...status}
          key={status.key}
        />
      ))}
    </Flex>
  );
};
