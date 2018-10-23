<template> 
	<div class='listpagewrap'>
		<!--面包屑-->
		<sinograin-breadcrumb :breadcrumb="breadcrumb" v-on:searchingfor="searchingfor"></sinograin-breadcrumb>
		<!--alert-->
		<!--<sinograin-prompt :alerts="alerts"></sinograin-prompt>-->
    	<!--标题-->
    	<sinograin-option-title :title="subtitle" v-on:titleEvent="titleEvent"></sinograin-option-title>
		<!--高级搜索-->
		<!--背景-->
		<div class="searchbg">
			<p>检验报告制作</p>
			<advanced-search :resultList="resultList"  @searchChange="searchChange" @searchingfor="searchingfor"></advanced-search>
		</div>
		<!--新建库典弹框-->
      	<sinograin-modal v-if="modalVisible"  :modal="modal" v-on:createlibitem="createlibitem" v-on:dialogClose="dialogClose" @modelSelectChange="modelSelectChange"></sinograin-modal>      	
	
	</div>
</template>

<style>
.searchbg{
	width:auto;
	margin-top:0.25rem;
	background-color:#ecf3ef;
	border:1px solid #dfdfdf;
	border-radius:0.1rem 0.1rem 0 0;
	height:5.7rem;
}
.searchbg >p{
	/*width:100%;*/
	background-color:#eeeeee;
	border-bottom:1px solid #dfdfdf;
	text-align: center;
	height:0.6rem;
	line-height:0.6rem;
	color:#000;
	font-size:0.22rem;
}
.searchbg .AdvancedSearch{
	margin-top:0.5rem;
}
</style>

<script>
import SinograinPrompt from '@/components/common/prompt/Prompt.vue';
import SinograinBreadcrumb from '@/components/common/action/Breadcrumb.vue';
import SinograinModal from '@/components/common/action/Modal.vue';
import SinograinOptionTitle from "@/components/common/action/OptionTitle"
import AdvancedSearch from "@/components/common/action/AdvancedSearch"
import "@/assets/style/common/list.css"
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex';
//本地测试要用下面import代码
//import data from '@/util/mock';



export default {
	components: {
		SinograinOptionTitle, SinograinPrompt, SinograinBreadcrumb, SinograinModal,AdvancedSearch
	},
	computed: {
		...mapState(["modal_id_number", "viewdata", "editdata", "aultdata", "messions", "mask"]),
		...mapGetters(["modal_id"]),
		
	},
	created() {
//		console.log(this.$route.query)
		//  获取列表数据（第一页）
		this.getlistdata(1)//对接时使用，暂时不启用用的假数据
		
	},
	methods: {
		...mapMutations(['create_modal_id', 'is_mask', 'create_modal', 'close_modal']),
		...mapActions(['addAction']),
		//	列表头触发的事件
		titleEvent(){
			console.log('titleEvent')
		},
		//	录入样品检验按钮
		addbtn() {
//			if(!this.$_ault_alert('handover:save')){
//				return
//			}
			this.modalVisible=true;
			// this.$router.push({ path: '/index/sampleManagement/temporaryRegistration/temporaryRegistrationCreate' })
		},
		//	录入样品检验按钮弹框确认后
		createlibitem(form) { 	
//			console.log(form);
//			var checkPoint=form.checkPoint;
//			var sort=form.sort;
//			this.$router.push({ path: '/index/sampleDetection/confirmationList/comfirmationentry',params:{checkPoint:checkPoint,sort:sort}})			
			var params={};
        		params.checkPoint=form.checkPoint;
        		params.sort=form.sort;
    		var path=this.$route.name+'/录入样品检测数据'
           	this.$router.push({ name: path,params:params})
		},
		modelSelectChange(val,model){
			console.log(val,model)
			
		},
		//	关闭新建弹框
		dialogClose() {
			this.modalVisible = false;
		},
		searchChange(){
			
		},
		//	获取搜索数据
		searchingfor(searching){
			if(!this.$_ault_alert('sample:findSampleReport')){
				return
			}			
//			console.log(searching)
			
			searching=searching.startsWith('监')?searching.slice(1):searching;
//			console.log(searching)
//			this.$router.push({ path: '/index/TestReportManagement/TestReportFindSample/GenerateReport', query: { sampleNum: searching } })
			
	  		var params = {};
			params.sampleNum = searching;
	  		// 获取列表数据（第？页）
			this.$http({
			    method: 'post',
				url: this.searchURL,
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
					sampleNum:searching,
//				   params:JSON.stringify(params)
				}
		    }).then(function (response) {
			 	if(!response.data){
			 		this.$notify.error({
			          	title: '错误',
			          	message: '未找到该检验编号样品！！！',
			        });
					return
			 	}else{
			 		if(response.data.detectionState==2){
						this.$router.push({ path: '/index/TestReportManagement/TestReportFindSample/GenerateReport', query: { sort:response.data.sort,sampleNum: searching } })
			 		}else{
			 			this.$notify.error({
				          	title: '错误',
				          	message: '该样品尚未完成全部检验项目！！！',
				        });
						return
			 		}
			 	}
			}.bind(this)).catch(function (error) {
			    console.log(error);
			}.bind(this));
	  	},
		//	获取列表数据方法
		getlistdata(page) {

			var data={};
			data.detectionState=2;
//			data.page=page;
//			data.rows=this.page.size;
//			var params = {};			
//			if(this.searchText){				
//				params.sampleNumLike = this.searchText;
//				data.params=JSON.stringify(params);
//			};
			// 获取列表数据（第？页）
			this.$http({
				method: 'post',
				url: this.datalistURL,
				transformRequest: [function (data) {
					let ret = ''
					for (let it in data) {
					ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
					}
					return ret
				}],
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				data: data,
			}).then(function(response) {
//				this.resultList=response.data.map((value,index)=>{
//					return value.sampleNum
//				})
				this.resultList=response.data
			}.bind(this)).catch(function(error) {
				console.log(error);
			}.bind(this));
		},
		
		
		
		exportExcel(id){
//			if(!this.$_ault_alert('register:export')){
//				return
//			}
			var loadiframe=document.getElementById('fordownload');
			loadiframe.src=this.exportExcelURL+'?sampleId='+id+'&sessionid='+this.Token;
		}
	},
	data() {
		return {
			datalistURL: this.apiRoot +'/grain/sample/findByDetectionState',
			searchURL: this.apiRoot +'/grain/sample/findBysampleNumMobile',
	  		exportExcelURL: this.apiRoot + '/grain/testItem/expotHandover',
			deleteURL: '/liquid/role2/data/delete',
      		searchText:'',
      		resultList:[
//    			{id:1,sampleNum:'20180101021'},
//    			{id:2,sampleNum:'20180101022'},
//    			{id:3,sampleNum:'20180101023'},
//    			{id:4,sampleNum:'20180101024'},
//    			{id:5,sampleNum:'20180101025'},
      		],
			modalVisible:false,
			modal:{
			  	title:'选择检验项目',
				formdatas:[
					{
			  			label:"选择品种:",
			  			model:"sort",
//			  			disabled:true,
			  			value:'',
			  			type:'select',
			  			selectitems:[
			  				{label:'小麦',value:'小麦',id:'1'},
			  				{label:'玉米',value:'玉米',id:'2'},
//			  				{label:'食用油',value:'食用油',id:'3'},
			  			],
			  		},
					{
			  			label:"选择检验项目:",
			  			model:"checkPoint",
//			  			disabled:true,
			  			value:'',
			  			type:'select',
			  			selectitems:[
			  			
			  			],
			  		},
			  		
			  	],		
			  	submitText:'确认',
			},
			breadcrumb: {
				search: false,
				searching: '',
			},
			subtitle:{	
//		    	btn:true,
		    	btntext:'导出word文档',
		    },
			loading: false,
			
			//    弹窗数据
			alerts: [{
				title: '温馨提示：此页面只展示本库信息!',
				type: 'info'
			}],
		}
	}
}
</script>

