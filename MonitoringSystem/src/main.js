// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Router from 'vue-router'
import App from './App'
import router from './router'
import store from './store/store'
import axios from './http'
import Vuex from 'vuex'
import * as types from './store/types'
import './assets/css/public.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Home from './components/Home'
import util from './utils/common/util'
import axiosUtil from './utils/axios/axios'
import clipboard from 'clipboard'
import Centrifuge from 'centrifuge'
import echarts from 'echarts'
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
Vue.use(Vuex);
Vue.use(Router);
Vue.use(ElementUI);　　　
Vue.prototype.clipboard = clipboard;

Vue.prototype.$util = util;
Vue.prototype.$get = axiosUtil.axiosGet;
Vue.prototype.$post = axiosUtil.axiosPost;
Vue.prototype.$delete = axiosUtil.axiosDelete;
Vue.prototype.store = store;
Vue.prototype.$echarts = echarts
Vue.config.productionTip = false;
Vue.use(Viewer);
var centrifuge = new Centrifuge("ws://216.24.249.93:8000/connection/websocket", {

	debug: true
});

centrifuge.connect();

var subscription = centrifuge.subscribe("alarmdata", function(message) {
	if(message.data.timestamp){
		store.commit(types.ALARMDATA, message.data);
	}


});
var subscription = centrifuge.subscribe("keepdata", function(message) {
	if(message.data.online!=1){
		store.commit(types.KEEPDATA, []);
	}else{
		store.commit(types.KEEPDATA, message.data.data);
	}
	store.commit(types.BASEDATA, message.data.data);
	
});
Vue.prototype.centrifuge = centrifuge;
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