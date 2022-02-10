<template>
  <div class="flex">
    <div
      class="bgcColor"
      v-show="task.background"
      :style="{ background: task.background }"
    ></div>
    <icon-close-circle class="icon-close-circle" @click.stop="close" />
    <div class="scroll">
      <div class="header">
        <icon-robot :style="{ fontSize: '1.2em', margin: '0 10px' }" class="robot" />
        <input
          type="text"
          v-model="task.cardname"
          class="content"
          @change="updateTaskName()"
        />
        <div class="listName">
          在列表
          <span class="listNameSpan">{{ columnName }}</span>中
        </div>
      </div>
      <div class="member_content" v-if="task.tagList[0]">
        <h3>标签</h3>
        <div class="member_items">
          <div
            class="tag_item"
            v-for="(item, index) in task.tagList"
            :key="index"
            :style="{ backgroundColor: item.color }"
          >{{ item.tagName }}</div>
        </div>
      </div>
      <div class="member_content" v-if="task.executorList[0]">
        <h3>成员</h3>
        <div class="member_items">
          <a-space :size="32">
            <a-avatar-group>
              <a-avatar
                :style="{ background: user.avatar }"
                v-for="(user, index) in task.executorList"
                :key="user.userId + index"
                :title="user.fullname"
              >
                {{ user.fullname.slice(0, 1) }}
                <template #trigger-icon>
                  <a-popover position="bottom">
                    <icon-user :style="{ color: user.avatar }" />
                    <template #content>
                      <div class="userInfo">
                        <div class="info-header">
                          <span>账号</span>
                        </div>
                        <div class="center">
                          <a-avatar :style="{ backgroundColor: user.avatar }" class="info">
                            <IconUser />
                          </a-avatar>
                          <div style="
                          ">
                            <div>{{ user.fullname }}</div>
                            <div
                              style="
                        color: rgb(197, 202, 210);
                        font-size: 12px;
                        margin-top: 0.5vw;
                      "
                            >{{ user.username }}</div>
                          </div>
                        </div>
                      </div>
                    </template>
                  </a-popover>
                </template>
              </a-avatar>
            </a-avatar-group>
          </a-space>
        </div>
      </div>
      <div class="date" v-if="task.begintime">
        <h3>日期</h3>
        <div class="box">
          <input type="checkbox" v-model="task.completed" @click="showsome(task)" />
          <div class="time" :class="{ timedone: task.completed }">
            {{ dayjs(task.begintime).format("YYYY-MM-DD") }} ~
            {{ dayjs(task.deadline).format("YYYY-MM-DD") }}
            <div class="done" :class="{ undone: !task.completed }">{{ done }}</div>
          </div>
        </div>
      </div>
      <div class="des">
        <icon-align-left class="icon-left" :style="{ fontSize: '1.2em', margin: '0 10px' }" />
        <h3 class="desc">描述</h3>
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
  </div>
</template>
<script lang="ts">
import {
  IconCloseCircle,
  IconRobot,
  IconAlignLeft,
  IconDelete,
  IconUser,
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
import { taskComplete } from "@/axios/api";
import { Message } from "@arco-design/web-vue";
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
    IconUser,
  },
  props: {
    id: String,
    columnName: String,
    lists: Object,
  },
  emits: ["close"],
  setup(props, context) {
    provide("cardId", props.id as string);
    dayjs.extend(utc);
    const task: CardElement = context.attrs.taskInfo as CardElement;
    const store = useStore();
    const route = useRoute();
    let time = reactive({
      begintime: "",
      deadline: "",
    });
    let done = computed(() => {
      if (task.completed) {
        return "已完成";
      } else {
        return "未完成";
      }
    });
    const showsome = async (task: CardElement) => {
      await taskComplete(Number(props.id), !task.completed);
      if (task.completed === true) {
        Message.success({ content: "任务已经完成" });
      } else {
        Message.warning({ content: "任务未完成" });
      }
    };

    const dateTime = (e: any) => {
      task.begintime = e.beginTime;
      task.deadline = e.deadline;
    };
    let id = parseInt(props.id as string) as number;
    const listName = computed(() => {
      return "listName---";
    });
    const updateTaskName = async () => {
      await editCardName(id, task.cardname);
    };
    const updateTaskDesc = async () => {
      await editCardDesc(id, task.description);
    };
    const deleteOneTask = async () => {
      await removeCard(id);
      close();
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
      done,
      showsome,
    };
  },
});
</script>

<style lang="less" scoped>
@import "@/components/card/scrollCss/scroll.scss";
.flex {
  z-index: 100;
  .bgcColor {
    height: 100px;
    width: 100%;
    border-radius: 10px;
    position: relative;
    // flex-grow: 1;
    flex-shrink: 0;
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
  // padding: 10px;

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
  .scroll {
    overflow-y: auto;
    .header {
      // display: flex;
      align-items: center;
      margin-bottom: 30px;
      .robot {
        color: rgba(@cardTextColorMain, 0.8);
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
      margin: 0px 20px 0px 20px;

      .member_items {
        display: flex;
        margin-bottom: 10px;
        .userInfo {
          display: flex;
          flex-direction: column;
          .info-header {
            height: 30px;
            width: 100%;
            display: flex;
            align-items: center;
            color: rgb(94, 108, 132);
            font-size: 18px;
            margin-bottom: 10px;
          }
          .center {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            .info {
              height: 50px;
              width: 50px;
            }
          }
        }

        .member_item {
          margin-left: 10px;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 40px;
          width: 40px;
          // margin-top: 10px;
          border-radius: 50%;
          user-select: none;

          font-weight: 1000;

          background: url(https://joeschmoe.io/api/v1/random);
          background-color: rgba(0, 0, 0, 0.1);
          .userInfo {
            display: flex;
            flex-direction: column;
            .info-header {
              height: 30px;
              width: 100%;
              display: flex;
              align-items: center;
              color: rgb(94, 108, 132);
              font-size: 18px;
              margin-bottom: 10px;
            }
            .center {
              display: flex;
              justify-content: flex-start;
              align-items: center;
              .info {
                height: 50px;
                width: 50px;
              }
            }
          }

          &:hover {
            transform: scale(1.04);
            background-color: rgba(0, 0, 0, 0.2);
            cursor: pointer;
          }
        }
        .tag_item {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-left: 10px;
          padding: 0 5px;
          height: 40px;
          line-height: 40px;
          min-width: 55px;
          border-radius: 10px;
          user-select: none;
          font-size: 22px;
          font-weight: 1000;
          color: white;
        }
      }
    }
    .date {
      margin: 0px 20px 0px 20px;
      span {
        display: inline-block;
        margin-left: 20px;
        font-size: 18px;
        font-weight: 500;
        color: rgba(@cardTextColorMain, 0.7);
        margin-bottom: 10px;
      }
      .box {
        display: flex;
        // justify-content: center;
        align-items: center;
        margin-left: 17px;
        .time {
          margin-top: 10px;
          display: flex;
          font-size: 12px;
          width: fit-content;
          align-items: center;
          background-color: rgb(242, 214, 0);
          justify-content: space-between;
          padding: 5px;
          border-radius: 10px;
          color: rgba(@cardColorMain, 1);
          margin-left: 20px;
          margin-bottom: 10px;
          padding: 10px;
          .done {
            background-color: white;
            border-radius: 5px;
            line-height: 35px;
            text-align: center;
            width: 80px;
            margin-left: 10px;
            color: black;
          }
          .undone {
            background-color: red;
            border-radius: 5px;
            line-height: 35px;
            text-align: center;
            width: 80px;
            margin-left: 10px;
            color: white;
          }
        }
        .time:hover {
          background-color: rgb(217, 181, 28);
        }
        .timedone {
          background-color: rgb(97, 189, 79);
        }
        .timedone:hover {
          background-color: rgb(81, 152, 57);
        }
      }
    }
    .des {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      font-weight: 700;
      h3 {
        color: rgba(@cardTextColorMain, 0.8);
      }
      span {
        font-size: 30px;
        text-align: left;
      }
      .icon-left {
        color: rgba(@cardTextColorMain, 0.8);
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
      right: 20px;
    }
    .arco-popconfirm-popup-content .arco-popconfirm-footer > button {
      font-size: 10px;
    }

    h3 {
      color: rgba(0, 0, 0, 0.7);
      // font-size: 20px;
    }
  }
}
</style>
