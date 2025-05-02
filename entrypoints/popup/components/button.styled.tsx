import styled from '@emotion/styled';

export const StyledButton = styled.button({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '10px 16px',
  fontSize: '14px',
  fontWeight: 500,
  color: '#ffffff',
  backgroundColor: '#25D366',
  border: 'none',
  borderRadius: '999px',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
  width: '100%',
  '&:hover': {
    backgroundColor: '#128C7E',
  },
});
