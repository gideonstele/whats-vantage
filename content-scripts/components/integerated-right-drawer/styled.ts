import styled from '@emotion/styled';

export const StyledIntegratedRightDrawer = styled.section({
  position: 'relative',
  top: 'auto',
  height: '100%',
  minWidth: '360px',
  zIndex: 1000,
  backgroundColor: '#fff',
  width: 'var(--wpp-right-drawer-width)',
});

export const StyledIntegratedRightDrawerHeader = styled.header({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px',
  borderBottom: '1px solid #f0f0f0',
});

export const StyledIntegratedRightDrawerHeaderTitle = styled.h3({
  margin: 0,
  fontSize: '16px',
  fontWeight: 'bold',
  height: '24px',
  lineHeight: '24px',
});

export const StyledIntegratedRightDrawerHeaderHandle = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

export const StyledIntegratedRightDrawerContent = styled.div({
  position: 'relative',
  padding: '16px',
  height: 'calc(100% - 56px)',
});
