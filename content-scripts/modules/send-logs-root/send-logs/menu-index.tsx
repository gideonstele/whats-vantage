import { MenubarItem } from '@components/menubar';
import { useModalController } from '@content-scripts/contexts/modal-controller-context';
import { ConfigModals } from '@content-scripts/modules/modals';

export const SendLogsMenuItem = () => {
  const { open } = useModalController<ConfigModals>('sendLogs');

  return (
    <MenubarItem
      title="日志"
      type="leaf"
      onClick={open}
    ></MenubarItem>
  );
};
