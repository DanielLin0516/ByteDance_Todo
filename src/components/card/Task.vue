<template>
  <div class="flex">
    <icon-close-circle class="icon-close-circle" @click.self="close" />
    <div class="header">
      <icon-robot
        :style="{ fontSize: '1.2em', margin: '0 10px' }"
        class="robot"
      />
      <input
        type="text"
        v-model="CardName"
        class="content"
        @change="updateTaskName()"
        @keyup.enter="updateTaskName()"
      />
      <div class="listName">
        在列表
        <span class="listNameSpan">{{ columnName }}</span
        >中
      </div>
    </div>
    <!-- <div :class="date" v-if="true">
      <span>日期</span>
      <div>{{ task.begintime }} - {{ task.deadline }}</div>
    </div> -->
    <div class="des">
      <icon-align-left
        class="icon-left"
        :style="{ fontSize: '1.2em', margin: '0 10px' }"
      />
      <span>描述</span>
    </div>
    <a-textarea
      default-value="添加详细描述..."
      class="text"
      v-model="CardDesc"
      placeholder="添加详细描述..."
      @change="updateTaskDesc()"
      :auto-size="{ minRows: 2, maxRows: 5 }"
    />
    <card-action :task="task"></card-action>
    <card-detail-fuction></card-detail-fuction>
  </div>
</template>
<script lang="ts">
import {
  IconCloseCircle,
  IconRobot,
  IconAlignLeft,
} from "@arco-design/web-vue/es/icon";
import { useRoute, useRouter } from "vue-router";
import { defineComponent, computed, reactive, ref, provide } from "vue";
import { useStore } from "vuex";
import debouceRef from "@/hooks/debounce";
import { useRequest } from "@/hooks/useRequest";
import {
  getCardInfo,
  owner,
  createList,
  editListName,
  editCardName,
  editCardDesc,
} from "@/axios/api";
import { CardElement } from "@/axios/globalInterface";

import { log } from "console";
import CardAction from "@/components/card/CardAction.vue";
import CardDetailFuction from "@/components/card/CardDetailFuction.vue";
export default defineComponent({
  name: "NewCardButton",
  components: {
    IconCloseCircle,
    IconRobot,
    IconAlignLeft,
    CardAction,
    CardDetailFuction,
  },
  props: {
    id: String,
    columnName: String,
  },
  emits: ["close"],
  setup(props, context) {
    provide("taskId", props.id as string);
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const task = reactive<CardElement[]>([]);
    let id = parseInt(props.id as string) as number;
    let CardName = ref("");
    let CardDesc = ref("");

    let task1 = {};
    const listName = computed(() => {
      return "listName---";
      return store.getters.getColumnName(route.params.cid);
    });
    const content = computed({
      get() {
        // let task1 = store.getters.getTask(route.params.id);
        return "task1.content";
      },
      set(val) {
        let task1 = store.getters.getTask(route.params.id);
        return (task1.content = val);
      },
    });
    // let debounce = debouceRef(content.value);
    const updateTaskName = async () => {
      await editCardName(id, CardName.value);
    };
    const updateTaskDesc = async () => {
      await editCardDesc(id, CardDesc.value);
    };

    // const changeBGC = async () => {
    //   await changeBackground(productId.value, `${upSquare.value.slice(1,7)}`);
    //   Message.success({ content: "更改成功！请刷新后查看" })
    // }
    const updateTaskProperty = (e: { target: any }, key: any) => {
      console.log("updateTaskProperty-----");

      store.commit("UPDATE_TASK", {
        task,
        key,
        value: e.target,
      });
    };

    const close = () => {
      context.emit("close");
    };
    //获取页面渲染数据与处理数据
    const {
      data,
      loading: productLoading,
      error,
      run,
    } = useRequest(getCardInfo, {
      onError: () => {
        console.trace(error);
      },
    });
    const getInfo = async () => {
      await getCardInfo(id).then((res) => {
        CardName.value = res.cardname;
        CardDesc.value = res.description;
        Object.assign(task, res);
      });
    };
    getInfo();
    return {
      task,
      listName,
      CardName,
      content,
      CardDesc,
      updateTaskProperty,
      close,
      updateTaskName,
      updateTaskDesc,
      // date,
    };
  },
});
</script>

<style lang="less" scoped>
.flex {
  position: relative;
  display: flex;
  height: 75vh;
  width: 50vw;

  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  border-radius: 10px;
  background-color: rgba(@cardColorMain, 1);
  padding: 10px;

  flex-direction: column;
  align-items: flex-start;
  .icon-close-circle {
    position: absolute;
    right: 20px;
    top: 20px;
    height: 40px;
    width: 40px;
    border-radius: 50%;
    padding: 10px;
    color: rgba(@cardTextColorMain, 0.5);
    cursor: pointer;
  }
  .icon-close-circle:hover {
    background-color: rgba(@cardTextColorMain, 0.1);
  }
  .header {
    // display: flex;
    align-items: center;
    margin-bottom: 30px;
    .robot {
      height: 30px;
      width: 30px;
    }
    .content {
      width: 650px;
      line-height: 30px;
      border-radius: 10px;
      outline: 0;
      background-color: transparent;
      border: none;
      border-color: transparent;
      color: rgba(@cardTextColorMain, 0.8);
      padding: 20px;
      padding-bottom: 10px;
      font-size: 30px;
      // margin-bottom: 10px;
      margin-left: -20px;
    }
    .listName {
      margin-left: 60px;
      text-align: left;
      color: rgba(@cardTextColorMain, 0.8);
    }
    .listNameSpan {
      margin: 0 5px;
      text-decoration: underline;
    }
  }
  .date {
    span {
      display: inline-block;
      margin-left: 20px;
      font-size: 18px;
      font-weight: 500;
      color: rgba(@cardTextColorMain, 0.7);
      margin-bottom: 10px;
    }
    div {
      padding: 10px;
      margin-left: 10px;
      margin-bottom: 10px;
      border-radius: 10px;
    }
    div:hover {
      background-color: rgba(@cardTextColorMain, 0.1);
    }
  }
  .des {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    font-weight: 700;
    span {
      font-size: 30px;
      text-align: left;
    }
    .icon-left {
      width: 30px;
      height: 30px;
    }
  }
  .text {
    border: none;
    outline: 0;
    background-color: transparent;
    margin-left: 40px;
    width: 600px;
    color: rgba(@cardTextColorSub, 1);
    font-size: 20px;
  }
  .text:hover {
    background-color: rgba(@cardColorWrapper, 0.8);
  }
}
</style>