<template>
    <div class="charts">
        <p class="tableName">
            质量验收情况
        </p>
        <!--<div  :class="{'rongzhong chart':true,'right':(index+1)%2==0}" v-for="(chart,index) in chartonly.rows" :key="index">
                                    <p v-if="chart.name == 1">容重统计图</p>
                                    <p v-else-if="chart.name == 2">水分统计图</p>
                                    <p v-else-if="chart.name == 3">杂质</p>
                                    <p v-else-if="chart.name == 4">不完善粒统计图</p>
                                    <p v-else-if="chart.name == 5">硬度统计图</p>
                                    <p v-else>面筋吸水量统计图</p>                        
                                    <div :id="'myChart'+index"  class='chartonly'>
                                    </div>
                                </div>-->
        <div class='rongzhong chart'>
            <p>容重统计图</p>
            <div id="rongzhong" class='chartonly'></div>
        </div>
        <div class='rongzhong chart  right'>
            <p>水分统计图</p>
            <div id="shuifen" class='chartonly'> </div>
        </div>
        <div class='rongzhong chart'>
            <p>杂质</p>
            <div id="zazhi" class='chartonly'> </div>
        </div>
        <div class='rongzhong chart right'>
            <p>不完善粒统计图</p>
            <div id="buwanshanli" class='chartonly'> </div>
        </div>
        <div class='rongzhong chart' v-show="!issample">
            <p>硬度统计图</p>
            <div id="yingdu" class='chartonly'></div>
        </div>
        <div class='rongzhong chart right' v-show="!issample">
            <p>面筋吸水量统计图</p>
            <div id="mianjinxishuiliang" class='chartonly'></div>
        </div>
        <div class='rongzhong chart' style="float:left;" v-show="issample">
            <p>脂肪酸值</p>
            <div id="zhifangsuanzhi" class='chartonly'></div>
        </div>
        <div class="clear"></div>
    </div>
</template>
<style lang="scss">
.charts {
    width: 100%; // height: 8rem;
    font-size: 0;
    .clear {
        clear: both;
    }
    .chart {
        overflow: hidden;
        display: inline-block;
        float: right;
        width: 49.9%;
        height: 5.53rem;
        .chartonly {
            width: 100%;
            height: 5.02rem;
            border: 1px solid #dfdfdf;
            border-top: none;
            border-bottom: none;
            &:last-child {
                border-bottom: 1px solid #dfdfdf;
            }
        }
        &.right {
            float: right;
        }
        p {
            width: 100%;
            height: 0.5rem;
            line-height: 0.5rem;
            font-size: 0.21rem;
            color: #323232;
            padding-left: 0.4rem;
            border: 1px solid #dfdfdf;
        }
    }
}
</style>
<script>
// 引入基本模板
let echarts = require('echarts/lib/echarts')
// 引入折线图图组件
require('echarts/lib/chart/line')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require("echarts/lib/component/legend")
export default {
    props: ["charts"],
    mounted() {
        this.chartonly = this.charts
        this.rongzhong()
        this.shuifen()
        this.zazhizongliang()
        if (this.chartonly.iskey == "1") {
            this.zhifangsuanzhi()
            this.buwanshanlizongliang()
        } else {
        	this.buwanshanli()
            this.yingduzhishu()
            this.mianjinxishuiliang()
        }
        // this.foronly(this.chartonly, "realCapacity", "容重", "rongzhong")
        // this.foronly( this.chartonly, "shuifen_pingjunzhi", "水分", "shuifen")
        // this.foronly( this.chartonly, "zazhizongliang_1", "杂质", "zazhi")
        // this.foronly( this.chartonly, "buwanshanlihanliang_pingjunzhi_1", "不完善粒", "buwanshanli")
        // this.foronly(this.chartonly, "yingduzhishu_pingjunzhi", "硬度", "yingdu")
        // this.foronly( this.chartonly, "pingjunzhiganmianjinzhiliang", "面筋吸水量", "mianjinxishuiliang")
    },
    computed: {
        issample() {
            if (this.charts.iskey == "1") {
                // 1玉米
                return true
            } else {
                // 小麦
                return false
            }
        }
    },
    watch: {
        'charts': function(i, v) {
            this.chartonly = this.charts
            this.rongzhong()
            this.shuifen()
            this.zazhizongliang()
            this.buwanshanli()
            if (this.chartonly.iskey == "1") {
                this.zhifangsuanzhi()
            } else {
                this.yingduzhishu()
                this.mianjinxishuiliang()
            }
        }
    },
    methods: {
        zhifangsuanzhi() {
            if (this.issample) {
                let option = this.foronly(this.chartonly, "zhifangsuanzhi", "脂肪酸值")
                this.drawChart(option, "zhifangsuanzhi")
            }
        },
        // 容重统计图
        rongzhong() {
            let option = this.foronly(this.chartonly, "rongzhong", "容重")
            this.drawChart(option, "rongzhong")
        },
        shuifen() {
            let option = this.foronly(this.chartonly, "shuifen", "水分")
            this.drawChart(option, "shuifen")
        },
        zazhizongliang() {
            let option = this.foronly(this.chartonly, "zazhi", "杂质")
            this.drawChart(option, "zazhi")
        },
        buwanshanli() {
            let option = this.foronly(this.chartonly, "buwanshanli", "不完善粒")
            this.drawChart(option, "buwanshanli")
        },
        buwanshanlizongliang(){
        	let option = this.foronly(this.chartonly, "buwanshanlizongliang", "不完善粒")
            this.drawChart(option, "buwanshanli")
        },
        yingduzhishu() {
            if (!this.issample) {
                let option = this.foronly(this.chartonly, "yingduzhishu", "硬度")
                this.drawChart(option, "yingdu")
            }

        },
        mianjinxishuiliang() {
            if (!this.issample) {
                let option = this.foronly(this.chartonly, "mianjinxishuiliang", "面筋吸水量")
                this.drawChart(option, "mianjinxishuiliang")
            }

        },

        foronly(forchild, only, tableName) {
            // 数据 data
            // 颜色 color
            // 上方显示 legend
            // x轴数据 xAxis
            // 介于杂质和不完善颗粒的问题 datas 为其中XXX
            // 在显示项展示的东西 optiondata
            let optiondata;
            let datas = []
            let data = []
            let xAxis = []
            let legend = []
            let color = [this.ChartColor[this.index % this.ChartColor.length]]
            forchild.forEach((i, v) => {
                xAxis.push(i["taskName"])
                if (only == "zazhi" && this.chartonly.iskey == "2") {
                    data.push(i["zazhizongliang"])
                    datas.push(i["zazhikuangwuzhi"])
                    legend = ["总量", "其中:矿物质"]
                    color.push(this.ChartColor[(this.index + 1) % this.ChartColor.length])
                } else if (only == "buwanshanlizongliang" && this.chartonly.iskey == "1") {
                    data.push(i["buwanshanlizongliang"])
                    datas.push(i["buwanshanlishengmeikeli"])
                    legend = ["总量", "其中:生霉粒"]
                    color.push(this.ChartColor[(this.index + 1) % this.ChartColor.length])
                } else {
                    data.push(i[only])
//                  legend.push(tableName)
                    legend = [tableName]
                }

            })
            console.log(legend)
            if (data.length && datas.length) {
                optiondata = [{
                    name: legend[0],
                    type: "line",
                    data: data,
                    symbolSize: "10",
                }, {
                    name: legend[1],
                    type: "line",
                    data: datas,
                    symbolSize: "10",
                }]
            } else {
                optiondata = [
                    {
                        name: legend,
                        type: "line",
                        data: data,
                        symbolSize: "10",
                    }
                ]
            }
            this.index++
            return {
                data: optiondata,
                xAxis: xAxis,
                color: color,
                legend: legend,
            }
        },
        drawChart(option, id) {
            let myChart = echarts.init(document.getElementById(id))
            myChart.setOption({
                // 图标内容的位置
                grid: {
                    left: "10%",
                },
                // 颜色
                color: option.color,//array
                // 提示框
                tooltip: {
                    trigger: 'axis',
                    // alwaysShowContent:true
                },
                // 上方显示
                legend: {
                    type: "plain",
                    width: "50%",
                    top: "2%",
                    data: option.legend,//array
                    textStyle: {
                        fontSize: 14
                    }
                },
                // x轴的数据
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: option.xAxis//array
                },
                // y轴的数据
                yAxis: {
                    type: 'value',
                    // axisLabel: {
                    //     formatter: '{value} °C'
                    // }
                },
                // 展示数据可以是变量赋值
                series: option.data
            }, true);
        }
    },
    data() {
        return {
            chartonly: "",
            index: 1,
            // rongzhong: [],
            // shuifen: [],
            // zazhi: [],
            // buwanshanli: [],
            // yingdu: [],
            // mianjinxishuiliang: [],
            ChartColor: ["#2fbfc5", "#2d82e2", "#ecaf09", "#58b481", "#ff4c78", "#f95e00", "#16b8be"]
        }
    }
}
</script>