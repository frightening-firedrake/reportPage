<template>
    <div class='listpagewrap dataCollection'>
		<div class="number" v-if="datashow" > 	
			<div  class="box" v-for="(item,index) in numDataBg" :key="index" :style="{backgroundImage:'url('+item.bg+')'}">
				<p>{{numData[index].title}}</p>
				<div>{{numData[index].num}}</div>
			</div>
		</div>
    	
    	<div class="rowL2">
    		
    		<div class="right">
    			<div class="chartWrap3">
	    			<!-- <p class="title">
	    				<span>
	    					扫黑除恶案件行业领域占比
	    				</span>
	    			</p> -->
	    			<div class="chart3" id="chart3"></div>
    			</div>
    		</div>
    		<div class="left">
    			<div class="chartWrap1">
					<!-- <p class="title">
	    				<span>扫黑除恶案件数量质量统计表</span>
	    			</p> -->
	    			<div class="chart1" id="chart1">
	    				
	    			</div>
    			</div>
    			<div class="chartWrap2">
					<!-- <p class="title">
	    				<span>扫黑除恶案件行业领域统计表</span>
	    			</p> -->
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
	border-top:0.1rem solid rgba(241, 241, 241, 1);
	height:100%;
	/*padding-bottom:0.2rem;*/
	
}
.number{
	height: 20%;
	padding-top:20px ;
	padding-bottom:11px; 
	display: flex;
	 justify-content:center
}
.number .box{
	height: 100%;
	width: 19%;
	background-size: contain;
	background-repeat: no-repeat;
	
}
.number .box p{
	margin:.2rem .2rem 0; 
	font-size: .17rem ;
	color: #ffffff;

}
.number .box div{
	margin-left:.2rem ; 
	font-size: .5rem ;
	color: #ffffff;

}

.dataCollection .rowL2{
	padding-top:0.25rem;
	width:auto;
	height:80%;
	border-radius: 30px;
}
.dataCollection .rowL2 .right{
	float:right;
	height:100%;
	width:32%;
	padding-right:0.25rem;
	
}
.chartWrap3{
	border-top: 1px solid  #e4ebf1;
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


.dataCollection .rowL2 .left .chartWrap1{
	border-top: solid 1px #e4ebf1;
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
	/* padding-top:0.5rem; */
	border-top:solid 1px #e4ebf1;
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
	if(this.userId==1){
		// this.datalistURL1=this.apiRoot + 'information/findSumAndValidAll';
		this.datalistURL2=this.apiRoot + 'information/findAllInformerTypeAll';
		this.datalistURL3=this.apiRoot + '/information/findNumAll';
		this.datalistURL4=this.apiRoot + '/information/findAllRegionNum';
		this.datalistURL5=this.apiRoot + '/information/findRegionNum';

	}else{			
		// this.datalistURL1=this.apiRoot + 'information/findSumAndValid';
		this.datalistURL2=this.apiRoot + 'information/findAllInformerType';
		this.datalistURL3= this.apiRoot + '/information/findNum';
		this.datalistURL4=this.apiRoot + '/information/findAllRegionNum';
		this.datalistURL5=this.apiRoot + '/information/findRegionNum'

	}
	this.getlistdata()
	this.gatbroken()
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
  		var data={}
  		if(this.userId!==1){
  			data.userId=this.userId
  		}
		this.$http({
		    method: 'post',
			url: this.datalistURL3,
			transformRequest: [function (data) {
				// Do whatever you want to transform the data
				let ret = ''
				for (let it in data) {
				ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
				}
				return ret
			}],
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data: data
	    }).then(function (response) {
			console.log(response);
			console.log(response.data);
			this.numData[0].num = response.data.pendingNumber;
			this.numData[1].num = response.data.invalidNumber;
			this.numData[2].num = response.data.validNumber;
			this.numData[3].num = response.data.probingNumber;
			this.numData[4].num = response.data.endNumber;
			this.annulus.forEach((item,index)=>{
				item.sum = response.data.sum
				console.log(item.sum)
			})
			let black = response.data.sum - response.data.pendingNumber - response.data.invalidNumber;
			this.annulus[0]['value'] = black;
			this.annulus[1]['value'] = response.data.invalidNumber;
			this.annulus[2]['value'] = response.data.validNumber;
			this.annulus[3]['value'] = response.data.probingNumber;
			this.annulus[4]['value'] = response.data.endNumber;
			this.setChart2();
	    	this.datashow = true;
		}.bind(this)).catch(function (error) {
		    console.log(error);
		}.bind(this));
	  },   
	  gatbroken(){
		var data={}
  		if(this.userId!==1){
  			data.userId=this.userId
		  }
		this.$http({
		    method: 'post',
			url: this.datalistURL4,
			transformRequest: [function (data) {
				// Do whatever you want to transform the data
				let ret = ''
				for (let it in data) {
				ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
				}
				return ret
			}],
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data: data
	    }).then(function (response) {
			// reportSum : [20, 12, 11, 14, 9, 20, 10,15,5,23,5],
			// Black : [8, 5, 30, 18, 15, 20, 9, 15, 12, 3, 20],
			console.log("这是第一个");
			this.reportSum=this.cityName(response.data);
			this.setChart1();
	    	
		}.bind(this)).catch(function (error) {
		    console.log(error);
		}.bind(this));
		this.$http({
		    method: 'post',
			url: this.datalistURL5,
			transformRequest: [function (data) {
				// Do whatever you want to transform the data
				let ret = ''
				for (let it in data) {
				ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
				}
				return ret
			}],
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data: data
	    }).then(function (response) {
			console.log("这是第二个");
			console.log(response.data);
			this.Black=this.cityName(response.data);
			this.setChart1();
	    	
		}.bind(this)).catch(function (error) {
		    console.log(error);
		}.bind(this));
  	},
  	findAllInformerType(){
  		var data={}
  		if(this.userId!==1){
  			data.userId=this.userId
  		}
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
			data: data
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
	    	
	    	// this.setChart2();
    		this.setChart3();
		}.bind(this)).catch(function (error) {
		    console.log(error);
		}.bind(this));
	  },
	cityName(obj){
		let newObj = [];
		let city = ['TaiyuanNumber','DatongNumber','XinzhouNumber','LinfenNumber','YangquanNumber','ChangzhiNumber','JinchengNumber','ShuozhouNumber','JinzhongNumber','LvliangNumber','YunchengNumber']
		for(let item in city){
			newObj.push( parseInt(obj[city[item]] ) )
		}
		console.log(newObj)
		return newObj
	},
	setChart1() {
		let myChart=echarts.init(document.getElementById('chart1'));

		let city=this.city;
		let option = {
			title: {
				text: '扫黑除恶案件地域分布',
				x:'center',
				show:true,
				top : '0',
				textStyle: {
                    fontWeight: '500',
					fontSize: '16',
                },
			},
			legend: {
				data:['举报总数','黑恶案件'],
				x: 'right'
			},
			tooltip: {
				trigger: 'axis',
				backgroundColor:'#fff',
				padding:[13,18,13,18],
				textStyle:{
					color:'#333'
				},
				extraCssText: 'box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);'
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			
			xAxis: {
				type: 'category',
				boundaryGap: false,
				data: city,
				// axisLine: {
				// 	show: true
				// },
				splitLine: {
					show: true
				},
				axisTick: {
					show: true,
					alignWithLabel: true,
					lineStyle: {
						type: 'solid',
						color: '#ccc'
					}
				},
			},
			yAxis: {
				name:"案件/起",
				axisLine: {
					show: true
				},
				splitLine: {
					show: true,
					lineStyle: {
						type: 'solid',
						color: '#ccc'
					}
				},
				// 下标刻度
				axisTick: {
					show: true,
					lineStyle: {
						type: 'solid',
						color: '#ccc'
					}
				}
			},
			series: [
				{
					name:'举报总数',
					type:'line',
					// stack: '总量',
					data:this.reportSum,
					symbol:'circle',
					// symbolSize : 10,
					lineStyle: {
						normal: {
							color: '#2474bd',
							width : 1
						}	
					},
					itemStyle: {
						normal : {
							color: '#2474bd',
							borderWidth: 5,
							borderColor: '#2474bd',
						}
					},
				},
				{
					name:'黑恶案件',
					type:'line',
					symbol:'circle',
					// stack: '总量',
					data:this.Black,

					lineStyle: {
						normal:{
							width : 1,
							color: '#d6a85d',
						}
						
					},
					itemStyle: {
						normal : {
							color: '#d6a85d',
							borderWidth: 5,
							borderColor: '#d6a85d'
						},

						}
						
				},
        ]


		};


		myChart.setOption(option);
			
	},
setChart2() {
		let myChart = echarts.init(document.getElementById('chart2'));
		var data = this.annulus
		console.log('数据构建完成')
		
    var titleArr= [], seriesArr=[];
    var  colors=[['#d844d8', '#cacbcd'],['#e13d3e', '#cacbcd'],['#297ad5', '#cacbcd'], ['#20c26c', '#cacbcd'],['#20b8dd', '#cacbcd']]
    data.forEach(function(item, index){
        titleArr.push(
            {
                text:item.name,
                left: index * 20 + 10 +'%',
                top: '80%',
                textAlign: 'center',
                textStyle: {
                    fontWeight: 'normal',
                    fontSize: '12',
                    // color: colors[index][0],
                    textAlign: 'center',
                },
            }        
        );
        seriesArr.push(
            {
                name: item.name,
                type: 'pie',
                clockWise: false,
                radius: [40, 50],
                itemStyle:  {
                    normal: {
                        color: colors[index][0],
                        shadowColor: colors[index][0],
                        shadowBlur: 0,
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        },
                    }
                },
                hoverAnimation: false,
                center: [index * 20 + 10 +'%', '50%'],
                data: [{
                    value: item.value,
                    label: {
                        normal: {
                            // formatter: function(params){
							// 	console.log(params);
                            //     return params.value     +'%';
							// },
							
							 formatter: ((item.value/item.sum*100).toFixed(1))+ '%',
                            position: 'center',
                            show: true,
                            textStyle: {
                                fontSize: '20',
                                fontWeight: 'bold',
                                color: colors[index][0]
                            }
                        }
                    },
                }, {
                    value: item.sum-item.value,
                    name: 'invisible',
                    itemStyle: {
                        normal: {
                            color: colors[index][1]
                        },
                        emphasis: {
                            color: colors[index][1]
                        }
                    }
                }]
            }    
        )
	});
	console.log('zoudao zhe li l ')
	myChart.setOption({
		title:titleArr,

		series: seriesArr
	})
   
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
				left: 'center',
				show:true,
				top : '4%',
				textStyle: {
                    fontWeight: '500',
                    fontSize: '16',
                },
		    },
		    color:this.color,
			tooltip : {
		    	show:false,
		    	backgroundColor:'#ffffff',
		        extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
//		        alwaysShowContent:true,
		        textStyle:{
		        	color:'#333',
		        	fontSize:12, 
		        },
//		        trigger: 'item',
		        formatter: "{a} <br/>{b} : {d}%"
//		        formatter: function (params) {
//					console.log(params)
//		        }
			},
			// 文字部分
		    legend: {
//		        orient: 'vertical',
		        top: '45%',
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
			// 下载图片
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
		            radius : '40%',
		            center: ['50%', '25%'],
//		            selectedMode :'single',     
					label: {
			        	normal:{					        		
				        	show:false,
				        	position :'outside',
				        	formatter :'{d}%',
				        	color:'#333',
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
				        	lineStyle:{
				        		color:'#333',				        		
				        	}
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
		datalistURL3: this.apiRoot + '/information/findNum',


		
		numDataBg : [
			{bg :'static/images/data/databg1.png',  },   
			{bg :'static/images/data/databg2.png',  },   
			{bg :'static/images/data/databg3.png',  },   
			{bg :'static/images/data/databg4.png',  },   
			{bg :'static/images/data/databg5.png', },   
		],
		numData : [
			{title : '待审核的案件/起',num : '0'},
			{title : '未立案的案件/起',num : '0'},
			{title : '已接案的案件/起',num : '0'},
			{title : '侦办中的案件/起',num : '0'},
			{title : '已结案的案件/起',num : '0'}
		],
		city: ['太原', '大同', '忻州', '临汾', '阳泉', '长治', '晋城', '朔州', '晋中', '吕梁', '运城'],
		reportSum : [20, 12, 11, 14, 9, 20, 10,15,5,23,5],
		Black : [8, 5, 30, 18, 15, 20, 9, 15, 12, 3, 20],
		annulus:[
			{
				name: '黑恶势力占比',
				value: 30,
				sum :900
			},{
				name: '未立案案件占比',
				value: 44,
				sum :100
			},{
				name: '已接案案件占比',
				value: 35,
				sum :100
			},{
				name: '侦办中案件占比',
				value: 30,
				sum :100
			},{
				name: '已结案案件占比',
				value: 20,
				sum :1000
			},
		],
		datashow : false

    }
  }
}
</script>