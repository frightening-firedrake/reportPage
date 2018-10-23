<template>
    <div class="listpagewrap quality">
        <!--面包屑-->
        <sinograin-breadcrumb :breadcrumb="breadcrumb"></sinograin-breadcrumb>
        <!--标题-->
        <sinograin-option-title :title="subtitle"></sinograin-option-title>
        <!--按钮组-->
        <div class="buttons">
            <el-radio-group v-model="show">
                <el-radio-button  label="1" :class="{'active':show==1}">质检验收统计表</el-radio-button>
                <el-radio-button  label="2" :class="{'active':show==2}">质检验收统计图</el-radio-button>
            </el-radio-group>
        </div>
        <!--下拉框组件-->
        <CommonSelect @_select="_select" @close="close"></CommonSelect>
        <!--表格-->
        <template v-if="show==1">
            <!--正式内容-->
            <p class="tableName">
                {{title}}
            </p>
            <QualityTab :items="items" class="complex" :tabledata="tabledatas" :showheader="showheader" :title="title" :loading="loading" :key="iskey"></QualityTab>
            <!--导出按钮-->
            <TfootButtons :tfbtns="tfbtns" @tfootEvent="tfootEvent" v-if="isenter"></TfootButtons>
        </template>
        <!--图表-->
        <template v-if="show==2">
            <QualityChart :charts="charts" :key="iskey"></QualityChart>
        </template>
    </div>
</template>
<style lang="scss">
.quality {
    .tfootbtns {
        .btntfoot {
            width: 2.76rem;
            padding-top: 0.03rem;
            span {
                width: 100%;
                display: inline-block;
            }
        }
    }
    .tableName {
        /*border-radius: 0.1rem 0.1rem 0 0;*/
        border-right: solid 1px #ccc;
        border-left: solid 1px #ccc;
        height: 0.6rem;
        line-height: 0.6rem;
        color: rgb(0, 0, 0);
        font-size: 0.2rem;
        background-color: rgba(242, 242, 242, 1);
        /*padding-left: 0.4rem;*/
        text-align: center;
    }
    .option_title {
        border-bottom: none;
        margin-bottom: 0;
    }
    .buttons {
        height: 0.55rem;
        line-height:0.55rem;
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
}



/*.el-main {
    .complex {
        .el-table__body-wrapper {
            overflow-y: scroll !important;
        }
    }
}*/
</style>
<script>
import SinograinBreadcrumb from '@/components/common/action/Breadcrumb.vue';
import SinograinOptionTitle from "@/components/common/action/OptionTitle";
import CommonSelect from "@/components/common/action/Select";
import QualityTab from "@/components/testReport/Quality/QualityTab"
import TfootButtons from "@/components/common/action/TfootButtons"
import QualityChart from "@/components/testReport/Quality/QualityChart"
import { mapState,mapMutations,mapGetters,mapActions} from 'vuex';

import "@/assets/style/common/list.css"
//本地测试要用下面import代码
//import data from '@/util/mock';
export default {
    components: {
        SinograinBreadcrumb, SinograinOptionTitle, CommonSelect, QualityTab, TfootButtons, QualityChart
    },
    computed:{
	...mapGetters(["Token"]),

	},
    created() {
        // this.getlistdata(1)
        // this.getChart()
    },
    methods: {
        // // 获取图表的数据
        // getChart() {
        //     this.$http({
        //         method: 'post',
        //         url: this.chartURL,
        //         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        //         data: {

        //         }
        //     }).then(function(res) {
        //         console.log(res)
        //         this.charts = res.data
        //     }.bind(this))
        // },
        // //	获取列表数据方法
        // getlistdata(page) {
        //     this.loading = true;
        //     // 获取列表数据（第？页）
        //     this.$http({
        //         method: 'post',
        //         url: this.datalistURL,
        //         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        //         data: {

        //         }
        //     }).then(function(response) {
        //         this.tabledatas = response.data.rows;

        //         setTimeout(() => {
        //             this.loading = false;
        //         }, 1000)
        //     }.bind(this)).catch(function(error) {
        //         console.log(error);
        //     }.bind(this));
        // },
        //删除表格
        close(){
             this.showheader = false
        },
        _select(ev) {
            this.isenter = true
            console.log(ev)
            let randomUrl = this.apiRoot + "/grain/task/findsampleIdBylibraryId"
            let params;
            // 1:玉米
            // 2:小麦
            switch (ev.sample) {
                case "1":
                    randomUrl = this.apiRoot + "/grain/task/findCornSampleIdBylibraryId"
                    if(ev.number){
                        params = `{"libraryId":${ev.point},"position":${ev.number},"sort":"玉米"}`
                    }else{
                        params = `{"libraryId":${ev.point},"sort":"玉米"}`
                    }

                    break;
                case "2":
                     if(ev.number){
                       params = `{"libraryId":${ev.point},"position":${ev.number},"sort":"小麦"}`
                    }else{
                        params = `{"libraryId":${ev.point},"sort":"小麦"}`
                    }
                    randomUrl = this.apiRoot + "/grain/task/findWheatSampleIdBylibraryId"
                    break;
            }
            this.loading = true
//          params.detectionState=2;
            this.$http({
                method: 'post',
                url: randomUrl,
                transformRequest: [function(data) {
                    // Do whatever you want to transform the data
                    let ret = ''
                    for (let it in data) {
                        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                    }
                    return ret
                }],
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: {
                    params: params
                }
            }).then(function(res) {
                this.showheader = true
                this.loading = false;
                this.items = []
                if (ev.sample == "1") {
                    this.iskey = "Corn"
                    this.items = this.Corn
                } else {
                    this.iskey = "Wheat"
                    this.items = this.Wheat
                }
                this.tabledatas = res.data.map((value,index)=>{
			  		value.qualityGrade=value.qualityGrade==1?'一等':value.qualityGrade==2?'二等':value.qualityGrade==3?'三等':'';
			  		return value
			  	});
//              this.tabledatas = res.data.filter((value,index)=>{
//              	return (value.otherState==-1)&&(value.detectionState==2)
//              })
                this.tabledatas.forEach((i,v)=>{
                    i.sampleNum = "监"+i.sampleNum
                })
                this.charts = res.data
                this.charts["iskey"] = ev.sample
            }.bind(this))
        },
        //	表单底部触发事件btnCenterNo btnCenterYes btnLeft btnRight btnOne
        tfootEvent(date) {
            console.log(date);
            if (date == 'btnCenterL') {

            } else if (date == 'btnCenterR') {

            } else if (date == 'btnLeft') {

            } else if (date == 'btnRight') {

            } else if (date == 'btnOne') {
            	if(!this.$_ault_alert('sample:ExportXMorYMzhiliang')){
					return
				}
                let btnUrl
                let ids = []
                this.tabledatas.forEach((i, v) => {
                    ids.push(i.sampleId)
                })
                switch (this.tabledatas.iskey) {
                    case "1":
                        // 玉米
                        btnUrl = this.apiRoot + "/grain/sample/ExportYMzhiliang"
                        break;
                    case "2":
                        // 小麦
                        btnUrl = this.apiRoot + "/grain/sample/ExportXMzhiliang"
                        break;
                }
                ids = ids.join()
                console.log(ids)
                console.log(btnUrl)
                if(!this.$_ault_alert('sample:ExportXMorYMzhiliang')){
					return
				}
                var loadiframe=document.getElementById('fordownload');
				loadiframe.src=btnUrl+'?ids='+ids+'&title=质量验收报告'+'&sessionid='+this.Token;
//              window.open(btnUrl+'?ids='+ids+'&title=质量验收报告'+'&sessionid='+this.Token,"_blank");
            } else if (date == 'tableAdd') {
            }
        },

    },
    data() {
        return {
            //控制标头显示
            showheader:false,
            datalistURL: '/liquid/role_lyx/data',
            chartURL: '/liquid/chart/data',
            charts: [],
            items: [],
            tabledatas: [],
            iskey: "Wheat",
            
            loading: false,
            title: "质量验收情况",
            breadcrumb: {
                search: false,
                searching: '',
            },
            subtitle: {
                btn: false,
                btntext: '',
            },
            // 按钮的显示隐藏
            isenter: false,
            // 持续显示按钮
            show: 1,
            // 玉米的标头
            Corn: [
                {
                    id: 24,
                    prop: 'taskName',
                    label: "任务名称",
                    pid: 0,
                    //      sort:true,
                },
                {
                    id: 23,
                    prop: 'sampleNum',
                    label: "检验编号",
                    pid: 25,
                    //                  width: 70,
                    //      sort:true,
                },
                {
                    id: 25,
                    label: "质量情况",
                    pid: 0,
                },
                {
                    id: 26,
                    label: "储存品质情况",
                    pid: 0,
                    //      sort:true,
                },
                {
                    id: 27,
                    prop: 'qualityGrade',
                    label: "等级",
                    pid: 25,
                    //                  width: 70,
                    //      sort:true,
                },
                {
                    id: 28,
                    label: "质量指标",
                    pid: 25,
                    //      sort:true,
                },
                {
                    id: 29,
                    prop: 'result_zl',
                    label: "结果判定",
                    pid: 25,
                    //                  width: 70,
                    //      sort:true,
                },
                {
                    id: 30,
                    prop: 'realCapacity',
                    label: "容重",
                    pid: 28,
                    //                  width: 70,
                    //      sort:true,
                },
                {
                    id: 31,
                    prop: 'shuifen_pingjunzhi',
                    label: "水分",
                    pid: 28,
                    //                  width: 70,
                    //      sort:true,
                },
                {
                    id: 32,
                    prop: 'zazhizongliang_1',
                    label: "杂质",
                    pid: 28,
                    //                  width: 70,
                    //      sort:true,
                },
                {
                    id: 33,
                    label: "不完善粒",
                    pid: 28,
                    //      sort:true,
                },
                {
                    id: 34,
                    prop: 'sezeqiwei_pingjunzhi',
                    label: "色泽气味",
                    pid: 28,
                    //      sort:true,
                },
                {
                    id: 35,
                    prop: 'buwanshanlihanliang_pingjunzhi_1',
                    label: "总量",
                    pid: 33,
                    //      sort:true,
                },
                {
                    id: 36,
                    prop: 'shengmeilihanliang_pingjunzhi',
                    label: "其中:生霉粒",
                    pid: 33,
                    //      sort:true,
                },
                {
                    id: 37,
                    label: "储存品质指标",
                    pid: 26,
                },
                {
                    id: 38,
                    prop: 'result_pz',
                    label: "结果判定",
                    pid: 26,
                    //                  width: 70,
                    //      sort:true,
                },
                {
                    id: 39,
                    prop: 'pingjunzhi',
                    label: "脂肪酸值",
                    pid: 37,
                    //                  width: 70,
                    //      sort:true,
                },
                // {
                //     id: 40,
                //     prop: 'smj_pz',
                //     label: "湿面筋",
                //     pid: 37,
                //     width: 70,
                //     //      sort:true,
                // },
                {
                    id: 41,
                    prop: 'pinchangpingfenzhi',
                    label: "品尝评分值",
                    pid: 37,
                    //                  width: 70,
                    //      sort:true,
                },
                {
                    id: 43,
                    prop: ' sezeqiwei_pingjunzhi',
                    label: "色泽气味",
                    pid: 37,
                    //                  width: 70,
                    //      sort:true,
                },
                {
			        id: 44,
			        prop:'inspectors',
			        label:"检测人",
			        pid:0,
			//      sort:true,
                    width: 300,
			    },
			    {
			        id: 45,
			        prop:'inspectionTime',
			        label:"检测时间",
			        pid:0,
			//      sort:true,
			    },
                
            ],
            // 小麦的表头
            Wheat: [
                {
                    id: 24,
                    prop: 'taskName',
                    label: "任务名称",
                    pid: 0,
                    //      sort:true,
                },
                {
                    id: 23,
                    prop: 'sampleNum',
                    label: "检验编号",
                    pid: 25,
                    //                  width: 70,
                    //      sort:true,
                },
                {
                    id: 25,
                    label: "质量情况",
                    pid: 0,
                },
                {
                    id: 26,
                    label: "储存品质情况",
                    pid: 0,
                    //      sort:true,
                },
                {
                    id: 27,
                    prop: 'qualityGrade',
                    label: "等级",
                    pid: 25,
                    width: 70,
                    //      sort:true,
                },
                {
                    id: 28,
                    label: "质量指标",
                    pid: 25,
                    //      sort:true,
                },
                {
                    id: 29,
                    prop: 'result_zl',
                    label: "结果判定",
                    pid: 25,
                    width: 70,
                    //      sort:true,
                },
                {
                    id: 30,
                    prop: 'realCapacity',
                    label: "容重",
                    pid: 28,
                    width: 70,
                    //      sort:true,
                },
                {
                    id: 31,
                    prop: 'shuifen_pingjunzhi',
                    label: "水分",
                    pid: 28,
                    width: 70,
                    //      sort:true,
                },
                {
                    id: 32,
                    prop: 'zazhizongliang_1',
                    label: "杂质",
                    pid: 28,
                    width: 70,
                    //      sort:true,
                },
                {
                    id: 33,
                    prop: 'buwanshanlihanliang_pingjunzhi_1',
                    label: "不完善粒",
                    pid: 28,
                    //      sort:true,
                },
                {
                    id: 34,
                    prop: 'szqw_zl',
                    label: "色泽气味",
                    pid: 28,
                    //      sort:true,
                },
                {
                    id: 35,
                    prop: 'buwanshanlihanliang_pingjunzhi_1',
                    label: "总量",
                    pid: 32,
                    //      sort:true,
                },
                {
                    id: 36,
                    prop: 'kuangwuzhihanliang_pingjunzhi',
                    label: "其中:矿物质",
                    pid: 32,
                    //      sort:true,
                },
                {
                    id: 37,
                    label: "储存品质指标",
                    pid: 26,
                },
                {
                    id: 38,
                    prop: 'result_pz',
                    label: "结果判定",
                    pid: 26,
                    width: 70,
                    //      sort:true,
                },
                {
                    id: 39,
                    prop: 'pingjunzhiganmianjinzhiliang',
                    label: "面筋吸水量",
                    pid: 37,
                    width: 70,
                    //      sort:true,
                },
                {
                    id: 40,
                    prop: 'shimianjin_pingjunzhi',
                    label: "湿面筋",
                    pid: 37,
                    width: 70,
                    //      sort:true,
                },
                {
                    id: 41,
                    prop: 'pinchangpingfenzhi',
                    label: "品尝评分值",
                    pid: 37,
                    width: 70,
                    //      sort:true,
                },
                {
                    id: 42,
                    prop: 'yingduzhishu_pingjunzhi',
                    label: "硬度指数",
                    pid: 28,
                    //      sort:true,
                },
                {
                    id: 43,
                    prop: 'sezeqiwei_pingjunzhi',
                    label: "色泽气味",
                    pid: 37,
                    width: 70,
                    //      sort:true,
                },
                {
			        id: 44,
			        prop:'inspectors',
			        label:"检测人",
			        pid:0,
			//      sort:true,
                    width: 300,
			    },
			    {
			        id: 45,
			        prop:'inspectionTime',
			        label:"检测时间",
			        pid:0,
			//      sort:true,
			    },
            ],
            tfbtns: {
                // btnCenter: {
                //     btnTextL: '申请扦样',
                //     btnTextR: '保存',
                // },
                //		btnLeft:{
                //			btnText:'导出Excel表格',
                //		},
                //		btnRight:{
                //			btnText:'导出Excel表格',
                //		},
                btnOne: {
                    btnText: '导出Excel表格',
                },
            },
        }
    }
}
</script>