import styled from '@emotion/styled';

export const ModalBodyViewLayout = styled.section({
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  flex: 1,
  height: 'calc(100% - 62px)',
  width: '100%',
  paddingInline: 'var(--resizable-movable-padding-inline-start) var(--resizable-movable-padding-inline-end)',
});
