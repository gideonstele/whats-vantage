import { MenubarItem } from '@components/menubar';

import { useModalController } from '../../../contexts/modal-controller-context';
import { ConfigModals } from '../../modals';

export const AccountValidateMenuItem = () => {
  const { open } = useModalController<ConfigModals>('accountValidate');

  return (
    <MenubarItem
      type="leaf"
      title="账号验证"
      onClick={open}
    ></MenubarItem>
  );
};
