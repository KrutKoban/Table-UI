import { getters } from './getters';
import { mutations } from './mutations';
import { actions } from './actions';

export default {
  state: {
    productsCommon: [],
    products: [],
    productLength: 0,
    currentPage: 0,
    count: 10,
    ids: [],
    sortingBy: 'product',
    orderByAsc: true
  },
  actions,
  mutations,
  getters
}