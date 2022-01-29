<template>
  <div class="bgc">
    <top-bar></top-bar>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router'
import TopBar from './components/layout/TopBar.vue';
import { setTheme } from './theme/theme'

export default defineComponent({
  name: 'App',
  components: {
    TopBar
  },
  setup(props) {
    const init = () => {
      setTheme("default")
    }
    onMounted(() => { init() })
  },
  
})

</script>

<style lang="less" scoped>
.bgc {
  height: 100vh;
  width: 100vw;
  color: rgba(@cardTextColorMain, 1);
  background-color: rgba(@primaryColor, 1);
}
</style>
