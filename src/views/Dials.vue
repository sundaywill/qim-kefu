<template>
  <el-main class="w-full h-full flex flex-col bg-white">
    <el-table
        :data="dials"
        style="width: 100%"
        highlight-current-row
        @selection-change="selectChange"
        header-cell-class-name="bg-gray-200"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="to_id" label="用户" width="120">
        <template slot-scope="scope">
          <div class="flex items-center p-1">
            <div class="flex items-center p-1">
              <el-avatar size="small" :src="oss_url + scope.row.to_avatar"></el-avatar>
            </div>
            <div class="flex items-center p-1">{{ scope.row.to_name }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="last_message" label="消息"></el-table-column>
      <el-table-column prop="updated_at" label="时间" width="240"></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot="header">
          <el-button type="primary" size="mini" icon="el-icon-chat-round"
                     @click="chatAll">开始对话选中的
          </el-button>
        </template>
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" icon="el-icon-chat-round"
                     @click="chat(scope.row.to_id)">开始对话
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-main>
</template>

<script>
import {mapState} from 'vuex'
import {oss} from '@/mixins'

const types = require('../utils/dict').message.types

export default {
  name: "Dials",
  mixins: [oss],
  data() {
    return {
      types,
      selected: []
    }
  },
  computed: {
    ...mapState(['auth_user', 'dials'])
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit('CLEAR_DIALS')
    next()
  },
  created() {
    this.$store.dispatch('fetchDials')
  },
  methods: {
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
          this.$message.warning(data.user_name + ' 正在接待')
          this.$store.commit('DETACH_DIAL', data)
        }
      })
    },
    chatAll() {

    },
    selectChange(val) {
      this.selected = val
      console.log(this.selected)
    },
  }
}
</script>
