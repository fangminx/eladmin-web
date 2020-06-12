import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../layout/index'

Vue.use(Router)

export const constantRouterMap = [
  { path: '/login',
    meta: { title: '登录', noCache: true },
    component: (resolve) => require(['@/views/login'], resolve),
    hidden: true
  },
  {
    path: '/404',
    component: (resolve) => require(['@/views/features/404'], resolve),
    hidden: true
  },
  {
    path: '/401',
    component: (resolve) => require(['@/views/features/401'], resolve),
    hidden: true
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: (resolve) => require(['@/views/features/redirect'], resolve)
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: (resolve) => require(['@/views/home'], resolve),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'index', affix: true, noCache: true }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: false,
    redirect: 'noredirect',
    children: [
      {
        path: 'center',
        component: (resolve) => require(['@/views/system/user/center'], resolve),
        name: '个人中心',
        meta: { title: '个人中心', icon: 'java' }
      }
    ]
  },
  {
    path: '/config',
    component: Layout,
    hidden: false,
    redirect: 'noredirect',
    children: [
      {
        path: 'center',
        component: (resolve) => require(['@/views/config'], resolve),
        name: '条件配置',
        meta: { title: '条件配置', icon: 'edit' }
      }
    ]
  },
  {
    path: '/config/dept',
    component: Layout,
    hidden: false,
    redirect: 'noredirect',
    children: [
      {
        path: 'center',
        component: (resolve) => require(['@/views/config/dept'], resolve),
        name: '部门配置',
        meta: { title: '部门配置', icon: 'edit' }
      }
    ]
  },
  {
    path: '/config/people',
    component: Layout,
    hidden: false,
    redirect: 'noredirect',
    children: [
      {
        path: 'center',
        component: (resolve) => require(['@/views/config/people'], resolve),
        name: '人员配置',
        meta: { title: '人员配置', icon: 'edit' }
      }
    ]
  },
  {
    path: '/submit',
    component: Layout,
    hidden: false,
    redirect: 'noredirect',
    children: [
      {
        path: 'center',
        component: (resolve) => require(['@/views/submit'], resolve),
        name: '请假申请',
        meta: { title: '请假申请', icon: 'tab' }
      }
    ]
  },
  {
    path: '/holiday',
    component: Layout,
    hidden: false,
    redirect: 'noredirect',
    children: [
      {
        path: 'center',
        component: (resolve) => require(['@/views/holiday'], resolve),
        name: '请假记录',
        meta: { title: '请假记录', icon: 'tab' }
      }
    ]
  },
  {
    path: '/ref',
    component: Layout,
    hidden: false,
    redirect: 'noredirect',
    children: [
      {
        path: 'center',
        component: (resolve) => require(['@/views/holiday/ref'], resolve),
        name: '参考假日',
        meta: { title: '参考假日', icon: 'tab' }
      }
    ]
  },
  {
    path: '/real',
    component: Layout,
    hidden: false,
    redirect: 'noredirect',
    children: [
      {
        path: 'center',
        component: (resolve) => require(['@/views/holiday/real'], resolve),
        name: '实时假日',
        meta: { title: '实时假日', icon: 'tab' }
      }
    ]
  },
  {
    path: '/mydict',
    component: Layout,
    hidden: false,
    redirect: 'noredirect',
    children: [
      {
        path: 'center',
        component: (resolve) => require(['@/views/mydict'], resolve),
        name: '我的字典',
        meta: { title: '我的字典', icon: 'tab' }
      }
    ]
  }
]

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
