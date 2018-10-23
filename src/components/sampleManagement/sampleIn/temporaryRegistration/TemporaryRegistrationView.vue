<template>
    <div class='listpagewrap'>
      <!--面包屑-->
      <sinograin-breadcrumb :breadcrumb="breadcrumb" v-on:searchingfor="searchingfor"></sinograin-breadcrumb>
      <!--alert-->
      <!--<sinograin-prompt :alerts="alerts"></sinograin-prompt>-->
      <!--标题-->
      <sinograin-option-title :title="subtitle" v-on:titleEvent="titleEvent"></sinograin-option-title>		
      <!--表格上的时间选框以及 创建-->
      <list-header :listHeader="listHeader" v-on:dateChange="dateChange" v-on:statusChange="statusChange" v-on:createSampling="createSampling" v-on:createlib="createlib" ></list-header>
      <!--表格-->
      <sinograin-table-list class="tablelist" :librarylist="librarylist" :tabledata="tabledatas" :list="list" :items="items" :actions="actions" v-on:getchecked="getchecked" :loading="loading" v-on:emptyCreate="emptyCreate"> 
      </sinograin-table-list>
      <!--分页-->
      <!--<sinograin-pagination style="border:none;" :page="page" v-on:paginationEvent="paginationEvent" v-on:getCurrentPage="getCurrentPage"></sinograin-pagination>-->
      <!--弹框-->
      <!--<sinograin-modal v-if="modalVisible" :modal="modal" v-on:createlibitem="createlibitem" v-on:dialogClose="dialogClose"></sinograin-modal>-->      	
      <!--底部按钮们-->
      <tfoot-buttons :tfbtns="tfbtns" @tfootEvent="tfootEvent" ></tfoot-buttons>
    </div>
</template>

<style>
	
</style>

<script>
import SinograinTableList from '@/components/common/action/TableList.vue';
import SinograinPrompt from '@/components/common/prompt/Prompt.vue';
import SinograinBreadcrumb from '@/components/common/action/Breadcrumb.vue';
import SinograinPagination from '@/components/common/action/Pagination.vue';
import SinograinOptionTitle from "@/components/common/action/OptionTitle"
import ListHeader from '@/components/common/action/ListHeader.vue';
import TfootButtons from '@/components/common/action/TfootButtons.vue';
import SinograinModal from '@/components/common/action/Modal.vue';
import "@/assets/style/common/Tablelist.css"
import { mapState,mapMutations,mapGetters,mapActions} from 'vuex';
//本地测试要用下面import代码
//import data from '@/util/mock';



export default {
  components: {
    SinograinTableList,SinograinPrompt,SinograinPagination,SinograinBreadcrumb,SinograinModal,ListHeader,SinograinOptionTitle,TfootButtons
  },
  computed:{
	...mapState(["modal_id_number","viewdata","editdata","aultdata","messions","mask"]),
	...mapGetters(["modal_id","Token"]),
	tabledatasFilter(){

		if(this.filterStatus=="全部"){
			return this.tabledatas;
		}else{
			return this.tabledatas.filter((value,index)=>{
				return value.status==this.filterStatus
			})
		}
	}
  },
  created(){
//	this.getlibrarylist()
//	console.log(this.$route.query)
//	if(this.$route.query.state==3){
//		this.tfbtns={
//	      	btnCenter:{
//				btnTextL:'申请扦样',
//				btnTextR:'保存',
//			},
//			btnRight:{
//				btnText:'导出Excel表格',
//			},   	
//	    }
//	}
//  获取列表数据（第一页）
	this.getlistdata(1)
//	移除监听事件
    this.$root.eventHub.$off('delelistitem')
    this.$root.eventHub.$off("viewlistitem")
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
//		console.log(id)
		this.$router.push({path: '/index/sampling/libraryList/samplingList/sampleShowList/samplingListEdit',query:{libid:id}})
		
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
	createSampling(){
//		console.log('createSampling');
		this.$router.push({path: '/index/sampling/libraryList/samplingList/samplingListCreate'})
	},
	emptyCreate(){
//		this.createSampling();
	},
//	打开新建弹框
	createlib(){
		this.modalVisible=true;
	},
//	填入新建数据
	createlibitem(unit,lib){
		console.log(unit,lib);
	},
//	关闭新建弹框
	dialogClose(){
		this.modalVisible=false;
	},
	//导出Excel表格
	exportExcel(pId){
		if(!this.$_ault_alert('register:export')){
			return
		}
		var loadiframe=document.getElementById('fordownload');
		loadiframe.src=this.exportExcelURL+'?pId='+pId+'&sessionid='+this.Token;
//		window.open(this.exportExcelURL+'?pId='+pId+'&sessionid='+this.Token,"_blank");
		
//		console.log(pId)
//		// 获取列表数据（第？页）
//		this.$http({
//		    method: 'post',
//			url: this.exportExcelURL,
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
//			    pId: pId,
//			}
//	    }).then(function (response) {
////		  	if(response.data.success) {
//				  window.open(this.exportExcelURL+'?pId='+pId,"_blank");
////				  alert("导出Excel成功")
//
////			  } else {
////				  alert("导出Excel失败")
////			  }
//		}.bind(this)).catch(function (error) {
//		    console.log(error);
//		}.bind(this));
	},
//	获取搜索数据
  	searchingfor(searching){
  		console.log(searching);
  		// 获取列表数据（第？页）
		this.$http({
		    method: 'post',
			url: this.searchURL,
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data: {
			    listName: this.list,
			    page:1,
			    pageSize:this.page.size,
			    name_like:searching,
			}
	    }).then(function (response) {
		  	this.tabledatas=response.data.rows;
	  		this.loading=false;
		}.bind(this)).catch(function (error) {
		    console.log(error);
		}.bind(this));
  	},
//	获取列表数据方法
  	getlistdata(page){
  		this.loading=true;
  		var params={};
  		params.pId=this.$route.query.pId
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
//			    page:page,
//			    rows:this.page.size,
				params:JSON.stringify(params),
			}
	    }).then(function (response) {
		  	this.tabledatas=response.data.rows;
	  		this.page.total=response.data.total;
		  	this.loading=false;
			this.listHeader.tableName=response.data.rows[0].formName;
		}.bind(this)).catch(function (error) {
		    console.log(error);
		}.bind(this));
  	},
	//申请扦样
	applySample(state) {
		this.$http({
			method: 'post',
			url: this.applyURL,
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
				id:JSON.stringify(this.$route.query.pId),
				state: state,
				libraryId: this.$route.query.libraryId
			}
		})
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
//		console.log(currentPage)
		this.getlistdata(currentPage)
	},
//	映射分页左下角触发的事件
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
//	表单底部触发事件btnCenterNo btnCenterYes btnLeft btnRight btnOne
	tfootEvent(date){
		console.log(date);
		if(date=='btnCenterL'){
			this.applySample(-1)
			this.$router.push({path: '/index/grainDepot/sampleRegListlc'})
		}else if(date=='btnCenterR'){
			this.applySample(-3)
			this.$router.push({path: '/index/grainDepot/sampleRegListlc'})
		}else if(date=='btnLeft'){

		}else if(date=='btnRight'){
			this.exportExcel(this.$route.query.pId)
		}else if(date=='btnOne'){

		}
	},
	//	获取库列表
  	getlibrarylist(){
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
				
			}
	    }).then(function (response) {
		  	this.librarylist = response.data.rows;
//			  console.log(this.librarylist)
		}.bind(this)).catch(function (error) {
		    console.log(error);
		}.bind(this));
  	},
  },
  data() {
    return {
	  librarylistURL: this.apiRoot + '/grain/library/data',//获取库列表
      datalistURL: this.apiRoot + '/grain/sample/data',
	  applyURL: this.apiRoot + '/grain/register/edit',
	  exportExcelURL: this.apiRoot + '/grain/register/exportExcel',
      searchURL:'/liquid/role2/data/search',
      deleteURL:'/liquid/role2/data/delete',
      checkedId:[],
      librarylist:[],
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
      	search:false,   
      	searching:'',
      },
      subtitle:{

      	btn:false,
//    	btntext:'打印样品检验单',
      },
      loading:true,
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
//    alerts: [{
//      title: '温馨提示：此页面只展示本库信息!',
//      type: 'info'
//    }],
//    表格数据
      listHeader:{
      	createlib:false,
      	createSampling:false,
      	status:false,
      	date:false,
      	tableNameShow:true,
      	tableName:'春季扦样登记表',
      },
      tabledatas:[],
      items: [
//       {
//         id: 1,
//         prop:'sampling_number',
//         label: "扦样编号",
// //      sort:true
//       },
      {
        id: 2,
        prop:'pLibraryName',
        label:"被查直属库",
//      sort:true,
//      width:80,
//      status:true,
      },
      {
        id: 3,
        prop:'libraryName',
        label:"被查库点",
//      width:190,
//      sort:true,
      },
      
      {
        id: 4,
        prop:'position',
        label:"货位号",
//      sort:true,
//      width:80,
      },
      {
        id: 5,
        prop:'sort',
        label:"品种",
//      width:110,
//      sort:true,
//      width:80,
      },
      {
        id: 6,
        prop:'quality',
        label:"性质",
//      width:110,
//      sort:true,
//      width:80,
      },
      {
        id: 7,
        prop:'amount',
        label:"数量（吨）",
//      sort:true,
//      width:80,
      },
      {
        id: 8,
        prop:'originPlace',
        label:"产地",
//      width:70,
//      sort:true,
      },
      {
        id: 9,
        prop:'gainTime',
        label:"收获年度",
//      width:70,
//      sort:true,
      },
      {
        id: 100,
        prop:'barnTimes',
        label:"入库时间",
//      width:150,
//      sort:true,
      },
//       {
//         id: 9,
//         prop:'updateTime',
//         label:"入库时间",
// //      sort:true,
//       },
//    {
//      id: 10,
//      prop:'samplingSign',
//      label:"扦样人员签字",
////      sort:true,
//    },
//    {
//      id: 11,
//      prop:'sampleInSignWidth',
//      label:"现场人员签字",
////      sort:true,
//    },
//       {
//         id: 12,
//         prop:'samplingdate',
//         label:"扦样日期",
// //      sort:true,
//       },
      {
        id: 13,
        prop:'remark',
        label:"备注",
        class:'remark',
//      width:160,
//      sort:true,
      },
      ],
      actions:{
      	selection:false,
      	number:true,
      	view:false,
      	edit:false,
      	dele:false,
      	manuscript:false,
      	safetyReport:false,
      },
      tfbtns:{
      	borderTop:true,
//    	btnCenter:{
//			btnTextL:'申请扦样',
//			btnTextR:'保存',
//		},
//		btnLeft:{
//			btnText:'导出Excel表格',
//		},
		btnRight:{
			btnText:'导出Excel表格',
		},
//		btnOne:{
//			btnText:'导出Excel表格',
//		},     	
      },
    }
  }
}
</script>