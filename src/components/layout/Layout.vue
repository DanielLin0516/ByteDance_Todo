<template>
    <top-bar1 />
    <left-drawer />
    <small-bar />
</template>

<script lang="ts">
import TopBar1 from './TopBar.vue'
import LeftDrawer from './LeftDrawer.vue'
import SmallBar from './SmallBar.vue'
import { defineComponent } from 'vue';
export default defineComponent({
    name: 'TopBar',
    components: {
        TopBar1,
        LeftDrawer,
        SmallBar
    },
    setup() {
        console.log(456)
    }
    
})
</script>

<style lang="scss" scoped>
.wrapper {
    height: 100vh;
    width: 100vw;
    background-color: orange;

    .top-bar {
        position: relative;
        display: flex;
        height: 80px;
        width: 100%;
        background-color: rgba(0, 0, 0, 0.45);
        backdrop-filter: blur(10px);
        .left-bar {
            height: 100%;
            width: 50%;
            display: flex;
            align-items: center;
            .icon-byte {
                margin-left: 50px;
                width: 50px;
                height: 50px;
            }
            .link {
                margin-left: 50px;
                font-family: "PingFang-Regular";
                font-size: 24px;
                color: white;
                line-height: 20px;
                border-radius: 5px;
                padding: 20px;
                cursor: pointer;
                border: 1px solid white;
                width: 100px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .link:hover {
                background-color: rgba(0, 0, 0, 0.45);
            }
        }
        .right-bar {
            height: 100%;
            width: 50%;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            .notifacte {
                width: 50px;
                height: 50px;
                color: white;
                margin-right: 35px;
                cursor: pointer;
            }
            .input {
                margin-right: 40px;
                width: 360px;
                height: 50px;
            }
            .avatar {
                margin-right: 35px;
                width: 50px;
                height: 50px;
            }
        }
    }
}
</style>
