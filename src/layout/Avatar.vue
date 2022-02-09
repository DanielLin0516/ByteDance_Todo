<template>
  <a-space :size="32">
    <a-avatar-group>
      <a-avatar
        :style="{ background: item.avatar }"
        v-for="item of member"
        :key="item.userId"
        v-show="member.length != 0"
      >
        {{ item.fullname.slice(0, 1) }}
        <template #trigger-icon>
          <a-popover position="bottom">
            <icon-user :style="{ color: item.avatar }" />
            <template #content>
              <div class="userInfo">
                <div class="info-header">
                  <span>账号</span>
                </div>
                <div class="center">
                  <a-avatar :style="{ backgroundColor: item.avatar }" class="info">
                    <IconUser />
                  </a-avatar>
                  <div
                    style="
                      display: flex;
                      flex-direction: column;
                      margin-left: 1vw;
                    "
                  >
                    <div>{{ item.fullname }}</div>
                    <div
                      style="
                        color: rgb(197, 202, 210);
                        font-size: 12px;
                        margin-top: 0.5vw;
                      "
                    >{{ item.username }}</div>
                  </div>
                </div>
              </div>
            </template>
          </a-popover>
        </template>
      </a-avatar>
    </a-avatar-group>
  </a-space>
</template>
<script lang="ts">
import { defineComponent, computed, onMounted, ComputedRef } from "vue";
import { useStore } from "vuex";
import { UserElement } from "@/axios/globalInterface";
import { IconUser } from "@arco-design/web-vue/es/icon";
export default defineComponent({
  name: "Avatar",
  components: { IconUser },
  setup() {
    const store = useStore();

    const member: ComputedRef<UserElement[]> = computed(() => {
      return store.state.memberList;
    });

    return {
      member,
    };
  },
});
</script>

<style lang="less" scoped>
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
</style>
