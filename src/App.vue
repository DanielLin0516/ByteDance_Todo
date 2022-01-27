<template>
  <div class="bgc">
    <layout></layout>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router'
import Layout from './components/layout/Layout.vue';
import { setTheme } from './theme/theme'

export default defineComponent({
  name: 'App',
  components: {
    Layout,
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
  background-color: rgba(@primaryColor, 1);
}
</style>
