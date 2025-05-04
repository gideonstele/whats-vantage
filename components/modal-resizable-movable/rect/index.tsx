import {
  CSSProperties,
  forwardRef,
  MouseEvent as ReactMouseEvent,
  ReactNode,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';

import { useMemoizedFn } from 'ahooks';

import { CursorDirection, getCursor, getLength, ResizeType } from '../utils';

import { movingDocumentBodyClassOverwrite, StyledHeader, StyledRect } from './styled';

export interface Rect {
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}

export interface MovableBoundary {
  minX?: number;
  maxX?: number;
  minY?: number;
  maxY?: number;
}

export interface RectProps {
  className?: string;
  header?: ReactNode;
  headerClassName?: string;
  headerStyle?: CSSProperties;
  position: {
    centerX: number;
    centerY: number;
  };
  size: {
    width: number;
    height: number;
  };
  zoomable: string;
  onResizeStart?: () => void;
  onResize: (length: number, alpha: number, rect: Rect, type: ResizeType, isShiftKey: boolean) => void;
  onResizeEnd?: () => void;
  onDragStart?: () => void;
  onDrag?: (deltaX: number, deltaY: number) => void;
  onDragEnd?: () => void;
  children?: ReactNode;
}

const zoomableMap: Record<CursorDirection, ResizeType> = {
  n: 't',
  s: 'b',
  e: 'r',
  w: 'l',
  ne: 'tr',
  nw: 'tl',
  se: 'br',
  sw: 'bl',
} as const;

export const RectComponent = forwardRef<HTMLDivElement, RectProps>(function RectComponent(
  {
    children,
    header,
    headerClassName,
    headerStyle,
    position,
    size,
    zoomable,
    onResizeStart,
    onResize,
    onResizeEnd,
    onDragStart,
    onDrag,
    onDragEnd,
    className = '',
  },
  ref,
) {
  const elementRef = useRef<HTMLDivElement>(null);
  const isMouseDown = useRef(false);

  useImperativeHandle(ref, () => elementRef.current as HTMLDivElement, []);

  const startDrag = useMemoizedFn((e: ReactMouseEvent) => {
    let startX = e.clientX;
    let startY = e.clientY;
    onDragStart?.();
    isMouseDown.current = true;

    document.body.classList.add(movingDocumentBodyClassOverwrite);

    const onMove = (e: MouseEvent) => {
      if (!isMouseDown.current) return;
      e.stopImmediatePropagation();
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      onDrag?.(deltaX, deltaY);
      startX = e.clientX;
      startY = e.clientY;
    };

    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      if (!isMouseDown.current) return;
      isMouseDown.current = false;
      document.body.classList.remove(movingDocumentBodyClassOverwrite);
      onDragEnd?.();
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });

  const startResize = useMemoizedFn((e: ReactMouseEvent, cursor: string) => {
    if (e.button !== 0) return;
    document.body.style.cursor = cursor;
    document.body.style.userSelect = 'none';
    const { width, height } = size;
    const { centerX, centerY } = position;
    const { clientX: startX, clientY: startY } = e;
    const rect = { width, height, centerX, centerY };
    const type = ((e.target as HTMLElement).getAttribute('data-direction') ?? '') as ResizeType;

    onResizeStart?.();
    isMouseDown.current = true;

    const onMove = (e: MouseEvent) => {
      if (!isMouseDown.current) return;
      e.stopImmediatePropagation();
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      const alpha = Math.atan2(deltaY, deltaX);
      const deltaL = getLength(deltaX, deltaY);

      onResize(deltaL, alpha, rect, type as ResizeType, e.shiftKey);
    };

    const onUp = () => {
      document.body.style.cursor = 'auto';
      document.body.style.userSelect = 'auto';
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      if (!isMouseDown.current) return;
      isMouseDown.current = false;
      onResizeEnd?.();
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });

  const style: CSSProperties = {
    width: Math.abs(size.width),
    height: Math.abs(size.height),
    left: position.centerX - Math.abs(size.width) / 2,
    top: position.centerY - Math.abs(size.height) / 2,
  };

  const direction = useMemo(
    () =>
      zoomable
        .split(',')
        .map((d) => d.trim())
        .filter(Boolean) as CursorDirection[],
    [zoomable],
  );

  return (
    <StyledRect
      ref={elementRef}
      className={` ${className}`}
      style={style}
    >
      <StyledHeader
        className={headerClassName}
        style={headerStyle}
        onMouseDown={startDrag}
      >
        {header}
      </StyledHeader>
      {children}
      {direction.map((d) => {
        const cursor = `${getCursor(d)}-resize`;
        return (
          <div
            key={d}
            style={{ cursor }}
            className={`${zoomableMap[d]} resizable-handler`}
            data-direction={zoomableMap[d]}
            onMouseDown={(e) => startResize(e, cursor)}
          />
        );
      })}

      {direction.map((d) => (
        <div
          key={d}
          className={`${zoomableMap[d]} square`}
        />
      ))}
    </StyledRect>
  );
});
