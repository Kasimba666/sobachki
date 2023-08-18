<template>
  <div class="HomeView">
    <b-container>
      <b-row>
        <div class="col-12">
          <div class="title" @click="getPathRandomImage">
            <div class="title-image-background" :style="{backgroundImage: `url(${titleImg})`}"></div>
          </div>

        </div>
      </b-row>
      <b-row>
        <div class="col-12">
          <div class="breeds-list">
            <div class="breeds-card" v-for="(b, i) of breeds" :key="i">
              <div class="breeds-card-image-placeholder">
                <!--                <b-img  height="140" width="140" rounded onerror = "this.setNoImage(i)" :src=b.img></b-img>-->
                <div class="breeds-card-image-background" :style="{backgroundImage: `url(${b.img})`}"></div>

                <!--                <div class="breeds-card-no-image">{{ flag == null ? 'no image' : '' }}</div>-->
              </div>
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
import $ from 'jquery';

const pathMain = `https://dog.ceo/api/`;
const pathAllBreeds = `breeds/list/all`;
const pathSingleRandomImage = `breeds/image/random`;
const pathImagesByBreed = (breed) => `breed/${breed}/images`;
const pathImagesByBreedSubbreed = (breed, subbreed) => `breed/${breed}/${subbreed}/images`;

export default {
  name: 'HomeView',
  components: {},
  data() {
    return {
      breeds: [],
      raw_images: null,
      titleImg: null,
      noImage: null,
      isExists: false,
    }
  },
  methods: {
    onLoad() {
      this.isExists = true;

    },
    onError() {
      this.isExists = false;

    },

    checkImage(imageSrc, good) {
      let img = new Image();
      img.onload = good;
      img.src = imageSrc;
    },
    getValidURL(urls) {
      // console.log(urls.length);
      // for (let i = 0; i < urls.length; i++) {
      // console.log(urls[i]);
      // }
      let i = 0;
      this.isExists = true;
      do {
        // this.isExists = false;
        // this.checkImage(urls[i],
        //     function () {
        //       this.isExists = true;
        //     },
        //     function () {
        //       this.isExists = false;
        //     }
        // );

        $.ajax({
          url: urls[i],
          type:'HEAD',
          error: function(){
            this.isExists = false;
            console.log("Error: " + i + " " + urls[i]);
          },
          success: function(){
            this.isExists = true;
          }
        });

        // console.log(this.isExists + ": " + urls[i]);
        i++;
      } while ((i < urls.length) && !this.isExists && (i < 6));

      // if (this.isExists) {
      console.log("всего " + urls.length + ", номер " + i  + " сейчас отправим: " + this.isExists + "::" + urls[i - 1]);

      return urls[i - 1];
      // return this.isExists ? urls[i - 1] : null;
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
                if (true || ((item[0] === 'segugio') || (item[0] === 'setter'))) {

                  let imgValidURL = null;
                  let subs = [];
                  axios.get(pathMain + pathImagesByBreed(item[0]))
                      .then(response => {
                        //вернуть первую действующую ссылку
                        imgValidURL = this.getValidURL(response.data.message);
                        console.log(item[0] + ': ' + imgValidURL);
                        // console.log(imgValidURL);
                        // item[1].forEach(itemSub => {
                        //   let imgSubValidURL = null;
                        //   axios.get(pathMain + pathImagesByBreedSubbreed(item[0], itemSub)).then(response => {
                        //     imgSubValidURL = this.getValidURL(response.data.message);
                        //     subs.push({name: itemSub, img: imgSubValidURL});
                        //   }).catch(err => console.log(err));
                        // });
                        arr.push({name: item[0], img: imgValidURL, sub: subs});
                      })
                      .catch(err => console.log(err));
                }
                ;
              });
            }
          })
          .catch(err => console.log(err));
      return arr
    }
    ,

    getPathRandomImage() {
      axios.get(pathMain + pathSingleRandomImage).then(response => this.titleImg = response.data.message).catch(err => console.log(err));
    }
    ,

    init() {
      // const getBreeds = async () => {
      //   try {
      //     const response = await axios.get(pathMain + pathAllBreeds);
      //     this.raw = Object.entries(response.data.message);
      //   } catch (err) {
      //     console.log(err)
      //   }
      // };
      this.getPathRandomImage();
      this.breeds = this.getAllBreeds();
    }
    ,
  },
  mounted() {
    this.init();
  }
  ,
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

      &:hover {
        box-shadow: 0 0 10px 3px rgba(0, 140, 186, 0.5);
      }

      .breeds-card-image-placeholder {
        position: relative;
        width: 140px;
        height: 140px;
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
        }

        .breeds-card-no-image {
          position: absolute;
          width: 140px;
          height: 140px;
          display: flex;
          flex-flow: column wrap;
          justify-content: space-around;
          align-items: center;
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
