<template>
  <div class="sidebar">
      <span class="sidebar-tip">添加至卡片</span>
      <a class="button-link" href="#" title="成员">
          <icon-user />
          <span class="sidebar-text">成员</span>
      </a>
      <a class="button-link" href="#" title="标签">
          <icon-tag />
          <span class="sidebar-text">标签</span>
      </a>
      <a class="button-link" href="#" title="日期">
          <icon-schedule />
          <span class="sidebar-text">日期</span>
      </a>
  </div>
</template>

<script lang="ts">
import { IconUser, IconTag, IconUnorderedList, IconSchedule, IconFile} from '@arco-design/web-vue/es/icon';
export default {
  components:{
    IconUser, IconTag, IconUnorderedList, IconSchedule, IconFile
  }
}
</script>

<style>
.sidebar {
    display: flex;
    flex-direction: column;
    text-align: left;
    color: #575a5f;
    position: absolute;
    right: 50px;
    top: 120px;
}
.sidebar-tip {
    font-weight: 700;
}
.button-link {
    color: #18181a;
    background-color: #091e420a;
    border-radius: 3px;
    box-sizing: border-box;
    cursor: pointer;
    height: 32px;
    margin-top: 8px;
    max-width: 300px;
    overflow: hidden;
    padding: 6px 12px;
    text-decoration: none;
    text-overflow: ellipsis;
    transition-duration: 85ms;
    transition-property: background-color,border-color,box-shadow;
    transition-timing-function: ease;
}
.button-link:hover {
    background: #c8cacd;
}
.sidebar-text {
  margin-left: 10px;
    font-size: 16px;
    color: #575a5f;
}
</style>