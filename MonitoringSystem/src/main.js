// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Router from 'vue-router'
import App from './App'
import router from './router'
import store from './store/store'
import axios from './http'
import Vuex from 'vuex'
import './assets/css/public.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Home from './components/Home'
import util from './utils/common/util'
import axiosUtil from './utils/axios/axios'
import clipboard from 'clipboard'
import Centrifuge from 'centrifuge'
Vue.use(Vuex);
Vue.use(Router);
Vue.use(ElementUI);　　　
Vue.prototype.clipboard = clipboard;
Vue.prototype.$util = util;
Vue.prototype.$get = axiosUtil.axiosGet;
Vue.prototype.$post = axiosUtil.axiosPost;
Vue.prototype.$delete = axiosUtil.axiosDelete;
Vue.prototype.store = store;
Vue.config.productionTip = false;
Vue.prototype.Centrifuge = new Centrifuge('ws://centrifuge.example.com/connection/websocket');
 
Vue.prototype.Centrifuge.setToken(localStorage.getItem('token'));
/* eslint-disable no-new */
new Vue({
	el: '#app',
	axios,
	router,
	store,
	components: {
		App
	},
	template: '<App/>'
});