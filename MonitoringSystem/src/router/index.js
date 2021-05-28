import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/store'
import * as types from '../store/types'
import Home from '../components/Home'
Vue.use(VueRouter);

const routes = [{
		path: '/',
		name: 'login',
		component: resolve => require(['@/components/Login'], resolve)
	},
	 {
        path: '/',
        component: Home,
        redirect: '/Home',
        children: [{
            path: 'schematicDia',
            name: 'schematicDia',
            component: resolve => require(['@/views/schematicDia'], resolve),

        },{
        	path: 'parameterMon',
            name: 'parameterMon',
            component: resolve => require(['@/views/parameterMon'], resolve),

        },{
        	path: 'faultsInquiries',
            name: 'faultsInquiries',
            component: resolve => require(['@/views/faultsInquiries'], resolve),

        },{
        	path: 'trendCurve',
            name: 'trendCurve',
            component: resolve => require(['@/views/trendCurve'], resolve),

        },{
        	path: 'maintenance',
            name: 'maintenance',
            component: resolve => require(['@/views/maintenance'], resolve),

        },{
        	path: 'lifePart',
            name: 'lifePart',
            component: resolve => require(['@/views/lifePart'], resolve),

        },{
        	path: 'blank',
            name: 'blank',
            component: resolve => require(['@/views/blank'], resolve),

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
	 mode: 'history',  //去掉url中的#
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