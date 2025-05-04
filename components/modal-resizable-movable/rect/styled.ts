import { css } from '@emotion/css';
import styled from '@emotion/styled';

export const StyledRect = styled.section({
  position: 'absolute',

  '.square': {
    display: 'none',
    position: 'absolute',
    width: '7px',
    height: '7px',
    background: 'white',
    border: '1px solid #eb5648',
    borderRadius: '1px',
  },

  '.resizable-handler': {
    position: 'absolute',
    width: '14px',
    height: '14px',
    cursor: 'pointer',
    zIndex: 10,

    '&.tl,&.t,&.tr': {
      top: '-7px',
    },
    '&.tl, &.l, &.bl': {
      left: '-7px',
    },
    '&.bl, &.b, &.br': {
      bottom: '-7px',
    },
    '&.br, &.r,&.tr': {
      right: '-7px',
    },
    '&.l,&.r': {
      top: '7px',
      bottom: '7px',
      height: 'calc(100% - 14px)',
    },
    '&.t, &.b': {
      left: '7px',
      right: '7px',
      width: 'calc(100% - 14px)',
    },
  },
  '.t, .tl, .tr': {
    top: '-3px',
  },

  '.b, .bl, .br': {
    bottom: '-3px',
  },

  '.r, .tr, .br': {
    right: '-3px',
  },

  '.tl, .l, .bl': {
    left: '-3px',
  },

  '.l, .r': {
    top: '50%',
    marginTop: '-3px',
  },

  '.t, .b': {
    left: '50%',
    marginLeft: '-3px',
  },
});

export const StyledHeader = styled.section({
  boxSizing: 'border-box',
  position: 'relative',
  width: '100%',
  height: 'var(--resizable-movable-header-height, 42px)',
  padding: `var(--resizable-movable-padding-block-start, 0) var(--resizable-movable-padding-inline-end, 0) var(--resizable-movable-padding-block-end, 0) var(--resizable-movable-padding-inline-start, 0)`,
});

export const movingDocumentBodyClassOverwrite = css({
  userSelect: 'none',
  [`& ${StyledRect}`]: {
    transition: 'none !important',
  },
});
