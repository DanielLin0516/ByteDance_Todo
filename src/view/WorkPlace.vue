<template>
  <div class="back">
    <div class="left-bar">
      <div class="first">
        <icon-select-all class="icon" />
        <span>看板</span>
      </div>
    </div>

    <div class="right">
      <!-- <a-skeleton v-if="loading" :animation="true" style="opacity: 0.6">
        <a-space direction="vertical" :style="{ width: '80%' }" size="large">
          <a-skeleton-line :rows="8" class="row" />
        </a-space>
      </a-skeleton> -->
      <div class="loading" v-if="loading">
        <a-spin dot :loading="loading" :size="30" />
      </div>

      <div v-else>
        <div class="work">
          <span class="work-title">您创建的项目</span>
          <div class="project">
            <div
              class="item"
              :style="{ background: product.background }"
              v-for="product in productList"
              :key="product.id"
              @click.self="enterInto(product.id)"
            >
              <div @click.self="enterInto(product.id)" class="product-name">
                {{ product.productName }}
              </div>
              <a-popconfirm content="删除此项目?" @ok="deleteItem(product.id)">
                <icon-delete class="delete" />
              </a-popconfirm>
            </div>
            <!-- 创建看板 -->
            <div class="create" @click="create">创建新看板</div>
          </div>
        </div>
        <div v-if="show" class="creat-project">
          <span>
            创建看板
            <icon-close-circle class="close" @click="show = !show" />
          </span>
          <div class="square" :style="{ background: upSquare }"></div>
          <div class="back-ground">
            <div class="content">背景</div>
            <div class="color-choose">
              <div
                class="choose"
                :style="{ background: choose.color }"
                v-for="choose in color"
                :key="choose.id"
                @click="yourChoice(choose.color)"
              ></div>
            </div>
            <div
              style="
                font-size: 0.833vw;
                color: rgb(103, 117, 139);
                margin-top: 1vw;
              "
            >
              看板标题
            </div>
            <input
              type="text"
              placeholder="输入看板标题（必填项）"
              class="title"
              v-model="title"
            />
            <a-button
              type="primary"
              :disabled="build"
              style="
                margin-top: 2vw;
                width: 100%;
                border-radius: 1vw;
                height: 3vw;
              "
              @click="send"
              >创建</a-button
            >
          </div>
        </div>
        <div class="join">
          <span class="work-title">参与的项目</span>
          <div class="part">
            <div
              class="parttime"
              :style="{ background: join.background }"
              v-for="join in shareProductList"
              :key="join.id"
              @click="enterInto(join.id)"
            >
              {{ join.productName }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Message } from "@arco-design/web-vue";
import {
  IconSelectAll,
  IconCloseCircle,
  IconDelete,
} from "@arco-design/web-vue/es/icon";
import {
  computed,
  defineComponent,
  onBeforeUpdate,
  onMounted,
  reactive,
  ref,
  watch,
} from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { getProduct, createProduct, deleteProject } from "@/axios/api";
import { ProductElement } from "@/axios/globalInterface";
import { useRequest } from "@/hooks/useRequest";
export default defineComponent({
  name: "App",
  components: {
    IconSelectAll,
    IconCloseCircle,
    IconDelete,
  },
  setup() {
    const store = useStore();
    let show = ref(false);
    let build = ref(true);
    let router = useRouter();
    let upSquare = ref(String("#0079BF"));
    let color = reactive([
      {
        id: 1,
        color: "#0079BF",
      },
      {
        id: 2,
        color: "#D29034",
      },
      {
        id: 3,
        color: "#519839",
      },
      {
        id: 4,
        color: "#B04632",
      },
      {
        id: 5,
        color: "#755286",
      },
      {
        id: 6,
        color: "#FFFF00",
      },
      {
        id: 7,
        color: "#00FF00",
      },
      {
        id: 8,
        color: "#61bd4f",
      },
      {
        id: 9,
        color: "#f5de33",
      },
      {
        id: 10,
        color: "#ff9f1a",
      },
      {
        id: 11,
        color: "#eb5a46",
      },
      {
        id: 12,
        color: "#c377e0",
      },
      {
        id: 13,
        color: "#0079bf",
      },
      {
        id: 14,
        color: "#00c2e0",
      },
      {
        id: 15,
        color: "#51e898",
      },
      {
        id: 16,
        color: "#ff78cb",
      },
      {
        id: 17,
        color: "#344563",
      },
      {
        id: 18,
        color: "#b3bac5",
      },
    ]);
    const title = ref("");
    let data = JSON.parse(localStorage.getItem("user"));
    let url = localStorage.getItem("url");
    onMounted(() => {
      if (url && data && data.userId === 0) {
        data.userId = store.state.currentUserInfo.userId;
        router.push({
          name: "Invite",
          params: { productId: data.productId, link: url },
        });
        localStorage.removeItem("user");
        localStorage.removeItem("url");
      }
    }),
      watch(title, () => {
        if (title.value) {
          build.value = false;
        } else {
          build.value = true;
        }
      });
    const enterInto = (id: string) => {
      router.push({ name: "Board", params: { productId: id } });
    };
    const yourChoice = (c: string) => {
      upSquare.value = c;
    };
    const productList: ProductElement[] = reactive([]);
    const shareProductList: ProductElement[] = reactive([]);
    async function deleteItem(id: String) {
      try {
        await deleteProject(id);
        Message.success({ content: `删除成功！` });
        let res = await getProduct();
        productList.length = 0;
        shareProductList.length = 0;
        res.productList.forEach((item) => {
          productList.push(item);
        });
        res.shareProductList.forEach((item) => {
          shareProductList.push(item);
        });
        store.commit("setProductList", res.productList);
        store.commit("setShareProductList", res.shareProductList);
      } catch (error) {
        console.trace(error);
      }
    }
    const create = () => {
      show.value = !show.value;
    };
    let obj = reactive({
      background: upSquare,
      description: "",
      isPrivate: true,
      ownerId: NaN,
      productName: title,
    });
    async function send() {
      try {
        obj.ownerId = store.state.currentUserInfo.userId;
        let res = await createProduct(obj);
        const productRes = await getProduct();
        // Vue3中清空响应式数组唯一方法
        productList.length = 0;
        shareProductList.length = 0;
        productRes.productList.forEach((item) => {
          productList.push(item);
        });
        productRes.shareProductList.forEach((item) => {
          shareProductList.push(item);
        });
        Message.success({ content: "创建成功" });
        store.commit("setProductList", productRes.productList);
        store.commit("setShareProductList", productRes.shareProductList);
        router.push({
          name: "Board",
          params: { productId: res.id },
        });
      } catch (error) {
        // Message.error({ content: `${error}` });
        console.trace(error);
      }
    }
    const { loading, error, run } = useRequest(getProduct, {
      onError: () => {
        console.trace(error);
      },
    });
    run().then((res) => {
      res.productList.forEach((item) => {
        productList.push(item);
      });
      res.shareProductList.forEach((item) => {
        shareProductList.push(item);
      });
      store.commit("setProductList", res.productList);
      store.commit("setShareProductList", res.shareProductList);
    });
    return {
      create,
      show,
      color,
      yourChoice,
      productList,
      shareProductList,
      upSquare,
      build,
      title,
      store,
      send,
      deleteItem,
      enterInto,
      loading,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/components/card/scrollCss/scroll.scss";
.back {
  height: calc(100vh - 80px);
  width: 100vw;
  display: flex;
  background: -webkit-linear-gradient(bottom, #ffffff, #a9c1ed);
  .left-bar {
    display: inline-block;
    margin-left: 120px;
    margin-top: 50px;
    // width: 350px;
    flex: 1;
    height: 300px;
    padding: 10px;
    // float:left
    .first {
      display: flex;
      align-items: center;
      background-color: rgb(228, 240, 246);
      border-radius: 10px;
      padding: 10px;
      .icon {
        height: 30px;
        width: 30px;
        margin-right: 10px;
        color: rgb(0, 121, 191);
      }
      span {
        font-size: 24px;
        color: rgb(0, 121, 191);
        font-weight: 900;
      }
    }
  }
  .work-title {
    font-size: 26px;
    color: rgb(62, 66, 73);
  }
  .right {
    // width: 100%;
    flex: 6;
    display: flex;
    flex-direction: column;
    overflow-y: visible;
    // background-color:red;
    .loading {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 78vh;
      transform: translateX(-80px);
    }
    .work {
      display: flex;
      flex-direction: column;
      width: 90%;
      height: auto;
      padding-top: 60px;
      padding-left: 80px;
      .project {
        margin-top: 30px;
        // width:700px;
        flex-wrap: wrap;
        // height: 200px;
        display: flex;
        width: 100%;
        // padding: 20px;
        .item {
          width: 230px;
          height: 150px;
          font-weight: 900;
          font-size: 24px;
          border-radius: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-right: 20px;
          cursor: pointer;
          margin-bottom: 20px;
          position: relative;
          transition: box-shadow, 500, cubic-bezier(0, 0, 1, 1);
          .product-name {
            color: white;
          }
          .delete {
            position: absolute;
            right: 10px;
            bottom: 10px;
            padding: 5px;
            color: white;
          }
          .delete:hover {
            color: black;
          }
        }
        .item:hover {
          box-shadow: 0 4px 10px #cccccc;
        }
        .create {
          width: 230px;
          height: 150px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: rgb(240, 242, 245);
          border-radius: 10px;
          cursor: pointer;
          margin-bottom: 20px;
        }
        .create:hover {
          background-color: rgb(231, 233, 237);
        }
      }
    }
    .creat-project {
      position: absolute;
      top: 205px;
      right: 5.3%;
      width: 330px;
      // height: 500px;
      background-color: white;
      // border:1px solid rgb(103,117,139);
      border-radius: 10px;
      padding: 10px;
      box-shadow: 0 8px 16px -4px rgb(9 30 66 / 25%),
        0 0 0 1px rgb(9 30 66 / 8%);
      span {
        display: inline-block;
        position: relative;
        padding: 10px;
        font-size: 24px;
        width: calc(100% - 20px);
        text-align: center;
        color: rgb(103, 117, 139);
        border-bottom: 1px solid rgb(0, 121, 191);
        .close {
          position: absolute;
          right: 0px;
          height: 36px;
          width: 36px;
          border-radius: 50%;
          cursor: pointer;
        }
        .close:hover {
          background-color: rgb(231, 233, 237);
        }
      }
      .square {
        height: 100px;
        width: 200px;
        background: #0079bf;
        margin: 20px auto;
        border-radius: 10px;
      }
      .back-ground {
        width: 100%;
        .content {
          font-size: 16px;
          color: rgb(103, 117, 139);
        }
        .color-choose {
          margin-top: 10px;
          display: flex;
          flex-wrap: wrap;
          .choose {
            width: 72px;
            height: 30px;
            margin-right: 10px;
            border-radius: 5px;
            margin-bottom: 10px;
            cursor: pointer;
          }
        }
        .title {
          outline: none;
          margin-top: 10px;
          line-height: 20px;
          font-weight: 400;
          padding: 8px;
          width: calc(100% - 24px);
          color: #172b4d;
          border: 3px solid rgb(223, 225, 230);
        }
        .enter {
          width: 100%;
          height: 50px;
          background-color: rgb(0, 121, 191);
          color: white;
          cursor: pointer;
          text-align: center;
          margin-top: 3vw;
          border-radius: 10px;
        }
        .enter:hover {
          background-color: rgb(2, 106, 167);
        }
      }
    }
    .join {
      display: flex;
      flex-direction: column;
      width: 900px;
      padding-top: 30px;
      padding-left: 80px;
      .part {
        margin-top: 30px;
        height: 400px;
        display: flex;
        width: 1100px;
        flex-wrap: wrap;
        overflow: auto;
        .parttime {
          width: 230px;
          height: 150px;
          flex-shrink: 0;
          margin-bottom: 30px;
          color: white;
          font-weight: 900;
          font-size: 24px;
          border-radius: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-right: 20px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
