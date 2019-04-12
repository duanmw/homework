import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
export const constantRouterMap = [{
  path: '/login',
  name: 'login',
  component: () => import('@/views/login/index'),
  hidden: true
},
{
  path: '/register',
  component: () => import('@/views/login/index'),
  hidden: true
},
{
  path: '/404',
  component: () => import('@/views/404'),
  hidden: true
}
]
export const asyncRouterMap = [{
  path: '/',
  component: Layout,
  redirect: '/home',
  name: 'Home',
  meta: {
    title: '首页',
    icon: 'home',
    roles: ['teacher']
  },
  children: [{
    path: 'home',
    component: () => import('@/views/home/teacher')
  }]
},
{
  path: '/',
  component: Layout,
  redirect: '/home',
  name: 'Home',
  meta: {
    title: '首页',
    icon: 'home',
    roles: ['student']
  },
  children: [{
    path: 'home',
    component: () => import('@/views/home/student')
  }]
},
{
  path: '/course',
  redirect: '/course/index',
  component: Layout,
  meta: {
    roles: ['teacher']
  },
  children: [{
    path: 'index',
    name: 'Course',
    component: () => import('@/views/course/teacher'),
    meta: {
      title: '课程',
      icon: 'course'
    }
  }]
},
{
  path: '/homework',
  redirect: '/homework/index',
  component: Layout,
  meta: {
    roles: ['teacher']
  },
  children: [{
    path: 'index',
    name: 'Homework',
    component: () => import('@/views/homework/index'),
    meta: {
      title: '作业',
      icon: 'homework'
    }
  },
  {
    path: 'addhomework',
    // redirect: ':wid/question',
    name: 'addHomework',
    component: () => import('@/views/homework/addHomework'),
    hidden: true,
    meta: {
      title: '添加作业'
    // icon: 'homework'
    }
  },
  {
    path: ':wid',
    // redirect: ':wid/question',
    name: 'Question',
    component: () => import('@/views/homework/question'),
    hidden: true,
    meta: {
      title: '作业习题'
    // icon: 'homework'
    }
  }]
},
{
  path: '/student',
  redirect: '/student/index',
  component: Layout,
  meta: {
    roles: ['teacher']
  },
  children: [{
    path: 'index',
    name: 'Student',
    component: () => import('@/views/student/index'),
    meta: {
      title: '学生',
      icon: 'student'
    }
  },
  {
    path: 'addstudent',
    name: 'addStudent',
    component: () => import('@/views/student/addStudent'),
    hidden: true,
    meta: {
      title: '导入学生'
    }
  }]
},
{
  path: '/profile',
  redirect: '/profile/index',
  component: Layout,
  children: [{
    path: 'index',
    name: 'Profile',
    component: () => import('@/views/profile/index'),
    meta: {
      title: '个人中心',
      icon: 'profile'
    }
  }]
},
{
  path: '/manage',
  redirect: '/manage/course',
  component: Layout,
  meta: {
    roles: ['admin'],
    title: '管理',
    icon: 'manage1'
  },
  children: [{
    path: 'course',
    name: 'courseManage',
    component: () => import('@/views/manage/course'),
    meta: {
      title: '课程管理',
      icon: 'course'
    }
  },
  {
    path: 'homework',
    name: 'homeworkManage',
    component: () => import('@/views/manage/homework'),
    meta: {
      title: '作业管理',
      icon: 'homework'
    }
  },
  {
    path: 'user',
    name: 'userManage',
    component: () => import('@/views/manage/user'),
    meta: {
      title: '用户管理',
      icon: 'user'
    }
  }]
},
// {
//   path: '/form',
//   component: Layout,
//   children: [{
//     path: 'index',
//     name: 'Form',
//     component: () => import('@/views/form/index'),
//     meta: {
//       title: 'Form',
//       icon: 'form'
//     }
//   }]
// },

// {
//   path: '/nested',
//   component: Layout,
//   redirect: '/nested/menu1',
//   name: 'Nested',
//   meta: {
//     title: 'Nested',
//     icon: 'nested'
//   },
//   children: [{
//     path: 'menu1',
//     component: () => import('@/views/nested/menu1/index'), // Parent router-view
//     name: 'Menu1',
//     meta: {
//       title: 'Menu1'
//     },
//     children: [{
//       path: 'menu1-1',
//       component: () => import('@/views/nested/menu1/menu1-1'),
//       name: 'Menu1-1',
//       meta: {
//         title: 'Menu1-1'
//       }
//     },
//     {
//       path: 'menu1-2',
//       component: () => import('@/views/nested/menu1/menu1-2'),
//       name: 'Menu1-2',
//       meta: {
//         title: 'Menu1-2'
//       },
//       children: [{
//         path: 'menu1-2-1',
//         component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
//         name: 'Menu1-2-1',
//         meta: {
//           title: 'Menu1-2-1'
//         }
//       },
//       {
//         path: 'menu1-2-2',
//         component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
//         name: 'Menu1-2-2',
//         meta: {
//           title: 'Menu1-2-2'
//         }
//       }
//       ]
//     },
//     {
//       path: 'menu1-3',
//       component: () => import('@/views/nested/menu1/menu1-3'),
//       name: 'Menu1-3',
//       meta: {
//         title: 'Menu1-3'
//       }
//     }
//     ]
//   },
//   {
//     path: 'menu2',
//     component: () => import('@/views/nested/menu2/index'),
//     meta: {
//       title: 'menu2'
//     }
//   }
//   ]
// },

// {
//   path: 'external-link',
//   component: Layout,
//   children: [{
//     path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
//     meta: {
//       title: 'External Link',
//       icon: 'link'
//     }
//   }]
// },

{
  path: '*',
  redirect: '/404',
  hidden: true
}
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})
