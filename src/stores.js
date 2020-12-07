/**
 * THE VUEX STORE
 */

const LOGOUT = 'LOGOUT'
const FETCH_TOKEN = 'FETCH_TOKEN'
const FETCH_AUTH_USER = 'FETCH_AUTH_USER'

const FETCH_DIALS = 'FETCH_DIALS'
const CLEAR_DIALS = 'CLEAR_DIALS'
const DETACH_DIAL = 'DETACH_DIAL'
const ADDNEW_DIAL = 'ADDNEW_DIAL'

const FETCH_CHATS = 'FETCH_CHATS'
const CLEAR_CHATS = 'CLEAR_CHATS'
const DETACH_CHAT = 'DETACH_CHAT'
const ADDNEW_CHAT = 'ADDNEW_CHAT'

const FETCH_CHAT = 'FETCH_CHAT'
const CLEAR_CHAT = 'CLEAR_CHAT'

const FETCH_MESSAGES = 'FETCH_MESSAGES'
const CLEAR_MESSAGES = 'CLEAR_MESSAGES'
const FETCH_MESSAGE = 'FETCH_MESSAGE'

export default {
    state: {
        token: null,
        auth_user: null,
        dials: [],
        chats: [],
        chat: null,
        messages: [],
    },
    mutations: {
        [LOGOUT](state) {
            state.token = null
            state.auth_user = null
            state.dials = []
            state.chats = []
            state.chat = null
            state.messages = []
            localStorage.removeItem('qim.kefu.token')
        },
        [FETCH_TOKEN](state, token) {
            state.token = token
            localStorage.setItem('qim.kefu.token', token)
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        },
        [FETCH_AUTH_USER](state, auth_user) {
            state.auth_user = auth_user
        },
        [FETCH_DIALS](state, dials) {
            state.dials = dials
        },
        [CLEAR_DIALS](state) {
            state.dials = []
        },
        [DETACH_DIAL](state, dial) {
            let i = lodash.findIndex(state.dials, item => {
                return item.id === dial.id
            })
            if (i >= 0 && state.dials[i]) {
                state.dials.splice(i, 1)
            }
        },
        [ADDNEW_DIAL](state, dial) {
            let i = lodash.findIndex(state.dials, item => {
                return item.id === dial.id
            })
            if (i >= 0 && state.dials[i]) {
                state.dials[i] = dial
            } else {
                state.dials.unshift(dial)
            }
        },
        [FETCH_CHATS](state, chats) {
            state.chats = chats
        },
        [CLEAR_CHATS](state) {
            state.chats = []
        },
        [DETACH_CHAT](state, chat) {
            let i = lodash.findIndex(state.chats, item => {
                return item.id === chat.id
            })
            if (i >= 0 && state.chats[i]) {
                state.chats.splice(i, 1)
            }
        },
        [ADDNEW_CHAT](state, chat) {
            let i = lodash.findIndex(state.chats, item => {
                return item.id === chat.id
            })
            if (i >= 0 && state.chats[i]) {
                state.chats[i] = chat
            } else {
                state.chats.unshift(chat)
            }
        },
        [FETCH_CHAT](state, chat) {
            state.chat = chat
            let i = lodash.findIndex(state.chats, item => {
                return item.id = chat.id
            })
            if (i >= 0 && state.chats[i]) {
                state.chats[i].unread = 0
                state.chats[i].last_message = chat.last_message
            }
        },
        [CLEAR_CHAT](state, chat) {
            state.chat = null
        },
        [FETCH_MESSAGES](state, messages) {
            let items = state.messages
            state.messages = lodash.union(messages, items, (a, b) => {
                return a.id === b.id
            })
        },
        [CLEAR_MESSAGES](state) {
            state.messages = []
        },
        [FETCH_MESSAGE](state, message) {
            state.messages.push(message)
            state.chat.unread = 0
            state.chat.last_message = message.content
            let i = lodash.findIndex(state.chats, item => {
                return item.id = state.chat.id
            })
            state.chats[i].unread = 0
            state.chats[i].last_message = message.content
        },
    },
    actions: {
        logout({commit}) {
            return new Promise((resolve, reject) => {
                axios.post('logout').then(({data}) => {
                    resolve(data)
                }).catch(res => {
                    reject(res)
                }).finally(() => {
                    commit(LOGOUT)
                })
            })
        },
        login({commit}, form) {
            return new Promise((resolve, reject) => {
                axios.post("login", form).then(({data}) => {
                    commit(FETCH_TOKEN, data)
                    resolve(data)
                }).catch(res => {
                    reject(res)
                })
            });
        },
        fetchAuthUser({commit}) {
            return new Promise((resolve, reject) => {
                axios.get('auth_user').then(({data}) => {
                    commit(FETCH_AUTH_USER, data)
                    resolve(data);
                }).catch(res => {
                    reject(res)
                })
            })
        },
        fetchDials({commit}) {
            return new Promise((resolve, reject) => {
                axios.get('dials').then(({data}) => {
                    commit(FETCH_DIALS, data)
                    resolve(data)
                }).catch(res => {
                    reject(res)
                })
            })
        },
        fetchChats({commit}) {
            return new Promise((resolve, reject) => {
                axios.get('chats').then(({data}) => {
                    commit(FETCH_CHATS, data)
                    resolve(data)
                }).catch(res => {
                    reject(res)
                })
            })
        },
        fetchChat({commit}, id) {
            return new Promise((resolve, reject) => {
                axios.get(`chat/${id}`).then(({data}) => {
                    commit(FETCH_CHAT, data)
                    resolve(data)
                }).catch(res => {
                    reject(res)
                })
            })
        },
        fetchMessages({state, commit}, page) {
            return new Promise((resolve, reject) => {
                axios.get(`chat/${state.chat.id}/messages`, {
                    params: { page: page }
                }).then(({data}) => {
                    commit(FETCH_MESSAGES, data.items)
                    resolve(data)
                }).catch(res => {
                    reject(res)
                })
            })
        },
    },
    getters: {}
}
