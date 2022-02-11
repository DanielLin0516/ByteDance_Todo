<template>
  <div class="outer">
    <div class="header">
      <h2>标签</h2>
      <IconCloseCircle @click.prevent="close" class="icon-close" />
    </div>
    <a-input
      :style="{ width: '100%' }"
      v-model="searchValue"
      placeholder="搜索成员~"
      @input="searchMember"
      allow-clear
    />
    <div>
      <!-- <div ref="addSpan"> -->
      <div v-show="isSuggest">
        <h3>建议的成员</h3>
        <p @click="suggestMember" class="new_label">
          {{ currentUser.fullname }}
        </p>
      </div>
      <h3>看板成员</h3>
      <div class="members">
        <div
          class="label"
          :style="{ background: user.avatar }"
          v-for="(user, index) in mermberList"
          v-show="user.isShow"
          :class="{ choosed: user.isChoosed }"
          :key="user.userId + index"
          @click="clickMember(user, index)"
        >
          {{ user.fullname }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  IconCloseCircle,
  IconPenFill,
  IconLeft,
} from "@arco-design/web-vue/es/icon";
import {
  getMemberListApi,
  setExecutorApi,
  deleteExecutorApi,
} from "@/axios/labelApi";
import { CardElement, UserElement } from "@/axios/globalInterface";
import {
  defineComponent,
  inject,
  ref,
  reactive,
  computed,
  ComputedRef,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
export default defineComponent({
  components: {
    IconCloseCircle,
  },
  // inheritAttrs: false,
  emits: ["close"],
  setup(props, context) {
    // console.log("taskMember--context.attrs", {
    //   ...context.attrs,
    // });

    const route = useRoute();
    const store = useStore();
    const addSpan = ref(null);
    const isSuggest = ref(true);
    const currentUser = store.state.currentUserInfo;
    const productId = ref(Number(route.params.productId));
    const task: ComputedRef<CardElement> = computed(() => {
      return context.attrs.taskInfo as CardElement;
    });
    const currentMembers: UserElement[] =
      task.value == null ? [] : task.value.executorList;
    const searchValue = ref("");
    const cardId: number = inject("cardId") as number;

    interface webMember extends UserElement {
      isShow: boolean;
      isChoosed: boolean;
    }
    const mermberList: webMember[] = reactive([]);
    const close = () => context.emit("close");

    const searchMember = () => {
      if (!searchValue.value) {
        mermberList.forEach((el) => (el.isShow = true));
        return;
      }
      mermberList.forEach((el) => (el.isShow = false));
      mermberList.forEach((el) => {
        if (el.fullname.includes(searchValue.value)) {
          el.isShow = true;
        }
      });
    };
    const suggestMember = () => {
      const index = mermberList.findIndex(
        (el) => el.userId == currentUser.userId
      );
      clickMember(currentUser, index);
    };

    const clickMember = async (user: webMember, index: number) => {
      const userId = user.userId;
      const flag = mermberList[index].isChoosed;
      if (!flag) {
        //添加到被选中的最后一个的后一个
        const firstNotChoosed = mermberList.findIndex((el) => !el.isChoosed);
        console.log(firstNotChoosed);
        mermberList[index].isChoosed = true;

        const tempObj = mermberList.splice(index, 1)[0];
        mermberList.splice(firstNotChoosed, 0, tempObj);
        //如果是推荐人，
        if (userId == currentUser.userId) {
          isSuggest.value = false;
        }
        //可能是搜索出来的
        searchValue.value = "";
        searchMember();
        //后端接口
        await setExecutorApi(cardId, userId);
      } else {
        mermberList[index].isChoosed = false;
        if (userId == currentUser.userId) {
          isSuggest.value = true;
        }
        //后端接口
        await deleteExecutorApi(cardId, userId);
      }
    };

    const getMemberList = async (productId: number) => {
      const res = await getMemberListApi(productId);
      res.forEach((el) => {
        if (currentMembers.some((curEl) => curEl.userId === el.userId)) {
          mermberList.push(
            Object.assign(el, {
              isShow: true,
              isChoosed: true,
            })
          );
          //判断是否是建议的成员
          if (el.userId == currentUser.userId) {
            isSuggest.value = false;
          }
        } else {
          mermberList.push(
            Object.assign(el, {
              isShow: true,
              isChoosed: false,
            })
          );
        }
      });
    };
    getMemberList(productId.value);

    return {
      mermberList,
      searchValue,
      currentUser,
      addSpan,
      isSuggest,

      searchMember,
      suggestMember,
      close,
      clickMember,
    };
  },
});
</script>

<style lang="less" scoped>
.outer {
  position: absolute;
  width: 350px;
  max-height: 100%;
  padding: 10px 20px;
  top: 0px;
  right: -200px;

  display: flex;
  flex-direction: column;

  border-radius: 5px;
  background-color: rgba(@cardColorMain, 1);
  color: rgba(@cardTextColorMain, 0.5);
  box-shadow: 0px 0px 6px gray;
  z-index: 999;

  .header {
    position: relative;
    line-height: 15px;
    width: 100%;
    display: inline-grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 0.26042vw;
    border-bottom: 1px solid rgba(0, 0, 0, 0.3);
    padding-bottom: 0.52083vw;
    justify-items: center;
    align-items: center;
    align-content: stretch;

    h2 {
      grid-column: 2 / 3;
      background-color: rgba(@cardColorMain, 1);
      color: rgba(@cardTextColorMain, 0.7);
    }

    h3 {
      font-size: smaller;
    }
    .icon-close {
      position: absolute;
      right: 0;

      height: 40px;
      width: 40px;
      right: 0;
      border-radius: 50%;
      color: rgba(@cardTextColorMain, 0.5);
      transition: all 0.2s;

      &:hover {
        cursor: pointer;
        background-color: rgba(@cardTextColorMain, 0.1);
        transition: all 0.2s;
      }
    }
  }

  .members {
    max-height: 40vh;

    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-gap: 5px;
    grid-auto-rows: minmax(20px, auto);
    justify-items: center;
    p {
      width: 100px;
    }
    .label {
      position: relative;
      // display: flex;
      line-height: 70px;
      text-align: center;
      width: 70px;
      color: white;
      border-radius: 50%;
      user-select: none;
      font-weight: 1000;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      // background: url(https://joeschmoe.io/api/v1/random);

      &:hover {
        transform: scale(1.04);
        background-color: rgba(0, 0, 0, 0.2);
        cursor: pointer;
      }
    }
    .choosed {
      &::after {
        content: "✔";
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: rgba(0, 0, 0, 0.5);

        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
  .new_label {
    text-align: center;
    height: 50px;
    line-height: 50px;
    border-radius: 5px;
    background-color: rgba(0, 0, 0, 0.05);
  }
  .new_label:hover {
    background-color: rgba(0, 0, 0, 0.1);
    cursor: pointer;
  }
}
</style>