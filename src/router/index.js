import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home/Home'
import ProjectPage from '@/views/ProjectPage/ProjectPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/project/:name',
      name: 'ProjectPage',
      component: ProjectPage
    }
  ]
})
