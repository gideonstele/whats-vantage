import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

// 添加一些动画效果
const pulseEffect = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const insertedEffect = keyframes`
  0% { transform: translateY(0) scale(1); }
  30% { transform: translateY(-3px) scale(1.08); }
  50% { transform: translateY(-1px) scale(1.04); background-color: #52c41a30; }
  100% { transform: translateY(0) scale(1); }
`;

export const StyledSelects = styled.section({
  position: 'relative',
  display: 'flex',
  height: '40px',
  alignItems: 'center',
  gap: '10px',
  padding: '0 6px',
  borderRadius: '8px',
  backgroundColor: '#f9f9fa',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.2s ease-in-out',
  animation: `${fadeIn} 0.3s ease-in-out`,
  touchAction: 'pan-x',
  WebkitOverflowScrolling: 'touch',

  '&:hover': {
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
  },

  '& > .scrollable-list': {
    display: 'flex',
    flex: 1,
    gap: '8px',
    overflow: 'auto',
    scrollBehavior: 'smooth',
    padding: '4px 0',
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
    WebkitOverflowScrolling: 'touch',
    touchAction: 'pan-x',

    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },

  '& > .arrow-button': {
    all: 'unset',
    display: 'flex',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 2,
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    color: '#6b7280',
    backgroundColor: 'white',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    opacity: 0.9,
  },

  '& > .arrow-button:hover': {
    backgroundColor: '#f0f0f0',
    color: '#1890ff',
    transform: 'translateY(-50%) scale(1.05)',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
    opacity: 1,
  },

  '& > .arrow-button:active': {
    transform: 'translateY(-50%) scale(0.95)',
  },

  '& > .arrow-button.left': {
    left: '4px',
    animation: `${fadeIn} 0.2s ease-in-out`,
  },

  '& > .arrow-button.right': {
    right: '4px',
    animation: `${fadeIn} 0.2s ease-in-out`,
  },

  '&.scroll-width-left': {
    '&::before': {
      position: 'absolute',
      content: '""',
      top: '0',
      left: '0',
      width: '40px',
      height: '100%',
      background: 'linear-gradient(to right, #f9f9fa, rgba(249, 249, 250, 0))',
      borderRadius: '8px 0 0 8px',
      zIndex: 1,
      pointerEvents: 'none',
    },
  },

  '&.scroll-width-right': {
    '&::after': {
      position: 'absolute',
      content: '""',
      top: '0',
      right: '0',
      width: '40px',
      height: '100%',
      background: 'linear-gradient(to left, #f9f9fa, rgba(249, 249, 250, 0))',
      borderRadius: '0 8px 8px 0',
      zIndex: 1,
      pointerEvents: 'none',
    },
  },
});

// 新增标签样式
export const StyledTagItem = styled.div({
  display: 'inline-flex',
  alignItems: 'center',
  margin: 0,
  cursor: 'pointer',
  borderRadius: '6px',
  padding: '2px 10px',
  fontSize: '13px',
  fontWeight: 500,
  border: 'none',
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
  animation: `${fadeIn} 0.3s ease-in-out`,
  userSelect: 'none',
  backgroundColor: '#e6f7ff',
  color: '#1890ff',
  transform: 'translateY(0)',
  transition: 'all 0.2s ease',

  '&:hover': {
    transform: 'translateY(-1px)',
    backgroundColor: '#bae7ff',
    color: '#096dd9',
    boxShadow: '0 2px 4px rgba(24, 144, 255, 0.15)',
  },

  '&:active': {
    transform: 'translateY(1px)',
    animation: `${pulseEffect} 0.3s`,
  },

  '&.inserted, &[data-tag-value].inserted': {
    animation: `${insertedEffect} 0.5s ease`,
  },
});

export const StyledTextAreaWrapper = styled.section({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
});
