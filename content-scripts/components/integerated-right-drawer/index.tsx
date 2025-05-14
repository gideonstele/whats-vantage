import clsx from 'clsx';

import { CSSProperties, forwardRef, ReactNode, useMemo } from 'react';

import { Button } from 'antd';
import { PinIcon, XIcon } from 'lucide-react';

import { PortalDomContainer, useWhatsAppContainerDom } from '../../dom/external';

import {
  StyledIntegratedRightDrawer,
  StyledIntegratedRightDrawerContent,
  StyledIntegratedRightDrawerContentWrapper,
  StyledIntegratedRightDrawerHeader,
  StyledIntegratedRightDrawerHeaderHandle,
  StyledIntegratedRightDrawerHeaderTitle,
} from './styled';
import { useToggleTransition } from './use-toggle-transition';

export interface IntegratedRightDrawerProps {
  children: ReactNode;
  title: ReactNode;
  isOpen: boolean;
  width?: number;
  allowTogglePin?: boolean;
  portal?: boolean;
  onClose: () => void;
  onUnpin?: () => void;
}

export const IntegratedRightDrawer = forwardRef<HTMLDivElement, IntegratedRightDrawerProps>(
  ({ children, title, width = 360, allowTogglePin, portal = true, isOpen, onClose, onUnpin }, ref) => {
    const { transitionClassName, isMounted } = useToggleTransition(isOpen, width);

    const extraRender = useMemo(() => {
      return (
        <>
          {allowTogglePin && (
            <Button
              icon={<PinIcon size={16} />}
              variant="text"
              color="default"
              onClick={onUnpin}
            />
          )}
          <Button
            icon={<XIcon size={16} />}
            variant="text"
            color="default"
            onClick={onClose}
          />
        </>
      );
    }, [allowTogglePin, onClose, onUnpin]);

    const renderContent = useMemo(() => {
      return isMounted ? (
        <StyledIntegratedRightDrawer
          ref={ref}
          style={{ '--wpp-right-drawer-width': `${width}px` } as CSSProperties}
          className={clsx(transitionClassName)}
        >
          <StyledIntegratedRightDrawerHeader>
            <StyledIntegratedRightDrawerHeaderTitle>{title}</StyledIntegratedRightDrawerHeaderTitle>
            <StyledIntegratedRightDrawerHeaderHandle>{extraRender}</StyledIntegratedRightDrawerHeaderHandle>
          </StyledIntegratedRightDrawerHeader>
          <StyledIntegratedRightDrawerContent>{children}</StyledIntegratedRightDrawerContent>
        </StyledIntegratedRightDrawer>
      ) : null;
    }, [children, extraRender, isMounted, ref, title, transitionClassName, width]);

    return portal ? (
      <PortalDomContainer
        useDomHooks={useWhatsAppContainerDom}
        portalKey="wvt.wpp.right-drawer"
      >
        {renderContent}
      </PortalDomContainer>
    ) : (
      <StyledIntegratedRightDrawerContentWrapper style={{ '--wpp-right-drawer-width': `${width}px` } as CSSProperties}>
        {renderContent}
      </StyledIntegratedRightDrawerContentWrapper>
    );
  },
);
