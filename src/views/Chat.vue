<template>
  <div class="h-full w-full flex items-stretch bg-white" v-if="chat">
    <div class="h-full w-full flex flex-col flex-grow">
      <div class="w-full flex items-center justify-between p-1 bg-gray-100 border-b">
        <button class="appearance-none focus:outline-none flex items-center p-1 hover:bg-gray-200 rounded">
          <div class="flex items-center p-1">
            <el-avatar size="small" :src="oss_url + chat.to_avatar"></el-avatar>
          </div>
          <div class="text-gray-800 text-base p-1">{{ chat.to_name }}</div>
        </button>
        <div class="flex items-center justify-end p-1">
          <button
              class="appearance-none focus:outline-none flex items-center justify-center p-2 rounded hover:bg-gray-200">
            <coffee-icon size="1.5x" class="text-gray-600 hover:text-blue-400"></coffee-icon>
          </button>
          <button
              class="appearance-none focus:outline-none flex items-center justify-center p-2 rounded hover:bg-gray-200">
            <x-circle-icon size="1.5x" class="text-gray-600 hover:text-blue-400"></x-circle-icon>
          </button>
        </div>
      </div>
      <div class="w-full flex-grow flex items-stretch overflow-hidden">
        <div class="w-full overflow-y-auto" v-chat-scroll="scroll_config">
          <div class="w-full p-2 flex items-center justify-center">
            <button
                class="appearance-none focus:outline-none text-xs rounded-full px-6 py-2 bg-gray-200 text-gray-500 hover:bg-gray-300 hover:text-gray-600"
                @click="fetchMessages" v-if="more">加载更早的消息</button>
            <div class="text-xs rounded-full px-6 py-2 bg-gray-200 text-gray-500" v-else>没有更多了</div>
          </div>
          <div class="w-full" :key="'message-' + index" v-for="(item, index) in messages" v-if="messages">
            <chat-message :item="item" :right="item.user_id === chat.user_id"></chat-message>
          </div>
        </div>
      </div>
      <div class="w-full h-48 border-t flex items-stretch">
        <chat-input ref="inputer" :chat="chat" @sent="messageSent"></chat-input>
      </div>
    </div>
    <div class="h-full bg-white border-l flex-none" style="width: 24rem">
      <chat-fast-words @send="setFastWord"></chat-fast-words>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import {oss, scroll} from "@/mixins"
import {CoffeeIcon, XCircleIcon} from 'vue-feather-icons'
import ChatMessage from "@/components/ChatMessage"
import ChatFastWords from '@/components/ChatFastWords'
import ChatInput from "@/components/ChatInput"

const types = require('../utils/dict').message.types

export default {
  name: "Chat",
  mixins: [oss, scroll],
  components: {
    CoffeeIcon,
    XCircleIcon,
    ChatMessage,
    ChatFastWords,
    ChatInput,
  },
  data() {
    return {
      types,
      id: 0,
      page: 1,
      more: true,
    }
  },
  computed: {
    ...mapState(['chat', 'messages'])
  },
  beforeRouteLeave(to, from, next) {
    this.id = 0
    this.page = 1
    this.more = true
    this.$store.commit('CLEAR_CHAT')
    this.$store.commit('CLEAR_MESSAGES')
    next()
  },
  created() {
    this.id = this.$route.params.id
    this.fetchChat()
  },
  methods: {
    fetchChat() {
      this.$store.dispatch('fetchChat', this.id).then(data => {
        this.fetchMessages()
      })
    },
    fetchMessages() {
      this.$store.dispatch('fetchMessages', this.page).then(data => {
        this.more = data.more
        this.page = data.page + 1
      })
    },
    setFastWord(item) {
      this.$refs.inputer.setFastWord(item)
    },
    messageSent(data) {
      this.$store.commit('FETCH_MESSAGE', data)
    },
  }
}
</script>
