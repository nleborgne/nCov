import Vue from 'vue'
import App from './App.vue'

// Bootstrap
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.use(BootstrapVue)

// Axios
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)

import {Select, Option} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.component(Select.name, Select)
Vue.component(Option.name, Option)

// set language to EN
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'

locale.use(lang)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
