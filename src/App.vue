<template>
    <div class="container">
        <div class="title">
            Table UI
        </div>

        <div class="divider"></div>

        <div class="top-menu">
            <div class="sorting">
                <div class="sorting__by">Sorting by:</div>
                <div
                    v-for="(column, key) in columns"
                    :key="key"
                    :class="{'sorting__item': true, 'sorting__item--chosen': sortingBy === column.key}"
                    @click="changeSortingBy(column)"
                >
                        {{ column.value }}
                </div>
            </div>

            <div class="pagination">
                <button class="button pagination-item" :disabled="checkedItems.length === 0" @click="deleteItems">
                    Delete <template v-if="checkedItems.length">({{ checkedItems.length }})</template>
                </button>

                <div class="select pagination-item">
                    <div class="select__count" @click="selectCountToggle">{{ currentCount }} Per Page</div>
                    <img class="select__image" width="8" height="5" src="./assets/select.png" @click="selectCountToggle"/>
                    <div class="select-container" v-if="showSelectCount">
                        <div
                            v-for="(count, key) in counts"
                            :key="key"   
                            class="select-container__item" 
                            @click="changeCount(count)"
                        >
                        {{ count }}
                        </div>
                    </div>
                </div>

                <div class="button button--prev pagination-item"  @click="prevPage">
                    <img width="5" height="8" src="./assets/prev.png"/>
                </div>

                <div class="count-info">
                    <template v-if="productLength">
                        {{ currentCountInfo }} of {{ productLength }}
                    </template>

                    <template v-else>
                        -
                    </template>
                </div>

                <div class="button button--next pagination-item" @click="nextPage">
                    <img width="5" height="8" src="./assets/next.png"/>
                </div>

                <div class="select pagination-item" v-close-out="closeSelectField">
                    <div class="select__count" @click="selectFieldToggle">{{ chosenColumns.length }} columns selected</div>
                    <img class="select__image" width="8" height="5" src="./assets/select.png" @click="selectFieldToggle"/>
                    <div class="select-container" v-if="showSelectField" >
                        <div class="select-container__item">
                            <input type="checkbox" v-model="selectedColumns"  @click="chooseAllColumns"/><span>Select All</span>
                        </div>
                        <div
                            v-for="(field, key) in columns"
                            :key="key"   
                            class="select-container__item" 
                        >
                        <input type="checkbox" v-model="field.checked"/><span>{{ field.value }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <table class="table">
            <tr class="table-header">
                <th class="table-header__checkbox">
                    <input type="checkbox" v-model="checkedAll" @click="chooseAll"/>
                </th>
                <th v-for="(header, key) in chosenColumns" :key="key" :class="{'table-header-text': true, 'table-header-text--sorting-by': sortingBy === header.key }">
                    <span>{{ header.value }}</span>
                    <img :class="{'table-header-text__image': true, 'table-header-text__image--rotate': !orderByAsc}" v-if="sortingBy === header.key" width="8" height="12" src="./assets/arrow.png"/>
                </th>
                <th></th>
            </tr>

            <tr class="table-body" v-for="(item, itemKey) in productsPerPage" :key="itemKey">
                <td class="table-checkbox">
                    <input type="checkbox" :value="item" v-model="checkedItems"/>
                </td>

                <td v-for="(field, fieldKey) in chosenColumns" :key="fieldKey">
                    {{ item[field.key] }}
                </td>

                <td>
                    <div class="delete-item">
                        <img width="12" height="16" src="./assets/delete.png" @click="openDeleteConfirm(itemKey)"/>
                        <div class="delete-item__text" @click="openDeleteConfirm(itemKey)">delete</div>
                        <div class="delete-confirm" v-if="currentItem === itemKey">
                            <div class="delete-confirm__text">Are you sure you want to delete item?</div>
                            <div class="delete-button-block">
                                <div class="delete-button-block__cancel" @click="cancelDelete">Cancel</div>
                                <div class="delete-button-block__confirm" @click="deleteItem(item)">Confirm</div>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
        </table>
        <div class="table-empty" v-if="!productLength">
            No data.
        </div>
    </div>
</template>

<script>
    import { mapState, mapGetters } from 'vuex';

    export default {
        data() {
            return {
                currentItem: '',
                showSelectCount: false,
                showSelectField: false,
                counts: [10, 15, 20],
                columns: [
                    { key: 'product', value: 'Product (100g serving)'},
                    { key: 'calories', value: 'Calories'},
                    { key: 'fat', value: 'Fat (g)'},
                    { key: 'carbs', value: 'Carbs (g)'},
                    { key: 'protein', value: 'Protein (g)'},
                    { key: 'iron', value: 'Iron (%)',},
                ],
                checkedItems: [],
                selectedColumns: true,
                checkedAll: false
            }
        },

        directives: {
            closeOut: {
                bind: (el, binding, vnode) => {
                    el.clickOutsideEvent = (event) => {
                        if (!(el == event.target || el.contains(event.target))) {
                            vnode.context[binding.expression](event);
                        }
                    };
                    document.body.addEventListener('click', el.clickOutsideEvent)
                },
                unbind: (el) => {
                    document.body.removeEventListener('click', el.clickOutsideEvent)
                },
            }
        },

        watch: {
            checkedItems(arr) {
                if(arr.length < this.productsPerPage.length) {
                    this.checkedAll = false;
                }
            },

            chosenColumns(arr) {
                if (arr.length < this.columns.length) {
                    this.selectedColumns = false;
                }
            }
        },

        computed: {
            ...mapState({
                products: state => state.products.products,
                currentPage: state => state.products.currentPage,
                productLength: state => state.products.productLength,
                currentCount: state => state.products.count,
                sortingBy: state => state.products.sortingBy,
                orderByAsc: state => state.products.orderByAsc
            }),
            ...mapGetters(['productsPerPage']),

            currentCountInfo() {
                const firstNumber = this.currentPage * this.currentCount + 1;
                const secondNumber = this.currentPage * this.currentCount + this.products[this.currentPage].length;
                return [firstNumber, secondNumber].join(' - ');
            },

            chosenColumns() {
                return this.columns.filter(el => el.checked);
            }
        },

        methods: {
            chooseAllColumns() {
                this.columns.forEach(el => {
                    el.checked = !this.selectedColumns;
                    return el;
                });
            },

            changeSortingBy(column) {
                if (this.sortingBy === column.key) {
                    const newOrder = !this.orderByAsc;
                    this.$store.commit('setOrderBy', newOrder);
                } else {
                    this.$store.commit('setSortingBy', column.key);
                }
                this.$store.commit('setProducts');
            },

            deleteItems() {
                this.$store.dispatch('deleteProductsList', this.checkedItems);
                this.checkedItems = [];
                this.checkedAll = false;
            },

            openDeleteConfirm(key) {
                this.currentItem = key;
            },

            cancelDelete() {
                this.currentItem = '';
            },

            deleteItem(item) {
                this.$store.dispatch('deleteProductsList', [item]);
                this.cancelDelete();
            },

            chooseAll() {
                if (!this.checkedAll) {
                    this.productsPerPage.forEach(el => {
                        if (!this.checkedItems.includes(el)) {
                            this.checkedItems.push(el);
                        }
                    });
                } else {
                    this.checkedItems = [];
                }
            },
            nextPage() {
                const page = this.currentPage + 1;
                if (page < this.products.length) {
                    this.$store.dispatch('setCurrentPage', page);
                }
            },

            prevPage() {
                const page = this.currentPage - 1;
                if (page >= 0) {
                    this.$store.dispatch('setCurrentPage', page);
                }
            },

            selectCountToggle() {
                this.showSelectCount = !this.showSelectCount;
            },

            selectFieldToggle() {
                this.showSelectField = !this.showSelectField;
            },

            closeSelectField() {
                this.showSelectField = false;
            },

            changeCount(count) {
                this.$store.dispatch('setCurrentCount', count);
                this.$store.dispatch('getProductsList');
                this.selectCountToggle();
            }
        },

        created() {
            this.$store.dispatch('getProductsList');
            this.columns.forEach(el => {
                this.$set(el, 'checked', true);
            })
        }
    }
</script>

<style lang="scss">
    @import "./styles/style.scss"
</style>