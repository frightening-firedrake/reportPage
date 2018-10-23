<template>
    <div class='listpagewrap'>
      <!--面包屑-->
      <sinograin-breadcrumb :breadcrumb="breadcrumb" v-on:searchingfor="searchingfor"></sinograin-breadcrumb>
      <!--alert-->
      <sinograin-prompt :alerts="alerts"></sinograin-prompt>
      <!--表格上的时间选框以及 创建-->
      <list-header :listHeader="listHeader" v-on:dateChange="dateChange" v-on:statusChange="statusChange" @statusChange2="statusChange2" v-on:createSampling="createSampling" v-on:createlib="createlib" v-on:scanCode="scanCode" @remChange="remChange"></list-header>
      <!--表格-->
      <!--<sinograin-list class="list nopointer" :tabledata="tabledatas"  :items="items" :actions="actions" v-on:getchecked="getchecked" :loading="loading" v-on:emptyCreate="emptyCreate" >--> 
      <sinograin-list class="list auto" :tabledata="tabledatas"  :items="items" :actions="actions" v-on:getchecked="getchecked" :loading="loading" v-on:emptyCreate="emptyCreate" > 
      </sinograin-list>
      <!--分页-->
      <!--<sinograin-pagination :page="page" v-on:paginationEvent="paginationEvent" v-on:getCurrentPage="getCurrentPage"></sinograin-pagination>-->
      <!--底部按钮们-->
      <tfoot-buttons :tfbtns="tfbtns" @tfootEvent="tfootEvent" ></tfoot-buttons>
      <!--弹框-->
      <sinograin-modal v-if="modalVisible" :modal="modal" v-on:createlibitem="createlibitem" v-on:dialogClose="dialogClose" @modelSelectChange="modelSelectChange"></sinograin-modal>
    </div>
</template>

<style>
.auto .el-table__body-wrapper{
	height:auto!important;
}
</style>

<script>
import SinograinList from '@/components/common/action/List.vue';
import SinograinPrompt from '@/components/common/prompt/Prompt.vue';
import SinograinBreadcrumb from '@/components/common/action/Breadcrumb.vue';
import SinograinPagination from '@/components/common/action/Pagination.vue';
import ListHeader from '@/components/common/action/ListHeader.vue';
import TfootButtons from '@/components/common/action/TfootButtons.vue';
import SinograinModal from '@/components/common/action/Modal.vue';
import "@/assets/style/common/list.css"
import { mapState,mapMutations,mapGetters,mapActions} from 'vuex';

export default {
  components: {
    SinograinList,SinograinPrompt,SinograinPagination,SinograinBreadcrumb,ListHeader,TfootButtons,SinograinModal
  },
  computed:{
	...mapState(["modal_id_number","viewdata","editdata","aultdata","messions","mask"]),
	...mapGetters(["userName"]),
	tabledatasFilter(){

		if(this.filterStatus=="全部"&&this.filterStatus2=="全部"){
			return this.tabledatas;
		}else if(this.filterStatus2=="空闲"){
			return this.tabledatas.filter((value,index)=>{
				return value.depot==this.filterStatus&&((value.warehouseUseNumber)/(value.warehousetotal)>=0)&&((value.warehouseUseNumber)/(value.warehousetotal)<0.4)
			})
		}else if(this.filterStatus2=="未满"){
			return this.tabledatas.filter((value,index)=>{
				return value.depot==this.filterStatus&&((value.warehouseUseNumber)/(value.warehousetotal)>=0.4)&&((value.warehouseUseNumber)/(value.warehousetotal)<1)
			})
		}else if(this.filterStatus2=="已满"){
			return this.tabledatas.filter((value,index)=>{
				return value.depot==this.filterStatus&&((value.warehouseUseNumber)/(value.warehousetotal)==1)
			})
		}
	}
  },
  created(){
  	this.listHeader.title=this.$route.query.title;
//	console.log(this.$route.query)
//  获取列表数据（第一页）
	this.getlistdata(1)
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
  	this.$root.eventHub.$on("viewlistitem",function(id){  
  		if(!this.$_ault_alert('sample:getById')){
			return
		}
//		console.log(id)

		this.$router.push({path: '/index/sampleManagement/warehouseManagement/sampleRoom/SampleInView',query:{id:id}})
		
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
	dateChange(data){
		console.log(data);
	},
	statusChange(data){
//		console.log(data)
		this.filterStatus=data
	},
	statusChange2(data){
		this.filterStatus2=data
	},
	remChange(remark){
		this.remark=remark;
		this.getlistdata(1);
//	  	this.page.currentPage=1;
	},
	createSampling(){
//		console.log('createSampling');
		this.$router.push({path: '/index/sampling/samplingList/samplingListCreate'})
	},
	emptyCreate(){

	},
	//	扫码新建样品
	scanCode(){

	},
	createlib(){
		
	},
//	获取搜索数据
  	searchingfor(searching,page){
  		page?page:1;
  		this.searchText=searching.indexOf('监')==0?searching.slice(1):searching;
  		console.log(this.searchText);
  		var params = {};
		params.sampleWordOrsampleNumLike = this.searchText;
		params.ruKuSampleState = 2
		params.fenxiaoyangSampleState = 3
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
			   params:JSON.stringify(params)
			}
	    }).then(function (response) {
			this.tabledatas=response.data.rows;
	  		this.page.total=response.data.total;

		}.bind(this)).catch(function (error) {
		    console.log(error);
		}.bind(this));
  	},
//	获取列表数据方法
  	getlistdata(page){
		var params = {};
		params.counterId = this.$route.query.counterId;
		params.remark = this.remark;
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
				params: JSON.stringify(params),
				// counterId:this.$route.query.counterId,
//				page:page,
//			    rows:this.page.size,
			}
	   	}).then(function (response) {
		  	this.tabledatas=response.data;
//	  		this.page.currentPage=page;
//	  		this.page.total=response.data.total;
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
  	getchecked(checkedId,data){
		this.checkedData=data;
  		this.checkedId=checkedId;
  	},
	titleEvent(){
  		console.log('titleEvent');
  	},
  	getDateNow(){
  		var date1=new Date()
  		return date1.getFullYear()+'-'+(date1.getMonth()+1)+'-'+date1.getDate()
  	},
  	//	表单底部触发事件btnCenterNo btnCenterYes btnLeft btnRight btnOne
	tfootEvent(date){
//		console.log(date);
		if(date=='btnCenterL'){		
			if(!this.$_ault_alert('sample:editPlace')){
				return
			}
			if(!this.checkedId.length){
				this.$notify.error({
		          	title: '错误提示',
		          	message: '请先选择待转移样品！！！',
		        });
		        return
			}else if(this.checkedId.length>1){
				this.$notify.error({
		          	title: '错误提示',
		          	message: '转移样品仅支持单选！！！',
		        });
		        return
			}
			
			this.modal=this.modal1;
			this.modalVisible=true;
		}else if(date=='btnCenterR'){
			if(!this.$_ault_alert('sample:dispose')){
				return
			}
			if(!this.checkedId.length){
				this.$notify.error({
		          	title: '错误提示',
		          	message: '请先选择待处理样品！！！',
		        });
		        return
			}
			
			this.modal=this.modal2;
			this.modalVisible=true;
		}else if(date=='btnLeft'){

		}else if(date=='btnRight'){

		}else if(date=='btnOne'){

		}
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
		   		this.modal1.formdatas[0].selectitems=this.depotList;
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
			this.modal.formdatas[1].selectitems=this.counterList.filter((item,index)=>{return item.pId==val})
			this.modal.formdatas[2].selectitems=[];
		}else if(model=='counter'){
			this.modal.formdatas[2].selectitems=this.placeList.filter((item,index)=>{return item.pId==val})
		}else if(model=='place'){
//			console.log(val)
		}
	},
//	填入新建数据
	createlibitem(form,title){
		console.log(form,title);
		if(title=="转移") {
			this.zhuanyi(form);
		} else if(title == "处理") { 
			this.chuli(form);
		}

	},
	//转移方法
	zhuanyi(form) {
		this.$http({
		    method: 'post',
			url: this.zhuanyiURL,
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
				id: this.checkedId[0], 
				oldPlaceId: this.checkedData[0].placeId,
				placeId: form.place,
			},
	   	}).then(function (response) {
//	   		console.log(response)
			if(response.data.success){
				this.getlistdata(1)
				this.getplacelist()
				this.$notify({
		          	title: '转移成功',
		          	message: '转移样品成功！！！',
		          	type: 'success'
		       	});
			}else{
				this.$notify.error({
		          	title: '错误提示',
		          	message: '转移样品失败！！！',
		        });
			}
		}.bind(this)).catch(function (error) {
		    console.log(error);
		}.bind(this));
	},
	//处理方法
	chuli(form) {
		var ids=this.checkedId.join(',')
		this.$http({
		    method: 'post',
			url: this.chuliURL,
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
				ids:ids,
				dispose: form.dispose,
				disposeReason:form.disposeReason,
			},
	   	}).then(function (response) {
	   		if(response.data.success){
				this.getlistdata(1)
				this.getplacelist()
				this.$notify({
		          	title: '处理成功',
		          	message: '处理样品成功！！！',
		          	type: 'success'
		       	});
			}else{
				this.$notify.error({
		          	title: '错误提示',
		          	message: '处理样品失败！！！',
		        });
			}
		}.bind(this)).catch(function (error) {
		    console.log(error);
		}.bind(this));
	},
//	关闭新建弹框
	dialogClose(){
		this.modalVisible=false;
	},
  },
  data() {
    return {
      datalistURL: this.apiRoot + '/grain/sample/getByCounterId',
	  editURL: this.apiRoot + '/grain/sample/edit',
	  searchURL:this.apiRoot + '/grain/sample/data',
	  depotlistURL: this.apiRoot + '/grain/warehouse/getAll',
	  counterlistURL: this.apiRoot + '/grain/warehouseCounter/getAll',
	  placelistURL: this.apiRoot + '/grain/warehouseCounterPlace/getAll',
	  zhuanyiURL:this.apiRoot + '/grain/sample/editPlace',
	  chuliURL:this.apiRoot + '/grain/sample/dispose',
      deleteURL:'/liquid/role2/data/delete',
      searchText:'',
      remark:'',
      checkedId:[],
      checkedData:[],
      depotList:[],
      counterList:[],
      placeList:[],
	  dataBySampleNo: {},
      breadcrumb:{
//    	search:true,   
      	searching:'',
      },
      subtitle:{
      	btn:false,
      	btntext:'',
      },
      loading:true,
      filterStatus:'全部',
      filterStatus2:'全部',
//    分页数据
      page: {
        size: 10,
        total: 0,
        currentPage: 1,
        show:false,       
        tfootbtns:{
        	btns:false,//是否添加按钮组
        	leading_out:false,//导出按钮
        	refresh:false,//刷新按钮
        	delete:false, //删除按钮            	
        }
      },
//    弹窗数据
      alerts: [{
        title: '温馨提示：样品处理支持多选，样品转移需记录每个样品转移后位置仅支持单选!   输入备注信息按回车键可筛选相关样品信息！',
        type: 'info'
      }],
//    表格数据
      listHeader:{
      	subtitle:true,   
      	title:'样品1室',
      	createlib:false,
      	createSampling:false,
      	date:false,
      	scanCode:false,
      	remark:true,
//    	status:true,
      	statusitems:[
      		{label:'全部',text:'全部'},
      		{label:'1室',text:'1室'},
      		{label:'2室',text:'2室'},
      		{label:'3室',text:'3室'},
      	],
//    	status2:true,
      	statusitems2:[
      		{label:'全部',text:'全部'},
      		{label:'空闲',text:'空闲'},
      		{label:'未满',text:'未满'},
      		{label:'已满',text:'已满'},
      	],
      	statusTitle:'选择样品室:',
      	statusTitle2:'选择状态:',
      },
      tabledatas:[],
      items: [
      {
        id: 1,
        prop:'sampleNum',
        label: "检验编号",
        status:true,
        sort:true
      },
      {
        id: 3,
        prop:'storage',
        label: "存放位置",
//      status:true,
        sort:true,
        smethod:(a,b)=>{
//      	console.log(a.placeId)
        	return a.placeId-b.placeId
        },
      },
      {
        id: 2,
        prop:'quality',
        label: "性质",
//      status:true,
//      sort:true
      },
      {
        id: 4,
        prop:'autograph',
        label: "样品签收",
//      status:true,
//      sort:true
      },
      {
        id: 5,
        prop:'storageTime',
        label: "储存时间",
//      status:true,
//      sort:true
      },
	  {
        id: 6,
        prop:'remark',
        label: "备注",
//      status:true,
//      sort:true
      },
      ],
      actions:{
      	selection:true,
      	number:true,
      	view:false,
//    	edit:true,
//    	show:true,
//		noview:true,
      	dele:false,
      	manuscript:false,
      	safetyReport:false,
//    	printSampleIn:true,
		sort:'storage',
      },
       tfbtns:{
      	btnCenter:{
			btnTextL:'转移',
			btnTextR:'处理',
//			ldisabled:true,
//			rdisabled:true,
//			doubleColor:true,
		},
//		btnLeft:{
//			btnText:'导出Excel表格',
//		},
//		btnRight:{
//			btnText:'导出Excel表格',
//		},
//		btnOne:{
//			btnText:'导出Excel表格',
//		},     	
      },
      modalVisible:false,
	  modal:{
	  	
	  },
		modal1:{
		  	title:'转移',
			formdatas:[
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
		  	],
		  	submitText:'确定',
		},
		modal2:{
		  	title:'处理',
	
			formdatas:[
		  		{
		  			label:"处理理由:",
		  			type:'textarea',
		  			rows:3,
		  			model:"disposeReason",
					value:'',
		  		},
		  		{
		  			label:"处理人签名:",
		  			type:'input',
		  			model:"dispose",
					value:'',			  			
		  		},
		  	],
		  	submitText:'确定',
		},
    }
  }
}
</script>

