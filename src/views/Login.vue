<template>
  <el-row class="w-full h-screen flex items-center justify-center bg-gray-800">
    <el-col class="flex flex-col items-center justify-center">
      <div class="flex items-center justify-center text-blue-400 font-bold text-xl">QIM 客 服 系 统 登 录</div>
      <div class="w-16 h-1 mb-8 mt-3 bg-blue-400 rounded-full shadow-lg"></div>
      <el-card class="px-16 py-8 rounded-lg shadow-lg">
        <el-form ref="form" :model="form">
          <el-form-item>
            <el-input v-model="form.phone" placeholder="手机"
                      prefix-icon="el-icon-mobile-phone"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="form.password" placeholder="密码"
                      prefix-icon="el-icon-lock" type="password"></el-input>
          </el-form-item>
          <div class="flex items-center justify-center">
            <el-button class="w-full focus:outline-none" type="primary" round @click="login">登录</el-button>
          </div>
        </el-form>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      form: {
        phone: '18926928633',
        password: 'asdf1234',
      }
    }
  },
  methods: {
    login() {
      let loading = this.$loading()
      this.$store.dispatch('login', this.form).then(data => {
        this.$router.replace({
          name: 'Chats'
        })
      }).finally(() => {
        loading.close()
      })
    }
  }
}
</script>
