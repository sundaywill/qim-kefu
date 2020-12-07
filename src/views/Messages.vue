<template>
  <el-main class="bg-white">
    <el-row>
      <el-col>
        <el-form :inline="true" :model="params" size="small" @submit.prevent.native="search">
          <el-form-item>
            <el-input v-model="params.key" placeholder="输入内容"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">搜索</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col>
        <el-table
            stripe
            size="small"
            :data="items"
            highlight-current-row
            @sort-change="changeSort"
            :default-sort="{ prop: 'id', order: 'descending' }"
            header-cell-class-name="bg-gray-200"
        >
          <el-table-column resizable sortable="custom" prop="id" label="ID" width="100"></el-table-column>
          <el-table-column resizable sortable="custom" prop="user_id" label="发送人">
            <template slot-scope="scope">
              <div class="flex items-center">
                <el-avatar size="small" :src="oss_url + scope.row.user_avatar"></el-avatar>
                <span class="pl-2">{{ scope.row.user_name }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column resizable sortable="custom" prop="to_id" label="收信人">
            <template slot-scope="scope">
              <div class="flex items-center">
                <el-avatar size="small" :src="oss_url + scope.row.to_avatar"></el-avatar>
                <span class="pl-2">{{ scope.row.to_name }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column resizable sortable="custom" prop="content" label="内容">
            <template slot-scope="scope">
              <el-image
                  class="w-20"
                  :src="oss_url + scope.row.content"
                  :preview-src-list="[oss_url + scope.row.content]"
                  v-if="scope.row.type === types.IMAGE"
              ></el-image>
              <span v-else>{{ scope.row.content }}</span>
            </template>
          </el-table-column>
          <el-table-column resizable label="查看" width="150">
            <template slot-scope="scope">
              <el-button size="mini" type="default" @click="view(scope.row, scope.$index)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col class="py-4">
        <el-pagination
            background
            @size-change="changeSize"
            @current-change="jumpPage"
            :current-page="payload.page"
            :page-sizes="[20, 50, 100]"
            :page-size="payload.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
        >
        </el-pagination>
      </el-col>
    </el-row>
  </el-main>
</template>

<script>
import {oss, paginate} from "@/mixins"

const types = require('../utils/dict').message.types

export default {
  name: "Messages",
  mixins: [oss, paginate],
  data() {
    return {
      types,
      params: {
        key: '',
      },
    }
  },
  created() {
    this.search()
  },
  methods: {
    view() {
    },
    search() {
      let loading = this.$loading()
      let params = _.assign(this.payload, this.params)
      axios.get('messages', {params}).then(({data}) => {
        this.items = data.items
        this.total = data.total
        this.last = data.last
        this.payload.page = data.page
        this.payload.size = data.size
      }).finally(() => {
        loading.close()
      })
    },
  }
}
</script>
