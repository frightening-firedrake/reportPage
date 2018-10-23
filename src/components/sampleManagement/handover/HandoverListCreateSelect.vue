<template>
    <div class='listpagewrap'>
      <!--面包屑-->
      <sinograin-breadcrumb :breadcrumb="breadcrumb" v-on:searchingfor="searchingfor"></sinograin-breadcrumb>
  	  <!--标题-->
  	  <sinograin-option-title :title="subtitle" v-on:titleEvent="titleEvent"></sinograin-option-title>		
      <!--提示-->

      <!--<sinograin-prompt :alerts="alerts"></sinograin-prompt>-->
      <!--表单-->
      <select-checklist :checkList="checkList" :checkedListAdd="checkedList" @getCheckedList="getCheckedList" @changeIsChecked="changeIsChecked"></select-checklist> 

    </div>
</template>

<style>
	
</style>

<script>

import SinograinPrompt from '@/components/common/prompt/Prompt.vue';
import SinograinBreadcrumb from '@/components/common/action/Breadcrumb.vue';

import SelectChecklist  from "@/components/common/action/SelectChecklist"

import SinograinOptionTitle from "@/components/common/action/OptionTitle"


import "@/assets/style/common/list.css"
import { mapState,mapMutations,mapGetters,mapActions} from 'vuex';
//本地测试要用下面import代码
//import data from '@/util/mock';



export default {
  components: {
    SinograinPrompt,SinograinBreadcrumb,SinograinOptionTitle,SelectChecklist

  },
  computed:{
	...mapState(["modal_id_number","viewdata","editdata","aultdata","messions","mask"]),
	...mapGetters(["modal_id"]),
  },
  created(){
//	console.log(this.$route.params.)
  	
//  获取列表数据（第一页）
//	this.getlistdata(1)
	this.getsampledata();

  },
  destroy(){

  },
  methods: {
  	...mapMutations(['create_modal_id','is_mask','create_modal','close_modal']),
  	...mapActions(['addAction']),
//	获取列表数据方法
  	getsampledata(){
  		var params={};
  		params.sampleWordOrsampleNumLike='';
//		if(!this.IsChecked){  			
//			params.ruKuSampleState=2;
  			params.sampleState=2;
//			params.fenxiaoyangSampleState=3;
  			params.sort=this.$route.params.formdatas.form.sort;
//		}else if(this.IsChecked==2){
//			params.ruKuSampleState=2;
//		}else if(this.IsChecked==3){
//			params.fenxiaoyangSampleState=3;			
//		}
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
		  	this.checkList=response.data.rows.sort((a,b)=>{
		  		return a.sampleNum-b.sampleNum;
		  	});
		  	if(this.$route.params.formdatas){
				this.checkedList=this.$route.params.formdatas.items;
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
//	获取搜索数据
  	searchingfor(searching){
  		console.log(searching);
  		// 获取列表数据（第？页）
		this.$http({
		    method: 'post',
			url: this.searchURL,
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
//			data: {
//			   
//			}
	    }).then(function (response) {
//		  	this.tabledatas=response.data.rows;
	  		setTimeout(()=>{			  		
		  		this.loading=false;
		  	},1000)
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
  		this.$route.params.formdatas.items=checkedList
		this.$router.push({name: path,params: {formdatas:this.$route.params.formdatas}})
  	},
  	changeIsChecked(val){
  		this.IsChecked=val
  	},
  },
  data() {
    return {
      sampleURL:this.apiRoot + '/grain/sample/data',
      searchURL:'/liquid/role2/data/search',
      deleteURL:'/liquid/role2/data/delete',
      checkedId:[],
      IsChecked:2,
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
//    alerts: [{
//      title: '温馨提示：此页面灰色字为不可编辑状态!',
//      type: 'info'
//    }],
      checkList:[],
	  checkedList:[],

    }
  }
}
</script>
