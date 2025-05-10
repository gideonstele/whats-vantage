import { i18n } from '#i18n';

import { Modal } from 'antd';

import { ClosableModalDefaultProps } from '../../../contexts/modal-controller-context';
import { AccountValidateView } from '../../../views/contacts-new/account-validate';
import { AccountValidateRecordContextProvider } from '../../../views/contacts-new/account-validate/provider';

export const AccountValidateModal = ({ isOpen, onClose }: ClosableModalDefaultProps) => {
  return (
    <AccountValidateRecordContextProvider>
      <Modal
        open={isOpen}
        maskClosable={false}
        onCancel={onClose}
        title={i18n.t('MODULES.CONTACTS.MENUS.ACCOUNT_VALIDATE')}
        footer={null}
      >
        <AccountValidateView />
      </Modal>
    </AccountValidateRecordContextProvider>
  );
};
