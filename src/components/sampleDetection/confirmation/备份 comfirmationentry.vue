<template>
    <div class='listpagewrap'>
        <!--面包屑-->
        <sinograin-breadcrumb :breadcrumb="breadcrumb" v-on:searchingfor="searchingfor"></sinograin-breadcrumb>
        <!--标题-->
        <sinograin-option-title style='margin-bottom:0;' :title="subtitle"></sinograin-option-title>
        <!--按钮组-->
        <div class="buttons">
            <el-radio-group @change="statusChange" v-model="entryflag">
                <el-radio-button label="1" :class="{'active':entryflag==1}">手工录入</el-radio-button>
                <el-radio-button label="2" :class="{'active':entryflag==2}">批量导入</el-radio-button>
            </el-radio-group>
        </div>
        <!--列表实例-->
        <el-form class="entryform" v-if="entryflag==1">
        <el-row class="entrt">
            <el-col :span="colwidth[rescol].samplewidth" class="samplewidth">
                <el-col :span="colwidth[rescol].col1" class="col1">
                    <p>检验编号</p>
                </el-col>
                <el-col :span="colwidth[rescol].col2"  class="col2" style="border-bottom:none;">
                    <p v-if="rescol==0">{{this.findCheckPoint()}}</p>
                    <p v-if="rescol==1">{{this.$route.params.sort=='小麦'?'杂质':'不完善粒'}}</p>
                    <p v-if="rescol==2">{{暂无准确数据}}</p>
                    <p v-if="rescol==3">{{this.findCheckPoint()=='真菌毒素'?'黄曲霉毒素B1':'其中：铅'}}</p>
                </el-col>
                <el-col v-if="rescol>0" :span="colwidth[rescol].col2"  class="col2" style="border-bottom:none;">
                    <p v-if="rescol==1">{{this.$route.params.sort=='小麦'?'其中：矿物质':'其中：生霉粒'}}</p>
                	<p v-if="rescol==2">{{暂无准确数据}}</p>
                    <p v-if="rescol==3">{{this.findCheckPoint()=='真菌毒素'?'脱氧雪腐':'其中：镉'}}</p>
                </el-col>
                <el-col v-if="rescol>1" :span="colwidth[rescol].col2"  class="col2" style="border-bottom:none;">
                    <p v-if="rescol==2">{{暂无准确数据}}</p>
                    <p v-if="rescol==3">{{this.findCheckPoint()=='真菌毒素'?'镰刀菌烯醇':'其中：汞'}}</p>
                </el-col>
                <el-col v-if="rescol>2" :span="colwidth[rescol].col2"  class="col2" style="border-bottom:none;">
                    <p v-if="rescol==3">{{this.findCheckPoint()=='真菌毒素'?'玉米赤霉烯酮':'其中：砷'}}</p>
                </el-col>
                <el-col :span="colwidth[rescol].col3" class="col3">
                    <p>负责人</p>
                </el-col>
                <el-col :span="colwidth[rescol].col3"  class="col4">
                    <p>操作</p>
                </el-col>
            </el-col>
            
            <el-col v-if="rescol<2" :span="colwidth[rescol].samplewidth" class="samplewidth">
                <el-col :span="colwidth[rescol].col1" class="col1">
                    <p>检验编号</p>
                </el-col>
                <el-col :span="colwidth[rescol].col2"  class="col2" style="border-bottom:none;">
                    <p v-if="rescol==0">{{this.findCheckPoint()}}</p>
                    <p v-if="rescol==1">{{this.$route.params.sort=='小麦'?'杂质':'不完善粒'}}</p>
                </el-col>
                <el-col v-if="rescol>0" :span="colwidth[rescol].col2"  class="col2" style="border-bottom:none;">
                    <p v-if="rescol==1">{{this.$route.params.sort=='小麦'?'其中：矿物质':'其中：生霉粒'}}</p>
                </el-col>
                
                <el-col :span="colwidth[rescol].col3" class="col3">
                    <p>负责人</p>
                </el-col>
                <el-col :span="colwidth[rescol].col3"  class="col4">
                    <p>操作</p>
                </el-col>
            </el-col>
            
            <el-col v-if="rescol<1" :span="colwidth[rescol].samplewidth" class="samplewidth">
                <el-col :span="colwidth[rescol].col1" class="col1">
                    <p>检验编号</p>
                </el-col>
                <el-col :span="colwidth[rescol].col2" class="col2" style="border-bottom:none;">
                    <p>{{this.findCheckPoint()}}</p>
                </el-col>
                <el-col :span="colwidth[rescol].col3" class="col3">
                    <p>负责人</p>
                </el-col>
                <el-col :span="colwidth[rescol].col3" class="col4">
                    <p>操作</p>
                </el-col>
            </el-col>
            
        </el-row>
            <el-row style="border-right:none;">
                <el-col class="samplewidth" :span="colwidth[rescol].samplewidth" v-for="(item,index) in tabledatas" :key="item.id" style="border-right:1px solid rgb(230, 231, 231);">
                    <el-col class="col1" :span="colwidth[rescol].col1" style="border-left:none;">
                        <p>监{{item.sampleNum}}</p>
                    </el-col>
                    <el-col class="col2" :span="colwidth[rescol].col2" style="border-bottom:none;">
                        <el-input class="import_input" v-model="item.result"></el-input>
                    </el-col>
                    <el-col v-if="rescol>0" class="col2" :span="colwidth[rescol].col2" style="border-bottom:none;">
                        <el-input class="import_input" v-model="item.result2"></el-input>
                    </el-col>
                    <el-col v-if="rescol>1" class="col2" :span="colwidth[rescol].col2" style="border-bottom:none;">
                        <el-input class="import_input" v-model="item.result3"></el-input>
                    </el-col>
                    <el-col v-if="rescol>2" class="col2" :span="colwidth[rescol].col2" style="border-bottom:none;">
                        <el-input class="import_input" v-model="item.result4"></el-input>
                    </el-col>
                    <el-col class="col3" :span="colwidth[rescol].col3">
                        <p>{{userName}}</p>
                    </el-col>
                    <el-col class="col4" :span="colwidth[rescol].col3">
                        <a @click="deleSample(item.id)">删除</a>
                    </el-col>
                </el-col>
                
                <el-col class="samplewidth" :span="colwidth[rescol].samplewidth" style="border-right:1px solid rgb(230, 231, 231);">
                    <el-col class="col1" :span="colwidth[rescol].col1" style="border-left:none;">
                        <a class="add" @click="addstample">+检验编号</a>
                    </el-col>
                    <el-col class="col2" :span="colwidth[rescol].col2" style="border-bottom:none;">
                    </el-col>
                    <el-col v-if="rescol>0" class="col2" :span="colwidth[rescol].col2" style="border-bottom:none;">
                    </el-col>
                    <el-col v-if="rescol>1" class="col2" :span="colwidth[rescol].col2" style="border-bottom:none;">
                    </el-col>
                    <el-col v-if="rescol>2" class="col2" :span="colwidth[rescol].col2" style="border-bottom:none;">
                    </el-col>
                    <el-col class="col3" :span="colwidth[rescol].col3">
                    </el-col>
                    <el-col class="col4" :span="colwidth[rescol].col3">
                    </el-col>
                </el-col>
                
                <el-col class="samplewidth" v-if="tabledatas.length%3<2&&rescol==0" :span="8" style="border-right:1px solid rgb(230, 231, 231);">
                    <el-col class="col1" :span="6" style="border-left:none;">
                    </el-col>
                    <el-col class="col2" :span="8" style="border-bottom:none;">
                    </el-col>
                    <el-col class="col3" :span="5">
                    </el-col>
                    <el-col class="col4" :span="5">
                    </el-col>
                </el-col>
                <el-col class="samplewidth" v-if="tabledatas.length%3==0&&rescol==0" :span="8" style="border-right:1px solid rgb(230, 231, 231);">
                    <el-col class="col1" :span="6" style="border-left:none;">
                    </el-col>
                    <el-col class="col2" :span="8" style="border-bottom:none;">
                    </el-col>
                    <el-col class="col3" :span="5">
                    </el-col>
                    <el-col class="col4" :span="5">
                    </el-col>
                </el-col>
                
                <el-col class="samplewidth" v-if="tabledatas.length%2==0&&rescol==1" :span="12" style="border-right:1px solid rgb(230, 231, 231);">
                    <el-col class="col1" :span="4" style="border-left:none;">
                    </el-col>
                    <el-col class="col2" :span="6" style="border-bottom:none;">
                    </el-col>
                    <el-col class="col2" :span="6" style="border-bottom:none;">
                    </el-col>
                    <el-col class="col3" :span="4">
                    </el-col>
                    <el-col class="col4" :span="4">
                    </el-col>
                </el-col>
                
            </el-row>
        </el-form>
        <div class="filein entryform" v-else-if="entryflag==2">
        	
        	<el-row class="entrt">
            <el-col :span="colwidth[rescol].samplewidth" class="samplewidth">
                <el-col :span="colwidth[rescol].col1" class="col1">
                    <p>检验编号</p>
                </el-col>
                <el-col :span="colwidth[rescol].col2"  class="col2" style="border-bottom:none;">
                    <p v-if="rescol==0">{{this.findCheckPoint()}}</p>
                    <p v-if="rescol==1">{{this.$route.params.sort=='小麦'?'杂质':'不完善粒'}}</p>
                    <p v-if="rescol==2">{{暂无准确数据}}</p>
                    <p v-if="rescol==3">{{this.findCheckPoint()=='真菌毒素'?'黄曲霉毒素B1':'其中：铅'}}</p>
                </el-col>
                <el-col v-if="rescol>0" :span="colwidth[rescol].col2"  class="col2" style="border-bottom:none;">
                    <p v-if="rescol==1">{{this.$route.params.sort=='小麦'?'其中：矿物质':'其中：生霉粒'}}</p>
                	<p v-if="rescol==2">{{暂无准确数据}}</p>
                    <p v-if="rescol==3">{{this.findCheckPoint()=='真菌毒素'?'脱氧雪腐':'其中：镉'}}</p>
                </el-col>
                <el-col v-if="rescol>1" :span="colwidth[rescol].col2"  class="col2" style="border-bottom:none;">
                    <p v-if="rescol==2">{{暂无准确数据}}</p>
                    <p v-if="rescol==3">{{this.findCheckPoint()=='真菌毒素'?'镰刀菌烯醇':'其中：汞'}}</p>
                </el-col>
                <el-col v-if="rescol>2" :span="colwidth[rescol].col2"  class="col2" style="border-bottom:none;">
                    <p v-if="rescol==3">{{this.findCheckPoint()=='真菌毒素'?'玉米赤霉烯酮':'其中：砷'}}</p>
                </el-col>
                <el-col :span="colwidth[rescol].col3" class="col3">
                    <p>负责人</p>
                </el-col>
                <el-col :span="colwidth[rescol].col3"  class="col4">
                    <p>操作</p>
                </el-col>
            </el-col>
            
            <el-col v-if="rescol<2" :span="colwidth[rescol].samplewidth" class="samplewidth">
                <el-col :span="colwidth[rescol].col1" class="col1">
                    <p>检验编号</p>
                </el-col>
                <el-col :span="colwidth[rescol].col2"  class="col2" style="border-bottom:none;">
                    <p v-if="rescol==0">{{this.findCheckPoint()}}</p>
                    <p v-if="rescol==1">{{this.$route.params.sort=='小麦'?'杂质':'不完善粒'}}</p>
                </el-col>
                <el-col v-if="rescol>0" :span="colwidth[rescol].col2"  class="col2" style="border-bottom:none;">
                    <p v-if="rescol==1">{{this.$route.params.sort=='小麦'?'其中：矿物质':'其中：生霉粒'}}</p>
                </el-col>
                
                <el-col :span="colwidth[rescol].col3" class="col3">
                    <p>负责人</p>
                </el-col>
                <el-col :span="colwidth[rescol].col3"  class="col4">
                    <p>操作</p>
                </el-col>
            </el-col>
            
            <el-col v-if="rescol<1" :span="colwidth[rescol].samplewidth" class="samplewidth">
                <el-col :span="colwidth[rescol].col1" class="col1">
                    <p>检验编号</p>
                </el-col>
                <el-col :span="colwidth[rescol].col2" class="col2" style="border-bottom:none;">
                    <p>{{this.findCheckPoint()}}</p>
                </el-col>
                <el-col :span="colwidth[rescol].col3" class="col3">
                    <p>负责人</p>
                </el-col>
                <el-col :span="colwidth[rescol].col3" class="col4">
                    <p>操作</p>
                </el-col>
            </el-col>
            
        </el-row>
            <el-row style="border-right:none;">
                <el-col class="samplewidth" :span="colwidth[rescol].samplewidth" v-for="(item,index) in tabledatas2" :key="item.id" style="border-right:1px solid rgb(230, 231, 231);">
                    <el-col class="col1" :span="colwidth[rescol].col1" style="border-left:none;">
                        <p>监{{item.sampleNum}}</p>
                    </el-col>
                    <el-col class="col2" :span="colwidth[rescol].col2" style="border-bottom:none;">
                        <el-input class="import_input" v-model="item.result"></el-input>
                    </el-col>
                    <el-col v-if="rescol>0" class="col2" :span="colwidth[rescol].col2" style="border-bottom:none;">
                        <el-input class="import_input" v-model="item.result2"></el-input>
                    </el-col>
                    <el-col v-if="rescol>1" class="col2" :span="colwidth[rescol].col2" style="border-bottom:none;">
                        <el-input class="import_input" v-model="item.result3"></el-input>
                    </el-col>
                    <el-col v-if="rescol>2" class="col2" :span="colwidth[rescol].col2" style="border-bottom:none;">
                        <el-input class="import_input" v-model="item.result4"></el-input>
                    </el-col>
                    <el-col class="col3" :span="colwidth[rescol].col3">
                        <p>{{userName}}</p>
                    </el-col>
                    <el-col class="col4" :span="colwidth[rescol].col3">
                        <a @click="deleSample2(item.sampleNum)">删除</a>
                    </el-col>
                </el-col>
                
                
                
                <el-col class="samplewidth" v-if="tabledatas2.length%3>0&&rescol==0" :span="8" style="border-right:1px solid rgb(230, 231, 231);">
                    <el-col class="col1" :span="6" style="border-left:none;">
                    </el-col>
                    <el-col class="col2" :span="8" style="border-bottom:none;">
                    </el-col>
                    <el-col class="col3" :span="5">
                    </el-col>
                    <el-col class="col4" :span="5">
                    </el-col>
                </el-col>
                <el-col class="samplewidth" v-if="tabledatas2.length%3==1&&rescol==0" :span="8" style="border-right:1px solid rgb(230, 231, 231);">
                    <el-col class="col1" :span="6" style="border-left:none;">
                    </el-col>
                    <el-col class="col2" :span="8" style="border-bottom:none;">
                    </el-col>
                    <el-col class="col3" :span="5">
                    </el-col>
                    <el-col class="col4" :span="5">
                    </el-col>
                </el-col>
                
                <el-col class="samplewidth" v-if="tabledatas2.length%2==1&&rescol==1" :span="12" style="border-right:1px solid rgb(230, 231, 231);">
                    <el-col class="col1" :span="4" style="border-left:none;">
                    </el-col>
                    <el-col class="col2" :span="6" style="border-bottom:none;">
                    </el-col>
                    <el-col class="col2" :span="6" style="border-bottom:none;">
                    </el-col>
                    <el-col class="col3" :span="4">
                    </el-col>
                    <el-col class="col4" :span="4">
                    </el-col>
                </el-col>
                
            </el-row>
        	
            <div class="filein_box" v-if="!tabledatas2.length">
            	<template v-if="daoru">
	                <img class="importicon" :src="importicon" alt="" />
	                <p class="message">请点击“导入文件”按钮导入文件</p>
            		<div class="btnswrap">
            			<span class="btnl" @click="download">下载模板</span>
            			<el-upload class="btnr" 
            				:action="uploadURL" 
            				:headers="{'Authorization':Token}"  
            				:show-file-list="false"
				  			:on-success="readdata"				
            				>
		                                     导入文件
		                </el-upload>
            		</div>
            	</template>
            	<template v-else>
	                <img class="importicon" :src="importicon2" alt="" />
	                <p class="message" style="margin:0.25rem 0 0.3rem;">该检验项目暂未开放批量导入功能</p>
	                <p class="message2">敬请期待</p>
            		
            	</template>

                
            </div>
        </div>
        <div class="leading_out entry_out" @click="submit" v-if="entryflag==1">
            <!--<div class="leading_out" @click="lodopPrint()">-->
            <!--<span>打印样品领取交接单</span>-->
            <span>提交检测数据</span>
        </div>
        <div class="leading_out entry_out" @click="submitimport" v-if="entryflag==2&&tabledatas2.length">
            <span>提交检测数据</span>
        </div>
        <div style="margin-right:0.4rem;" class="leading_out white entry_out" v-if="entryflag==2&&tabledatas2.length">
            <!--<span>重新导入</span>-->
            <el-upload class="importbtn" 
				:action="uploadURL" 
				:headers="{'Authorization':Token}"  
				:show-file-list="false"
	  			:on-success="readdata"				
				>
                                 重新导入
            </el-upload>
        </div>
    </div>
</template>
<style lang="scss">
.listpagewrap {
    .entrt {
        /*padding-right:0.18rem;*/
        background-color: #ffe7b8;
        .samplewidth {
            line-height: 0.5rem;
            text-align: center;
            height: 0.5rem;
            /*border-right:1px solid white;*/
            color: #000000;
            &:last-child{
                border-right:none;
            }
            /*.el-col-6 {*/
                p {
                    font-size: 0.18rem;
                }
            /*}*/
        }
    }
    .entry_out {
        float: right;
    }
    .filein {
        width: 100%;
        height: 6.2rem;
        border: 1px solid #e6e7e7;
        position: relative;
        .filein_box {
            width: 6.04rem;
            height: 3.51rem;
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            top: 0.5rem;
            margin: auto;
            border: 1px solid #e6e7e7;
            .importicon {
                width: 2rem;
                height: 1.4rem;
                margin:0.4rem auto 0.1rem;
                display: block;
            }
            .message{
            	font-size:0.2rem;
            	color:#666;
            	text-align: center;
            	margin-bottom:0.4rem;
            }
            .message2{
            	font-size:0.2rem;
            	color:#2d82e2;
            	text-align: center;
            	line-height:0.35rem;
            }
            .btnswrap{
            	height:0.35rem;
            	width:100%;
            	text-align:center;
            	.btnl{
            		height:0.35rem;
            		line-height: 0.35rem;
            		width:1.26rem;
            		text-align: center;
            		color:#58b481;
            		border:1px solid #58b481;
            		background-color:white;
            		margin:0 0.1rem;
            		border-radius: 0;
                	display: inline-block;
                	cursor:pointer;
            	}
            	.btnr{
            		height:0.35rem;
            		line-height: 0.35rem;
            		width:1.26rem;
            		text-align: center;
            		color:white;
            		border:1px solid #58b481;
            		background-color:#58b481;
            		margin:0 0.1rem;
            		border-radius: 0;
                	display: inline-block;
                	cursor:pointer;
            	}
            	.el-upload:focus{
            		color:white;
            	}
            }
            .upload-demo {
                position: absolute;
                left: 0;
                right: 0;
                bottom: 0.5rem;
                .el-upload {
                    display: block;
                    margin: 0 auto;
                    .el-button {
                        width: 1.25rem;
                        height: 0.35rem;
                        background-color: #58b481;
                        font-size: 0.18rem;
                        border-color: transparent;
                    }
                }
            }
        }
    }
    .entryform {
        height: 5rem;
        border: 1px solid #e6e7e7;
        overflow-y: scroll;
        .el-row {
            height: 0.5rem;
            border-right: 1px solid #e6e7e7;
            .samplewidth {
                border-bottom: 1px solid #e6e7e7;
                height: 0.5rem;
                &:first-child{
                    .el-col-6:first-child{
                        border-left:none;
                    }
                }
                .col1,.col2,.col3,.col4 {
                    height: 0.5rem;
                    text-align: center;
                    line-height: 0.5rem;
                    border-left: 1px solid #e6e7e7;
                    .add {
                        color: #58b481;
                    }
                    p {
                        font-size: 0.16rem;
                        height: 100%;
                    }
                    a {
                        color: #d22424;
                        font-size: 0.16rem;
                        cursor: pointer;
                    }
                    .el-form-item {
                        height: 100%;
                        padding: 0.09rem 0.17rem 0.09rem 0.16rem;
                        margin: 0;
                        .el-form-item__content {
                            /*width: 1rem;*/
                            height: 0.3rem;
                            .el-input {
                                width: 100%;
                                height: 100%;
                                input {
                                    width: 100%;
                                    height: 100%;
                                    background-color: #f9f9f9;
                                    vertical-align: top;
                            		border-radius:0;
                					font-size: 0.16rem;
                					text-align: center;
                					padding:0;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

.buttons {
    height: 0.55rem;
    line-height: 0.55rem;
    .el-radio-group {
        .el-radio-button {
            width: 1.7rem;
            height: 0.3rem;
            border-radius: 5px;
            border: 1px solid #d5d5d5;
            text-align: center;
            overflow: hidden;
            &:last-child {
                margin-left: 0.1rem;
            }
            &.active {
                border-color: #2d82e2;
                .el-radio-button__inner {
                    color: white;
                    background-color: #2d82e2;
                    &:hover {
                        color: white;
                    }
                }
            }
            .el-radio-button__inner {
                border: none;
                width: 100%;
                height: 100%;
                font-size: 0.16rem;
                line-height: 1.5;
                padding: 0;
                &:hover {
                    color: #606266;
                }
            }
        }
    }
}
.import_input{
	padding: 0.09rem 0.17rem 0.09rem 0.16rem;
	width:100%;
	height:100%;
	font-size:0.16rem;
	text-align: center;
}
.import_input input {
    width: 100%;
    height: 100%;
    background-color: #f9f9f9;
    vertical-align: top;
	border-radius:0;
	font-size: 0.16rem;
	text-align: center;
    padding:0;
}
.double.el-input{
    width: 47%!important;
}
.importbtn{
	border: 1px solid #58b481;
    line-height:0.25rem;
    border-radius: 0.04rem;
    padding: 0 0.2rem;
    font-weight: 500;
    text-align:center;
    width:100%;
    height:100%;
    display:block;
}
.importbtn .el-upload:focus{
	color:inherit;
}
</style>
<script>
import SinograinBreadcrumb from '@/components/common/action/Breadcrumb.vue';
import SinograinOptionTitle from "@/components/common/action/OptionTitle";
import { mapState,mapMutations,mapGetters,mapActions} from 'vuex';
export default {
    components: { SinograinBreadcrumb, SinograinOptionTitle },
    computed:{
		...mapGetters(["Token","userName"]),
		tabledatasEdit(){
			
		}
    },
    created(){
    	this.setUploadURL();
    	if(this.$route.params.tabledatas){    		
    		this.tabledatas=this.$route.params.tabledatas;
    	}
    	if(!this.$route.params.sort){
			this.$router.push({name:"样品检测/样品确认单列表"})		
		}
    	if(this.$route.params.checkPoint==3&&this.$route.params.sort=='小麦'){
			this.rescol=1;	
		}
    	if(this.$route.params.checkPoint==4&&this.$route.params.sort=='玉米'){
			this.rescol=1;	
		}
    	if(this.$route.params.checkPoint==10||this.$route.params.checkPoint==11){
			this.rescol=3;	
		}
    	
    },
    data() {
        return {
        	importicon:'static/images/comfirmationentry/importicon.png',
        	importicon2:'static/images/comfirmationentry/importicon2.png',
        	uploadURL:'',
        	downloadURL:this.apiRoot + '/grain/download/downloadTemplate',
        	submitURL:this.apiRoot +'/grain/testItem/save',
            entryflag: 1,
            double:false,
            daoru:false,
            checkPoint:'',
            sort:'',
            complete:true,
            datamap1:'',
            datamap2:'',
            templateName:'',
            breadcrumb: {
                search: false,
                searching: '',
            },
            subtitle: {
            	name:'录入'+this.$route.params.sort+this.findCheckPoint()+'检测数据',
                btn: false,
                btntext: '',
            },
            tabledatas:[
//          	{sampleNum:2018010001,result:'我是数据',result2:'我是数据2',fzr:'李建波',id:1},

            ],
            tabledatas2:[

            ],
//          计划写个控制列宽分列显示的对象
			colwidth:[
				{samplewidth:8,col1:6,col2:8,col3:5},
				{samplewidth:12,col1:4,col2:6,col3:4},
				{samplewidth:24,col1:3,col2:5,col3:3},
				{samplewidth:24,col1:4,col2:4,col3:2},
			],
//			默认为0
			rescol:0,
        }
    },
    methods: {
		findCheckPoint() {
			var num=this.$route.params.checkPoint;
			var sort=this.$route.params.sort;
//			var checkList=["容重","水分","杂质(矿物质)","不完善粒(生霉粒)","色泽气味(质量指标)","面筋吸水量","脂肪酸值","品尝评分值","色泽气味(储存品质指标)","真菌毒素(黄曲霉毒素B1、脱氧雪腐、镰刀菌烯醇、玉米赤霉烯酮)","重金属(铅、镉、汞、砷)"];	
			var checkList1=["容重","水分","杂质","不完善粒(生霉粒)","色泽气味(质量)","面筋吸水量","脂肪酸值","品尝评分值","色泽气味(品质)","真菌毒素","重金属"];	
			var checkList2=["容重","水分","杂质(矿物质)","不完善粒","色泽气味(质量)","面筋吸水量","脂肪酸值","品尝评分值","色泽气味(品质)","真菌毒素","重金属"];	
//  		uploadURL
			if(sort=='玉米'){
				return checkList1[num-1]
			}else if(sort=='小麦'){
				return checkList2[num-1]
			}else{
				return '未获取到品种信息'
			}
		},
        searchingfor() {

        },
        addstample(){
        	var params={};
        		params.checkPoint=this.$route.params.checkPoint;
        		params.sort=this.$route.params.sort;
        		params.searching=this.$route.params.taskName?this.$route.params.taskName:this.$route.params.searching;
        		params.tabledatas=this.tabledatas;
//      		if(this.$route.params.searching){
//					params.searching=this.$route.params.searching
//				}
    		var path=this.$route.name+'/添加检验编号'
           	this.$router.push({ name: path,params:params})
//         this.$router.push({ path: '/index/sampleDetection/confirmationList/comfirmationentry/addsample',query:{checkPoint:this.$route.params.checkPoint}})
        },
        statusChange() {
//          if (this.entryflag == 2) {
//              this.entryflag = 1
//          } else {
//              this.entryflag = 2
//          }
        },
        deleSample(id){
        	this.$confirm('此操作将删除该样品, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.tabledatas=this.tabledatas.filter((value,index)=>{
	        		return value.id!==id;
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
        deleSample2(sampleNum){
        	this.$confirm('此操作将删除该样品, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.tabledatas2=this.tabledatas2.filter((value,index)=>{
	        		return value.sampleNum!==sampleNum;
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
        download(){
        	
        	var loadiframe=document.getElementById('fordownload');
//			loadiframe.src=this.downloadURL+'?fileName='+this.templateName+'&sessionid='+this.Token;
			loadiframe.src=this.downloadURL+this.templateName+'?sessionid='+this.Token;
        },
        setUploadURL(){
    		var num=this.$route.params.checkPoint;
    		var sort=this.$route.params.sort;
    		this.checkPoint=num;
    		this.sort=sort;
    		if(num==2){
    			this.daoru=true;
           		this.double=false;
    			this.uploadURL=this.apiRoot + '/grain/import/importExcelSF';
//  			this.templateName='水分模板';
    			this.templateName='SF';
    			this.datamap1='pingjunzhi';
//  			this.downloadURL=this.apiRoot + '/grain/export/downloadSF';
    		}else if(num==3){
    			if(sort=="玉米"){
    				this.double=false;
//  				this.uploadURL=this.apiRoot + '/grain/import/importExcelBWSLYM';    			
//  				this.downloadURL=this.apiRoot + '/grain/export/downloadBWSLYM';
    				this.datamap1='';
    			}else{
    				this.double=true;
//  				this.uploadURL=this.apiRoot + '/grain/import/importExcelBWSLXM';    			
//  				this.downloadURL=this.apiRoot + '/grain/export/downloadBWSLXM';
    				this.datamap1='';
    				this.datamap2='';
    			}
    			this.daoru=false;
    		}else if(num==4){
    			if(sort=="玉米"){
           			this.double=true;
    				this.uploadURL=this.apiRoot + '/grain/import/importExcelBWSLYM';    			
//  				this.templateName='不完善粒（玉米）模板'
    				this.templateName='BWSLYM'
//  				this.downloadURL=this.apiRoot + '/grain/export/downloadBWSLYM';
    				this.datamap1='buwanshanli_pingjunzhi';
    				this.datamap2='shengmeili_pingjunzhi';
    			}else{
           			this.double=false;
    				this.uploadURL=this.apiRoot + '/grain/import/importExcelBWSLXM';    			
//  				this.templateName='不完善粒（小麦）模板'
    				this.templateName='BWSLXM'
//  				this.downloadURL=this.apiRoot + '/grain/export/downloadBWSLXM';
    				this.datamap1='buwanshanli_pingjunzhi';
    			}
    			this.daoru=true;
    		}else if(num==6){
    			this.daoru=true;
           		this.double=false;
    			this.uploadURL=this.apiRoot + '/grain/import/importExcelMJXS'; 			
//  			this.templateName='面筋吸水量模板'
    			this.templateName='MJXSL'
//  			this.downloadURL=this.apiRoot + '/grain/export/downloadMJXS';
    			this.datamap1='pingjunzhi_ganmianjinzhiliang';
    		}else if(num==7){
    			this.daoru=true;
           		this.double=false;
    			this.uploadURL=this.apiRoot + '/grain/import/importExcelZFSZ';    			
//  			this.templateName='脂肪酸值模板'
    			this.templateName='ZFSZ'
//  			this.downloadURL=this.apiRoot + '/grain/export/downloadZFSZ';
    			this.datamap1='pingjunzhi';
    		}else{
    			this.daoru=false;
           		this.double=false;
    			this.uploadURL='';
    			this.downloadURL='';
    			this.datamap1='';
    		}
    	},
    	submit(){
    		if(!this.tabledatas.length){
				this.$alert('请添加检验编号','提示信息',{type: 'warning'});
				return
			}
    		
    		
    		var data;
    		if(this.checkPoint==3){
    			data=this.tabledatas.map((value)=>{
	    			var obj={};
	    			obj.testItem=this.checkPoint+'.1';
//	    			obj.sampleId=value.id;
    				obj.sampleNum=value.sampleNum;
	    			obj.result=value.result;
	    			obj.principal=this.userName;
	    			return obj
	    		})
    			if(this.sort=='小麦'){    				
	    			var data2=this.tabledatas.map((value)=>{
		    			var obj={};
		    			obj.testItem=this.checkPoint+'.2';
//		    			obj.sampleId=value.id;
    					obj.sampleNum=value.sampleNum;
		    			obj.result=value.result2;
		    			obj.principal=this.userName;
		    			return obj
		    		})
	    			data=data.concat(data2)
    			}
    		}else if(this.checkPoint==4){
    			data=this.tabledatas.map((value)=>{
	    			var obj={};
	    			obj.testItem=this.checkPoint+'.1';
//	    			obj.sampleId=value.id;
    				obj.sampleNum=value.sampleNum;
	    			obj.result=value.result;
	    			obj.principal=this.userName;
	    			return obj
	    		})
    			if(this.sort=='玉米'){
	    			var data2=this.tabledatas.map((value)=>{
		    			var obj={};
		    			obj.testItem=this.checkPoint+'.2';
//		    			obj.sampleId=value.id;
    					obj.sampleNum=value.sampleNum;
		    			obj.result=value.result2;
		    			obj.principal=this.userName;
		    			return obj
		    		})
	    			data=data.concat(data2)    				
    			}
    		}else if(this.checkPoint==10||this.checkPoint==11){
    			data=this.tabledatas.map((value)=>{
	    			var obj={};
	    			obj.testItem=this.checkPoint+'.1';
//	    			obj.sampleId=value.id;
    				obj.sampleNum=value.sampleNum;
	    			obj.result=value.result;
	    			obj.principal=this.userName;
	    			return obj
	    		})

    			var data2=this.tabledatas.map((value)=>{
	    			var obj={};
	    			obj.testItem=this.checkPoint+'.2';
//	    			obj.sampleId=value.id;
    				obj.sampleNum=value.sampleNum;
	    			obj.result=value.result2;
	    			obj.principal=this.userName;
	    			return obj
	    		})
    			data=data.concat(data2)  
    			
    			var data3=this.tabledatas.map((value)=>{
	    			var obj={};
	    			obj.testItem=this.checkPoint+'.3';
//	    			obj.sampleId=value.id;
    				obj.sampleNum=value.sampleNum;
	    			obj.result=value.result3;
	    			obj.principal=this.userName;
	    			return obj
	    		})
    			data=data.concat(data3)
    			
    			var data4=this.tabledatas.map((value)=>{
	    			var obj={};
	    			obj.testItem=this.checkPoint+'.4';
//	    			obj.sampleId=value.id;
    				obj.sampleNum=value.sampleNum;
	    			obj.result=value.result4;
	    			obj.principal=this.userName;
	    			return obj
	    		})
    			data=data.concat(data4)

    		}else{
    			data=this.tabledatas.map((value)=>{
	    			var obj={};
	    			obj.testItem=this.checkPoint;
//	    			obj.sampleId=value.id;
    				obj.sampleNum=value.sampleNum;
	    			obj.result=value.result;
		    		obj.principal=this.userName;
	    			return obj
	    		})
    		}
			this.complete=true;
    		
    		data.forEach((value)=>{
    			if(!value.result){
					this.complete=false;
//					break;
				}
    		})
    		if(!this.complete){
				this.$alert('请完善检验结果！！！','提示信息',{type: 'warning'});
    			return
    		}
    		this.$http({
				method: 'post',
				url: this.submitURL,
				transformRequest: [function (data) {
					let ret = ''
					for (let it in data) {
					ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
					}
					return ret
				}],
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				data: {
				   	params:JSON.stringify(data)			    	
				}
			}).then(function(response) {
				if(response.data.success){
					this.$router.push({name:'样品检测/样品确认单列表'})
				}else{
					this.$notify.error({
			          	title: '录入失败',
			          	message: '请重新核对检验数据！！！',
			        });
				}
			}.bind(this)).catch(function(error) {
				console.log(error);
			}.bind(this));
	
    	},
//  	读取导入数据的方法，字段乱七八糟的好恶心，我先去吐会儿。。。
    	readdata(response,file,fileList){

    		if(!this.datamap1){
    			return
    		}
    		var mapfiled1=this.datamap1;//
    		var mapfiled2=this.datamap2;
    		var rawdata=response.filter((value)=>{
    			return value.sampleNum
    		})
    		var data=rawdata.map((value)=>{
    			var obj={};
    			obj.sampleNum=value.sampleNum.startsWith('监')?value.sampleNum.slice(1):value.sampleNum;
    			obj.result=value[mapfiled1];
    			if(mapfiled2){
    				obj.result2=value[mapfiled2];   				
    			}
//  			obj.id=value.sampleNum;
    			obj.principal=this.userName;
	    		return obj
    		})
    		console.log(data)
    		this.tabledatas2=data
    	},
    	submitimport(){
    		if(!this.tabledatas2.length){
				this.$alert('请先导入模板数据','提示信息',{type: 'warning'});
				return
			}
    		
    		
    		var data;
    		if(this.checkPoint==3){
    			data=this.tabledatas2.map((value)=>{
	    			var obj={};
	    			obj.testItem=this.checkPoint+'.1';
//	    			obj.sampleId=value.id;
	    			obj.sampleNum=value.sampleNum.indexOf('监')!==-1?value.sampleNum.slice(1):value.sampleNum;
	    			obj.result=value.result;
	    			obj.principal=this.userName;
	    			return obj
	    		})
    			if(this.sort=='小麦'){    				
	    			var data2=this.tabledatas2.map((value)=>{
		    			var obj={};
		    			obj.testItem=this.checkPoint+'.2';
//		    			obj.sampleId=value.id;
	    				obj.sampleNum=value.sampleNum.indexOf('监')!==-1?value.sampleNum.slice(1):value.sampleNum;
		    			obj.result=value.result2;
		    			obj.principal=this.userName;
		    			return obj
		    		})
	    			data=data.concat(data2)
    			}
    		}else if(this.checkPoint==4){
    			data=this.tabledatas2.map((value)=>{
	    			var obj={};
	    			obj.testItem=this.checkPoint+'.1';
//	    			obj.sampleId=value.id;
	    			obj.sampleNum=value.sampleNum.indexOf('监')!==-1?value.sampleNum.slice(1):value.sampleNum;
	    			obj.result=value.result;
	    			obj.principal=this.userName;
	    			return obj
	    		})
    			if(this.sort=='玉米'){
	    			var data2=this.tabledatas2.map((value)=>{
		    			var obj={};
		    			obj.testItem=this.checkPoint+'.2';
//		    			obj.sampleId=value.id;
	    				obj.sampleNum=value.sampleNum.indexOf('监')!==-1?value.sampleNum.slice(1):value.sampleNum;
		    			obj.result=value.result2;
		    			obj.principal=this.userName;
		    			return obj
		    		})
	    			data=data.concat(data2)    				
    			}
    		}else if(this.checkPoint==10||this.checkPoint==11){
    			data=this.tabledatas2.map((value)=>{
	    			var obj={};
	    			obj.testItem=this.checkPoint+'.1';
//	    			obj.sampleId=value.id;
	    			obj.sampleNum=value.sampleNum.indexOf('监')!==-1?value.sampleNum.slice(1):value.sampleNum;
	    			obj.result=value.result;
	    			obj.principal=this.userName;
	    			return obj
	    		})

    			var data2=this.tabledatas2.map((value)=>{
	    			var obj={};
	    			obj.testItem=this.checkPoint+'.2';
//	    			obj.sampleId=value.id;
	    			obj.sampleNum=value.sampleNum.indexOf('监')!==-1?value.sampleNum.slice(1):value.sampleNum;
	    			obj.result=value.result2;
	    			obj.principal=this.userName;
	    			return obj
	    		})
    			data=data.concat(data2)  
    			
    			var data3=this.tabledatas2.map((value)=>{
	    			var obj={};
	    			obj.testItem=this.checkPoint+'.3';
//	    			obj.sampleId=value.id;
	    			obj.sampleNum=value.sampleNum.indexOf('监')!==-1?value.sampleNum.slice(1):value.sampleNum;
	    			obj.result=value.result3;
	    			obj.principal=this.userName;
	    			return obj
	    		})
    			data=data.concat(data3)
    			
    			var data4=this.tabledatas2.map((value)=>{
	    			var obj={};
	    			obj.testItem=this.checkPoint+'.4';
//	    			obj.sampleId=value.id;
	    			obj.sampleNum=value.sampleNum.indexOf('监')!==-1?value.sampleNum.slice(1):value.sampleNum;
	    			obj.result=value.result4;
	    			obj.principal=this.userName;
	    			return obj
	    		})
    			data=data.concat(data4)

    		}else{
    			data=this.tabledatas2.map((value)=>{
	    			var obj={};
	    			obj.testItem=this.checkPoint;
//	    			obj.sampleId=value.id;
	    			obj.sampleNum=value.sampleNum.indexOf('监')!==-1?value.sampleNum.slice(1):value.sampleNum;
	    			obj.result=value.result;
		    		obj.principal=this.userName;
	    			return obj
	    		})
    		}
			this.complete=true;
    		
    		data.forEach((value)=>{
    			if(!value.result){
					this.complete=false;
//					break;
				}
    		})
    		if(!this.complete){
				this.$alert('请完善检验结果！！！','提示信息',{type: 'warning'});
    			return
    		}
    		this.$http({
				method: 'post',
				url: this.submitURL,
				transformRequest: [function (data) {
					let ret = ''
					for (let it in data) {
					ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
					}
					return ret
				}],
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				data: {
				   	params:JSON.stringify(data)			    	
				}
			}).then(function(response) {
				if(response.data.success){
					this.$router.push({name:'样品检测/样品确认单列表'})
				}else{
					this.$notify.error({
			          	title: '录入失败',
			          	message: '请重新核对检验编号！！！',
			        });
				}
			}.bind(this)).catch(function(error) {
				console.log(error);
			}.bind(this));
	
    	},
    },
   
}
</script>