import { getProducts, deleteProducts } from '../../../js/request';

export const actions =  {
    getProductsList({ commit, dispatch }) {
        getProducts()
        .then(res => {
            commit('setProducts', res);
            dispatch('setCurrentPage', 0);
        })
        .catch(err => {
            console.log(err);
            alert(err.error);
            commit('setProducts', []);
        })
    },

    deleteProductsList({ commit }, data) {
        deleteProducts()
        .then(() => {
            const ids = data.map(el => el.id);
            commit('setDeleted', ids);
            commit('setProducts');
        })
        .catch(err => {
            alert(err.error);
            console.log(err);
        });
    },

    setCurrentPage({ commit }, page) {
        commit('setPage', page);
    },

    setCurrentCount({ commit }, count) {
        commit('setCount', count);
    }
}
