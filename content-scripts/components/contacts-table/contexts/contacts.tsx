import { useMemo } from 'react';

import { useMemoizedFn } from 'ahooks';
import { useImmer } from 'use-immer';

import createContextContainer from '@hooks/create-context-container';
import { usePaginationContainer } from '@hooks/use-pagnation';
import { SearchByOptions } from 'types/common';
import { ContactDbListParams } from 'types/db/contacts';
import { FormattedContact } from 'types/domain/contacts';

import { useQueryContacts } from '../../../query/contacts';

export const [PaginatedContactsProvider, usePaginatedContactsData] = createContextContainer(
  function useContactsContext() {
    const { offset, page, pageSize, setPage, setPageSize } = usePaginationContainer(
      useMemo(
        () => ({
          initialPage: 1,
          initialPageSize: 50,
        }),
        [],
      ),
    );

    const [searchParams, setSearchParams] = useImmer<
      Omit<FormattedContact, 'id' | 'userhash' | 'avatar' | 'server' | 'idObject' | 'groups'>
    >({
      name: '',
      phoneNumber: '',
      // isMyContact: '',
      // isBusiness: '',
      // isBroadcast: '',
      // isConsumer: '',
      // isGroup: '',
      // isManualAdded: '',
    });

    const queryParams = useMemo<ContactDbListParams>(
      () => ({
        offset,
        limit: pageSize,
        orderBy: [],
        searchs: Object.entries(searchParams).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== '') {
            acc.push({
              key: key as keyof FormattedContact,
              search: value,
            });
          }
          return acc;
        }, [] as SearchByOptions<FormattedContact>[]),
      }),
      [offset, pageSize, searchParams],
    );

    const setSearchName = useMemoizedFn((name: string) => {
      setSearchParams((draft) => {
        draft.name = name;
      });
      setPage(1);
    });

    const setSearchPhoneNumber = useMemoizedFn((phoneNumber: string) => {
      setSearchParams((draft) => {
        draft.phoneNumber = phoneNumber;
      });
      setPage(1);
    });

    const setIsQuery = useMemoizedFn(
      (
        key: 'isMyContact' | 'isBusiness' | 'isBroadcast' | 'isConsumer' | 'isGroup' | 'isManualAdded',
        value?: boolean | undefined,
      ) => {
        setSearchParams((draft) => {
          if (value === undefined) {
            delete draft[key];
          } else {
            draft[key] = value;
          }
        });
      },
    );

    const setIsMyContactQuery = useMemoizedFn((value?: boolean | undefined) => {
      setIsQuery('isMyContact', value);
      setPage(1);
    });

    const setIsBusinessQuery = useMemoizedFn((value?: boolean | undefined) => {
      setIsQuery('isBusiness', value);
      setPage(1);
    });

    const setIsManualAddedQuery = useMemoizedFn((value?: boolean | undefined) => {
      setIsQuery('isManualAdded', value);
      setPage(1);
    });

    const resetQuery = useMemoizedFn(() => {
      setSearchParams({
        name: '',
        phoneNumber: '',
      });
      setPage(1);
    });

    const { data: paginatedContacts, isLoading, isError, error } = useQueryContacts(queryParams);

    return {
      page,
      pageSize,
      setPage,
      setPageSize,
      total: paginatedContacts?.total || 0,
      data: paginatedContacts?.data || [],
      isLoading,
      isError,
      error,
      queryParams,
      searchParams,
      resetQuery,
      setSearchName,
      setSearchPhoneNumber,
      setIsMyContactQuery,
      setIsBusinessQuery,
      setIsManualAddedQuery,
    };
  },
);

export const [SelectedContactsProvider, useSelectedContacts] = createContextContainer(
  function useSelectedContactsContext() {
    const [selectedContacts, setSelectedContacts] = useImmer<FormattedContact[]>([]);

    return {
      selectedContacts,
      setSelectedContacts,
    };
  },
);
