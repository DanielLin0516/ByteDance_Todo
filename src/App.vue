<template>
  <div class="bgc">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import TopBar from "./components/layout/TopBar.vue";
import { defineComponent, onMounted } from "vue";
import { setTheme } from "./theme/theme";

export default defineComponent({
  name: "App",
  components: {
    TopBar,
  },
  setup() {
    const init = () => {
      setTheme("default");
    };
    onMounted(() => {
      init();
    });
  },
});
</script>

<style lang="less">
body {
  font-size: 24px !important;
}
.bgc {
  height: 100vh;
  width: 100vw;
  color: rgba(@cardTextColorMain, 1);
  background-color: rgba(@primaryColor, 1);
}
</style>
