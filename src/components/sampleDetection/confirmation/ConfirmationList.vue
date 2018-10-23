<template> 
	<div class='listpagewrap'>
		<!--面包屑-->
		<sinograin-breadcrumb :breadcrumb="breadcrumb" v-on:searchingfor="searchingfor"></sinograin-breadcrumb>
		<!--alert-->
		<!--<sinograin-prompt :alerts="alerts"></sinograin-prompt>-->
		<!--表格上的时间选框以及 创建-->
      	<list-header :listHeader="listHeader" v-on:dateChange="dateChange" v-on:statusChange="statusChange" @statusChange2="statusChange2" v-on:createSampling="createSampling" v-on:createlib="createlib" v-on:scanCode="scanCode" @addbtn='addbtn'></list-header>
		<!--表格-->
		<sinograin-list class="list" :tabledata="tabledatas" :list="list" :items="items" :actions="actions" v-on:getchecked="getchecked" :loading="loading" v-on:emptyCreate="emptyCreate">
		</sinograin-list>
		<!--分页-->
		<sinograin-pagination :page="page" v-on:paginationEvent="paginationEvent" v-on:getCurrentPage="getCurrentPage"></sinograin-pagination>
		<!--新建库典弹框-->
      	<sinograin-modal v-if="modalVisible"  :modal="modal" v-on:createlibitem="createlibitem" v-on:dialogClose="dialogClose" @modelSelectChange="modelSelectChange"></sinograin-modal>      	
	
	</div>
</template>

<style>

</style>

<script>
import SinograinList from '@/components/common/action/List.vue';
import SinograinPrompt from '@/components/common/prompt/Prompt.vue';
import SinograinBreadcrumb from '@/components/common/action/Breadcrumb.vue';
import SinograinPagination from '@/components/common/action/Pagination.vue';
import ListHeader from '@/components/common/action/ListHeader.vue';
import SinograinModal from '@/components/common/action/Modal.vue';
import "@/assets/style/common/list.css"
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex';
//本地测试要用下面import代码
//import data from '@/util/mock';



export default {
	components: {
		SinograinList, SinograinPrompt, SinograinPagination, SinograinBreadcrumb, SinograinModal, ListHeader
	},
	computed: {
		...mapState(["modal_id_number", "viewdata", "editdata", "aultdata", "messions", "mask"]),
		...mapGetters(["Token"]),
		tabledatasFilter() {

			if (this.filterStatus == "全部") {
				return this.tabledatas;
			} else {
				return this.tabledatas.filter((value, index) => {
					return value.status == this.filterStatus
				})
			}
		}
	},
	created() {
//		console.log(this.$route.query)
		//  获取列表数据（第一页）
		this.getlistdata(1)//对接时使用，暂时不启用用的假数据
		this.getTaskList()//获取任务列表
		
		//	移除监听事件
		this.$root.eventHub.$off('delelistitem')
		this.$root.eventHub.$off("viewlistitem")
		this.$root.eventHub.$off("editlistitem")
		this.$root.eventHub.$off("exportExcel")
		//	监听列表删除事件
		this.$root.eventHub.$on('delelistitem', function(rowid, list) {
			this.tabledatas = this.tabledatas.filter(function(item) {
				return item.id !== rowid;
			})
			this.sendDeleteId(rowid);
			//  	console.log(rowid,list);
		}.bind(this));
		//	监听列表点击查看事件
		this.$root.eventHub.$on("viewlistitem", function(id,row) {
//			if(!this.$_ault_alert('handover:getById')){
//				return
//			}
//					console.log(id,state)
//			this.$router.push({ path: '/index/sampleManagement/handover/handoverListView', query: { id: id } })
			this.$router.push({path: '/index/sampleDetection/confirmationList/confirmationdetails',query:{id:row.sampleId}})
//			this.$router.push({path: '/index/sampleDetection/confirmationList/confirmationdetails',query:{id:id}})
		}.bind(this));
		//监听列表点击编辑事件
		this.$root.eventHub.$on('editlistitem',function(id){
//			console.log(id)
			this.$router.push({ path: '/index/sampleManagement/handover/handoverListEdit', query: { id: id } })
		}.bind(this));
		//	监听列表点击导出事件
		this.$root.eventHub.$on("exportExcel", function(id,row) {
//			if(!this.$_ault_alert('handover:getById')){
//				return
//			}
			this.exportExcel(row.sampleId)
//			this.returnId=id
//			this.modalVisible=true;
		}.bind(this));
	},
	destroy() {
		this.$root.eventHub.$off("viewlistitem")
		this.$root.eventHub.$off('delelistitem')
		this.$root.eventHub.$off("editlistitem")
		this.$root.eventHub.$off("exportExcel")
	},
	methods: {
		...mapMutations(['create_modal_id', 'is_mask', 'create_modal', 'close_modal']),
		...mapActions(['addAction']),
		//	列表头触发的事件
		dateChange(data) {
			console.log(data);
		},
		scanCode(){
			
		},
		statusChange(data) {
			this.filterStatus = data;
			this.getlistdata(1)
	  		this.page.currentPage=1;
		},
		statusChange2(data) {
			console.log(data)
		},
		createSampling() {
			//		console.log('createSampling');
			this.$router.push({ path: '/index/sampling/samplingList/samplingListCreate' })
		},
		emptyCreate() {
//			this.connect();
		},
		//	打开新建弹框
		createlib() {
			this.modalVisible = true;
		},
		//	录入样品检验按钮
		addbtn() {
			if(!this.$_ault_alert('testItem:save')){
				return
			}
//			this.createlibitem(1);//没后台时用的
			
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
        		params.taskName=form.taskName;    		
        		//  	麻蛋老没后台写点假数据吧
//				params.checkPoint=10;
//				params.sort='小麦';
//				params.taskName='这就编不出来了'; 
    		var path=this.$route.name+'/录入样品检测数据'
           	this.$router.push({ name: path,params:params})
		},
		modelSelectChange(val,model){
			console.log(val,model)
			if(model=='sort'&&val=='玉米'){
				this.modal.formdatas[2].selectitems=[
			  				{label:'容重',value:'1',id:'1'},
			  				{label:'水分',value:'2',id:'2'},
			  				{label:'杂质',value:'3',id:'3'},
//			  				{label:'矿物质',value:'4',id:'4'},
			  				{label:'不完善粒',value:'5',id:'5'},
			  				{label:'生霉粒',value:'6',id:'6'},
			  				{label:'色泽气味(质量指标)',value:'7',id:'7'},
//			  				{label:'硬度指数',value:'8',id:'8'},
//			  				{label:'面筋吸水量',value:'9',id:'9'},
			  				{label:'脂肪酸值',value:'10',id:'10'},
			  				{label:'品尝评分值',value:'11',id:'11'},
			  				{label:'色泽气味(储存品质指标)',value:'12',id:'12'},
			  				{label:'真菌毒素(黄曲霉毒素B1)',value:'13',id:'13'},
			  				{label:'真菌毒素(脱氧雪腐镰刀菌烯醇)',value:'14',id:'14'},
			  				{label:'真菌毒素(玉米赤霉烯酮)',value:'15',id:'15'},
			  				{label:'重金属(铅)',value:'16',id:'16'},
			  				{label:'重金属(镉)',value:'17',id:'17'},
			  				{label:'重金属(汞)',value:'18',id:'18'},
			  				{label:'重金属(砷)',value:'19',id:'19'},
			  			];
			}else if(model=='sort'&&val=='小麦'){
				this.modal.formdatas[2].selectitems=[
			  				{label:'容重',value:'1',id:'1'},
			  				{label:'水分',value:'2',id:'2'},
			  				{label:'杂质',value:'3',id:'3'},
			  				{label:'矿物质',value:'4',id:'4'},
			  				{label:'不完善粒',value:'5',id:'5'},
//			  				{label:'生霉粒',value:'6',id:'6'},
			  				{label:'色泽气味(质量指标)',value:'7',id:'7'},
			  				{label:'硬度指数',value:'8',id:'8'},
			  				{label:'面筋吸水量',value:'9',id:'9'},
//			  				{label:'脂肪酸值',value:'10',id:'10'},
			  				{label:'品尝评分值',value:'11',id:'11'},
			  				{label:'色泽气味(储存品质指标)',value:'12',id:'12'},
//			  				{label:'真菌毒素(黄曲霉毒素B1)',value:'13',id:'13'},
			  				{label:'真菌毒素(脱氧雪腐镰刀菌烯醇)',value:'14',id:'14'},
//			  				{label:'真菌毒素(玉米赤霉烯酮)',value:'15',id:'15'},
			  				{label:'重金属(铅)',value:'16',id:'16'},
			  				{label:'重金属(镉)',value:'17',id:'17'},
			  				{label:'重金属(汞)',value:'18',id:'18'},
			  				{label:'重金属(砷)',value:'19',id:'19'},
			  			];
			}
		},
		//	关闭新建弹框
		dialogClose() {
			this.modalVisible = false;
		},
		//	获取搜索数据
		searchingfor(searching,page){
	  		page?page:1;
	  		this.searchText=searching;
	  		this.getlistdata(page)
//	  		var params = {};
//			params.nameLikeOrId = searching;
//	  		// 获取列表数据（第？页）
//			this.$http({
//			    method: 'post',
//				url: this.searchURL,
//				transformRequest: [function (data) {
//					// Do whatever you want to transform the data
//					let ret = ''
//					for (let it in data) {
//					ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
//					}
//					return ret
//				}],
//				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
//				data: {
//				   params:JSON.stringify(params)
//				}
//		    }).then(function (response) {
//			 	this.tabledatas = response.data.rows;
//				this.page.total = response.data.total;
//				this.loading = false;
//	
//			}.bind(this)).catch(function (error) {
//			    console.log(error);
//			}.bind(this));
	  	},
		//	获取列表数据方法
		getlistdata(page) {
			this.loading = true;
			var data={};
			data.page=page;
			data.rows=this.page.size;
			var params = {};			
			if(this.searchText){				
				params.sampleNumLike = this.searchText;
				data.params=JSON.stringify(params);
			};
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
				this.tabledatas = response.data.rows;
				this.page.total = response.data.total;
				this.loading = false;
	  			this.page.currentPage=page;
			}.bind(this)).catch(function(error) {
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
				this.modal.formdatas[0].selectitems=response.data.rows.map((value,index)=>{
					var obj={};
					obj.label=value.taskName;
					obj.value=value.taskName;
					obj.id=value.id;
					return obj;
				})	
			}.bind(this)).catch(function (error) {
			    console.log(error);
			}.bind(this));
	  	},
		//	发送删除id
		sendDeleteId(id) {
			this.$http({
				method: 'post',
				url: this.deleteURL,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				data: {
					listName: this.list,
					id: id,
				}
			}).then(function(response) {

			}.bind(this)).catch(function(error) {
				console.log(error);
			}.bind(this));
		},
		//	获取分页点击事件中及当前页码
	    getCurrentPage(currentPage){
			if(this.searchText){			
				this.searchingfor(this.searchText,currentPage)
			}else{			
				this.getlistdata(currentPage)
			}
		},
		//	映射分页触发的事件
		paginationEvent(actiontype) {
			if (actiontype == 'leading_out') {
//				导出扦样表事件已触发
				console.log('leading_out')
			}else if (actiontype == 'handoverPrint') {
//				打印样品领取交接单触发
				console.log('handoverPrint')
			}else if (actiontype == 'refresh') {
				// 获取列表数据（第一页）
				this.getlistdata(1)
			}
		},
		//	获取多选框选中数据的id(这是一个数组)
		getchecked(checkedId) {
			this.checkedId = checkedId;
		},
		exportExcel(id){
//			if(!this.$_ault_alert('register:export')){
//				return
//			}
			var loadiframe=document.getElementById('fordownload');
//			var url=this.exportExcelURL+'?sampleId='+id+'&sessionid='+this.Token;
//			window.location.assign(url);
			loadiframe.src=this.exportExcelURL+'?sampleId='+id+'&sessionid='+this.Token;

		}
	},
	data() {
		return {
			datalistURL: this.apiRoot +'/grain/testItem/findTestItem',
			searchURL: this.apiRoot +'/grain/register/data',
	  		taskListURL:this.apiRoot + '/grain/task/data',
//	  		exportExcelURL: this.apiRoot + '/grain/testItem/expotHandover',
	  		exportExcelURL: this.apiRoot + '/grain/testItem/exportWordTestItem',
			deleteURL: '/liquid/role2/data/delete',
      		searchText:'',
			checkedId: [],
			list: "samplinglist",
			modalVisible:false,
			modal:{
			  	title:'选择检验项目',
				formdatas:[
					{
			  			label:"选择任务:",
			  			model:"taskName",
//			  			disabled:true,
			  			value:'',
			  			type:'select',
			  			selectitems:[
			  				
//			  				{label:'食用油',value:'食用油',id:'3'},
			  			],
			  		},
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
//			  				{label:'容重',value:'1',id:'1'},
//			  				{label:'水分',value:'2',id:'2'},
//			  				{label:'杂质(矿物质)',value:'3',id:'3'},
//			  				{label:'不完善粒(生霉粒)',value:'4',id:'4'},
//			  				{label:'色泽气味(质量指标)',value:'5',id:'5'},
//			  				{label:'面筋吸水量',value:'6',id:'6'},
//			  				{label:'脂肪酸值',value:'7',id:'7'},
//			  				{label:'品尝评分值',value:'8',id:'8'},
//			  				{label:'色泽气味(储存品质指标)',value:'9',id:'9'},
////			  				{label:'真菌毒素(黄曲霉毒素B1、脱氧雪腐、镰刀菌烯醇、玉米赤霉烯酮)',value:'10',id:'10'},
//			  				{label:'真菌毒素',value:'10',id:'10'},
//			  				{label:'重金属(铅、镉、汞、砷)',value:'11',id:'11'},
			  			],
			  		},
			  		
			  	],		
			  	submitText:'确认',
			},
			breadcrumb: {
				search: true,
				searching: '',
			},
			loading: false,
			filterStatus: '全部',
			//    分页数据
			page: {
				size: 10,
				total: 1,
				currentPage: 1,
				show: true,
				tfootbtns: {
					btns: false,//是否添加按钮组
					leading_out: false,//导出按钮
					refresh: false,//刷新按钮
					delete: false, //删除按钮 
					connect: false//打印样品交接单            	
				}
			},
			//    弹窗数据
			alerts: [{
				title: '温馨提示：此页面只展示本库信息!',
				type: 'info'
			}],
			//    表格数据
			listHeader:{
		      	addbtn:'录入样品检验数据',
//		      	status:true,
		      	statusitems:[
		      		{label:'全部',text:'全部'},
		      		{label:'-1',text:'已归还'},
		      		{label:'1',text:'未归还'},
		      	],
		      	status2:false,
		      	statusTitle:'交接单状态:',
		      	statusTitle2:[],
		    },
			tabledatas: [
//				{sampleNum:'201800101',checkeds:'1,2,5,6',id:1},
//		      	{sampleNum:'201800102',checkeds:'1,2,3,5,6',id:2},
//		      	{sampleNum:'201800103',checkeds:'1,2,3,5,6',id:3},
//		      	{sampleNum:'201800104',checkeds:'1,2,3,6',id:4},
//		      	{sampleNum:'201800105',checkeds:'1,2,3,5,6',id:5},
//		      	{sampleNum:'201800106',checkeds:'1,2,3,5,6',id:6},
//		      	{sampleNum:'201800107',checkeds:'1,2,3,5,6,7',id:7},
//		      	{sampleNum:'201800108',checkeds:'1,2,3,5,6',id:8},
//		      	{sampleNum:'201800109',checkeds:'1,2,3,5,6',id:9},
//		      	{sampleNum:'201800110',checkeds:'2,3,5,6',id:10},
			],
			items: [
				{
					id: 1,
					prop: 'sampleNum',
					label: "检验编号",
//					sort: true,
					status:true,
				},
				{
					id: 2,
					prop: 'checkeds',
					label: "检验项目",
//					sort: true,
					status:true,
				},
				{
					id:3,
					prop: 'state',
					label: "状态",
//					sort: true,
					status:true,
				},
				
			],
			actions: {
				selection: false,
				number: false,
				view: false,
				edit: false,
				dele: false,
				manuscript: false,
				safetyReport: false,
				show:true,
				exportExcel:true,
				exporttitle:'导出Word文档',
			}
		}
	}
}
</script>

