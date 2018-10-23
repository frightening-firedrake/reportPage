<template>
    <div class='listpagewrap'>
      <!--额外用来监听路由的小东西-->
      <div style="display: none;">{{resetpage}}</div>   	
      <!--面包屑-->
      <sinograin-breadcrumb :breadcrumb="breadcrumb" v-on:searchingfor="searchingfor"></sinograin-breadcrumb>
      <!--alert-->
      <!--<sinograin-prompt :alerts="alerts"></sinograin-prompt>-->
      <!--标题-->
      <sinograin-option-title :title="subtitle" v-on:titleEvent="titleEvent" @readdata="readdata"></sinograin-option-title>		
      <!--表格上的时间选框以及 创建-->
      <list-header :listHeader="listHeader"  v-on:dateChange="dateChange" v-on:statusChange="statusChange" v-on:createSampling="createSampling" v-on:createlib="createlib" ></list-header>
      <!--表格-->
      <sinograin-table-list-edit-model class="tablelist editmodel" :librarylist="librarylist" @getLibraryId="getLibraryId" :tabledata="tabledatas" :list="list" :items="items" :actions="actions" v-on:getchecked="getchecked" :loading="loading" v-on:emptyCreate="emptyCreate" @currentRow="currentRowFun"> 
      </sinograin-table-list-edit-model>
      <!--分页-->
      <!--<sinograin-pagination style="border:none;" :page="page" v-on:paginationEvent="paginationEvent" v-on:getCurrentPage="getCurrentPage"></sinograin-pagination>-->
      <!--弹框-->
      <!--<sinograin-modal v-if="modalVisible" :modal="modal" v-on:createlibitem="createlibitem" v-on:dialogClose="dialogClose"></sinograin-modal>-->      	
      <!--底部按钮们-->
      <tfoot-buttons :tfbtns="tfbtns" @tfootEvent="tfootEvent" ></tfoot-buttons>
      <!--<el-button v-permission-click="{auth:'register:edit2',fun:authtest}">测试自定义指令按钮</el-button>-->
    </div>
</template>

<style>
	
</style>

<script>
import SinograinTableListEditModel from '@/components/common/action/TableListEditModel.vue';
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
    SinograinTableListEditModel,SinograinPrompt,SinograinPagination,SinograinBreadcrumb,SinograinModal,ListHeader,SinograinOptionTitle,TfootButtons
  },
  computed:{
	...mapState([]),
	...mapGetters(["userId","libraryName","libraryId","Token"]),
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
		if(this.$route.query.pId){
		}else{
			this.tabledatas=[];
			this.listHeader.tableName='';
		}
	}
  },
  created(){
//	console.log(this.$route.query)
	this.getlibrarylist()
//  获取列表数据（第一页）
	if(this.$route.query.pId){
		 this.getlistdata(1)
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
		  	this.librarylist = response.data;

		}.bind(this)).catch(function (error) {
		    console.log(error);
		}.bind(this));
  	},
//	获取列表数据方法
  	getlistdata(page){
		 var params = {}
		 params.pId = this.$route.query.pId
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
				params: JSON.stringify(params)
			}
	    }).then(function (response) {
		  	response.data.rows.sort((a,b)=>{return a.id-b.id})
		  	this.tabledatas=response.data.rows;
			this.listHeader.tableName=response.data.rows[0].formName
			this.libraryName2=response.data.rows[0].libraryId
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
	    		if(this.$route.query.state==2){
	    			this.tabledatas=this.tabledatas.filter(function(item){
		    			return item.id!==row.id;
		    		})
	    		}else{	    			
	    			this.editDelete(row.id)    		    		
	    		}
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
//	获取分页点击事件中及当前页码
    getCurrentPage(currentPage){
//		console.log(currentPage)
		this.getlistdata(currentPage)
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
//		console.log('titleEvent');
//		if(!this.$_ault_alert('register:export')){
//			return
//		}
		var loadiframe=document.getElementById('fordownload');
		loadiframe.src=this.exportExcelURL+'?sessionid='+this.Token;
  	},
  	readdata(res){
  		if(!res){
  			var msg="模板文件导入失败，请重新下载模板！"
			this.uncomplate(msg)
			return
  		}
//		console.log(res)
  		this.tabledatas=[];
  		res.forEach((value,index)=>{
  			if(value.sort){
  				this.rowid++;
				var newdata={
					pLibraryId:'',
					libraryName: '',//被查库点
					id:0,
			        barnTime:value.barnTime,//入库时间
			        
			        sampleWord:value.sampleWord,//扦样编号文字
			        autograph:value.autograph,//扦样人员
			        sampleTime:value.sampleTime,//扦样时间
			        
			        sort: value.sort,//品种
			        quality: value.quality.toUpperCase(),//性质
			        amount: value.amount,//代表数量
			        position:value.position,
			        originPlace: value.originPlace,//产地
			        gainTime: value.gainTime,//收货年度
			        // updateTime: "",
			        samplingSign: "",
			        sampleInSignWidth: "",
			        // samplingdate: '',//扦样日期
			        remark: value.remark,//备注
			        rowType:"扦样信息",//删除用
			        addId:this.rowid,//本地删除新建行时用到的标识
		        }
				this.tabledatas.push(newdata);
  			}
  		})
  	},
  	uncomplate(msg){
  		 this.$alert(msg,'提示信息',{type: 'warning'});
  	},
// 编辑扦样
	editdata(regState) {
		if(!this.$_ault_alert('sample:saveAll')){
			return
		}
		if(!this.listHeader.tableName) {
			var msg="请先填写表名，再尝试提交！"
			this.uncomplate(msg)
			return
		}
		var sample =[];
		this.tabledatas.forEach((value,index)=>{
			var item={};		
			item.id= value.id;
			item.barnTime= Date.parse(value.barnTime);
			item.sort= value.sort;
			item.quality= value.quality;
			item.amount= value.amount;
			item.originPlace= value.originPlace;
			item.gainTime= value.gainTime;
			item.position= value.position;
			// item.updateTime= value.updateTime;
			// item.sampleTime= value.samplingdate;
			item.remark= value.remark;
			sample.push(item);
			for(var key in item){
				if(item[key] !== 0 && !item[key]){
					this.isEmpty=true;
					break
				}else{
					this.isEmpty=false;
				}
			}
		})
		if(sample.length==0) {
			var msg="请填写表信息，再尝试提交！"
			this.uncomplate(msg)
			return
		}
		if(this.isEmpty){
			var msg="请完善表内空信息，再尝试提交！"
			this.uncomplate(msg)
			return
		}

    	this.tfbtns.loading=true;			
  		// 提交扦样列表
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
				id: this.$route.query.pId,
				formName: this.listHeader.tableName,
				sample: JSON.stringify(sample),
				regState: regState,
				libraryId: this.libraryName2,
				type:-1,	
				tableUserId:this.userId,
			},
	   	}).then(function (response) {		
		  	this.$router.go(-1);
//		  	this.$router.push({path: '/index/grainDepot/sampleRegListlc'})
		}.bind(this)).catch(function (error) {
		    console.log(error);
		}.bind(this));
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
		this.tabledatas.forEach((value,index)=>{
			var item={};		
			item.sort= value.sort;
			item.barnTime= Date.parse(value.barnTime);
			item.quality= value.quality;
			item.amount= value.amount;
			item.originPlace= value.originPlace;
			item.gainTime= value.gainTime;
			item.position= value.position;
			// item.updateTime= value.updateTime;
			// item.sampleTime= value.samplingdate;
			item.remark= value.remark;
			sample.push(item);
			for(var key in item){
				if(!item[key]){
					this.isEmpty=true;
					break
				}else{
					this.isEmpty=false;
				}
			}
		})
		if(sample.length==0) {
			var msg="请填写表信息，再尝试提交！"
			this.uncomplate(msg)
			return
		}
		if(this.isEmpty){
			var msg="请完善表内空信息，再尝试提交！"
			this.uncomplate(msg)
			return
		}
		if(!this.libraryName2){
			var msg="请选择被查库点信息，再尝试提交！"
			this.uncomplate(msg)
			return
		}
//			console.log(sample)
//		console.log(sample[0].barnTime,)
    	this.tfbtns.loading=true;			
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
				libraryId: this.libraryName2,
				type:-1,
				tableUserId:this.userId,
			},
	   	}).then(function (response) {
		  	this.$router.go(-1);
//		  	this.$router.push({path: '/index/grainDepot/sampleRegListlc'})
		}.bind(this)).catch(function (error) {
		    console.log(error);
		}.bind(this));
  	},
  	savedataS(){
		if(!this.$_ault_alert('sample:temporarySaveAll')){
			return
		}
		if(!this.listHeader.tableName) {
			var msg="请先填写表名，再尝试提交！"
			this.uncomplate(msg)
			return
		}
		var sample =[];
		this.tabledatas.forEach((value,index)=>{
			var item={};		
			item.sampleWord=value.sampleWord;//扦样编号文字
	        item.autograph=value.autograph;//扦样人员
	        item.sampleTime=Date.parse(value.sampleTime);//扦样时间
	        item.sort= value.sort;
			item.barnTime= Date.parse(value.barnTime);
			item.quality= value.quality;
			item.amount= value.amount;
			item.originPlace= value.originPlace;
			item.gainTime= value.gainTime;
			item.position= value.position;
			// item.updateTime= value.updateTime;
			// item.sampleTime= value.samplingdate;
			item.remark= value.remark;
			sample.push(item);
			for(var key in item){
				if(!item[key]){
					this.isEmpty=true;
					break
				}else{
					this.isEmpty=false;
				}
			}
		})
		if(sample.length==0) {
			var msg="请填写表信息，再尝试提交！"
			this.uncomplate(msg)
			return
		}
		if(this.isEmpty){
			var msg="请完善表内空信息，再尝试提交！"
			this.uncomplate(msg)
			return
		}
		if(!this.libraryName2){
			var msg="请选择被查库点信息，再尝试提交！"
			this.uncomplate(msg)
			return
		}
//			console.log(sample)
//		console.log(sample[0].barnTime,)
    	this.tfbtns.loading=true;			
		// 提交扦样列表
		this.$http({
		    method: 'post',
			url: this.saveSURL,
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
				regState: 2,
				libraryId: this.libraryName2,
				type:-1,
				tableUserId:this.userId,
			},
	   	}).then(function (response) {
		  	this.$router.go(-1);
//		  	this.$router.push({path: '/index/grainDepot/sampleRegListlc'})
		}.bind(this)).catch(function (error) {
		    console.log(error);
		}.bind(this));
  	},
//	表单底部触发事件btnCenterNo btnCenterYes btnLeft btnRight btnOne
	tfootEvent(date){
		console.log(date);
		if(date=='btnCenterL'){
			if(this.$route.query.state==3){
		 		this.editdata(-1)
			}else {
				this.savedata(-1)	
			}
		}else if(date=='btnCenterS'){
				this.savedataS()	
		}else if(date=='btnCenterR'){
			if(this.$route.query.state==3){
				this.editdata(3)
			}else {
				this.savedata(3)	
			}
		}else if(date=='btnLeft'){

		}else if(date=='btnRight'){

		}else if(date=='btnOne'){		
			this.savedata()	
			
		}else if(date=='tableAdd'){
//			权限判断旧方法啊
//			if (!this.$_has('register:edit')) {
//				this.$notify.error({
//		          	title: '错误',
//		          	message: '你没有权限进行此项操作！！！'
//		        });
//				return
//	    	}
			
			this.rowid++;
			var newdata={
//				pLibraryId:'3',
				id:0,
				pLibraryId:'',
				libraryName: '',//被查库点
		        libraryId: '',//被查库点
		        barnTime:'',//入库时间
		        sort: '',//品种
		        quality: 'ZC',//性质
		        amount: '',//代表数量
		        position:'',
		        originPlace: '',//产地
		        gainTime: '',//收货年度
		        // updateTime: "",
		        samplingSign: "",
		        sampleInSignWidth: "",
		        // samplingdate: '',//扦样日期
		        remark: '',//备注
		        rowType:"扦样信息",//删除用
		        addId:this.rowid,//本地删除新建行时用到的标识
	        }
			this.tabledatas.push(newdata);
		}else if(date=="tableDel"){
			if(this.currentRow){
				this.deleteRow(this.currentRow)
//				console.log(this.currentRow)
			}
		}
	},
	currentRowFun(currentRow){
		console.log(currentRow)
		this.currentRow=currentRow;
	},
	getLibraryId(id){
		this.libraryName2=id
	},
	authtest(){
		alert("权限测试通过！！！")
	},
  },
  data() {
    return {
      isEmpty:false,
      rowid:999,//临时id
      
      exportExcelURL: this.apiRoot + '/grain/download/downloadTemplateRegister',//下载模板
      deleteURL: this.apiRoot + '/grain/sample/remove',//草稿删除
      datalistURL: this.apiRoot + '/grain/sample/data',//获取草稿地址
	  librarylistURL: this.apiRoot + '/grain/library/getAll',//获取库列表
      saveURL: this.apiRoot + '/grain/sample/saveAll',//申请扦样地址草稿保存地址
      saveSURL: this.apiRoot + '/grain/sample/temporarySaveAll',//直接扦样地址
      sampleURL: this.apiRoot + '/grain/register/edit',//干嘛用的我忘了
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

      	btn:true,
      	btntext:'下载模板',
      	importbtn:'导入模板数据',
      	importURL:this.apiRoot + '/grain/import/importExcelRegister',
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
        prop:'libraryPid',
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
        id: 100,
        prop:'barnTime',
        label:"入库时间",
        width:150,
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
			btnTextL:'申请扦样',
			btnTextR:'保存',
			btnTextS:'直接扦样',
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
      },
      currentRow:null,
    }
  }
}
</script>