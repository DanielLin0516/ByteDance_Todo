<template>
  <div class="flex">
    <div class="bgcColor" v-show="task.background" :style="{ background: task.background }"></div>
    <icon-close-circle class="icon-close-circle" @click.stop="close" />
    <div class="header">
      <icon-robot :style="{ fontSize: '1.2em', margin: '0 10px' }" class="robot" />
      <input
        type="text"
        v-model="task.cardname"
        class="content"
        @change="updateTaskName()"
        @keyup.enter="updateTaskName()"
      />
      <div class="listName">
        在列表
        <span class="listNameSpan">{{ columnName }}</span>中
      </div>
    </div>
    <div class="member_content" v-if="task.executorList[0]">
      <span>标签</span>
      <div class="member_items">
        <a
          class="member_item"
          v-for="(user, index) in task.executorList"
          :key="user.userId + index"
          :title="user.fullname"
        >
          <!-- {{ user.fullname }} -->
        </a>
      </div>
    </div>
    <div class="date" v-if="task.begintime">
      <span>日期</span>
      <div style="background-color: rgb(242, 212, 0)">
        {{ dayjs(task.begintime).format("YYYY-MM-DD") }} ~
        {{ dayjs(task.deadline).format("YYYY-MM-DD") }}
      </div>
    </div>
    <div class="des">
      <icon-align-left class="icon-left" :style="{ fontSize: '1.2em', margin: '0 10px' }" />
      <span class="mySpan">描述</span>
    </div>
    <a-textarea
      default-value="添加详细描述..."
      class="text"
      v-model="task.description"
      placeholder="添加详细描述..."
      @change="updateTaskDesc()"
      :auto-size="{ minRows: 2, maxRows: 5 }"
    />
    <card-action :task="task"></card-action>
    <CardDetailFuction
      @timeDate="dateTime"
      :lists="lists"
      v-bind="$attrs"
      @change="change"
      :id="id"
      :columnName="columnName"
    ></CardDetailFuction>
    <a-popconfirm content="将此任务删除？" okText="确认" cancelText="取消" @ok="deleteOneTask()">
      <a-button status="danger" class="deleteButton" shape="round">
        <template #icon>
          <icon-delete />
        </template>
        <template #default>删除任务</template>
      </a-button>/>
    </a-popconfirm>
  </div>
</template>
<script lang="ts">
import {
  IconCloseCircle,
  IconRobot,
  IconAlignLeft,
  IconDelete,
} from "@arco-design/web-vue/es/icon";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useRoute, useRouter } from "vue-router";
import {
  defineComponent,
  computed,
  reactive,
  ref,
  provide,
  inject,
  PropType,
} from "vue";
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
  removeCard,
} from "@/axios/api";
import { CardElement } from "@/axios/globalInterface";
import CardAction from "@/components/card/CardAction.vue";
import CardDetailFuction from "@/components/card/CardDetailFuction.vue";
export default defineComponent({
  name: "NewCardButton",
  inheritAttrs: false,
  components: {
    IconCloseCircle,
    IconRobot,
    IconAlignLeft,
    IconDelete,
    CardAction,
    CardDetailFuction,
  },
  props: {
    id: String,
    columnName: String,
    lists: Object,
    taskInfo: Object as PropType<CardElement>,
  },
  emits: ["close", "change"],
  setup(props, context) {
    provide("cardId", props.id as string);
    dayjs.extend(utc);
    const task: CardElement = props.taskInfo as CardElement;
    console.log(props.taskInfo?.cardname);
    const store = useStore();
    const route = useRoute();
    let time = reactive({
      begintime: "",
      deadline: "",
    });
    // const task = reactive<CardElement>({
    //   begintime: "",
    //   cardId: NaN,
    //   cardname: "",
    //   closed: false,
    //   deadline: "",
    //   description: "",
    //   executorList: [],
    //   expired: false,
    //   listId: NaN,
    //   pos: NaN,
    //   productId: NaN,
    //   tagList: [],
    //   createdTime: "",
    //   creator: {
    //     avatar: "",
    //     fullname: "",
    //     userId: 0,
    //     username: "",
    //   },
    //   background: "",
    //   completed: true,
    //   action: [],
    // });

    const dateTime = (e: any) => {
      task.begintime = e.beginTime;
      task.deadline = e.deadline;
    };
    let id = parseInt(props.id as string) as number;
    let delStatue = false;
    const listName = computed(() => {
      return "listName---";
    });
    const updateTaskName = async () => {
      await editCardName(id, task.cardname);
      close();
    };
    const updateTaskDesc = async () => {
      await editCardDesc(id, task.description);
    };
    const deleteOneTask = async () => {
      delStatue = true;
      await removeCard(id);
      close();
    };

    const close = () => {
      // console.log("关闭");
      // const param = {
      //   taskId: id,
      //   taskName: CardName,
      //   del: delStatue,
      // };
      // context.emit("close", param);
      context.emit("close");

    }
    // const addExecutor = (executor) => {
    //   task.executorList.push(executor);
    // };
    // const removeExecutor = (userId: number) => {
    //   const index = task.executorList.findIndex((el) => el.userId == userId);
    //   task.executorList.splice(index, 1);
    // };
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
    const getTaskInfo = async () => {
      await getCardInfo(id).then((res) => {
        task.cardname = res.cardname;
        task.description = res.description;
        Object.assign(task, res);
        // console.log(task);
        // console.log(task.executorList);
      });
    };
    getTaskInfo();
    const change = (e) => {
      task.background = e.background;
    };
    return {
      task,
      listName,
      time,
      dayjs,

      close,
      updateTaskName,
      updateTaskDesc,
      deleteOneTask,
      dateTime,
      // addExecutor,
      // removeExecutor,
      change,
    };
  },
});
</script>

<style lang="less" scoped>
.flex {
  .bgcColor {
    height: 100px;
    width: 100%;
    border-radius: 10px;
    position: relative;
  }
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
  .mySpan {
    color: rgba(@cardTextColorMain, 0.8);
  }
  .member_content {
    margin-left: 20px;
    span {
      display: inline-block;
      font-size: 18px;
      font-weight: 500;
      color: rgba(@cardTextColorMain, 0.7);
      margin-bottom: 10px;
    }
    .member_items {
      display: flex;

      .member_item {
        margin-left: 10px;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 60px;
        width: 60px;
        // margin-top: 10px;
        border-radius: 50%;
        user-select: none;

        font-weight: 1000;

        background: url(https://joeschmoe.io/api/v1/random);
        background-color: rgba(0, 0, 0, 0.1);

        &:hover {
          transform: scale(1.04);
          background-color: rgba(0, 0, 0, 0.2);
          cursor: pointer;
        }
      }
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
      color: white;
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
  .deleteButton {
    position: absolute;
    bottom: 40px;
    right: 40px;
  }
  .arco-popconfirm-popup-content .arco-popconfirm-footer > button {
    font-size: 10px;
  }
}
</style>
