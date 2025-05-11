import { CSSProperties, FocusEventHandler, useMemo } from 'react';

import { useControllableValue, useMemoizedFn } from 'ahooks';
import { Select } from 'antd';

import { useQueryMessageTemplates } from '../../../query/message-templates';

interface Option {
  value: number;
  label: string;
}

export interface SelectMessageTemplateProps {
  value?: number;
  onChange?: (value: number, option: Option) => void;
  onTemplateChange?: (templateContent: string) => void;
  onFocus?: FocusEventHandler<HTMLDivElement>;
  onBlur?: FocusEventHandler<HTMLDivElement>;
  className?: string;
  style?: CSSProperties;
}

export const SelectMessageTemplate = ({
  value: valueProps,
  onChange,
  onTemplateChange,
  ...props
}: SelectMessageTemplateProps) => {
  const { data: templates, isLoading: isMessageTemplatesLoading } = useQueryMessageTemplates();

  const templateOptions = useMemo(() => {
    return templates?.map((template) => ({
      label: template.title,
      value: template.id,
    }));
  }, [templates]);

  const [value, setValue] = useControllableValue<number>({
    value: valueProps,
    onChange,
  });

  const handleTemplateChange = useMemoizedFn((value: number, option?: Option | Option[]) => {
    const template = templates?.find((template) => template.id === value)?.content || '';
    setValue(value, option);
    onTemplateChange?.(template);
  });

  return (
    <Select
      options={templateOptions}
      value={value}
      onChange={handleTemplateChange}
      loading={isMessageTemplatesLoading}
      allowClear
      {...props}
    />
  );
};
