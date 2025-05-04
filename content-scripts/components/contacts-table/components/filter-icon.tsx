/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react';

import { ListFilterIcon } from 'lucide-react';

import { FormattedContact } from 'types/domain/contacts';
import { IconType } from 'types/react';

export interface FilterIconProps {
  filterKeys: (keyof Omit<FormattedContact, 'id' | 'userhash' | 'avatar' | 'server' | 'idObject' | 'groups'>)[];
  Icon?: IconType;
  searchParams?: Record<string, any>;
}

export const FilterIcon = ({ filterKeys, Icon = ListFilterIcon, searchParams = {} }: FilterIconProps) => {
  const isFiltered = useMemo(() => {
    return filterKeys.some((key) => searchParams[key] !== undefined && searchParams[key] !== '');
  }, [searchParams, filterKeys]);

  return <Icon color={isFiltered ? '#1677ff' : undefined} />;
};
