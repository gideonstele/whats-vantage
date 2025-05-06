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
        title="账号验证"
        footer={null}
      >
        <AccountValidateView />
      </Modal>
    </AccountValidateRecordContextProvider>
  );
};
