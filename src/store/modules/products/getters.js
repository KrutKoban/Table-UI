export const getters = {
    productsPerPage: state => {
        return state.products[state.currentPage] || [];
    }
}