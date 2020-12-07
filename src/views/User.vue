<template>
  <el-main>
    <el-card v-if="user">
      <div class="flex flex-col items-center justify-center p-2">
        <div class="flex items-center justify-center">
          <el-avatar :size="100" :src="oss_url + user.avatar"></el-avatar>
        </div>
        <div class="flex items-center justify-center p-2">
          <el-icon name="user" class="text-lg text-gray-600"></el-icon>
          <span class="px-2">{{ user.name }}</span>
        </div>
        <div class="flex items-center justify-center p-2">
          <el-icon name="mobile-phone" class="text-lg text-gray-600"></el-icon>
          <span class="pl-2">{{ user.phone }}</span>
        </div>
        <div class="flex items-center justify-center p-2">
          <el-icon name="message" class="text-lg text-gray-600"></el-icon>
          <span class="pl-2">{{ user.email }}</span>
        </div>
        <div class="flex items-center justify-center p-2" v-if="user.gender">
          <el-icon name="female" class="text-lg text-red-500" v-if="user.gender === '女'"></el-icon>
          <el-icon name="male" class="text-lg text-blue-500" v-if="user.gender === '男'"></el-icon>
          <span class="pl-2">{{ user.gender }}</span>
        </div>
        <div class="flex items-center justify-center p-2" v-if="user.birth">
          <el-icon name="date" class="text-lg text-gray-600"></el-icon>
          <span class="pl-2">{{ user.birth }}</span>
        </div>
        <div class="flex items-center justify-center p-2">
          <div class="flex items-center justify-center p-2">
            <el-button type="primary" plain icon="el-icon-chat-round" @click="chat(user.id)">开始聊天</el-button>
          </div>
        </div>
      </div>
    </el-card>
  </el-main>
</template>

<script>
import {mapState} from 'vuex'
import {oss} from '@/mixins'

export default {
  name: "User",
  mixins: [oss],
  data() {
    return {
      id: 0,
      user: null
    }
  },
  computed: {
    ...mapState(['auth_user'])
  },
  beforeRouteLeave(to, from, next) {
    this.id = 0
    this.user = null
    next()
  },
  created() {
    this.id = this.$route.params.id
    this.getUser()
  },
  methods: {
    getUser() {
      axios.get(`user/${this.id}`).then(({data}) => {
        this.user = data
      })
    },
    chat(id) {
      axios.get(`user/${id}/chat`).then(({data}) => {
        if (data.user_id === this.auth_user.id) {
          this.$router.replace({
            name: 'Chat',
            params: {
              id: data.id
            }
          })
        } else {
          this.$message.warning( data.user_name + ' 正在接待')
        }
      })
    },
  }
}
</script>
