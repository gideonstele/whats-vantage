import dayjs from 'dayjs';

import wax from '@jvitela/mustache-wax';

import mustache from 'mustache';

wax(mustache);

Object.assign(mustache, {
  Formatters: {
    formatDate: function (date: string | number | Date, format: string = 'YYYY-MM-DD') {
      return dayjs(date).format(format);
    },
    formatTime: function (date: string | number | Date, format: string = 'HH:mm') {
      return dayjs(date).format(format);
    },
  },
});

export const mustacheRenderer = (
  template: string,
  data: Record<string, string | undefined | null | Record<string, any>>,
) => {
  return mustache.render(template, data);
};
