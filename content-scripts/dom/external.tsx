import { some } from 'lodash-es';

import { Key, memo, ReactNode, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { ErrorBoundary } from '@components/error-boundry';
import { createExternalState } from '@hooks/create-external-store';

import { insertSectionElement } from './helpers';

export const [whatsAppHeaderDomStore, useWhatsAppHeaderDom] = createExternalState<HTMLDivElement | null>(
  null,
  () => {
    const $headerWrapper = document.querySelector<HTMLDivElement>('#sw-header-wrapper');
    return $headerWrapper;
  },
  (a, b) => {
    return !!a?.isEqualNode(b);
  },
);

export const [whatsAppContainerDomStore, useWhatsAppContainerDom] = createExternalState<HTMLDivElement | null>(
  null,
  () => {
    const $rightDrawerContainer = document.querySelector<HTMLDivElement>('.two._aigs');
    return $rightDrawerContainer;
  },
  (a, b) => {
    return !!a?.isEqualNode(b);
  },
);

export const mountAppHeaderDom = (wrapper: HTMLDivElement) => {
  const $headerWrapper = insertSectionElement(wrapper, {
    attributes: {
      id: 'sw-header-wrapper',
      class: 'sw-header-wrapper',
      'data-sw-integrated': 'true',
    },
    existingSelector: '#sw-header-wrapper',
  });

  whatsAppHeaderDomStore.update($headerWrapper);
  whatsAppContainerDomStore.update(wrapper);
};

export interface PortalDomContainerProps {
  children: ReactNode;
  useDomHooks: () => HTMLDivElement | null;
  portalKey?: Key;
}

export const PortalDomContainer = memo(({ children, useDomHooks, portalKey }: PortalDomContainerProps) => {
  const dom = useDomHooks();

  const observer = useRef<MutationObserver | null>(null);

  const [isMounted, setIsMounted] = useState(false);

  useLayoutEffect(() => {
    if (dom && dom.parentElement) {
      if (observer.current) {
        observer.current.disconnect();
        observer.current = null;
      }

      observer.current = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.removedNodes.length > 0 && some(mutation.removedNodes, (node) => node === dom)) {
            setIsMounted(false);
            return;
          }

          if (mutation.addedNodes.length > 0 && some(mutation.addedNodes, (node) => node === dom)) {
            setIsMounted(true);
          }
        }
      });

      observer.current.observe(dom, {
        childList: true,
      });

      setIsMounted(true);

      console.log('mountAppHeaderDom', dom);

      return () => {
        observer.current?.disconnect();
        observer.current = null;
      };
    }
  }, [dom]);

  if (!dom || !isMounted) {
    return null;
  }

  return createPortal(<ErrorBoundary>{children}</ErrorBoundary>, dom, portalKey);
});
