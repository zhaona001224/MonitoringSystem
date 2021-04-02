import Vue from 'vue';
import Vuex from 'vuex';
import * as types from './types'
Vue.use(Vuex);
export default new Vuex.Store({
	state: {
		token: null, //登录token
		userName: "",
		screenHeight: window.screen.height,
		imgUrl: window.imgUrl,
		baseUrl: window.origin.indexOf('localhost') > -1 ?
			'http://216.24.249.93:8080' : 'https://support.bk.cloudns.cc:8081',
		baseData: {}
	},
	mutations: {

		[types.LOGIN]: (state, data) => {
			localStorage.token = data;
			state.token = data;
		},
		[types.LOGINDATA]: (state, data) => {
			localStorage.loginData = data;
			state.loginData = data;
		},
		[types.LOGOUT]: (state) => {
			localStorage.removeItem('token');
			localStorage.removeItem('loginData');
			localStorage.removeItem('configData');
			document.cookie = ''
			state.token = null;

		},
		[types.CONFIGDATA]: (state, data) => {
			localStorage.configData = data;
			state.configData = data;
		},
		[types.UID]: (state, data) => {
			localStorage.uid = data;
			state.uid = data;
		},
		[types.OID]: (state, data) => {
			localStorage.oid = data;
			state.oid = data;
		},
		[types.BASEDATA]: (state, data) => {
			localStorage.baseData = data;
			state.baseData = data;
		},
		[types.ALARMDATA]: (state, data) => {
			localStorage.alarmData = data;
			state.alarmData = data;
		}
	}

});

//export default store