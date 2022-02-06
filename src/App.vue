<template>
  <div class="bgc" :style="{ background: background }">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import TopBar from "./components/layout/TopBar.vue";
import { defineComponent, onMounted, computed, watch, ComputedRef } from "vue";
import { setTheme } from "./theme/theme";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import router from "./router";
export default defineComponent({
  name: "App",
  components: {
    TopBar,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const init = () => {
      setTheme("default");
    };
    onMounted(() => {
      init();
    });
    const background: ComputedRef<string> = computed(() => {
      return store.state.background;
    });
    watch(route, () => {
      if (route.path === "/Layout/WorkPlace") {
        store.commit("setColor", "#0079BF");
      }
    });
    return {
      store,
      background,
    };
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
