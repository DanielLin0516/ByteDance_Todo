<template>
  <div class="bgc">
    <layout></layout>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Layout from './components/layout/Layout.vue';

export default defineComponent({
  name: 'App',
  components: {
    Layout,
  },
  setup(props) {
    
  }
})

</script>

<style lang="scss" scoped>
.bgc {
  height: 100vh;
  width: 100vw;
  background-color: rgb(0,121,191);
}
</style>
