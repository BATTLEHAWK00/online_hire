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
    console.log(escape(templateString));
    return escape(templateString);
  },
};

export const filters: Filter[] = [momentAgoFilter, escapeJSFilter];

export default function registerFilters(env: Environment) {
  filters.forEach(filter => {
    env.addFilter(filter.name, filter.filterFunc, filter.async);
  });
}
