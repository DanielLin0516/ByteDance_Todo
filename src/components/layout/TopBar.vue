<template>
    <div class="menu-demo">
        <a-menu mode="horizontal"  :default-selected-keys="['1']">
            <a-menu-item key="0" :style="{ padding: 0, marginRight: '38px' }" disabled>
                <div
                    :style="{
                        width: '80px',
                        height: '30px',
                        borderRadius: '2px',
                        background: 'var(--color-fill-3)',
                        cursor: 'text',
                    }"
                />
            </a-menu-item>
            <a-menu-item key="1">项目</a-menu-item>
            <a-space direction="vertical" size="large" class="search">
                <a-input-search class="input-search" placeholder="Please enter something" />
            </a-space>
            <a-badge :count="9" dot :offset="[2, -2]" class="icon-badge">
                <IconNotification
                    :style="{ color: '#888', fontSize: '18px', verticalAlign: '-3px' }"
                />
            </a-badge>
            <a-avatar :style="{ backgroundColor: '#3370ff' }" class="icon-acatar">
                <IconUser />
            </a-avatar>
        </a-menu>
    </div>
</template>
<script lang="ts">
import { IconUser } from '@arco-design/web-vue/es/icon';
import { IconNotification } from '@arco-design/web-vue/es/icon';
import { defineComponent } from 'vue';
export default defineComponent({
    name: 'TopBar',
    components: {
        IconUser,
        IconNotification
    }
})

</script>

<style lang="scss" scoped>
.menu-demo {
    box-sizing: border-box;
    width: 100%;
    padding: 40px;
    background-color: var(--color-neutral-2);

    .input-search {
        width: 300px;
    }

    .search {
        position: absolute;
        right: 220px;        
    }
    .icon-badge {
        position: absolute;
        right: 120px;

    }
    .icon-acatar {
        position: absolute;
        right: 30px;
    }
}
</style>
