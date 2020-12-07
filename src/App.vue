<template>
  <div id="app" class="font-sans text-sm w-full h-screen overflow-hidden">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

.el-loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
