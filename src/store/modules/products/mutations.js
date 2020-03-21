import Vue from 'vue';

export const mutations = {
    setProducts(state, data) {
        if (data) {
            state.productsCommon = data;
        }
        state.productsCommon = state.productsCommon.filter(el => !state.ids.includes(el.id));
        state.productsCommon.sort((a, b) => {
            if (!state.orderByAsc) {
                let c = a;
                a = b;
                b = c;
            }
            if (a[state.sortingBy] < b[state.sortingBy]) {
                return -1;
            }
            if (a[state.sortingBy] > b[state.sortingBy]) {
                return 1;
            }
            return 0;
        });
        state.products = [];
        Vue.set(state, 'productLength', state.productsCommon.length);
        let page = 0;
        for(let i = 0; i < state.productsCommon.length; i++) {
            if (!state.products[page]) {
                Vue.set(state.products, page, []);
                state.products[page] = [];
            }
            if (state.products[page].length < state.count) {
                state.products[page].push(state.productsCommon[i]);
            } else {
                i--;
                page++;
            }
        }
    },

    setPage(state, data) {
        state.currentPage = data;
    },

    setCount(state, data) {
        state.count = data;
    },

    setDeleted(state, data) {
        state.ids = state.ids.concat(data);
    },

    setSortingBy(state, data) {
        state.sortingBy = data;
    },

    setOrderBy(state, data) {
        state.orderByAsc = data;
    }
}