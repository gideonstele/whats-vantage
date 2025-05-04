import { useMemo, useState } from 'react';

import createContextContainer from '@hooks/create-context-container';

export const MENUBAR_ITEMS = {
  ACCOUNT_VALIDATE: 'account-validate',
} as const;

export type MenubarItemType = (typeof MENUBAR_ITEMS)[keyof typeof MENUBAR_ITEMS];

export interface MenubarLayoutContext {
  selectedItem?: MenubarItemType;
  changeSelectedItem: (item?: MenubarItemType) => void;
}

export interface MenubarLayoutProps {
  defaultSelected?: MenubarItemType;
}

export const [MenubarLayoutProvider, useMenubarLayout] = createContextContainer<
  MenubarLayoutContext,
  MenubarLayoutProps
>(function useMenubarLayoutContext({ defaultSelected }) {
  const [selectedItem, setSelectedItem] = useState<MenubarItemType | undefined>(defaultSelected);

  return useMemo(
    () => ({
      selectedItem,
      changeSelectedItem: setSelectedItem,
    }),
    [selectedItem],
  );
});
