<template>
  <div class="addFile-container">
      <header class="addFile-header">
          <icon-link :style="{fontSize:'1em', margin:'0 10px 0 0'}"/>
          <span class="desc-title">附件</span>
      </header>
      <main>
          
      </main>
  </div>
</template>

<script>
import { IconLink} from '@arco-design/web-vue/es/icon';

export default {
    components: {
        IconLink
    }
}
</script>

<style scoped>
.addFile-container {
    margin: 20px 10px;
}
.addFile-header {
    font-size: 30px;
    font-weight: 700;
    display: flex;
    justify-content: flex-start;
}
main {
    width: 90%;
    height: 100px;
    margin: 15px auto;
    background: #EAECEF;
}
</style>