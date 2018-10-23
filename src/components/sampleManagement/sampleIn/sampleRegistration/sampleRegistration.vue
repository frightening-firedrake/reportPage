<template>
	<div class='listpagewrap'>
      <!--面包屑-->
      <sinograin-breadcrumb :breadcrumb="breadcrumb" v-on:searchingfor="searchingfor"></sinograin-breadcrumb>
  	  <!--标题-->
  	  <sinograin-option-title class="nomargin" :title="subtitle" v-on:titleEvent="titleEvent"></sinograin-option-title>		
      
      <list-header class="noborder" :listHeader="listHeader" v-on:dateChange="dateChange" v-on:statusChange="statusChange" @statusChange2="statusChange2" ></list-header>
      	
      <!--表单-->
      <sample-registert-maker class="registertMaker" :total="sampleInTotal" :tabledata="tabledatas" :items="items" :actions="actions" :loading="loading" :formdatas="formdatas" @exportExcel='exportExcel' @addRow='addRow' @delRow='delRow' @currentRow='currentRowFun'></sample-registert-maker> 
      <sinograin-pagination class="noborder" :page="page" v-on:paginationEvent="paginationEvent" v-on:getCurrentPage="getCurrentPage"></sinograin-pagination>
	  
    </div>
</template>

<style>
	.registertMaker .tbwrap{
		border-bottom:1px solid #ccc;
	}
	.noborder{
		border:none!important;
	}
	.nomargin{
		margin:0!important;
	}
	/*.registertMaker .storage{
		width:16em!important;
	}*/
</style>
<script>

import SinograinBreadcrumb from '@/components/common/action/Breadcrumb.vue';
import SinograinOptionTitle from "@/components/common/action/OptionTitle";
import SampleRegistertMaker  from "@/components/common/action/SampleRegistertMaker";
import ListHeader from '@/components/common/action/ListHeader.vue';
import SinograinPagination from '@/components/common/action/Pagination.vue';

import "@/assets/style/testReport/TestReportMaker.css"
//import "@/assets/style/common/list.css"
import "@/assets/style/sampleRegistration/registertMaker.css"
import { mapState,mapMutations,mapGetters,mapActions} from 'vuex';
//本地测试要用下面import代码
//import data from '@/util/mock';

export default {
  components: {
    SinograinBreadcrumb,SinograinOptionTitle,SampleRegistertMaker,ListHeader,SinograinPagination
  },
  computed:{
	...mapGetters(["libraryName","Token"]),
  },
  created(){
//	this.getlistdata();
	this.getsampledata(1);
//	console.log(this.$route.params)
//	if(this.$route.params.tabledatas){
//		this.tabledatas=this.$route.params.tabledatas;
//	}
  },
  destroy(){

  },
  methods: {
//	获取数据方法
  	getlistdata(page){
		var params = {};
		params.wpLibraryId = -1
  		this.loading=true;
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
				params:JSON.stringify(params)
			}
	    }).then(function (response) {
		  	this.tabledatas=response.data;
//	  		this.page.total=response.data.total;		  		
		  	this.loading=false;
		}.bind(this)).catch(function (error) {
		    console.log(error);
		}.bind(this));
  	},
  	getsampledata(page){
//		var params={};
//		params.sampleState=2
  		var params={};
//		params.sampleWordOrsampleNumLike='';
//		if(!this.IsChecked){  			
  			params.ruSampleState=2;
  			params.fenSampleState=3;
			params.chuliSampleState=4;
			params.rank = 'sampleNum';
//			params.storageTime=this.storageTimeIn;
			params.storageTimeLike=this.storageTimeIn;
//			params.sampleNoLike=this.searchText;
			params.sampleWordOrsampleNumOrsampleNoLike=this.searchText;
  		this.loading=false;
  		// 获取列表数据（第？页）
		this.$http({
		    method: 'post',
			url: this.sampleURL,
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
				params:JSON.stringify(params),
				page:page,
			    rows:this.page.size,
			}
	    }).then(function (response) {
//			console.log(response)
		  	this.tabledatas=response.data.rows;
//		  	if(this.$route.params.formdatas){
//				this.checkedList=this.$route.params.tabledatas;
//			}
//		  	this.checkedList=response.data.rows;
	  		this.page.currentPage=page;
	  		this.page.total=response.data.total;
	  		if(!this.sampleInTotal){
	  			this.sampleInTotal=response.data.total
	  		}
		}.bind(this)).catch(function (error) {
		    console.log(error);
		}.bind(this));
  	},
//	获取搜索数据
  	searchingfor(searching){
  		this.searchText=searching;
  		this.getsampledata(1);
//		console.log(searching);
  	},
	titleEvent(){
  		console.log('titleEvent');
    },
    remove(index,id,row){
    	this.$confirm('此操作将删除该'+'样品信息'+', 是否继续?', '提示', {
		      confirmButtonText: '确定',
		      cancelButtonText: '取消',
		      type: 'warning'
		    }).then(() => {
				this.removeItem(index,id,row);
		    }).catch(() => {
		      this.$message({
		        type: 'info',
		        message: '已取消删除'
		      });          
		    });
    },
    removeItem(index,id,row){
		this.tabledatas=this.tabledatas.filter((item,index1)=>{
			return index1!==index
		})
        this.$message({
        	type: 'success',
        	message: '删除成功!'
        });
    },
    addRow(){
		var name=this.$route.name+'/检验样品';
		var params={formdatas:this.formdatas,tabledatas:this.tabledatas}
		if(this.$route.params.searching){
			params.searching=this.$route.params.searching
		}
		this.$router.push({name:name,params})
    },
    delRow(){
    	if(!this.currentRow){
    		return
    	}
		this.$confirm('此操作将删除该'+'样品信息'+', 是否继续?', '提示', {
	      	confirmButtonText: '确定',
	      	cancelButtonText: '取消',
	      	type: 'warning'
	    }).then(() => {
			this.tabledatas=this.tabledatas.filter((item,index)=>{
				return item.id!==this.currentRow.id
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
    },
    create(){
    	if(!this.$_ault_alert('sample:dataWheatReport')){
			return
		}
    	if(!this.tabledatas.length){
    		 this.$alert('请先添加样品！！！','提示信息',{});
    		 return;
    	}
    	var ids=[]
    	this.tabledatas.forEach((item)=>{
    		ids.push(item.id)
    	})
    	var sort=this.tabledatas[0].sort
    	ids.sort();
    	ids=ids.join(',');
		var name=this.$route.name+'/样品检测报表详情';
		this.$router.push({name:name,params:{ids:ids,title:this.formdatas.tableName,sort:sort}})
    },
    exportExcel(){
//  	if(!this.tabledatas.length){
    	if(!this.storageTimeIn){
//  		this.$alert('请先添加样品！！！','提示信息',{});
    		this.$alert('请先选择样品储存年度！！！','提示信息',{});
    		return
    	}
//  	var arr=[];
//  	this.tabledatas.forEach((item,index)=>{
//  		arr.push(item.sampleNo)
//  	})
//  	var sampleNos=arr.join(',')
    	if(!this.$_ault_alert('sample:ExportRegister')){
			return
		}
		var loadiframe=document.getElementById('fordownload');
//		console.log(this.exportExcelURL+'?storageTime='+this.storageTimeIn+'&sessionid='+this.Token)
		loadiframe.src=this.exportExcelURL+'?storageTime='+this.storageTimeIn+'&sessionid='+this.Token;
    },
    currentRowFun(currentRow){
		this.currentRow=currentRow;
	},
	//	列表头触发的事件
		dateChange(data) {
//			console.log(data);
			this.storageTimeIn=data
			this.getsampledata(1);
		},
		statusChange(data) {
//			this.filterStatus = data;
//			this.getlistdata(1)
		},
		statusChange2(data) {
//			console.log(data)
		},
		//	获取分页点击事件中及当前页码
    getCurrentPage(currentPage){
//		if(this.searchText){			
//			this.searchingfor(this.searchText,currentPage)
//		}else{			
			this.getsampledata(currentPage)
//		}
	},
//	映射分页触发的事件
  	paginationEvent(actiontype){
  		if(actiontype=='leading_out'){
//			console.log('leading_out')
			this.exportExcel()
  		}else if(actiontype=='refresh'){
  			// 获取列表数据（第一页）
			this.getsampledata(1)			
  		}
  	},
  },
  data() {
    return {
      exportExcelURL: this.apiRoot + '/grain/sample/ExportRegister',
      sampleURL:this.apiRoot + '/grain/sample/data',
      datalistURL:'/liquid/role19/data',
      searchURL:'/liquid/role2/data/search',
      deleteURL:'/liquid/role2/data/delete',
      sampleInTotal:0,
      storageTimeIn:'',
      checkedId:[],
	  createlibVisible:false,
      searchText:'',
      currentRow:'',
      loading:false,
      breadcrumb:{
      	search:true,   
      	searching:'',
      },
      subtitle:{
      	btn:false,
      	btntext:'',
      },
      
      formdatas:{
      	tableName:'',
      	remark:'',
      },
      tabledatas:[
	      
      ],
      listHeader:{
	      	createlib:false,
	      	createSampling:false,
	      	dateonlyyear:true,
	      	dateonlyyearTitle:'样品储存年度：',
	      	scanCode:false,
			connect: false,
	      	status:false,
	      	statusitems:[
	      		{label:'全部',text:'全部'},
	      		{label:'-1',text:'已归还'},
	      		{label:'1',text:'未归还'},
	      	],
	      	status2:false,
	      	statusTitle:'交接单状态:',
	      	statusTitle2:[],
	  },
	  //    分页数据
      page: {
        size: 10,
        total: 0,
        currentPage: 1,
        show:true,       
        tfootbtns:{
        	btns:true,//是否添加按钮组
        	leading_out:true,//导出按钮
        	refresh:false,//刷新按钮
        	delete:false, //删除按钮            	
        }
      },
      items: [
	      {
	        id: 1,
	        label: "检验编号",
	        prop:'sampleNum',
	        status:true,
//	        minWidth:100,
	        pid:0,
	      },
	      {
	        id: 2,
	        label: "扦样编号",
	        prop:'sampleWord',
//	        minWidth:100,
	        pid:0,
	      },
	      {
	        id: 3,
	        label: "检验项目",
	        prop:'checkeds',
	        minWidth:200,
	        status:true,
	        pid:0,
	      },
	      {
	        id: 4,
	        label: "扦样情况",
	        pid:0,
	      },
	      {
	        id: 5,
	        prop:'autograph',
	        label: "扦样人员",
//	        minWidth:80,
//			width:100,
	        pid:4,
	//      sort:true
	      },
	      {
	        id: 6,
	        prop:'sampleTime',
	        label:"扦样时间",
	        status:true,
//	        minWidth:80,
//			width:100,
	        pid:4,
	//      sort:true,
	      },
	      {
	        id: 7,
	        label: "运送、接收样品情况",
	        pid:0,
	//      sort:true,
	      },
	      {
	        id: 8,
	        prop:'null',
	        label:"工作人员",
//	        minWidth:80,
//			width:100,
	        pid:7,
	//      sort:true,
	      },
	      {
	        id: 9,
	        prop:'null',
	        label:"时间",
//			width:100,
//	        minWidth:80,
	        pid:7,
	//      sort:true,
	      },
	      {
	        id: 10,
	        prop:'storage',
	        label:"存放位置",
	        pid:0,
	        minWidth:120,
	        class:'storage',
//	        width:140,
	//      sort:true,
	      },
	      {
	        id: 11,
	        prop:'remark',
	        label:"备注",
	        pid:0,
	        minWidth:90,
	        class:'last',
	//      sort:true,
	      },
      ],
      actions:{
      	selection:false,
      	number:false,
      	view:false,
      	edit:false,
      	dele:true,
      	show:true,
      }
    }
  }
}
</script>
