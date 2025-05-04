import clsx from 'clsx';

import { useEffect, useMemo, useRef } from 'react';

import { css } from '@emotion/css';
import { CSSObject } from '@emotion/react';
import { useTransitionState } from 'react-transition-state';

import { SizePositionLeftTop } from '@components/modal-resizable-movable';

type MousePosition = { x: number; y: number } | null;

let mousePosition: MousePosition;

const getClickPosition = (e: MouseEvent) => {
  mousePosition = {
    x: e.pageX,
    y: e.pageY,
  };
  // 100ms 内发生过点击事件，则从点击位置动画展示
  // 否则直接 zoom 展示
  // 这样可以兼容非点击方式展开
  setTimeout(() => {
    mousePosition = null;
  }, 400);
};

if (typeof document !== 'undefined' && typeof document.documentElement !== 'undefined') {
  document.documentElement.addEventListener('click', getClickPosition, true);
}

export const useToggleTransition = (
  deliveredState: boolean,
  positionSize: SizePositionLeftTop,
  customMousePosition: MousePosition = null,
) => {
  const [{ isMounted, status }, setTransitionState] = useTransitionState({
    enter: true,
    exit: true,
    preEnter: true,
    preExit: false,
    initialEntered: deliveredState,
    timeout: 100,
    unmountOnExit: true,
    mountOnEnter: true,
  });

  useEffect(() => {
    setTransitionState(deliveredState);
  }, [deliveredState, setTransitionState]);

  const classnames = useMemo(() => {
    const preEnterAndExiting = css({
      opacity: 0,
      visibility: 'visible',
      transform: 'scale(0.1)',
      transformOrigin: 'center',
      transition: 'opacity 0.1s ease-in-out, transform 0.3s ease-in-out, left 0.3s ease-in-out, top 0.3s ease-in-out',
    });

    const enteringObject: CSSObject = {
      opacity: 1,
      visibility: 'visible',
      transform: 'scale(1)',
      left: positionSize.left,
      top: positionSize.top,
      transition: 'opacity 0.1s ease-in-out, transform 0.3s ease-in-out, left 0.3s ease-in-out, top 0.3s ease-in-out',
    };

    const entering = css(enteringObject);

    const entered = css({
      ...enteringObject,
      transition: 'opacity 0.1s ease-in-out, transform 0.3s ease-in-out, left 0.3s ease-in-out, top 0.3s ease-in-out',
    });

    const preExit = css({
      opacity: 1,
      visibility: 'visible',
      transform: 'scale(1)',
      transformOrigin: 'center',
    });

    const unmounted = css({
      opacity: 0,
      visibility: 'hidden',
      transform: 'scale(0.1)',
      transformOrigin: 'center',
    });

    return {
      preEnter: preEnterAndExiting,
      exiting: preEnterAndExiting,
      entering,
      entered,
      preExit,
      exited: '',
      unmounted,
    };
  }, [positionSize.left, positionSize.top]);

  const recordedMousePosition = useRef<MousePosition>(customMousePosition);

  useMemo(() => {
    if (status === 'preEnter' && !customMousePosition && mousePosition) {
      recordedMousePosition.current = { ...mousePosition };
    }
  }, [customMousePosition, status]);

  const transitionClassName = useMemo(() => {
    if (status === 'preEnter' || status === 'exiting') {
      let originClassName = '';

      if (recordedMousePosition.current) {
        const originPosition = {
          left: recordedMousePosition.current.x - positionSize.width / 2,
          top: recordedMousePosition.current.y - positionSize.height / 2,
        };

        originClassName = css({
          left: `${originPosition.left}px !important`,
          top: `${originPosition.top}px !important`,
        });
      }

      return clsx(classnames.preEnter, originClassName);
    }

    return classnames[status];
  }, [classnames, positionSize.height, positionSize.width, status]);

  return {
    transitionClassName,
    isMounted,
  } as const;
};
