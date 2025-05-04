import { Button, Upload } from 'antd';
import { UploadChangeParam, UploadFile } from 'antd/es/upload';
import { FileUpIcon } from 'lucide-react';

import { useMutationContactsBulkAdd, useValidateAccountsMutation } from '@content-scripts/query/contacts';
import { useMessage } from '@hooks/use-message';
import { importContacts } from '@services/helpers/imports';

export const ImportContactsButton = () => {
  const { mutateAsync: addContacts, isPending } = useMutationContactsBulkAdd();

  const messageApi = useMessage();
  const { mutateAsync: validateAccounts, isPending: isImporting } = useValidateAccountsMutation();

  const handleChange = async (info: UploadChangeParam<UploadFile<void>>) => {
    if (info.file.status !== 'error') {
      const data = await importContacts(info.file as unknown as File);

      console.log('data', data);

      if (data.length > 0) {
        const validateResult = await validateAccounts(data);

        if (validateResult?.length) {
          const contacts = validateResult
            ?.filter((item) => item.exists)
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

          const addresult = await addContacts(contacts);

          const addCount = addresult?.length || 0;

          messageApi.success(
            `导入联系人成功，从文件中读取 ${data.length} 项，验证有效 ${contacts.length} 项，去重后，成功导入${addCount} 项`,
            12000,
          );
        } else {
          messageApi.info('没有读取到有效的联系人信息，请检查文件格式', 9000);
        }

        return;
      }

      messageApi.info('没有读取到有效的联系人信息，请检查文件格式', 9000);
    } else {
      messageApi.error('导入联系人失败，文件读取错误，请检查文件格式', 9000);
    }
  };

  return (
    <Upload
      accept=".xls,.xlsx"
      multiple={false}
      directory={false}
      showUploadList={false}
      onChange={handleChange}
      customRequest={() => {}}
      beforeUpload={() => {
        return false;
      }}
    >
      <Button
        variant="filled"
        color="primary"
        icon={<FileUpIcon />}
        loading={isImporting || isPending}
      >
        导入联系人
      </Button>
    </Upload>
  );
};
