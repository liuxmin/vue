import {createApp} from 'vue'
import {createPinia} from 'pinia'

import App from './App.vue'
import router from './router'

import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from "@element-plus/icons-vue"
import 'element-plus/dist/index.css'
import zhCn from "element-plus/es/locale/lang/zh-cn"

import './permission'
import store from "./stores";

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(ElementPlus, {locale: zhCn, components: ElementPlusIconsVue})

app.use(store)

app.mount('#app')
