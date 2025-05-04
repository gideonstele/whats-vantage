import styled, { CSSObject } from '@emotion/styled';
import {
  Content as MenubarContent,
  ItemIndicator as MenubarItemIndicator,
  Menu as PrimitiveMenuBarMenu,
  MenubarCheckboxItem,
  MenubarItem,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  Portal as PrimitiveMenuBarPortal,
  Root as MenubarRoot,
  Trigger as MenubarTrigger,
} from '@radix-ui/react-menubar';

import '@radix-ui/colors/black-alpha.css';
import '@radix-ui/colors/mauve.css';
import '@radix-ui/colors/violet.css';
import '@radix-ui/colors/grass.css';

export const PrimitiveMenuBarRoot = styled(MenubarRoot)({
  display: 'flex',
  backgroundColor: 'white',
  padding: '3px',
  borderRadius: '6px',
  // boxShadow: '0 2px 10px var(--black-a7)',
});

export const PrimitiveMenuBarTrigger = styled(MenubarTrigger)({
  all: 'unset',
  padding: '8px 12px',
  outline: 'none',
  userSelect: 'none',
  fontWeight: 500,
  lineHeight: 1,
  borderRadius: '6px',
  color: 'var(--sw-menu-bar-text)',
  fontSize: '14px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '2px',

  '&[data-highlighted], &[data-state="open"]': {
    backgroundColor: 'var(--sw-menu-bar-background-highlighted)',
  },
});

export const PrimitiveMenubarItemIndicator = styled(MenubarItemIndicator)({
  position: 'absolute',
  left: '0',
  width: '20px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const PrimitiveMenuItemRightSlot = styled.section({
  marginLeft: 'auto',
  paddingLeft: '20px',
  color: 'var(--sw-menu-bar-item-right-slot)',
});

export const PrimitiveMenuItemPrefixSlot = styled.section({
  display: 'flex',
  alignItems: 'center',
  width: '24px',
  height: '24px',
  justifyContent: 'flex-start',
});

export const PrimitiveMenuItemMainTitleSlot = styled.section({
  display: 'flex',
  flex: 1,
});

const contentAndSubContentStyle: CSSObject = {
  minWidth: '220px',
  backgroundColor: 'white',
  borderRadius: '6px',
  padding: '5px',
  boxShadow: '0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2)',
  animationDuration: '400ms',
  animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
  willChange: 'transform, opacity',
};

const MenuItemSharedStyle: CSSObject = {
  all: 'unset',
  fontSize: '14px',
  lineHeight: 1,
  color: 'var(--sw-menu-item-color)',
  borderRadius: '6px',
  display: 'flex',
  alignItems: 'center',
  height: '30px',
  padding: '0 10px',
  position: 'relative',
  userSelect: 'none',

  '&[data-state="open"]': {
    backgroundColor: 'var(--sw-menu-item-background-open)',
    color: 'var(--sw-menu-item-open)',
  },
  '&[data-highlighted]': {
    backgroundImage: 'var(--sw-menu-item-background-highlighted)',
    color: 'var(--sw-menu-item-highlighted)',
  },

  [`&[data-highlighted] > ${PrimitiveMenuItemRightSlot}` as string]: {
    color: 'white',
  },

  '&[data-disabled]': {
    color: 'var(--sw-menu-item-disabled)',
    pointerEvents: 'none',
  },

  [`[data-disabled] > ${PrimitiveMenuItemRightSlot}` as string]: {
    color: 'var(--sw-menu-item-disabled)',
    pointerEvents: 'none',
  },

  '&.inset': {
    paddingLeft: '20px',
  },
};

export const PrimitiveMenuBarContent = styled(MenubarContent)({
  ...contentAndSubContentStyle,
});

export const PrimitiveMenuBarSubContent = styled(MenubarSubContent)({
  ...contentAndSubContentStyle,
});

export const PrimitiveMenuBarItem = styled(MenubarItem)({
  ...MenuItemSharedStyle,
});

export const PrimitiveMenuBarCheckboxItem = styled(MenubarCheckboxItem)({
  ...MenuItemSharedStyle,
});

export const PrimitiveMenuBarRadioItem = styled(MenubarRadioItem)({
  ...MenuItemSharedStyle,
});

export const PrimitiveMenuBarSubItem = styled(MenubarSub)({
  ...MenuItemSharedStyle,
});

export const PrimitiveMenuBarSubTrigger = styled(MenubarSubTrigger)({
  ...MenuItemSharedStyle,
});

export const PrimitiveMenuBarSeparator = styled(MenubarSeparator)({
  height: '1px',
  backgroundColor: 'var(--sw-menu-item-separator)',
  margin: '5px',
});

export { PrimitiveMenuBarMenu, PrimitiveMenuBarPortal };
