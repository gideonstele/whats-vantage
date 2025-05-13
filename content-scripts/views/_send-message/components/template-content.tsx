import { FocusEventHandler } from 'react';

import { useControllableValue } from 'ahooks';

import { TemplateTextarea } from '@components/template-textarea';

import { useQueryCustomVariables } from '../../../query/custom-variables';

export interface TemplateContentProps {
  value?: string;
  onChange?: (value?: string) => void;
  onFocus?: FocusEventHandler<HTMLTextAreaElement>;
  onBlur?: FocusEventHandler<HTMLTextAreaElement>;
}

export const TemplateContent = ({ value: valueProps, onChange, onFocus, onBlur }: TemplateContentProps) => {
  const [value, setValue] = useControllableValue<string>({
    value: valueProps,
    onChange,
  });

  const { data: customVariables, isLoading: isCustomVariablesLoading } = useQueryCustomVariables();

  return (
    <TemplateTextarea
      options={customVariables}
      isLoading={isCustomVariablesLoading}
      value={value}
      onChange={setValue}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
};
