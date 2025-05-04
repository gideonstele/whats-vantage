import '@ant-design/v5-patch-for-react-19';
import { StrictMode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';

import { Global } from '@emotion/react';
import { ConfigProvider, ThemeConfig } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import { AliasToken } from 'antd/es/theme/interface';

import { MenuBarGrassTheme } from '@components/menubar';
import { MessageProvider } from '@hooks/use-message';
import { NotificationProvider } from '@hooks/use-notification';

import { wppQueryClient } from './query/client';
import { ContentScriptsApp } from './app';
import { overrideGlobalStyles } from './global-style';

export function mountApp(uiContainer: HTMLElement) {
  const root = createRoot(uiContainer);

  const designToken: Partial<AliasToken> = {
    zIndexBase: 3000,
    zIndexPopupBase: 3100,
    colorPrimary: '#2a7e3b',
    colorPrimaryBg: '#daf1db',
    colorPrimaryBgHover: '#dcfcdd',
    colorPrimaryActive: '#25d366',
    colorPrimaryText: '#008069',
    colorPrimaryTextActive: '#25d366',
    colorPrimaryTextHover: '#e7fce3',
    colorLink: '#008069',
    colorLinkActive: '#25d366',
    colorLinkHover: '#25d366',
  };

  const components: ThemeConfig['components'] = {
    Segmented: {
      itemSelectedBg: 'var(--ant-color-primary-bg)',
      itemSelectedColor: 'var(--ant-color-primary-text)',
      itemHoverBg: 'var(--ant-color-primary-bg-hover)',
    },
  };

  const getPopupContainer = () => {
    return document.querySelector<HTMLDivElement>('[data-wxt-integrated]') || document.body;
  };

  root.render(
    <StrictMode>
      <QueryClientProvider client={wppQueryClient}>
        <Global styles={overrideGlobalStyles} />
        <MenuBarGrassTheme />
        <ConfigProvider
          theme={{ cssVar: true, token: designToken, components }}
          locale={zhCN}
          getPopupContainer={getPopupContainer}
        >
          <MessageProvider>
            <NotificationProvider>
              <ContentScriptsApp />
            </NotificationProvider>
          </MessageProvider>
        </ConfigProvider>
      </QueryClientProvider>
    </StrictMode>,
  );

  return () => {
    root.unmount();
  };
}
