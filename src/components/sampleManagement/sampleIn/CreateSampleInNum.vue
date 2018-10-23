<template>
    <div class='listpagewrap'>
      <!--面包屑-->
      <sinograin-breadcrumb :breadcrumb="breadcrumb" v-on:searchingfor="searchingfor"></sinograin-breadcrumb>
  	  <!--标题-->
  	  <sinograin-option-title :title="subtitle" v-on:titleEvent="titleEvent"></sinograin-option-title>		
      <!--提示-->
      <!--<sinograin-prompt :alerts="alerts"></sinograin-prompt>-->
      <!--表单-->
      <sample-in-form :formdatas="formdatas" @submit="submit"></sample-in-form> 
      <!--弹框-->
      <sinograin-modal v-if="modalVisible"  :modal="modal" v-on:createlibitem="createlibitem" v-on:dialogClose="dialogClose" @modelSelectChange="modelSelectChange"></sinograin-modal>      	
    </div>
</template>

<style>
	
</style>

<script>

import SinograinPrompt from '@/components/common/prompt/Prompt.vue';
import SinograinBreadcrumb from '@/components/common/action/Breadcrumb.vue';
import SampleInForm  from "@/components/common/action/SampleInForm"
import SinograinOptionTitle from "@/components/common/action/OptionTitle"
import SinograinModal from '@/components/common/action/Modal.vue';

import "@/assets/style/common/list.css"
import { mapState,mapMutations,mapGetters,mapActions} from 'vuex';
//本地测试要用下面import代码
//import data from '@/util/mock';



export default {
  components: {
    SinograinPrompt,SinograinBreadcrumb,SinograinOptionTitle,SampleInForm,SinograinModal
  },
  computed:{
	...mapState(["modal_id_number","viewdata","editdata","aultdata","messions","mask"]),
	...mapGetters(["userName"]),
  },
  created(){
//  获取列表数据（第一页）
//	this.getlistdata()
	this.getdepotlist()
	this.getcounterlist()
	this.getplacelist()
  	this.modal.formdatas[5].value=this.userName;
  },
  destroy(){

  },
  methods: {
  	...mapMutations(['create_modal_id','is_mask','create_modal','close_modal']),
  	...mapActions(['addAction']),
//	获取列表数据方法
  	getlistdata(){
  		this.loading=false;
  		// 获取列表数据（第？页）
		this.$http({
		  method: 'post',
			url: this.getdataURL,
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
          id: this.$route.query.libid,
			}
	    }).then(function (response) {
	    	var res=response.data;
	    	res.sampleNum="监"+res.sampleNum;
		  	this.formdatas.form=res;
//		  	res.pLibraryName='';
//				this.getlibrarydata()
		}.bind(this)).catch(function (error) {
		    console.log(error);
		}.bind(this));
  	},
		//	获取库列表数据方法
  	getlibrarydata(){
  		this.loading=false;
  		// 获取列表数据（第？页）
		this.$http({
		  method: 'post',
			url: this.getlibraryURL,
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
          id: this.formdatas.form.pLibraryId,
			}
	    }).then(function (response) {
		  	this.formdatas.form.pLibraryName=response.data.libraryName;
//				console.log(this.formdatas.form)
		}.bind(this)).catch(function (error) {
		    console.log(error);
		}.bind(this));
  	},
//	获取搜索数据
  	searchingfor(searching){
  		console.log(searching);
  		// 获取列表数据（第？页）
		this.$http({
		    method: 'post',
			url: this.searchURL,
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
//			data: {
//			   
//			}
	    }).then(function (response) {
//		  	this.tabledatas=response.data.rows;
//	  		setTimeout(()=>{			  		
		  		this.loading=false;
//		  	},1000)
		}.bind(this)).catch(function (error) {
		    console.log(error);
		}.bind(this));
  	},
	//提交表单
	submit(){
		if(!this.$_ault_alert('sample:edit')){
			return
		}
		var data={};
		data.otherState=2;
		for(var key in this.formdatas.form){
			if(this.formdatas.form[key]){
				data[key]=this.formdatas.form[key]
			}
		}
		this.$http({
		  method: 'post',
			url: this.saveRukuURL,
     		transformRequest: [function (data) {
				// Do whatever you want to transform the data
				let ret = ''
				for (let it in data) {
				ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
				}
				return ret
			}],
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data:data
//			data: {
//        		id: this.$route.query.libid,
//				storageTime: this.formdatas.form.storageTime,
//				depot: this.formdatas.form.depot,
//				counter: this.formdatas.form.counter,
//				autograph:this.formdatas.form.autograph,
//			}
	    }).then(function (response) {
		   	this.modal.formdatas[0].value='监'+response.data.sampleNum;
		   	this.dataBySampleNo.id=response.data.id;
		   	this.modalVisible=true;
//    		this.$router.go(-1);//提交完成返回上一页
		  	
	  		// setTimeout(()=>{			  		
		  	// 	this.loading=false;
		  	// },1000)
		}.bind(this)).catch(function (error) {
		    console.log(error);
		}.bind(this));
	},
	titleEvent(){
  		console.log('titleEvent');
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
				storageTime: form.storageTime,
//				depot: form.depot,
//				counter: form.counter,
				placeId: form.place,
				autograph: form.autograph,
				sampleState: 1
			}
	    }).then(function (response) {
//			console.log(response)
			if(response.data.success) {
				//将已选柜子去掉
				this.placeList=this.placeList.filter(function(item,index){
					return item.id!==form.place
				})
//				this.getlistdata(1);
//				this.getplacelist();
				this.$notify({
		          	title: '入库成功',
		          	message: '该样品已成功入库！！！',
		          	type: 'success'
		        });
				window.history.go(-1)
		        
//		        this.printCodeBar(this.modal.formdatas[0].value)
			}else{
				this.$notify.error({
		          	title: '入库失败',
		          	message: '请重新核对入库信息！！！',
		        });
			}
		}.bind(this)).catch(function (error) {
//		    console.log(error);
		    this.$notify.error({
	          	title: '入库失败',
	          	message: '请重新核对入库信息！！！',
	        });
		}.bind(this));
		// this.$router.push({path: '/index/sampleManagement/sampleIn/sampleInCreate', params: {'position': form.position,'sampleInName': form.sampleInName} })
		// this.$router.push({name: "样品管理/样品入库列表/新建样品", params: {'yangpinshi': form.yangpinshi,'gui': form.gui,'sampleInSign': form.sampleInSign,'sampleNumber': form.sampleNumber} })
	},
//	关闭新建弹框
	dialogClose(){
		this.modalVisible=false;
		//关闭入库框后打开扫描框
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
	getDateNow(){
  		var date1=new Date()
  		return date1.getFullYear()+'-'+(date1.getMonth()+1)+'-'+date1.getDate()
  	},
  },
  data() {
    return {
      getdataURL:this.apiRoot + '/grain/sample/get',
	  editURL: this.apiRoot + '/grain/sample/edit',
	  saveRukuURL: this.apiRoot + '/grain/sample/saveRuku',
	  depotlistURL: this.apiRoot + '/grain/warehouse/getAll',
	  counterlistURL: this.apiRoot + '/grain/warehouseCounter/getAll',
	  placelistURL: this.apiRoot + '/grain/warehouseCounterPlace/getAll',
	  getlibraryURL: this.apiRoot + '/grain/library/get',
      searchURL:'/liquid/role2/data/search',
      deleteURL:'/liquid/role2/data/delete',
      checkedId:[],
      depotList:[],
      counterList:[],
      placeList:[],
      dataBySampleNo:{},
	  createlibVisible:false,
      breadcrumb:{
      	search:false,   
      	searching:'',
      },
      subtitle:{
      	btn:false,
      	btntext:'',
      },
//    弹窗数据
      alerts: [{
        title: '温馨提示：样品入库时的确定存放位置时需按顺序依次选择样品室、柜号、位置!',
        type: 'info'
      }],
      formdatas: {
      	title:'扦样信息',
      	form:{
			libraryId:'',	//被查库点id
			pLibraryId:'',  //被查直属库id
			position:'',	//货位号
			sort:'',		//品种
			quality:'',		//性质
			amount:'',		//数量
			originPlace:'',	//产地		
			gainTime:'',	//收货年度		
			barnTime:'',	//入库时间		
			remark:'',		//备注		
      	},
      	submitText:'确定',
	  },
	  modalVisible:false,
	  modal:{
	  	title:'入库',
		formdatas:[
//			{
//	  			label:"扦样编号:",
//	  			model:"sampleNo",
//	  			disabled:true,
//	  			value:'',
//	  			type:'input',
//	  		},
	  		{
	  			label:"检验编号:",
	  			model:"sampleNum",
	  			disabled:true,
	  			value:'',
	  			type:'input',
	  		},
	  		{
	  			label:"样品入库时间:",
	  			model:"storageTime",
	  			disabled:true,
	  			value:this.getDateNow(),
	  			type:'input',
	  		},
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
	  			label:"入库签名:",
	  			model:"autograph",
				value: "",
	  			disabled:true,
	  			type:'input',
	  		},
	  	],
//	  	addprop:true,
	  	submitText:'入库',
	  },
    }
  }
}
</script>

