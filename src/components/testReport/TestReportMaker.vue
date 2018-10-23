<template>
	<div class='listpagewrap'>
      <!--面包屑-->
      <sinograin-breadcrumb :breadcrumb="breadcrumb" v-on:searchingfor="searchingfor"></sinograin-breadcrumb>
  	  <!--标题-->
  	  <sinograin-option-title :title="subtitle" v-on:titleEvent="titleEvent"></sinograin-option-title>		
      <!--表单-->
      <test-report-maker :tabledata="tabledatas" :items="items" :actions="actions" :loading="loading" :formdatas="formdatas" @create='create' @addRow='addRow' @remove='remove'></test-report-maker> 

    </div>
</template>

<style>
</style>

<script>

import SinograinBreadcrumb from '@/components/common/action/Breadcrumb.vue';
import SinograinOptionTitle from "@/components/common/action/OptionTitle";
import TestReportMaker  from "@/components/common/action/TestReportMaker";

import "@/assets/style/testReport/TestReportMaker.css"
import "@/assets/style/common/list.css"
import { mapState,mapMutations,mapGetters,mapActions} from 'vuex';
//本地测试要用下面import代码
//import data from '@/util/mock';

export default {
  components: {
    SinograinBreadcrumb,SinograinOptionTitle,TestReportMaker
  },
  computed:{

  },
  created(){
//	this.getlistdata(1);
//	console.log(this.$route.params)
	if(this.$route.params.formdatas){
		this.formdatas=this.$route.params.formdatas;
		this.tabledatas=this.$route.params.tabledatas;
	}
  },
  destroy(){

  },
  methods: {
//	获取列表数据方法
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
//	获取搜索数据
  	searchingfor(searching){
  		console.log(searching);
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
		var name=this.$route.name+'/选取样品';
		var params={formdatas:this.formdatas,tabledatas:this.tabledatas}
		if(this.$route.params.searching){
			params.searching=this.$route.params.searching
		}
		this.$router.push({name:name,params})
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
  },
  data() {
    return {
      datalistURL:'/liquid/role19/data',
      searchURL:'/liquid/role2/data/search',
      deleteURL:'/liquid/role2/data/delete',
      checkedId:[],
	  createlibVisible:false,
      searchText:'',
      loading:false,
      breadcrumb:{
      	search:false,   
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
      tabledatas:[],
      items: [
	      {
	        id: 1,
	        prop:'pLibraryName',
	        label: "被查直属库",
	//      sort:true
	      },
	      {
	        id: 2,
	        prop:'libraryName',
	        label: "被查库点",
	        // status:true,
	//      sort:true,
	      },
	      {
	        id: 3,
//	        prop:'sampleNo',
	        prop:'sampleNum',
	        label: "检验编号",
	        status:true,
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
