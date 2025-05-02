import { forwardRef, Fragment, MouseEvent, ReactNode, useMemo } from 'react';

import { useMemoizedFn } from 'ahooks';
import { ChevronRight } from 'lucide-react';
import { MenubarPortal, MenubarSubContentProps, MenubarSubProps } from '@radix-ui/react-menubar';

import {
  PrimitiveMenuBarSubContent,
  PrimitiveMenuBarSubItem,
  PrimitiveMenuBarSubTrigger,
  PrimitiveMenuItemMainTitleSlot,
  PrimitiveMenuItemPrefixSlot,
  PrimitiveMenuItemRightSlot,
} from '../styled';

export interface MenubarSubItemProps extends Omit<MenubarSubProps, 'title'> {
  type: 'submenu';
  title: ReactNode;
  isPortal?: boolean;
  suffix?: ReactNode;
  prefixIcon?: ReactNode;
  children: ReactNode;
  contentProps?: Omit<MenubarSubContentProps, 'children'>;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
}

export interface MenubarSubItemContentProps extends MenubarSubContentProps {
  isPortal?: boolean;
}

const MenubarSubItemContent = ({ children, isPortal, ...props }: MenubarSubItemContentProps) => {
  const Wrapper = useMemo(() => (isPortal ? MenubarPortal : Fragment), [isPortal]);

  return (
    <Wrapper>
      <PrimitiveMenuBarSubContent {...props}>{children}</PrimitiveMenuBarSubContent>
    </Wrapper>
  );
};

export const MenubarSubItem = forwardRef<HTMLDivElement, MenubarSubItemProps>(
  ({ type, title, suffix, prefixIcon, children, isPortal, contentProps, onClick, ...props }, ref) => {
    const handleClick = useMemoizedFn((event: MouseEvent<HTMLDivElement>) => {
      onClick?.(event);
    });

    const mergedContentProps = useMemo<Omit<MenubarSubContentProps, 'children' | 'isPortal'>>(
      () => ({
        alignOffset: -5,
        ...contentProps,
      }),
      [contentProps],
    );

    return (
      <PrimitiveMenuBarSubItem {...props}>
        <PrimitiveMenuBarSubTrigger
          ref={ref}
          onClick={handleClick}
        >
          {prefixIcon && <PrimitiveMenuItemPrefixSlot>{prefixIcon}</PrimitiveMenuItemPrefixSlot>}
          <PrimitiveMenuItemMainTitleSlot>{title}</PrimitiveMenuItemMainTitleSlot>
          <PrimitiveMenuItemRightSlot>
            <ChevronRight />
          </PrimitiveMenuItemRightSlot>
        </PrimitiveMenuBarSubTrigger>
        <MenubarSubItemContent
          {...mergedContentProps}
          isPortal={isPortal}
        >
          {children}
        </MenubarSubItemContent>
      </PrimitiveMenuBarSubItem>
    );
  },
);
