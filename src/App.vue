<template>
  <top-bar></top-bar>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import TopBar from './components/layout/TopBar.vue';
export default defineComponent({
  name:'App',
  components: {
    TopBar
  },
setup(props) {
    console.log(props)
  }
})

</script>

<style lang="scss" scoped>
.menu-demo {
  box-sizing: border-box;
  width: 100%;
  padding: 40px;
  background-color: var(--color-neutral-2);
}
</style>
