import { createRouter, createWebHistory } from 'vue-router'
import Editor from '../components/Editor.vue'
import Generator from '../components/Generator.vue'
import FontBuilder from '../components/FontBuilder.vue'
import StyleBuilder from '../components/StyleBuilder.vue'
import About from '../pages/About.vue'

const routes = [
  {
    path: '/',
    name: 'Editor',
    component: Editor
  },
  {
    path: '/generator',
    name: 'Generator',
    component: Generator
  },
  {
    path: '/font-builder',
    name: 'Font Builder',
    component: FontBuilder
  },
  {
    path: '/style-builder',
    name: 'Style Builder',
    component: StyleBuilder
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
