<template>
  <div class='listpagewrap' id="listpagewrap">
    <!--面包屑-->
    <sinograin-breadcrumb :breadcrumb="breadcrumb" v-on:searchingfor="searchingfor"></sinograin-breadcrumb>
    <!--标题-->
    <sinograin-option-title :title="subtitle" v-on:titleEvent="titleEvent"></sinograin-option-title>
    <div id="print" >
      <div class="handover_view" style="width:100%;">
      	<div class="codewrap" >
			<img class="codeimg" :src="code" alt="" />
      	</div>
        <!--<div class="hand_view_title" style="width:100%;height:0.45rem;text-align:center;line-height:0.45rem;font-size:0.24rem;color:#333333;">
          <span>山西中储粮粮食质检中心</span>
        </div>-->
        <div class="hand_view_tab" style="">
          <div class="hand_view_tab_title" style="border-radius: 0;">
            <!--<p>{{formdatas.sort}}样品领取交接单</p>-->
            <p style="">{{this.sort?this.sort:''}}样品确认单</p>
          </div>
          <!--<div class="hand_view_tab_num" style="">
            <p style="">编号:{{formdatas.nid>=10?formdatas.nid:'0'+formdatas.nid}}</p>
          </div>-->
          <el-row style="" class="hand_view_tab_content">
            <el-col style="height:auto;background-color:#fbfbfb;border-left:1px solid #dfdfdf;" :span="24" class="hand_view_tab_content_font">
              <el-col style="border-left:none;margin-left: -1px;text-align: center;" :span="3">
                <span>检验编号:</span>
              </el-col>
              <el-col style="font-size:0.16rem; background-color:#fff;padding:0 2%;border-left: 1px solid #dfdfdf;" :span="21">
                <span>{{sampleNum}}</span>
              </el-col>
            </el-col>
          </el-row>
          <el-row style="background-color:#fbfbfb;" class="hand_view_tabbody">
            <el-col style="" :span="8">
              <el-col style="border-right: 1px solid #dfdfdf;" :span="9">
                <span>检验项目</span>
              </el-col>
              <el-col style="border-right: 1px solid #dfdfdf;" :span="9">
                <span>检测结果</span>
              </el-col>
              <el-col style="" :span="6">
                <span>负责人</span>
              </el-col>
            </el-col>
           <el-col style="" :span="8">
              <el-col style="border-right: 1px solid #dfdfdf;" :span="9">
                <span>检验项目</span>
              </el-col>
              <el-col style="border-right: 1px solid #dfdfdf;" :span="9">
                <span>检测结果</span>
              </el-col>
              <el-col style="" :span="6">
                <span>负责人</span>
              </el-col>
            </el-col>
            <el-col style="" :span="8">
              <el-col style="border-right: 1px solid #dfdfdf;" :span="9">
                <span>检验项目</span>
              </el-col>
              <el-col style="border-right: 1px solid #dfdfdf;" :span="9">
                <span>检测结果</span>
              </el-col>
              <el-col style="" :span="6">
                <span>负责人</span>
              </el-col>
            </el-col>
            
          </el-row>
          <el-row class="hand_view_tabbody" style="border-top:none;">
            <!--<el-col :span="6" v-for="(item,index) in formdatas.testItemList" class='loopBorder' :key="index" style="border-top:1px solid #dfdfdf;">
              <el-col style="" :span="8">
                <span>{{index+1}}</span>
              </el-col>
              <el-col style="" :span="16">
                <span>监{{item}}</span>
              </el-col>
            </el-col>
            <el-col style="" :span="6" v-for="(item,index) in testItemListadd" class='loopBorder' :key="index+99" style="border-top:1px solid #dfdfdf;">
              <el-col style="" :span="8">
                <span>{{index+formdatas.testItemList.length+1}}</span>
              </el-col>
              <el-col style="" :span="16">
                <span>&nbsp;</span>
              </el-col>
            </el-col>-->
            <el-col v-for="(item,index) in checkedList" style="border-top:1px solid #dfdfdf;background:white;" :key="item.testItem" :span="8" class='loopBorder'>
              <el-col :title="item.testName" class="textoverflow" style="border-right: 1px solid #dfdfdf;" :span="9">
                <span>{{item.testName}}</span>
              </el-col>
              <el-col style="border-right: 1px solid #dfdfdf;" :span="9">
                <span v-if="!item.result" style="color:#007c36;">待检测</span>
                <span v-if="item.result" style="color:#2380FF;">{{item.result}}</span>
              </el-col>
              <el-col style="" :span="6">
                <span style="color:#999;">{{item.principal}}</span>
              </el-col>
            </el-col>
           
            <el-col v-if="checkedList.length%3!=0" style="border-top:1px solid #dfdfdf;background:white;" :span="8" class='loopBorder'>
              <el-col style="border-right: 1px solid #dfdfdf;" :span="9">
                <span>&nbsp;</span>
              </el-col>
              <el-col style="border-right: 1px solid #dfdfdf;" :span="9">
                <span>&nbsp;</span>
              </el-col>
              <el-col style="" :span="6">
                <span>&nbsp;</span>
              </el-col>
            </el-col>
            <el-col v-if="checkedList.length%3==1" style="border-top:1px solid #dfdfdf;background:white;" :span="8" class='loopBorder'>
              <el-col style="border-right: 1px solid #dfdfdf;" :span="9">
                <span>&nbsp;</span>
              </el-col>
              <el-col style="border-right: 1px solid #dfdfdf;" :span="9">
                <span>&nbsp;</span>
              </el-col>
              <el-col style="" :span="6">
                <span>&nbsp;</span>
              </el-col>
            </el-col>
            
            
            
          </el-row>



          
        </div>
      </div>
      </div>
     <!--<div id='printbuttom' class="leading_out" @click="print()">-->
     <div id='printbuttom' class="leading_out right" @click="leading_out()">
     <!--<div class="leading_out" @click="lodopPrint()">-->
        <!--<span>打印样品领取交接单</span>-->
        <span>导出Word文档</span>
      </div>
    
  </div>
</template>

<style>
.doubleHeight{
	line-height: 1.2rem;
}
.textoverflow{
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>

<script>

import SinograinPrompt from '@/components/common/prompt/Prompt.vue';
import SinograinBreadcrumb from '@/components/common/action/Breadcrumb.vue';
import SinograinOptionTitle from "@/components/common/action/OptionTitle"
//这里是打印控件
import {getLodop} from 'static/lodop/LodopFuncs'
let LODOP

import "static/jqprint/jquery.jqprint.js"
import "@/assets/style/common/handoverView.css"
import "@/assets/style/common/list.css"
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex';
//本地测试要用下面import代码
//import data from '@/util/mock';



export default {
  components: {
    SinograinPrompt, SinograinBreadcrumb, SinograinOptionTitle
  },
  computed: {
    ...mapState(["modal_id_number", "viewdata", "editdata", "aultdata", "messions", "mask"]),
    ...mapGetters(["Token"]),
    testItemListadd(){
    	var length=0;
    	if(this.formdatas.testItemList.length%4){    		
    		length=4-this.formdatas.testItemList.length%4;
    	}
    	if(!this.formdatas.testItemList.length){    		
    		length=4;
    	}
//  	var length=4-this.formdatas.testItemList.length%4;
    	var item={checkNum:undefined}
    	var arr=[]
    	if(length){
		    for (var i=0;i<length;i++){
					arr.push(item)
				}
			  return arr
    		
    	}else{
    		return arr   		
    	}
    	
    },
    code(){
//  	console.log(this.checkedList)
		return  this.apiRoot +'/grain/upload/barcode/'+this.sampleNumPic;
	},
  },
  created() {
//  console.log(this.$route.query)
    //  获取列表数据（第一页）
    this.getlistdata(1)

  },
  destroy() {

  },
  methods: {
    ...mapMutations(['create_modal_id', 'is_mask', 'create_modal', 'close_modal']),
    ...mapActions(['addAction']),
    print() {
      // $("#print").jqprint({
      // 		 debug: false, 
      // 		 importCSS: true, 
      // 		 printContainer: true, 
      // 		 operaSupport: false
      // 		 });
      // alert(0)
//    let subOutputRankPrint = document.getElementById('print');
//    console.log(subOutputRankPrint.innerHTML);
//    let newContent = subOutputRankPrint.innerHTML;
//    let oldContent = document.body.innerHTML;
//    document.body.innerHTML = newContent;
//    print.portrait   =  false  
//    window.print();
//    window.location.reload();
//    document.body.innerHTML = oldContent;
//    return false;
      
      let subOutputRankPrint = document.getElementById('print');
			let father = document.getElementById('father');
			let listpagewrap = document.getElementById('listpagewrap');
			let printbuttom = document.getElementById('printbuttom');
			document.body.insertBefore(subOutputRankPrint,father)
			subOutputRankPrint.classList.add('blackBorder')
			father.style.display="none";
      print.portrait   =  true;  
      window.print();
      subOutputRankPrint.classList.remove('blackBorder')
      listpagewrap.insertBefore(subOutputRankPrint,printbuttom)
			father.style.display="block";
     	return false;
    },
    lodopPrint() {
    	LODOP = getLodop();

  			LODOP.PRINT_INIT("打印交接单");
//			LODOP.SET_PRINTER_INDEX("Godex G530");  
  			LODOP.SET_PRINT_PAGESIZE(2, 210, 297, "A4");
				LODOP.ADD_PRINT_HTM(88,200,350,600,document.getElementById("print").innerHTML);
    		LODOP.PREVIEW(); 
//			  LODOP.PRINT(); 

    },
    leading_out(){
    		if(!this.$_ault_alert('export:exportWordTestItem')){
				return
			}
				var id=this.$route.query.id;
//				var id=this.sampleId;
				var loadiframe=document.getElementById('fordownload');
				loadiframe.src=this.exportExcelURL+'?sampleId='+id+'&sessionid='+this.Token;
    },
    //	获取列表数据方法
    getlistdata(page) {
      this.loading = true;
      // 获取列表数据（第？页）
      this.$http({
        method: 'post',
        url: this.datalistURL,
        transformRequest: [function (data) {
					let ret = ''
					for (let it in data) {
					ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
					}
					return ret
				}],
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  			data: {
  					sampleId:this.$route.query.id
  			}
      }).then(function(response) {
      	this.sampleNum='监'+response.data[0].sampleNum;
      	this.sort=response.data[0].sort;
      	if(response.data[0].checkeds){
      		var checkeds=response.data[0].checkeds;
      		var results=response.data;
      		var sort=response.data[0].sort;
      		this.sampleNumPic=response.data[0].sampleNumPic;
//    		if(sort=='玉米'){
//    			checkeds=checkeds.replace("4", "4.1,4.2")
//    			checkeds=checkeds.replace("3", "3.1")
//    			checkeds=checkeds.replace("10", "10.1,10.2,10.3,10.4")
//    			checkeds=checkeds.replace("11", "11.1,11.2,11.3")
//    		}else if(sort=="小麦"){
//    			checkeds=checkeds.replace("4", "4.1")
//    			checkeds=checkeds.replace("3", "3.1,3.2")
//    			checkeds=checkeds.replace("10", "10.1,10.2,10.3,10.4")
//    			checkeds=checkeds.replace("11", "11.1,11.2,11.3")
//    		}
      		checkeds=checkeds.split(',');
      		checkeds=checkeds.sort((a,b)=>{
      			return a-b
      		});
      		this.checkedList=this.checkedList.filter((value,index)=>{
      			results.forEach((value2)=>{
      				if(value2.testItem==value.testItem){
      					value.result=value2.result
      					value.principal=value2.principal
//    					value.sampleNumPic=value2.sampleNumPic
      				}
      			})
      			return checkeds.includes(value.testItem);
      		})
      	}
//    	console.log()
//    	this.sampleId=response.data.sampleId
//    	console.log(response.data)



//    	this.formdatas.testList=this.findCheckeds(response.data.checkeds);//检测项目
//    	this.formdatas.nid=response.data.id;//编号
//    	this.formdatas.sort='麦子';//品种

//    	this.formdatas.testItemList=response.data.sampleNums.split(',');//检测样品
//    	this.formdatas.testItemList.sort();//检测样品排序
//      this.formdatas = response.data;
        //		  	this.tabledatas=response.data.rows;
        //	  		this.page.total=response.data.total;
          this.loading = false;
      }.bind(this)).catch(function(error) {
        console.log(error);
      }.bind(this));
    },
    //	获取搜索数据
    searchingfor(searching) {
      console.log(searching);
      // 获取列表数据（第？页）
      this.$http({
        method: 'post',
        url: this.searchURL,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        //			data: {
        //			   
        //			}
      }).then(function(response) {
        //		  	this.tabledatas=response.data.rows;
        setTimeout(() => {
          this.loading = false;
        }, 1000)
      }.bind(this)).catch(function(error) {
        console.log(error);
      }.bind(this));
    },
		titleEvent(){
  		console.log('titleEvent');
  	},
  	findCheckeds(str){
	  	var checkList=["容重","水分","杂质(矿物质)","不完善粒(生霉粒)","色泽气味(质量指标)","面筋吸水量","脂肪酸值","品尝评分值","色泽气味(储存品质指标)","真菌毒素(黄曲霉毒素B1、脱氧雪腐、镰刀菌烯醇、玉米赤霉烯酮)","重金属(铅、镉、汞、砷)"];	
  		var res=[];
  		var indexs=str.split(',');
	  	indexs.forEach((item)=>{
	  		if(item){
	  			res.push(checkList[item-1])
	  		}	
	  	})
	  	var restr=res.join(',');
  		if(restr=="容重,水分,杂质(矿物质),不完善粒(生霉粒),色泽气味(质量指标),面筋吸水量,品尝评分值,色泽气味(储存品质指标),真菌毒素(黄曲霉毒素B1、脱氧雪腐、镰刀菌烯醇、玉米赤霉烯酮),重金属(铅、镉、汞、砷)"){
  			return '全项目指标';
  		}else if(restr=="容重,水分,杂质(矿物质),不完善粒(生霉粒),色泽气味(质量指标),脂肪酸值,品尝评分值,色泽气味(储存品质指标),真菌毒素(黄曲霉毒素B1、脱氧雪腐、镰刀菌烯醇、玉米赤霉烯酮),重金属(铅、镉、汞、砷)"){
  			return '全项目指标';
  		}else{
  			//restr=restr.replace(/容重,水分,杂质\(矿物质\),不完善粒\(生霉粒\),色泽气味\(质量指标\)/, "质量指标全项目")
  			//restr=restr.replace(/面筋吸水量,品尝评分值,色泽气味\(储存品质指标\)/, "储存品质指标全项目")
  			//restr=restr.replace(/脂肪酸值,品尝评分值,色泽气味\(储存品质指标\)/, "储存品质指标全项目")
  			//restr=restr.replace(/真菌毒素\(黄曲霉毒素B1、脱氧雪腐、镰刀菌烯醇、玉米赤霉烯酮\),重金属\(铅、镉、汞、砷\)/, "食品卫生指标全项目")
  				restr=restr.replace("容重,水分,杂质(矿物质),不完善粒(生霉粒),色泽气味(质量指标)", "质量指标全项目")
	  			restr=restr.replace("面筋吸水量,品尝评分值,色泽气味(储存品质指标)", "储存品质指标全项目")
	  			restr=restr.replace("脂肪酸值,品尝评分值,色泽气味(储存品质指标)", "储存品质指标全项目")
	  			restr=restr.replace("真菌毒素(黄曲霉毒素B1、脱氧雪腐、镰刀菌烯醇、玉米赤霉烯酮),重金属(铅、镉、汞、砷)", "食品卫生指标全项目")
  			return restr
  		}
	  },
  },
  filters: {
   data:function (input) {
       var d = new Date(input);
       var year = d.getFullYear();
       var month = d.getMonth() + 1;
       var day = d.getDate() <10 ? '0' + d.getDate() : '' + d.getDate();
       var hour = d.getHours();
       var minutes = d.getMinutes();
       var seconds = d.getSeconds();
       return  year+ '-' + month + '-' + day;
//     return  year+ '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds;
   }
  },
  data() {
    return {
      datalistURL: this.apiRoot +'/grain/testItem/getResult',
	  	exportExcelURL: this.apiRoot + '/grain/testItem/exportWordTestItem',
      searchURL: '/liquid/role2/data/search',
      deleteURL: '/liquid/role2/data/delete',
      checkedId: [],
      sampleId:'',
      sampleNumPic:'',
      createlibVisible: false,
      breadcrumb: {
        search: false,
        searching: '',
      },
      subtitle:{
      	btn:false,
      	btntext:'',
      },
      //    弹窗数据
      alerts: [{
        title: '温馨提示：此页面灰色字为不可编辑状态!',
        type: 'info'
      }],
			sampleNum:'',
			sort:'',
			checkedList:[
					{testName:'容重',testItem:'1',result:'',principal:''},
					{testName:'水分',testItem:'2',result:'',principal:''},
					{testName:'杂质',testItem:'3',result:'',principal:''},
					{testName:'矿物质',testItem:'4',result:'',principal:''},
					{testName:'不完善粒',testItem:'5',result:'',principal:''},
					{testName:'生霉粒',testItem:'6',result:'',principal:''},
					{testName:'色泽气味(质量)',testItem:'7',result:'',principal:''},
					{testName:'硬度指数',testItem:'8',result:'',principal:''},
					{testName:'面筋吸水量',testItem:'9',result:'',principal:''},
					{testName:'脂肪酸值',testItem:'10',result:'',principal:''},
					{testName:'品尝评分值',testItem:'11',result:'',principal:''},
					{testName:'色泽气味(储存)',testItem:'12',result:'',principal:''},
					{testName:'真菌毒素(黄曲霉毒素B1)',testItem:'13',result:'',principal:''},
					{testName:'真菌毒素(脱氧雪腐镰刀菌烯醇)',testItem:'14',result:'',principal:''},
					{testName:'真菌毒素(玉米赤霉烯酮)',testItem:'15',result:'',principal:''},
					{testName:'重金属(铅)',testItem:'16',result:'',principal:''},
					{testName:'重金属(镉)',testItem:'17',result:'',principal:''},
					{testName:'重金属(汞)',testItem:'18',result:'',principal:''},
					{testName:'重金属(砷)',testItem:'19',result:'',principal:''},
			],
//	  "真菌毒素(黄曲霉毒素B1、脱氧雪腐、镰刀菌烯醇、玉米赤霉烯酮)","重金属(铅、镉、汞、砷)"	
    	
    }
  }
}
</script>

