import { storage } from '#imports';

import dayjs from 'dayjs';

import { DailyUsed } from 'types/domain/settings';

import { LimitItem, LimitService } from './utils';

const DAILY_SENT_COUNT = 'sync:daily-sent-count';
const DAILY_JOIN_GROUP_COUNT = 'sync:daily-join-group-count';

export const StorageDailySentCount = storage.defineItem<LimitItem>(DAILY_SENT_COUNT, {
  fallback: {
    day: dayjs().format('YYYY-MM-DD'),
    value: 0,
  },
});

export const StorageDailyJoinGroupCount = storage.defineItem<LimitItem>(DAILY_JOIN_GROUP_COUNT, {
  fallback: {
    day: dayjs().format('YYYY-MM-DD'),
    value: 0,
  },
});

export const DailySentCount = new LimitService(StorageDailySentCount);

export const DailyJoinGroupCount = new LimitService(StorageDailyJoinGroupCount);

export const getDailyUsed = async (): Promise<DailyUsed> => {
  const [dailySentCount, dailyJoinGroupCount] = await Promise.all([DailySentCount.get(), DailyJoinGroupCount.get()]);

  return {
    dailySentCount,
    dailyJoinGroupCount,
  };
};
