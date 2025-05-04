import { forwardRef, ReactNode } from 'react';

import styled from '@emotion/styled';

const Wrapper = styled.section({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 'auto',
  height: 'auto',
  gap: '4px',

  '& .suffix': {
    transition: 'opacity 0.3s ease-in-out',
    opacity: 0,
  },

  '&:hover': {
    '& .suffix': {
      opacity: 1,
    },
  },
});

export interface HoverWrapperProps {
  prefix?: ReactNode;
  suffix?: ReactNode;
  children?: ReactNode;
}

export const HoverWrapper = forwardRef<HTMLDivElement, HoverWrapperProps>(({ prefix, suffix, children }, ref) => {
  return (
    <Wrapper ref={ref}>
      {prefix}
      {children}
      {suffix}
    </Wrapper>
  );
});
