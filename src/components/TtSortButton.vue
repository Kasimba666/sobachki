<template>
    <div class="TtSortButton" @click="onSortButton">
        <i class="icon" :class="icon">{{ sortSymbol }}</i>
    </div>
  <!--  <div class="TtSortButton" @click="$emit('click', field)">-->
  <!--    <i :class="icon"></i>-->
  <!--  </div>-->
</template>

<script>
const arrowTwo = '↨';
const arrowUp = '▲';
const arrowDown = '▼';

const listSort = [
    {value:'ASC', symbol: arrowUp},
    {value:'DESC', symbol: arrowDown},
    {value:'NONE', symbol: arrowTwo},
    ]

export default {
    name: "TtSortButton",
    components: {},
    props: ['field', 'curState'],
    data() {
        return {
            sortSymbol: '',
            myCurState: {field: null, order: null},
        };
    },

    computed: {
        icon() {
            return (this.curState.field === this.field)
                ? ((this.curState.order === 'ASC') ? '-arrow-sort-down' : '-arrow-sort-up')
                : '-arrow-two'
        },


        // icon(){
        //   return (this.curState.field===this.field)
        //     ? ((this.curState.order==='ASC') ? 'movingCardScreen-arrow-sort-down' : 'movingCardScreen-arrow-sort-up')
        //     : 'movingCardScreen-arrow-two'
        // },
    },
    methods: {
        init() {
            this.myCurState.field = this.field;
            this.myCurState.order = listSort[0].value;
            this.sortSymbol = listSort[0].symbol;

        },
        onSortButton() {
            let order;
            for (let i=0; i < listSort.length; i++) {
                if (this.myCurState.order === listSort[i].value)
                {
                    order = listSort[(i+1)%3].value;
                    this.sortSymbol =listSort[(i+1)%3].symbol;
                }
            }
            this.myCurState.order = order;
            this.$emit('changeSortOrder', this.myCurState)

        }
    },
    mounted() {
        this.init();
    },
};
</script>

<style lang="scss">
/****  TtSortButton  ****/
.TtSortButton {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid gray;
  cursor: pointer;

  .icon {

    &-arrow-two {
      font-size: 23px;
    }

    &-arrow-sort-down, &-arrow-sort-up {
      color: var(--primary-100-55);
      font-size: 25px;
    }

  }

  &:hover {
    box-shadow: inset 0 0 500px 0 hsla(0, 0%, 50%, 0.1);
    color: gray;
    text-shadow: 0 0 0 gray, 0 0 10px gray;

    i {
      text-shadow: 0 0 1px var(--link-hover-cl);
    }
  }

  //.icon {
  //  &-arrow-two {
  //    font-size: 13px;
  //  }
  //  &-arrow-sort-down, &-arrow-sort-up {
  //    color: var(--primary-100-55);
  //    font-size: 25px;
  //  }
  //}
}
</style>
