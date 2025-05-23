import { i18n } from '#i18n';

import { ClipboardEvent, useState } from 'react';

import { useIsomorphicLayoutEffect, useMemoizedFn } from 'ahooks';
import { Button, Flex, Form, Input, Modal } from 'antd';
import { PlusIcon, TextCursorInputIcon, Trash2Icon } from 'lucide-react';

import { useMutationContactsBulkAdd, useValidateAccountsMutation } from '@content-scripts/query/contacts';
import { useMessage } from '@hooks/use-message';

interface ManualInputFormValues {
  contacts: string[];
}

const initialValues: ManualInputFormValues = {
  contacts: [''],
};

export const ManualInputButton = () => {
  const { mutateAsync: addContacts, isPending: isAdding } = useMutationContactsBulkAdd();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form] = Form.useForm<ManualInputFormValues>();
  const { mutateAsync: validateAccounts, isPending: isValidating } = useValidateAccountsMutation();

  const messageApi = useMessage();

  useIsomorphicLayoutEffect(() => {
    if (isAdding || isValidating) {
      messageApi.open({
        content: i18n.t('ACTIONS.IS_VALIDATING'),
        key: 'manual-input-button-loading',
      });
    } else {
      messageApi.destroy('manual-input-button-loading');
    }
  }, [isAdding, isValidating, messageApi]);

  const showModal = useMemoizedFn(() => {
    setIsModalOpen(true);
  });

  const handleOk = useMemoizedFn(async () => {
    try {
      const values = await form.validateFields();

      const valueContacts = values.contacts.filter(Boolean);

      if (valueContacts.length === 0) {
        messageApi.error(i18n.t('MODULES.CONTACTS.VIEWS.MANAGEMENT.HEADER_OPERATIONS.MANUAL_INPUT_TIP'));
        return;
      }

      const validateResult = await validateAccounts(valueContacts);

      const contacts = validateResult
        .filter((item) => item.exists && item.phoneNumber)
        .map((item) => {
          return {
            name: item.name,
            phoneNumber: item.phoneNumber,
            id: item.phoneNumber!,
            type: 'user' as const,
            isConsumer: true,
            isManualAdded: true,
          };
        });
      if (contacts) {
        addContacts(contacts);
        messageApi.success(
          i18n.t('MODULES.CONTACTS.VIEWS.MANAGEMENT.HEADER_OPERATIONS.MANUAL_INPUT_SUCCESS', [
            values.contacts.length,
            contacts.length,
          ]),
        );
      } else {
        messageApi.error(i18n.t('MODULES.CONTACTS.VIEWS.MANAGEMENT.HEADER_OPERATIONS.MANUAL_INPUT_ERROR'));
      }

      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.error(error);
    }
  });

  const handleCancel = useMemoizedFn(() => {
    setIsModalOpen(false);
  });

  const handlePaste = useMemoizedFn(
    (e: ClipboardEvent<HTMLInputElement>, add: (value: string, insertIndex?: number) => void, index: number) => {
      const text = e.clipboardData.getData('text');
      const contacts = text.split(/[\n\r,，]/).filter(Boolean);
      contacts.forEach((contact, offset) => {
        add(contact, index + offset);
      });
      e.preventDefault();
    },
  );

  return (
    <>
      <Modal
        zIndex={3300}
        mask
        destroyOnHidden
        width={400}
        maskClosable={false}
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleOk}
        title={i18n.t('MODULES.CONTACTS.VIEWS.MANAGEMENT.HEADER_OPERATIONS.MANUAL_INPUT')}
      >
        <Form<ManualInputFormValues>
          form={form}
          layout="vertical"
          initialValues={initialValues}
        >
          <Form.List name="contacts">
            {(fields, { add, remove }) => (
              <Flex
                vertical
                gap={12}
              >
                <Flex
                  vertical
                  gap={12}
                  justify="flex-start"
                  align="stretch"
                >
                  {fields.map(({ key, name }, index) => (
                    <Flex
                      key={key}
                      gap={6}
                      align="flex-start"
                    >
                      <Form.Item
                        noStyle
                        name={name}
                      >
                        <Input
                          placeholder="支持一次粘贴多个账号，用回车或逗号分隔"
                          onPaste={(e) => handlePaste(e, add, index)}
                        />
                      </Form.Item>
                      <Button
                        icon={<Trash2Icon />}
                        onClick={() => remove(name)}
                      />
                    </Flex>
                  ))}
                </Flex>
                <Flex justify="flex-end">
                  <Button
                    block
                    variant="dashed"
                    color="primary"
                    icon={<PlusIcon />}
                    onClick={() => add('')}
                  >
                    {i18n.t('ACTIONS.ADD')}
                  </Button>
                </Flex>
              </Flex>
            )}
          </Form.List>
        </Form>
      </Modal>
      <Button
        variant="filled"
        color="default"
        icon={<TextCursorInputIcon />}
        onClick={showModal}
      >
        {i18n.t('MODULES.CONTACTS.VIEWS.MANAGEMENT.HEADER_OPERATIONS.MANUAL_INPUT')}
      </Button>
    </>
  );
};
