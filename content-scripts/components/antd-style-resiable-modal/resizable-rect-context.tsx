import createContextContainer from '@hooks/create-context-container';

export const [ResizableRectProvider, useResizableRect] = createContextContainer<
  {
    width: number;
    height: number;
  },
  {
    width: number;
    height: number;
  }
>(function useResizableRectContainer(props) {
  return props;
});
