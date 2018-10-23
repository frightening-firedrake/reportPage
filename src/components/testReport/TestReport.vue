<template>
    <div class='listpagewrap'>
      <!--面包屑-->
      <sinograin-breadcrumb :breadcrumb="breadcrumb" v-on:searchingfor="searchingfor"></sinograin-breadcrumb>
      <!--alert-->
      <!--<sinograin-prompt :alerts="alerts"></sinograin-prompt>-->
      <!--标题-->
      <sinograin-option-title :title="subtitle" v-on:titleEvent="titleEvent"></sinograin-option-title>
      <!--合格筛选--> 
      <!--<tabselect :hege="hege" :currentTab="currentTab" @hegeChange="hegeChange"></tabselect>--> 
      <!--表格上的时间选框以及 创建-->
      <list-header :listHeader="listHeader" v-on:dateChange="dateChange" v-on:statusChange="statusChange" v-on:createSampling="createSampling" v-on:createlib="createlib" class="deep"></list-header>
      <!--表格-->
      <sinograin-complex-list class="complex" :tabledata="tabledatas" :list="list" :items="items" :actions="actions" v-on:getchecked="getchecked" :loading="loading" v-on:emptyCreate="emptyCreate"> 
      </sinograin-complex-list>
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
import SinograinComplexList from '@/components/common/action/ComplexList.vue';
import SinograinPrompt from '@/components/common/prompt/Prompt.vue';
import SinograinBreadcrumb from '@/components/common/action/Breadcrumb.vue';
import SinograinPagination from '@/components/common/action/Pagination.vue';
import SinograinOptionTitle from "@/components/common/action/OptionTitle"
import ListHeader from '@/components/common/action/ListHeader.vue';
import TfootButtons from '@/components/common/action/TfootButtons.vue';
import SinograinModal from '@/components/common/action/Modal.vue';
import Tabselect from '@/components/common/action/Tabselect.vue';
import "@/assets/style/common/ComplexList.css"
import { mapState,mapMutations,mapGetters,mapActions} from 'vuex';
//本地测试要用下面import代码
//import data from '@/util/mock';



export default {
  components: {
    SinograinComplexList,SinograinPrompt,SinograinPagination,SinograinBreadcrumb,Tabselect,SinograinModal,ListHeader,SinograinOptionTitle,TfootButtons
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
	},
	items(){
		if(this.sort=='玉米'){
			return this.yumi;
		}else if(this.sort=='小麦'){			
			return this.xiaomai;	
		}
	},
  },
  created(){
	console.log(this.$route.params)
//  获取列表数据（第一页）
	if(this.$route.params.ids){
		this.ids=this.$route.params.ids;
		this.sort=this.$route.params.sort;
		if(this.sort=='玉米'){
			this.datalistURL=this.apiRoot +'/grain/sample/dataCornReport'
			this.exportURL=this.apiRoot +'/grain/sample/Export/POI'
		}else if(this.sort=='小麦'){
			this.datalistURL=this.apiRoot +'/grain/sample/dataWheatReport'
			this.exportURL=this.apiRoot +'/grain/sample/ExeclPOI'			
		}
		this.listHeader.tableName=this.$route.params.title;
		this.getlistdata(this.ids,this.listHeader.tableName)
	}else{
		var path=this.$route.path;
		var end=path.lastIndexOf('/');
  		path=path.slice(0,end);
		this.$router.push({path:path});
	}
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
	  		setTimeout(()=>{			  		
		  		this.loading=false;
		  	},1000)
		}.bind(this)).catch(function (error) {
		    console.log(error);
		}.bind(this));
  	},
//	获取列表数据方法
  	getlistdata(ids,title){
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
				ids:ids,
				title:title,
			}
	    }).then(function (response) {
		  	this.tabledatas=response.data.map((value,index)=>{
		  		value.realCapacity=value.realCapacity?value.realCapacity.toFixed(0):'';
		  		value.length=value.length?value.length.toFixed(2):'';
		  		value.correctioFactor=value.correctioFactor?value.correctioFactor.toFixed(2):'';
		  		value.wide=value.wide?value.wide.toFixed(2):'';
		  		value.aveDensity=value.aveDensity?value.aveDensity.toFixed(1):'';
		  		value.high=value.high?value.high.toFixed(2):'';
		  		value.unQuality=value.unQuality?value.unQuality.toFixed(0):'';
		  		value.measuredVolume=value.measuredVolume?value.measuredVolume.toFixed(1):'';
		  		value.grainQuality=value.grainQuality?value.grainQuality.toFixed(0):'';
		  		value.deductVolume=value.deductVolume?value.deductVolume.toFixed(1):'';
		  		value.slip=value.slip?value.slip.toFixed(1):'';
		  		value.realVolume=value.realVolume?value.realVolume.toFixed(1):'';
		  		value.qualityGrade=value.qualityGrade==1?'一等':value.qualityGrade==2?'二等':value.qualityGrade==3?'三等':'';
		  		return value
		  	});

		  	
//			setTimeout(()=>{			  		
		  		this.loading=false;
//		  	},1000)


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
  		console.log('titleEvent');
  	},
//	表单底部触发事件btnCenterNo btnCenterYes btnLeft btnRight btnOne
	tfootEvent(date){
		console.log(date);
		if(date=='btnCenterL'){

		}else if(date=='btnCenterR'){

		}else if(date=='btnLeft'){

		}else if(date=='btnRight'){

		}else if(date=='btnOne'){
			this.exportExcel(this.ids,this.listHeader.tableName)
		}
	},
//	导出事件
	exportExcel(ids,title){
		if(!this.$_ault_alert('sample:reportXMorYM')){
			return
		}
		var loadiframe=document.getElementById('fordownload');
		loadiframe.src=this.exportURL+'?ids='+ids+'&title='+title+'&sessionid='+this.Token;
//		window.open(this.exportURL+'?ids='+ids+'&title='+title+'&sessionid='+this.Token,"_blank");
	},
//	选项卡切换
	TabChange(currentTab){
		this.headerindex=currentTab;
		var Tabitem=this.Tabs.filter((item,index)=>{
			return item.label==currentTab
		})
		this.currentTab=Tabitem[0].text;
		this.subtitle.title=this.currentTab;
		this.listHeader.tableName='2017年度轮换验收情况汇总表—<span style="color:#2d82e2;">'+this.currentTab+'</span>表';

		
	},
//质量合格否
	hegeChange(currentTab){
		console.log(currentTab)
	},
  },
  data() {
    return {
      datalistURL:'',
      exportURL:'',
      searchURL:'/liquid/role2/data/search',
      deleteURL:'/liquid/role2/data/delete',
      checkedId:[],
      ids:'',
      list:"samplinglist",
      sort:'小麦',
      breadcrumb:{
      	search:false,   
      	searching:'',
      },
      currentTab:0,
      Tabs:[
      	{label:0,text:'基本情况'},
      	{label:1,text:'扦样检查情况'},
      	{label:2,text:'数量验收情况'},
      	{label:3,text:'质量验收情况'},
      ],
      hege:[
      	{label:0,text:'全部'},
      	{label:1,text:'合格'},
      	{label:2,text:'不合格'},
      ],
      subtitle:{
		title:"基本情况",
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
      	tableName:'',
      },
      tabledatas:[],
      headerindex:0,
//    items:[],
      yumi:[
		  {
	        id: 100,
	        label: "基本情况",
	        pid:0,
	      },
	      {
	        id: 200,
	        label: "扦样检查情况",
	        pid:0,
	      },
	      {
	        id: 300,
	        label: "数量验收情况",
	        pid:0,
	      },
	      {
	        id: 400,
	        label: "质量验收情况",
	        pid:0,
	      },
	      {
	        id: 1,
	        prop:'libraryName',
	        label: "储存库点名称",
	        pid:100,
	//      sort:true
	      },
	      {
	        id: 2,
	        prop:'sampleNum',
	        label:"检验编号",
	        status:true,
	        width:100,
	        pid:100,
	//      sort:true,
	      },
	      {
	        id: 3,
	        prop:'sampleNo',
	        label: "扦样编号",
	        pid:100,
	//      sort:true,
	      },
	      {
	        id: 4,
	        prop:'position',
	        label:"仓号",
	        pid:100,
	//      sort:true,
	      },
	      {
	        id: 5,
	        prop:'sort',
	        label:"品种",
	        pid:100,
	//      sort:true,
	      },
	      {
	        id: 6,
	        prop:'amount',
	        label:"数量（吨）",
	        pid:100,
	//      sort:true,
	      },
	      {
	        id: 1001,
	        prop:'originPlace',
	        label:"产地",
	        pid:100,
	//      sort:true,
	      },
	      {
	        id: 7,
	        prop:'gainTime',
	        label:"生产年份",
	        pid:100,
	//      sort:true,
	      },
	      {
	        id: 8,
	        prop:'storageTime',
	        label:"入库时间",
	        pid:100,
	//      sort:true,
	      },

	      {
	        id: 9,
	        prop:'checkApplyTime',
	        label: "验收申请时间",
	        pid:200,
	//      sort:true
	      },
	      {
	        id: 10,
	        prop:'assignMissionTime',
	        label:"任务下达时间",
	        pid:200,
	//      sort:true,
	      },
	      {
	        id: 11,
	        prop:'sampleTime',
	        label: "扦样时间",
	        pid:200,
	//      sort:true,
	      },
	      {
	        id: 12,
	        prop:'autograph',
	        label:"扦样人",
	        pid:200,
	//      sort:true,
	      },
	      {
	        id: 13,
	        prop:'remark',
	        label:"备注",
	        pid:200,
	//      sort:true,
	      },
	      {
	        id: 14,
	        prop:'length',
	        label: "长度",
	        pid:300,
	//      sort:true
	      },
	      {
	        id: 15,
	        prop:'wide',
	        label:"宽度",
	        pid:300,
	//      sort:true,
	      },
	      {
	        id: 16,
	        prop:'high',
	        label: "高度",
	        pid:300,
	//      sort:true,
	      },
	      {
	        id: 17,
	        prop:'deductVolume',
	        label:"扣除体积",
	        pid:300,
	//      sort:true,
	      },
	      {
	        id: 18,
	        prop:'realVolume',
	        label:"粮堆实际体积",
	        pid:300,
	//      sort:true,
	      },
	      {
	        id: 19,
	        prop:'realCapacity',
	        label:"容重",
	        pid:300,
	//      sort:true,
	      },
	      {
	        id: 20,
	        prop:'correctioFactor',
	        label:"修正系数",
	        pid:300,
	//      sort:true,
	      },
	      {
	        id: 21,
	        prop:'aveDensity',
	        label:"平均密度",
	        pid:300,
	//      sort:true,
	      },
	      {
	        id: 22,
	        prop:'unQuality',
	        label:"测量计算数",
	        pid:300,
	//      sort:true,
	      },
	      {
	        id: 23,
	        prop:'grainQuality',
	        label:"保管帐数量",
	        pid:300,
	//      sort:true,
	      },
	      {
	        id: 24,
	        prop:'slip',
	        label:"差率",
	        pid:300,
	//      sort:true,
	      },
	      {
	        id: 25,
	        label: "质量情况",
	        pid:400,
	      },
	      {
	        id: 26,
	        label:"储存品质情况",
	        pid:400,
	//      sort:true,
	      },
	      {
	        id: 27,
	        prop:'qualityGrade',
	        label: "等级",
	        pid:25,
//	        width:70,
	//      sort:true,
	      },
	      {
	        id: 28,
	        label:"质量指标",
	        pid:25,
	//      sort:true,
	      },
	      {
	        id: 29,
	        prop:'jieguopanding1',
	        label:"结果判定",
	        pid:25,
//	        width:70,
	//      sort:true,
	      },
	      {
	        id: 30,
	        prop:'rongzhong',
	        label:"容重",
	        pid:28,
//	        width:70,
	//      sort:true,
	      },
	      {
	        id: 31,
	        prop:'shuifen',
	        label:"水分",
	        pid:28,
//	        width:70,
	//      sort:true,
	      },
	      {
	        id: 32,
	        prop:'zazhi',
	        label:"杂质",
	        pid:28,
//	        width:70,
	//      sort:true,
	      },
	      {
	        id: 33,
	        label:"不完善粒",
	        pid:28,
	//      sort:true,
	      },
	      {
	        id: 34,
	        prop:'sezeqiwei1',
	        label:"色泽气味",
	        pid:28,
	//      sort:true,
	      },
	      {
	        id: 35,
	        prop:'buwanshanlizongliang',
	        label:"总量",
	        pid:33,
	//      sort:true,
	      },
	      {
	        id: 36,
	        prop:'buwanshanlishengmeikeli',
	        label:"生霉颗粒",
	        pid:33,
	//      sort:true,
	      },
	      {
	        id: 37,
	        label:"储存品质指标",
	        pid:26,
	      },
	      {
	        id: 38,
	        prop:'jieguopanding2',
	        label:"结果判定",
	        pid:26,
//	        width:70,
	//      sort:true,
	      },
	      {
	        id: 39,
	        prop:'zhifangsuanzhi',
	        label:"脂肪酸值",
	        pid:37,
//	        width:70,
	//      sort:true,
	      },
	      {
	        id: 40,
	        prop:'pinchangpingfen',
	        label:"品尝评分值",
	        pid:37,
//	        width:70,
	//      sort:true,
	      },
	      {
	        id: 41,
	        prop:'sezeqiwei2',
	        label:"色泽气味",
	        pid:37,
//	        width:70,
	//      sort:true,
	      },
	      {
	        id: 42,
	        prop:'remark2',
	        label:"备注",
	        pid:0,
	//      sort:true,
	      },
	      {
	        id: 43,
	        prop:'jianceren',
	        label:"检测人",
	        pid:0,
	        width:300,
	//      sort:true,
	      },
	      {
	        id: 44,
	        prop:'jianceshijian',
	        label:"检测时间",
	        pid:0,
	//      sort:true,
	      },

	  ],
	  xiaomai:[
		  {
	        id: 100,
	        label: "基本情况",
	        pid:0,
	      },
	      {
	        id: 200,
	        label: "扦样检查情况",
	        pid:0,
	      },
	      {
	        id: 300,
	        label: "数量验收情况",
	        pid:0,
	      },
	      {
	        id: 400,
	        label: "质量验收情况",
	        pid:0,
	      },
	      {
	        id: 1,
	        prop:'libraryName',
	        label: "储存库点名称",
	        pid:100,
	//      sort:true
	      },
	      {
	        id: 2,
	        prop:'sampleNum',
	        label:"检验编号",
	        pid:100,
	        width:100,
	        status:true,
	//      sort:true,
	      },
	      {
	        id: 3,
	        prop:'sampleNo',
	        label: "扦样编号",
	        pid:100,
	//      sort:true,
	      },
	      {
	        id: 4,
	        prop:'position',
	        label:"仓号",
	        pid:100,
	//      sort:true,
	      },
	      {
	        id: 5,
	        prop:'sort',
	        label:"品种",
	        pid:100,
	//      sort:true,
	      },
	      {
	        id: 6,
	        prop:'amount',
	        label:"数量（吨）",
	        pid:100,
	//      sort:true,
	      },
	      {
	        id: 1001,
	        prop:'originPlace',
	        label:"产地",
	        pid:100,
	//      sort:true,
	      },
	      {
	        id: 7,
	        prop:'gainTime',
	        label:"生产年份",
	        pid:100,
	//      sort:true,
	      },
	      {
	        id: 8,
	        prop:'storageTime',
	        label:"入库时间",
	        pid:100,
	//      sort:true,
	      },

	      {
	        id: 9,
	        prop:'checkApplyTime',
	        label: "验收申请时间",
	        pid:200,
	//      sort:true
	      },
	      {
	        id: 10,
	        prop:'assignMissionTime',
	        label:"任务下达时间",
	        pid:200,
	//      sort:true,
	      },
	      {
	        id: 11,
	        prop:'sampleTime',
	        label: "扦样时间",
	        pid:200,
	//      sort:true,
	      },
	      {
	        id: 12,
	        prop:'autograph',
	        label:"扦样人",
	        pid:200,
	//      sort:true,
	      },
	      {
	        id: 13,
	        prop:'remark',
	        label:"备注",
	        pid:200,
	//      sort:true,
	      },
	      {
	        id: 14,
	        prop:'length',
	        label: "长度",
	        pid:300,
	//      sort:true
	      },
	      {
	        id: 15,
	        prop:'wide',
	        label:"宽度",
	        pid:300,
	//      sort:true,
	      },
	      {
	        id: 16,
	        prop:'high',
	        label: "高度",
	        pid:300,
	//      sort:true,
	      },
	      {
	        id: 17,
	        prop:'deductVolume',
	        label:"扣除体积",
	        pid:300,
	//      sort:true,
	      },
	      {
	        id: 18,
	        prop:'realVolume',
	        label:"粮堆实际体积",
	        pid:300,
	//      sort:true,
	      },
	      {
	        id: 19,
	        prop:'realCapacity',
	        label:"容重",
	        pid:300,
	//      sort:true,
	      },
	      {
	        id: 20,
	        prop:'correctioFactor',
	        label:"修正系数",
	        pid:300,
	//      sort:true,
	      },
	      {
	        id: 21,
	        prop:'aveDensity',
	        label:"平均密度",
	        pid:300,
	//      sort:true,
	      },
	      {
	        id: 22,
	        prop:'unQuality',
	        label:"测量计算数",
	        pid:300,
	//      sort:true,
	      },
	      {
	        id: 23,
	        prop:'grainQuality',
	        label:"保管帐数量",
	        pid:300,
	//      sort:true,
	      },
	      {
	        id: 24,
	        prop:'slip',
	        label:"差率",
	        pid:300,
	//      sort:true,
	      },
	      {
	        id: 25,
	        label: "质量情况",
	        pid:400,
	      },
	      {
	        id: 26,
	        label:"储存品质情况",
	        pid:400,
	//      sort:true,
	      },
	      {
	        id: 27,
	        prop:'qualityGrade',
	        label: "等级",
	        pid:25,
//	        width:70,
	//      sort:true,
	      },
	      {
	        id: 28,
	        label:"质量指标",
	        pid:25,
	//      sort:true,
	      },
	      {
	        id: 29,
	        prop:'jieguopanding1',
	        label:"结果判定",
	        pid:25,
//	        width:70,
	//      sort:true,
	      },
	      {
	        id: 30,
	        prop:'rongzhong',
	        label:"容重",
	        pid:28,
//	        width:70,
	//      sort:true,
	      },
	      {
	        id: 31,
	        prop:'shuifen',
	        label:"水分",
	        pid:28,
//	        width:70,
	//      sort:true,
	      },
	      {
	        id: 32,
	        label:"杂质",
	        pid:28,
//	        width:70,
	//      sort:true,
	      },
	      {
	        id: 33,
	        prop:'buwanshanli',
	        label:"不完善粒",
	        pid:28,
	//      sort:true,
	      },
	      {
	        id: 1000,
	        prop:'yingduzhishu',
	        label:"硬度指数",
	        pid:28,
	//      sort:true,
	      },
	      {
	        id: 34,
	        prop:'sezeqiwei1',
	        label:"色泽气味",
	        pid:28,
	//      sort:true,
	      },
	      {
	        id: 35,
	        prop:'zazhizongliang',
	        label:"总量",
	        pid:32,
	//      sort:true,
	      },
	      {
	        id: 36,
	        prop:'zazhikuangwuzhi',
	        label:"其中:矿物质",
	        pid:32,
	//      sort:true,
	      },
	      {
	        id: 37,
	        label:"储存品质指标",
	        pid:26,
	      },
	      {
	        id: 38,
	        prop:'jieguopanding2',
	        label:"结果判定",
	        pid:26,
//	        width:70,
	//      sort:true,
	      },
	      {
	        id: 39,
	        prop:'mianjinxishuiliang',
	        label:"面筋吸水量",
	        pid:37,
//	        width:70,
	//      sort:true,
	      },
	      {
	        id: 40,
	        prop:'shimianjin',
	        label:"湿面筋",
	        pid:37,
//	        width:70,
	//      sort:true,
	      },
	      {
	        id: 41,
	        prop:'pinchangpingfen',
	        label:"品尝评分值",
	        pid:37,
//	        width:70,
	//      sort:true,
	      },
	      {
	        id: 42,
	        prop:'sezeqiwei2',
	        label:"色泽气味",
	        pid:37,
//	        width:70,
	//      sort:true,
	      },
	      {
	        id: 43,
	        prop:'remark',
	        label:"备注",
	        pid:0,
	//      sort:true,
	      },
		  {
	        id: 44,
	        prop:'jianceren',
	        label:"检测人",
	        pid:0,
	        width:"300",
	//      sort:true,
	      },
	      {
	        id: 45,
	        prop:'jianceshijian',
	        label:"检测时间",
	        pid:0,
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
//    	btnCenter:{
//			btnTextL:'申请扦样',
//			btnTextR:'保存',
//		},
//		btnLeft:{
//			btnText:'导出Excel表格',
//		},
//		btnRight:{
//			btnText:'导出Excel表格',
//		},
		btnOne:{
			btnText:'导出Excel表格',
		},     	
      },
    }
  }
}
</script>