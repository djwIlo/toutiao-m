import Vue from 'vue'
import VueRouter from 'vue-router'
import {
  Dialog
} from 'vant';
import store from '@/store/'

Vue.use(VueRouter)

// 路由表
const routes = [{
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/'),
    meta: {
      requiresAuth: false
    } // 添加额外的自定义数据
  },
  {
    path: '/',
    component: () => import('@/views/layout/'),
    // 子路由
    children: [{
        path: '', // 默认子路由(进去直接显示的页面)
        name: 'home',
        component: () => import('@/views/home/'),
        meta: {
          requiresAuth: false
        }
      },
      {
        path: '/qa',
        name: 'qa',
        component: () => import('@/views/qa/'),
        meta: {
          requiresAuth: false
        }
      },
      {
        path: '/video',
        name: 'video',
        component: () => import('@/views/video/'),
        meta: {
          requiresAuth: false
        }
      },
      {
        path: '/my',
        name: 'my',
        component: () => import('@/views/my/'),
        meta: {
          requiresAuth: false
        }
      },
    ]
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/search/'),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/article/:articleId',
    name: 'article',
    component: () => import('@/views/article/'),
    meta: {
      requiresAuth: false
    },
    // 将动态路由参数映射到组件的 props 中，无论是访问还是维护性都很方便
    props: true,
  },
  {
    path: '/user/profile',
    name: 'user-profile',
    component: () => import('@/views/user-profile'),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/user/chat',
    name: 'user-chat',
    component: () => import('@/views/user-chat'),
    meta: {
      requiresAuth: true
    }
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    // 如果已登录，则直接通过
    if (store.state.user) {
      return next()
    }
    // 没有登陆，提示用户登录
    Dialog.confirm({
        title: '访问提示',
        message: '该功能需要登录才能访问，确认登录吗',
      }).then(() => {
        // on confirm
        router.replace({
          name: 'login',
          query: {
            redirect: router.currentRoute.fullPath
          }
        })
      }).catch(() => {
        // 取消了，中断路由导航
        next(false)
      });
  } else {
    // 不需要登录的直接过去
    next()
  }
})

export default router