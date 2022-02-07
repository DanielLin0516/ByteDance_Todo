<template>
  <div :class="{ darkTheme:isDark, bgc:true }" :style="{background: background}">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import TopBar from "@/layout/TopBar.vue";
import { defineComponent, onMounted, computed, watch, ComputedRef,ReactiveEffect, ref, provide } from "vue";
import { setTheme } from "@/theme/theme";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
export default defineComponent({
  name: "App",
  components: {
    TopBar,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    let isDark = ref(false)
    console.log(isDark.value);
    
    // 传给孙组件的空函数
    const sendIsDarkToApp = function(value:boolean) {
      isDark.value = value
    }
    provide('sendIsDarkToApp', sendIsDarkToApp)
    
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
      isDark
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
