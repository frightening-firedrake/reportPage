<template>
  <div class='listpagewrap' id="listpagewrap">
    <!--面包屑-->
    <sinograin-breadcrumb :breadcrumb="breadcrumb" v-on:searchingfor="searchingfor"></sinograin-breadcrumb>
    <!--标题-->
    <sinograin-option-title :title="subtitle" v-on:titleEvent="titleEvent"></sinograin-option-title>
    <div id="print" >
      <div class="handover_view" style="width:100%;">
        <div class="hand_view_title" style="width:100%;height:0.45rem;text-align:center;line-height:0.45rem;font-size:0.24rem;color:#333333;">
          <span>山西中储粮粮油质监中心</span>
        </div>
        <div class="hand_view_tab" style="">
          <div class="hand_view_tab_title" style="">
            <!--<p>{{formdatas.sort}}样品领取交接单</p>-->
            <p style="">{{formdatas.name}}</p>
          </div>
          <div class="hand_view_tab_num" style="">
            <p style="">编号:{{formdatas.nid>=10?formdatas.nid:'0'+formdatas.nid}}</p>
          </div>
          <el-row style="" class="hand_view_tab_content">
            <el-col style="height:auto;background-color:#fbfbfb;border-left:1px solid #dfdfdf;" :span="24" class="hand_view_tab_content_font">
              <el-col style="border-left:none;margin-left: -1px" :span="2">
                <span>检验项目:</span>
              </el-col>
              <el-col style="background-color:#fff;padding:0 5%;" :span="22">
                <span>{{formdatas.testList}}</span>
              </el-col>
            </el-col>
          </el-row>
          <el-row style="background-color:#fbfbfb;" class="hand_view_tabbody">
            <el-col style="" :span="6">
              <el-col style="" :span="8">
                <span>序号</span>
              </el-col>
              <el-col style="" :span="16">
                <span>检验编号</span>
              </el-col>
            </el-col>
            <el-col style=""  :span="6">
              <el-col style="" :span="8">
                <span>序号</span>
              </el-col>
              <el-col  style="" :span="16">
                <span>检验编号</span>
              </el-col>
            </el-col>
            <el-col style="" :span="6">
              <el-col style="" :span="8">
                <span>序号</span>
              </el-col>
              <el-col style="" :span="16">
                <span>检验编号</span>
              </el-col>
            </el-col>
            <el-col style="" :span="6">
              <el-col style="" :span="8">
                <span>序号</span>
              </el-col>
              <el-col style="" :span="16">
                <span>检验编号</span>
              </el-col>
            </el-col>
          </el-row>
          <el-row class="hand_view_tabbody" style="border-top:none;">
            <el-col :span="6" v-for="(item,index) in formdatas.testItemList" class='loopBorder' :key="index" style="border-top:1px solid #dfdfdf;">
              <el-col style="" :span="8">
                <span>{{index+1}}</span>
              </el-col>
              <el-col style="" :span="16">
                <span>监{{item}}</span>
              </el-col>
            </el-col>
            <el-col style="" :span="6" v-for="(item,index) in testItemListadd" class='loopBorder' :key="index+99999" style="border-top:1px solid #dfdfdf;">
              <el-col style="" :span="8">
                <span>{{index+formdatas.testItemList.length+1}}</span>
              </el-col>
              <el-col style="" :span="16">
                <span>&nbsp;</span>
              </el-col>
            </el-col>
            
          </el-row>

          <el-row style="" class="hand_view_tabbody">
            <el-col style="" :span="6">
              <el-col style="" :span="8">
                <span>领取人</span>
              </el-col>
              <el-col style="" :span="16">
                <span>&nbsp;</span>
              </el-col>
            </el-col>
            <el-col style="" :span="6">
              <el-col style="" :span="8">
                <span>归还人</span>
              </el-col>
              <el-col style="" :span="16">
                <span>&nbsp;</span>
              </el-col>
            </el-col>
            <el-col style="" :span="12">
              <el-col style="" :span="4">
                <span>备注</span>
              </el-col>
              <el-col style="" :span="20">
                <span>{{formdatas.remarks}}</span>
              </el-col>
            </el-col>
          </el-row>

          <el-row style="" class="hand_view_tabbody date">
            <el-col style="" :span="6">
              <el-col style="" :span="8">
                <span>领取日期</span>
              </el-col>
              <el-col style="" :span="16">
                <span>&nbsp;</span>
              </el-col>
            </el-col>
            <el-col style="" :span="6">
              <el-col style="" :span="8">
                <span>归还日期</span>
              </el-col>
              <el-col style="" :span="16">
                <span>&nbsp;</span>
              </el-col>
            </el-col>
            <el-col :span="12" class="loopBorder" style="border-left:1px solid #dfdfdf;">
              <el-col style="" :span="4">
                <span>&nbsp;</span>
              </el-col>
              <el-col style="" :span="20">
              	<el-col style="" :span="2">
              	
              	</el-col>
              	<el-col style="" :span="10">
              			<!--样品管理员：{{userName}}-->
              			样品管理员：
              	</el-col>
              	<el-col style="" :span="2">
              	
              	</el-col>
              	<el-col style="" :span="10">
              			时间：{{new Date()|data}}
              	</el-col>
                <!--<span> 样品管理员：{{formdatas.gly}} 时间： {{formdatas.time}}</span>-->
              </el-col>
            </el-col>
          </el-row>
        </div>
      </div>
      </div>
     <!--<div id='printbuttom' class="leading_out" @click="print()">-->
     <div id='printbuttom' class="leading_out" @click="leading_out()">
     <!--<div class="leading_out" @click="lodopPrint()">-->
        <!--<span>打印样品领取交接单</span>-->
        <span>导出样品领取交接单</span>
      </div>
    
  </div>
</template>

<style>
.doubleHeight{
	line-height: 1.2rem;
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
  },
  created() {
    console.log(this.$route.query)
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
    		if(!this.$_ault_alert('handover:expotHandover')){
					return
				}
				var id=this.$route.query.id;
				var loadiframe=document.getElementById('fordownload');
				var loadiframe2=document.getElementById('fordownload2');
				loadiframe.src=this.exportExcelURL+'?id='+id+'&sessionid='+this.Token;
				loadiframe2.src=this.exportExcelURL2+'?id='+id+'&sessionid='+this.Token;
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
  					id:this.$route.query.id
  			}
      }).then(function(response) {
//    	console.log(response.data)
      	this.formdatas.remarks=response.data.remark;//备注
//    	this.formdatas.gly="管理员"
      	this.formdatas.time=response.data.updateTime;//领取时间
      	this.formdatas.testList=this.findCheckeds(response.data.checkeds,response.data.sort);//检测项目
      	this.formdatas.nid=response.data.id;//编号
//    	this.formdatas.sort='麦子';//品种
      	this.formdatas.name=response.data.name;//品种
      	this.formdatas.testItemList=response.data.sampleNums.split(',');//检测样品
      	this.formdatas.testItemList.sort();//检测样品排序
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
  	findCheckeds(str,sort) {
			console.log(str,sort)
			var checkList=["容重","水分","杂质","矿物质","不完善粒","生霉粒","色泽气味(质量指标)","硬度指数","面筋吸水量","脂肪酸值","品尝评分值","色泽气味(储存品质指标)","真菌毒素(黄曲霉毒素B1)","真菌毒素(脱氧雪腐镰刀菌烯醇)","真菌毒素(玉米赤霉烯酮)","重金属(铅)","重金属(镉)","重金属(汞)","重金属(砷)"];	
	  		var res=[];
	  		var indexs=str.split(',');
	  		indexs=indexs.sort((a,b)=>{
	  			return a-b
	  		})
		  	indexs.forEach((item)=>{
		  		if(item){
		  			res.push(checkList[item-1])
		  		}	
		  	})
		  	var restr=res.join(',');
	  		if(restr=="容重,水分,杂质,矿物质,不完善粒,色泽气味(质量指标),硬度指数,面筋吸水量,品尝评分值,色泽气味(储存品质指标),真菌毒素(脱氧雪腐镰刀菌烯醇),重金属(铅),重金属(镉),重金属(汞),重金属(砷)"){
	  			return '全项目指标';
	  		}else if(restr=="容重,水分,杂质,不完善粒,生霉粒,色泽气味(质量指标),脂肪酸值,品尝评分值,色泽气味(储存品质指标),真菌毒素(黄曲霉毒素B1),真菌毒素(脱氧雪腐镰刀菌烯醇),真菌毒素(玉米赤霉烯酮),重金属(铅),重金属(镉),重金属(汞),重金属(砷)"){
	  			return '全项目指标';
	  		}else{
//	  			restr=restr.replace(/容重,水分,杂质\(矿物质\),不完善粒\(生霉粒\),色泽气味\(质量指标\)/, "质量指标全项目")
//	  			restr=restr.replace(/面筋吸水量,品尝评分值,色泽气味\(储存品质指标\)/, "储存品质指标全项目")
//	  			restr=restr.replace(/脂肪酸值,品尝评分值,色泽气味\(储存品质指标\)/, "储存品质指标全项目")
//	  			restr=restr.replace(/真菌毒素\(黄曲霉毒素B1、脱氧雪腐、镰刀菌烯醇、玉米赤霉烯酮\),重金属\(铅、镉、汞、砷\)/, "食品卫生指标全项目")
				if(sort=='小麦'){
					restr=restr.replace("容重,水分,杂质,矿物质,不完善粒,色泽气味(质量指标),硬度指数", "质量指标全项目")					
					restr=restr.replace("面筋吸水量,品尝评分值,色泽气味(储存品质指标)", "储存品质指标全项目")
					restr=restr.replace("真菌毒素(脱氧雪腐镰刀菌烯醇),重金属(铅),重金属(镉),重金属(汞),重金属(砷)", "食品卫生指标全项目")
				}else if(sort=='玉米'){
					restr=restr.replace("容重,水分,杂质,不完善粒,生霉粒,色泽气味(质量指标)", "质量指标全项目")					
					restr=restr.replace("脂肪酸值,品尝评分值,色泽气味(储存品质指标)", "储存品质指标全项目")
					restr=restr.replace("真菌毒素(黄曲霉毒素B1),真菌毒素(脱氧雪腐镰刀菌烯醇),真菌毒素(玉米赤霉烯酮),重金属(铅),重金属(镉),重金属(汞),重金属(砷)", "食品卫生指标全项目")
				}
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
      datalistURL: this.apiRoot +'/grain/handover/get',
      exportExcelURL: this.apiRoot +'/grain/handover/expotHandover',
      exportExcelURL2: this.apiRoot +'/grain/handover/expotStorageHandover',
      searchURL: '/liquid/role2/data/search',
      deleteURL: '/liquid/role2/data/delete',
      checkedId: [],
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
      formdatas: {
      	name:'',
        sort:'',//品种
        nid:'',//编号
        testList:'',//检测项目
        //检测样品
        testItemList:[
   
        ],
        remarks:'',
        gly:'',
        time:'',
      }
    }
  }
}
</script>

