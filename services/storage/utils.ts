/* eslint-disable @typescript-eslint/no-empty-object-type */
import { WxtStorageItem } from '#imports';

import dayjs from 'dayjs';

export const validateNumber = (value: number | undefined, maxLimit: number, fallback: number) => {
  if (value === undefined) {
    return fallback;
  }
  return Math.min(Math.max(value, 0), maxLimit);
};

const getDailyCount = async (storage: WxtStorageItem<LimitItem, {}>) => {
  const { day, value } = await storage.getValue();
  if (dayjs(day).isSame(dayjs(), 'day')) {
    return value;
  }

  await storage.setValue({
    day: dayjs().format('YYYY-MM-DD'),
    value: 0,
  });

  return 0;
};

export type LimitItem = {
  day: string;
  value: number;
};

export class LimitService {
  constructor(private readonly storage: WxtStorageItem<LimitItem, {}>) {}

  async get() {
    return getDailyCount(this.storage);
  }

  async set(value: number) {
    await this.storage.setValue({
      day: dayjs().format('YYYY-MM-DD'),
      value,
    });
  }

  async add(value: number) {
    const current = await this.get();
    await this.set(current + value);
  }
}
