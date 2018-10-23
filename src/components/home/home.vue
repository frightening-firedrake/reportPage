<template>
    <div class='listpagewrap home'>
    	<div class='banner'>
    		<ul>
    			<li v-for="item in banner" :style="item">
    			</li>
    		</ul>
    	</div>
    	<div class="mainwrap">
    		<div class="left">
    			<ul>
    				<li v-for="(item,index) in information">
    					<div class="liwrap">    						
    						<span class="icon" :style="styleLeft[index]"></span>
    						<p class="totalQuantity" :style="{color:styleLeft[index].backgroundColor}">
    							{{item.totalQuantity}}
    							<span>/万吨</span>
    						</p>
    						<p class="sort">
    							<b>{{item.sort}}</b>
    							—库存总量
    						</p>
    					</div>
    				</li>
    			</ul>
    		</div>
    		<div class="right">
    			<ul>
    				<li v-for="(item,index) in menu">
    					<div class="box" :style="styleRight[index]">
	    					<h3 class="title">
	    						{{item.title}}
	    					</h3>
	    					<p class="subtitle">
	    						{{item.subtitle}}
	    					</p>
    					</div>
    				</li>
    			</ul>
    		</div>
    	</div>
    </div>
</template>

<style>
.listpagewrap.home{
	padding-left:0;
	padding-right:0;
	/*border-top:1px solid rgba(0,0,0,0);*/
	background-color:rgba(241, 241, 241, 1);
}
.home .banner{
	border-top:0.3rem solid rgba(0,0,0,0);
	width:auto;
	/*height:4.2rem;*/
	height:50%;
	box-sizing: border-box;
}
.home .banner ul{
	width:100%;
	height:100%;
}
.home .banner ul li{
	width:100%;
	height:100%;
	background-size: cover;
	background-position:center;
	background-repeat: no-repeat;
}
.home .mainwrap{
	width:auto;
	/*height:auto;*/
	height:50%;
	border-bottom:0.3rem solid rgba(0,0,0,0);
}
.home .mainwrap .left{
	/*margin-top:0.2rem;*/
	border-top:0.2rem solid rgba(241,241,241,1);
	height:100%;
	box-sizing:border-box;
	float:left;
	width:40%;
	background-color:white;
	
}
.home .mainwrap .left ul{
	/*height:auto;*/
	height:100%;
	width:100%;
	padding:0 0.5rem;
}
.home .mainwrap .left ul li{
	/*height:1.53rem;*/
	/*height:1.4rem;*/
	height:33.3%;
	box-sizing:border-box;
	width:100%;
	border-top:1px dotted #878787;
	box-sizing: border-box;
	/*padding-top:0.315rem;*/
	/*padding-top:0.25rem;*/
	position:relative;
}
.home .mainwrap .left ul li:first-of-type{
	border-top:none;
}
.home .mainwrap .left ul li .liwrap{
	position:absolute;
	top:50%;
	left:0;
	right:0;
	height:0.9rem;
	margin-top:-0.45rem;
}
.home .mainwrap .left ul li span.icon{
	float:left;
	height:0.9rem;
	width:0.9rem;
	border-radius:0.06rem;
	background-repeat: no-repeat;
	background-position: center;
	background-size: 100%;
}
.home .mainwrap .left ul li p.totalQuantity{
	float:left;
	line-height:0.9rem;
	padding-left:0.17rem;
	font-size:0.48rem;
	letter-spacing: -2px;
}
.home .mainwrap .left ul li p.totalQuantity span{
	font-size:0.24rem;
	color:inherit;
}
.home .mainwrap .left ul li p.sort{
	float:right;
	line-height:0.9rem;
	font-size:0.24rem;
	color:rgb(140,140,140);
}
.home .mainwrap .left ul li p.sort b{
	color:rgb(65,65,65);
}
.home .mainwrap .right{
	float:left;
	width:60%;
	height:100%;
}
.home .mainwrap .right ul{
	/*height:auto;*/
	height:100%;
	width:100%;
}
.home .mainwrap .right ul li{ 
	/*height:2.4rem;*/
	/*height:2.1rem;*/
	height:50%;
	width:50%;
	/*padding-top:0.2rem;*/
	/*padding-left:0.2rem;*/
	border-top:0.2rem solid rgba(0,0,0,0);
	border-left:0.2rem solid rgba(0,0,0,0);
	box-sizing: border-box;
	float:left;
}
.home .mainwrap .right ul li .box{ 
	height:100%;
	width:100%;
	background-repeat: no-repeat;
	background-position: right bottom;
	background-size:auto 100%;
	padding-left:0.45rem;
}
.home .mainwrap .right ul li .box .title{ 
	padding-top:0.45rem;
	color: #1d4267;
	font-size:0.42rem;
}
.home .mainwrap .right ul li .box .subtitle{ 
	padding-top:0.35rem;
	color: #325375;
	font-size:0.18rem;
}
</style>

<script>
import SinograinList from '@/components/common/action/List.vue';
import "@/assets/style/index/home.css";
import { mapState,mapMutations,mapGetters,mapActions} from 'vuex';
//本地测试要用下面import代码
//import data from '@/util/mock';



export default {
  components: {
    SinograinList
  },
  computed:{
	...mapState(["mask"]),
	...mapGetters(["modal_id"]),
	
  },
  created(){
//  获取列表数据（第一页）
	this.getlistdata()
  },
  destroy(){

  },
  methods: {
  	...mapMutations(['close_modal']),
  	...mapActions(['addAction']),

//	获取数据方法
  	getlistdata(){
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
			    
			}
	    }).then(function (response) {
		  	this.information[0].totalQuantity=response.data.XMNumber?(response.data.XMNumber/10000).toFixed(2):'0.00';//小麦
		  	this.information[1].totalQuantity=response.data.YMNumber?(response.data.YMNumber/10000).toFixed(2):'0.00';//玉米
		  	this.information[2].totalQuantity=response.data.SYYNumber?(response.data.SYYNumber/10000).toFixed(2):'0.00';//食用油
		}.bind(this)).catch(function (error) {
		    console.log(error);
		}.bind(this));
  	},


  },
  data() {
    return {
      	datalistURL: this.apiRoot + '/grain/sample/getAllCereals',
      	banner:[
      		{backgroundImage:"url(static/images/index/welcome.png)"}
      	],
		information:[
			{
				totalQuantity:7.205,
				sort:'小麦',
			},
			{
				totalQuantity:7.205,
				sort:'玉米',
			},
			{
				totalQuantity:201893,
				sort:'食用油',
			},
		],
		styleLeft:[
			{backgroundColor:'#ff4c78',backgroundImage:"url(static/images/index/xiaomai.png)"},//小麦
			{backgroundColor:'#2dc0e8',backgroundImage:"url(static/images/index/yumi.png)"},//玉米
			{backgroundColor:'#ff9940',backgroundImage:"url(static/images/index/shiyongyou.png)"},//食用油
		],
		menu:[
			{
				title:'扦样',
				subtitle:'率先出发  填补行业空白',
			},
			{
				title:'入库',
				subtitle:'节约成本  流程一体化',
			},
			{
				title:'质检',
				subtitle:'质检信息  保密安全化',
			},
			{
				title:'汇总',
				subtitle:'提升效率  数据信息化',
			},
			
		],
		styleRight:[
			{backgroundColor:'#dbe6f0',backgroundImage:"url(static/images/index/card1.png)"},//扦样
			{backgroundColor:'#d7ebf1',backgroundImage:"url(static/images/index/card2.png)"},//入库
			{backgroundColor:'#f6eadf',backgroundImage:"url(static/images/index/card3.png)"},//质检
			{backgroundColor:'#d6ede7',backgroundImage:"url(static/images/index/card4.png)"},//汇总
		],
		
      
      
     
      
    }
  }
}
</script>