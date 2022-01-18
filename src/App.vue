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
    console.log(123)
  }
})

</script>

<style lang="scss" scoped>
.bgc {
  height: 100vh;
  width: 100vw;
  background-color: rgb(235, 163, 8);
}
</style>
