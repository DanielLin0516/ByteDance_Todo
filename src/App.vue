<template>
  <div class="bgc" :style="{background:store.state.background}">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import TopBar from "./components/layout/TopBar.vue";
import { defineComponent, onMounted ,computed, watch} from "vue";
import { setTheme } from "./theme/theme";
import { useStore } from "vuex";
import {useRouter,useRoute} from 'vue-router'
import router from "./router";
export default defineComponent({
  name: "App",
  components: {
    TopBar,
  },
  setup() {
    const store =useStore();
    const router = useRouter();
    const route = useRoute();
    const init = () => {
      setTheme("default");
    };
    onMounted(() => {
      init();
    });
    watch(route,() => {
      if(route.path === "/Layout/WorkPlace") {
        store.state.background = "#0079BF"
      }
    })
    return {
      store
    }
  },
});
</script>

<style lang="less">
body {
  font-size: 18px !important;
}
.bgc {
  height: 100vh;
  width: 100vw;
  color: rgba(@cardTextColorMain, 1);
  background-color: rgba(@primaryColor, 1);
}
</style>
