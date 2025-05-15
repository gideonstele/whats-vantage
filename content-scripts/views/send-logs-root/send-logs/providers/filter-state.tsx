import { useState } from 'react';

import createContextContainer from '@hooks/create-context-container';

export enum FILTER_SUCCESS_OPTIONS {
  ALL = 'all',
  SUCCESS = 'success',
  FAILED = 'failed',
}

export const [FilterStateProvider, useFilterState] = createContextContainer(function useFilterState() {
  const [filterSuccess, setFilterSuccess] = useState<FILTER_SUCCESS_OPTIONS>(FILTER_SUCCESS_OPTIONS.ALL);

  return {
    filterSuccess,
    setFilterSuccess,
  };
});
