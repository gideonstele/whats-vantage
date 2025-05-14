import styled from '@emotion/styled';

export const StyledTemplateCell = styled.section({
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  margin: '0 auto',
  width: '100%',
  height: '100%',
  maxWidth: '320px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});
