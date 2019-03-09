<template>
    <div class='listpagewrap dataCollection'>
    	
    	<div class="rowL2">
    		
    		<div class="right">
    			<div class="chartWrap3">
	    			<p class="title">
	    				<span>
	    					扫黑除恶案件行业领域占比
	    				</span>
	    			</p>
	    			<div class="chart3" id="chart3"></div>
    			</div>
    		</div>
    		<div class="left">
    			<div class="chartWrap1">
					<p class="title">
	    				<span>扫黑除恶案件数量质量统计表</span>
	    			</p>
	    			<div class="chart1" id="chart1">
	    				
	    			</div>
    			</div>
    			<div class="chartWrap2">
					<p class="title">
	    				<span>扫黑除恶案件行业领域统计表</span>
	    			</p>
	    			<div class="chart2" id="chart2">
	    				
	    			</div>
    			</div>
    		</div>
    	</div>
    </div>
</template>

<style>
.listpagewrap.dataCollection{
	padding-left:0;
	padding-right:0;
	/*border-top:1px solid rgba(0,0,0,0);*/
	/*background-color:rgba(241, 241, 241, 1);*/
	background:#fdfdfd;
	border-top:0.4rem solid rgba(241, 241, 241, 1);
	height:100%;
	/*padding-bottom:0.2rem;*/
}

.dataCollection .rowL2{
	padding-top:0.25rem;
	width:auto;
	height:100%;
}
.dataCollection .rowL2 .right{
	float:right;
	height:100%;
	width:32%;
	padding-right:0.25rem;
}
.dataCollection .rowL2 .right .chart3{
	padding-top:0.5rem;
	border-left:solid 1px #e4ebf1;
	border-right:solid 1px #e4ebf1;
	border-bottom:solid 1px #e4ebf1;
	background-color: #ffffff;
	padding:0.07rem 0.22rem 0;
	/*min-height:100%;*/
	height:100%;
}

.dataCollection .rowL2 .left{
	/*height:6.05rem;*/
	/*height:6.1rem;*/
	height:100%;
	overflow: hidden;
	padding:0 0.25rem;
}
.dataCollection .rowL2 .left .chart1{
	padding-top:0.5rem;
	border-left:solid 1px #e4ebf1;
	border-right:solid 1px #e4ebf1;
	border-bottom:solid 1px #e4ebf1;
	background-color: #ffffff;
	/*padding-bottom:0.2rem;*/
	min-height:100%;
}
.dataCollection .rowL2 .left .chart2{
	padding-top:0.5rem;
	border-left:solid 1px #e4ebf1;
	border-right:solid 1px #e4ebf1;
	border-bottom:solid 1px #e4ebf1;
	background-color: #ffffff;

	min-height:100%;
}
.dataCollection .title{
	height:0.48rem;
	line-height:0.48rem;
	border:1px solid #e4ebf1;
	background-color: #f6f5f8;
	box-sizing: content-box;
	padding-left:0.22rem;
	position:absolute;
	top:0;
	left:0;
	right:0;
}
.dataCollection .title span{
	font-size:0.2rem;
	padding-left:0.23rem;
	border-left:3px solid #5278d5;
	color: #333333;
	position:relative;
}
.dataCollection .title span i{
	width: 0.12rem;
	height: 0.12rem;
	border-radius: 50%;
	background-color: #fa8564;
	box-shadow: 0px 0px 7px 0px 
		rgba(250, 133, 100, 0.35);
	border: solid 0.01 #ffffff;
	position:absolute;
	top:0.06rem;
	right:-0.16rem;
}
.chartWrap1{
	height:60%;
	position:relative;
	padding-bottom:0.2rem;
}
.chartWrap2{
	height:40%;
	position:relative;
	padding-bottom:0.2rem;
}
.chartWrap3{
	height:100%;
	position:relative;
	padding-bottom:0.2rem;
}
</style>

<script>
import SinograinList from '@/components/common/action/List.vue';
//import "@/assets/style/index/home.css";
import { mapState,mapMutations,mapGetters,mapActions} from 'vuex';
//本地测试要用下面import代码
//import data from '@/util/mock';
// 引入基本模板
let echarts = require('echarts/lib/echarts')
// 引入折线图图组件
require('echarts/lib/chart/line')
// 引入柱状图组件
require('echarts/lib/chart/bar')
// 引入柱饼图组件
require("echarts/lib/chart/pie");
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require("echarts/lib/component/legend")
require("echarts/lib/component/title");
require("echarts/lib/component/dataZoom");
require("echarts/lib/component/toolbox");


export default {
  components: {
    SinograinList
  },
  computed:{
	...mapState(["mask"]),
	...mapGetters(["modal_id","userId"]),
	
  },
  created(){
//  获取列表数据（第一页）
	this.getlistdata()
	this.findAllInformerType()
  },
  destroy(){

  },
  mounted() {
//  this.setChart1();
//  this.setChart2();
//  this.setChart3();
  },
  methods: {
  	...mapMutations(['close_modal']),
  	...mapActions(['addAction']),
//	获取数据方法
  	getlistdata(){
		this.$http({
		    method: 'post',
			url: this.datalistURL1,
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
				userId:this.userId,
			}
	    }).then(function (response) {
	    	var arr_sum=[];
	    	var arr_validNumber=[];
	    	response.data.forEach((value)=>{
	    		var obj_sum=[];
	    		var obj_validNumber=[];
	    		obj_sum[0]=value.createTime;
	    		obj_sum[1]=value.sum;
	    		obj_validNumber[0]=value.createTime;
	    		obj_validNumber[1]=value.validNumber;
	    		arr_sum.push(obj_sum);
	    		arr_validNumber.push(obj_validNumber);
	    	})
			this.sum=arr_sum;
      		this.validNumber=arr_validNumber;
    		this.setChart1();
		}.bind(this)).catch(function (error) {
		    console.log(error);
		}.bind(this));
  	},
  	findAllInformerType(){
  		this.$http({
		    method: 'post',
			url: this.datalistURL2,
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
				userId:this.userId,
			}
	   }).then(function (response) {
	    	this.industryData[0].value=response.data.GJZZAQNumber;
	    	this.industryData[1].value=response.data.JCZQNumber;
	    	this.industryData[2].value=response.data.ZZSLCBNumber;
	    	this.industryData[3].value=response.data.ZDCQNumber;
	    	this.industryData[4].value=response.data.JSGCNumber;
	    	this.industryData[5].value=response.data.QXBSNumber;
	    	this.industryData[6].value=response.data.HDDNumber;
	    	this.industryData[7].value=response.data.FFGLFDNumber;
	    	this.industryData[8].value=response.data.CSMJJFNumber;
	    	this.industryData[9].value=response.data.JWHSHNumber;	  
	    	
	    	this.industryData[10].value=response.data.DJGMNumber;	    	
	    	this.industryData[11].value=response.data.HESLBHSNumber;	    	
	    	this.industryData[12].value=response.data.LDJYNumber;	    	
	    	this.industryData[13].value=response.data.JJFZNumber;	    	
	    	this.industryData[14].value=response.data.GSHZSNumber;	    	
	    	this.industryData[15].value=response.data.KHZRNumber;	    	
	    	this.industryData[16].value=response.data.WLWXNumber;	    	
	    	
	    	this.setChart2();
    		this.setChart3();
		}.bind(this)).catch(function (error) {
		    console.log(error);
		}.bind(this));
  	},
	setChart1() {
	    let myChart = echarts.init(document.getElementById('chart1'))
	    var lastdata=this.sum[this.sum.length-1][0]
	    var dataNow=new Date();//今天
	    var dataLast=new Date(lastdata);//数据最后一天
		var oneDay = 24 * 3600 * 1000;//一天毫秒
//		var datastart = new Date(dataNow-oneDay*7);//默认最后7天
		var datastart = new Date(dataLast-oneDay*7);//默认最后7天
	    myChart.setOption({
	        title: {
		        text: '扫黑除恶案件数量质量统计表',
		        show:false,
		    },
		    color:['#2474bd','#dba85b'],
		    tooltip: {
		        trigger: 'axis',
		        backgroundColor:'#ffffff',
		        extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
//		        alwaysShowContent:true,
		        textStyle:{
		        	color:'#333'
		        },
		        formatter: function (params) {
		        	var str2="<div><p><span style='color:#333;'>"+params[0].data[0]+"</span></p><p>&nbsp;&nbsp;&nbsp;总数：<span style='color:"+params[0].color+";'>"+params[0].data[1]+"起</span></p><p>有效数：<span style='color:"+params[1].color+";'>"+params[1].data[1]+"起</span></p><p>有效率：<span style='color:#2abb03;'>"+Math.round(params[1].data[1]/params[0].data[1]*100)+"%</span></p><p style='text-align:center;'><span style='color:#333;'>"+params[0].name+"</span></p></div>";
		            return str2;
		        },
		        padding:[5,10,5,10],
		    },
		    legend: {
		    	top:20,
//		    	bottom:25,
		        data:['扫黑除恶接警总数','扫黑除恶接警有效数']
		    },
		    grid: {
//		        left: '80',
//		        right: '85',
//		     	bottom: '80',
		     	left: '100',
		        right: '105',
		     	bottom: '80',
//		      	containLabel: true
		    },
		    toolbox: {
		    	orient:'vertical',
		        feature: {
		            mark: {show: true},
		            dataView: {
		            	show: true,
		            	readOnly: false,
		            	optionToContent: function(opt) {
						    var axisData = opt.series[0].data;
						    var series = opt.series;
						    var table = '<table style="width:100%;text-align:center"><tbody><tr>'
						                 + '<td>时间</td>'
						                 + '<td>' + series[0].name + '</td>'
						                 + '<td>' + series[1].name + '</td>'
						                 + '<td>有效率</td>'
						                 + '</tr>';
						    for (var i = 0, l = axisData.length; i < l; i++) {
						        table += '<tr>'
						                 + '<td>' + axisData[i][0] + '</td>'
						                 + '<td>' + series[0].data[i][1] + '起</td>'
						                 + '<td>' + series[1].data[i][1] + '起</td>'
						                 + '<td>' + Math.round(series[1].data[i][1]/series[0].data[i][1]*100) + '%</td>'
						                 + '</tr>';
						    }
						    table += '</tbody></table>';
						    return table;
						},
						contentToOption:function(a,b){
//							console.log(a,b)
						},
		            },
//		            magicType: {show: true, type: ['line', 'bar','tiled']},
//		            magicType: {show: true, 
//		            	type: ['line', 'bar',]
//		            },
		            restore: {show: true},
		            saveAsImage: {show: true}
		        },
//		        itemGap:20, 
//		        top:50,
//		        right:30,
		        itemGap:20, 
		        top:15,
		        right:30,
		    },
		    xAxis: {
		    	type: 'time',
//		        boundaryGap: false,
//		        boundaryGap: [3600 * 24 * 1000, 3600 * 24 * 1000],
//		        min:'dataMin',
//				min: function(value) {
//				    return value.min - 3600 * 24 * 1000;
//				},
//				max: function(value) {
//				    return value.max + 3600 * 24 * 1000;
//				},
				minInterval: 3600 * 24 * 1000,
		        axisLabel:{
			        formatter: function (value, index) {
			        	var date = new Date(value);
		    			var time=date.getFullYear()+'年\n'+(date.getMonth() + 1)+'月'+date.getDate()+'日';
					    return time;
					},		        	
		        },
		    },
		    yAxis: {
		        type: 'value'
		    },
		    dataZoom: [
		    	{
			        type: 'inside',
			        start: 0,
//			        startValue:datastart,
			        end: 100,
//			        minValueSpan:3600 * 24 * 1000 * 7,
			    }, 
			    {
			        start: 0,
			        end: 10,
			        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
			        handleSize: '80%',
			        handleStyle: {
			            color: '#fff',
			            shadowBlur: 3,
			            shadowColor: 'rgba(0, 0, 0, 0.6)',
			            shadowOffsetX: 2,
			            shadowOffsetY: 2
			        },
			        labelFormatter: function (value) {
					    var date = new Date(value);
		    			var time=date.getFullYear()+'年\n'+(date.getMonth() + 1)+'月'+date.getDate()+'日';
					    return time;
					}
		    	}
			],
		    series: [
		        {
		            name:'扫黑除恶接警总数',
		            type:'line',
		            data:this.sum
		        },
		        {
		            name:'扫黑除恶接警有效数',
		            type:'line',
		            data:this.validNumber
		        },
		       
		    ]
		});	    
	},
setChart2() {
	    let myChart = echarts.init(document.getElementById('chart2'))
		var xAxisData=this.industryData.map((item)=>{
	    	return item.name
	    })
//	    var xAxisData=['国家政治安全', '黄赌毒', '欺行霸市', '基层政治', '征地拆迁', '插手民间纠纷', '宗族势力村霸', '非法高利放贷、暴力讨债', '建设工程运输、矿产、渔业', '境外黑社会']
//	    var xAxisData=['国家政治\n安全', '基层政治', '宗族势力\n村霸', '征地拆迁', '建设工程\n运输、矿\n产、渔业', '欺行霸市', '黄赌毒', '非法高利\n放贷、暴\n力讨债', '插手民间\n纠纷', '境外黑\n社会','盗掘古墓\n走私文物','黑恶势力\n保护伞','垄断经营\n逃税漏税\n敲诈勒索','以经济发\n展、志愿\n慈善捐款\n为幌子从\n事非法活\n动','以公司\n合作社等\n形式\n掩盖违法\n犯罪行为','恐吓滋扰\n聚众造势\n等软暴力','网络威胁\n恐吓侮辱\n诽谤滋扰']
	    var color=this.color
		var data=this.industryData
	    myChart.setOption({
	        title: {
		        text: '扫黑除恶案件数量质量统计表',
		        show:false,
		    },
		    tooltip: {
		    	show:true,
//		    	trigger: 'axis',
		        backgroundColor:'#ffffff',
		        extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
//		        alwaysShowContent:true,
		        textStyle:{
		        	color:'#333',
		        	fontSize:13, 
		        },
		    	
		    },
		    legend: {
		    	show:false,
//		    	top:25,
//		    	bottom:25,
//		        data:['扫黑除恶接警总数','扫黑除恶接警有效数']
		    },
		    grid: {
		    	top:'15',
		        left: '80',
		        right: '85',
//		     	bottom: '45',
		     	bottom: '10',
		//      containLabel: true
		    },
		    toolbox: {
		    	orient:'vertical',
		    	show:true,
		        feature: {
		            mark: {show: true},
		            saveAsImage: {show: true}
		        },
		        itemGap:20, 
		        top:15,
		        right:30,
		    },
		    xAxis: {
		    	type: 'category',
		    	show: false,
//		        boundaryGap: false,
				axisTick:{
					show:false,
				},
		        axisLabel:{
		        	align:'center',
		        	rotate:80,
		        	interval:0,
			        formatter: function (value, index) {
			        	var str='';
			        	var arr=value.split('')
			        	for (var i=0;i<arr.length;i++){
			        		if((i!==0)&&(i%3==0)){
//			        			console.log(i)
			        			str+=value[i]+"\n"
			        		}else{
			        			str+=value[i];
			        		}
			        	}
//					    return str;
					    return value;
					},		        	
		        },
		        data: xAxisData
		    },
		    yAxis: {
		        type: 'value'
		    },
		    
		    series: [
		        {
		        	type:'bar',
		        	name:'扫黑除恶案件数量质量统计表',
		        	label: {
			        	normal:{					        		
				        	show:true,
				        	formatter :function(params){
				        		var value=params.value!=0?params.value:'';
				        		return value
				        	},
				        	position:'top',
				        	distance :5,
				        	color:'#333333',
				        	align:'center',
			        	}
			        },
			        itemStyle:{
			        	normal:{					        		
			        		color:function(params){
			        			return color[params.dataIndex]
			        		},
			        	}
			       	},
		            data:data,
		        },
		    ]
		});
	},
	
	setChart3() {
	    let myChart = echarts.init(document.getElementById('chart3'))
	    var xAxisData=this.industryData.map((item)=>{
	    	return item.name
	    })
//		var xAxisData=['国家政治安全', '基层政治','宗族势力村霸','征地拆迁','建设工程运输、矿产、渔业','欺行霸市','黄赌毒','非法高利放贷、暴力讨债','插手民间纠纷','境外黑社会']
		var data=this.industryData
	    myChart.setOption({
	        title : {
		        text: '扫黑除恶案件行业领域占比',
		        show:false
		    },
		    color:this.color,
			tooltip : {
		    	show:false,
		    	backgroundColor:'#ffffff',
		        extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
//		        alwaysShowContent:true,
		        textStyle:{
		        	color:'#333',
		        	fontSize:13, 
		        },
//		        trigger: 'item',
		        formatter: "{a} <br/>{b} : {d}%"
//		        formatter: function (params) {
//					console.log(params)
//		        }
		    },
		    legend: {
//		        orient: 'vertical',
//		        top: '50%',
		        bottom: 0,
		        left: 0,
		        right: 0,
		        itemWidth :14,
		        itemHeight :14,
		        data: xAxisData,
		        itemGap:10,
//		        selectedMode :false,
		        formatter: function (name) {
					return name
//				    return "\t"+name+"\t\t\t\t36%";
				}
		    },
		    toolbox: {
		    	orient:'vertical',
		    	show:true,
		        feature: {
		            mark: {show: true},
		            saveAsImage: {show: true}
		        },
		        itemGap:20, 
		        top:40,
		        right:20,
		    },
		    series : [
		        {
		            name: '扫黑除恶案件行业领域占比',
		            type: 'pie',
//		            stillShowZeroSum:false, 
		            radius : '55%',
		            center: ['50%', '32%'],
//		            selectedMode :'single',
		            
					label: {
			        	normal:{					        		
				        	show:false,
				        	position :'outside',
				        	formatter :'{d}%',
				        	fontSize:13, 
			        	},
			        	emphasis:{
				        	show:true,
			        	},
			        },
			        labelLine:{
			        	normal:{					        		
				        	show:true,
				        	length1:10,
				        	length2:5,
			        	},
			        },
		            data:data,
		            itemStyle: {
		                emphasis: {
		                    shadowBlur: 10,
		                    shadowOffsetX: 0,
		                    shadowColor: 'rgba(0, 0, 0, 0.5)'
		                }
		            }
		        }
		    ]
		});
	},
  },
  data() {
    return {
	    color:['#70abec','#dff0f9','#a2eef5','#edc688','#c2d89d','#a6a2f5','#c4ebd8','#ffdb6a','#ffe7c1','#f5b5a2','#a5defd','#ebc4ea','#f2b2c7','#e9ed88','#d3cefc','#f5d9a2','#fba46f'],   	
    	industryData:[
            {value : 0,name:'国家政治安全'},
            {value : 0,name:'基层政权'},
            {value : 0,name:'宗族势力、村霸'},
            {value : 0,name:'征地、拆迁'},
            {value : 0,name:'建设工程、运输、矿产、渔业'},
            {value : 0,name:'欺行霸市'},
		    {value : 0,name:'黄赌毒'},
		    {value : 0,name:'非法高利放贷、暴力讨债'},
		    {value : 0,name:'插手民间纠纷'},
		    {value : 0,name:'境外黑社会'},
		    {value : 0,name:'盗掘古墓、倒卖走私文物'},
		    {value : 0,name:'黑恶势力保护伞'},
		    {value : 0,name:'垄断经营、逃税漏税、敲诈勒索'},
		    {value : 0,name:'以经济发展、志愿慈善捐款为幌子从事非法活动'},
		    {value : 0,name:'以公司、合作社等形式掩盖违法犯罪行为'},
		    {value : 0,name:'恐吓、滋扰、聚众造势等软暴力'},
		    {value : 0,name:'网络威胁、恐吓、侮辱诽谤、滋扰'},
        ],
    	datalistURL1: this.apiRoot + 'information/findSumAndValid',
      	datalistURL2: this.apiRoot + 'information/findAllInformerType',
    }
  }
}
</script>