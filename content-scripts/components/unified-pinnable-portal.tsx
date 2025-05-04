import { forwardRef, ReactNode } from 'react';

import { AntdStyleResizableModal } from './antd-style-resiable-modal';
import { useLocalStorageState, useMemoizedFn } from 'ahooks';

import { SizePositionLeftTop } from '@components/modal-resizable-movable';

import { IntegratedRightDrawer } from './integerated-right-drawer';

export interface UnifiedPinnablePortalProps {
  title?: ReactNode;
  children?: ReactNode;
  modalStorageKey?: string;
  drawerWidth?: number;
  isOpen: boolean;
  onClose: () => void;

  defaultSize?: SizePositionLeftTop;
  initialSize?: SizePositionLeftTop;
}

export const UnifiedPinnablePortal = forwardRef<HTMLDivElement, UnifiedPinnablePortalProps>(
  ({ title, children, modalStorageKey, drawerWidth, isOpen, onClose, defaultSize, initialSize }, ref) => {
    const [isPin, setIsPin] = useLocalStorageState('sw-assistant.wpp.modal.pin', {
      defaultValue: true,
    });

    const onPin = useMemoizedFn(() => {
      setIsPin(true);
    });

    const unPin = useMemoizedFn(() => {
      setIsPin(false);
    });

    if (isPin) {
      return (
        <IntegratedRightDrawer
          ref={ref}
          title={title}
          isOpen={isOpen}
          onClose={onClose}
          allowTogglePin
          onUnpin={unPin}
          width={drawerWidth}
        >
          {children}
        </IntegratedRightDrawer>
      );
    }

    return (
      <AntdStyleResizableModal
        ref={ref}
        title={title}
        isOpen={isOpen}
        onClose={onClose}
        allowTogglePin
        onPin={onPin}
        localStorageKey={modalStorageKey}
        defaultSize={defaultSize}
        initialSize={initialSize}
      >
        {children}
      </AntdStyleResizableModal>
    );
  },
);
