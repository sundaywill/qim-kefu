<template>
  <el-container class="w-full h-full flex items-stretch bg-white">
    <el-aside width="240px" class="w-12 h-full border-r">
      <router-link
          :to="{ name: 'Chat', params: { id: item.id } }"
          :class="item.id === $route.params.id ? 'bg-gray-200' : ''"
          class="w-full flex items-center border-b p-2 hover:bg-gray-200"
          @click="$route.params.id === item.id"
          :key="'chat-item-' + index"
          v-for="(item, index) in chats"
          v-if="chats">
        <div class="flex items-center p-1">
          <el-badge :is-dot="item.unread > 0">
            <el-avatar :src="oss_url + item.user_avatar"></el-avatar>
          </el-badge>
        </div>
        <div class="flex-grow p-1 truncate">
          <div class="flex items-center justify-between">
            <span class="text-gray-900 pr-2">{{ item.user_name }}</span>
            <span class="text-gray-500 text-xs">
              <timeago :datetime="item.updated_at" :auto-update="60"></timeago>
            </span>
          </div>
          <div class="text-gray-600 text-xs truncate">{{ item.last_message }}</div>
        </div>
      </router-link>
    </el-aside>
    <router-view></router-view>
  </el-container>
</template>

<script>
import {mapState} from 'vuex'
import {oss} from '@/mixins'

export default {
  name: "Chats",
  mixins: [oss],
  computed: {
    ...mapState(['chats'])
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit('CLEAR_CHATS')
    next()
  },
  created() {
    this.$store.dispatch('fetchChats')
  },
}
</script>
