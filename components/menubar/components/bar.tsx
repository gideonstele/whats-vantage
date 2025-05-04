import { CSSProperties, forwardRef, PropsWithChildren } from 'react';

import { PrimitiveMenuBarRoot } from './styled';

export interface MenubarLayoutProps {
  className?: string;
  style?: CSSProperties;
}

export const MenubarLayout = forwardRef<HTMLDivElement, PropsWithChildren<MenubarLayoutProps>>(
  ({ children, className, style }, ref) => {
    return (
      <PrimitiveMenuBarRoot
        className={className}
        style={style}
        ref={ref}
      >
        {children}
      </PrimitiveMenuBarRoot>
    );
  },
);
