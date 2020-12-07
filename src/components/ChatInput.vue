<template>
  <div class="w-full h-full flex flex-col">
    <div class="w-full flex items-center justify-between bg-gray-100 border-b">
      <div class="flex items-center p-1">
        <el-popover
            placement="top"
            width="360"
            trigger="click">
          <div class="w-full h-64 flex overflow-auto">
            <div class="grid grid-cols-7">
              <button
                  class="appearance-none focus:outline-none flex items-center justify-center px-3 py-2 rounded hover:bg-gray-200 text-2xl"
                  @click="addEmoji(emoji)" :key="'emoji-' + index" v-for="(emoji, index) in emojis">
                {{ emoji }}
              </button>
            </div>
          </div>
          <button
              class="appearance-none focus:outline-none flex items-center justify-center p-2 rounded hover:bg-gray-200"
              slot="reference">
            <smile-icon size="1.5x" class="text-gray-600 hover:text-blue-400"></smile-icon>
          </button>
        </el-popover>
        <button
            class="appearance-none focus:outline-none flex items-center justify-center p-2 rounded hover:bg-gray-200"
            onclick="imager.click()">
          <image-icon size="1.5x" class="text-gray-600 hover:text-blue-400"></image-icon>
          <input id="imager" type="file" hidden accept="image/png,image/gif,image/jpeg" @change="sendImage"/>
        </button>
        <!--        <button-->
        <!--            class="appearance-none focus:outline-none flex items-center justify-center p-2 rounded hover:bg-gray-200" @click="capture">-->
        <!--          <crop-icon size="1.5x" class="text-gray-600 hover:text-blue-400"></crop-icon>-->
        <!--        </button>-->
      </div>
      <div class="flex items-center justify-end px-3">
        <el-button size="small" type="primary" icon="el-icon-s-promotion" class="focus:outline-none"
                   @click="send">发送
        </el-button>
      </div>
    </div>
    <div class="w-full flex-grow">
      <div
          class="appearance-none focus:outline-none resize-none w-full h-full overflow-auto text-sm border-0 px-3 pt-2 select-text"
          id="editable-content"
          ref="editabler"
          contenteditable="true"
          @paste="paste"
          @keydown="onKeydown"
          placeholder="【回车键】发送，【Shift】+【回车键】换行"
      ></div>
    </div>
  </div>
</template>

<script>
import {SmileIcon, ImageIcon, CropIcon} from 'vue-feather-icons'
import emojis from "../utils/emojis"

const oss = require('../mixins').oss
const types = require('../utils/dict').message.types
// const { ipcRenderer } = require('electron')

export default {
  name: "ChatInput",
  mixins: [oss],
  components: {
    SmileIcon,
    ImageIcon,
    CropIcon,
  },
  props: {
    chat: {
      require: true,
      type: Object,
    }
  },
  data() {
    return {
      emojis,
      types,
    }
  },
  created() {
  },
  methods: {
    onKeydown(e) {
      // 按了 ctrl 或者 command
      if (e.ctrlKey || e.metaKey) {
        // 全选
        if (e.keyCode === 65) {
          let selection = window.getSelection()
          let range = selection.getRangeAt(0)
          range.selectNodeContents(e.target)
          selection.removeAllRanges()
          selection.addRange(range)
        }
      }
      // 按了回车
      if (e.keyCode === 13) {
        // 没按 shift，发送消息
        if (!e.shiftKey) {
          this.send()
          e.preventDefault()
        }
      }
    },
    send() {
      let target = this.$refs.editabler
      target.childNodes.forEach(node => {
        // 图片
        if (node.nodeName === 'IMG') {
          let image = node.getAttribute('data-obj')
          this.sendMsg({
            type: types.IMAGE,
            content: image
          })
        }
      })
      // 文字
      if (target.innerText) {
        let text = target.innerText
        this.sendMsg({
          type: types.TEXT,
          content: text
        })
      }
    },
    sendMsg(msg) {
      axios.post(`chat/${this.chat.id}/message`, msg).then(({data}) => {
        this.clear()
        this.$emit('sent', data)
      }).catch(res => {
        this.$message.error('发送失败')
      })
    },
    clear() {
      this.$refs.editabler.innerText = ''
    },
    capture() {
      // ipcRenderer.send('capture')
    },
    paste(e) {
      e.preventDefault()
      let clips = e.clipboardData
      let text = e.clipboardData.getData("text/plain")
      if (text) {
        this.addText(text)
      } else {
        let files = Array.from(clips.files)
        files.forEach(async file => {
          await this.addImage(file)
        })
      }
    },
    addText(text) {
      text = text.replace(/\r\n/g, "<br>")
      text = text.replace(/\n/g, "<br>")
      this.insertHtml(`<div>${text}</div>`)
    },
    addEmoji(emoji) {
      this.$refs.editabler.focus()
      this.insertHtml(`${emoji}`)
    },
    async sendImage(e) {
      let file = e.target.files[0]
      await this.addImage(file)
    },
    async addImage(file) {
      let object = await this.uploadImage(file)
      let img = this.oss_url + object
      this.insertHtml(`<img src="${img}" data-obj="${object}" alt="${file.name}" style="height:100px">`)
    },
    async uploadImage(file) {
      let object = this.generateObject(file.name)
      await alioss.multipartUpload(object, file)
      return object
    },
    generateObject(filename, path = 'images') {
      let i = filename.lastIndexOf(".")
      let suffix = filename.substr(i + 1)
      let name = lodash.generateKey(16)
      return `/${path}/${name}.${suffix}`
    },
    insertHtml(html) {
      this.$refs.editabler.focus()
      let selection = window.getSelection()
      let range = selection.getRangeAt(0)
      range.deleteContents()
      let element = document.createElement("div")
      element.innerHTML = html
      let fragment = document.createDocumentFragment()
      let node, lastNode
      while ((node = element.firstChild)) {
        lastNode = fragment.appendChild(node)
      }
      range.insertNode(fragment)
      if (lastNode) {
        range = range.cloneRange()
        range.setStartAfter(lastNode)
        selection.removeAllRanges()
        selection.addRange(range)
      }
    },
    setFastWord(item) {
      let object = item.content
      if (item.is_image) {
        let img = this.oss_url + object
        this.insertHtml(`<img src="${img}" data-obj="${object}" style="height:100px">`)
      } else {
        this.addText(object)
      }
    },
  }
}
</script>

<style scoped>

</style>
