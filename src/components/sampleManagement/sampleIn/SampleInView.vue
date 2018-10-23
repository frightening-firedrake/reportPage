<template>
    <div class='listpagewrap'>
      <!--面包屑-->
      <sinograin-breadcrumb :breadcrumb="breadcrumb" v-on:searchingfor="searchingfor"></sinograin-breadcrumb>
  	  <!--标题-->
  	  <sinograin-option-title :title="subtitle" v-on:titleEvent="titleEvent"></sinograin-option-title>		
      <!--提示-->
      <sinograin-prompt :alerts="alerts"></sinograin-prompt>
      <!--表单-->
      <sample-form :formdatas="formdatas" @submit="submit"></sample-form> 
    </div>
</template>

<style>
	
</style>

<script>

import SinograinPrompt from '@/components/common/prompt/Prompt.vue';
import SinograinBreadcrumb from '@/components/common/action/Breadcrumb.vue';
import SampleForm  from "@/components/common/action/SampleForm"
import SinograinOptionTitle from "@/components/common/action/OptionTitle"


import "@/assets/style/common/list.css"
import { mapState,mapMutations,mapGetters,mapActions} from 'vuex';
//本地测试要用下面import代码
//import data from '@/util/mock';



export default {
  components: {
    SinograinPrompt,SinograinBreadcrumb,SinograinOptionTitle,SampleForm
  },
  computed:{
	...mapState(["modal_id_number","viewdata","editdata","aultdata","messions","mask"]),
	...mapGetters(["modal_id"]),
  },
  created(){
//  获取列表数据（第一页）
	this.getlistdata()
  },
  destroy(){

  },
  methods: {
  	...mapMutations(['create_modal_id','is_mask','create_modal','close_modal']),
  	...mapActions(['addAction']),
//	获取列表数据方法
  	getlistdata(){
  		this.loading=false;
  		// 获取列表数据（第？页）
		this.$http({
		  method: 'post',
			url: this.getdataURL,
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
          id: this.$route.query.id,
			}
	    }).then(function (response) {
	    	var res=response.data;
	    	res.sampleNum="监"+res.sampleNum;
		  	this.formdatas.form=res;
		  	this.formdatas.title=res.formName;
//		  	res.pLibraryName='';
//				this.getlibrarydata()
		}.bind(this)).catch(function (error) {
		    console.log(error);
		}.bind(this));
  	},
		//	获取库列表数据方法
  	getlibrarydata(){
  		this.loading=false;
  		// 获取列表数据（第？页）
		this.$http({
		  method: 'post',
			url: this.getlibraryURL,
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
          id: this.formdatas.form.pLibraryId,
			}
	    }).then(function (response) {
		  	this.formdatas.form.pLibraryName=response.data.libraryName;
//				console.log(this.formdatas.form)
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
//	  		setTimeout(()=>{			  		
		  		this.loading=false;
//		  	},1000)
		}.bind(this)).catch(function (error) {
		    console.log(error);
		}.bind(this));
  	},
	//提交表单
	submit(){
		if(!this.$_ault_alert('sample:edit')){
			return
		}
	this.$http({
		  method: 'post',
			url: this.editURL,
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
        		id: this.$route.query.id,
				storageTime: this.formdatas.form.storageTime,
				autograph:this.formdatas.form.autograph,
			}
	    }).then(function (response) {
      	this.$router.go(-1);//提交完成返回上一页
		  	
	  		// setTimeout(()=>{			  		
		  	// 	this.loading=false;
		  	// },1000)
		}.bind(this)).catch(function (error) {
		    console.log(error);
		}.bind(this));
	},
	titleEvent(){
  		console.log('titleEvent');
  	},
  },
  data() {
    return {
      getdataURL:this.apiRoot + '/grain/sample/get',
			editURL: this.apiRoot + '/grain/sample/edit',
			getlibraryURL: this.apiRoot + '/grain/library/get',
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
        title: '温馨提示：此页面灰色字为不可编辑状态!',
        type: 'info'
      }],
      formdatas: {
      	title:'中央储备粮襄垣直属库',
      	readonly:true,
      	form:{
//        createTime: '',//创建时间
//        sampleState: '',//状态
//        sampleNo: '',//迁样编号
//        libraryName: '',//被查库点
//        position: '',//货位号
//        sort: '',//品种
//        quality: '',//性质
//        amount: '',//代表数量
//        originPlace: '',//产地
//        gainTime: '',//收货年度
//        sampleTime: '',//扦样日期
//        remark: '',//备注
//        storageStatus:'',
//        sampleInTime: "",
//        sampleInSign: "",
//        code:""
      	},
      	submitText:'确定',
	  }
    }
  }
}
</script>

