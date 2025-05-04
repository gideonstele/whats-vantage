import clsx from 'clsx';

import { forwardRef, ReactNode, useId, useMemo, useState } from 'react';

import { useControllableValue, useLocalStorageState, useMemoizedFn } from 'ahooks';
import { Button } from 'antd';
import { PinIcon, XIcon } from 'lucide-react';

import { ModalResizableMovable, ResizeType, SizePositionLeftTop } from '@components/modal-resizable-movable';

import { ResizableRectProvider, useResizableRect } from './resizable-rect-context';
import {
  resizableModalHeaderStyle,
  resizableModalStyle,
  StyledResizableModalHeaderHandle,
  StyledResizableModalHeaderTitle,
} from './styled';
import { useToggleTransition } from './use-toggle-transition';

export interface AntdStyleResizableModalProps {
  children?: ReactNode;
  localStorageKey?: string;
  header?: ReactNode | ((props: { onClose: () => void; onPin?: () => void }) => ReactNode);
  isPortal?: boolean;
  getPortalElement?: () => HTMLElement;
  title?: ReactNode;
  isOpen?: boolean;
  allowTogglePin?: boolean;
  defaultOpen?: boolean;
  onClose?: () => void;
  onPin?: () => void;
  onOpen?: () => void;
  onOpenChange?: (isOpen: boolean) => void;
  defaultSize?: SizePositionLeftTop;
  initialSize?: SizePositionLeftTop;
  minWidth?: number;
  minHeight?: number;
}

export const AntdStyleResizableModal = forwardRef<HTMLDivElement, AntdStyleResizableModalProps>(
  (
    {
      children,
      header,
      isPortal = false,
      getPortalElement,
      title,
      isOpen: isPropOpen = false,
      defaultOpen = false,
      allowTogglePin,
      onClose,
      onOpen,
      onPin,
      onOpenChange,
      localStorageKey,
      defaultSize = {
        left: 35,
        top: 35,
        width: 360,
        height: 280,
      },
      initialSize,
      minWidth = 560,
      minHeight = 420,
    },
    ref,
  ) => {
    const id = useId();
    const key = useMemo(
      () => `sw-assistant.content-script.draggable-box-pos.${localStorageKey || id}`,
      [localStorageKey, id],
    );

    const [isOpen, setIsOpen] = useControllableValue<boolean>(
      {
        value: isPropOpen,
        defaultOpen,
        onChange: useMemoizedFn((nextIsOpen: boolean) => {
          if (nextIsOpen) {
            onOpenChange?.(true);
            onOpen?.();
          } else {
            onClose?.();
            onOpenChange?.(false);
          }
        }),
      },
      {
        defaultValuePropName: 'defaultOpen',
      },
    );

    const setClose = useMemoizedFn(() => {
      setIsOpen(false);
    });

    const [lsPositionSize, setLsPositionSize] = useLocalStorageState<SizePositionLeftTop>(key, {
      defaultValue: () => initialSize ?? { ...defaultSize },
    });

    const [positionSize, setPositionSize] = useState<SizePositionLeftTop>(() =>
      initialSize
        ? initialSize
        : lsPositionSize
          ? {
              left: lsPositionSize.left ?? 35,
              top: lsPositionSize.top ?? 35,
              width: lsPositionSize.width ?? 360,
              height: lsPositionSize.height ?? 280,
            }
          : {
              left: 35,
              top: 35,
              width: 360,
              height: 280,
            },
    );

    const onResize = useMemoizedFn((size: SizePositionLeftTop, _isShiftKey: boolean, _type: ResizeType) => {
      setPositionSize(size);
    });

    const onDrag = useMemoizedFn((deltaX: number, deltaY: number) => {
      setPositionSize((prev) => ({
        ...prev,
        left: prev.left + deltaX,
        top: prev.top + deltaY,
      }));
    });

    const onDragResizeStop = useMemoizedFn(() => {
      setLsPositionSize(positionSize);
    });

    const headerRender = useMemo(() => {
      if (!header) {
        return (
          <>
            <StyledResizableModalHeaderTitle>{title}</StyledResizableModalHeaderTitle>
            <StyledResizableModalHeaderHandle>
              {allowTogglePin && (
                <Button
                  icon={<PinIcon size={16} />}
                  variant="text"
                  color="default"
                  onClick={onPin}
                />
              )}
              <Button
                icon={<XIcon size={16} />}
                variant="text"
                color="default"
                onClick={setClose}
              />
            </StyledResizableModalHeaderHandle>
          </>
        );
      }

      if (typeof header === 'function') {
        return header({ onClose: setClose, onPin });
      }

      return header;
    }, [allowTogglePin, header, onPin, setClose, title]);

    const { isMounted, transitionClassName } = useToggleTransition(isOpen, positionSize);

    return (
      <ResizableRectProvider
        width={lsPositionSize?.width || 100}
        height={lsPositionSize?.height || 100}
      >
        {isMounted ? (
          <ModalResizableMovable
            ref={ref}
            className={clsx(resizableModalStyle, transitionClassName)}
            left={positionSize.left}
            top={positionSize.top}
            width={positionSize.width}
            height={positionSize.height}
            headerClassName={resizableModalHeaderStyle}
            onResize={onResize}
            onDrag={onDrag}
            onDragEnd={onDragResizeStop}
            onResizeEnd={onDragResizeStop}
            zoomable="n,ne,e,se,s,sw,w,nw"
            boundaryInWindow
            minWidth={minWidth}
            minHeight={minHeight}
            isPortal={isPortal}
            getPortalElement={getPortalElement}
            header={headerRender}
          >
            {children}
          </ModalResizableMovable>
        ) : null}
      </ResizableRectProvider>
    );
  },
);

export { useResizableRect };
