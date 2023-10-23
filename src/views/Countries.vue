<template>
    <div class="Countries">
        <b-container>
            <b-row>
                <div class="col-12 mb-1">
                    <!--                    <div class="top">-->
                    <!--                        <div class="my-pagination" v-if="!!totalRows">-->
                    <!--                            <b-pagination-->
                    <!--                                    v-model="currentPage"-->
                    <!--                                    :total-rows="totalRows"-->
                    <!--                                    :per-page="perPage"-->
                    <!--                                    aria-controls="my-table"-->
                    <!--                            >-->
                    <!--                            </b-pagination>-->

                    <!--                        </div>-->
                    <!--                    </div>-->
                </div>
            </b-row>
            <b-row>
                <div class="col-12 col-sm-9 col-md-9 col-lg-9 col-xl-9">
                    <AppTransTable :data="countries"
                                   :cardMode="{
                                        breakpoint: 'sm',
                                        titleWidth: '35%', // ширина столбца заголовков
                                      }"
                                   :gridMode="{
                                        xxl: '3fr 2fr 2fr 100px 100px',
                                        xl: '3fr 2fr 2fr 100px 100px',
                                        lg:'3fr 2fr 2fr 100px 100px',
                                        md:'3fr 2fr 2fr 100px 100px',
                                        }"

                                   @rowClick="onRowClick"
                    >
                        <TtColumn
                                label="Name"
                                prop="name"
                                v-bind:sortable.sync="SortMode"
                                align="center"
                                showField
                        >
                            <template #default="{row}">
                                <span :style="{fontWeight: row.population>20000000 ? 'bold' : 'normal'}">{{
                                    row.name
                                    }} </span>
                            </template>
                        </TtColumn>
                        <TtColumn
                                label="Capital"
                                prop="capital"
                                v-bind:sortable.sync="SortMode"
                        >
                        </TtColumn>
                        <TtColumn
                                label="Subregion"
                                prop="subregion"
                                v-bind:sortable.sync="SortMode"
                        >
                        </TtColumn>
                        <TtColumn label="Population" prop="population"></TtColumn>
                        <TtColumn label="Area" prop="area"></TtColumn>

                    </AppTransTable>

                    <b-table id="my-table"
                             striped small hover
                             selectable
                             select-mode="single"
                             :items="countries"
                             :fields="fields"
                             @row-selected="onRowSelected"

                             :per-page="perPage"
                             :current-page="currentPage"
                    >
                    </b-table>
                </div>
                <div class="col-12 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                    <b-card v-if="!!country"
                            :title="country['name']"
                            :img-src="country['flags']['png']"
                    >
                        {{ country }}
                        <!--                        <b-list-group flush>-->
                        <!--                            <b-list-group-item><b>Type: </b>{{ currentPlantDetail['type'] }}</b-list-group-item>-->
                        <!--                            <b-list-group-item><b>Origin: </b>{{ arrToString(currentPlantDetail['origin']) }}</b-list-group-item>-->
                        <!--                            <b-list-group-item>{{ currentPlantDetail['description'] }}</b-list-group-item>-->
                        <!--                            &lt;!&ndash;              {{ currentPlantDetail }}&ndash;&gt;-->
                        <!--                        </b-list-group>-->

                    </b-card>
                </div>
            </b-row>
        </b-container>


    </div>
</template>

<script>

import axios from "axios";
import AppTransTable from '@/components/AppTransTable';
import TtColumn from '@/components/TtColumn';
import {mapState} from "vuex";
// import TableMixin from "@/mixins/TableMixin.vue";

const pathAll = 'https://restcountries.com/v2/all';
const defaultSortOrder = {
    field: 'name',
    order: 'DESC'
};

export default {
    name: "Countries",
    components: {AppTransTable, TtColumn},
    props: [],
    // mixins: TableMixin,
    data() {
        return {
            sortMode: {...defaultSortOrder},

            country: null,
            srcCountries: [],
            rawData: null,
            fields: [
                {key: 'name', label: 'Name', sortable: true},
                {key: 'capital', label: 'Capital', sortable: true},
                {key: 'subregion', label: 'Subregion', sortable: true},
                {key: 'population', label: 'Population', sortable: true},
                {key: 'area', label: 'Area', sortable: true},
            ],
            currentPage: 1,
            lastPage: 1,
            perPage: 30,
            currentCountry: null,
            // curSort: null
        }
    },
    computed: {
        ...mapState(['screen', 'screenBreakpoints']),
        totalRows() {
            return !!this.srcCountries ? this.srcCountries.length : 0;
        },

        countries() {
            return [...this.srcCountries].sort((a, b) => {
                if (a[this.SortMode.field] > b[this.SortMode.field]) {
                    return (this.SortMode.order === 'DESC') ? 1 : -1
                }
                if (a[this.SortMode.field] < b[this.SortMode.field]) {
                    return (this.SortMode.order === 'DESC') ? -1 : 1
                }
                return 0;
            });
            // return [...this.srcCountries].sort((a, b) => {
            //     if (a[this.curSort.field] > b[this.curSort.field]) {
            //         return 1
            //     }
            //     if (a[this.curSort.field] < b[this.curSort.field]) {
            //         return -1
            //     }
            //     return 0;
            // });
        },
        SortMode:{
            get() {
                console.log('>> ', this.sortMode.field, ' ', this.sortMode.order);
                return this.sortMode;
            },
            set(v){
                if(v === defaultSortOrder.field && v === this.sortMode.field) {//если поле не поменялось и равно дефолтному
                    this.sortMode.order = (this.sortMode.order === 'ASC') ? 'DESC' : 'ASC';
                } else if(v === this.sortMode.field && this.sortMode.order === 'ASC') {//если поле не поменялось, и порядок был ASC
                    this.sortMode = {...defaultSortOrder};//порядок ставим по дефолту, т.е. DESC
                } else {
                    if(v === this.sortMode.field) {//поле не поменялось, но порядок не ASC
                        this.sortMode.order = 'ASC';
                    } else {//поле поменялось
                        this.sortMode = {
                            field: v,
                            order: 'DESC'
                        };
                    }
                }
            }
        },

    },
    methods: {
        init() {
            // this.currentPage = 1;
            this.fetchCountries();
            // this.curSort = {field: 'name', order: 'ASC'}
            // console.log(this.SortMode);
        },
        async fetchCountries() {
            await axios.get(pathAll).then(response => {
                this.srcCountries = response.data;

            }).catch(err => console.log(err));
        },


        arrToString(arr) {
            let r = '';
            if (Array.isArray(arr)) {
                arr.forEach((item, i) => {
                    r += item.slice(0, 1).toUpperCase() + item.slice(1) + ', '
                });
                r = r.slice(0, -2);
            } else {
                r = arr;
            }
            return r;
        },
        onRowSelected(items) {
            if (!!items[0]) {
                this.country = (items[0])
            }
        },
        onRowClick(v) {
            if (!!v.row) {
                this.country = (v.row)
            }
        },
        // showField(v) {
        //     console.log(v.field, ': ', v.order);
        //     console.log(this.countries[0][v.field], ', ', this.countries[1][v.field], ' ... ', this.countries[this.countries.length - 1][v.field]);
        //     this.curSort = v;
        // },
    },
    mounted() {
        this.init();
    },
}
</script>

<style lang="scss">
/****  Plants  ****/
.Countries {
  position: relative;
  width: 100%;
  height: auto;


  .top {
    position: relative;
    width: 100%;
    height: auto;
    //border: 1px solid hsla(0, 0%, 50%, 0.8);
    padding: 5px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-around;
    align-items: center;
    gap: 5px;

    .my-pagination {position: relative;
      width: auto;
      align-self: center;
    }

  }

  .plants-detail-image-placeholder {
    position: relative;
    width: 100%;
    height: 140px;
    display: flex;
    flex-flow: column wrap;
    align-items: center;
    cursor: pointer;

    &:hover {
      box-shadow: 0 0 10px 3px rgba(0, 140, 186, 0.5);
    }

    .plants-detail-image-background {
      flex: 0 0 auto;
      width: 100%;
      height: 140px;
      //width: auto;
      //height: 100%;
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
    }
  }
}

.modal-btn-close {
  position: absolute;
  right: 5px;
  top: 5px;
  opacity: 80%;
  z-index: 10;
}

.plants-modal-full-image {
  position: fixed;
  left: 5%;
  top: 0px;
  width: 90%;
  height: 90%;
  height-max: 100%;
  margin: 1%;
  background-color: white;
  border: 1px solid hsla(0, 0%, 50%, 0.8);
  z-index: 20;

  .full-image {
    position: relative;
    width: 100%;
    height: 100%;
    background-size: auto auto;
    background-position: center;
    background-repeat: no-repeat;
    border: 1px solid hsla(0, 0%, 50%, 0.8);
  }
}
</style>
3/356
