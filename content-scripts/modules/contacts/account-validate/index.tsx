import { Modal } from 'antd';

import { AccountValidateView } from '@content-scripts/views/contacts-new/account-validate';

import { ClosableModalDefaultProps } from '../../../contexts/modal-controller-context';

export const AccountValidateModal = ({ isOpen, onClose }: ClosableModalDefaultProps) => {
  return (
    <Modal
      open={isOpen}
      maskClosable={false}
      onCancel={onClose}
      title="账号验证"
      footer={null}
    >
      <AccountValidateView />
    </Modal>
  );
};
