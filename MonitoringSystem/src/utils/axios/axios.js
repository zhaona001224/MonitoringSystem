/**
 * axios封装
 */

import axios from 'axios'
import router from '../../router'
import qs from 'query-string';
import ElementUI from 'element-ui';
import Vue from 'vue'
Vue.use(ElementUI);
import crypto from "crypto";
import * as types from '@/store/types'
window.imgUrl = 'http://support.bk.cloudns.cc:8080/admin/v1/file?id=';
var config = "http://support.bk.cloudns.cc:8080";
if(window.origin.indexOf('localhost') > -1) {
	var config = "/api";
	window.imgUrl = 'http://support.bk.cloudns.cc:8080/admin/v1/file?id=';
}
/**
 * axios请求拦截器
 * @param {object} config axios请求配置对象
 * @return {object} 请求成功或失败时返回的配置对象或者promise error对象
 **/
let loading;
let i = 0;
axios.interceptors.request.use(config => {
	config.headers.lqcms_token = localStorage.token;
	if(config.url.indexOf('/payment/paypal/info/' == -1)) {
		i++;

		loading = Vue.prototype.$loading({
			lock: true,
			text: '',
			spinner: 'el-icon-loading',
			background: 'rgba(0, 0, 0,0)'
		});

	}

	return config;
}, error => {
	return Promise.reject(error);
})

/**
 * axios 响应拦截器
 * @param {object} response 从服务端响应的数据对象或者error对象
 * @return {object} 响应成功或失败时返回的响应对象或者promise error对象
 **/

axios.interceptors.response.use(response => {
	i--
	if(i <= 0) {
		loading.close();
	}
	if(response.data && typeof response.data == "object") {
		if(response.data.retCode === -1) {
			errorMessaage(response.data.msg || response.data.message, true);
			return Promise.reject(response);
		}
	}
	return response.data;
}, error => { //响应错误处理
	i--
	if(i <= 0) {
		loading.close();
	}
	if(error.response) {
		Vue.prototype.$message({
				message: '网络错误!',
				type: 'error'
			})
	}
	return Promise.reject(error);
})

//弹出框配置
const errorOptionsPushPage = {
	type: "error",
	confirmButtonText: "返回登录页面",
	callback: backLogin,
	showClose: false,
	center: true
}
const errorOptionsNoPushPage = {
	type: "error",
	confirmButtonText: "确定",
	showClose: true,
	center: true
}
//返回首页方法
function backLogin() {
	router.replace({
		name: 'login'
	});
}
//弹出错误信息弹框
//function errorMessaage(msg, noPushPageFlag) {
//	if(noPushPageFlag) {
//		ElementUI.MessageBox.alert(msg, errorOptionsNoPushPage);
//	} else {
//		ElementUI.MessageBox.alert(msg, errorOptionsPushPage);
//	}
//}

export default {
	axiosGet(url, params) {
		return new Promise(function(resolve, reject) {
			axios.get(config + url, params).then((response) => {
				resolve(response);
			})
		})
	},
	axiosPost(url, params) {
		return new Promise(function(resolve, reject) {

			axios.post(config + url, params).then((response) => {
				resolve(response);
			})
		})
	},
	axiosDelete(url, params) {
		return new Promise(function(resolve, reject) {

			axios.delete(config + url, {
				data: params
			}).then((response) => {
				resolve(response);
			})
		})
	}
}