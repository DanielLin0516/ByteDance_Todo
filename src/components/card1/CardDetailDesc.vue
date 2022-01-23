<template>
  <div class="desc-container">
      <header class="desc-header">
          <icon-align-left :style="{fontSize:'1em', margin:'0 10px 0 0'}" />
          <span class="desc-title">描述</span>
      </header>
      <main>
          <a-textarea default-value="添加详细描述..." 
			:auto-size="{ minRows:2, maxRows:5 }" style="margin-top: 20px" />
      </main>
  </div>
</template>

<script>
import { IconAlignLeft} from '@arco-design/web-vue/es/icon';

export default {
    components: {
        IconAlignLeft
    }
}
</script>

<style scoped>
.desc-container {
    margin: 20px 10px;
}
.desc-header {
    font-size: 30px;
    font-weight: 700;
    display: flex;
    justify-content: flex-start;
}
.desc-title {
    text-align: left;
}
main {
    width: 90%;
    margin: 0 auto;
}
</style>