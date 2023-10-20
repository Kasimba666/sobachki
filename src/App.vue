<template>
    <div id="app">
        <nav>
            <router-link to="/">Dogs</router-link>|
            <router-link to="/plants">Plants</router-link>|
            <router-link to="/countries">Countries</router-link>
        </nav>
        <router-view/>
    </div>
</template>

<script>
import {mapState} from "vuex";

export default {
    name: "App",
    data() {
        return {
            DEBUG: process.env.NODE_ENV === 'development',
        }
    },
    computed: {
        ...mapState(['screen','curColorScheme', 'screenBreakpoints']),
    },
    methods: {
        onResize() {
            let screen = {};
            this.$set(screen, "width", window.innerWidth);
            this.$set(screen, "height", window.innerHeight);
            let t = "";
            switch (true) {
                case screen.width <= this.screenBreakpoints.sm:
                    t = "xs";
                    break;
                case screen.width <= this.screenBreakpoints.md:
                    t = "sm";
                    break;
                case screen.width <= this.screenBreakpoints.lg:
                    t = "md";
                    break;
                case screen.width <= this.screenBreakpoints.xl:
                    t = "lg";
                    break;
                default:
                    t = "xl";
                    break;
            }
            this.$set(screen, "type", t);
            this.$store.commit("screen", screen);
        }
    },

    mounted() {
        this.onResize();
        window.addEventListener("resize", this.onResize);
    },
}
</script>

<style lang="scss">
@import "~@/assets/scss/vendors/bootstrap-vue/index";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  //text-align: center;
  color: #2c3e50;
}

nav {
  padding: 5px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #670c0c;
    }
  }
}
</style>
