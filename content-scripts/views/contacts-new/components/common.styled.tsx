import { ButtonHTMLAttributes, forwardRef, MouseEventHandler, ReactNode, useMemo } from 'react';

import { css, keyframes } from '@emotion/css';
import styled from '@emotion/styled';
import { useMemoizedFn } from 'ahooks';
import { LoaderCircleIcon } from 'lucide-react';

export const PhoneNumberInput = styled.input({
  all: 'unset',
  boxSizing: 'border-box',
  display: 'block',
  width: '100%',
  flex: 1,
  border: 'none',

  padding: '4px 8px',
  height: '44px',
  fontSize: '16px',
  fontWeight: '500',
  lineHeight: '24px',
  borderRadius: '6px 0 0 6px',
  color: 'var(--black-a9)',
  borderBottom: '2px solid transparent',
  backgroundColor: 'var(--grass-4)',
  transition: 'border-color 0.2s ease, background-color 0.2s ease',

  '&:focus': {
    backgroundColor: 'var(--grass-5)',
    borderBottomColor: ' var(--grass-8)',
  },
  '&:focus-visible': {
    outline: 'none',
  },
  '&::placeholder': {
    color: '#f0f0f0',
    fontWeight: '200',
  },
});

const StyledPhoneButton = styled.button({
  all: 'unset',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '4px',
  border: 'none',
  backgroundColor: 'var(--grass-10)',
  padding: '4px 12px',
  height: '36px',
  fontSize: '16px',
  fontWeight: '500',
  lineHeight: '24px',
  color: '#fff',
  borderRadius: '0 6px 6px 0',
  transition: 'color 0.2s ease, background-color 0.2s ease',
  cursor: 'pointer',

  '& > .button__text': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  '&:hover': {
    backgroundColor: 'var(--grass-11)',
  },

  '&:active': {
    outline: 'none',
  },

  '&[disabled]': {
    backgroundColor: 'var(--grass-10)',
    cursor: 'not-allowed',
  },

  '&[data-loading="true"]': {
    cursor: 'progress',
    color: '#f0f0f0',
  },
});

const spinnerKeyframe = keyframes`
from {
  transform: rotate(0deg);
}

to {
  transform: rotate(360deg);
}
`;

const spinnerClass = css({
  display: 'inline-block',
  width: '14px',
  height: '14px',
  animation: `${spinnerKeyframe} 1s linear infinite`,
});

interface PhoneButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  disabled?: boolean;
  children?: ReactNode;
  icon?: ReactNode;
}

export const PhoneButton = forwardRef<HTMLButtonElement, PhoneButtonProps>(
  ({ isLoading, disabled, children, icon, onClick, ...rest }, ref) => {
    const renderIcon = useMemo(() => {
      if (isLoading) {
        return <LoaderCircleIcon className={spinnerClass} />;
      }

      return icon;
    }, [isLoading, icon]);

    const handleClick = useMemoizedFn<MouseEventHandler<HTMLButtonElement>>((e) => {
      if (isLoading) {
        e.preventDefault();
      }

      onClick?.(e);
    });

    return (
      <StyledPhoneButton
        ref={ref}
        data-loading={isLoading}
        disabled={disabled}
        onClick={handleClick}
        {...rest}
      >
        {renderIcon}
        <span className="button__text">{children}</span>
      </StyledPhoneButton>
    );
  },
);

export const TextInputLine = styled.section({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});
