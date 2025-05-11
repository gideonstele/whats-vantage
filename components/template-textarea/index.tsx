import { ChangeEventHandler, FocusEventHandler, forwardRef, useRef } from 'react';

import { useMemoizedFn } from 'ahooks';
import { GetRef, Input } from 'antd';

import { TagsBar } from './components/tags-bar';
import { StyledTextAreaWrapper } from './components/tags-bar/styled';

export interface VariableOption {
  label: string;
  value: string;
}

export interface TemplateTextareaProps {
  isLoading?: boolean;
  options?: VariableOption[];
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: FocusEventHandler<HTMLTextAreaElement>;
  onFocus?: FocusEventHandler<HTMLTextAreaElement>;
}

export type TemplateTextareaRef = GetRef<typeof Input.TextArea>;

export const TemplateTextarea = forwardRef<HTMLDivElement, TemplateTextareaProps>(
  ({ value, onChange, options, onBlur, onFocus }, ref) => {
    const textareaRef = useRef<TemplateTextareaRef | null>(null);

    const handleChange = useMemoizedFn<ChangeEventHandler<HTMLTextAreaElement>>((e) => {
      onChange?.(e.target.value);
    });

    const handleInsert = useMemoizedFn((value: string) => {
      if (textareaRef.current && textareaRef.current.resizableTextArea?.textArea) {
        const textarea = textareaRef.current.resizableTextArea?.textArea;

        const { selectionStart, selectionEnd } = textarea;
        let newText = '';
        if (selectionStart !== undefined) {
          newText = `${textarea.value.slice(0, selectionStart)}{{${value}}}${textarea.value.slice(selectionEnd)}`;
        } else {
          newText = `${textarea.value}{{${value}}}`;
        }

        textarea.value = newText;

        onChange?.(newText);
      }
    });

    return (
      <StyledTextAreaWrapper ref={ref}>
        <TagsBar
          options={options}
          onInsert={handleInsert}
        />
        <Input.TextArea
          ref={textareaRef}
          value={value}
          rows={10}
          onChange={handleChange}
          onBlur={onBlur}
          onFocus={onFocus}
        ></Input.TextArea>
      </StyledTextAreaWrapper>
    );
  },
);
