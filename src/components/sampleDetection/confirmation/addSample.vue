<template>
    <div class='listpagewrap'>
      <!--面包屑-->
      <sinograin-breadcrumb :breadcrumb="breadcrumb" v-on:searchingfor="searchingfor"></sinograin-breadcrumb>
  	  <!--标题-->
  	  <sinograin-option-title :title="subtitle" v-on:titleEvent="titleEvent"></sinograin-option-title>		
      <!--提示-->
      <sinograin-prompt :alerts="alerts"></sinograin-prompt>
      <!--表单-->
      <select-confirmation :taskList="taskList" :checkList="checkList" :checkedListAdd="checkedList" @getCheckedList="getCheckedList" @searchingfor="searchingfor"></select-confirmation> 

    </div>
</template>

<style>
	
</style>

<script>

import SinograinPrompt from '@/components/common/prompt/Prompt.vue';
import SinograinBreadcrumb from '@/components/common/action/Breadcrumb.vue';

import SelectConfirmation  from "@/components/common/action/SelectConfirmation"

import SinograinOptionTitle from "@/components/common/action/OptionTitle"


import "@/assets/style/common/list.css"
import { mapState,mapMutations,mapGetters,mapActions} from 'vuex';
//本地测试要用下面import代码
//import data from '@/util/mock';



export default {
  components: {
    SinograinPrompt,SinograinBreadcrumb,SinograinOptionTitle,SelectConfirmation

  },
  computed:{
	...mapState(["modal_id_number","viewdata","editdata","aultdata","messions","mask"]),
	...mapGetters(["modal_id"]),
  },
  created(){
//	console.log(this.$route.params)
	this.checkPoint=this.$route.params.checkPoint
	this.sort=this.$route.params.sort
	this.getTaskList()
  	
//  获取列表数据（第一页）
//	this.getlistdata(1)
	this.getsampledata();
	if(!this.$route.params.sort){
		this.$router.push({name:"样品检测/样品确认单列表"})		
	}
  },
  destroy(){

  },
  methods: {
  	...mapMutations(['create_modal_id','is_mask','create_modal','close_modal']),
  	...mapActions(['addAction']),
//	获取列表数据方法
  	getsampledata(){
  		var params={};
  		params.sort=this.sort;
  		params.checkPoint=this.checkPoint;
  		this.loading=true;
  		// 获取列表数据（第？页）
		this.$http({
		    method: 'post',
			url: this.dataURL,
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
				sort:this.sort,
				testItem:this.checkPoint,
				taskName:this.$route.params.searching,
			}
	    }).then(function (response) {
  			this.loading=false;
//			console.log(response)
			response.data.forEach((value)=>{
		  		value.result=''
		  		value.result2=''
		  		value.result3=''
		  		value.result4=''
		  		value.result5=''
		  	});
		  	this.checkList=response.data;
//		  	if(this.$route.params.tabledatas){
//				this.checkedList=this.$route.params.tabledatas;
//			}
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
  		params.checkPoint=this.$route.params.checkPoint;
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
//			console.log(response.data)
		  	response.data.forEach((value)=>{
		  		value.result=''
		  		value.result2=''
		  		value.result3=''
		  		value.result4=''
		  		value.result5=''
		  	});
//		  	console.log(response.data)
		  	this.checkList=response.data
//		  	console.log(this.checkList)
//		  	if(this.$route.params.tabledatas){
//				this.checkedList=this.$route.params.tabledatas;
//			}
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
		var params={};
		params.tabledatas=checkedList;
		params.searching==this.$route.params.searching;
		params.sort=this.$route.params.sort;
		params.checkPoint=this.$route.params.checkPoint;
		this.$router.push({name: path,params:params})
  	},
  },
  data() {
    return {
      dataURL:this.apiRoot+'/grain/testItem/getSampleBySortAndTestItem',
      sampleURL:this.apiRoot + '/grain/sample/findSamplesByTask',
	  taskListURL:this.apiRoot + '/grain/task/data',
      searchURL:'/liquid/role2/data/search',
      deleteURL:'/liquid/role2/data/delete',
      checkedId:[],
      checkPoint:'',
      sort:'',
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
        title: '温馨提示：选择任务名称后可获取到相关任务中的样品检验编号!',
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
