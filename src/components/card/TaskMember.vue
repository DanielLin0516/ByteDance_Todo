<template>
  <div class="outer">
    <div class="header">
      <span>标签</span>
      <IconCloseCircle @click.self="close" class="icon-close" />
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
        <p>建议的成员</p>
        <p @click="suggestMember" class="new_label">
          {{ currentUser.fullname }}
        </p>
      </div>
      <p>看板成员</p>
      <div class="members">
        <!-- 原来的
        <div
          class="label"
          v-for="(user, index) in mermberList"
          v-show="user.isShow"
          :data-choosed="user.isChoosed"
          :key="user.userId + index"
          @click="chooseMember($event, user, index)"
        ></div> -->
        <div
          class="label"
          v-for="(user, index) in mermberList"
          v-show="user.isShow"
          :class="{ choosed: user.isChoosed }"
          :key="user.userId + index"
          @click="chooseMember(user, index)"
        >
          {{ user.fullname }}
        </div>
        <div class="label">syhsyh</div>
        <div class="label">syhsyh</div>
        <div class="label">syhsyh</div>
        <div class="label">syhsyh</div>
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
import { UserElement } from "@/axios/globalInterface";
import { defineComponent, inject, ref, reactive, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
export default defineComponent({
  components: {
    IconCloseCircle,
  },
  emits: ["close"],
  setup(props, context) {
    const route = useRoute();
    const store = useStore();
    const addSpan = ref(null);
    const isSuggest = ref(true);
    const currentUser = store.state.currentUserInfo;
    const productId = ref(Number(route.params.productId));
    const searchValue = ref("");
    const cardId: number = inject("taskId") as number;
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
      chooseMember(currentUser, index);
    };

    const chooseMember = async (user: webMember, index: number) => {
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
        await setExecutorApi(cardId, userId);
      } else {
        mermberList[index].isChoosed = false;
        if (userId == currentUser.userId) {
          isSuggest.value = true;
        }
        await deleteExecutorApi(cardId, userId);
      }
    };

    const getMemberList = async (productId: number) => {
      const res = await getMemberListApi(productId);
      res.forEach((el) => {
        mermberList.push(
          Object.assign(el, {
            isShow: true,
            isChoosed: false,
          })
        );
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
      chooseMember,
    };
  },
});
</script>

<style lang="less" scoped>
.outer {
  position: absolute;
  width: 350px;
  max-height: 100%;
  padding: 20px;
  top: 0px;
  right: -200px;

  display: flex;
  flex-direction: column;

  border-radius: 5px;
  background-color: white;
  box-shadow: 0px 0px 6px gray;
  // border-left: 1px solid rgba(0, 0, 0, 0.3);

  .header {
    position: relative;

    height: 40px;
    width: 100%;

    display: flex;
    align-items: center;
    justify-content: center;

    border-bottom: 1px solid rgba(0, 0, 0, 0.3);
    margin-bottom: 30px;

    span {
      font-size: 22px;
      height: 100%;
    }
    .icon-close {
      position: absolute;
      right: -12px;
      top: -15px;
      height: 40px;
      width: 40px;
      border-radius: 50%;
      padding: 10px;
      color: rgba(@cardTextColorMain, 0.5);
    }
    .icon-close:hover {
      cursor: pointer;
      background-color: rgba(@cardTextColorMain, 0.1);
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