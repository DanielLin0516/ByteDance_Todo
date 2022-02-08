<template>
  <div
    class="card-wrapper"
    @mousedown="columnsMouseMove"
    @wheel="columnsMouseWheel"
  >
    <!-- 要渲染的列表 -->
    <transition-group
      name="animate__list"
      enter-active-class="animate__animated animate__fadeIn animate__fast"
      leave-active-class="animate__animated animate__zoomOut animate__fast"
    >
      <div
        class="list-item"
        v-for="(column, index) of lists"
        :key="column.listId"
        draggable="true"
        @drop="moveTaskOrColumn($event, index, column.listId)"
        @dragover.prevent
        @dragenter.prevent
        @dragstart.self="pickupColumn($event, column.listId, index)"
      >
        <!-- 列表标题 -->
        <a-row justify="space-between" align="center">
          <a-col :span="21">
            <input
              type="text"
              v-model="column.listName"
              class="list-title"
              @change="changeListName(index, $event)"
              @keyup.enter="editListNameById(column.listId, index, $event)"
            />
          </a-col>
          <a-col :span="3" style="display: flex; justify-content: flex-end">
            <a-popconfirm
              content="将此列表进行删除？"
              okText="确认"
              cancelText="取消"
              @ok="deleteOneList(column.listId, index)"
            >
              <icon-close-circle
                :style="{ fontSize: '20px', color: '#696969' }"
              />
            </a-popconfirm>
          </a-col>
        </a-row>
        <div class="scroller-container">
          <!-- 列表卡片栏也要渲染 -->
          <transition-group
            name="animate__card"
            enter-active-class="animate__animated animate__bounceIn animate__fast"
            leave-active-class="animate__animated animate__zoomOut animate__fast"
          >
            <div v-for="(task, taskIndex) of column.items" :key="task.cardId">
              <div
                class="kanban-dropzon"
                @dragover.prevent="height($event)"
                @dragleave.prevent="height1($event)"
                @drop.stop="
                  moveTaskOrColumn(
                    $event,
                    index,
                    column.listId,
                    taskIndex,
                    task.cardId
                  )
                "
              ></div>
              <CardItem
                draggable="true"
                :cardInfo="task"
                :columnId="column.listId.toString()"
                :lists="lists"
                @click="openTask(task.cardId, column)"
                @dragstart.stop="
                  pickupTask($event, task.cardId, taskIndex, index)
                "
                @dragover.prevent
                @dragenter.prevent
                @drop.stop.prevent
              ></CardItem>
            </div>
          </transition-group>
        </div>

        <!-- 添加卡片按钮 -->
        <div
          class="kanban-dropzon"
          @dragover.prevent="height($event)"
          @dragleave.prevent="height1($event)"
          @drop="moveTaskIntoColumnEnd($event, index, column.listId)"
        ></div>
        <input
          class="new-button"
          type="text"
          placeholder="+ 添加任务"
          @keyup.enter="createTask($event, column.items, column.listId)"
        />
      </div>
    </transition-group>
    <div class="btn-add">
      <input
        class="add-item"
        type="text"
        v-model="newColumnName"
        placeholder="添加另一个列表"
        @keyup.enter="createColumn"
      />
    </div>
    <div class="task-bg" v-if="isTaskOpen" @click.self="close">
      <!-- <router-view /> -->
      <Task
        :id="taskClickId.toString()"
        :columnName="columnName"
        @close="close"
        :lists="lists"
        :taskInfo="currentTask"
        @addExecutor="addExecutor"
        @removeExecutor="removeExecutor"
        @addTag="addTag"
        @removeTag="removeTag"
      ></Task>
    </div>
    <Websocket
      v-if="!productLoading"
      :productId="productId"
      @updateList="updateList"
      @updateCard="updateCard"
    />
  </div>
</template>

<script lang="ts">
import "animate.css";
import {
  getTimeStamp,
  PosType,
  getPos,
  timetrans,
  columnsMouseMove,
  columnsMouseWheel,
} from "@/utils/utils";
import {
  IconPlus,
  IconSchedule,
  IconCloseCircle,
} from "@arco-design/web-vue/es/icon";
import {
  computed,
  defineComponent,
  ref,
  TransitionGroup,
  watch,
  PropType,
  reactive,
  provide,
  ComputedRef,
} from "vue";
import { Store, useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import {
  ProductShowElement,
  CardElement,
  TagElement,
  UserElement,
  StoreState,
  NotifyMessage,
  DetailElement,
} from "@/axios/globalInterface";
import { getTagsByProductId } from "@/axios/labelApi";
import { useRequest } from "@/hooks/useRequest";
import {
  getProductInfo,
  owner,
  createList,
  editListName,
  deleteListById,
  createNewCard,
  moveList,
  moveCard,
} from "@/axios/api";
import { Message } from "@arco-design/web-vue";
import CardItem from "./CardItem.vue";
import Task from "./Task.vue";
import Websocket from "@/components/websocket/Websocket.vue";

export default defineComponent({
  name: "MainCard",
  components: {
    IconPlus,
    TransitionGroup,
    IconSchedule,
    CardItem,
    Task,
    IconCloseCircle,
    Websocket,
  },
  provide() {
    return {
      // columnName:
    };
  },
  emits: ["loadingOver"],
  setup(props, context) {
    const store: Store<StoreState> = useStore();
    const route = useRoute();
    const router = useRouter();
    const newColumnName = ref("");
    const taskClickId = ref(NaN);
    const columnName = ref("");
    const isTaskOpen = ref(false);
    const currentCardId = ref(0);
    const currentColumnId = ref(0);

    // 记录移动之前列的id
    const fromListId = ref(NaN);
    // 记录移动之前列的index值
    const fromListIndex = ref(NaN);
    // 记录移动卡片的id
    const fromCardId = ref(NaN);
    // 记录移动卡片的index值
    const fromCardIndex = ref(NaN);
    // 记录移动卡片之前所在列的index值
    const fromCardListIndex = ref(NaN);
    // 记录当前操作的是列还是卡片
    const currentActionDragType = ref("");

    // 记录用户是否为操作者
    const actionStatus = ref(false);

    // 传给MainCard的列数组
    const lists = reactive<ProductShowElement[]>([]);

    // 路由中的项目Id
    const productId: ComputedRef<string> = computed(() => {
      return route.params.productId as string;
    });
    // useRequest钩子
    const {
      loading: productLoading,
      error,
      run,
    } = useRequest(getProductInfo, {
      onError: () => {
        console.trace(error);
      },
    });

    //获取页面渲染数据与处理数据
    async function getInfo() {
      try {
        const res = await run(productId.value);
        const showInvite = await owner(productId.value);
        const bgcColor = res.background;
        Message.success({ content: "获取页面成功！" });
        store.commit("setCurrentProductName", res.productName);
        store.commit("setShowInviteButton", showInvite.isOwner);
        store.commit("setMemberList", res.memberList);
        store.commit("setColor", res.background);
        store.commit("setTagList", res.tagList);
        // 清空lists
        lists.length = 0;
        res.lists.forEach((item) => {
          const tempObj: ProductShowElement = {
            listName: "",
            listId: 0,
            productId: 0,
            closed: false,
            pos: 0,
            items: [],
          };
          Object.assign(tempObj, item);
          tempObj.listId = item.id;
          lists.push(tempObj);
        });
        res.cardList.forEach((cardItem) => {
          lists.forEach((listItem) => {
            cardItem.listId === listItem.listId &&
              listItem.items.push(cardItem);
          });
        });
        lists.forEach((item) => {
          item.items.sort((a, b) => {
            return a.pos - b.pos;
          });
        });
        // console.log(lists);
        // 告知父组件，加载完毕
        context.emit("loadingOver");
      } catch (error) {
        console.trace(error);
      }
    }
    /**
     * 子组件Task触发 关闭任务卡片后的处理
     * @param param
     * @returns
     */
    const close = (param: {
      taskId: number;
      taskName: string;
      del: boolean;
    }) => {
      isTaskOpen.value = false;
    };

    const changeListName = (index: number, e: any) => {
      lists[index].listName = e.target.value;
    };

    /**
     * 创建新卡片
     */
    const createTask = async (
      e: KeyboardEvent,
      tasks: CardElement[],
      listId: number
    ) => {
      const el = e.target as HTMLInputElement;
      if (!el.value) {
        Message.error("请输入卡片名~");
        return;
      }
      const lastTask = tasks.at(-1);
      const pos = lastTask?.pos ? lastTask.pos + 60000 : 60000;
      const newCardData = {
        cardname: el.value,
        listId: listId,
        pos: pos,
        productId: Number(productId.value),
      };
      el.value = "";
      try {
        await createNewCard(newCardData);
      } catch (error) {
        console.trace(error);
      }
    };

    /**
     * 创建列
     */
    const createColumn = async () => {
      const maxPos = lists.length === 0 ? 0 : lists[lists.length - 1].pos;
      const res = await createList({
        productId: Number(productId.value),
        listName: newColumnName.value,
        pos: maxPos + 60000,
      });
      newColumnName.value = "";
    };

    /**
     * 修改列的名称
     * @param listId
     * @param index
     * @param e
     */
    const editListNameById = async (
      listId: number,
      index: number,
      e: KeyboardEvent
    ) => {
      const inputEvent = e.target as HTMLInputElement;
      try {
        lists[index].listName = inputEvent.value;
        await editListName(listId, inputEvent.value);
      } catch (e) {
        console.trace(e);
      } finally {
        inputEvent.blur();
      }
    };
    /**
     * 删除列表
     * @param listId
     * @param index
     */
    const deleteOneList = async (listId: number, index: number) => {
      await deleteListById(listId);
      // lists.splice(index, 1);
    };

    /**
     * 卡片抬起时触发
     * @param e
     * @param fromTaskId
     * @param fromTaskIndex
     * @param fromColumnIndex
     */
    const pickupTask = (
      e: DragEvent,
      fromTaskId: number,
      fromTaskIndex: number,
      fromColumnIndex: number
    ) => {
      console.log(
        "卡片从" +
          fromColumnIndex +
          "列出发，id为" +
          fromTaskId +
          " index为：" +
          fromTaskIndex
      );
      fromCardId.value = fromTaskId;
      fromCardIndex.value = fromTaskIndex;
      fromCardListIndex.value = fromColumnIndex;
      if (e.dataTransfer !== null) {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.dropEffect = "move";
        e.dataTransfer?.setData("type", "task");
      }
      currentActionDragType.value = "task";
    };
    /**
     * 列抬起时触发
     * @param e
     * @param fromColumnId
     * @param fromColumnIndex
     */
    const pickupColumn = (
      e: DragEvent,
      fromColumnId: number,
      fromColumnIndex: number
    ) => {
      // 将出发列的数据记录
      fromListIndex.value = fromColumnIndex;
      fromListId.value = fromColumnId;
      if (e.dataTransfer !== null) {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.dropEffect = "move";
        e.dataTransfer?.setData("type", "column");
      }
      currentActionDragType.value = "column";
    };

    /**
     * 移动列或任务卡片
     * @param e
     * @param toColumnIndex
     * @param toTaskIndex
     * @param toTaskId
     */
    const moveTaskOrColumn = (
      e: DragEvent,
      toColumnIndex: number,
      toColumnId: number,
      toTaskIndex?: number,
      toTaskId?: number
    ) => {
      const type = e.dataTransfer?.getData("type");
      if (
        type === "task" &&
        toTaskIndex !== undefined &&
        toTaskId !== undefined
      ) {
        const dom = e.target as HTMLElement;
        dom.style.height = "15px";
        dom.style.boxShadow = "";
        dom.style.backgroundColor = "transparent";
        moveTask(e, toColumnIndex, toColumnId, toTaskIndex, toTaskId);
      } else if (type === "column") {
        const dom = e.target as HTMLElement;
        if (dom.className === "kanban-dropzon") {
          dom.style.height = "15px";
          dom.style.boxShadow = "";
          dom.style.backgroundColor = "transparent";
        }
        moveColumn(e, toColumnIndex);
      }
      currentActionDragType.value = "";
    };

    /**
     * 移动任务卡片
     * @param e
     * @param toColumnIndex
     * @param toTaskIndex
     * @param toTaskId
     */
    const moveTask = async (
      e: DragEvent,
      toColumnIndex: number,
      toColumnId: number,
      toTaskIndex: number,
      toTaskId: number
    ) => {
      console.log(
        "卡片插入到" +
          toColumnIndex +
          "列，id为" +
          toTaskId +
          " index为：" +
          toTaskIndex
      );
      let newPos: number = NaN;

      if (fromCardListIndex.value === toColumnIndex) {
        // 同列移动
        const type = fromCardIndex.value < toTaskIndex ? "down" : "up";
        if (type === "down") {
          if (toTaskIndex - fromCardIndex.value <= 1) {
            // 原地不动
            return;
          }
          newPos = getPos(
            lists[fromCardListIndex.value].items[toTaskIndex - 1].pos,
            lists[fromCardListIndex.value].items[toTaskIndex].pos,
            PosType.middle
          );
          const temp =
            lists[fromCardListIndex.value].items[fromCardIndex.value];
          temp.pos = newPos;
          lists[toColumnIndex].items.splice(toTaskIndex, 0, temp);
          lists[fromCardListIndex.value].items.splice(fromCardIndex.value, 1);
        } else {
          if (toTaskIndex === fromCardIndex.value) {
            // 原地不动
            return;
          }
          newPos =
            toTaskIndex === 0
              ? getPos(
                  0,
                  lists[fromCardListIndex.value].items[toTaskIndex].pos,
                  PosType.first
                )
              : getPos(
                  lists[fromCardListIndex.value].items[toTaskIndex - 1].pos,
                  lists[fromCardListIndex.value].items[toTaskIndex].pos,
                  PosType.middle
                );
          const temp =
            lists[fromCardListIndex.value].items[fromCardIndex.value];
          temp.pos = newPos;
          lists[fromCardListIndex.value].items.splice(fromCardIndex.value, 1);
          lists[toColumnIndex].items.splice(toTaskIndex, 0, temp);
        }
      } else {
        // 跨列移动
        newPos =
          toTaskIndex === 0
            ? getPos(
                0,
                lists[toColumnIndex].items[toTaskIndex].pos,
                PosType.first
              )
            : getPos(
                lists[toColumnIndex].items[toTaskIndex - 1].pos,
                lists[toColumnIndex].items[toTaskIndex].pos,
                PosType.middle
              );
        const temp = lists[fromCardListIndex.value].items[fromCardIndex.value];
        temp.pos = newPos;
        lists[fromCardListIndex.value].items.splice(fromCardIndex.value, 1);
        lists[toColumnIndex].items.splice(toTaskIndex, 0, temp);
      }

      await moveCard({
        cardId: fromCardId.value,
        listId: toColumnId,
        pos: newPos,
      });
    };

    /**
     * 移动列
     * @param e
     * @param toColumnId
     * @param toColumnIndex
     */
    const moveColumn = (e: DragEvent, toColumnIndex: number) => {
      const type = e.dataTransfer?.getData("type");
      // 原地移动直接return
      if (fromListIndex.value === toColumnIndex || type === "task") {
        return;
      }
      const len = lists.length;
      const id = fromListId.value;
      // 判断移动方向
      const direction = fromListIndex.value < toColumnIndex ? "right" : "left";
      // 获取新的pos值
      const newPos =
        toColumnIndex === 0
          ? getPos(0, lists[toColumnIndex].pos, PosType.first)
          : toColumnIndex === len - 1
          ? getPos(
              lists[toColumnIndex].pos,
              lists[toColumnIndex].pos,
              PosType.end
            )
          : direction === "right"
          ? getPos(
              lists[toColumnIndex].pos,
              lists[toColumnIndex + 1].pos,
              PosType.middle
            )
          : getPos(
              lists[toColumnIndex - 1].pos,
              lists[toColumnIndex].pos,
              PosType.middle
            );
      // 更改出发列的pos值
      lists[fromListIndex.value].pos = newPos;
      // 暂存出发列，并删除出发列
      const temp = lists[fromListIndex.value];
      lists.splice(fromListIndex.value, 1);
      // 将出发列插入目标index
      lists.splice(toColumnIndex, 0, temp);

      moveList({ listId: id, pos: newPos });
    };

    const height = (e: DragEvent) => {
      if (currentActionDragType.value === "column") {
        return;
      }
      const dom = e.target as HTMLElement;
      dom.style.height = "63px";
      dom.style.boxShadow = "inset 0 0 3px 3px #D8D8D8";
      dom.style.backgroundColor = "#E6E6E6";
      dom.style.transition = "height 0.2s";
    };
    const height1 = (e: DragEvent) => {
      if (currentActionDragType.value === "column") {
        return;
      }
      const dom = e.target as HTMLElement;
      dom.style.height = "15px";
      dom.style.boxShadow = "";
      dom.style.backgroundColor = "transparent";
    };
    /**
     * 移动卡片至列的最后
     */
    const moveTaskIntoColumnEnd = async (
      e: DragEvent,
      toColumnIndex: number,
      toColumnId: number
    ) => {
      const dom = e.target as HTMLElement;
      dom.style.height = "15px";
      dom.style.boxShadow = "";
      dom.style.backgroundColor = "transparent";

      const len = lists[toColumnIndex].items.length;
      const newPos =
        len === 0
          ? 60000
          : getPos(lists[toColumnIndex].items[len - 1].pos, 0, PosType.end);

      const temp = lists[fromCardListIndex.value].items[fromCardIndex.value];

      temp.pos = newPos;

      lists[toColumnIndex].items.push(temp);

      lists[fromCardListIndex.value].items.splice(fromCardIndex.value, 1);

      await moveCard({
        cardId: fromCardId.value,
        listId: toColumnId,
        pos: newPos,
      });
    };
    const openTask = (cardId: number, column: ProductShowElement) => {
      taskClickId.value = cardId;
      columnName.value = column.listName;
      isTaskOpen.value = true;

      //保存当前打开的task状态
      currentCardId.value = cardId;
      currentColumnId.value = column.listId;
    };

    const labelList: TagElement[] = reactive([]);
    const getProductLabels = async () => {
      const res = await getTagsByProductId(productId.value as string);
      res.forEach((el: TagElement) => {
        // labelList.push(Object.assign(el, { show: true, isChoosed: false }));
        labelList.push(el);
      });
      store.commit("setLabelList", labelList);
    };

    //计算属性记录currentTask
    const currentTask: ComputedRef<CardElement> = computed(() => {
      const column = lists.filter(
        (el) => el.listId === currentColumnId.value
      )[0];
      const task = column.items.filter(
        (el) => el.cardId === currentCardId.value
      )[0];
      return task;
    });

    /**
     * 主页中cardItme添加成员
     */
    const addExecutor = (executor: UserElement) => {
      currentTask.value.executorList.push(executor);
    };
    /**
     * 主页中cardItme删除成员
     */
    const removeExecutor = (userId: number) => {
      const index = currentTask.value.executorList.findIndex(
        (el) => el.userId == userId
      );
      currentTask.value.executorList.splice(index, 1);
    };

    const addTag = (tag: TagElement) => {
      currentTask.value.tagList.push(tag);
    };
    const removeTag = (tag: TagElement) => {
      const tagList = currentTask.value.tagList;
      const index = tagList.findIndex((el) => el.id === tag.id);
      tagList.splice(index, 1);
    };

    /**
     * websocket更改list
     */
    const updateList = (message: NotifyMessage) => {
      const detail = message.detail;
      console.log(detail);
      switch (message.event) {
        case "updateModels":
          lists.forEach((list) => {
            if (list.listId == detail.id) {
              list.listName = detail.name;
            }
          });
          break;
        case "moveModels":
          lists.forEach((list) => {
            if (list.listId == detail.id) {
              list.pos = detail.pos;
            }
          });
          lists.sort((a, b) => a.pos - b.pos);
          break;
        case "removeModels":
          console.log(lists);
          lists.forEach((list, index) => {
            if (list.listId == detail.id) {
              lists.splice(index, 1);
            }
          });
          break;
        case "addModels":
          const emptyList: ProductShowElement = {
            listName: detail.name,
            listId: detail.id,
            productId: detail.productId,
            closed: detail.closed,
            pos: detail.pos,
            items: [],
          };
          lists.push(emptyList);
          const len = lists.length;
          if (len > 1 && detail.pos <= lists[len - 2].pos) {
            lists.sort((a, b) => a.pos - b.pos);
          }
          break;
        default:
          break;
      }
    };

    /**
     * websocket更改卡片
     */
    const updateCard = (message: NotifyMessage) => {
      const detail = message.detail;
      console.log(detail);
      switch (message.event) {
        case "updateModels":
          updateCardByActionTags(detail, message.tags);
          break;
        case "moveModels":
          break;
        case "removeModels":
          break;
        case "addModels":
          const emptyCard: CardElement = {
            begintime: "",
            deadline: "",
            cardname: detail.name,
            description: "",
            listId: detail.listAfterId,
            pos: detail.pos,
            cardId: detail.id,
            closed: detail.closed,
            productId: detail.productId,
            expired: false,
            createdTime: detail.createdTime,
            executorList: [],
            tagList: [],
            creator: detail.creator,
            background: "",
            completed: false,
            action: [],
          };
          const consistListIndex = lists.findIndex(
            (item) => item.listId == detail.listAfterId
          );
          if (consistListIndex >= 0) {
            const cardList = lists[consistListIndex].items;
            cardList.push(emptyCard);
            const len = cardList.length;
            if (len > 1 && detail.pos <= cardList[len - 2].pos) {
              cardList.sort((a, b) => a.pos - b.pos);
            }
          }
          break;
        default:
          break;
      }
    };

    /**
     * 根据ws的tags标签，做具体的更新动作
     */
    const updateCardByActionTags = (
      detail: DetailElement,
      tags: Array<string>
    ) => {
      if (tags.includes("name")) {
        const consistListIndex = lists.findIndex(
          (item) => item.listId == detail.listId
        );
        if (consistListIndex >= 0) {
          const cardList = lists[consistListIndex].items;
          cardList.forEach((item) => {
            if (item.cardId == detail.id) {
              item.cardname = detail.name;
            }
          });
        }
      }
    };

    getProductLabels();
    getInfo();
    return {
      store,
      isTaskOpen,
      productId,
      close,
      createTask,
      pickupTask,
      moveTask,
      pickupColumn,
      moveColumn,
      newColumnName,
      createColumn,
      height,
      height1,
      moveTaskIntoColumnEnd,
      columnsMouseMove,
      columnsMouseWheel,
      lists,
      getInfo,
      productLoading,
      editListNameById,
      openTask,
      taskClickId,
      columnName,
      deleteOneList,
      moveTaskOrColumn,
      updateList,
      updateCard,
      changeListName,
      removeExecutor,
      addExecutor,
      currentTask,
      addTag,
      removeTag,
    };
  },
});
</script>
<style lang="less" scoped>
@import url("@/components/card/scrollCss/scroll.scss");

.card-wrapper {
  width: max-content;
  height: 100%;

  .list-item {
    width: 300px;
    float: left;
    flex-direction: column;
    // flex-shrink: 0;
    display: flex;
    margin-top: 5px;
    margin-left: 20px;
    margin-right: 20px;
    background-color: rgba(@cardColorWrapper, 1);
    border-radius: 10px;
    cursor: pointer;
    padding: 10px 12px 10px 12px;
    height: auto;
    .list-title {
      cursor: pointer;
      // width: 100%;
      font-size: 23px;
      font-weight: 700;
      height: 30px;
      opacity: 1;
      padding: 10px;
      background-color: transparent;
      font-family: PingFang-Bold-2;
      border: unset;
      color: rgba(@cardTextColorMain, 1);
    }
    input:focus {
      outline: none;
      border: transparent;
    }
    input:focus-visible {
      outline: none;
      border: transparent;
    }
    .scroller-container {
      overflow-x: hidden;
      overflow-y: auto;
      max-height: 62vh;
    }
    .kanban-dropzon {
      height: 15px;
      background-color: transparent;
      border-radius: 10px;
    }
  }
  .new-button {
    background-color: transparent;
    color: rgba(@cardTextColorMain, 0.7);
    border: none;
    outline: 0;
    height: 30px;
    cursor: pointer;
    font-size: 18px;
    border-radius: 10px;
    padding: 10px;
  }
  .new-button:hover {
    background-color: rgba(@cardColorMain, 0.4);
  }
  .btn-add {
    float: left;
    margin-left: 15px;
    .add-item {
      cursor: pointer;
      height: 50px;
      font-size: 18px;
      border-radius: 10px;
      padding: 2px 10px;
      display: flex;
      align-items: center;
      width: 300px;
      background-color: rgba(@cardColorWrapper, 0.45);
      color: rgba(@cardTextColorSub, 1);
      margin-top: 5px;
      margin-right: 20px;
      border: none;
      outline: 0;
    }
    .add-item:hover {
      background-color: rgba(@cardColorMain, 0.4);
    }
  }
  .task-bg {
    position: fixed;
    width: 100vw;
    height: 100vh;
    left: 0px;
    top: 0px;
    background-color: rgba(@cardTextColorMain, 0.45);
  }
}
</style>
