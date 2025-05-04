import { logCommon as log } from '@debug';

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
        content: '正在验证中...',
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
        messageApi.error('请输入联系人');
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
        messageApi.success(`添加成功, 输入${values.contacts.length} 项，验证有效${contacts.length} 项`);
      } else {
        messageApi.error('添加失败，输入项均为无效的联系人');
      }

      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      log.error(error);
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
        destroyOnClose
        width={400}
        maskClosable={false}
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleOk}
        title="手工录入"
      >
        <Form<ManualInputFormValues>
          form={form}
          layout="vertical"
          initialValues={initialValues}
        >
          <Form.List name="contacts">
            {(fields, { add, remove }) => (
              <>
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
                    增加
                  </Button>
                </Flex>
              </>
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
        手工录入
      </Button>
    </>
  );
};
