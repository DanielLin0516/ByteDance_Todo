<template>
  <div
    class="card-wrapper"
    @mousedown="columnsMouseMove"
    @wheel="columnsMouseWheel"
  >
    <!-- 要渲染的列表 -->
    <transition-group
      name="animate__list"
      enter-active-class="animate__animated animate__fadeIn animate__faster"
      leave-active-class="animate__animated animate__zoomOut animate__faster"
    >
      <div
        class="list-item"
        id="new2"
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
              @change="changeListName(column.listId, index, $event)"
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
            enter-active-class="animate__animated animate__bounceIn animate__faster"
            leave-active-class="animate__animated animate__zoomOut animate__faster"
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
      <Task
        :id="taskClickId.toString()"
        :columnName="columnName"
        @close="close"
        :lists="lists"
        :taskInfo="currentTask"
      ></Task>
    </div>
    <div class="task-bg" v-if="isNew" @click.self="closeNew">
      <div class="cardNew">
        <a-card :style="{ width: '360px' }" title="新手指南">
          <div class="cardButtons">
            <a-button @click="changeOldUser">老玩家你懂吗？</a-button>
            <a-button @click="guide">开启新手指南</a-button>
          </div>
        </a-card>
      </div>
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
  PosType,
  getPos,
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
  onBeforeUnmount,
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
  changeUserState
} from "@/axios/api";
import { Message } from "@arco-design/web-vue";
import CardItem from "@/components/card/CardItem.vue";
import Task from "@/components/card/Task.vue";
import Websocket from "@/components/websocket/Websocket.vue";
import Driver from 'driver.js' // import driver.js
import 'driver.js/dist/driver.min.css' // import driver.js css
import {
  onMounted,
} from "vue";
import steps from "@/utils/driver"
import LoginVue from "@/view/Login.vue";
import { log } from "console";
import { nextTick } from "process";

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
    let newColumnName = ref("");
    const taskClickId = ref(NaN);
    const columnName = ref("");
    const isTaskOpen = ref(false);
    const isNew = ref(false);
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

    const labelList: TagElement[] = reactive([]);

    // 请求失败进行重新拉取
    const fetchTimer = ref<NodeJS.Timeout>();

    // 路由中的项目Id
    const productId: ComputedRef<string> = computed(() => {
      return route.params.productId as string;
    });
    console.log('productId',productId);
    const curisNew: ComputedRef<boolean> = computed(() => {

      return store.state.currentUserInfo.isNews;
    });
    console.log('curisNew',curisNew);
    
    // 获取当前用户信息
    if(curisNew.value) {
      isNew.value = true
    }
    // steps
    const steps = [
    {
       element: '#new1',
       popover: {
         title: '编辑项目',
         description: '在此导航栏，您可以邀请朋友一起使用项目，修改项目名称，项目颜色',
         position: 'bottom'
      },
      onNext: () => {
        driver.preventMove();
        newColumnName.value = 'Test';
        async function createTestColumn() {
          const res = await createColumn()
          await createNewCard({
            cardname: 'test-card',
            listId: (await res).id,
            pos: 12002,
            productId: (await res).productId
          })//
        }
        createTestColumn()
        setTimeout(() => {
          driver.moveNext();
        }, 0);
      }
    },
    {
       element: '#new2',
       popover: {
         title: '用户信息',
         description: '在此处查看当前用户信息',//o
         position: 'left'
      },
    },
    {
        element: '#new3',
       popover: {
         title: '工作区',
         description: '在此块开始创建您的项目，我们已为您创建一个示例',
         position: 'right'
      },
    },
   ]
    // 新手指南-start
    const driver = new Driver({
      stageBackground:'rgba(100,100,100,0.3',
      opacity: 0.7,
      animate: true,
      doneBtnText: '我知道了',
      closeBtnText: '跳过', //  关闭按钮文啊ssaas
      nextBtnText: '下一步', // 下一步的按钮文案
      prevBtnText: '上一步', // 上一步的按钮文
    })
    const guide = () => {
      nextTick(()=> {
          isNew.value = false;
          console.log(123);
          driver.defineSteps(steps)
          driver.start()
        })
    }
    async function changeOldUser() {
      await changeUserState(false)
      store.commit('setIsNew', false)
      console.log(store.state.currentUserInfo.isNews);
      isNew.value = false;
    }

    // useRequest钩子
    const {
      loading: productLoading,
      error,
      run,
    } = useRequest(getProductInfo, {
      onError: () => {
        console.trace(error);
        clearInterval(Number(fetchTimer.value));
        fetchTimer.value = setTimeout(() => {
          if (productLoading.value) {
            console.log(productLoading.value);
            clearInterval(Number(fetchTimer.value));
          } else {
            console.log("项目拉取数据失败");
            getInfo();
          }
        }, 4000);
      },
    });

    //获取页面渲染数据与处理数据
    async function getInfo() {
      try {
        const res = await run(productId.value);
        const showInvite = await owner(productId.value);
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
        res.tagList.forEach((tagEl: TagElement) => {
          labelList.push(tagEl);
        });
        store.commit("setLabelList", labelList);
        clearInterval(Number(fetchTimer.value));
      } catch (error) {
        console.trace(error);
      }
    }
    /**
     * 子组件Task触发 关闭任务卡片后的处理
     * @param param
     * @returns
     */
    const close = () => {
      isTaskOpen.value = false;
    };
    const closeNew = () => {
      isNew.value = false;
    };

    /**
     * 更改列名
     * @param listId 
     * @param index 
     * @param e 
     */
    const changeListName = async (listId: number, index: number, e: any) => {
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
     * 创建新卡片
     */
    const createTask = async (
      e: KeyboardEvent,
      tasks: CardElement[],
      listId: number,
    ) => {
      console.log(e);
      
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
      return res
    };

    /**
     * 删除列表
     * @param listId
     * @param index
     */
    const deleteOneList = async (listId: number, index: number) => {
      await deleteListById(listId);
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
      //保存当前打开的task状态
      currentCardId.value = cardId;
      currentColumnId.value = column.listId;
      taskClickId.value = cardId;
      columnName.value = column.listName;
      isTaskOpen.value = true;
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
      switch (message.event) {
        case "updateModels":
          updateCardByActionTags(detail, message.tags);
          break;
        case "moveModels":
          if (message.tags.includes("same")) {
            const listIndex = lists.findIndex(
              (item) => item.listId == detail.listAfterId
            );
            if (listIndex >= 0) {
              const cardList = lists[listIndex].items;
              cardList.forEach((item) => {
                if (item.cardId == detail.id) {
                  item.pos = detail.pos;
                }
              });
              cardList.sort((a, b) => a.pos - b.pos);
            }
          } else {
            let listIndex = NaN;
            let listBeforeIndex = NaN;
            lists.forEach((item, index) => {
              if (item.listId == detail.listAfterId) {
                listIndex = index;
              }
              if (item.listId == detail.listBeforeId) {
                listBeforeIndex = index;
              }
            });
            if (listIndex >= 0) {
              const cardList = lists[listIndex].items;
              const cardBeforeList = lists[listBeforeIndex].items;
              let temp: CardElement;
              cardBeforeList.forEach((item, index) => {
                if (item.cardId == detail.id) {
                  item.pos = detail.pos;
                  temp = item;
                  cardBeforeList.splice(index, 1);
                  cardList.push(temp);
                }
              });
              cardList.sort((a, b) => a.pos - b.pos);
            }
          }
          break;
        case "removeModels":
          const listIndex = lists.findIndex(
            (item) => item.listId == detail.listAfterId
          );
          if (listIndex >= 0) {
            const cardList = lists[listIndex].items;
            cardList.forEach((item, index) => {
              if (item.cardId == detail.id) {
                cardList.splice(index, 1);
              }
            });
          }
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
      } else if (tags.includes("background")) {
        const consistListIndex = lists.findIndex(
          (item) => item.listId == detail.listId
        );
        if (consistListIndex >= 0) {
          const cardList = lists[consistListIndex].items;
          cardList.forEach((item) => {
            if (item.cardId == detail.id) {
              item.background = detail.background;
            }
          });
        }
      } else if (tags.includes("member")) {
        const consistListIndex = lists.findIndex(
          (item) => item.listId == detail.listId
        );
        if (consistListIndex >= 0) {
          const cardList = lists[consistListIndex].items;
          cardList.forEach((item) => {
            if (item.cardId == detail.id) {
              item.executorList = detail.executorList;
            }
          });
        }
      } else if (tags.includes("tags")) {
        const consistListIndex = lists.findIndex(
          (item) => item.listId == detail.listAfterId
        );
        if (consistListIndex >= 0) {
          const cardList = lists[consistListIndex].items;
          cardList.forEach((item) => {
            if (item.cardId == detail.id) {
              const newTag = {
                id: detail.tagId,
                color: detail.background,
                productId: Number(productId.value),
                tagName: detail.name,
              };
              const tagList = item.tagList;
              tags.includes("add")
                ? tagList.push(newTag)
                : tagList.forEach((tagItem, index) => {
                    tagItem.id == detail.tagId && tagList.splice(index, 1);
                  });
            }
          });
        }
      } else if (tags.includes("time")) {
        const consistListIndex = lists.findIndex(
          (item) => item.listId == detail.listId
        );
        if (consistListIndex >= 0) {
          const cardList = lists[consistListIndex].items;
          cardList.forEach((item) => {
            if (item.cardId == detail.id) {
              if (tags.includes("add")) {
                item.begintime = detail.begintime;
                item.deadline = detail.deadline;
              } else if (tags.includes("remove")) {
                item.begintime = "";
                item.deadline = "";
              } else {
                item.completed = detail.completed;
              }
            }
          });
        }
      }
    };

    onBeforeUnmount(() => {
      clearInterval(Number(fetchTimer.value));
    });
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
      openTask,
      taskClickId,
      columnName,
      deleteOneList,
      moveTaskOrColumn,
      updateList,
      updateCard,
      changeListName,
      currentTask,
      isNew,
      closeNew,
      guide,
      changeOldUser
    };
  },
});
</script>
<style lang="less" scoped>
@import url("@/components/card/scrollCss/scroll.scss");
.cardNew {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -100%);
  .cardButtons{
    padding: 20px;
    display: flex;
    justify-content: space-evenly;
  }
}
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
      width: 92%;
      font-size: 23px;
      font-weight: 400;
      height: 30px;
      opacity: 1;
      padding: 10px;
      background-color: transparent;
      font-family: PingFang-Bold-2;
      border: unset;
      color: rgba(@cardTextColorMain, 1);
    }
    .list-title:focus {
      outline: none;
      border-color: #9ecaed;
      box-shadow: 0 0 10px #9ecaed;
    }
    input:focus {
      // outline: none;
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
    z-index: 5;
  }
}
</style>
