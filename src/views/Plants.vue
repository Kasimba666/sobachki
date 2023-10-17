<template>
    <div class="Plants">
        <b-container>
            <b-row>
                <div class="col-12 mb-1">
                    <div class="plants-top">
                        <div class="my-pagination">
                            <b-pagination
                                    v-model="currentPage"
                                    :total-rows="totalRows"
                                    :per-page="perPage"
                                    @change="fetchPlants(currentPage)"
                            >

                            </b-pagination>

                        </div>
                        <div class="loading">
                            <div class="page-nav">
                                <div class="page-nav-btn" @click="currentPage = 1">
                                    <<
                                </div>
                                <input class="page-nav-input" type="number" min="1" max=maxPlantsPage
                                       v-model=currentPage>
                                <div class="page-nav-btn" @click="currentPage = lastPage">
                                    <!--                                <div class="page-nav-btn" @click="currentPlantsPage = maxPlantsPage">-->
                                    >>
                                </div>
                            </div>
                            <b-button class="plants-btn"
                                      variant="outline-secondary"
                                      size="sm"
                                      @click="fetchPlants(currentPage)">
                                Get plants
                            </b-button>
                            Loaded: {{ !!plants ? plants.length : 'none' }}
                            Pages: {{ lastPage }}
                        </div>
                    </div>
                </div>
            </b-row>
            <b-row>
                <div class="col-12 col-sm-9 col-md-9 col-lg-9 col-xl-9">
                    <b-table striped
                             :items="plants"
                             :fields="fields"
                             small
                    >

                    </b-table>
                </div>
                <div class="col-12 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                </div>
            </b-row>
            <b-row>
                <div class="col-12 col-sm-9 col-md-9 col-lg-9 col-xl-9">
                    <div class="plants-table">
                        <div class="plants-row plants-title">
                            <div class="plants-cell title" :class="{right: (i === plantsFields.length-1)}"
                                 v-for="(field, i) of plantsFields" :key="i">
                                {{ field.title }}
                            </div>
                        </div>
                        <div class="plants-row"
                             :class="{last: (p == plants.length-1)}"
                             v-if="!!plants && plants.length  >0"
                             v-for="(plant, p) of plants" :key="p"
                             :style="{backgroundColor: (p%2 === 1) ? 'hsl(0, 0%, 83%, 0.3)' : 'none'}"
                             @click="getPlantByID(plant['id'])">
                            <div :class="{current: (!!currentPlantDetail && (plant['id'] === currentPlantDetail['id']))}">

                            </div>
                            <div class="plants-cell" :class="{right: (f == plantsFields.length-1)}"
                                 v-if="!!plantsFields && plantsFields.length>0"
                                 v-for="(field, f) of plantsFields" :key="f"
                            >
                                {{ arrToString(plant[field.name]) }}
                            </div>

                        </div>
                        <!--            {{ plants }}-->
                    </div>
                </div>
                <div class="col-12 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                    <div class="plant-detail">
                        <div class="plants-detail-image-placeholder">
                            <!--                  <div class="plants-detail-image-background" :style="{backgroundImage: `url(https://perenual.com/storage/species_image/16_acer_griseum/thumbnail/5158906371_ed08a86876_b.jpg)`}"></div>-->
                            <div class="plants-detail-image-background"
                                 :style="{backgroundImage: `url(${getPathThumbnail(currentPlantDetail)})`}"
                                 @click="isOpenModalFullImage=true; full_img=getPathFullImage(currentPlantDetail);"
                            >

                            </div>
                        </div>
                        <div class="plants-detail-properties">
                            {{ (!!currentPlantDetail) ? currentPlantDetail["description"] : '' }}
                        </div>

                    </div>
                </div>

            </b-row>
        </b-container>

        <div class="plants-modal-full-image" :style="{display: isOpenModalFullImage?'block':'none'}">
            <b-btn class="modal-btn-close" size="md"
                   variant="danger"
                   @click="isOpenModalFullImage=false">
                &times;
            </b-btn>
            <div class="full-image"
                 :style="{backgroundImage: `url(${full_img})`}">
            </div>
        </div>

    </div>
</template>

<script>

import axios from "axios";

const apikey = 'sk-bzOk64e895db0fe501966';
const pathMain = 'https://perenual.com/api/';
const pathSpeciesList = 'species-list';
const pathSpeciesDetails = 'species/details/';

const defaultImage = 'default_image';
const thumbnail = 'thumbnail';

export default {
    name: "Plants",
    components: {},
    props: [],
    data() {
        return {
            plants: null,
            fields: [
                {key: 'common_name', label: 'Common name', sortable: true},
                {key: 'scientific_name', label: 'Scientific name', sortable: true},
                {key: 'cycle', label: 'Cycle', sortable: true},
                {key: 'watering', label: 'Watering', sortable: true},
                {key: 'sunlight', label: 'Sunlight', sortable: true},
            ],
            currentPage: 1,
            lastPage: 1,
            perPage: 0,
            totalRows: 0,

            currentPlantDetail: null,

            plantsFields: [
                {name: 'common_name', title: 'Common name'},
                {name: 'scientific_name', title: 'Scientific name'},
                {name: 'cycle', title: 'Cycle'},
                {name: 'watering', title: 'Watering'},
                {name: 'sunlight', title: 'Sunlight'},
            ],
            full_img: null,
            isOpenModalFullImage: false,
        }
    },
    computed: {},
    methods: {
        init() {
            this.currentPage = 1;
            this.fetchPlants(this.currentPage);
        },
        async fetchPlants(page) {
            let r = pathMain + pathSpeciesList + '?key=' + apikey + '&page=' + page;
            await axios.get(r).then(response => {
                this.plants = response.data.data;
                this.lastPage = response.data.last_page;
                this.perPage = response.data.per_page;
                this.totalRows = response.data.total;
            }).catch(err => console.log(err));
        },

        getPlantByID(id) {
            let r = pathMain + pathSpeciesDetails + id + '?key=' + apikey;
            axios.get(r).then(response => {
                this.currentPlantDetail = response.data;
            }).catch(err => console.log(err));

        },

        getPathThumbnail(plant) {
            let def_img = (!!plant) ? plant["default_image"] : '';
            if ((def_img != '') && (def_img != null)) {
                return (!!def_img["thumbnail"]) ? def_img["thumbnail"] : '';
            }
        },

        getPathFullImage(plant) {
            let def_img = (!!plant) ? plant["default_image"] : '';
            if ((def_img != '') && (def_img != null)) {
                return (!!def_img["original_url"]) ? def_img["original_url"] : '';
            }

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
    },
    mounted() {
        this.init();
    },
}
</script>

<style lang="scss">
/****  Plants  ****/
.Plants {
  position: relative;
  width: 100%;
  height: auto;


  .plants-top {
    position: relative;
    width: 100%;
    height: 80px;
    border: 1px solid hsla(0, 0%, 50%, 0.8);
    padding: 5px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    gap: 5px;

    .my-pagination {
      position: relative;
      display: flex;
      flex-flow: row;
    }

    .loading {
      position: relative;
      left: 5px;
      bottom: 5px;
      width: auto;
      height: 40px;
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;
      gap: 5px;

      .plants-btn {
        position: relative;
      }
    }

    .page-nav {
      position: relative;
      width: auto;
      height: 40px;
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;
      gap: 5px;

      .page-nav-btn {
        width: 25px;
        height: 30px;
        border-radius: 3px;
        border: 1px solid hsla(0, 0%, 50%, 0.8);
        cursor: pointer;

        &:hover {
          box-shadow: 0 0 10px 3px rgba(0, 140, 186, 0.5);
        }
      }

      .page-nav-input {
        width: 60px;
        //height: 30px;
        border: 1px solid hsla(0, 0%, 50%, 0.8);
        align-text: center;
      }

    }
  }

  .plants-table {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: start;
    border: 1px solid hsla(0, 0%, 50%, 0.8);

    .plants-row {
      position: relative;
      width: 100%;
      height: auto;
      display: flex;
      flex-flow: row nowrap;
      justify-content: center;
      border-bottom: 1px solid hsla(0, 0%, 50%, 0.6);
      //border-bottom: none;
      cursor: pointer;

      &:hover {
        box-shadow: 0 0 10px 3px rgba(0, 140, 186, 0.5);
      }

      &.plants-title {
        font-weight: bold;
        background-color: hsl(0, 0%, 83%, 0.3);
      }

      &.chosen {
        background-color: rgba(0, 140, 186, 0.5);
      }

      &.last {

        border-bottom: none;
      }

      .current {
        position: absolute;
        width: 100%;
        height: 100%;
        border: 2px solid rgba(0, 140, 186, 0.5);
      }

      .plants-cell {
        position: relative;
        width: 100px;
        height: auto;
        padding: 2px;
        flex: 1 1 auto;
        min-width: 50px;
        border-right: 1px solid hsla(0, 0%, 50%, 0.8);
        text-align: left;

        &.title {
          align: center;
          text-align: center;
        }

        &.right {
          border-right: none;
        }
      }
    }
  }

  .plant-detail {
    position: relative;
    width: auto;
    min-width: 140px;
    height: 100%;
    border: 1px solid hsla(255, 0%, 50%, 0.8);
    display: flex;
    flex-flow: column nowrap;
    justify-content: start;

    .plants-detail-properties {
      width: 100%;
      height: auto;
      padding: 2px;
      display: flex;
      flex-flow: column nowrap;
      justify-content: start;
      text-align: left;

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
}
</style>
