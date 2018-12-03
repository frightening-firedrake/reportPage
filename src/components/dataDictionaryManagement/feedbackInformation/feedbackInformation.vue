<template>
    <div class='listpagewrap'>
      <!--面包屑-->
      <breadcrumb :breadcrumb="breadcrumb" v-on:searchingfor="searchingfor"></breadcrumb>
  	  <!--标题-->
  	  <!--<option-title :title="subtitle" v-on:titleEvent="titleEvent"></option-title>-->		
      <!--提示-->
      <!--<prompt :alerts="alerts"></prompt>-->
      <!--表单之上-->
      <list-header :listHeader="listHeader" @addbtn="addbtn"></list-header>
      <!--表单-->

      <el-table :data="informationlist.data" border size="small" tooltip-effect="light" :row-style="rowStyle" :cell-style="rowStyle" :header-row-style="headerRowStyle" :header-cell-style="headerRowStyle" fit class="informationlist">
	    <el-table-column align="center" header-align="center" show-overflow-tooltip :resizable="false" prop="state" label="案件审核" min-width="80">	
	    	<template slot-scope="scope">
	    		<span v-if="scope.row.state==-1">未通过审核</span>
	    		<span v-if="scope.row.state==1">通过审核</span>
	      	</template>
	    </el-table-column>
	    <el-table-column align="center" header-align="center" show-overflow-tooltip :resizable="false"  prop="type" label="案件审核原因" min-width="80">	
	    </el-table-column>
	    <el-table-column  align="center" header-align="center" show-overflow-tooltip :resizable="false"  prop="feedbackInformation" label="自动反馈信息" min-width="500">	
	    </el-table-column>
	    <el-table-column  align="center" header-align="center" :resizable="false" label="操作" width="120">
	      <template slot-scope="scope">
	        <el-button class="edit" @click.native.prevent="editbtn(scope.$index, scope.row)" type="text" size="small">
	          	<!--<i class="iconfont icon-bianji "></i>-->
	          	编辑
	        </el-button>
	        <el-button class="dele" @click.native.prevent="informationdele(scope.$index, scope.row)" type="text" size="small">
	          	<!--<i class="iconfont icon-bianji "></i>-->
	          	删除
	        </el-button>
	      </template>
	    </el-table-column>
	  </el-table>
      <!--通知弹框-->
      <!--<message v-if="messageShow" :messages="messages" v-on:messageclick="messageclick" v-on:messageClose="messageClose"></message>-->
      <!--<upload-Modal v-if="modalVisible"  :modal="modal" :uploadPicURL="uploadPicURL" v-on:submitupload="submitupload" v-on:dialogClose="dialogClose"></upload-Modal>-->
      <!--反馈信息-->
      <modal v-if="modalVisible" :modal="modal" v-on:createlibitem="createlibitem" @modelSelectChange="modelSelectChange" v-on:dialogClose="dialogClose"></modal>      	

    </div>
</template>

<style>
	.informationlist table{		
		border-collapse: collapse;
		/*border:solid 1px #d7d7d7;*/
	}
	.informationlist{		
		border:solid 1px #d7d7d7;
		border-radius:0.1rem 0.1rem 0 0;
		min-height: 5.6rem;
	}
	.informationlist button.edit{
		padding:0;
		color:#4c90db;
		font-size:0.18rem;
	}
	.informationlist button.dele{
		padding:0;
		color:#F16B74;
		font-size:0.18rem;
	}
	.informationlist button.edit i{
		color:#4c90db;
		font-size:0.18rem;
	}
</style>

<script>

import Prompt from '@/components/common/prompt/Prompt.vue';
import Breadcrumb from '@/components/common/action/Breadcrumb.vue';
import CaseDetails  from "@/components/common/action/CaseDetails"
import OptionTitle from "@/components/common/action/OptionTitle"
import Message from "@/components/common/action/Message"
import ListHeader from '@/components/common/action/ListHeader.vue';

import Modal from '@/components/common/action/Modal.vue';

import "@/assets/style/common/list.css"
import { mapState,mapMutations,mapGetters,mapActions} from 'vuex';
//本地测试要用下面import代码
//import data from '@/util/mock';



export default {
  components: {
    Prompt,Breadcrumb,OptionTitle,CaseDetails,Message,Modal,ListHeader
  },
  computed:{
	...mapState(["modal_id_number","viewdata","editdata","aultdata","messions","mask"]),
	...mapGetters(["modal_id"]),

  },
  created(){
//	console.log(this.$route.query)
//  获取列表数据（第一页）
	this.getfeedbackInformation()
  },
  destroy(){

  },
  methods: {
  	...mapMutations(['create_modal_id','is_mask','create_modal','close_modal']),
  	...mapActions(['addAction']),


 
//	获取样品数据
    getfeedbackInformation(){
	 	this.$http({
	 	    method: 'post',
	 		url: this.feedbackInformationURL,
	 		headers: {'Content-Type': 'application/x-www-form-urlencoded'},
	 		data: {

	 		}
	     }).then(function (response) {
	     	
	 	  	this.informationlist.data=response.data.rows;
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
  	//	弹框中的下拉框变化
	modelSelectChange(val,model){
		this.state=val;
//		console.log(this.state)
	},
  	//	modal填入新建数据
	createlibitem(form){
		form.state=this.state
		if(!form.id){
			this.informationadd(form)
		}else{
			this.informationedit(form)
		}
//		console.log(form);
//		this.disagreeSubmit(form.reason)
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


//	新建安全报告
  	addsafety(){
    	this.$router.push({path: '/index/sampling/libraryList/samplingList/sampleShowList/safetyReportCreate',query:{id:this.$route.query.id,libraryName:this.$route.query.libraryName,position:this.$route.query.position}})
  	},
//	信息列表事件
	addbtn(){
		if(!this.$_ault_alert('feedbackInformation:finByTypeAndSave')){
			return
		}
	  	var modal={
		  	title:'新增案件审核原因',
		  	customClass:'blue',
			formdatas:[
		  		{
		  			label:"案件审核:",
		  			Default:true,
		  			type:'select',
		  			model:"state",
		  			defaultz:-1,
					selectitems:[
						{label:'未通过审核',value:-1,id:'1'},
						{label:'通过审核',value:1,id:'2'},
					],
		  		},
				{
		  			label:"未通过原因:",
		  			model:"type",
		  			type:'input',
		  		},
		  		{
		  			label:"自动反馈信息",
		  			type:'textarea',
		  			rows:3,
		  			model:"feedbackInformation",
		  			value:'',
		  		},
	  		],
	  		submitText:'提交',
	  	};
	  	this.modal=modal;
		this.state=-1;
		this.modalVisible=true;
		
	},
	editbtn(index,row){
		if(!this.$_ault_alert('feedbackInformation:edit')){
			return
		}
		var modal={
		  	title:'新增案件审核原因',
		  	customClass:'blue',
			formdatas:[
		  		{
		  			label:"案件审核:",
		  			Default:true,
		  			type:'select',
		  			model:"state",
		  			defaultz:row.state,
					selectitems:[
						{label:'未通过审核',value:-1,id:'1'},
						{label:'通过审核',value:1,id:'2'},
					],
		  		},
		  		{
		  			hidden:true,
//		  			label:"未通过id:",
		  			model:"id",
		  			value:row.id,
		  			type:'input',
		  		},
				{
		  			label:"未通过原因:",
		  			model:"type",
		  			value:row.type,
		  			type:'input',
		  		},
		  		{
		  			label:"自动反馈信息",
		  			type:'textarea',
		  			rows:3,
		  			model:"feedbackInformation",
		  			value:row.feedbackInformation,
		  		},
	  		],
	  		submitText:'提交',
	  	};
	  	this.modal=modal;
		this.state=row.state;
		this.modalVisible=true;
//		console.log(index,row)
	},
//	删除先确认
	informationdele(index,row){
		if(!this.$_ault_alert('feedbackInformation:delete')){
			return
		}
		this.$confirm('此操作将永久删除该信息 , 是否继续?', '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning'
		}).then(() => {
			
		    this.informationdeleqr(index,row)
		}).catch(() => {
			this.$message({
				type: 'info',
				message: '已取消删除'
			});
		});
		
	},
	informationdeleqr(index,row){
//		console.log(index,row)
		this.$http({
	 	    method: 'post',
	 		url: this.deleURL,
	 		headers: {'Content-Type': 'application/x-www-form-urlencoded'},
	 		transformRequest: [function (data) {
				// Do whatever you want to transform the data
				let ret = ''
				for (let it in data) {
				ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
				}
				return ret
			}],
	 		data: {
				id:row.id
	 		}
	    }).then(function (response) {
	     	if(response.data.success){
	     		this.$notify({
		          	title: '操作成功',
		          	message: '信息修改成功！！！',
		          	type: 'success'
		        });
		        this.getfeedbackInformation()
	     	}else{
	     		this.$notify.error({
		          	title: '操作失败',
		          	message: '信息修改失败！！！',
		        });
	     	}
	 	}.bind(this)).catch(function (error) {
	 	    console.log(error);
	 	}.bind(this));
		
	},
	informationadd(data){
//		console.log('add',data)
		this.$http({
	 	    method: 'post',
	 		url: this.addURL,
	 		headers: {'Content-Type': 'application/x-www-form-urlencoded'},
	 		transformRequest: [function (data) {
				// Do whatever you want to transform the data
				let ret = ''
				for (let it in data) {
				ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
				}
				return ret
			}],
	 		data: data,
	    }).then(function (response) {
	     	if(response.data.success){
	     		this.$notify({
		          	title: '操作成功',
		          	message: '新建信息成功！！！',
		          	type: 'success'
		        });
		        this.getfeedbackInformation()
	     	}else{
	     		this.$notify.error({
		          	title: '操作失败',
		          	message: '新建信息失败,请检查录入信息是否重复！！！',
		        });
	     	}
	 	}.bind(this)).catch(function (error) {
	 	    console.log(error);
	 	}.bind(this));
	},
	informationedit(data){
//		console.log('edit',data)
		this.$http({
	 	    method: 'post',
	 		url: this.editURL,
	 		headers: {'Content-Type': 'application/x-www-form-urlencoded'},
	 		transformRequest: [function (data) {
				// Do whatever you want to transform the data
				let ret = ''
				for (let it in data) {
				ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
				}
				return ret
			}],
	 		data:data
	     }).then(function (response) {
	     	if(response.data.success){
	     		this.$notify({
		          	title: '操作成功',
		          	message: '信息修改成功！！！',
		          	type: 'success'
		        });
		        this.getfeedbackInformation()
	     	}else{
	     		this.$notify.error({
		          	title: '操作失败',
		          	message: '信息修改失败,请检查录入信息是否重复！！！',
		        });
	     	}

	 	}.bind(this)).catch(function (error) {
	 	    console.log(error);
	 	}.bind(this));
	},
  },

  data() {
    return {
      feedbackInformationURL: this.apiRoot + 'feedbackInformation/data',
      addURL:  this.apiRoot + 'feedbackInformation/findByTypeAndSave',
      editURL:  this.apiRoot + 'feedbackInformation/edit',
      deleURL:  this.apiRoot + 'feedbackInformation/delete',
	  
	  dataSafetyURL:  this.apiRoot + '/grain/safetyReport/data',
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
	  modalVisible:false,
	  modal:{
		  	
	  },
//	   提交通过信息
//	  modalVisible:false,
//	  modal:{
//	  	title:'该问题已整改证明',
//		formdatas:[
//	  		{
//	  			label:"审批通过人:",
//	  			model:"approver",
//				value: "",
//	  			type:'input',
//	  		},
//	  	],
//	  	adduploadprop:true,
//	  	submitText:'入库',
//	  },
      	informationlist:{
      		data:[
//    			{id:1,state:1,type:'默认',feedbackInformation:'您的本次举报我们已经加入备案，案件侦破期间请保持电话通畅。感谢您的配合。'},
//    			{id:2,state:-1,type:'报假警',feedbackInformation:'您的本次举报未通过审核，因为此次案件不属于扫黑除恶的范围，感谢你的举报。'},
//    			{id:3,state:-1,type:'报假警',feedbackInformation:'您的本次举报未通过审核，因为此次案件不属于扫黑除恶的范围，感谢你的举报。'},
//    			{id:4,state:-1,type:'报假警',feedbackInformation:'您的本次举报未通过审核，因为此次案件不属于扫黑除恶的范围，感谢你的举报。'},
//

      		],
      	},
      	rowStyle:{
      		height: "0.5rem",
      		lineHeight: "0.5rem",
      		minHeight:'0.5rem',
      		padding:0,
			backgroundColor: "#fffff",
//			border: "solid 1px #d7d7d7",
			border: "0",
			borderRight: "solid 1px #d7d7d7",
			borderBottom: "solid 1px #d7d7d7",
			color:'#66666',
			fontSize:'0.16rem',
			boxSizing:'borderBox',
      	},
      	headerRowStyle:{
      		height: "0.6rem",
      		lineHeight: "0.6rem",
      		minHeight:'0.6rem',
      		padding:0,
			backgroundColor: "#eeeeee",
			border: "0",
			borderRight: "solid 1px #d7d7d7",
			borderBottom: "solid 1px #d7d7d7",
			color:'#333333',
			fontSize:'0.2rem',
			boxSizing:'borderBox',
      	},
      	listHeader:{
	      	addbtn:'新增案件审核原因',
	      	class:"noborder notop",
	    },
	    state:-1,
    }
  }
}
</script>

