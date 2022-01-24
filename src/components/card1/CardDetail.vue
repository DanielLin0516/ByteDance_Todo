<template>
	<div>
		<button @click="showCardDetail">card</button>
		<teleport to = "body">
			<div v-if = 'store.state.isCardDetailShow' class="mask">
				<div class="main">
					<card-detail-header />
						<a-row class="grid-demo">
							<a-col :span="18">
								<card-detail-desc />
                                <card-add-file />
                                <card-action />
							</a-col>
							<a-col :span="6">
								<card-detail-fuction />
                                
							</a-col>
					</a-row>   
				</div>
			</div>
		</teleport> 
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from "vuex"
import CardAction from './CardAction.vue';
import CardAddFile from './CardAddFile.vue';
import CardDetailDesc from './CardDetailDesc.vue';
import CardDetailFuction from './CardDetailFuction.vue';
import CardDetailHeader from './CardDetailHeader.vue'

export default defineComponent({
  components: { CardDetailHeader, CardDetailFuction, CardDetailDesc, CardAddFile,  CardAction },
    setup() {
        const store = useStore()
        const showCardDetail = () => {
            store.commit("changeCardShowState")
        }
        return { showCardDetail,store }
    },
})
</script>

<style scoped>
.mask {
    position: absolute;
    top: 0; bottom: 0; left: 0; right: 0;
    background-color: rgba(0, 0, 0, 0.5);
}
.main {
    position: absolute;
    top: 50px;
    left: 50%;
    transform: translate(-50% , 0);
    text-align: center;
    width: 700px;
    height: 900px;
    padding: 15px;
    background-color: #F4F5F7;
    border-radius: 1%;
}
</style>
