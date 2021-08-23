import {Environment} from 'nunjucks';
import moment from "moment";

moment.locale('zh-cn')

interface Filter {
    name: string,
    async?: boolean,
    filterFunc: (...args: any) => any
}

const momentAgoFilter: Filter = {
    name: 'momentAgo',
    filterFunc(date: Date) {
        return moment(date).startOf('hour').fromNow();
    }
}

const filters: Filter[] = [
    momentAgoFilter
]
export default function registerFilters(env: Environment) {
    filters.forEach((filter) => {
        env.addFilter(filter.name, filter.filterFunc, filter.async)
    })
}