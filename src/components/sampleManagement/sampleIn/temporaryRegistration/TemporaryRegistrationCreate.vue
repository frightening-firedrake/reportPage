<template>
    <div class='listpagewrap'>
      <!--额外用来监听路由的小东西-->
      <div style="display: none;">{{resetpage}}</div>   	
      <!--面包屑-->
      <sinograin-breadcrumb :breadcrumb="breadcrumb" v-on:searchingfor="searchingfor"></sinograin-breadcrumb>
      <!--alert-->
      <!--<sinograin-prompt :alerts="alerts"></sinograin-prompt>-->
      <!--标题-->
      <sinograin-option-title :title="subtitle" v-on:titleEvent="titleEvent"></sinograin-option-title>		
      <!--表格上的时间选框以及 创建-->
      <list-header :listHeader="listHeader"  v-on:dateChange="dateChange" v-on:statusChange="statusChange" v-on:createSampling="createSampling" ></list-header>
      <!--表格-->
      <sinograin-table-list class="tablelist temporary" @currentRow="currentRowFun" :librarylist="librarylist" :tabledata="tabledatas" :list="list" :items="items" :actions="actions" v-on:getchecked="getchecked" :loading="loading" v-on:emptyCreate="emptyCreate"> 
      </sinograin-table-list>
      <!--分页-->
      <!--<sinograin-pagination style="border:none;" :page="page" v-on:paginationEvent="paginationEvent" v-on:getCurrentPage="getCurrentPage"></sinograin-pagination>-->
      <!--底部按钮们-->
      <tfoot-buttons :tfbtns="tfbtns" @tfootEvent="tfootEvent" ></tfoot-buttons>
      <!--<el-button v-permission-click="{auth:'register:edit2',fun:authtest}">测试自定义指令按钮</el-button>-->
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
// import data from '@/util/mock';




export default {
  components: {
    SinograinTableList,SinograinPrompt,SinograinPagination,SinograinBreadcrumb,SinograinModal,ListHeader,SinograinOptionTitle,TfootButtons
  },
  computed:{
	...mapState([]),
	...mapGetters(["modal_id","libraryName","libraryId"]),
	tabledatasFilter(){

		if(this.filterStatus=="全部"){
			return this.tabledatas;
		}else{
			return this.tabledatas.filter((value,index)=>{
				return value.status==this.filterStatus
			})
		}
	},
	resetpage(){
//		if(this.$route.query.state==3){
//		}else{
//			this.tabledatas=[];
//			this.listHeader.tableName='';
//		}
	}
  },
  created(){
//	console.log(this.$route.params)
	if(this.$route.params.tabledatas){
//		console.log('有数据了')
		
		this.listHeader.tableName=this.$route.params.tableName;
		this.tabledatas=this.$route.params.tabledatas;
	}
//	移除监听事件
    this.$root.eventHub.$off('delelistitem')
    this.$root.eventHub.$off("viewlistitem")
//	监听列表删除事件
    this.$root.eventHub.$on('delelistitem',function(rowid,list){
    	this.tabledatas=this.tabledatas.filter(function(item){
    		return item.id!==rowid;
    	})
//  	this.sendDeleteId(rowid);
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
  	...mapMutations(['create_modal_id','is_mask','create_modal','close_modal',]),
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
		  	this.items=response.data.rows;
	  		setTimeout(()=>{			  		
		  		this.loading=false;
		  	},1000)
		}.bind(this)).catch(function (error) {
		    console.log(error);
		}.bind(this));
  	},


//	删除行
	deleteRow(row) {
	    this.$confirm('此操作将永久删除该'+"扦样信息"+', 是否继续?', '提示', {
	      confirmButtonText: '确定',
	      cancelButtonText: '取消',
	      type: 'warning'
	    }).then(() => {
	    	if(row.id){
//	    		this.editDelete(row.id)    
	    		this.tabledatas=this.tabledatas.filter(function(item){
	    			return item.id!==row.id;
	    		})
	    	}else{
	    		this.tabledatas=this.tabledatas.filter(function(item){
	    			return item.addId!==row.addId;
	    		})	
	    	}
//	    	this.sendDeleteId(row.id);
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
	},
//	向后台发送删除行id
	editDelete(id){
		this.$http({
		    method: 'post',
			url: this.deleteURL,
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
				id:id
			},
	    }).then(function (response) {
	    	if(response.data.success){
				this.tabledatas=this.tabledatas.filter(function(item){
	    			return item.id!==id;
	    		})		    		
	    	}else{
	    		
	    	}
		}.bind(this)).catch(function (error) {
		    console.log(error);
		}.bind(this));
	},

//	获取多选框选中数据的id(这是一个数组)
  	getchecked(checkedId){
  		this.checkedId=checkedId;
  	},
	titleEvent(){
  		console.log('titleEvent');
  	},
  	uncomplate(msg){
  		 this.$alert(msg,'提示信息',{});
  	},

	savedata(regState){
		if(!this.$_ault_alert('sample:saveAll')){
			return
		}
		if(!this.listHeader.tableName) {
			var msg="请先填写表名，再尝试提交！"
			this.uncomplate(msg)
			return
		}
		var sample =[];

		sample =this.tabledatas;
//		this.tabledatas.forEach((value,index)=>{
//			
//		})
		if(sample.length==0) {
			var msg="请填添加样品，再尝试提交！"
			this.uncomplate(msg)
			return
		}
		var libraryId=this.tabledatas[0].libraryId;
		
//		if(this.isEmpty){
//			var msg="请完善表内空信息，再尝试提交！"
//			this.uncomplate(msg)
//			return
//		}
    	this.tfbtns.loading=true;		
    	console.log(this.tfbtns.loading)
//		console.log(sample[0].barnTime,)
		// 提交扦样列表
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
			data: {
				formName: this.listHeader.tableName,
				sample: JSON.stringify(sample),
				regState: regState,
				libraryId: libraryId,
				type:1,
			},
	    }).then(function (response) {
	    	if(response.data.success){
	    		this.$notify({
		          	title: '操作成功',
		          	message: '送样检验登记表新建成功！！！',
		          	type: 'success'
		        });
		       	this.$router.push({path: '/index/sampleManagement/temporaryRegistration'})
	    	}else{
	    		this.$notify.error({
		          	title: '储存失败',
		          	message: '送样检验登记表新建失败！！！',
		        });
	    	}
		}.bind(this)).catch(function (error) {
		    console.log(error);
		}.bind(this));
  	},
//	表单底部触发事件btnCenterNo btnCenterYes btnLeft btnRight btnOne
	tfootEvent(date){
		console.log(date);
		if(date=='btnCenterL'){
			this.savedata(2)	
		}else if(date=='btnCenterR'){
			this.$router.go(-1)
		}else if(date=='btnLeft'){

		}else if(date=='btnRight'){

		}else if(date=='btnOne'){		

		}else if(date=='tableAdd'){
			this.new_sample()
		}else if(date=="tableDel"){
			if(this.currentRow){
				this.deleteRow(this.currentRow)
//				console.log(this.currentRow)
			}
		}
	},
	currentRowFun(currentRow){
		this.currentRow=currentRow;
	},
	getLibraryId(id){
		this.libraryName2=id
	},
	authtest(){
		alert("权限测试通过！！！")
	},
	new_sample(){
		var name=this.$route.name+'/添加送样样品信息';
		var params={tableName:this.listHeader.tableName,tabledatas:this.tabledatas}
		if(this.$route.params.library){
			params.library=this.$route.params.library
		}
		this.$router.push({name:name,params})
    },
  },
  data() {
    return {
      isEmpty:false,
      rowid:999,//临时id
      deleteURL: this.apiRoot + '/grain/sample/remove',//草稿删除
      datalistURL: this.apiRoot + '/grain/sample/data',//获取草稿地址
	  librarylistURL: this.apiRoot + '/grain/library/getAll',//获取库列表
      saveURL: this.apiRoot + '/grain/sample/saveAll',//草稿保存地址
      sampleURL: this.apiRoot + '/grain/register/edit',//申请扦样地址
	  editURL: this.apiRoot + '/grain/sample/saveOrEditAll',
      searchURL:'/liquid/role2/data/search',
      libraryName2:'',
      checkedId:[],
      list:"samplinglist",
	  modalVisible:false,
//	  librarylist: [{libraryName:'本库',id:'1'},{libraryName:'太原',id:'2'}],
	  librarylist: [],
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
      loading:false,
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
      	tableName:'',
      	tableNameTitle:'送样检验登记表名称：',
      	editModel:true,
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
      },
      {
        id: 3,
        prop:'libraryName',
        label:"被查库点",
        width:140,
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
        id: 10,
        prop:'barnTime',
        label:"入库时间",
        width:150,
//      sort:true,
      },
      {
        id: 13,
        prop:'remark',
        label:"备注",
        class:'remark',
        width:160,
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
      	loading:false,
      	btnCenter:{
			btnTextL:'保存',
			btnTextR:'取消',
		},
//		btnLeft:{
//			btnText:'导出Excel表格',
//		},
//		btnRight:{
//			btnText:'导出Excel表格',
//		},
//		btnOne:{
//			btnText:'生成扦样登记表',
//		},     	
		editModel:true,
		addbtnText:'添加送样样品信息',
      },
      currentRow:null,
    }
  }
}
</script>