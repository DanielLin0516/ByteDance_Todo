<template>
  <div
    :class="{ darkTheme: isDark, bgc: true }"
    :style="{ background: background }"
  >
    <!-- <transition :name="route.meta.transition || 'fade'" mode="out-in"> -->
    <router-view v-slot="{ Component, route }"></router-view>
    <!-- </transition> -->
  </div>
</template>

<script lang="ts">
import TopBar from "@/layout/TopBar.vue";
import {
  defineComponent,
  onMounted,
  computed,
  watch,
  ComputedRef,
  ReactiveEffect,
  ref,
  provide,
  Transition,
} from "vue";
import { setTheme } from "@/theme/theme";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
export default defineComponent({
  name: "App",
  components: {
    TopBar,
    Transition,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    let isDark = ref(false);

    // 传给孙组件的空函数
    const sendIsDarkToApp = function (value: boolean) {
      isDark.value = value;
    };
    provide("sendIsDarkToApp", sendIsDarkToApp);

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
      isDark,
      route,
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
}
.defaultTheme {
  background-color: rgba(@primaryColor, 1);
}
.darkTheme {
  background-color: rgba(@primaryColor, 1) !important;
}
</style>
