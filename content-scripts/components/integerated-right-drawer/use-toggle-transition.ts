import { useEffect, useMemo } from 'react';

import { css } from '@emotion/css';
import { CSSObject } from '@emotion/react';
import { useTransitionState } from 'react-transition-state';

export const useToggleTransition = (deliveredState: boolean, extendedWidth: number) => {
  const [{ isMounted, status }, setTransitionState] = useTransitionState({
    enter: true,
    exit: true,
    preEnter: true,
    initialEntered: deliveredState,
    timeout: 100,
    unmountOnExit: true,
    mountOnEnter: true,
    preExit: true,
  });

  useEffect(() => {
    setTransitionState(deliveredState);
  }, [deliveredState, setTransitionState]);

  const classnames = useMemo(() => {
    const preEnterAndExiting = css({
      opacity: 0,
      visibility: 'visible',
      transform: 'translateX(50%)',
      width: '0px !important',
      overflow: 'hidden',
      transformOrigin: 'center',
      transition: 'opacity 0.1s ease-in-out, transform 0.3s ease-in-out, width 0.3s ease-in-out',
    });

    const enteringObject: CSSObject = {
      opacity: 1,
      visibility: 'visible',
      transform: 'translateX(0)',
      width: `${extendedWidth}px !important`,
      transition: 'opacity 0.1s ease-in-out, transform 0.3s ease-in-out, width 0.3s ease-in-out',
    };

    const entering = css(enteringObject);

    const entered = css({
      ...enteringObject,
      transition: 'opacity 0.1s ease-in-out, transform 0.3s ease-in-out, width 0.3s ease-in-out',
    });

    const preExit = css({
      opacity: 1,
      visibility: 'visible',
      transform: 'translateX(0)',
      transformOrigin: 'center',
    });

    const unmounted = css({
      opacity: 0,
      visibility: 'hidden',
      width: '0px !important',
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
  }, [extendedWidth]);

  const transitionClassName = useMemo(() => {
    return classnames[status];
  }, [classnames, status]);

  return {
    transitionClassName,
    isMounted,
  } as const;
};
