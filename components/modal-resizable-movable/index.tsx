import { logger } from '@debug';

import { CSSProperties, forwardRef, memo, ReactNode, useMemo } from 'react';
import { createPortal } from 'react-dom';

import { useIsomorphicLayoutEffect, useMemoizedFn } from 'ahooks';

import { useWindowSize } from '@hooks/use-window-size';

import { MovableBoundary, Rect, RectComponent } from './rect';
import {
  centerToTL,
  CursorDirection,
  getNewStyle,
  PositionCenter,
  PositionLeftTop,
  ResizeType,
  Size,
  SizePositionLeftTop,
  tLToCenter,
} from './utils';

export type { CursorDirection, PositionCenter, PositionLeftTop, Rect, ResizeType, Size, SizePositionLeftTop };
export interface ModalResizableMovableProps extends SizePositionLeftTop {
  zoomable?: string;
  minWidth?: number;
  minHeight?: number;
  children?: ReactNode;
  aspectRatio?: false | number;
  header?: ReactNode;
  headerClassName?: string;
  headerStyle?: CSSProperties;

  movableBoundary?: MovableBoundary;
  boundaryInWindow?: boolean;

  isPortal?: boolean;
  getPortalElement?: () => HTMLElement;

  className?: string;

  onResizeStart?: () => void;
  onResize?: (size: SizePositionLeftTop, isShiftKey: boolean, type: ResizeType) => void;
  onResizeEnd?: () => void;
  onDragStart?: () => void;
  onDrag?: (deltaX: number, deltaY: number) => void;
  onDragEnd?: () => void;
}

export const ModalResizableMovable = memo(
  forwardRef<HTMLDivElement, ModalResizableMovableProps>(function ModalResizableMovable(
    {
      left,
      top,
      width,
      height,
      children,
      header,
      headerClassName,
      headerStyle,
      zoomable = '',
      minHeight = 50,
      minWidth = 50,
      aspectRatio = false,
      movableBoundary,
      boundaryInWindow = true,
      className,
      isPortal = false,

      getPortalElement = () => document.querySelector('[data-wxt-integrated]'),

      onResizeStart,
      onResize,
      onResizeEnd,
      onDragStart,
      onDrag,
      onDragEnd,
    },
    ref,
  ) {
    const windowSize = useWindowSize();

    const handleResize = useMemoizedFn(
      (length: number, aplha: number, rect: Rect, type: ResizeType, isShiftKey: boolean) => {
        const deltaW = length * Math.cos(aplha);
        const deltaH = length * Math.sin(aplha);

        const ratio = isShiftKey && !aspectRatio ? rect.width / rect.height : aspectRatio;

        const {
          position: { centerX, centerY },
          size: { width, height },
        } = getNewStyle(type, rect, deltaW, deltaH, ratio, minWidth, minHeight);

        onResize?.(centerToTL({ centerX, centerY, width, height }), isShiftKey, type);
      },
    );

    const fixBoundaryWhenEnd = useMemoizedFn(() => {
      const minX = boundaryInWindow ? 0 : (movableBoundary?.minX ?? 0);
      const minY = boundaryInWindow ? 0 : (movableBoundary?.minY ?? 0);
      const maxX = boundaryInWindow ? windowSize.width : (movableBoundary?.maxX ?? windowSize.width);
      const maxY = boundaryInWindow ? windowSize.height : (movableBoundary?.maxY ?? windowSize.height);

      const safeWidth = maxX - minX;
      const safeHeight = maxY - minY;

      const shouldShrinkWidth = width > safeWidth;
      const shouldExpandWidth = width < minWidth;
      const shouldShrinkHeight = height > safeHeight;
      const shouldExpandHeight = height < minHeight;

      const fixedWidth = shouldShrinkWidth ? safeWidth : shouldExpandWidth ? minWidth : width;
      const fixedHeight = shouldShrinkHeight ? safeHeight : shouldExpandHeight ? minHeight : height;

      let deltaXFromPosition = 0;
      let deltaYFromPosition = 0;

      let deltaXFromSize = 0;
      let deltaYFromSize = 0;

      if (left < minX) {
        deltaXFromPosition = minX - left;
      }

      if (top < minY) {
        deltaYFromPosition = minY - top;
      }

      if (left + deltaXFromPosition + width > maxX) {
        deltaXFromSize = maxX - (left + deltaXFromPosition + width);
      }

      if (top + deltaYFromPosition + height > maxY) {
        deltaYFromSize = maxY - (top + deltaYFromPosition + height);
      }

      const deltaX = deltaXFromPosition + deltaXFromSize;
      const deltaY = deltaYFromPosition + deltaYFromSize;

      if (fixedWidth !== width || fixedHeight !== height || deltaX !== 0 || deltaY !== 0) {
        onResize?.(
          {
            left: left + deltaX,
            top: top + deltaY,
            width: fixedWidth,
            height: fixedHeight,
          },
          false,
          'br',
        );
      }

      // if (deltaX !== 0 || deltaY !== 0) {
      //   onDrag?.(deltaX, deltaY);
      // }
    });

    const handleDragEnd = useMemoizedFn(() => {
      fixBoundaryWhenEnd();
      onDragEnd?.();
    });

    const handleResizeEnd = useMemoizedFn(() => {
      fixBoundaryWhenEnd();
      onResizeEnd?.();
    });

    const styles = tLToCenter({ left, top, width, height });

    useIsomorphicLayoutEffect(() => {
      if (boundaryInWindow && movableBoundary) {
        logger.warn(
          '[ModalResizableMovable] `boundaryInWindow = true` and `movableBoundary` cannot be used at the same time. `movableBoundary` will be ignored.',
        );
      }
    }, [boundaryInWindow, movableBoundary]);

    useIsomorphicLayoutEffect(() => {
      if (isPortal && !getPortalElement()) {
        logger.warn('[ModalResizableMovable] `isPortal = true` but `getPortalElement` returned null.');
      }
    }, [getPortalElement, isPortal]);

    const content = (
      <RectComponent
        ref={ref}
        className={className}
        position={styles.position}
        size={styles.size}
        zoomable={zoomable}
        onResize={handleResize}
        onResizeStart={onResizeStart}
        onResizeEnd={handleResizeEnd}
        onDragStart={onDragStart}
        onDragEnd={handleDragEnd}
        onDrag={onDrag}
        header={header}
        headerClassName={headerClassName}
        headerStyle={headerStyle}
      >
        {children}
      </RectComponent>
    );

    const PortalElement = useMemo(() => getPortalElement(), [getPortalElement]);

    return isPortal && PortalElement ? createPortal(content, PortalElement) : content;
  }),
);
