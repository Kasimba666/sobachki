<template>
  <div class="HomeView">
    <div class="title" @click="setRandomImage">
      <div class="title-image-background" :style="{backgroundImage: `url(${titleImg})`}"></div>
      <b-btn class="btn-return" :style="{display: isOpenSubbreeds ?'block':'none'}"
             size="sm"
             variant="primary"
             onclick="event.stopPropagation()"
             @click="setBreedsAsDogs">
        <b>&#8592;</b> return to breeds
      </b-btn>
    </div>
    <div class="dogs-list">
      <div class="dogs-card"
           v-for="(d, i) of dogs" :key="i"
      >
        <div class="dogs-card-image-placeholder"
             @click="getPathImages(d.name)">
          <div class="dogs-card-image-background" :style="{backgroundImage: `url(${d.img})`}"></div>
        </div>
        <div class="dogs-card-text" :class="{extra: (d.sub?.length>0)}"
             @click="setSubbreedsByBreedAsDogs(d.name)">
          {{ d.name.slice(0, 1).toUpperCase() + d.name.slice(1) }}
        </div>
      </div>
    </div>

    <div class="dogs-modal" :style="{display: isOpenDogModal?'block':'none'}">
      <b-btn class="modal-btn-close" size="md"
             variant="danger"
             @click="isOpenDogModal=false">
        &times;
      </b-btn>
      <div class="dogs-modal-collection-images">
        <div class="dogs-modal-image"
             v-for="(img, i) of imgs" :key="i"
             :style="{backgroundImage: `url(${img})`}"
             @click="isOpenModalFullImage=true; full_img = img"
        >
        </div>
      </div>
    </div>

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
import $ from 'jquery';

const pathMain = `https://dog.ceo/api/`;
const pathAllBreeds = pathMain + `breeds/list/all`;
const pathRandomImage = pathMain + `breeds/image/random`;
const pathRandomImageByBreed = (breed) => pathMain + `breed/${breed}/images/random`;
const pathImagesByBreed = (breed) => pathMain + `breed/${breed}/images`;
const pathImagesByBreedSubbreed = (breed, subbreed) => pathMain + `breed/${breed}/${subbreed}/images`;

export default {
  name: 'HomeView',
  components: {},
  data() {
    return {
      breeds: [],
      subbreeds: [],
      dogs: [],
      dogsType: null,
      currentDog: null,
      currentBreed: null,
      imgs: [],
      full_img: null,
      raw_images: null,
      titleImg: null,
      noImage: null,
      isExists: false,
      isOpenDogModal: false,
      isOpenModalFullImage: false,
      isOpenSubbreeds: false,
    }
  },
  methods: {

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
          type: 'HEAD',
          error: function () {
            this.isExists = false;
            // console.log("Error: " + i + " " + urls[i]);
          },
          success: function () {
            this.isExists = true;
          }
        });
        i++;
      } while ((i < urls.length) && !this.isExists && (i < 6));

      return urls[i - 1];
      // return this.isExists ? urls[i - 1] : null;
    },

//возвращает массив объектов всех пород и подпород c одним изображением
    getAllBreeds() {
      let arr = [];
      let raw = null;
      axios.get(pathAllBreeds)
          .then(response => {
            raw = Object.entries(response.data.message);
            if (!!raw && raw.length > 0) {
              raw.forEach((item) => {
                if (true || ((item[0] === 'segugio') || (item[0] === 'setter'))) {
                  let imgValidURL = null;
                  let subs = [];
                  axios.get(pathRandomImageByBreed(item[0]))
                      .then(response => {
                        //вернуть первую действующую ссылку
                        imgValidURL = response.data.message;
                        // imgValidURL = this.getValidURL(response.data.message);
                        // console.log(item[0] + ': ' + imgValidURL);
                        // console.log(imgValidURL);
                        item[1].forEach(itemSub => {
                          let imgSubValidURL = null;
                          axios.get(pathImagesByBreedSubbreed(item[0], itemSub)).then(response => {
                            // imgSubValidURL = response.data.message;
                            imgSubValidURL = this.getValidURL(response.data.message);
                            subs.push({name: itemSub, img: imgSubValidURL});
                          }).catch(err => console.log(err));
                        });
                        arr.push({name: item[0], img: imgValidURL, sub: subs});
                      })
                      .catch(err => console.log(err));
                }
                ;
              });
            }
          })
          .catch(err => console.log(err));
      arr = arr.sort();
      return arr
    },

    setRandomImage() {
      axios.get(pathRandomImage).then(response => this.titleImg = response.data.message).catch(err => console.log(err));
    },


    init() {
      this.setRandomImage();
      this.breeds = this.getAllBreeds();
      this.setBreedsAsDogs();

    },

    getPathImagesByBreed(bname) {
      axios.get(pathImagesByBreed(bname)).then(response => {
        this.imgs = response.data.message;
      }).catch(err => console.log(err));
    },

    getPathImagesBySubbreed(bname, sname) {
      axios.get(pathImagesByBreedSubbreed(bname, sname)).then(response => {
        this.imgs = response.data.message;
      }).catch(err => console.log(err));
    },

    getPathImages(dname) {
      if (this.dogsType === 'breed') {
      this.getPathImagesByBreed(dname);
      } else {
        this.getPathImagesBySubbreed(this.currentBreed, dname);
        console.log(this.currentBreed, dname);
      }
      this.isOpenDogModal = true;

    },

    setBreedsAsDogs() {
      this.isOpenSubbreeds = false;
      this.dogs = this.breeds.sort();
      this.dogsType = 'breed';
    },

    setSubbreedsByBreedAsDogs(dname) {
      if (this.dogsType === 'breed' && this.breeds.filter(item => item.name === dname)[0].sub.length > 0) {
        this.isOpenSubbreeds = true;
        this.dogs = this.breeds.filter(item => item.name === dname)[0].sub;
        this.currentBreed = dname;
        this.dogsType = 'subbreed';
      }
    },

  },
  mounted() {
    this.init();
  }
  ,
}
</script>

<style lang="scss">
.HomeView {
  position: relative;

  .title {
    position: relative;
    flex: 0 0 auto;
    width: 100%;
    height: 300px;
    margin-bottom: 10px;
    border: 3px solid hsla(0, 0%, 50%, 0.2);
    cursor: pointer;
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

  .dogs-list {
    width: 100%;
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    gap: 5px;
    //border: 1px solid hsla(0, 0%, 0%, 0.2);

    .dogs-card {
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

      .dogs-card-image-placeholder {
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

        .dogs-card-image-background {
          flex: 0 0 auto;
          width: 140px;
          height: 140px;
          //width: auto;
          //height: 100%;
          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;
        }

        .dogs-card-no-image {
          position: absolute;
          width: 140px;
          height: 140px;
          display: flex;
          flex-flow: column wrap;
          justify-content: space-around;
          align-items: center;
        }
      }

      .dogs-card-text {
        width: 140px;
        height: 30px;
        border: 1px solid hsla(0, 0%, 50%, 0.2);
        display: flex;
        flex-flow: column wrap;
        justify-content: center;
        align-items: center;

        &.extra {
          font-weight: bold;
          cursor: pointer;

          &:hover {
            box-shadow: 0 0 10px 3px rgba(0, 140, 186, 0.5);
          }

        }
      }
    }
  }

  .btn-return {
    position: absolute;
    left: 5px;
    bottom: 5px;
    opacity: 80%;
    z-index: 10;
  }

  .modal-btn-close {
    position: absolute;
    right: 5px;
    top: 5px;
    opacity: 80%;
    z-index: 10;
  }

  .dogs-modal {
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

    .dogs-modal-collection-images {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      flex-flow: row wrap;
      justify-content: space-around;
      gap: 5px;
      border: 1px solid hsla(0, 0%, 50%, 0.8);
      overflow-y: auto;
      z-index: 5;

      .dogs-modal-image {
        position: relative;
        width: 100px;
        height: 100px;
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;

        &:hover {
          box-shadow: 0 0 10px 3px rgba(0, 140, 186, 0.5);
        }
      }

    }
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
