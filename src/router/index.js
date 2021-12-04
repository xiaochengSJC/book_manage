import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('../components/page/login.vue')
    },
   {
      path: '/index',
      name: 'index',
      component: () => import('../components/index.vue'),
      redirect: '/main',
      children: [
            { path: '/main',
             name: 'main',
             component: () => import('../components/main.vue')
             },
            { path: '/book',
             name: 'book_manage',
             component: () => import('../components/page/bookManage.vue')
             },
            { path: '/type',
              name: 'book_type',
              component: () => import('../components/page/bookType.vue')
            },
            { path: '/search',//查询书籍 =用户
              name: 'search_book',
              component: () => import('../components/page/searchBook.vue')
            },
            { path: '/reader',
              name: 'reader_manage',
              component: () => import('../components/page/readerManage.vue')
            },
            { path: '/record',//借还记录 --管理员
             name: 'borrow_record',
             component: () => import('../components/page/borrowRecord.vue')
            },
            { path: '/borrow', //借书记录--用户
              name: 'borrow_search',
              component: () => import('../components/page/borrowSearch.vue')
            },
            { path: '/history',//借还书历史--用户
              name: 'borrow_history',
              component: () => import('../components/page/borrowHistory.vue')
            },
            { path: '/user',
              name: 'user_info',
              component: () => import('../components/page/userInfo.vue')
            },
            { path: '/pass',
              name: 'change_password',
              component: () => import('../components/page/changePassword.vue')
            }
          ]
    },

  ]
})
