import { useEffect, useMemo } from 'react';
import { useImmer } from 'use-immer';

import { useQuerySendLogs } from '@content-scripts/query/send-logs';
import createContextContainer from '@hooks/create-context-container';
import { usePagination } from '@hooks/use-pagnation';
import { SearchByOptions } from 'types/common';
import { SendLogDbListParams } from 'types/db/send-logs';
import { SendLogItem } from 'types/domain/send-logs';

import { FILTER_SUCCESS_OPTIONS, useFilterState } from './filter-state';

export const [LogsDataProvider, useLogsData] = createContextContainer(function useData() {
  const { offset, page, pageSize, setPage, setPageSize } = usePagination();

  const { filterSuccess } = useFilterState();

  const options = useMemo<SendLogDbListParams>(() => {
    let searchs: SearchByOptions<SendLogItem>[] = [];

    if (filterSuccess === FILTER_SUCCESS_OPTIONS.SUCCESS) {
      searchs = [
        {
          key: 'success',
          search: true,
        },
      ];
    } else if (filterSuccess === FILTER_SUCCESS_OPTIONS.FAILED) {
      searchs = [
        {
          key: 'success',
          search: false,
        },
      ];
    } else {
      searchs = [];
    }

    return {
      offset,
      limit: pageSize,
      searchs,
    };
  }, [filterSuccess, offset, pageSize]);

  const { data, isLoading, isError } = useQuerySendLogs(options);

  const [selectedLogs, setSelectedLogs] = useImmer<SendLogItem[]>([]);

  useEffect(() => {
    if (data?.data) {
      setSelectedLogs([]);
    }
  }, [data, setSelectedLogs]);

  return {
    data,
    isLoading,
    isError,
    page,
    pageSize,
    setPage,
    setPageSize,
    selectedLogs,
    setSelectedLogs,
  };
});
