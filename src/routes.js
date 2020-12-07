const Login = () => import('./views/Login')
const Index = () => import('./views/Index')
const Home = () => import('./views/Home')
const Chats = () => import('./views/Chats')
const Chat = () => import('./views/Chat')
const Dials = () => import('./views/Dials')
const Users = () => import('./views/Users')
const User = () => import('./views/User')
const Messages = () => import('./views/Messages')

export default [
    {
        path: '/',
        component: Home,
        children: [
            {
                path: '',
                component: Chats,
                children: [
                    {
                        path: '',
                        name: 'Chats',
                        component: Index,
                    },
                    {
                        path: 'chat/:id',
                        name: 'Chat',
                        component: Chat
                    },
                ]
            },
            {
                path: 'dials',
                name: 'Dials',
                component: Dials,
            },
            {
                path: 'messages',
                name: 'Messages',
                component: Messages,
            },
            {
                path: 'users',
                name: 'Users',
                component: Users,
                children: [
                    {
                        path: '',
                        name: 'Index',
                        component: Index,
                    },
                    {
                        path: 'user/:id',
                        name: 'User',
                        component: User
                    },
                ]
            },
        ]
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: {
            public: true
        }
    },
    {
        path: '*',
        redirect: '/'
    }
]
