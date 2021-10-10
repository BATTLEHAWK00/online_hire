import { Environment } from 'nunjucks';
import moment from 'moment';

moment.locale('zh-cn');

interface Filter {
  name: string;
  async?: boolean;
  // eslint-disable-next-line no-unused-vars
  filterFunc: (...args: any) => any;
}

const momentAgoFilter: Filter = {
  name: 'momentAgo',
  filterFunc(date: Date) {
    return moment(date).startOf('hour').fromNow();
  },
};

const escapeJSFilter: Filter = {
  name: 'escapeJS',
  filterFunc(templateString: string) {
    return escape(templateString);
  },
};

const timeDiffFilter: Filter = {
  name: 'timeDiff',
  filterFunc(startTime: number, endTime: number = Date.now()) {
    return endTime - startTime;
  },
};

export const filters: Filter[] = [
  momentAgoFilter,
  escapeJSFilter,
  timeDiffFilter,
];

export default function registerFilters(env: Environment) {
  filters.forEach(filter => {
    env.addFilter(filter.name, filter.filterFunc, filter.async);
  });
}
