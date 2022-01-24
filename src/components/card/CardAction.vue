<template>
  <div class="addFile-container">
      <header class="addFile-header">
          <div>
            <icon-link :style="{fontSize:'1em', margin:'0 10px 0 0'}"/>
            <span class="desc-title">活动</span>
          </div>
          <div class="header-button" >
            <a-button>隐藏详情</a-button>
          </div>
      </header>
      <main>
          <div class="main-input-wrapper">
              <a-avatar :style="{ backgroundColor: '#3370ff', float: 'left' }">
                <IconUser />
              </a-avatar>
              <a-input :style="{width:'320px', background: '#fff'}" placeholder="添加评论..." allow-clear />
          </div>
          <div class="main-action-item"></div>
      </main>
  </div>
</template>

<script lang="ts">
import { IconLink, IconUser} from '@arco-design/web-vue/es/icon';
export default {
    components: {
        IconLink,IconUser
    }
}
</script>

<style scoped>
.addFile-container {
    margin: 30px 10px;
}
.addFile-header {
    font-size: 30px;
    font-weight: 700;
    display: flex;
    justify-content: space-between;
}
.header-button {
    margin-right: 10px;
}
main {
    /* width: 90%; */
    margin: 15px auto;
}

</style>