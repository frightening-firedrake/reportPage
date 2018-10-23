<template>
    <div class='listpagewrap'>
      <!--面包屑-->
      <sinograin-breadcrumb :breadcrumb="breadcrumb" v-on:searchingfor="searchingfor"></sinograin-breadcrumb>
  	  <!--标题-->
  	  <sinograin-option-title :title="subtitle" v-on:titleEvent="titleEvent"></sinograin-option-title>		
      <!--提示-->
      <sinograin-prompt :alerts="alerts"></sinograin-prompt>
      <!--表单-->
      <select-report :taskList="taskList" :checkList="checkList" :checkedListAdd="checkedList" @getCheckedList="getCheckedList" @searchingfor="searchingfor"></select-report> 

    </div>
</template>

<style>
	
</style>

<script>

import SinograinPrompt from '@/components/common/prompt/Prompt.vue';
import SinograinBreadcrumb from '@/components/common/action/Breadcrumb.vue';

import SelectReport  from "@/components/common/action/SelectReport"

import SinograinOptionTitle from "@/components/common/action/OptionTitle"


import "@/assets/style/common/list.css"
import { mapState,mapMutations,mapGetters,mapActions} from 'vuex';
//本地测试要用下面import代码
//import data from '@/util/mock';



export default {
  components: {
    SinograinPrompt,SinograinBreadcrumb,SinograinOptionTitle,SelectReport

  },
  computed:{
	...mapState(["modal_id_number","viewdata","editdata","aultdata","messions","mask"]),
	...mapGetters(["modal_id"]),
  },
  created(){
//	console.log(this.$route.params)
	this.getTaskList()
  	
//  获取列表数据（第一页）
//	this.getlistdata(1)
//	this.getsampledata();
	
  },
  destroy(){

  },
  methods: {
  	...mapMutations(['create_modal_id','is_mask','create_modal','close_modal']),
  	...mapActions(['addAction']),
//	获取列表数据方法
  	getsampledata(){
  		var params={};
  		params.sampleState=2
  		this.loading=false;
  		// 获取列表数据（第？页）
		this.$http({
		    method: 'post',
			url: this.sampleURL,
			transformRequest: [function (data) {
				// Do whatever you want to transform the data
				let ret = ''
				for (let it in data) {
				ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
				}
				return ret
			}],
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data: {
				params:JSON.stringify(params)
			}
	    }).then(function (response) {
//			console.log(response)
		  	this.checkList=response.data.rows;
		  	if(this.$route.params.formdatas){
				this.checkedList=this.$route.params.tabledatas;
			}
//		  	this.checkedList=response.data.rows;
//	  		this.page.total=response.data.total;
		}.bind(this)).catch(function (error) {
		    console.log(error);
		}.bind(this));
  	},
//	获取列表数据方法
  	getlistdata(page){
  		this.loading=true;
  		// 获取列表数据（第？页）
		this.$http({
		    method: 'post',
			url: this.datalistURL,
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
//			data: {
//
//			}
	    }).then(function (response) {

//		  	this.tabledatas=response.data.rows;
//	  		this.page.total=response.data.total;
		  	
	  		setTimeout(()=>{			  		
		  		this.loading=false;
		  	},1000)
		}.bind(this)).catch(function (error) {
		    console.log(error);
		}.bind(this));
  	},
//	获取任务列表
  	getTaskList(){
//		var params = {};
//		params.pLibraryId = -1
  		// 获取列表数据（第？页）
		this.$http({
		    method: 'post',
			url: this.taskListURL,
			transformRequest: [function (data) {
				// Do whatever you want to transform the data
				let ret = ''
				for (let it in data) {
				ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
				}
				return ret
			}],
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data: {
//			    params: JSON.stringify(params)
			}
	   }).then(function (response) {
		  	this.taskList = response.data.rows;
		}.bind(this)).catch(function (error) {
		    console.log(error);
		}.bind(this));
  	},
//	获取搜索数据
  	searchingfor(searching){
//		console.log(searching)
  		this.searching=searching;
  		var params={};
  		params.taskName=searching;
  		params.detectionState=2;
  		this.loading=false;
  		// 获取列表数据（第？页）
		this.$http({
		    method: 'post',
			url: this.sampleURL,
			transformRequest: [function (data) {
				// Do whatever you want to transform the data
				let ret = ''
				for (let it in data) {
				ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
				}
				return ret
			}],
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data: {
//				params:JSON.stringify(params)
				taskName:searching
			}
	    }).then(function (response) {
//			console.log(response)
		  	this.checkList=response.data.sort((a,b)=>{
		  		return a.sampleNum-b.sampleNum;
		  	});
		  	if(this.$route.params.formdatas){
				this.checkedList=this.$route.params.tabledatas;
			}
//		  	this.checkedList=response.data.rows;
//	  		this.page.total=response.data.total;
		}.bind(this)).catch(function (error) {
		    console.log(error);
		}.bind(this));
  	},
	titleEvent(){
  		console.log('titleEvent');
  	},
  	getCheckedList(checkedList){
  		var path=this.$route.name
  		var end=path.lastIndexOf('/');
  		path=path.slice(0,end);

		this.$router.push({name: path,params: {formdatas:this.$route.params.formdatas,tabledatas:checkedList,searching:this.searching}})
  	},
  },
  data() {
    return {
      sampleURL:this.apiRoot + '/grain/sample/findSamplesByTask',
	  taskListURL:this.apiRoot + '/grain/task/data',
      searchURL:'/liquid/role2/data/search',
      deleteURL:'/liquid/role2/data/delete',
      checkedId:[],
	  createlibVisible:false,
      breadcrumb:{
      	search:false,   
      	searching:'',
      },
      subtitle:{
      	btn:false,
      	btntext:'',
      },
//    弹窗数据
      alerts: [{
        title: '温馨提示：选择任务名称后可获取到相关任务中已检测完成的样品检验编号!',
        type: 'info'
      }],
      checkList:[],
	  checkedList:[],
      searching:'',
      taskList:[],
    }
  }
}
</script>
