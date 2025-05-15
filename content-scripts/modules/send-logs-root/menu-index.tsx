import { MenubarMenu } from '@components/menubar';

import { SendLogsMenuItem } from './send-logs/menu-index';

export const SendLogsMenu = () => {
  return (
    <MenubarMenu header="日志看板">
      <SendLogsMenuItem />
    </MenubarMenu>
  );
};
