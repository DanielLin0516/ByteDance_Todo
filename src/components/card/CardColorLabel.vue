<template>
  <div class="date">
    <div class="header">
      <span>标签</span>
      <IconCloseCircle @click.self="close" class="icon-close" />
    </div>
    <a-input
      :style="{ width: '100%' }"
      placeholder="搜索标签~~"
      @press-enter="pressEnter"
      allow-clear
      class="fontsize"
    />
    <div class="labels">
      <p>标签</p>
      <div class="label">
        <div :style="{ backgroundColor: 'green' }" class="label_color">syg</div>
        <IconPenFill @click="editLavel" class="icon_pen" />
      </div>
    </div>
    <p @click="store.state.addLabelShow = true">新建标签</p>
    <!-- _________________ -->
    <div v-show="store.state.addLabelShow">
      <div class="header">
        <span>创建标签</span>
        <IconLeft
          @click.self="store.state.addLabelShow = false"
          class="icon_left"
        />
        <IconCloseCircle
          @click.self="store.state.addLabelShow = false"
          class="icon-close"
        />
      </div>
      <p>姓名</p>
      <a-input
        v-model:model-value="tempData.content"
        :style="{ width: '100%' }"
        @press-enter="pressEnter"
        allow-clear
      />
      <p>选择一个颜色</p>
      <div class="choose_color">
        <div
          class="color"
          v-for="(color, index) in store.state.labelPattern"
          :key="index"
          :data-color="color"
          :style="{ backgroundColor: color }"
          @click="chooseColor($event)"
        ></div>
        <span class="text">没有颜色。<br />这不会显示在卡片封面上。</span>
      </div>
      <a-button type="primary" class="save" @click.self="addLabel" size="large"
        >保存</a-button
      >
    </div>
    <div>
      <div class="header">
        <span>更改标签</span>
        <IconLeft
          @click.self="store.state.addLabelShow = false"
          class="icon_left"
        />
        <IconCloseCircle
          @click.self="store.state.addLabelShow = false"
          class="icon-close"
        />
      </div>
      <p>姓名</p>
      <a-input
        :model-value="tempData.content"
        :style="{ width: '100%' }"
        @press-enter="pressEnter"
        allow-clear
      />
      <p>选择一个颜色</p>
      <div class="choose_color">
        <div
          class="color"
          v-for="(color, index) in store.state.labelPattern"
          :key="index"
          :data-color="color"
          :style="{ backgroundColor: color }"
          @click="chooseColor($event)"
        ></div>
        <span class="text">没有颜色。<br />这不会显示在卡片封面上。</span>
      </div>
      <a-button type="primary" class="save" @click.self="addLabel" size="large"
        >保存</a-button
      >
      <a-button
        type="primary"
        status="danger"
        class="save"
        @click.self="addLabel"
        size="large"
        >删除</a-button
      >
    </div>
  </div>
</template>
<script lang="ts">
import {
  IconCloseCircle,
  IconPenFill,
  IconLeft,
} from "@arco-design/web-vue/es/icon";
import { defineComponent, computed, ref } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
export default defineComponent({
  components: {
    IconCloseCircle,
    IconPenFill,
    IconLeft,
  },
  data() {
    return {
      searchValue: "",
    };
  },
  emits: ["close"],
  setup(props, context) {
    const store = useStore();
    let time = ref(null);
    const route = useRoute();
    const task = computed(() => {
      return store.getters.getTask(route.params.id);
    });
    const tempData = {
      color: "",
      content: "",
    };
    const pressEnter = (a: any, b: any) => {
      // console.log(a, b);
      console.log(tempData);
    };
    const chooseColor = (e: any) => {
      const el = e.target;
      console.log(el.dataset.color);
      tempData.color = el.dataset.color;
    };
    const addLabel = () => {
      console.log("addLabel---");
    };
    const close = () => {
      context.emit("close");
    };
    const editLavel = () => {};
    return {
      store,
      pressEnter,
      chooseColor,
      addLabel,
      tempData,
      editLavel,
      close,
    };
  },
});
</script>

<style lang="scss" scoped>
$color: red;
$white: rgb(255, 255, 255);
.date {
  position: absolute;
  width: 300px;
  height: 730px;
  padding: 20px;
  top: 0px;
  right: -200px;

  display: flex;
  flex-direction: column;

  border-radius: 5px;
  background-color: $white;
  border-left: 1px solid rgba(0, 0, 0, 0.3);
  overflow: scroll;
  .header {
    position: relative;

    height: 40px;
    width: 100%;

    display: flex;
    align-items: center;
    justify-content: center;

    border-bottom: 1px solid black;
    margin-bottom: 30px;

    span {
      font-size: 22px;
      height: 100%;
    }
    .icon-close,
    .icon_left {
      position: absolute;
      right: -5px;
      top: -5px;

      height: 100%;
      width: 40px;

      border-radius: 50%;
      font-size: 10px;
      color: rgba(0, 0, 0, 0.5);

      transition: all 0.4s;
    }
    .icon_left {
      left: 0;
    }
    .icon-close,
    .icon_left:hover {
      background-color: rgba(0, 0, 0, 0.1);
      cursor: pointer;
      transition: all 0.4s;
    }
  }

  .labels {
    // display: flex;
    p {
      width: 100px;
    }
    .label {
      position: relative;
      display: flex;
      height: 40px;
      width: 100%;

      .label_color {
        box-sizing: border-box;
        width: 90%;
        height: 100%;
        line-height: 40px;
        // line-height: 100%;??

        padding-left: 3%;
        border-radius: 5px;

        color: white;
        font-weight: 800;
      }
      .icon_pen {
        position: absolute;
        right: 0;
        font-size: 24px;
        height: 100%;
        line-height: 100%;
      }
      .icon_pen:hover {
        cursor: pointer;
        background-color: rgba(0, 0, 0, 0.1);
      }
    }
  }
  .choose_color {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-gap: 5px;
    grid-auto-rows: minmax(20px, auto);
    justify-items: center;
    .color {
      height: 40px;
      width: 100%;
      border-radius: 3px;
    }
    .color:hover {
      cursor: pointer;
      opacity: 0.8;
    }
    .text {
      grid-column: 2 / 6;
      grid-row: 3;
    }
  }
}
.fontsize {
  ::v-deep .arco-input-size-medium {
    // font-size: 70px;
  }
}
</style>