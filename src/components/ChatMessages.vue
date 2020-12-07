<template>
  <div class="w-full overflow-y-auto" v-chat-scroll="scroll_config" @scroll-top="loadMore">
    <div class="w-full p-2 flex items-center justify-center">
<!--      <el-button type="info" class="appearance-none focus:outline-none" @click="loadMore" :disabled="params.skip <= 0">{{params.skip > 0 ? '加载更早的消息' : '没有更多了'}}</el-button>-->
      <div class="p-2 text-gray-500 text-xs" v-if="params.skip <= 0">没有更多了</div>
    </div>
    <div class="w-full" :key="'message-' + index" v-for="(item, index) in items" v-if="items && items.length > 0">
      <chat-message :item="item" :right="item.user_id === chat.user_id"></chat-message>
    </div>
  </div>
</template>

<script>
const oss = require('../mixins').oss
const types = require('../utils/dict').message.types
import ChatMessage from "../components/ChatMessage"

export default {
  name: "ChatMessages",
  mixins: [oss],
  props: {
    chat: {
      require: true,
      type: Object,
    },
    count: {
      require: true,
      type: Number,
      default: 0,
    },
  },
  components: {
    ChatMessage,
  },
  data() {
    return {
      scroll_config: {
        always: false,
        smooth: true,
        notSmoothOnInit: true,
        scrollonremoved: true,
        smoothonremoved: false
      },
      types,
      params: {
        skip: 0,
        take: 20,
      },
      items: []
    }
  },
  created() {
    let skip = this.count - this.params.take
    this.params.skip = skip > 0 ? skip : 0
    this.getMessages()
  },
  methods: {
    sent(data) {
      this.items.push(data)
    },
    loadMore() {
      if (this.params.skip > 0) {
        let skip = this.params.skip - this.params.take
        this.params.skip = skip > 0 ? skip : 0
        this.getMessages()
      }
    },
    getMessages() {
      axios.get(`chat/${this.chat.id}/messages`, {
        params: this.params
      }).then(({data}) => {
        this.items = lodash.concat(data, this.items)
      })
    }
  }
}
</script>
