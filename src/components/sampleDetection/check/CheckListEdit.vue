<template>
  <div class='listpagewrap' id='listpagewrap'>
    <!--面包屑-->
    <sinograin-breadcrumb :breadcrumb="breadcrumb" v-on:searchingfor="searchingfor"></sinograin-breadcrumb>
    <!--标题-->
    <sinograin-option-title :title="subtitle" v-on:titleEvent="titleEvent"></sinograin-option-title>
    <!--提示-->
    <!--<sinograin-prompt :alerts="alerts"></sinograin-prompt>-->
    <div class="fromwrap" id="print" style="background:rgba(241, 241, 241, 1);">
      <!--表单-->
      <!--<hr>-->
      <bwsl-check-from v-if="checktype=='bwsl'" :formdatas="formdatas.bwsl" @submit="submit"></bwsl-check-from>

      <!--<hr>-->
      <sfcd-check-from v-if="checktype=='sfcd'" :formdatas="formdatas.sfcd" @submit="submit"></sfcd-check-from>

      <!--<hr>-->
      <mjxsl-check-from v-if="checktype=='mjxs'" :formdatas="formdatas.mjxs" @submit="submit"></mjxsl-check-from>
      <!--<hr>-->
      <zfsz-check-from v-if="checktype=='zfsz'" :formdatas="formdatas.zfsz" @submit="submit"></zfsz-check-from>
      <!--<hr>-->
      <ympcpf-check-from v-if="checktype=='ympc'" :formdatas="formdatas.ympc" @submit="submit"></ympcpf-check-from>
      <!--<hr>-->
      <mtpc-check-from v-if="checktype=='mtpc'" :formdatas="formdatas.mtpc" @submit="submit"></mtpc-check-from>
      <!--<hr>-->
      <dscd-check-from v-if="checktype=='dscd'" :formdatas="formdatas.dscd" @submit="submit"></dscd-check-from>

      <!--<hr>-->
      <pcpf-check-from v-if="checktype=='pcpf'" :formdatas="formdatas.pcpf" @submit="submit"></pcpf-check-from>
      <!--<hr>-->
      <cdjl-check-from v-if="checktype=='cdjl'" :formdatas="formdatas.cdjl" @submit="submit"></cdjl-check-from>
      <!--<hr>-->
      <mtbr-check-from v-if="checktype=='mtbr'" :formdatas="formdatas.mtbr" @submit="submit"></mtbr-check-from>
      <!--<hr>-->
    </div>
    <div class="checklistsavebtn">
      <div @click="footsave">
        <span>保存</span>
      </div>
    </div>
  </div>
</template>

<style>
.checklistsavebtn {
  height: 0.55rem;
  line-height: 0.55rem;
  color: #333333;
  position: fixed;
  left: 50%;
  bottom: 10px;
  margin-left: 400px;
  z-index: 6;
  text-align: center;
}
.checklistsavebtn > div {
  /*display: inline-block;*/
  float: right;
  margin: 0.07rem auto 0;
  height: 0.4rem;
  line-height: 0.33rem;
  /*margin:0 0 0 0.3rem;*/
  font-size: 0.24rem;
  cursor: pointer;
  background-color: #58b481;
  border-radius: 0.05rem;
  box-sizing: border-box;
  padding: 0.04rem;
  color: #ffffff;
}
.checklistsavebtn > div > span {
  border: 1px solid #ffffff;
  border-radius: 0.04rem;
  padding: 0 0.2rem;
  font-weight: 500;
}
.ui-body-bg {
  background: #ffffff;
  height: 1108px;
  padding-top: 80px;
}
.check {
  width: 100%;
  height: 100%;
  line-height: inherit;
  color: inherit;
  font-size: inherit;
  border: none;
  outline: none;
  text-align: center;
}
.check_checkbox {
  margin: 0 3px 0 0;
  vertical-align: -2px;
}
.zw-footer .check {
  width: 100px;
  height: 100%;
  line-height: inherit;
  color: inherit;
  font-size: inherit;
  border: none;
  outline: none;
  text-align: left;
  padding-left: 2em;
}
.ui-body-bg {
  width: 840px;
  margin: auto;
  padding-bottom: 20px;
  position: relative;
}
.code {
  width: 150px;
  /*height:130px;*/
  position: absolute;
  /*top:100px;
	left:116px;*/
  top: 88px;
  right: 88px;
}
.zw-header p {
  display: inline-block;
  width: 180px;
}
.zw-header p input {
  width: 100px;
}
.zw-header p:last-of-type {
  width: 150px;
}
.gongshi {
  height: 40px;
  margin: auto;
  display: block;
}
.zw-footer,
.zw-header {
  padding-left: 20px;
}
</style>
<script>
import SinograinPrompt from "@/components/common/prompt/Prompt.vue";
import SinograinBreadcrumb from "@/components/common/action/Breadcrumb.vue";
import SinograinOptionTitle from "@/components/common/action/OptionTitle";
//表各种表
import DscdCheckFrom from "@/components/checklist/DscdCheckFrom";
import YmpcpfCheckFrom from "@/components/checklist/YmpcpfCheckFrom";
import ZfszCheckFrom from "@/components/checklist/ZfszCheckFrom";
import SfcdCheckFrom from "@/components/checklist/SfcdCheckFrom";
import PcpfCheckFrom from "@/components/checklist/PcpfCheckFrom";
import MtbrCheckFrom from "@/components/checklist/MtbrCheckFrom";
import MtpcCheckFrom from "@/components/checklist/MtpcCheckFrom";
import CdjlCheckFrom from "@/components/checklist/CdjlCheckFrom";
import BwslCheckFrom from "@/components/checklist/BwslCheckFrom";
import MjxslCheckFrom from "@/components/checklist/MjxslCheckFrom";

import "@/assets/style/common/list.css";
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
//本地测试要用下面import代码
//import data from '@/util/mock';

export default {
  components: {
    SinograinPrompt,
    SinograinBreadcrumb,
    SinograinOptionTitle,
    DscdCheckFrom,
    YmpcpfCheckFrom,
    MjxslCheckFrom,
    BwslCheckFrom,
    CdjlCheckFrom,
    ZfszCheckFrom,
    MtpcCheckFrom,
    SfcdCheckFrom,
    MtbrCheckFrom,
    PcpfCheckFrom
  },
  computed: {
    ...mapState([
      "modal_id_number",
      "viewdata",
      "editdata",
      "aultdata",
      "messions",
      "mask"
    ]),
    ...mapGetters(["modal_id"])
  },
  created() {
    //	console.log(this.$route.query)
    //  获取列表数据（第一页）
    //	this.getlistdata()
    this.setform(this.$route.query);
  },
  destroy() {},
  methods: {
    ...mapMutations([
      "create_modal_id",
      "is_mask",
      "create_modal",
      "close_modal"
    ]),
    ...mapActions(["addAction"]),
    //	获取列表数据方法
    getlistdata() {
      this.loading = true;
      // 获取列表数据（第？页）
      this.$http({
        method: "post",
        url: this.datalistURL,
        transformRequest: [
          function(data) {
            let ret = "";
            for (let it in data) {
              ret +=
                encodeURIComponent(it) +
                "=" +
                encodeURIComponent(data[it]) +
                "&";
            }
            return ret;
          }
        ],
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        data: {
          id: this.$route.query.id
        }
      })
        .then(
          function(response) {
            //				this.setform(response.data)
            this.formdatas[this.checktype] = response.data;
            if (this.$route.query.smallSampleNum) {
              this.formdatas[this.checktype][
                "smallSampleNum"
              ] = this.$route.query.smallSampleNum;
              this.formdatas[this.checktype][
                "smallSamplePic"
              ] = this.$route.query.smallSamplePic;
              this.formdatas[this.checktype]["sort"] = this.$route.query.sort;
            }
          }.bind(this)
        )
        .catch(
          function(error) {
            console.log(error);
          }.bind(this)
        );
    },
    //	获取搜索数据
    searchingfor(searching) {
      console.log(searching);
      // 获取列表数据（第？页）
      this.$http({
        method: "post",
        url: this.searchURL,
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
        //			data: {
        //
        //			}
      })
        .then(
          function(response) {
            //		  	this.tabledatas=response.data.rows;
            setTimeout(() => {
              this.loading = false;
            }, 1000);
          }.bind(this)
        )
        .catch(
          function(error) {
            console.log(error);
          }.bind(this)
        );
    },
    titleEvent() {
      //		console.log('titleEvent');
      this.printhtml();
    },
    footsave() {
      this.$root.eventHub.$emit("printChecklist");
    },
    //	设置表单
    setform(data) {
      if (data.sort == "小麦") {
        if (
          this.$route.query.checkPoint == 1 ||
          this.$route.query.checkPoint == 4 ||
          this.$route.query.checkPoint == 3 ||
          this.$route.query.checkPoint == 5
        ) {
          this.checktype = "bwsl";
        } else if (data.checkPoint == 2) {
          this.checktype = "sfcd";
        } else if (data.checkPoint == 5) {
          this.checktype = "cdjl";
        } else if (data.checkPoint == 6) {
          this.checktype = "mjxs";
        } else if (data.checkPoint == 7) {
          this.checktype = "mtpc";
        } else if (data.checkPoint == 8) {
          this.checktype = "dscd";
        } else {
          this.checktype = "cdjl";
        }
      } else if (data.sort == "玉米") {
        if (
          data.checkPoint == 1 ||
          data.checkPoint == 2 ||
          data.checkPoint == 3
        ) {
          this.checktype = "bwsl";
        } else if (data.checkPoint == 4) {
          this.checktype = "sfcd";
        } else if (data.checkPoint == 5) {
          this.checktype = "cdjl";
        } else if (data.checkPoint == 6) {
          this.checktype = "zfsz";
        } else if (data.checkPoint == 7) {
          this.checktype = "ympc";
        } else if (data.checkPoint == 8) {
          this.checktype = "dscd";
        } else {
          this.checktype = "cdjl";
        }
      }
      this.Urlcomputed();
      if (this.$route.query.smallSampleNum) {
        this.formdatas[this.checktype][
          "smallSampleNum"
        ] = this.$route.query.smallSampleNum;
        this.formdatas[this.checktype][
          "smallSamplePic"
        ] = this.$route.query.smallSamplePic;
        this.formdatas[this.checktype]["sort"] = this.$route.query.sort;
      }
    },
    Urlcomputed() {
      if (this.checktype == "bwsl") {
        this.editUrlend = "/grain/buwanshanli/edit";
        this.datalistUrlend = "/grain/buwanshanli/getBySmallSampleId";
      } else if (this.checktype == "sfcd") {
        this.editUrlend = "/grain/shuifen/edit";
        this.datalistUrlend = "/grain/shuifen/getBySmallSampleId";
      } else if (this.checktype == "cdjl") {
        this.editUrlend = "/grain/cedingjilu/edit";
        this.datalistUrlend = "/grain/cedingjilu/getBySmallSampleId";
      } else if (this.checktype == "zfsz") {
        this.editUrlend = "/grain/zhifangsuanzhi/edit";
        this.datalistUrlend = "/grain/zhifangsuanzhi/getBySmallSampleId";
      } else if (this.checktype == "mtpc") {
        this.editUrlend = "/grain/mantoupinchang/edit";
        this.datalistUrlend = "/grain/mantoupinchang/getBySmallSampleId";
      } else if (this.checktype == "dscd") {
        this.editUrlend = "/grain/zhenjundusu/edit";
        this.datalistUrlend = "/grain/zhenjundusu/getBySmallSampleId";
      } else if (this.checktype == "mjxs") {
        this.editUrlend = "/grain/mianjinxishuiliang/edit";
        this.datalistUrlend = "/grain/mianjinxishuiliang/getBySmallSampleId";
      } else if (this.checktype == "ympc") {
        this.editUrlend = "/grain/yumipinchang/edit";
        this.datalistUrlend = "/grain/yumipinchang/getBySmallSampleId";
      }
      this.editUrl = this.apiRoot + this.editUrlend;
      this.datalistURL = this.apiRoot + this.datalistUrlend;
      this.getlistdata();
    },
    submit(jsdjg) {
      if (!this.$_ault_alert("all:edit")) {
        return;
      }
      for (var key in jsdjg) {
        this.formdatas[this.checktype][key] = jsdjg[key];
      }
      //		console.log(this.editUrl)
      this.save();
    },
    save() {
      // 提交保存
      this.formdatas[this.checktype]["smallSampleId"] = this.$route.query.id;
      var params = this.formdatas[this.checktype];
      delete params["riqi"];
      delete params["createTime"];
      delete params["updateTime"];
      delete params["guid"];
      this.$http({
        method: "post",
        url: this.editUrl,
        transformRequest: [
          function(data) {
            // Do whatever you want to transform the data
            let ret = "";
            for (let it in data) {
              ret +=
                encodeURIComponent(it) +
                "=" +
                encodeURIComponent(data[it]) +
                "&";
            }
            return ret;
          }
        ],
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        data: params
      })
        .then(
          function(response) {
            if (response.data.success) {
              this.$notify({
                title: "保存成功",
                message: "信息已成功修改！！！",
                type: "success"
              });
              this.getlistdata();
            } else {
              this.$notify.error({
                title: "保存失败",
                message: "请重新核对信息！！！"
              });
            }
          }.bind(this)
        )
        .catch(function(error) {}.bind(this));
    },
    printhtml() {
      let subOutputRankPrint = document.getElementById("print");
      let father = document.getElementById("father");
      let listpagewrap = document.getElementById("listpagewrap");
      document.body.insertBefore(subOutputRankPrint, father);
      father.style.display = "none";
      print.portrait = true;
      window.print();
      listpagewrap.appendChild(subOutputRankPrint);
      father.style.display = "block";
      return false;
    }
  },
  data() {
    return {
      editUrl: "",
      datalistURL: "",
      searchURL: "/liquid/role2/data/search",
      deleteURL: "/liquid/role2/data/delete",
      checkedId: [],
      createlibVisible: false,
      //	  类型
      checktype: "zfsz",
      saveUrlend: "",
      breadcrumb: {
        search: false,
        searching: ""
      },
      subtitle: {
        btn: true,
        btntext: "打印样品检验单"
      },
      //    弹窗数据
      //    alerts: [{
      //      title: '温馨提示：此页面灰色字为不可编辑状态!',
      //      type: 'info'
      //    }],
      formdatas: {
        //    	不完善粒
        bwsl: {
          table_version: "SXZCZJ/JL002-2015",
          riqi: new Date(),
          shiwen: "",
          xiangduishidu: "",
          jiancefangfa: "",
          yiqishebei_mingcheng_1: "1",
          yiqishebei_mingcheng_2: "1",
          yiqishebei_mingcheng_3: "1",
          yiqishebei_bianhao_1: "",
          yiqishebei_bianhao_2: "",
          yiqishebei_bianhao_3: "",
          dayangzhiliang_1: "",
          dayangzhiliang_2: "",
          dayangzazhizhiliang_1: "",
          dayangzazhizhiliang_2: "",
          //    		dayangzazhihanliang_1:'',
          //    		dayangzazhihanliang_2:'',
          //    		dayangzazhihanliang_pingjunzhi:'',
          xiaoyangzhiliang_1: "",
          xiaoyangzhiliang_2: "",
          xiaoyangzazhizhiliang_1: "",
          xiaoyangzazhizhiliang_2: "",
          //    		xiaoyangzazhihanliang_1:'',
          //    		xiaoyangzazhihanliang_2:'',
          //			xiaoyangzazhihanliang_pingjunzhi:'',
          kuangwuzhizhiliang_1: "",
          kuangwuzhizhiliang_2: "",
          //			kuangwuzhihanliang_1:'',
          //			kuangwuzhihanliang_2:'',
          //			kuangwuzhihanliang_pingjunzhi:'',
          zazhizongliang_1: "",
          buwanshanlizhiliang_1: "",
          buwanshanlizhiliang_2: "",
          //			buwanshanlihanliang_1:'',
          //			buwanshanlihanliang_2:'',
          //			buwanshanlihanliang_pingjunzhi:'',
          //			buwanshanlihanliang_pingjunzhi_1:'',
          //			buwanshanlihanliang_pingjunzhi_2:'',
          shengmeilizhiliang_1: "",
          shengmeilizhiliang_2: "",
          //			shengmeilihanliang_1:'',
          //			shengmeilihanliang_2:'',
          //			shengmeilihanliang_pingjunzhi:'',
          //			beizhu:'双试验结果M≤0.3    N≤0.3    A≤0.1    C≤1.0或C≤0.5',
          beizhu: "",
          fenyangjiance: "",
          buwanshanli_zazhi_jiance: "",
          jiaohe: "",
          sort: "",
          smallSampleNum: "",
          smallSamplePic: ""
        },
        //    	水分测定
        sfcd: {
          table_version: "SXZCZJ/JL003-2015",
          riqi: new Date(),
          shiwen: "",
          xiangduishidu: "",
          jiancefangfa: "",
          yiqishebei_mingcheng_1: "1",
          yiqishebei_mingcheng_2: "1",
          yiqishebei_bianhao_1: "",
          yiqishebei_bianhao_2: "",
          qimin_bianhao_1: "1",
          qimin_bianhao_2: "2",
          hongqianqiminzhiliang_1: "",
          hongqianqiminzhiliang_2: "",
          hongqianqiminzhiliang_3: "",
          hongqianqiminzhiliang_4: "",
          shiyangzhiliang_1: "",
          shiyangzhiliang_2: "",
          hengzhongqiminjishiyang_hengzhonghouzhiliang_1: "",
          hengzhongqiminjishiyang_hengzhonghouzhiliang_2: "",
          hengzhongqiminjishiyang_hengzhonghouzhiliang_3: "",
          hengzhongqiminjishiyang_hengzhonghouzhiliang_4: "",
          //    		YOUYIWEN
          shuifenhanliang_1: "",
          shuifenhanliang_2: "",
          //    		pingjunzhi:'',
          //    		pingxingcha:'',
          //    		xiangduicha:'',
          pingxingcha_xiangduicha: "平行差",
          pingxingcha_xiangduicha_zhi: "",
          beizhu: "",
          jiance: "",
          jiaohe: "",
          sort: "",
          smallSampleNum: "",
          smallSamplePic: ""
        },
        //    	面筋吸水
        mjxs: {
          table_version: "SXZCZJ/JL004-2015",
          riqi: new Date(),
          shiwen: "",
          xiangduishidu: "",
          jiancefangfa: "",
          yiqishebei_mingcheng_1: "1",
          yiqishebei_mingcheng_2: "1",
          yiqishebei_mingcheng_3: "1",
          yiqishebei_bianhao_1: "",
          yiqishebei_bianhao_2: "",
          yiqishebei_bianhao_3: "",
          shiyangzhiliang_1: "",
          shiyangzhiliang_2: "",
          shimianjinzhiliang_1: "",
          shimianjinzhiliang_2: "",
          ganmianjinzhiliang_1: "",
          ganmianjinzhiliang_2: "",
          //    		mianjinxishuiliang_1:'',
          //    		mianjinxishuiliang_2:'',
          //    		pingjunzhiganmianjinzhiliang:'',
          beizhu: "",
          jiance: "",
          jiaohe: "",
          sort: "",
          smallSampleNum: "",
          smallSamplePic: ""
        },
        //    	脂肪酸值
        zfsz: {
          table_version: "SXZCZJ/JL008-2015",
          riqi: new Date(),
          shiwen: "",
          xiangduishidu: "",
          jiancefangfa: "",
          yiqishebei_mingcheng_1: "1",
          yiqishebei_mingcheng_2: "2",
          yiqishebei_bianhao_1: "",
          yiqishebei_bianhao_2: "",
          shiyangzhiliang_1: "",
          shiyangzhiliang_2: "",
          shiyangshuifen: "",
          koh_rongyenongdu: "",
          didingzhongdiandushu_1: "",
          didingzhongdiandushu_2: "",
          didingqishidushu_1: "",
          didingqishidushu_2: "",
          koh_rongyeyongliang_1: "",
          koh_rongyeyongliang_2: "",
          kongbaishiyan_koh_yongliang: "",
          //    		zhifangsuanzhi_1:'',
          //    		zhifangsuanzhi_2:'',
          //    		pingjunzhi:'',
          //    		pingxingcha:'',
          //    		xiangduicha:'',
          pingxingcha_xiangduicha: "平行差",
          pingxingcha_xiangduicha_zhi: "",
          //    		beizhu:'平均测定结果差值不超过2mgKOH/100g',
          beizhu: "",
          jiance: "",
          jiaohe: "",
          sort: "",
          smallSampleNum: "",
          smallSamplePic: ""
        },
        //    	玉米品尝
        ympc: {
          table_version: "SXZCZJ/JL009-2015",
          riqi: new Date(),
          pinpingyuan: "",

          wotouqiwei: "",
          wotouseze: "",
          waiguanxingzhuang: "",
          neibuxingzhuang: "",
          ziwei: "",
          //			pinchangpingfenzhi:'50',

          smallSampleNum: "",
          smallSamplePic: ""
        },
        //    	馒头品尝
        mtpc: {
          table_version: "SXZCZJ/JL005-2015",
          riqi: new Date(),
          pinpingyuan: "",

          birong: "",
          biaomianseze: "",
          tanxing: "",
          qiwei: "",
          shiwei: "",
          renxing: "",
          nianxing: "",
          //			pinchangpingfenzhi:'50',

          smallSampleNum: "",
          smallSamplePic: ""
        },
        //    	毒素测定
        dscd: {
          table_version: "SXZCZJ/JL002-2015",
          riqi: new Date(),
          shiwen: "",
          xiangduishidu: "",
          jiancefangfa: "",
          yiqishebei_mingcheng_1: "1",
          yiqishebei_mingcheng_2: "1",
          yiqishebei_bianhao_1: "",
          yiqishebei_bianhao_2: "",
          outudushu_1: "",
          outudushu_2: "",
          //    		outudushu_pingjunzhi:'',
          huangqumeidusu_1: "",
          huangqumeidusu_2: "",
          //    		huangqumeidusu_pingjunzhi:'',
          yumichimeixitong_1: "",
          yumichimeixitong_2: "",
          //    		yumichimeixitong_pingjunzhi:'',
          zhequmeidusu_1: "",
          zhequmeidusu_2: "",
          //    		zhequmeidusu_pingjunzhi:'',
          beizhu: "",
          jiance: "",
          jiaohe: "",
          sort: "",
          smallSampleNum: "",
          smallSamplePic: ""
        },
        //    	馒头比容
        mtbr: {
          table_version: "SXZCZJ/JL002-2015",
          riqi: new Date(),
          shiwen: "",
          xiangduishidu: "",
          jiancefangfa: "",
          yiqishebei_mingcheng_1: "",
          yiqishebei_mingcheng_2: "",
          yiqishebei_bianhao_1: "",
          yiqishebei_bianhao_2: "",

          beizhu: "",
          jiance: "",
          jiaohe: "",
          sort: "",
          smallSampleNum: "",
          smallSamplePic: ""
        },
        //    	品尝评分
        pcpf: {
          table_version: "SXZCZJ/JL002-2015",
          riqi: new Date(),
          shiwen: "",
          xiangduishidu: "",
          jiancefangfa: "",
          yiqishebei_mingcheng_1: "",
          yiqishebei_mingcheng_2: "",
          yiqishebei_bianhao_1: "",
          yiqishebei_bianhao_2: "",

          beizhu: "",
          jiance: "",
          jiaohe: "",
          sort: "",
          smallSampleNum: "",
          smallSamplePic: ""
        },
        //    	测定记录
        cdjl: {
          table_version: "SXZCZJ/JL001-2015",
          riqi: new Date(),
          shiwen: "",
          xiangduishidu: "",
          jiancefangfa: "",
          yiqishebei_mingcheng_1: "1",
          yiqishebei_mingcheng_2: "1",
          yiqishebei_mingcheng_3: "1",
          yiqishebei_mingcheng_4: "1",
          yiqishebei_bianhao_1: "",
          yiqishebei_bianhao_2: "",
          yiqishebei_bianhao_3: "",
          yiqishebei_bianhao_4: "",
          rongzhong_1: "",
          rongzhong_2: "",
          //    		rongzhong_pingjunzhi:'',
          sezeqiwei_1: "",
          sezeqiwei_2: "",
          //    		sezeqiwei_pingjunzhi:'',
          yingduzhishu_1: "",
          yingduzhishu_2: "",
          //    		yingduzhishu_pingjunzhi:'',
          pise_1: "",
          pise_2: "",
          //    		pise_pingjunzhi:'',
          shuifen_1: "",
          shuifen_2: "",
          //    		shuifen_pingjunzhi:'',
          dainfen_1: "",
          dainfen_2: "",
          //    		dainfen_pingjunzhi:'',
          zhifang_1: "",
          zhifang_2: "",
          //    		zhifang_pingjunzhi:'',
          danbai_1: "",
          danbai_2: "",
          //    		danbai_pingjunzhi:'',
          shimianjin_1: "",
          shimianjin_2: "",
          //    		shimianjin_pingjunzhi:'',
          chenjiangzhi_1: "",
          chenjiangzhi_2: "",
          //    		chenjiangzhi_pingjunzhi:'',
          lashenchangdu_1: "",
          lashenchangdu_2: "",
          //    		lashenchangdu_pingjunzhi:'',
          wendingshijian_1: "",
          wendingshijian_2: "",
          //    		wendingshijian_pingjunzhi:'',
          xishuilv_1: "",
          xishuilv_2: "",
          //    		xishuilv_pingjunzhi:'',
          xingchengshijian_1: "",
          xingchengshijian_2: "",
          //    		xingchengshijian_pingjunzhi:'',
          beizhu: "",
          jiance: "",
          jiaohe: "",
          sort: "",
          smallSampleNum: "",
          smallSamplePic: ""
        }
      }
    };
  }
};
</script>

