import clsx from 'clsx';

import { CSSProperties, forwardRef, ReactNode, useMemo } from 'react';

import { Button } from 'antd';
import { PinIcon, XIcon } from 'lucide-react';

import { PortalDomContainer, useWhatsAppContainerDom } from '../../dom/external';

import {
  StyledIntegratedRightDrawer,
  StyledIntegratedRightDrawerContent,
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
  onClose: () => void;

  onUnpin?: () => void;
}

export const IntegratedRightDrawer = forwardRef<HTMLDivElement, IntegratedRightDrawerProps>(
  ({ children, title, width = 360, allowTogglePin, isOpen, onClose, onUnpin }, ref) => {
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

    return (
      <PortalDomContainer
        useDomHooks={useWhatsAppContainerDom}
        portalKey="sw-assistant.wpp.right-drawer"
      >
        {isMounted ? (
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
        ) : null}
      </PortalDomContainer>
    );
  },
);
