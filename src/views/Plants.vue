<template>
  <div class="Plants">
    <b-container>
      <b-row>
        <div class="col-12 mb-1">
          <div class="plants-top">
            <div class="loading">
              <b-button class="plants-btn"
                        variant="primary"
                        size="sm"
                        @click="getPlants">
                Get plants
              </b-button>
              Loaded: {{ !!plants ? plants.length : 'none' }}
            </div>
          </div>
        </div>
      </b-row>
      <b-row>
        <div class="col-12 col-sm-9 col-md-9 col-lg-9 col-xl-9">
          <div class="plants-table">
            <div class="plants-row plants-title">
              <div class="plants-cell title" :class="{right: (i == plantsFields.length-1)}"
                   v-for="(field, i) of plantsFields" :key="i">
                {{ field.title }}
              </div>
            </div>
            <div class="plants-row" :class="{last: (p == plants.length-1)}" :style="{backgroundColor: (p%2 === 1) ? 'hsl(0, 0%, 83%, 0.2)' : 'none'}"
                 v-if="!!plants && plants.length>0"
                 v-for="(plant, p) of plants" :key="p"
                 @click="getPlantByID(plant['id'])">
              <div class="plants-cell" :class="{right: (f == plantsFields.length-1)}"
                   v-if="!!plantsFields && plantsFields.length>0"
                   v-for="(field, f) of plantsFields" :key="f"
              >
                {{ plant[field.name] }}
              </div>
            </div>
            <!--            {{ plants }}-->
          </div>
        </div>
        <div class="col-12 col-sm-3 col-md-3 col-lg-3 col-xl-3">
          <div class="plant-detail">
              <div class="plants-detail-image-placeholder">
                  <div class="plants-detail-image-background" :style="{backgroundImage: `url(https://perenual.com/storage/species_image/16_acer_griseum/thumbnail/5158906371_ed08a86876_b.jpg)`}"></div>
<!--                  <div class="plants-detail-image-background" :style="{backgroundImage: `url(${currentPlantDetail['thumbnail']})`}"></div>-->
              </div>
              <div class="plants-detail-properties">
                  {{ (!!currentPlantDetail) ? currentPlantDetail["common_name"] : '' }}

              </div>

          </div>
        </div>

      </b-row>
    </b-container>
  </div>
</template>

<script>

import axios from "axios";

const apikey = 'sk-bJ4564e5fca7428c11966';
const pathMain = 'https://perenual.com/api/';
const pathSpeciesList = 'species-list';
const pathSpeciesDetails = 'species/details/';

export default {
  name: "Plants",
  components: {},
  props: [],
  data() {
    return {
      plants: null,
      currentPlantDetail: null,
      plantsFields: [],
    }
  },
  computed: {},
  methods: {
    init() {
      this.plantsFields = [
        {name: 'common_name', title: 'Common name'},
        {name: 'scientific_name', title: 'Scientific name'},
        {name: 'cycle', title: 'Cycle'},
        {name: 'watering', title: 'Watering'},
        {name: 'sunlight', title: 'Sunlight'},
      ];

    },
    getPlants() {
      let pageNumber = 1;
      let r = pathMain + pathSpeciesList + '?key=' + apikey + '&page=' + pageNumber;
      axios.get(r).then(response => {
        this.plants = response.data.data;
      }).catch(err => console.log(err));
    },
    getPlantByID(id) {
      let r = pathMain + pathSpeciesDetails + id + '?key=' + apikey;
      axios.get(r).then(response => {
        this.currentPlantDetail = response.data;
      }).catch(err => console.log(err));
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

    .loading {
      position: absolute;
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
  }

  .plants-table {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
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

      &.last {
        border-bottom: none;
      }

      .plants-cell {
        position: relative;
        width: 100px;
        height: auto;
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
    justify-content: center;
    //background-color: hsla(255, 0%, 50%, 0.6);

    .plants-detail-properties {
      width: 100%;
      height: auto;
      border: 1px solid hsla(255, 0%, 50%, 0.8);
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;


    }

    .plants-detail-image-placeholder {
      position: relative;
      width: 140px;
      height: 140px;
      display: flex;
      flex-flow: column wrap;
      justify-content: space-around;
      align-items: center;
      cursor: pointer;

      &:hover {
        box-shadow: 0 0 10px 3px rgba(0, 140, 186, 0.5);
      }

      .plants-detail-image-background {
        flex: 0 0 auto;
        width: 140px;
        height: 140px;
        //width: auto;
        //height: 100%;
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
      }
    }
  }
}
</style>
