import { forwardRef, ReactNode } from 'react';

import { useLocalStorageState, useMemoizedFn } from 'ahooks';

import { SizePositionLeftTop } from '@components/modal-resizable-movable';

import { AntdStyleResizableModal } from './antd-style-resiable-modal';
import { IntegratedRightDrawer } from './integerated-right-drawer';

export interface UnifiedPinnablePortalProps {
  title?: ReactNode;
  children?: ReactNode;
  modalStorageKey?: string;
  drawerWidth?: number;
  /**
   * 抽屉模式下，将UI插入到右侧UI，否则，悬浮并遮盖整个页面UI
   */
  integrated?: boolean;
  isOpen: boolean;
  onClose: () => void;

  defaultSize?: SizePositionLeftTop;
  initialSize?: SizePositionLeftTop;
}

export const UnifiedPinnablePortal = forwardRef<HTMLDivElement, UnifiedPinnablePortalProps>(
  (
    { title, children, modalStorageKey, drawerWidth, integrated = true, isOpen, onClose, defaultSize, initialSize },
    ref,
  ) => {
    const [isPin, setIsPin] = useLocalStorageState('wvt.wpp.modal.pin', {
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
          portal={integrated}
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
