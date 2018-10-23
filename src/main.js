import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import './assets/style/common/common.css'
import './assets/style/fonts/iconfont.css'
import './assets/style/fonts/font.css'
import 'element-ui/lib/theme-chalk/display.css'
import store from './store/index'
import axios from 'axios'
import router from './router/index'
//import 'vue2-animate/dist/vue2-animate.min.css';

Vue.use(ElementUI);
//Vue.prototype.apiRoot = 'http://m.ityyedu.com'
//Vue.prototype.apiRoot = 'http://192.168.1.233:8080'//deng
//Vue.prototype.apiRoot = 'http://192.168.1.230:80'//xuan
   Vue.prototype.apiRoot = 'http://192.168.1.253:8080'//bo
//Vue.prototype.apiRoot = 'http://192.168.1.248:8080'//bo旧
//Vue.prototype.apiRoot = 'http://192.168.1.176:8082'
//Vue.prototype.apiRoot = 'http://192.168.1.252:8083'//kun
//axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
//axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded'
//axios.defaults.withCredentials=true;
axios.interceptors.request.use(function (response) {
	if (store.getters.Token) {
	  response.headers.Authorization= store.getters.Token
	}	
//	console.log(response)
    return response;
}, function (error) {
//	console.log(error)
    return Promise.reject(error);
});


//axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.interceptors.response.use(function (response) {
//  console.log('全局的拦截测试，好简单')
//	console.log(response.data.code==1000000)
	if(response.data.code==1000000){

//		console.log(store.state.userName)
		store.state.libraryName='';
		store.state.libraryId='';
		store.state.userName='';
		store.state.userId='';
		store.state.userAuth='';
		sessionStorage.removeItem('libraryId');
		sessionStorage.removeItem('libraryName');
		sessionStorage.removeItem('userName');
		sessionStorage.removeItem('userId');
		sessionStorage.removeItem('userAuth');
		sessionStorage.removeItem('Token');
		sessionStorage.removeItem('permissions');
		sessionStorage.removeItem('breadcrumbHistory');
//		console.log(store.state.userName)
		app.$router.push({ path: '/login'});
		
	}
	if(response.data.access=='unauthorized'){
		app.$notify.error({
          	title: '错误',
          	message: '你没有权限进行此项操作！！！'
        });
        throw "你没有权限进行此项操作！！！";
//      app.$alert('你没有权限进行此项操作！！！', '错误', {
//        confirmButtonText: '确定',
//        callback: action => {
//          
//        }
//      });
//		alert('你没有权限进行此项操作！！！')
	}
    return response;
}, function (error) {
//		console.log(error)

//		console.log(error.response.status)
//			if(error)
//			this.$router.replace({path: '/403'})  
    return Promise.reject(error);
});
Vue.prototype.$http=axios;
/**权限指令**/
//控制点击事件
Vue.directive('permissionClick', {
   	bind: (el, binding, vnode) => {
		el.addEventListener('click', (e) => {
   			if (!Vue.prototype.$_has(binding.value.auth)) {
    			app.$notify.error({
		          	title: '错误',
		          	message: '你没有权限进行此项操作！！！'
		        });
   			}else{
    			binding.value.fun()
   			}
		})
   	}
})
//控制是否显示
Vue.directive('permission-show', {
	bind: function(el, binding) {
    	if (!Vue.prototype.$_has(binding.value)) {
      		el.parentNode.removeChild(el);
    	}
	}
});
//权限检查方法
Vue.prototype.$_has = function(value) {
	let isExist=false;
	let buttonpermsStr=store.getters.permissions;
	if(!buttonpermsStr){
    	isExist=false;
	}else{
		buttonpermsStr=buttonpermsStr.split(',');
		if(buttonpermsStr.includes(value)){
			isExist=true;
		}else{
			isExist=false;
		}
	}
	
	return isExist;
};
//方法内权限判断
Vue.prototype.$_ault_alert = function(value) {
	let buttonpermsStr=store.getters.permissions;
	if(!buttonpermsStr){
    	app.$notify.error({
	      	title: '错误',
	      	message: '你没有权限进行此项操作！！！'
	    });
		return false
//      throw "——";
	}else{
		buttonpermsStr=buttonpermsStr.split(',');
		if(buttonpermsStr.includes(value)){
			return true
		}else{
			app.$notify.error({
		      	title: '错误',
		      	message: '你没有权限进行此项操作！！！'
		    });
			return false
//      	throw "——";
		}
	}
};

var app=new Vue({
  el: '#app',
  router,//使用路由
  store,//使用store
  render: h => h(App),
  data:{
  	eventHub:new Vue(),//添加事件中心
  },
  
})
