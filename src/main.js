import Vue from 'vue'
import App from './App.vue'
import router from './router'
import FastClick from 'fastclick'
import VuePreview from 'vue-preview'

FastClick.attach(document.body)

Vue.config.productionTip = false

Vue.use(VuePreview);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
