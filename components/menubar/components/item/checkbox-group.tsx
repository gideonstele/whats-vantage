import useEvent from 'react-use-event-hook';

import { CheckIcon } from 'lucide-react';

import { useControllableState } from '@hooks/use-controlled-state';

import { PrimitiveMenuBarCheckboxItem, PrimitiveMenubarItemIndicator } from '../styled';

import { MenubarSelectOption } from './type';

export interface MenubarCheckboxGroupProps {
  type: 'checkbox';
  options: MenubarSelectOption[];
  onValueChange?: (value: string[]) => void;
  value?: string[];
}

export const MenubarCheckboxGroup = ({ options, onValueChange, value, type: _type }: MenubarCheckboxGroupProps) => {
  const [internalValue, setInternalValue] = useControllableState<string[]>({
    prop: value,
    defaultProp: [],
    onChange: onValueChange,
    caller: 'MenubarCheckboxGroup',
  });

  const hasChecked = useEvent((option: MenubarSelectOption) => {
    return internalValue?.includes(option.value) ?? false;
  });

  const handleChange = useEvent((option: MenubarSelectOption) => {
    const nextOptions = hasChecked(option)
      ? internalValue?.filter((v) => v !== option.value)
      : [...internalValue, option.value];

    setInternalValue?.(nextOptions);
  });

  return (
    <PrimitiveMenuBarCheckboxItem>
      {options.map((option) => (
        <PrimitiveMenuBarCheckboxItem
          key={option.value}
          checked={hasChecked(option)}
          onCheckedChange={() => handleChange(option)}
        >
          <PrimitiveMenubarItemIndicator>
            <CheckIcon />
          </PrimitiveMenubarItemIndicator>
          {option.label}
        </PrimitiveMenuBarCheckboxItem>
      ))}
    </PrimitiveMenuBarCheckboxItem>
  );
};
