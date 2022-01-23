<template>
    <header>
        <span class="header__icon">
            <icon-robot :style="{fontSize:'1.2em', margin: '0 10px'}"/>
        </span>
        <input class="card-input" v-model="listItemName" type="text">
        <a-button @click="closeCardDetail" class="card-close-button" size="large" shape="circle">
            <icon-close />
        </a-button>
    </header>
    <div class="listName">在列表<span class="listNameSpan">{{listName}}</span>中</div>
</template>

<script>
import { defineComponent } from 'vue';
import { useStore } from 'vuex'
import { IconClose,IconRobot } from '@arco-design/web-vue/es/icon';


export default defineComponent({
    components: { IconClose, IconRobot },
    setup() {
        const store = useStore()
        const closeCardDetail = () => {
            store.commit("changeCardShowState")
        }
        const listName = 'Actions'
        const listItemName = 'AsdSSdSD'
        return { listName, listItemName, closeCardDetail }
    },
})
</script>

<style scoped>
header {
    font-size: 25px;
}
.card-close-button {
    position: absolute;
    right: 10px;
}
.header__icon {
    position: absolute;
    left: 10px;
}
.card-input {
    width: 85%;
    background:none;  
    outline:none;  
    border:0px; 
    font:#8c8d8f;
    
}
.card-input:focus {
    border: 1px solid rgb(111, 128, 143);
    background-color: #fff;
}
.listName {
    width: 85%;
    margin: 10px auto;
    text-align: left;
    color: #444546;
}
.listNameSpan {
    margin: 0 5px;
    text-decoration: underline;
}
</style>
