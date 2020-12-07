<template>
  <div class="w-full">
    <div class="w-full p-2 flex items-start justify-end" v-if="right">
      <div class="w-max-full flex flex-col px-2">
        <div class="flex items-center justify-end">
          <div class="p-1 flex items-center">
            <div class="text-xs text-gray-500 px-1">{{ item.created_at }}</div>
            <div class="text-sm text-gray-700 px-1">{{ item.user_name }}</div>
          </div>
          <el-avatar :src="oss_url + item.user_avatar" size="small"></el-avatar>
        </div>
        <div class="flex items-center justify-end">
          <message-bubble :item="item" right></message-bubble>
        </div>
      </div>
    </div>
    <div class="w-full p-2 flex items-start" v-else>
      <div class="w-max-full flex flex-col px-2">
        <div class="flex items-center">
          <el-avatar :src="oss_url + item.user_avatar" size="small"></el-avatar>
          <div class="p-1 flex items-center">
            <div class="text-sm text-gray-700 px-1">{{ item.user_name }}</div>
            <div class="text-xs text-gray-500 px-1">{{ item.created_at }}</div>
          </div>
        </div>
        <div class="flex items-center">
          <message-bubble :item="item"></message-bubble>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MessageBubble from '../components/MessageBubble'

const oss = require('../mixins').oss

export default {
  name: "ChatMessage",
  mixins: [oss],
  props: {
    item: {
      require: true,
      type: Object
    },
    right: {
      type: Boolean,
      default: false,
    }
  },
  components: {
    MessageBubble
  },
}
</script>
