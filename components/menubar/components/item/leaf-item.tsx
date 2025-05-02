import { forwardRef, MouseEvent, ReactNode } from 'react';

import { useMemoizedFn } from 'ahooks';
import { MenubarItemProps as RadixMenubarItemProps } from '@radix-ui/react-menubar';

import {
  PrimitiveMenuBarItem,
  PrimitiveMenuItemMainTitleSlot,
  PrimitiveMenuItemPrefixSlot,
  PrimitiveMenuItemRightSlot,
} from '../styled';

export interface MenubarLeafItemProps extends Omit<RadixMenubarItemProps, 'title'> {
  type: 'leaf';
  title: ReactNode;
  suffix?: ReactNode;
  prefixIcon?: ReactNode;
}

export const MenubarLeafItem = forwardRef<HTMLDivElement, MenubarLeafItemProps>(
  ({ title, suffix, prefixIcon, type, onClick, ...props }, ref) => {
    const handleClick = useMemoizedFn((event: MouseEvent<HTMLDivElement>) => {
      onClick?.(event);
    });

    return (
      <PrimitiveMenuBarItem
        ref={ref}
        onClick={handleClick}
        {...props}
      >
        {prefixIcon && <PrimitiveMenuItemPrefixSlot>{prefixIcon}</PrimitiveMenuItemPrefixSlot>}
        <PrimitiveMenuItemMainTitleSlot>{title}</PrimitiveMenuItemMainTitleSlot>

        {suffix && <PrimitiveMenuItemRightSlot>{suffix}</PrimitiveMenuItemRightSlot>}
      </PrimitiveMenuBarItem>
    );
  },
);
