<template>
    <div class='listpagewrap'>
      <!--面包屑-->
      <sinograin-breadcrumb :breadcrumb="breadcrumb" v-on:searchingfor="searchingfor"></sinograin-breadcrumb>
  	  <!--标题-->
  	  <sinograin-option-title :title="subtitle" v-on:titleEvent="titleEvent"></sinograin-option-title>		
      <!--提示-->
      <!--<sinograin-prompt :alerts="alerts"></sinograin-prompt>-->
      <!--表单-->
      <safety-form :uploadPicURL="uploadPicURL" :formdatas="formdatas" v-on:addproblem="addproblem" @submit="submit" @delproblem="delproblem" ></safety-form> 
    </div>
</template>

<style>
	
</style>

<script>

import SinograinPrompt from '@/components/common/prompt/Prompt.vue';
import SinograinBreadcrumb from '@/components/common/action/Breadcrumb.vue';
import SafetyForm  from "@/components/common/action/SafetyForm"
import SinograinOptionTitle from "@/components/common/action/OptionTitle"


import "@/assets/style/common/list.css"
import { mapState,mapMutations,mapGetters,mapActions} from 'vuex';
//本地测试要用下面import代码
//import data from '@/util/mock';



export default {
  components: {
    SinograinPrompt,SinograinBreadcrumb,SinograinOptionTitle,SafetyForm
  },
  computed:{
	...mapState(["modal_id_number","viewdata","editdata","aultdata","messions","mask"]),
	...mapGetters(["modal_id","userName"]),
  },
  created(){
  	console.log(this.$route.query)
	this.formdatas.form.libraryName = this.$route.query.libraryName
	this.formdatas.form.position = this.$route.query.position
	this.formdatas.form.rummager = this.userName
//  获取列表数据（第一页）
//	this.getlistdata(1)

  },
  destroy(){

  },
  methods: {
  	...mapMutations(['create_modal_id','is_mask','create_modal','close_modal']),
  	...mapActions(['addAction']),
//	保存安全报告
  	savedata(){
  		var problems=this.formdatas.form.problems;
  		problems.forEach((value,index)=>{
  			value.images=this.imgbox[index].images.join(',')
  			value.sampleId = this.$route.query.id;
  			value.rummager = this.formdatas.form.rummager;
  		})
//		console.log(problems)
//		var str= JSON.stringify(problems)
//			console.log(str)
//		var params = {}
//			params.problems=problems;
		var params = problems;  	
  		this.loading=true;
		this.$http({
		    method: 'post',
			url: this.saveURL,
			transformRequest: [function (data) {
				// Do whatever you want to transform the data
				let ret = ''
				for (let it in data) {
				ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
				}
				return ret
			}],
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data:{
				params:JSON.stringify(params)
			},
			
	    }).then(function (response) {
//		  	this.formdatas=response.data.formdatas;
//		  	this.tabledatas=response.data.rows;
//	  		this.page.total=response.data.total;
		  	this.$router.go(-1)

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
//问题加一
	addproblem(){
		var item={
          		problem: '',//问题
          		images: [],//图片
            };
		this.formdatas.form.problems.push(item);
	},
//问题减一
	delproblem(){
		this.formdatas.form.problems.pop();
	},

	titleEvent(){
  		console.log('titleEvent');
  	},
  	submit(imgbox){
  		if(!this.$_ault_alert('safety:save')){
			return
		}
  		this.imgbox=imgbox;
//		console.log(this.imgbox)
		this.savedata();

  	},
  },
  data() {
    return {
      uploadPicURL: this.apiRoot + '/grain/safetyReport/uploadPic',
      saveURL: this.apiRoot + '/grain/safetyReport/save',
      searchURL:'/liquid/role2/data/search',
      deleteURL:'/liquid/role2/data/delete',
      checkedId:[],
	  createlibVisible:false,
	  imgbox:[],
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
      	title:'监督检查',
      	form:{
          libraryName: '沁县库区',//被查库点
          position: '漫水-1',//货位号
          rummager:'',
          problems:[
          	{
          		problem: '',//问题
          		images: [

          		],//图片
          	}
          
          ],
      	}
	  }
    }
  }
}
</script>

