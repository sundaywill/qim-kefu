<template>
  <el-container class="h-screen flex items-stretch" v-if="auth_user">
    <el-aside width="60px"
              class="w-12 h-full bg-gray-900 text-white px-1 py-6 flex flex-col items-center justify-between">
      <div class="grid grid-cols-1 place-items-center gap-2">
        <router-link to="/" class="w-12 h-12 flex items-center justify-center">
          <el-avatar shape="square" :src="oss_url + auth_user.avatar"></el-avatar>
        </router-link>
        <router-link :to="{ name: 'Chats' }"
                     :class="$route.name === 'Chats' || $route.name === 'Chat' ? 'text-blue-400' : ''"
                     class="w-12 h-12 flex items-center justify-center hover:text-blue-500">
          <el-icon name="chat-dot-round" class="text-2xl"></el-icon>
        </router-link>
        <router-link :to="{ name: 'Dials' }"
                     :class="$route.name === 'Dials' ? 'text-blue-400' : ''"
                     class="w-12 h-12 flex items-center justify-center hover:text-blue-500">
          <el-icon name="bell" class="text-2xl"></el-icon>
        </router-link>
        <router-link :to="{ name: 'Messages' }"
                     :class="$route.name === 'Messages' ? 'text-blue-400' : ''"
                     class="w-12 h-12 flex items-center justify-center hover:text-blue-500">
          <el-icon name="time" class="text-2xl"></el-icon>
        </router-link>
        <router-link :to="{ name: 'Users' }"
                     :class="$route.name === 'Users' || $route.name === 'User' ? 'text-blue-400' : ''"
                     class="w-12 h-12 flex items-center justify-center hover:text-blue-500">
          <el-icon name="user" class="text-2xl"></el-icon>
        </router-link>
      </div>
      <div class="grid grid-cols-1 place-items-center gap-2">
        <router-link to="/" class="w-12 h-12 flex items-center justify-center hover:text-blue-500">
          <el-icon name="setting" class="text-2xl"></el-icon>
        </router-link>
      </div>
    </el-aside>
    <router-view></router-view>
  </el-container>
</template>

<script>
import {remote} from 'electron'
import {mapState} from 'vuex'
import {oss} from '@/mixins'

export default {
  name: "Home",
  mixins: [oss],
  computed: {
    ...mapState(['auth_user', 'chat'])
  },
  created() {
    this.$store.dispatch('fetchAuthUser').then(data => {
      this.linkStart()
    })
  },
  methods: {
    linkStart() {
      Echo.private(`App.Models.User.${this.auth_user.id}`)
          .notification((notification) => {
            if (notification.type === 'MessageSent') {
              this.messageSent(notification?.message, notification?.chat)
            }
            if (notification.type === 'ChatStarted') {
              this.chatStarted(notification?.chat)
            }
          })
    },
    messageSent(message, chat) {
      if (message) {
        let notifiable = false
        if (this.chat?.id === chat.id) {
          this.$store.commit('FETCH_MESSAGE', message)
          let win = remote.getCurrentWindow()
          if (win.isMinimized()) {
            notifiable = true
          }
        } else {
          this.$store.commit('FETCH_CHATS', [chat])
          notifiable = true
        }
        if (notifiable) {
          new Notification(message?.user_name, {
            body: message?.content,
            timestamp: 1000
          })
        }
      }
    },
    chatStarted(chat) {
      if (chat) {
        if (chat.user_id === this.auth_user.id) {
          this.$store.commit('ADDNEW_DIAL', chat)
        } else {
          this.$store.commit('DETACH_DIAL', chat)
          this.$store.commit('ADDNEW_CHAT', chat)
        }
      }
    }
  }
}
</script>
