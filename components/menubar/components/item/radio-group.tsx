import { forwardRef } from 'react';

import { DotIcon } from 'lucide-react';
import {
  MenubarRadioGroup as RadixMenubarRadioGroup,
  MenubarRadioGroupProps as RadixMenubarRadioGroupProps,
} from '@radix-ui/react-menubar';

import { PrimitiveMenubarItemIndicator, PrimitiveMenuBarRadioItem } from '../styled';

import { MenubarSelectOption } from './type';

export interface MenubarRadioGroupProps extends RadixMenubarRadioGroupProps {
  type: 'radio';
  options: MenubarSelectOption[];
}

export const MenubarRadioGroup = forwardRef<HTMLDivElement, MenubarRadioGroupProps>(({ options, ...props }, ref) => {
  return (
    <RadixMenubarRadioGroup
      ref={ref}
      {...props}
    >
      {options.map((option) => (
        <RadixMenubarRadioGroup
          key={option.value}
          value={option.value}
        >
          <PrimitiveMenuBarRadioItem
            value={option.value}
            className="inset"
          >
            <PrimitiveMenubarItemIndicator>
              <DotIcon />
            </PrimitiveMenubarItemIndicator>
            {option.label}
          </PrimitiveMenuBarRadioItem>
        </RadixMenubarRadioGroup>
      ))}
    </RadixMenubarRadioGroup>
  );
});
