<template>
  <div>
    <span @click="$store.commit('add')">{{ $store.state.count }}</span>
    <div>888</div>

  </div>
</template>
