import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/store'
import * as types from '../store/types'
import Home from '../components/Home'
Vue.use(VueRouter);

const routes = [{
		path: '/login',
		name: 'login',
		component: resolve => require(['@/components/Login'], resolve)
	},
	 {
        path: '/',
        component: Home,
        redirect: '/Home',
        children: [{
            path: 'schematicDia',
            name: '首页',
            component: resolve => require(['@/views/schematicDia'], resolve),

        }]
    },
	

];

if (window.localStorage.getItem('userName')) {
	store.commit(types.LOGINDATA, window.localStorage.getItem('loginData'));
}
if (window.localStorage.getItem('configData')) {
	store.commit(types.CONFIGDATA, window.localStorage.getItem('configData'));
}
if (window.localStorage.getItem('loginData')) {
	store.commit(types.LOGINDATA, window.localStorage.getItem('loginData'));
}

const router = new VueRouter({
	routes
});

//未登录状态返回登录页进行登录
router.beforeEach((to, from, next) => {
	/*if (to.matched.some(r => r.meta.requireAuth)) {
	  if (store.state.token) {
	    next();
	  } else {
	    next({name: 'login'})
	  }
	} else {
	  next();
	}*/
	next();
});

export default router;