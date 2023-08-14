<template>
  <div class="HomeView">
    <b-container>
      <b-row>
        <div class="col-12">
          <div class="title" @click="getPathRandomImage">
            <!--                        <b-img class="title-image" rounded  :src=titleImg></b-img>-->
            <div class="title-image-background" :style="{backgroundImage: `url(${titleImg})`}"></div>
          </div>

        </div>
      </b-row>
      <b-row>
        <div class="col-12">
          <div class="breeds-list">
            <div class="breeds-card" v-for="(b, i) of breeds" :key="i">
              <div class="breeds-card-image-background" :style="{backgroundImage: `url(${b.img})`}"></div>

              <div class="breeds-card-text">
                {{ b.name.slice(0, 1).toUpperCase() + b.name.slice(1) }}
              </div>
            </div>
          </div>
        </div>
      </b-row>
    </b-container>
  </div>
</template>

<script>

import axios from "axios";

const pathMain = `https://dog.ceo/api/`;
const pathAllBreeds = `breeds/list/all`;
const pathSingleRandomImage = `breeds/image/random`;
const pathImagesByBreed = (breed) => `breed/${breed}/images`;
const pathSubBreed = (breed) => `breed/${breed}/list`;
const pathSingleRandomImageByBreed = (breed) => `breed/${breed}/images/random`;
export default {
  name: 'HomeView',
  components: {},
  data() {
    return {
      breeds: [],
      raw_images: null,
      imgSobachki: null,
      titleImg: null,
    }
  },
  methods: {
    //возвращает массив пород и подпород

    getPathRandomImage() {
      axios.get(pathMain + pathSingleRandomImage).then(response => this.titleImg = response.data.message).catch(err => console.log(err));
    },
    //возвращает массив путей к снимкам для указанной породы
    getPathsImages(name) {
      let result = null;
      axios.get(pathMain + pathImagesByBreed(name))
          .then(response => {
            result = response.data.message
          })
          .catch(err => console.log('не найдено: ', name, err));
      return result;

    },
    //возвращает массив объектов всех пород и подпород c одним изображением
    getAllBreeds() {
      let arr = [];
      let raw = null;
      axios.get(pathMain + pathAllBreeds)
          .then(response => {
            raw = Object.entries(response.data.message);
            if (!!raw && raw.length > 0) {
              raw.forEach((item) => {
                let img = null;
                let arrSubs = [];
                axios.get(pathMain + pathImagesByBreed(item[0]))
                    .then(response => {
                      img = response.data.message[0];
                      item[1].forEach(itemSub => {
                        let imgSub = null;
                        axios.get(pathMain + pathImagesByBreed(itemSub)).then(response => {
                          imgSub = response.data.message[0];
                          arrSubs.push({name: itemSub, img: imgSub});
                        }).catch(err => console.log('подпорода: ', itemSub, err));
                      });
                      arr.push({name: item[0], img: img, sub: arrSubs});
                    })
                    .catch(err => console.log('порода: ', item[0], err));
              });
            }
          })
          .catch(err => console.log(err));
      return arr

    },
    init() {
      // const getBreeds = async () => {
      //   try {
      //     const response = await axios.get(pathMain + pathAllBreeds);
      //     this.raw_sobachki = Object.entries(response.data.message);
      //   } catch (err) {
      //     console.log(err)
      //   }
      // };
      this.getPathRandomImage();
      this.breeds = this.getAllBreeds();
    },

  },
  mounted() {
    this.init();
  },
}
</script>

<style lang="scss">
.HomeView {
  .title {
    flex: 0 0 auto;
    width: 100%;
    height: 300px;
    margin-bottom: 10px;
    border: 3px solid hsla(0, 0%, 50%, 0.2);
  }

  .title-image {
    height: 100%;
  }

  .title-image-background {
    flex: 0 0 auto;
    width: auto;
    height: 100%;
    background-size: contain;
    background-position: center;
    background-repeat: repeat-x;

    &:hover {
      box-shadow: 0 0 10px 3px rgba(0, 140, 186, 0.5);
    }
  }

  .breeds-list {
    width: 100%;
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    gap: 5px;


    .breeds-card {
      width: 150px;
      height: 180px;
      //min-width: 100px;
      //min-height: 150px;
      background-color: hsl(188, 34%, 49%, 0.2);
      border: 1px solid hsla(0, 0%, 0%, 0.2);
      //border-radius: 5px;
      display: flex;
      flex-flow: column wrap;
      justify-content: space-around;
      align-items: center;


      .breeds-card-image-background {
        flex: 0 0 auto;
        width: 140px;
        height: 140px;
        //width: auto;
        //height: 100%;
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;

        &:hover {
          box-shadow: 0 0 10px 3px rgba(0, 140, 186, 0.5);
        }
      }

      .breeds-card-text {
        width: 140px;
        height: 30px;
        border: 1px solid hsla(0, 0%, 50%, 0.2);
        display: flex;
        flex-flow: column wrap;
        justify-content: center;
        align-items: center;
      }
    }
  }

}

</style>
