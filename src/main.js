// lodash
window.lodash = require('lodash')
require('lodash-addons')


// aliyun oss
const OSS = require('ali-oss')
window.alioss = new OSS({
    region: process.env.VUE_APP_ALI_OSS_REGION,
    accessKeyId: process.env.VUE_APP_ALI_OSS_AK_ID,
    accessKeySecret: process.env.VUE_APP_ALI_OSS_AK_SECRET,
    bucket: process.env.VUE_APP_ALI_OSS_BUCKET,
    secure: true
})


// axios
window.axios = require('axios');
axios.defaults.baseURL = process.env.VUE_APP_API
axios.defaults.headers.common['Client-Id'] = process.env.VUE_APP_CLIENT_ID
axios.defaults.headers.common['Client-Secret'] = process.env.VUE_APP_CLIENT_SECRET
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.defaults.headers.common['Accept'] = 'application/json'


// Vue
import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false


// Element UI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI)


// Vue Chat Scroll
import VueChatScroll from 'vue-chat-scroll-image'

Vue.use(VueChatScroll)


// Vue Timeago
import VueTimeago from 'vue-timeago'

Vue.use(VueTimeago, {
    name: 'Timeago', // Component name, `Timeago` by default
    locale: 'zh-CN', // Default locale
    locales: { // We use `date-fns` under the hood
        'zh-CN': require('date-fns/locale/zh_cn')
    }
})


// Vuex
import Vuex from 'vuex'

Vue.use(Vuex)

const stores = require('./stores').default
const store = new Vuex.Store(stores)

let token = localStorage.getItem('qim.kefu.token')
store.commit('FETCH_TOKEN', token)


// Laravel Echo Socket
import Echo from "laravel-echo"

window.io = require('socket.io-client')

window.Echo = new Echo({
    broadcaster: 'socket.io',
    host: process.env.VUE_APP_SOCKET,
    auth: {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
})


// Vue Router
import Router from 'vue-router'

Vue.use(Router)

const routes = require('./routes').default
const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return {x: 0, y: 0}
        }
    }
})


// axios request interceptors
let requestSource = {token: null, cancel: null}
axios.interceptors.request.use(config => {
    config.cancelToken = requestSource.token
    return config
}, error => {
    return Promise.reject(error)
})


// Router Before Each Configuration
router.beforeEach((to, from, next) => {
    // Abort unfinished request before route change
    requestSource.cancel && requestSource.cancel()
    requestSource = axios.CancelToken.source()

    // Check if next route is require Authorization
    if (!store.state.token) {
        if (!to.matched.some(record => record.meta.public)) {
            store.commit('LOGOUT')
            next({name: 'Login'})
        } else {
            next()
        }
    } else {
        next()
    }
    // next()
})


// axios response interceptors
axios.interceptors.response.use(response => {
    return response
}, error => {
    let res = error.response
    if (res.status === 401) {
        router.replace({
            name: 'Login'
        })
    } else {
        ElementUI.Message({
            message: res.data.message,
            type: 'error',
        })
    }
    return Promise.reject(res)
})


// Vue init
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
