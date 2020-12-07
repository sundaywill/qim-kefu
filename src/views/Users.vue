<template>
  <el-container class="w-full h-full flex items-stretch bg-white">
    <el-aside width="240px" class="w-12 h-full border-r">
      <router-link :to="{ name: 'User', params: { id: item.id } }"
                   :class="item.id === $route.params.id ? 'bg-gray-200' : ''"
                   class="w-full flex items-center border-b p-2 hover:bg-gray-200"
                   @click="$route.params.id === item.id"
                   :key="'chat-item-' + index"
                   v-for="(item, index) in items"
                   v-if="items">
        <div class="flex items-center p-1">
          <el-avatar :src="oss_url + item.avatar"></el-avatar>
        </div>
        <div class="p-1 truncate">
          <div class="flex items-center justify-between">
            <span class="text-gray-900">{{ item.name }}</span>
          </div>
          <div class="text-gray-600 text-xs truncate">{{ item.phone }}</div>
        </div>
      </router-link>
    </el-aside>
    <router-view></router-view>
  </el-container>
</template>

<script>
const oss = require('../mixins').oss
const types = require('../utils/dict').user.types

export default {
  name: "Users",
  mixins: [oss],
  data() {
    return {
      types,
      params: {
        type: types.SELLER,
        page: 0,
      },
      items: null,
      more: true,
    }
  },
  created() {
    this.getChats()
  },
  methods: {
    getChats() {
      axios.get(`users`, {
        params: this.params
      }).then(({data}) => {
        this.items = data.items
        this.more = data.more
        this.params.page = data.page
      }).catch(res => {
        this.$message.error(res.data.message)
      })
    }
  }
}
</script>
