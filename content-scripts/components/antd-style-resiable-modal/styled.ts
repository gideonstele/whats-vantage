import { css } from '@emotion/css';
import styled from '@emotion/styled';

export const resizableModalStyle = css({
  position: 'absolute',
  zIndex: 3000,
  borderRadius: '8px',
  boxShadow: `0 6px 16px 0 rgba(0, 0, 0, 0.08),
      0 3px 6px -4px rgba(0, 0, 0, 0.12),
      0 9px 28px 8px rgba(0, 0, 0, 0.05)`,
  overflow: 'hidden',
  backgroundColor: '#fff',
  '--resizable-movable-header-height': '44px',
  '--resizable-movable-padding-block-start': '10px',
  '--resizable-movable-padding-block-end': '10px',
  '--resizable-movable-padding-inline-start': '24px',
  '--resizable-movable-padding-inline-end': '24px',
});

export const resizableModalHeaderStyle = css({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  margin: '10px 0 8px',
});

export const StyledResizableModalHeaderTitle = styled.h1({
  position: 'relative',
  padding: 0,
  margin: 0,
  fontSize: '16px',
  lineHeight: '24px',
  fontWeight: '500',
  color: '#333',
  userSelect: 'none',
  wordBreak: 'break-word',
});

export const StyledResizableModalHeaderHandle = styled.section({
  boxSizing: 'border-box',
  position: 'absolute',
  top: '50%',
  right: '20px',
  transform: 'translateY(-50%)',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: '5px',
});

export const StyledResizableModalBody = styled.section({
  boxSizing: 'border-box',
  position: 'relative',
  flex: 1,
  height: 'calc(100% - 62px)',
  padding: '16px',
});
