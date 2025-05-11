import { FocusEventHandler } from 'react';

import { useControllableValue, useMemoizedFn } from 'ahooks';
import { Button, Upload, UploadFile } from 'antd';
import { UploadChangeParam } from 'antd/es/upload';
import { UploadCloudIcon } from 'lucide-react';

import { useAttachmentPerTimeLimit } from '../../../external-stores/daily-used';

export interface UploadAttachmentProps {
  value?: UploadFile[];
  onChange?: (value: UploadFile[]) => void;
}

export const UploadAttachment = ({ value: valueProps, onChange }: UploadAttachmentProps) => {
  const attachmentPerTimeLimit = useAttachmentPerTimeLimit();

  const [value, setValue] = useControllableValue<UploadFile[]>(
    {
      value: valueProps,
      onChange,
    },
    {
      defaultValue: [],
    },
  );

  const handleChange = useMemoizedFn((info: UploadChangeParam<UploadFile>) => {
    setValue?.(info.fileList);
  });

  return (
    <Upload
      accept="image/*,video/*,audio/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
      multiple
      maxCount={attachmentPerTimeLimit}
      onChange={handleChange}
      fileList={value}
      beforeUpload={() => {
        return false;
      }}
      listType="picture"
    >
      <Button icon={<UploadCloudIcon />}>上传附件</Button>
    </Upload>
  );
};
