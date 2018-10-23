<template>
    <div class='listpagewrap'>
      <!--面包屑-->
      <sinograin-breadcrumb :breadcrumb="breadcrumb" v-on:searchingfor="searchingfor"></sinograin-breadcrumb>
      <!--alert-->
      <!--<sinograin-prompt :alerts="alerts"></sinograin-prompt>-->
      <!--表格上的时间选框以及 创建-->
      <list-header :listHeader="listHeader" v-on:dateChange="dateChange" v-on:statusChange="statusChange" v-on:createSampling="createSampling" v-on:createlib="createlib" v-on:scanCode="scanCode" @addbtn="addbtn"></list-header>
      <!--表格-->
      <sinograin-list class="list nopointer packing" :tabledata="tabledatasFilter" :list="list" :items="items" :actions="actions" v-on:getchecked="getchecked" :loading="loading" v-on:emptyCreate="emptyCreate" > 
      </sinograin-list>
      <!--分页-->
      <!--<sinograin-pagination :page="page" v-on:paginationEvent="paginationEvent" v-on:getCurrentPage="getCurrentPage"></sinograin-pagination>-->
      <!--新建库典弹框-->
      <!--<sinograin-modal v-if="modalVisible"  :modal="modal" v-on:createlibitem="createlibitem" v-on:dialogClose="dialogClose"></sinograin-modal>-->      	
      <!--<sinograin-message v-if="messageShow" :messages="messages" v-on:messageclick="messageclick" v-on:messageClose="messageClose" @getScanCode="getScanCode"></sinograin-message>-->
      <!--底部按钮们-->
      <tfoot-buttons :tfbtns="tfbtns" @tfootEvent="tfootEvent" ></tfoot-buttons>
      <div class="fixbtnwrap" v-if="fixbtn.show">
        <div class="fixbtn" :class="{btnloading:fixbtn.loading}" @click="fixbtnsubmit">
<!--			<i v-if="fixbtn.loading" class="el-icon-loading"></i>-->
			<span>
				{{fixbtn.btnText}}
			</span>					
		</div>
      </div>
    </div>
</template>

<style>
	.listpagewrap .packing .el-table__body-wrapper{
		overflow-y:auto;
	}
	/*整表滚动*/
	/*.listpagewrap .packing{
		overflow-y:auto;
		overflow-x:hidden;
	}*/
	.fixbtnwrap{
		position:fixed;
		bottom:0;
		right:0.6rem;
		height:0.75rem;
		left:3.1rem;
		text-align: center;
		background:white;
		border-top:1px solid rgba(241, 241, 241, 1);
	}
	.fixbtnwrap div.fixbtn{
		position:absolute;
		top:0.125rem;
		height:0.4rem;
		line-height: 0.33rem;
		/*margin:0 0 0 0.3rem;*/
		font-size: 0.24rem;
		cursor: pointer;
		background-color: #58b481;
		border-radius: 0.05rem;
		box-sizing: border-box;
		padding:0.04rem;
		color:#ffffff;
		z-index: 6;
	}
	.fixbtnwrap div.fixbtn span{
		border:1px solid #FFFFFF;
		border-radius:0.04rem;
		padding:0 0.2rem;
		font-weight: 500;
	}
	
	.fixbtnwrap div.fixbtn{
		display: inline-block;
		margin-top:0.125rem;
		position: static;
	}
</style>

<script>
import SinograinList from '@/components/common/action/List.vue';
import SinograinPrompt from '@/components/common/prompt/Prompt.vue';
import SinograinBreadcrumb from '@/components/common/action/Breadcrumb.vue';
import SinograinPagination from '@/components/common/action/Pagination.vue';
import ListHeader from '@/components/common/action/ListHeader.vue';
import SinograinModal from '@/components/common/action/Modal.vue';
import SinograinMessage from "@/components/common/action/Message"
import TfootButtons from '@/components/common/action/TfootButtons.vue';
import "@/assets/style/common/list.css"
import { mapState,mapMutations,mapGetters,mapActions} from 'vuex';

//这里是打印控件
import {getLodop} from 'static/lodop/LodopFuncs'
let LODOP
//本地测试要用下面import代码
//import data from '@/util/mock';



export default {
  components: {
    SinograinList,SinograinPrompt,SinograinPagination,SinograinBreadcrumb,SinograinModal,ListHeader,SinograinMessage,TfootButtons
  },
  computed:{
	...mapState(["modal_id_number","viewdata","editdata","aultdata","messions","mask"]),
	...mapGetters(["modal_id"]),
	tabledatasFilter(){

		if(this.filterStatus=="全部"){
			if(this.searchText){
				return 	this.tabledatas.filter((value,index)=>{
							return value.sampleNum.indexOf(this.searchText)>-1
						});
			}else{				
				return this.tabledatas;
			}
		}else{
			if(this.searchText){
				return 	this.tabledatas.filter((value,index)=>{
							var arr=value.checkeds.split(',')
							return (arr.includes(this.filterStatus))&&(value.sampleNum.indexOf(this.searchText)>-1)
						});
			}else{				
				return 	this.tabledatas.filter((value,index)=>{
							var arr=value.checkeds.split(',')
							return arr.includes(this.filterStatus)
						});;
			}
//			return this.tabledatas.filter((value,index)=>{
//				return value.status==this.filterStatus
//			})
		}
	}
  },
  created(){
  	if(this.$route.params.tabledatas){
  		this.tabledatas=this.$route.params.tabledatas;
		this.taskId=this.$route.params.id
  	}else{  		
		this.taskId=this.$route.query.id
  		this.getlistdata(1)
  	}
	console.log(this.taskId)
//	console.log(this.$route.query)
//  获取列表数据（第一页）
//	移除监听事件
    this.$root.eventHub.$off('delelistitem')
    this.$root.eventHub.$off("viewlistitem")
    this.$root.eventHub.$off("printlistitem")
//	监听列表删除事件
    this.$root.eventHub.$on('delelistitem',function(rowid,list){
    	
    		this.$confirm('此操作将删除该样品, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.tabledatas=this.tabledatas.filter(function(item){
		    		return item.id!==rowid;
		    	})
		      	this.$message({
		        	type: 'success',
		        	message: '删除成功!'
		      	});
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				});
			});
//  	this.sendDeleteId(rowid);
//  	console.log(rowid,list);
    }.bind(this)); 	
//	监听列表点击查看事件
  	this.$root.eventHub.$on("viewlistitem",function(id){  
//		console.log(id)
		this.$router.push({path: '/index/sampleDetection/packingList/packingView',query:{libid:id}})
		
  	}.bind(this));
//	监听列表点击打印事件
  	this.$root.eventHub.$on("printlistitem",function(code){  
		this.printitem(code);	
  	}.bind(this));
  },
  destroy(){
  	this.$root.eventHub.$off("viewlistitem")
    this.$root.eventHub.$off("printlistitem")
  	this.$root.eventHub.$off('delelistitem')
  },
  methods: {
  	...mapMutations(['create_modal_id','is_mask','create_modal','close_modal']),
  	...mapActions(['addAction']),
//	列表头触发的事件
	dateChange(data){
		console.log(data);
	},
	addbtn(){
//		this.$router.push({path: '/index/sampling/samplingList/samplingListCreate'})
		var name=this.$route.name+'/添加检验样品';
		var params={tabledatas:this.tabledatas};
		params.id=this.taskId
		if(this.$route.params.searching){
			params.searching=this.$route.params.searching
		}
		this.$router.push({name:name,params})
	},
	statusChange(data){
//		console.log(data)
		this.filterStatus=data.toString();
		this.actions.searchText=this.listHeader.statusitems[data]?this.listHeader.statusitems[data].text:'全部';
//		this.actions.colorcheckclass='colorcheck'+data;
	},
	createSampling(){
//		console.log('createSampling');
//		this.$router.push({path: '/index/sampling/samplingList/samplingListCreate'})
	},
	emptyCreate(){
//		this.scanCode();
	},
//	打开新建弹框
	createlib(){
		this.modalVisible=true;
	},
//	扫码新建样品
	scanCode(){
		if(!this.$_ault_alert('sample:getBySampleNum')){
			return
		}
		this.messages.type='scaning';
		this.messageShow=true;
//		this.$router.push({path: '/index/sampleDetection/packingList/packingPrint'})
	},
//	填入新建数据
	createlibitem(form){
		console.log(form);
	},
//	关闭新建弹框
	dialogClose(){
		this.modalVisible=false;
	},
//	获取搜索数据
  	searchingfor(searching,page){
		page?page:1;
//		if(!searching){
//			return this.tabledatas;
//		}
		this.searchText=searching.indexOf('监')==0?searching.slice(1):searching;
		console.log(this.searchText)
//		this.searchText=searching;
//		var params = {};
//		params.sampleNoOrSmallSampleNumLike = searching;
////		console.log(this.breadcrumb.searching);
//		// 获取列表数据（第？页）
//		this.$http({
//		    method: 'post',
//			url: this.searchURL,
//			transformRequest: [function (data) {
//				// Do whatever you want to transform the data
//				let ret = ''
//				for (let it in data) {
//				ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
//				}
//				return ret
//			}],
//			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
//			data: {
//				page:page,
//			    rows:this.page.size,
//			   	params:JSON.stringify(params)
//			}
//	    }).then(function (response) {
//		  	this.tabledatas=response.data.rows;
//			this.page.total = response.data.total;
//		}.bind(this)).catch(function (error) {
//		    console.log(error);
//		}.bind(this));
  	},
	
//	获取列表数据方法
  	getlistdata(page){
  		this.loading=true;
  		// var params={};
  		// params.taskId=this.$route.query.id;
  		// 获取列表数据（第？页）
		this.$http({
		    method: 'post',
			url: this.datalistURL,
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
//			    listName: this.list,
//			    page:page,
//			    rows:this.page.size,
			    // params:JSON.stringify(params),
				taskId:this.taskId
			}
	    }).then(function (response) {
//			console.log(response)
			if(response.data.length){				
				this.tabledatas = response.data;
				this.listHeader.addbtn=false;
				this.actions.nodele=true;
//				this.tfbtns.btnRight=false;
				this.fixbtn.show=false;
			}else{
//				this.listHeader.addbtn=true;
				this.listHeader.addbtn='添加检验样品';
				this.actions.nodele=false;
				this.fixbtn.show=true;
//				this.tfbtns.btnRight={};
//				this.tfbtns.btnRight.btnText='提交检验样品';
			}
//			this.page.total = response.data.total;
			this.loading = false;
		}.bind(this)).catch(function (error) {
		    console.log(error);
		}.bind(this));
  	},
  	//	发送删除id
  	sendDeleteId(id){
		this.$http({
		    method: 'post',
			url: this.deleteURL,
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data: {
			    listName: this.list,
			    id:id,
			}
	    }).then(function (response) {
		  	
		}.bind(this)).catch(function (error) {
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
  	paginationEvent(actiontype){
  		if(actiontype=='leading_out'){
  			console.log('leading_out')
  		}else if(actiontype=='refresh'){
  			// 获取列表数据（第一页）
			this.getlistdata(1)			
  		}
  	},
//	获取多选框选中数据的id(这是一个数组)
  	getchecked(checkedId){
  		this.checkedId=checkedId;
  	},
	messageclick(type){
  		if(type=="success"){
			console.log(type)
  		}else if(type=="error"){
  			console.log(type)  			
  		}
  	},
  	messageClose(){
  		this.messageShow=false;
  	},
  	getScanCode(code){
  		if(!code){
  			this.messageShow=false;
  		}else{  			
			this.messageShow=false;
			this.checkcode(code);			
		}
  	},
//	去验证条码有效否
	checkcode(code){
		this.$http({
		    method: 'post',
			url: this.checkURL,
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
				sampleNo:code,
			}
	    }).then(function (response) {
//			console.log(response)
			if(response.data.checkeds) {
				var path=this.$route.name+'/打印条码'
				this.$router.push({name: path,params: {code:response.data.sampleNum,sort:response.data.sort,checkeds:response.data.checkeds,id:response.data.id,sampleState:response.data.sampleState,taskId:this.$route.query.id}})
			}else{

				this.$notify.error({
		          	title: '未获取到检验信息',
		          	message: '请重新核对条码信息！！！',
		        });
			}
		}.bind(this)).catch(function (error) {
//		    console.log(error);

		    this.$notify.error({
	          	title: '扫码失败',
	          	message: '请重新核对条码信息！！！',
	        });
		}.bind(this));
	},
	printitem(code){
		this.messageShow=true;
		this.messages.type="loading";
		this.printCodeBar(code)
	},
	printCodeBar(code){
		LODOP = getLodop();

		LODOP.PRINT_INIT("打印条码");
		LODOP.SET_PRINTER_INDEX("Godex G530");  
		LODOP.SET_PRINT_PAGESIZE(1, 700, 400, "USER");
		LODOP.ADD_PRINT_BARCODE(3,30,232,115,'Codabar',code);
//  			LODOP.PREVIEW(); 
		LODOP.PRINT(); 

	},
	submit() {
		if(!this.tabledatas.length){
//			this.$alert('请先添加检验样品','提示信息',{type: 'warning'});
			this.$notify.error({
	          	title: '提交失败',
	          	message: '请先添加检验样品！！！',
	        });
		}
		var ids = [];
		for(var i=0; i<this.tabledatas.length;i++) {
//			console.log(this.tabledatas[i].id);
			ids.push(this.tabledatas[i].id);
		}
		this.fixbtn.loading=true;
		this.$http({
		    method: 'post',
			url: this.submitURL,
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
				ids:ids,
				taskId:this.taskId
			}
	    }).then(function (response) {
			this.fixbtn.loading=false;
	    	
	    	if(response.data.success){
//	    		this.$router.push({name:'样品检测/任务列表'})
	    		this.$router.push({name:'样品管理/任务列表'})
	    	}
			
		}.bind(this)).catch(function (error) {

		}.bind(this));
	},
	//	表单底部触发事件btnCenterNo btnCenterYes btnLeft btnRight btnOne
	tfootEvent(date){
		console.log(date);
		if(date=='btnCenterL'){
			
//			this.$router.go(-1)
		}else if(date=='btnCenterR'){

//			this.$router.go(-1)
		}else if(date=='btnLeft'){

		}else if(date=='btnRight'){

			this.submit();
		}else if(date=='btnOne'){

		}
	},
	fixbtnsubmit(){
		if(!this.$_ault_alert('sample:putIntoTask')){
			return
		}
//		console.log('tijiao')
		this.submit();
	},
	//	领取方法
  	handover(){
//		if(!this.$_ault_alert('handover:save')){
//			return
//		}
		var params = {};
		params.checkeds = this.formdatas.checkList.sort().join(',');
		params.name = this.formdatas.form.name;
		params.remark = this.formdatas.form.remarks;
		params.receiptor =this.receiptor;
		params.userId = this.userId;
		params.sampleAdmin = this.formdatas.form.manager;
		params.sampleNums = []
		params.sampleIds = [];
		this.formdatas.items.forEach((val)=>{
//			params.sampleNums.push(val.sampleNo)
			params.sampleNums.push(val.sampleNum)
			params.sampleIds.push(val.id)
		})
		
  		this.loading=false;
  		this.formdatas.loading=true;
  		// 获取列表数据（第？页）
		this.$http({
		    method: 'post',
			url: this.handoverURL,
			transformRequest: [function (data) {
				// Do whatever you want to transform the data
				let ret = ''
				for (let it in data) {
				ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
				}
				return ret
			}],
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data: params,
	    }).then(function (response) {
	    	if(response.data.success){	    		
	    		this.$router.push({ path: this.viewPath,query:{id:response.data.id} })
	    	}
		}.bind(this)).catch(function (error) {
		    console.log(error);
		}.bind(this));
  	},
  },
  data() {
    return {
      datalistURL: this.apiRoot +  '/grain/sample/getByTaskId',
      checkURL:this.apiRoot +'/grain/sample/getBySampleNo',
      searchURL:this.apiRoot +  '/grain/smallSample/data',
	  submitURL:this.apiRoot + '/grain/sample/putIntoTask',
      deleteURL:'/liquid/role2/data/delete',
      searchText:'',
	  taskId:'',
      checkedId:[],
      list:"samplinglist",
	  modalVisible:false,
	  modal:{
	  	title:'新建库点',
		formdatas:[
	  		{
	  			label:"单位名称",
	  			model:"unit",
	  		},
	  		{
	  			label:"库点名称",
	  			model:"lib",
	  		},
	  	],
	  	submitText:'确定',
	  },
      breadcrumb:{
      	search:true,   
      	searching:'',
      },
      loading:false,
//    loading:true,
      filterStatus:'全部',
//    分页数据
      page: {
        size: 10,
        total: 0,
        currentPage: 1,
        show:true,       
        tfootbtns:{
        	btns:false,//是否添加按钮组
        	leading_out:false,//导出按钮
        	refresh:false,//刷新按钮
        	delete:false, //删除按钮            	
        }
      },
//    弹窗数据
      alerts: [{
        title: '温馨提示：此页面只展示本库信息!',
        type: 'info'
      }],
//    表格数据
      listHeader:{
      	class:'checks',
      	createlib:false,
      	createSampling:false,
      	status:true,
      	statusTitle:'检测项目：',
      	statusitems:[
//    		{label:1,text:'容重'},
//    		{label:2,text:'水分'},
//    		{label:3,text:'杂质(矿物质)'},
//    		{label:4,text:'不完善粒(生霉粒)'},
//    		{label:5,text:'色泽气味(质量指标)'},
//    		{label:6,text:'面筋吸水量'},
//    		{label:7,text:'脂肪酸值'},
//    		{label:8,text:'品尝评分值'},
//    		{label:9,text:'色泽气味(储存品质指标)'},
//    		{label:10,text:'真菌毒素(黄曲霉毒素B1、脱氧雪腐、镰刀菌烯醇、玉米赤霉烯酮)'},
//    		{label:11,text:'重金属(铅、镉、汞、砷)'},
      		
			{text:'全部',label:'全部',id:'1111'},
      		{text:'容重',label:'1',id:'1'},
			{text:'水分',label:'2',id:'2'},
			{text:'杂质',label:'3',id:'3'},
			{text:'矿物质',label:'4',id:'4'},
			{text:'不完善粒',label:'5',id:'5'},
			{text:'生霉粒',label:'6',id:'6'},
			{text:'色泽气味(质量指标)',label:'7',id:'7'},
			{text:'硬度指数',label:'8',id:'8'},
			{text:'面筋吸水量',label:'9',id:'9'},
			{text:'脂肪酸值',label:'10',id:'10'},
			{text:'品尝评分值',label:'11',id:'11'},
			{text:'色泽气味(储存品质指标)',label:'12',id:'12'},
			{text:'真菌毒素(黄曲霉毒素B1)',label:'13',id:'13'},
			{text:'真菌毒素(脱氧雪腐镰刀菌烯醇)',label:'14',id:'14'},
			{text:'真菌毒素(玉米赤霉烯酮)',label:'15',id:'15'},
			{text:'重金属(铅)',label:'16',id:'16'},
			{text:'重金属(镉)',label:'17',id:'17'},
			{text:'重金属(汞)',label:'18',id:'18'},
			{text:'重金属(砷)',label:'19',id:'19'},
      	],
      	date:true,
//    	scanCode:true,
		addbtn:'添加检验样品',
      },
      tabledatas:[
        
      ],
      items: [
      {
        id: 1,
        prop:'sampleNum',
//      prop:'sampleNo',
        label: "检验编号",
		status:true,
		minWidth:200,
      },
      {
        id: 2,
        prop:'colorCheckeds',
        label: "检验项目",
		status:true,
		minWidth:600,
      },
//    {
//      id: 3,
//      prop:'checkPoint',
//      label:"检验项目",
//		status:true,
//    },
//    {
//      id: 4,
//      prop:'printTimes',
//      label: "打印条码数",
//
//    },
//    {
//      id: 5,
//      prop:'printDate',
//      label:"打印时间",
//      sort:true,
//    },
      ],
      actions:{
      	noview:true,
      	selection:false,
      	number:true,
      	view:false,
      	edit:false,
      	dele:true,
//    	print:true,
      	show:true,
      	manuscript:false,
      	safetyReport:false,
//    	colorcheck:true,
//    	colorcheckclass:'colorcheck',
		searchText:'全部',
      	height:'5.7rem',
      	actionWidth:'170',
//    	sort:'smallSampleNum',
      },
      messageShow:false,
	  messages:{
	  	type:'scaning',
	  	scaning:{
	  		icon:'iconfont icon-iconset0255',
	  		messageTittle:'开始扫描',
	  		messageText:'不要点击键盘和鼠标请将扫码枪对准条形码，然后按下扫码枪按钮！',
	  	},
	  	success:{
	  		icon:'el-icon-success',
	  		messageTittle:'该样品已入库',
	  		messageText:'可点击编辑按钮修改入库信息！',
	  		buttonText:'编辑',
	  	},
	  	loading:{
	  		icon:'el-icon-printer',
	  		messageTittle:'正在打印中...',
	  		messageText:'请您耐心等待，正在打印中...',
	  	},
	  },
	  tfbtns:{
//    	btnCenter:{
//			btnTextL:'不同意',
//			btnTextR:'同意',
//			doubleColor:true,
//		},
//		btnLeft:{
//			btnText:'导出Excel表格',
//		},
//		btnRight:{
//			btnText:'提交检验样品',
//		},
//		btnOne:{
//			btnText:'导出Excel表格',
//		},   
		borderTop:true,
      },
      fixbtn:{
      	show:true,
      	btnText:'提交检验样品',
//    	loading:true,
      }
    }
  }
}
</script>

