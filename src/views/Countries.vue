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
                            sortable="true"
                            align="center"
                            @changeSortOrder="showField"
                        >
                            <template #default="{row}">
                                <span :style="{fontWeight: row.population>20000000 ? 'bold' : 'normal'}">{{ row.name }} </span>
                            </template>
                        </TtColumn>
                        <TtColumn
                            label="Capital"
                            prop="capital"
                            sortable="true"
                            @changeSortOrder="showField"
                            >
                        </TtColumn>
                        <TtColumn
                            label="Subregion"
                            prop="subregion"
                            sortable="true"
                            @changeSortOrder="showField"
                        >
                        </TtColumn>
                        <TtColumn label="Population" prop="population"></TtColumn>
                        <TtColumn label="Area" prop="area"></TtColumn>

                    </AppTransTable>

                    <!--                    <b-table id="my-table"-->
                    <!--                            striped small hover-->
                    <!--                            selectable-->
                    <!--                            select-mode="single"-->
                    <!--                            :items="countries"-->
                    <!--                            :fields="fields"-->
                    <!--                            @row-selected="onRowSelected"-->

                    <!--                            :per-page="perPage"-->
                    <!--                            :current-page="currentPage"-->
                    <!--                    >-->
                    <!--                    </b-table>-->
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

const pathAll = 'https://restcountries.com/v2/all';


export default {
    name: "Countries",
    components: {AppTransTable, TtColumn},
    props: [],
    data() {
        return {
            country: null,
            countries: null,
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
        }
    },
    computed: {
        ...mapState(['screen', 'screenBreakpoints']),
        totalRows() {
            return !!this.countries ? this.countries.length : 0;
        }
    },
    methods: {
        init() {
            this.currentPage = 1;
            this.fetchCountries();
        },
        async fetchCountries() {
            let r = pathAll;
            await axios.get(r).then(response => {
                this.countries = response.data;

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
        showField(v) {
            console.log(v.field, ': ', v.order);
        },
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

    .my-pagination {
      position: relative;
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
