import { useMemo, useState } from 'react';

import createContextContainer from '@hooks/create-context-container';

export type UsePaginationOption = {
  initialPage?: number;
  initialPageSize?: number;
  fromZero?: boolean;
};

export interface UsePaginationContext {
  page: number;
  offset: number;
  pageSize: number;
  setPageSize: (pageSize: number) => void;
  setPage: (page: number) => void;
}

export const usePaginationContainer = (
  options: UsePaginationOption = {
    initialPage: 1,
    initialPageSize: 10,
    fromZero: false,
  },
): UsePaginationContext => {
  const { initialPage = 1, initialPageSize = 10, fromZero = false } = options;
  const [page, setPage] = useState(fromZero ? initialPage - 1 : initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const offset = useMemo(() => {
    return fromZero ? page * pageSize : (page - 1) * pageSize;
  }, [fromZero, page, pageSize]);

  return {
    page,
    offset,
    pageSize,
    setPageSize,
    setPage,
  };
};

export const [PaginationProvider, usePagination] = createContextContainer<UsePaginationContext, UsePaginationOption>(
  usePaginationContainer,
);
