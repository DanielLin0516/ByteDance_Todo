<template>
  <div class="back">
    <div class="left-bar">
      <div class="first">
        <icon-select-all class="icon" />
        <span>看板</span>
      </div>
    </div>

    <div class="right">
      <div class="work">
        <span class="id">您创建的项目</span>
        <div class="project">
          <div
            class="item"
            :style="{ background: product.background }"
            v-for="product in productList"
            :key="product.id"
            @click.self="enterInto(product.id)"
          >
            {{ product.productName }}
            <icon-delete class="delete" @click.self="deleteItem(product.id)" />
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
              @click="yourchoice(choose.color)"
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
        <span>参与的项目</span>
        <div class="part">
          <div
            class="parttime"
            :style="{ background: join.background }"
            v-for="join in shareProductList"
            :key="join.id"
          >
            {{ join.productName }}
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
  onMounted,
  reactive,
  ref,
  watch,
} from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { getProduct, createProduct, deleteProject } from "../../axios/api";
import { ProductElement } from "@/axios/globalInterface";

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
    ]);
    const title = ref("");
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
    let yourchoice = (c: string) => {
      upSquare.value = c;
    };

    const productList: ProductElement[] = reactive([]);
    const shareProductList: ProductElement[] = reactive([]);

    async function deleteItem(id: String) {
      try {
        await deleteProject(id);
        Message.success({ content: `删除成功！` });
        let res = await getProduct();
        store.state.productList = res.productList;
        store.state.shareProductList = res.shareProductList;
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
      ownerId: store.state.userId,
      productName: title,
    });
    async function send() {
      try {
        obj.ownerId = store.state.userId;
        let res = await createProduct(obj);
        store.state.productId = res.id;
        Message.success({ content: "创建成功" });
        getProduct().then((res) => {
          store.state.productList = res.productList;
          store.state.shareProductList = res.shareProductList;
        });
        router.push({
          name: "Board",
          params: { productId: store.state.productId },
        });
      } catch (error) {
        Message.error({ content: `${error}` });
      }
    }

    onMounted(() => {
      getProduct().then((res) => {
        res.productList.forEach((item) => {
          productList.push(item);
        });
        res.shareProductList.forEach((item) => {
          shareProductList.push(item);
        });
        store.state.productList = res.productList;
        store.state.shareProductList = res.shareProductList;
      });
    });
    return {
      create,
      show,
      color,
      yourchoice,
      productList,
      shareProductList,
      upSquare,
      build,
      title,
      store,
      send,
      deleteItem,
      enterInto,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "./WorkPlace.scss";
</style>
