<template>
    <div class='listpagewrap'>
      <!--面包屑-->
      <sinograin-breadcrumb :breadcrumb="breadcrumb" v-on:searchingfor="searchingfor"></sinograin-breadcrumb>
      <!--alert-->
      <!--<sinograin-prompt :alerts="alerts"></sinograin-prompt>-->
      <!--表格上的时间选框以及 创建-->
      <list-header-more :listHeader="listHeader" v-on:dateChange="dateChange" v-on:statusChange="statusChange" v-on:createSampling="createSampling" v-on:createlib="createlib" v-on:scanCode="scanCode" @remChange="remChange"  @selectlibChange="selectlibChange" @createSampleNum="createSampleNum"></list-header-more>
      <!--列表入库样品总数-->
      <div class="clear"></div>
      <p class="totalsample">
      	<span class="total">已入库样品总数:
        	<b>{{sampleInTotal}}</b>
        </span>
      </p>
      <div class="clear"></div>
      <!--表格-->
      <sinograin-list class="list le" :tabledata="tabledatas" :list="list" :items="items" :actions="actions" v-on:getchecked="getchecked" :loading="loading" v-on:emptyCreate="emptyCreate" > 
      </sinograin-list>
      <!--分页-->
      <sinograin-pagination :page="page" v-on:paginationEvent="paginationEvent" v-on:getCurrentPage="getCurrentPage"></sinograin-pagination>
      <!--新建库典弹框-->
      <sinograin-modal v-if="modalVisible"  :modal="modal" v-on:createlibitem="createlibitem" v-on:dialogClose="dialogClose" @modelSelectChange="modelSelectChange"></sinograin-modal>      	
      <sinograin-message v-if="messageShow" :messages="messages" v-on:messageclick="messageclick" v-on:messageClose="messageClose" @getScanCode="getScanCode"></sinograin-message>
    </div>
</template>

<style>
p.totalsample{
	border:solid 1px #eaeaea;
	border-bottom:none;
	overflow: hidden;
}
p.totalsample >span{
	float:right;
	font-size:0.16rem;
	padding-right:0.5rem;
	line-height:0.3rem;
}
p.totalsample >span>b{
	font-weight: normal;
	color:#2380FF;
}	
</style>

<script>
import SinograinList from '@/components/common/action/List.vue';
import SinograinPrompt from '@/components/common/prompt/Prompt.vue';
import SinograinBreadcrumb from '@/components/common/action/Breadcrumb.vue';
import SinograinPagination from '@/components/common/action/Pagination.vue';
import ListHeaderMore from '@/components/common/action/ListHeaderMore.vue';
import SinograinModal from '@/components/common/action/Modal.vue';
import SinograinMessage from "@/components/common/action/Message"
import "@/assets/style/common/list.css"
import { mapState,mapMutations,mapGetters,mapActions} from 'vuex';

//这里是打印控件
import {getLodop} from 'static/lodop/LodopFuncs'
let LODOP
//本地测试要用下面import代码
//import data from '@/util/mock';



export default {
  components: {
    SinograinList,SinograinPrompt,SinograinPagination,SinograinBreadcrumb,SinograinModal,ListHeaderMore,SinograinMessage
  },
  computed:{
	...mapState(["modal_id_number","viewdata","editdata","aultdata","messions","mask"]),
	...mapGetters(["userName"]),
	tabledatasFilter(){

		if(this.filterStatus=="全部"){
			return this.tabledatas;
		}else{
			return this.tabledatas.filter((value,index)=>{
				return value.sampleStatus==this.filterStatus
			})
		}
	}
  },
  created(){
//	console.log(this.$route.query)
  	this.modal.formdatas[5].value=this.userName;
//  获取列表数据（第一页）
	this.getlistdata(1)
	this.getlibrarylist()
	this.getdepotlist()
	this.getcounterlist()
	this.getplacelist()
//	移除监听事件
    this.$root.eventHub.$off('delelistitem')
    this.$root.eventHub.$off("viewlistitem")
    this.$root.eventHub.$off("editlistitem")
    this.$root.eventHub.$off("printlistitem")
//	监听列表删除事件
    this.$root.eventHub.$on('delelistitem',function(rowid,list){
    	this.tabledatas=this.tabledatas.filter(function(item){
    		return item.id!==rowid;
    	})
    	this.sendDeleteId(rowid);
//  	console.log(rowid,list);
    }.bind(this)); 	
//	监听列表点击查看事件
  	this.$root.eventHub.$on("viewlistitem",function(id,sampleState,row){  
  		if(!this.$_ault_alert('sample:getById')){
			return
		}
//		console.log(row.storage)
		if(row.storage=='null--null--null'){
			this.modal.title="请完善储存信息"
			this.modal.formdatas[0].value=row.sampleNo;
			this.dataBySampleNo=row;
			this.modal.formdatas[3].selectitems=[];
			this.modal.formdatas[4].selectitems=[];
  			this.continuity=false;			
  			this.modalVisible=true;
			return
		}
		this.$router.push({path: '/index/sampleManagement/sampleIn/sampleInEdit',query:{libid:id}})
		
  	}.bind(this));
  	//	监听列表点击编辑事件
  	this.$root.eventHub.$on("editlistitem",function(id){  
//		console.log(id)
		this.$router.push({path: '/index/sampleManagement/sampleIn/sampleInEdit',query:{id:id}})
		
  	}.bind(this));
  	//	监听列表点击打印事件
  	this.$root.eventHub.$on("printlistitem",function(code){  
		this.printitem(code);	
  	}.bind(this));
  },
  destroy(){
  	this.$root.eventHub.$off("viewlistitem")
  	this.$root.eventHub.$off('delelistitem')
  },
  methods: {
  	...mapMutations(['create_modal_id','is_mask','create_modal','close_modal']),
  	...mapActions(['addAction']),
//	列表头触发的事件
//	时间选择
	dateChange(date){
//		console.log(date);
		this.dateStart=date[0];
		this.dateEnd=date[1];
		this.getlistdata(1)
		
	},
//	备注选择
	remChange(remark){
//		console.log(remark)
		this.remark=remark
		this.getlistdata(1)
	},
//	检验状态选择
	statusChange(data){
		console.log(data)
		this.filterStatus=data
		this.getlistdata(1)
	},
	//	筛选库
	selectlibChange(libtype,selectLibraryId){
		this.selectLibraryId=selectLibraryId;
		this.libtype=libtype;
//		console.log(this.libtype,this.selectLibraryId)
//		this.filterlib=lib
//		console.log(this.filterlib)
		this.getlistdata(1)
	},
	createSampling(){
//		console.log('createSampling');
		this.$router.push({path: '/index/sampling/samplingList/samplingListCreate'})
	},
	emptyCreate(){
		this.scanCode();
	},
//	打开新建弹框
	createlib(){
		this.modalVisible=true;
	},
//	创建检验编号
	createSampleNum(){
//		console.log('createSampleNum')
		this.$router.push({path: '/index/sampleManagement/sampleIn/createSampleInNum'})
	},
//	扫码新建样品
	scanCode(){
		if(!this.$_ault_alert('sample:getBySampleNo')){
			return
		}
		this.messages.type='scaning';
		this.messageShow=true;
//		this.createlib()
	},
//	填入新建数据并点击确认
	createlibitem(form){
		
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
				id: this.dataBySampleNo.id,
				placeId: form.place,
				autograph: form.autograph,
			}
	    }).then(function (response) {
//			console.log(response)
			if(response.data.success) {
				//将已选柜子去掉
				this.placeList=this.placeList.filter(function(item,index){
					return item.id!==form.place
				})
				this.getlistdata(1);
//				this.getplacelist();
				this.$notify({
		          	title: '储存成功',
		          	message: '该样品已成功储存！！！',
		          	type: 'success'
		        });
//		        this.printCodeBar(this.modal.formdatas[0].value)
			}else{
				this.$notify.error({
		          	title: '储存失败',
		          	message: '请重新核对储存信息！！！',
		        });
			}
		}.bind(this)).catch(function (error) {
//		    console.log(error);
		    this.$notify.error({
	          	title: '储存失败',
	          	message: '请重新核对储存信息！！！',
	        });
		}.bind(this));
		// this.$router.push({path: '/index/sampleManagement/sampleIn/sampleInCreate', params: {'position': form.position,'sampleInName': form.sampleInName} })
		// this.$router.push({name: "样品管理/样品储存列表/新建样品", params: {'yangpinshi': form.yangpinshi,'gui': form.gui,'sampleInSign': form.sampleInSign,'sampleNumber': form.sampleNumber} })
	},
//	关闭新建弹框
	dialogClose(){
		this.modalVisible=false;
		//关闭储存框后打开扫描框
		if(this.continuity){			
			this.messageShow=true;
		}
	},
//	获取搜索数据
  	searchingfor(searching,page){
  		page?page:1;
  		this.searchText=searching.indexOf('监')==0?searching.slice(1):searching;
//		console.log(this.searchText);
  		var params = {};
		params.sampleWordOrsampleNumLike = this.searchText;
		params.ruKuSampleState = 2
		params.fenxiaoyangSampleState = 3
		params.rank = 'sampleNum'
//		console.log(this.breadcrumb.searching);
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
				page:page,
			    rows:this.page.size,
			   	params:JSON.stringify(params)
			}
	    }).then(function (response) {
			this.tabledatas=response.data.rows;
	  		this.page.total=response.data.total;
	  		this.page.currentPage=page;
		}.bind(this)).catch(function (error) {
		    console.log(error);
		}.bind(this));
  	},
  	getsample(){
  		this.loading=false;
  		// 获取列表数据（第？页）
		this.$http({
		    method: 'post',
			url: this.getSampleNoURL,
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
			   sampleNo : this.modal.formdatas[0].value
			}
	    }).then(function (response) {
			this.dataBySampleNo = response.data;
			if(this.dataBySampleNo.sampleState == 2||this.dataBySampleNo.sampleState == 3) {

				this.messages.type='success';
				
			} else {
				this.messageShow=false;				
  				this.modalVisible=true;
			}
		}.bind(this)).catch(function (error) {
		    console.log(error);
		}.bind(this));
  	},
//	获取列表数据方法
  	getlistdata(page){
		var params = {};
		params.sampleWordOrsampleNumLike = '';
		params.ruKuSampleState = 2;
		params.fenxiaoyangSampleState = 3;
		params.rank = 'sampleNum';
		if(this.selectLibraryId!=='全部'){
			params[this.libtype]=this.selectLibraryId
		}
		if(this.dateStart){
			params.dateStart=this.dateStart
			params.dateEnd=this.dateEnd
		}
		if(this.remark){
			params.remarkLike=this.remark
		}
		if(this.filterStatus!=='全部'){
			params.detectionState=this.filterStatus
		}
  		this.loading=false;
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
			    listName: this.list,
			    page:page,
			    rows:this.page.size,
				params:JSON.stringify(params)
			}
	    }).then(function (response) {
//			console.log(response)
		  	this.tabledatas=response.data.rows;
	  		this.page.total=response.data.total;
	  		this.page.currentPage=page;
	  		if(!this.sampleInTotal){
	  			this.sampleInTotal=response.data.total
	  		}
		}.bind(this)).catch(function (error) {
		    console.log(error);
		}.bind(this));
  	},
  	getlibrarylist(){
		var params = {};
		params.pLibraryId = -1
  		// 获取列表数据（第？页）
		this.$http({
		    method: 'post',
			url: this.librarylistURL,
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
			  	this.listHeader.libraryList = response.data;
		}.bind(this)).catch(function (error) {
		    console.log(error);
		}.bind(this));
	},
	//获取室信息
	getdepotlist(){
//		var params = {};
//		params.pLibraryId = -1
  		// 获取列表数据（第？页）
		this.$http({
		    method: 'post',
			url: this.depotlistURL,
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
		   		response.data.forEach(function(item,index){
		   			var obj={};
		   			obj.id=item.id;
		   			obj.label=item.depot;
		   			obj.value=item.id;
		   			this.depotList.push(obj);
		   		}.bind(this))
		   		this.modal.formdatas[2].selectitems=this.depotList;
//			  	this.listHeader.libraryList = response.data;
		}.bind(this)).catch(function (error) {
		    console.log(error);
		}.bind(this));
	},
//获取柜子信息
	getcounterlist(){
//		var params = {};
//		params.pLibraryId = -1
  		// 获取列表数据（第？页）
		this.$http({
		    method: 'post',
			url: this.counterlistURL,
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
		   		response.data.forEach(function(item,index){
		   			var obj={};
		   			obj.id=item.id;
		   			obj.label=item.counter;
		   			obj.pId=item.pId;
		   			obj.value=item.id;
		   			this.counterList.push(obj);
		   		}.bind(this))
//			  	this.listHeader.libraryList = response.data;
		}.bind(this)).catch(function (error) {
		    console.log(error);
		}.bind(this));
	},
//获取位置信息
	getplacelist(){
//		var params = {};
//		params.pLibraryId = -1
  		// 获取列表数据（第？页）
		this.$http({
		    method: 'post',
			url: this.placelistURL,
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
		   		this.placeList=[];
		   		response.data.forEach(function(item,index){
		   			if(item.isStorage==1){		   				
		   				var obj={};
		   				obj.id=item.id;
		   				obj.pId=item.pId;
		   				obj.label=item.place;
		   				obj.value=item.id;
		   				this.placeList.push(obj);
		   			}
		   		}.bind(this))
//			  	this.listHeader.libraryList = response.data;
		}.bind(this)).catch(function (error) {
		    console.log(error);
		}.bind(this));
	},
//	弹框中的下拉框变化
	modelSelectChange(val,model){
//		console.log(val,model)
		if(model=='depot'){
			this.modal.formdatas[3].selectitems=this.counterList.filter((item,index)=>{return item.pId==val})
			this.modal.formdatas[4].selectitems=[];
		}else if(model=='counter'){
			this.modal.formdatas[4].selectitems=this.placeList.filter((item,index)=>{return item.pId==val})
		}else if(model=='place'){
//			console.log(val)
		}
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
	titleEvent(){
  		console.log('titleEvent');
  	},
  	messageclick(type){
  		if(type=="success"){
//			console.log("去编辑页面！！！")
  			var editPath=this.$route.path+'/sampleInEdit'
  			this.$router.push({path:editPath,query:{libid:this.dataBySampleNo.id}})
//			console.log(type)
  		}else if(type=="error"){
  			console.log(type)  			
  		}
  	},
  	messageClose(){
  		this.messageShow=false;
  	},
  	getScanCode(code){
		this.modal.title="储存";
  		this.continuity=true;
  		if(!code){
  			this.messageShow=false;
  		}else{  			
			this.modal.formdatas[0].value=code;
			this.modal.formdatas[3].selectitems=[];
			this.modal.formdatas[4].selectitems=[];
			
//			this.modal.formdatas[0].value=6000601005;
//			this.messageShow=false;
			this.getsample();
  		}
  	},
  	getDateNow(){
  		var date1=new Date()
  		return date1.getFullYear()+'-'+(date1.getMonth()+1)+'-'+date1.getDate()
  	},
  	printitem(code){
		this.messageShow=true;
		this.messages.type="loading";
		this.printCodeBar(code);
	},
  	printCodeBar(code){
		LODOP = getLodop();

		LODOP.PRINT_INIT("打印条码");
		LODOP.SET_PRINTER_INDEX("Godex G530");  
		LODOP.SET_PRINT_PAGESIZE(1, 700, 400, "USER");
		LODOP.ADD_PRINT_BARCODE(3,35,225,115,'128B',code);
//  	LODOP.PRINT_DESIGN();
//  	LODOP.PREVIEW();
		LODOP.PRINT(); 

	},
  },
  data() {
    return {
      datalistURL: this.apiRoot + '/grain/sample/data',
	  getSampleNoURL: this.apiRoot + '/grain/sample/getBySampleNo',
	  editURL: this.apiRoot + '/grain/sample/saveRukuXinxi',
	  librarylistURL: this.apiRoot + '/grain/library/getAll',
	  depotlistURL: this.apiRoot + '/grain/warehouse/getAll',
	  counterlistURL: this.apiRoot + '/grain/warehouseCounter/getAll',
	  placelistURL: this.apiRoot + '/grain/warehouseCounterPlace/getAll',
	  searchURL:this.apiRoot + '/grain/sample/data',
      deleteURL:'/liquid/role2/data/delete',
      searchText:'',
      sampleInTotal:0,
      checkedId:[],
	  dataBySampleNo: {},
	  depotList:[],
      counterList:[],
      placeList:[],
      continuity:true,//连续储存开关
      list:"samplinglist",
	  modalVisible:false,
	  modal:{
	  	title:'储存',
		formdatas:[
			{
	  			label:"扦样编号:",
	  			model:"sampleNo",
	  			disabled:true,
	  			value:'',
	  			type:'input',
	  		},
			// {
	  		// 	label:"检验编号",
	  		// 	model:"sampleNum",
	  		// 	disabled:true,
	  		// 	value:'',
	  		// },
	  		{
	  			label:"储存时间:",
	  			model:"storageTime",
	  			disabled:true,
	  			value:this.getDateNow(),
	  			type:'input',
	  		},
//	  		{
//	  			label:"存放位置:",
//	  			position:true,
//				model: "positions",
//				value:'',
////	  			model:"position",
//	  			modelselect:"depot",
//	  			modelinput:"counter",
////	  			value:'朔水-9号仓-1号柜',
//	  		},
	  		{
	  			label:"选择样品室:",
	  			type:'select',
	  			selectitems:[],
	  			model:"depot",
				value:'',
	  		},
	  		{
	  			label:"选择柜号:",
	  			type:'select',
	  			selectitems:[],
	  			model:"counter",
				value:'',		
	  		},
	  		{
	  			label:"选择位置:",
	  			type:'select',
	  			selectitems:[],
	  			model:"place",
				value:'',		
				empty:'已满',
	  		},
	  		{
	  			label:"样品签收:",
	  			model:"autograph",
				value: "",
	  			disabled:true,
	  			type:'input',
	  		},
	  	],
//	  	addprop:true,
	  	submitText:'储存',
	  },
      breadcrumb:{
      	search:true,   
      	searching:'',
      },
      subtitle:{
      	btn:false,
      	btntext:'',
      },
      loading:true,
      
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
        title: '温馨提示：储存前请准备好条码打印机，以便于更换检验编号!',
        type: 'info'
      }],
//    表格数据
      listHeader:{
      	createlib:false,
      	createSampling:false,
      	date1:true,
      	date1Title:'储存时间：',
      	selectlib:true,
      	libraryList:[],
      	scanCode:true,
//    	createSampleNum:true,
      	status:true,
      	statusTitle:'检验状态：',
      	statusitems:[
      		{label:'全部',text:'全部'},
      		{label:1,text:'未检测'},
      		{label:2,text:'已检测'},
      	],
      	selectRem:true,
      },
      libtype:'pLibrary',
      selectLibraryId:'全部',
//    remark:'',
      filterStatus:'全部',//检验状态
      dateStart:0,//开始时间
      dateEnd:9999999999999999999999999,//结束时间
      remark:'',//备注信息
      tabledatas:[],
      items: [
//    {
//      id: 1,
//      prop:'sampleNo',
//      label: "检验编号",
////      status:true,
////      sort:true
//    },
      {
        id: 1,
        prop:'sampleNum',
        label: "检验编号",
        status:true,
//      sort:true
      },
      {
        id: 2,
        prop:'sampleWord',
        label: "扦样编号",
//      sort:true
      },
      {
        id: 3,
        prop:'sort',
        label:"品种",
//      width:80,
//      sort:true,
      },
      {
        id: 4,
        prop:'storage',
        label: "存放位置",
        minWidth:130,
//      width:'15%',
//      status:true,
//      sort:true,
      },
      {
        id: 5,
        prop:'sampleState',
        label:"状态",
        status:true,
//      width:80,
//      sort:true,
      },
      {
        id: 6,
//      prop:'sampleState',
        prop:'detectionState',
        label:"检验状态",
        status:true,
//      width:80,
//      sort:true,
      },
      {
        id: 7,
        prop:'storageTime',
        label:"储存时间",
//      width:80,
//      sort:true,
      },
      {
        id: 8,
        prop:'autograph',
        label:"样品签收",
//      width:80,
//      sort:true,
      },
      {
        id: 9,
        prop:'remark',
        label:"备注",
//      width:100,
//      sort:true,
      },
      ],
      actions:{
      	selection:false,
      	number:false,
      	view:false,
//    	edit:true,
      	show:true,
      	dele:false,
      	manuscript:false,
      	safetyReport:false,
      	printSampleIn:true,
//    	sort:'sampleNum',
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
	  		messageTittle:'该样品已储存',
	  		messageText:'可点击编辑按钮修改储存信息！',
	  		buttonText:'查看',
	  	},
	  	loading:{
	  		icon:'el-icon-printer',
	  		messageTittle:'正在打印中...',
	  		messageText:'请您耐心等待，正在打印中...',
	  	},
	  },
    }
  }
}
</script>

