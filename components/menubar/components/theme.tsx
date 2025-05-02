import { memo } from 'react';

import { Global } from '@emotion/react';

import '@radix-ui/colors/black-alpha.css';
import '@radix-ui/colors/mauve.css';
import '@radix-ui/colors/violet.css';
import '@radix-ui/colors/grass.css';

export const MenuBarVioletTheme = memo(() => {
  return (
    <Global
      styles={`
        :root {
          --sw-menu-bar-text: var(--violet-11);
          --sw-menu-bar-background-highlighted: var(--violet-4);

          --sw-menu-bar-item-right-slot: var(--mauve-9);

          --sw-menu-item-color: var(--violet-11);

          --sw-menu-item-open: var(--violet-11);
          --sw-menu-item-background-open: var(--violet-4);

          --sw-menu-item-background-highlighted: linear-gradient( 135deg, var(--violet-9) 0%, var(--violet-10) 100% );
          --sw-menu-item-highlighted: var(--violet-1);

          --sw-menu-item-disabled: var(--mauve-8);
          
          --sw-menu-item-separator: var(--violet-6);

        }  
      `}
    />
  );
});

export const MenuBarGrassTheme = memo(() => {
  return (
    <Global
      styles={`
        :root {
          --sw-menu-bar-text: var(--grass-11);
          --sw-menu-bar-background-highlighted: var(--grass-4);

          --sw-menu-bar-item-right-slot: var(--grass-9);

          --sw-menu-item-color: var(--grass-11);

          --sw-menu-item-open: var(--grass-11);
          --sw-menu-item-background-open: var(--grass-4);

          --sw-menu-item-background-highlighted: linear-gradient( 135deg, var(--grass-9) 0%, var(--grass-10) 100% );
          --sw-menu-item-highlighted: var(--grass-1);

          --sw-menu-item-disabled: var(--mauve-8);

          --sw-menu-item-separator: var(--grass-6);
        }
      `}
    />
  );
});
