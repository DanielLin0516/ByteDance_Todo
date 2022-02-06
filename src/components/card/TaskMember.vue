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
      <div ref="addSpan">
        <p>建议的成员</p>
        <p @click="suggestMember" class="new_label">
          {{ currentUser.fullname }}
        </p>
      </div>
      <p>看板成员</p>
      <div class="members">
        <div
          class="label"
          v-for="(user, index) in mermberList"
          :key="user.userId + index"
          data-choosed="false"
          @click="chooseMember($event, user)"
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
    const currentUser = store.state.currentUserInfo;
    const productId = ref(Number(route.params.productId));
    const searchValue = ref("");
    const mermberList: UserElement[] = reactive([]);
    const cardId: number = inject("taskId") as number;

    const close = () => {
      context.emit("close");
    };
    const searchMember = () => {
      console.log(searchValue.value);
    };
    const suggestMember = () => {
      console.log("suggestMember");
    };

    const chooseMember = async (e: MouseEvent, user: UserElement) => {
      const el = e.target as HTMLDivElement;
      const userId = user.userId;

      if (el.dataset.choosed === "false") {
        el.classList.add("choosed");
        el.dataset.choosed = "true";
        if (userId == currentUser.userId) {
          console.log(addSpan.value);

          addSpan.value.style.display = "none";
        }
        await setExecutorApi(cardId, userId);
      } else {
        el.classList.remove("choosed");
        el.dataset.choosed = "false";
        addSpan.value.style.display = "block";
        await deleteExecutorApi(cardId, userId);
      }
    };

    interface webMember extends UserElement {}
    const getMemberList = async (productId: number) => {
      const res = await getMemberListApi(productId);
      console.log(res);
      res.forEach((el) => {
        mermberList.push(el);
      });
    };
    getMemberList(productId.value);

    return {
      mermberList,
      searchValue,
      currentUser,
      addSpan,

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