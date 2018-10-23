<template>
    <div class='listpagewrap'>
      <!--面包屑-->
      <sinograin-breadcrumb :breadcrumb="breadcrumb" v-on:searchingfor="searchingfor"></sinograin-breadcrumb>
  	  <!--标题-->
  	  <sinograin-option-title :title="subtitle" v-on:titleEvent="titleEvent"></sinograin-option-title>		
      <!--提示-->
      <!--<sinograin-prompt :alerts="alerts"></sinograin-prompt>-->
      <!--表单-->
      <safety-form-edit :formdatas="formdatas" :problemFilter="problemFilter" @problemStatusChange="problemStatusChange" @pass="pass" @addsafety="addsafety"></safety-form-edit> 
      <!--通知弹框-->
      <!--<sinograin-message v-if="messageShow" :messages="messages" v-on:messageclick="messageclick" v-on:messageClose="messageClose"></sinograin-message>-->
      <sinograin-upload-Modal v-if="modalVisible"  :modal="modal" :uploadPicURL="uploadPicURL" v-on:submitupload="submitupload" v-on:dialogClose="dialogClose"></sinograin-upload-Modal>
    </div>
</template>

<style>
	
</style>

<script>

import SinograinPrompt from '@/components/common/prompt/Prompt.vue';
import SinograinBreadcrumb from '@/components/common/action/Breadcrumb.vue';
import SafetyFormEdit  from "@/components/common/action/SafetyFormEdit"
import SinograinOptionTitle from "@/components/common/action/OptionTitle"
import SinograinMessage from "@/components/common/action/Message"
import SinograinUploadModal from "@/components/common/action/UploadModal"

import "@/assets/style/common/list.css"
import { mapState,mapMutations,mapGetters,mapActions} from 'vuex';
//本地测试要用下面import代码
//import data from '@/util/mock';



export default {
  components: {
    SinograinPrompt,SinograinBreadcrumb,SinograinOptionTitle,SafetyFormEdit,SinograinMessage,SinograinUploadModal
  },
  computed:{
	...mapState(["modal_id_number","viewdata","editdata","aultdata","messions","mask"]),
	...mapGetters(["modal_id"]),
//	问题筛选
	problemFilter(){
		if(this.problemStatus=="all"){
			return this.formdatas.problems
		}else{			
			return this.formdatas.problems.filter((item)=>{
				return item.isDeal==this.problemStatus;
			})
		}
	}
  },
  created(){
//	console.log(this.$route.query)
//  获取列表数据（第一页）

//	this.getdata()
	this.getSafetyData()


  },
  destroy(){

  },
  methods: {
  	...mapMutations(['create_modal_id','is_mask','create_modal','close_modal']),
  	...mapActions(['addAction']),


 //	获取安全报告数据
  	getSafetyData(){
		  var params = {}
		  params.sampleId = this.$route.query.id
  		// 获取列表数据（第？页）
		this.$http({
		    method: 'post',
			url: this.dataSafetyURL,
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
//		  	console.log(response)
			
			var res0=response.data.rows

			var res=response.data.rows
//			循环问题
			res.forEach((value1,index1)=>{
				var images=[]
				var imagesbox=value1.images.split(',');
				imagesbox.forEach((value2,index2)=>{
					var obj={};
					obj.url= this.apiRoot + "/grain/upload/picture/"+value2;
					images.push(obj);
				})
	
				res0[index1].images=images
				
				var images2=[]
				if(value1.approveImage){					
					var imagesbox2=value1.approveImage.split(',');
					imagesbox2.forEach((value2,index2)=>{
						var obj={};
						obj.url= this.apiRoot + "/grain/upload/picture/"+value2;
						images2.push(obj);
					})
				}
	
				res0[index1].images2=images2
			})
			this.formdatas.problems = res0
		    this.formdatas.form.libraryName = this.$route.query.libraryName
			this.formdatas.form.position = this.$route.query.position
//		    console.log(res)
		}.bind(this)).catch(function (error) {
		    console.log(error);
		}.bind(this));
  	},
//	获取样品数据
  	// getdata(){

  	// 	// 获取列表数据（第？页）
	// 	this.$http({
	// 	    method: 'post',
	// 		url: this.dataURL,
	// 		headers: {'Content-Type': 'application/x-www-form-urlencoded'},
	// 		data: {
	// 			id:this.$route.query
	// 		}
	//     }).then(function (response) {
	// 	  	this.formdatas.form=response.data.formdatas;
	// 	}.bind(this)).catch(function (error) {
	// 	    console.log(error);
	// 	}.bind(this));
  	// },
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
	passProblem(id,form,images){
		if(!this.$_ault_alert('safety:edit')){
			return
		}
		var params=form;
			params.id=id;
			params.isDeal=1;
			params.approveImage=images.join(',');
			console.log(params)
		this.$http({
		    method: 'post',
			url: this.passURL,
			transformRequest: [function (data) {
				// Do whatever you want to transform the data
				let ret = ''
				for (let it in data) {
				ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
				}
				return ret
			}],
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data:params,
	    }).then(function (response) {
		  	console.log(response)
			  if(response.data.success) {
			  	this.getSafetyData()
//				this.formdatas.problems.forEach((value)=>{
//					if(value.id==id){
//						value.isDeal=1;
//					}
//				})
			  }
		}.bind(this)).catch(function (error) {
		    console.log(error);
		}.bind(this));
  	},
//	messageclick(type){
//		if(type=="confirm"){
//
//			var id=this.passProblemId;
//			this.passProblem(id)
//			console.log(id)
//	  		
//		}else if(type=="error"){
////			console.log(type)  			
//		}
//	},
//	messageClose(){
//		this.messageShow=false;
//	},
//	关闭新建弹框
	dialogClose(){
		this.modalVisible=false;
	},
  	submitupload(form,images){
  		var id=this.passProblemId;
		this.passProblem(id,form,images)
  	},

	titleEvent(){
  		console.log('titleEvent');
  	},
  	problemStatusChange(filterStatus){
  		this.problemStatus=filterStatus;
  	},
//	问题通过处理事件
  	pass(id){
		// console.log(id)
//		this.messageShow=true;
		this.modalVisible=true;
		
  		this.passProblemId=id;
  	},

//	新建安全报告
  	addsafety(){
    	this.$router.push({path: '/index/sampling/libraryList/samplingList/sampleShowList/safetyReportCreate',query:{id:this.$route.query.id,libraryName:this.$route.query.libraryName,position:this.$route.query.position}})
  	}
  },

  data() {
    return {
      dataURL: this.apiRoot + '/grain/sample/get',
	  dataSafetyURL:  this.apiRoot + '/grain/safetyReport/data',
	  editURL:  this.apiRoot + '/grain/safetyReport/edit',
      searchURL:'/liquid/role2/data/search',
      passURL: this.apiRoot + '/grain/safetyReport/edit',
      uploadPicURL: this.apiRoot + '/grain/safetyReport/uploadPic',
      problemStatus:'all',
      passProblemId:'',
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
//    通知弹窗
// 	  messageShow:false,
//	  messages:{
//	  	type:'confirm',
//	  	confirm:{
//	  		icon:'el-icon-success',
//	  		messageTittle:'确认此问题已解决?',
//	  		messageText:'此操作不可逆，请慎重操作',
//	  		buttonText:'确认',
//	  	},
//	  },
//	   提交通过信息
	  modalVisible:false,
	  modal:{
	  	title:'该问题已整改证明',
		formdatas:[
	  		{
	  			label:"审批通过人:",
	  			model:"approver",
				value: "",
	  			type:'input',
	  		},
	  	],
	  	adduploadprop:true,
//	  	submitText:'入库',
	  },
      formdatas: {
      	title:'监督检查',
      	statusItems:[
      		{label:'all',text:'全部'},
      		{label:-1,text:'待解决'},
      		{label:1,text:'已解决'},
      	],
      	form:{
          checkregion: '沁县库区',//被查库点
          pnumber: '漫水-1',//货位号          
      	},
      	problems:[
      		{
      			problem: '',//问题
      			images: [],//图片
          		rummager:'',
      			isDeal:-1,
      			createTime:'',
      		},
      	],
	  }
    }
  }
}
</script>

