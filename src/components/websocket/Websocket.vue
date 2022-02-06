<template>
  <div>
    <a-button type="primary" @click="sendDataToServer">向后台发送消息</a-button>
  </div>
</template>

<script lang="ts">
import { reactive, ref, defineComponent, onMounted, onUnmounted } from "vue";
export default defineComponent({
  name: "Websocket",
  components: {},
  setup(props) {
    // ws是否启动
    const wsIsRun = ref(false);
    // 定义ws对象
    const webSocket = ref(null);
    // ws请求链接（类似于ws后台地址）
    const ws = ref("");
    // ws定时器
    const wsTimer = ref(null);

    const sendDataToServer = () => {
      if (webSocket.value.readyState === 1) {
        webSocket.value.send("来自前端的数据");
      } else {
        throw Error("服务未连接");
      }
    };
    const wsInit = () => {
      const wsuri = "ws://localhost:8090/websocket/conghuhu";
      ws.value = wsuri;
      if (!wsIsRun.value) return;
      // 销毁ws
      wsDestroy();
      // 初始化ws
      webSocket.value = new WebSocket(ws.value);
      // ws连接建立时触发
      webSocket.value.addEventListener("open", wsOpenHanler);
      // ws服务端给客户端推送消息
      webSocket.value.addEventListener("message", wsMessageHanler);
      // ws通信发生错误时触发
      webSocket.value.addEventListener("error", wsErrorHanler);
      // ws关闭时触发
      webSocket.value.addEventListener("close", wsCloseHanler);

      // 检查ws连接状态,readyState值为0表示尚未连接，1表示建立连接，2正在关闭连接，3已经关闭或无法打开
      clearInterval(wsTimer.value);
      wsTimer.value = setInterval(() => {
        if (webSocket.value.readyState === 1) {
          clearInterval(wsTimer.value);
        } else {
          console.log("ws建立连接失败");
          wsInit();
        }
      }, 3000);
    };
    const wsOpenHanler = (event) => {
      console.log("ws建立连接成功");
    };
    const wsMessageHanler = (e) => {
      console.log("wsMessageHanler");
      console.log(e);
      //const redata = JSON.parse(e.data)
      //console.log(redata)
    };
    /**
     * ws通信发生错误
     */
    function wsErrorHanler(event) {
      console.log(event, "通信发生错误");
      wsInit();
    }
    /**
     * ws关闭
     */
    function wsCloseHanler(event) {
      console.log(event, "ws关闭");
      wsInit();
    }
    /**
     * 销毁ws
     */
    function wsDestroy() {
      if (webSocket.value !== null) {
        webSocket.value.removeEventListener("open", wsOpenHanler);
        webSocket.value.removeEventListener("message", wsMessageHanler);
        webSocket.value.removeEventListener("error", wsErrorHanler);
        webSocket.value.removeEventListener("close", wsCloseHanler);
        webSocket.value.close();
        webSocket.value = null;
        clearInterval(wsTimer.value);
      }
    }

    onMounted(() => {
      console.log("websocket 初始化");
      wsIsRun.value = true;
      wsInit();
      console.log("websocket 初始化结束");
    });

    onUnmounted(() => {
      console.log("项目页面卸载，销毁websocket")
      wsDestroy();
    });

    return {
      wsIsRun,
      webSocket,
      ws,
      wsTimer,
      sendDataToServer,
    };
  },
});
</script>

<style scoped lang="less"></style>
