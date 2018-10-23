<template>
    <div class='listpagewrap'>
      <!--面包屑-->
      <sinograin-breadcrumb :breadcrumb="breadcrumb" v-on:searchingfor="searchingfor"></sinograin-breadcrumb>
      <!--alert-->
      <!--<sinograin-prompt :alerts="alerts"></sinograin-prompt>-->
      <!--表格上的时间选框以及 创建-->
      <list-header :listHeader="listHeader" v-on:dateChange="dateChange" v-on:statusChange="statusChange" @statusChange2="statusChange2" v-on:createSampling="createSampling" v-on:createlib="createlib" v-on:scanCode="scanCode" ></list-header>
      <!--表格-->
      <sinograin-list class="list le" :tabledata="tabledatasFilter"  :items="items" :actions="actions" v-on:getchecked="getchecked" :loading="loading" v-on:emptyCreate="emptyCreate" > 
      </sinograin-list>
      <!--分页-->
      <sinograin-pagination :page="page" v-on:paginationEvent="paginationEvent" v-on:getCurrentPage="getCurrentPage"></sinograin-pagination>
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
import "@/assets/style/common/list.css"
import { mapState,mapMutations,mapGetters,mapActions} from 'vuex';

export default {
  components: {
    SinograinList,SinograinPrompt,SinograinPagination,SinograinBreadcrumb,ListHeader
  },
  computed:{
	...mapState(["modal_id_number","viewdata","editdata","aultdata","messions","mask"]),
	...mapGetters(["userName"]),
	tabledatasFilter(){
			return this.tabledatas;
//		if(this.filterStatus=="全部"&&this.filterStatus2=="全部"){
//			return this.tabledatas;
//		}else if(this.filterStatus!=="全部"&&this.filterStatus2=="全部"){
//				return this.tabledatas.filter((value,index)=>{
//					return value.depot==this.filterStatus
//				})
//		}else if(this.filterStatus=="全部"&&this.filterStatus2!=="全部"){
//			if(this.filterStatus2=="空闲"){
//				return this.tabledatas.filter((value,index)=>{
//					return ((value.warehouseUseNumber)/(value.warehouseTotal)>=0)&&((value.warehouseUseNumber)/(value.warehouseTotal)<0.4)
//				})
//			}else if(this.filterStatus2=="未满"){
//				return this.tabledatas.filter((value,index)=>{
//					return ((value.warehouseUseNumber)/(value.warehouseTotal)>=0.4)&&((value.warehouseUseNumber)/(value.warehouseTotal)<1)
//				})
//			}else if(this.filterStatus2=="已满"){
//				return this.tabledatas.filter((value,index)=>{
//					return ((value.warehouseUseNumber)/(value.warehouseTotal)==1)
//				})
//			}
//		}else if(this.filterStatus!=="全部"&&this.filterStatus2!=="全部"){
//			if(this.filterStatus2=="空闲"){
//				return this.tabledatas.filter((value,index)=>{
//					return value.depot==this.filterStatus&&((value.warehouseUseNumber)/(value.warehouseTotal)>=0)&&((value.warehouseUseNumber)/(value.warehouseTotal)<0.4)
//				})
//			}else if(this.filterStatus2=="未满"){
//				return this.tabledatas.filter((value,index)=>{
//					return value.depot==this.filterStatus&&((value.warehouseUseNumber)/(value.warehouseTotal)>=0.4)&&((value.warehouseUseNumber)/(value.warehouseTotal)<1)
//				})
//			}else if(this.filterStatus2=="已满"){
//				return this.tabledatas.filter((value,index)=>{
//					return value.depot==this.filterStatus&&((value.warehouseUseNumber)/(value.warehouseTotal)==1)
//				})
//			}
//		}
	}
  },
  created(){
//	console.log(this.$route.query)
//  获取列表数据（第一页）
	this.getlistdata(1)
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
  	this.$root.eventHub.$on("viewlistitem",function(id,row){  
  		if(!this.$_ault_alert('warehouse:list')){
			return
		}
//		console.log(id)
		this.$router.push({path: '/index/sampleManagement/warehouseManagement/sampleRoom',query:{counterId:row.counterId,title:row.depot+row.counter}})
		
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

		if(data=='全部'){
			this.filterStatus='';		
		}else{
			this.filterStatus=data			
		}
		this.getlistdata(1);
//	  	this.page.currentPage=1;
	},
	statusChange2(data){
//		console.log(data)
//		this.filterStatus2=data
		if(data=='全部'){
			this.filterStatus2='';		
		}else{
			this.filterStatus2=data			
		}
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
  		this.searchText=searching;
  		this.getlistdata(page)
  	},
//	获取列表数据方法
  	getlistdata(page){
		var params = {};
		params.depot=this.filterStatus,
		params.warehouseState=this.filterStatus2,
		params.counter = this.searchText;
		// params.ruKuSampleState = 2
		// params.fenxiaoyangSampleState = 3
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
  	getchecked(checkedId){
  		this.checkedId=checkedId;
  	},
	titleEvent(){
  		console.log('titleEvent');
  	},
  	getDateNow(){
  		var date1=new Date()
  		return date1.getFullYear()+'-'+(date1.getMonth()+1)+'-'+date1.getDate()
  	},
  },
  data() {
    return {
      datalistURL: this.apiRoot + '/grain/warehouse/data',
	  editURL: this.apiRoot + '/grain/sample/edit',
	  searchURL:this.apiRoot + '/grain/sample/data',
      deleteURL:'/liquid/role2/data/delete',
      searchText:'',
      checkedId:[],
	  dataBySampleNo: {},
      breadcrumb:{
      	search:true,   
      	searching:'',
      },
      subtitle:{
      	btn:false,
      	btntext:'',
      },
      loading:true,
      filterStatus:'',
      filterStatus2:'',
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
        title: '温馨提示：入库前请准备好条码打印机，以便于更换检验编号!',
        type: 'info'
      }],
//    表格数据
      listHeader:{
      	createlib:false,
      	createSampling:false,
      	date:false,
      	scanCode:false,
      	status:true,
      	class:'min',
      	statusitems:[
      		{label:'全部',text:'全部'},
      		{label:'样品一室',text:'1室'},
      		{label:'样品二室',text:'2室'},
      		{label:'样品三室',text:'3室'},
      	],
      	status2:true,
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
        prop:'depot',
        label: "样品室",
//      status:true,
//      sort:true
      },
      {
        id: 2,
        prop:'counter',
        label: "柜号",
//      sort:true
      },
      {
        id: 3,
        prop:'describe',
        label: "概述",
//      sort:true
      },
      {
        id: 4,
        prop:'warehouseState',
        label:"状态",
        status:true,
//      sort:true,
      },
      ],
      actions:{
      	selection:false,
      	number:false,
      	view:true,
//    	edit:true,
//    	show:true,
      	dele:false,
      	manuscript:false,
      	safetyReport:false,
//    	printSampleIn:true,
      },
    }
  }
}
</script>

