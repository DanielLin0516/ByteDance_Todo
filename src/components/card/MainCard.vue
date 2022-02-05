<template>
  <div class="card-wrapper" @mousedown="columnsMouseMove" @wheel="columnsMouseWheel">
    <!-- 要渲染的列表 -->
    <div
      class="list-item"
      v-for="(column, index) of lists"
      :key="column.listId"
      draggable="true"
      @drop="moveColumn($event, index)"
      @dragover.prevent
      @dragenter.prevent
      @dragstart.self="pickupColumn($event, column.listId, index)"
    >
      <!-- 列表标题 -->
      <a-row justify="space-between" align="center">
        <a-col :span="21">
          <a-input
            class="list-title"
            size="large"
            :default-value="column.listName"
            @press-enter="editListNameById(column.listId, index, $event)"
          />
        </a-col>
        <a-col :span="3" style="display: flex; justify-content: flex-end">
          <a-popconfirm
            content="将此列表进行删除？"
            okText="确认"
            cancelText="取消"
            @ok="deleteOneList(column.listId, index)"
          >
            <icon-close-circle :style="{ fontSize: '20px', color: '#696969' }"
          /></a-popconfirm>
        </a-col>
      </a-row>
      <!-- 列表卡片栏也要渲染 -->
      <!-- 列表任务栏也要渲染 -->
      <CardItem
        v-for="task of column.items"
        :key="task.cardId"
        draggable="true"
        :cardInfo="task"
        :columnId="column.listId.toString()"
        @click="openTask(task.cardId, column)"
        @dragstart.stop="pickupTask($event, task.cardId, column.listId)"
        @dragover.prevent
        @dragenter.prevent
        @drop.stop="
          moveTaskOrColumn($event, column.items, task.cardId, column.listId)
        "
      >
      </CardItem>
      <!-- <div
        v-for="task of column.items"
        :key="task.cardId"
        draggable="true"
        @dragstart="pickupTask($event, task.cardId, column.listId)"
        @dragover.prevent
        @dragenter.prevent
        @drop.stop="
          moveTaskOrColumn($event, column.items, task.cardId, column.listId)
        "
      >
        <div class="card-menu">
          {{ task.cardname }}
          <div class="des">{{ task.description }}</div>

          <div
            v-if="task.time.timePeriod"
            :class="time"
            @click.prevent.stop="done"
          >
            <div class="time1">
              <div>{{ task.time.timePeriod[0] }}</div>
              <div>{{ task.time.timePeriod[1] }}</div>
            </div>
            <icon-schedule class="time2" />

          </div>
>>>>>>> 05a469848d05ac35a96c4fc116a954549a9610ab
        </div>
        <div
          class="kanban-dropzon"
          @dragover.prevent="height($event)"
          @dragleave.prevent="height1($event)"
          @drop="height1($event)"
        ></div>
      </div> -->
      <!-- 添加卡片按钮 -->
      <input
        class="new-button"
        type="text"
        placeholder="+ 添加任务"
        @keyup.enter="createTask($event, column.items)"
      />
    </div>
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
      <Task :id="taskClickId.toString()" :columnName="columnName" @close="close"></Task>
    </div>
  </div>
</template>

<script lang="ts">
import "animate.css";
import { getTimeStamp, PosType, getPos } from "../../store/utils";
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
  onMounted,
  getCurrentInstance,
} from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { ProductShowElement } from "@/axios/globalInterface";
import { useRequest } from "@/hooks/useRequest";
import {
  getProductInfo,
  owner,
  createList,
  editListName,
  deleteListById,
  moveList,
} from "@/axios/api";
import { Message } from "@arco-design/web-vue";
import { getCipherInfo } from "crypto";
import { title } from "process";
import CardItem from "./CardItem.vue";
import Task from "./Task.vue";
export default defineComponent({
  name: "MainCard",
  components: {
    IconPlus,
    TransitionGroup,
    IconSchedule,
    CardItem,
    Task,
    IconCloseCircle,
  },
  // props: {
  //   lists: {
  //     type: Array as PropType<ProductShowElement[]>,
  //     required: true,
  //   },
  // },
  provide() {
    return {
      // columnName:
    };
  },
  emits: ["loadingOver"],
  setup(props, context) {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const newColumnName = ref("");
    const taskClickId = ref(1);
    const columnName = ref("1");
    const isTaskOpen = ref(false);
    let cur = ref(true);
    const time = computed(() => {
      return {
        time: true,
        timedone: !cur.value,
      };
    });
    const done = () => {
      cur.value = !cur.value;
    };

    // 记录移动之前列的id
    const fromListId = ref(NaN);
    // 记录移动之前列的index值
    const fromListIndex = ref(NaN);

    // 传给MainCard的列数组
    const lists = reactive<ProductShowElement[]>([]);
    // 路由中的项目Id
    const productId = computed(() => {
      return route.params.productId;
    });
    // useRequest钩子
    const {
      data,
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
        context.emit("loadingOver", bgcColor);
      } catch (error) {
        console.trace(error);
      }
    }
    /**
     * 工具函数 获取当前column的name
     * @param e
     */
    const getCurColumnName = (e: any) => {
      if (e.currentTarget.parentElement.className == "card-wrapper") {
        return e.currentTarget.firstElementChild.innerHTML;
      } else {
        return e.currentTarget.parentElement.firstElementChild.innerHTML;
      }
    };
    const goToTask = (task: { id: any }, columnID: string) => {
      router.push({ name: "task", params: { cid: columnID, id: task.id } });
    };
    const close = () => {
      isTaskOpen.value = false;
      // router.push({ name: "Layout/Board" });
    };
    const createTask = (e: any, tasks: any) => {
      var timestamp = getTimeStamp();
      const curColumnName = getCurColumnName(e);
      const createAction = {
        username: "没想好叫啥",
        actionTime: timestamp,
        action: "在" + curColumnName + "中创建了这张卡",
      };
      store.commit("CREATE_TASK", {
        tasks,
        createAction,
        content: e.target.value,
      });
      e.target.value = "";
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
      const temp: ProductShowElement = {
        listName: "",
        listId: 0,
        productId: 0,
        closed: false,
        pos: 0,
        items: [],
      };
      Object.assign(temp, res);
      lists.push(temp);
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
      lists.splice(index, 1);
    };
    const pickupTask = (e: DragEvent, taskIndex: any, fromColumnIndex: any) => {
      console.log("卡片移动中");
      // e.dataTransfer.effctAllowed = "move";
      // e.dataTransfer.dropEffect = "move";
      // e.dataTransfer.setData("from-task-index", taskIndex);
      // e.dataTransfer.setData("from-column-index", fromColumnIndex);
      // e.dataTransfer.setData("type", "task");
      // e.dataTransfer.setData("from-column-name", getCurColumnName(e));
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
    };
    const moveTaskOrColumn = (
      e: DragEvent,
      toTasks: any,
      toColumnIndex: any,
      toTaskIndex: any
    ) => {
      console.log(e);
      const type = e.dataTransfer?.getData("type");
      console.log(toColumnIndex);
      if (type === "task") {
        // moveTask(
        //   e,
        //   toTasks,
        //   toTaskIndex !== "undefined" ? toTaskIndex : toTasks.length
        // );
        console.log("task");
      } else {
        console.log("column");
        // moveColumn(e, toColumnIndex);
      }
    };
    const moveTask = (e: any, toTasks: any, toTaskIndex?: any) => {
      const fromColumnIndex = e.dataTransfer.getData("from-column-index");
      const fromTasks = store.state.lists[fromColumnIndex].items;
      const fromTaskIndex = e.dataTransfer.getData("from-task-index");
      const toTaskColumnName = getCurColumnName(e);
      const fromTaskColumnName = e.dataTransfer.getData("from-column-name");
      store.commit("MOVE_TASK", {
        fromTasks,
        fromTaskIndex,
        toTasks,
        toTaskIndex,
        toTaskColumnName,
        fromTaskColumnName,
      });
    };

    /**
     * 移动列
     * @param e
     * @param toColumnId
     * @param toColumnIndex
     */
    const moveColumn = (e: DragEvent, toColumnIndex: number) => {
      const len = lists.length;
      // 判断移动方向
      const direction = fromListIndex.value < toColumnIndex ? "right" : "left";
      // 原地移动直接return
      if (fromListIndex.value === toColumnIndex) {
        return;
      }
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

      const id = fromListId.value;

      moveList({ listId: id, pos: newPos });
    };

    const height = (e: any) => {
      e.target.style.height = "4vw";
      e.target.style.border = "1px solid grey";
    };
    const height1 = (e: any) => {
      e.target.style.height = "10px";
      e.target.style.border = "";
    };
    const columnsMouseMove = (e: MouseEvent) => {
      const el = e.target as HTMLDivElement;
      const elp = el.parentElement as HTMLDivElement;

      const startPosition = e.clientX;
      const startScroll = elp.scrollLeft;

      if (!el.classList.contains("card-wrapper")) return;

      const onMouseMove = (e: MouseEvent) => {
        const diff = e.clientX - startPosition;
        elp.scrollLeft = startScroll - diff;
      };
      const onMouseUp = () => {
        el.removeEventListener("mousemove", onMouseMove);
      };
      el.addEventListener("mousemove", onMouseMove);
      el.addEventListener("mouseup", onMouseUp);
    };
    const columnsMouseWheel = (e: WheelEvent) => {
      const el = e.target as HTMLDivElement;
      if (!el.classList.contains("card-wrapper")) return;
      const flag = ("" + e.deltaY)[0];
      let elP = el.parentElement as HTMLDivElement;
      flag === "1" ? (elP.scrollLeft += 30) : (elP.scrollLeft -= 50);
    };
    const openTask = (cardId: number, column: ProductShowElement) => {
      taskClickId.value = cardId;
      columnName.value = column.listName;
      isTaskOpen.value = true;
    };
    getInfo();
    return {
      store,
      isTaskOpen,
      goToTask,
      close,
      createTask,
      pickupTask,
      moveTask,
      pickupColumn,
      moveColumn,
      moveTaskOrColumn,
      newColumnName,
      createColumn,
      height,
      height1,
      time,
      done,
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
    };
  },
});
</script>
<style lang="less" scoped>
@import url("./scrollCss/scroll.scss");

.card-wrapper {
  width: max-content;
  height: 100%;

  .list-item {
    overflow-x: hidden;
    overflow-y: visible;
    max-height: 630px;
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
    .list-title {
      cursor: pointer;
      // width: 100%;
      height: 40px;
      opacity: 1;
      padding: 10px;

      font-family: PingFang-Bold-2;
      :deep(.arco-input-size-large) {
        font-size: 22px;
      }
    }
    :deep(.arco-input-wrapper) {
      background-color: transparent;
    }
    :deep(.arco-input-wrapper:focus-within) {
      border-color: rgba(@cardColorMain, 0.4);
    }
    :deep(.arco-input-wrapper.arco-input-focus) {
      background-color: rgba(@cardColorMain, 0.4);
    }
    .card-menu {
      height: auto;
      // width: 100%;
      background-color: rgba(@cardColorMain, 1);
      padding: 10px;
      margin-top: 5px;
      margin-bottom: 5px;
      border-radius: 10px;
      box-shadow: 4px 2px 2px 1px rgba(@cardTextColorMain, 0.2);
      cursor: pointer;
      font-size: 18px;
      border-bottom: 2px solid rgba(@cardTextColorSub, 0.45);
      .des {
        font-size: 12px;
        color: rgba(@cardTextColorMain, 0.5);
        margin-top: 5px;
        font-style: italic;
      }
      .time {
        margin-top: 10px;
        display: flex;
        font-size: 12px;
        width: 200px;
        align-items: center;
        background-color: rgb(242, 214, 0);
        padding: 5px;
        border-radius: 10px;
        color: rgba(@cardColorMain, 1);
        .time1 {
          display: flex;
          flex-direction: column;
        }
        .time2 {
          height: 30px;
          width: 30px;
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
    .card-menu:hover {
      background-color: rgba(@cardColorMain, 0.45);
    }
    .kanban-dropzon {
      height: 8px;
      background-color: transparent;
      border-radius: 10px;
    }
  }
  .new-button {
    background-color: transparent;
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