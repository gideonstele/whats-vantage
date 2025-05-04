import { forwardRef, Fragment, memo, MouseEventHandler, ReactNode, useMemo } from 'react';

import { MenubarContentProps, MenubarPortal } from '@radix-ui/react-menubar';

import { PrimitiveMenuBarContent, PrimitiveMenuBarMenu, PrimitiveMenuBarTrigger } from './styled';

export interface MenuBarMenuContentProps extends MenubarContentProps {
  isPortal?: boolean;
}

export interface MenubarMenuProps {
  header?: ReactNode;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  isPortal?: boolean;
  children?: ReactNode;
  contentProps?: Omit<MenubarContentProps, 'isPortal' | 'children'>;
}

const MenubarContent = memo(({ isPortal, children, ...props }: MenuBarMenuContentProps) => {
  const Wrapper = useMemo(() => {
    if (isPortal) {
      return MenubarPortal;
    }

    return Fragment;
  }, [isPortal]);

  return (
    <Wrapper>
      <PrimitiveMenuBarContent {...props}>{children}</PrimitiveMenuBarContent>
    </Wrapper>
  );
});

export const MenubarMenu = forwardRef<HTMLButtonElement, MenubarMenuProps>(
  ({ disabled, header, onClick, isPortal, children, contentProps }, ref) => {
    const mergedContentProps = useMemo<MenubarContentProps>(() => {
      return {
        sideOffset: 5,
        align: 'start',
        alignOffset: -3,
        ...contentProps,
      };
    }, [contentProps]);

    return (
      <PrimitiveMenuBarMenu>
        <PrimitiveMenuBarTrigger
          ref={ref}
          disabled={disabled}
          onClick={onClick}
        >
          {header}
        </PrimitiveMenuBarTrigger>
        <MenubarContent
          isPortal={isPortal}
          {...mergedContentProps}
        >
          {children}
        </MenubarContent>
      </PrimitiveMenuBarMenu>
    );
  },
);
