<template>
  <div class="w-full h-full flex flex-col bg-white">
    <div class="grid grid-cols-2 border-b-2 border-blue-500">
      <button class="appearance-none focus:outline-none px-4 py-2"
              :class="type === 0 ? 'bg-blue-500 text-white' : 'text-gray-500 bg-gray-200 hover:bg-blue-400 hover:text-gray-100'"
              @click="setType(0)">文字
      </button>
      <button class="appearance-none focus:outline-none px-4 py-2"
              :class="type === 1 ? 'bg-blue-500 text-white' : 'text-gray-500 bg-gray-200 hover:bg-blue-400 hover:text-gray-100'"
              @click="setType(1)">图片
      </button>
    </div>
    <div class="flex-grow flex flex-col">
      <div class="w-full flex-none">
        <div class="flex p-2 bg-gray-200">
          <el-select v-model="tag" size="mini" placeholder="选择分组" @change="search">
            <el-option
                :label="tag"
                :value="tag"
                :key="'tag-' + i"
                v-for="(tag, i) in tags"
            ></el-option>
          </el-select>
          <el-input v-model="key" size="mini" placeholder="关键词搜索" @change="search" v-if="type === 0"></el-input>
<!--          <el-button type="primary" size="mini" @click="search">搜索</el-button>-->
        </div>
      </div>
      <div class="w-full flex-grow">
        <button
            class="appearance-none focus:outline-none w-full flex border-b p-2 hover:bg-gray-100"
            :key="'item-' + index" v-for="(item, index) in items"
            @click="setFastWord(item)"
        >
          <div class="w-full flex">
            <el-image
                fit="cover"
                class="w-max-full"
                :src="oss_url + item.content"
                v-if="item.is_image"
            ></el-image>
            <span class="w-full text-left" v-else>{{ item.content }}</span>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
const oss = require('../mixins').oss

export default {
  name: "ChatFastWords",
  mixins: [oss],
  data() {
    return {
      type: 0,
      key: '',
      tag: '',
      tags: [],
      items: []
    }
  },
  created() {
    this.getFastTags()
  },
  methods: {
    setFastWord(item) {
      this.$emit('send', item)
    },
    setType(type) {
      this.type = type
      this.search()
    },
    search() {
      let params = {
        is_image: this.type,
        tag: this.tag,
      }
      if (this.type === 0 && !!this.key) {
        this.$set(params, 'key', this.key)
      }
      axios.get(`fast_words`, {params}).then(({data}) => {
        this.items = data
      })
    },
    getFastTags() {
      axios.get(`fast_tags`).then(({data}) => {
        if (data.length > 0) {
          this.tags = data
          this.tag = data[0]
          this.search()
        }
      })
    },
  }
}
</script>
