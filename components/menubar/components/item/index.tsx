import { forwardRef } from 'react';

import { MenubarSeparatorProps as RadixMenubarSeparatorProps } from '@radix-ui/react-menubar';

import { PrimitiveMenuBarSeparator } from '../styled';

import { MenubarCheckboxGroup, MenubarCheckboxGroupProps } from './checkbox-group';
import { MenubarLeafItem, MenubarLeafItemProps } from './leaf-item';
import { MenubarRadioGroup, MenubarRadioGroupProps } from './radio-group';
import { MenubarSubItem, MenubarSubItemProps } from './sub-item';

export interface MenubarSeparatorProps extends RadixMenubarSeparatorProps {
  type: 'separator';
}

export type MenubarItemProps =
  | MenubarLeafItemProps
  | MenubarSubItemProps
  | MenubarSeparatorProps
  | MenubarRadioGroupProps
  | MenubarCheckboxGroupProps;

export const MenubarItem = forwardRef<HTMLDivElement, MenubarItemProps>(
  ({ type: propsType = 'leaf', ...props }, ref) => {
    if (propsType === 'leaf') {
      return (
        <MenubarLeafItem
          ref={ref}
          {...(props as Omit<MenubarLeafItemProps, 'type'>)}
          type={propsType}
        />
      );
    } else if (propsType === 'submenu') {
      return (
        <MenubarSubItem
          ref={ref}
          type={propsType}
          {...(props as Omit<MenubarSubItemProps, 'type'>)}
        />
      );
    } else if (propsType === 'radio') {
      return (
        <MenubarRadioGroup
          ref={ref}
          type={propsType}
          {...(props as Omit<MenubarRadioGroupProps, 'type'>)}
        />
      );
    } else if (propsType === 'checkbox') {
      return (
        <MenubarCheckboxGroup
          type={propsType}
          {...(props as Omit<MenubarCheckboxGroupProps, 'type'>)}
        />
      );
    } else if (propsType === 'separator') {
      return (
        <PrimitiveMenuBarSeparator
          ref={ref}
          {...(props as Omit<MenubarSeparatorProps, 'type'>)}
        />
      );
    }
    return null;
  },
);
