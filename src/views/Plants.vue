<template>
    <div class="Plants">
        <b-container>
            <b-row>
                <div class="col-12">
                    <div class="plants-top">
                        <b-button class="plants-btn"
                                  variant="primary"
                                  size="sm"
                                  @click="getPlants">
                            Get plants
                        </b-button>
                        Loaded: {{ !!plants ? plants.length : '' }}

                    </div>
                </div>
            </b-row>
            <b-row>
                <div class="col-12">
                    <div class="plants-row plants-title">
                        <div class="plants-cell"
                             v-for="field of plantsFields "
                        >
                            {{ field.title }}
                        </div>
                    </div>
                    <div class="plants-row"
                         v-if="!!plants && plants.length>0"
                         v-for="(plant, p) of plants" :key="p">
                        <div class="plants-cell"
                            v-if="!!plantsFields && plantsFields.length>0"
                            v-for="(field, f) of plantsFields" :key="f"
                        >
                            {{ p[f.name] }}
                        </div>
                    </div>
                    <!--                    {{ plants }}--32<script>
import axios from "axios";

const apikey = 'sk-bJ4564e5fca7428c11966';
const pathMain = 'https://perenual.com/api/';
const pathSpeciesList = 'species-list';

export default {
    name: "Plants",
    components: {},
    props: [],
    data() {
        return {
            plants: null,
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
            let r = pathMain + pathSpeciesList + '?key=' + apikey + '&page=1';
            // alert(r);
            axios.get(r).then(response => {
                this.plants = response.data.data;
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

  .plants-btn {
    position: absolute;
    left: 5px;
    bottom: 5px;
  }

  .plants-top {
    position: relative;
    width: 100%;
    height: 80px;
    border: 1px solid hsla(0, 0%, 50%, 0.8);
  }

  .plants-table {
    position: relative;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;

    .plants-row {
      position: relative;
      width: 100%;
      height: 40px;
      display: flex;
        //display: block;
      flex-flow: row nowrap;
      justify-content: center;
        border: 1px solid hsla(0, 0%, 50%, 0.8);

      &.plants-title {
        font-weight: bold;
      }

    }

    .plants-cell {
      position: relative;
      width: 100px;
      height: 40px;
      border: 1px solid hsla(0, 0%, 50%, 0.8);
    }
  }
}
</style>
