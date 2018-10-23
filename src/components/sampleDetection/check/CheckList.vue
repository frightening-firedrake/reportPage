<template>
  <div class='listpagewrap'>
    <!--面包屑-->
    <sinograin-breadcrumb :breadcrumb="breadcrumb" v-on:searchingfor="searchingfor"></sinograin-breadcrumb>
    <!--alert-->
    <sinograin-prompt :alerts="alerts"></sinograin-prompt>
    <!--表格上的时间选框以及 创建-->
    <list-header :listHeader="listHeader" v-on:dateChange="dateChange" v-on:statusChange="statusChange" v-on:createSampling="createSampling" v-on:createlib="createlib" v-on:scanCode="scanCode"></list-header>
    <!--表格-->
    <sinograin-list class="list" :tabledata="tabledatas" :list="list" :items="items" :actions="actions" v-on:getchecked="getchecked" :loading="loading" v-on:emptyCreate="emptyCreate">
    </sinograin-list>
    <!--分页-->
    <sinograin-pagination :page="page" v-on:paginationEvent="paginationEvent" v-on:getCurrentPage="getCurrentPage"></sinograin-pagination>
    <!--新建库典弹框-->
    <sinograin-modal v-if="modalVisible" :modal="modal" v-on:createlibitem="createlibitem" v-on:dialogClose="dialogClose"></sinograin-modal>
    <sinograin-message v-if="messageShow" :messages="messages" v-on:messageclick="messageclick" v-on:messageClose="messageClose" @getScanCode="getScanCode"></sinograin-message>

  </div>
</template>

<style>
</style>

<script>
import SinograinList from "@/components/common/action/List.vue";
import SinograinPrompt from "@/components/common/prompt/Prompt.vue";
import SinograinBreadcrumb from "@/components/common/action/Breadcrumb.vue";
import SinograinPagination from "@/components/common/action/Pagination.vue";
import ListHeader from "@/components/common/action/ListHeader.vue";
import SinograinModal from "@/components/common/action/Modal.vue";
import SinograinMessage from "@/components/common/action/Message";
import "@/assets/style/common/list.css";
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";

//这里是打印控件
import { getLodop } from "static/lodop/LodopFuncs";
let LODOP;
//本地测试要用下面import代码
//import data from '@/util/mock';

export default {
  components: {
    SinograinList,
    SinograinPrompt,
    SinograinPagination,
    SinograinBreadcrumb,
    SinograinModal,
    ListHeader,
    SinograinMessage
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
    ...mapGetters(["modal_id", "Token"]),
    tabledatasFilter() {
      if (this.filterStatus == "全部") {
        return this.tabledatas;
      } else {
        return this.tabledatas.filter((value, index) => {
          return value.status == this.filterStatus;
        });
      }
    }
  },
  created() {
    //	console.log(this.$route.query)
    //  获取列表数据（第一页）
    this.getlistdata(1);
    //	移除监听事件
    this.$root.eventHub.$off("delelistitem");
    this.$root.eventHub.$off("viewlistitem");
    this.$root.eventHub.$off("printlistitem");
    this.$root.eventHub.$off("editlistitem");
    //	监听列表删除事件
    this.$root.eventHub.$on(
      "delelistitem",
      function(rowid, list) {
        this.tabledatas = this.tabledatas.filter(function(item) {
          return item.id !== rowid;
        });
        this.sendDeleteId(rowid);
        //  	console.log(rowid,list);
      }.bind(this)
    );
    //	监听列表点击查看事件
    this.$root.eventHub.$on(
      "viewlistitem",
      function(id, row) {
        if (!this.$_ault_alert("cedingjilu:getBySmallSampleId")) {
          return;
        }
        //		console.log(id)
        //		this.$router.push({path: '/index/sampleDetection/packingList/packingView',query:{libid:id}})
        //		this.$router.push({ path: '/index/sampleDetection/checkList/checkEdit', query: { id: id } })
        this.$router.push({
          path: "/index/sampleDetection/checkList/checkView",
          query: {
            checkPoint: row.checkPoint,
            sort: row.sort,
            smallSamplePic: row.smallSamplePic,
            smallSampleNum: row.smallSampleNum,
            id: row.id
          }
        });
      }.bind(this)
    );
    //	监听列表点击编辑事件
    this.$root.eventHub.$on(
      "editlistitem",
      function(id, row) {
        if (!this.$_ault_alert("all:edit")) {
          return;
        }
        //		console.log(id)
        //		this.$router.push({path: '/index/sampleDetection/packingList/packingView',query:{libid:id}})
        //		this.$router.push({ path: '/index/sampleDetection/checkList/checkEdit', query: { id: id } })
        this.$router.push({
          path: "/index/sampleDetection/checkList/checkEdit",
          query: {
            checkPoint: row.checkPoint,
            sort: row.sort,
            smallSamplePic: row.smallSamplePic,
            smallSampleNum: row.smallSampleNum,
            id: row.id
          }
        });
      }.bind(this)
    );
    //	监听列表点击打印事件
    this.$root.eventHub.$on(
      "printlistitem",
      function(code) {
        this.printitem(code);
      }.bind(this)
    );
  },
  destroy() {
    this.$root.eventHub.$off("viewlistitem");
    this.$root.eventHub.$off("printlistitem");
    this.$root.eventHub.$off("delelistitem");
    this.$root.eventHub.$off("editlistitem");
  },
  methods: {
    ...mapMutations([
      "create_modal_id",
      "is_mask",
      "create_modal",
      "close_modal"
    ]),
    ...mapActions(["addAction"]),
    //	列表头触发的事件
    dateChange(data) {
      //		console.log(data);
      this.dateStart = date[0];
      this.dateEnd = date[1];
      this.getlistdata(1);
    },
    statusChange(data) {
      //		console.log(data)
      this.filterStatus = data;
      this.getlistdata(1);
    },
    createSampling() {
      //		console.log('createSampling');
      //		this.$router.push({path: '/index/sampling/samplingList/samplingListCreate'})
    },
    emptyCreate() {
      //		this.scanCode();
    },
    //	打开新建弹框
    createlib() {
      this.modalVisible = true;
    },
    //	扫码新建样品
    scanCode() {
      if (!this.$_ault_alert("sample:getBySmallSampleNum")) {
        return;
      }
      this.messages.type = "scaning";
      this.messageShow = true;
      //		this.$router.push({path: '/index/sampleDetection/packingList/packingPrint'})
    },
    //	填入新建数据
    createlibitem(form) {
      console.log(form);
    },
    //	关闭新建弹框
    dialogClose() {
      this.modalVisible = false;
    },
    //	获取搜索数据
    searchingfor(searching, page) {
      page ? page : 1;
      this.searchText =
        searching.indexOf("监") == 0 ? searching.slice(1) : searching;
      this.getlistdata(page);
      //		var params = {};
      //		params.state=2;
      //		params.smallSampleNumLike = searching;
      ////		console.log(this.breadcrumb.searching);
      //		// 获取列表数据（第？页）
      //		this.$http({
      //		    method: 'post',
      //			url: this.searchURL,
      //			transformRequest: [function (data) {
      //				// Do whatever you want to transform the data
      //				let ret = ''
      //				for (let it in data) {
      //				ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      //				}
      //				return ret
      //			}],
      //			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      //			data: {
      //				page:page,
      //				rows:this.page.size,
      //			   params:JSON.stringify(params)
      //			}
      //	    }).then(function (response) {
      //		  	this.tabledatas = response.data.rows;
      //			this.page.total = response.data.total;
      //
      //		}.bind(this)).catch(function (error) {
      //		    console.log(error);
      //		}.bind(this));
    },

    //	获取列表数据方法
    getlistdata(page) {
      var params = {};
      //		params.state=2;
      if (this.dateStart) {
        params.dateStart = this.dateStart;
        params.dateEnd = this.dateEnd;
      }
      if (this.searchText) {
        params.smallSampleNumLike = this.searchText;
      }
      if (this.filterStatus !== "全部") {
        params.inspectState = this.filterStatus;
      }
      this.loading = false;
      // 获取列表数据（第？页）
      this.$http({
        method: "post",
        url: this.datalistURL,
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
        data: {
          listName: this.list,
          page: page,
          rows: this.page.size,
          params: JSON.stringify(params)
        }
      })
        .then(
          function(response) {
            //			console.log(response)
            this.tabledatas = response.data.rows;
            this.page.total = response.data.total;
            this.loading = false;
          }.bind(this)
        )
        .catch(
          function(error) {
            console.log(error);
          }.bind(this)
        );
    },
    //	发送删除id
    sendDeleteId(id) {
      this.$http({
        method: "post",
        url: this.deleteURL,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        data: {
          listName: this.list,
          id: id
        }
      })
        .then(function(response) {}.bind(this))
        .catch(
          function(error) {
            console.log(error);
          }.bind(this)
        );
    },
    //	获取分页点击事件中及当前页码
    getCurrentPage(currentPage) {
      if (this.searchText) {
        this.searchingfor(this.searchText, currentPage);
      } else {
        this.getlistdata(currentPage);
      }
    },
    //	映射分页触发的事件
    paginationEvent(actiontype) {
      if (this.checkedId.length > 1) {
        this.$notify.error({
          message: "一次只可以导出一个检验单",
          title: "请重新选择！！！"
        });
      } else if (actiontype == "btnfree") {
        this.checkedId.forEach((v, i) => {
          let eventUrl = "";
          if (v.sort == "小麦") {
            switch (v.checkPoint) {
              case "1,3,4,5":
                eventUrl = "exportCedingjilu";
                break;
              case "14,16,17,18,19": //食品卫生指标
                eventUrl = "exportZJDSCedingjilu";
                break;
              case "2": //水分
                eventUrl = "exportSFCedingjilu";
                break;
              case "8": //硬度
                eventUrl = "exportCedingjilu";
                break;
              case "9": //面筋吸水量
                eventUrl = "exportMJXSLCedingjilu";
                break;
              case "11": //馒头品尝评分
                eventUrl = "exportMTPCjilu";
                break;
            }
          } else {
            switch (v.checkPoint) {
              case "1,3,5,6":
                eventUrl = "exportCedingjilu";
                break;
              case "13,14,15,16,17,18,19": //食品卫生指标
                eventUrl = "exportZJDSCedingjilu";
                break;
              case "2": //水分
                eventUrl = "exportSFCedingjilu";
                break;
              case "10": //脂肪酸酯
                eventUrl = "exportZFSZCedingjilu";
                break;
              case "11": //玉米品尝评分
                eventUrl = "exportYMPCjilu";
                break;
            }
          }
          var sampleNum = v.sampleNum * 1;
          var id = v.id * 1;
          // var params = {
          //   id: v.id,
          //   sampleNum: sampleNum,
          //   sort: v.sort == "小麦" ? 1 : 2
          // };
          // this.$http({
          //   method: "post",
          //   url: this.pringURL + eventUrl,
          //   transformRequest: [
          //     function(data) {
          //       // Do whatever you want to transform the data
          //       let ret = "";
          //       for (let it in data) {
          //         ret +=
          //           encodeURIComponent(it) +
          //           "=" +
          //           encodeURIComponent(data[it]) +
          //           "&";
          //       }
          //       return ret;
          //     }
          //   ],
          //   headers: { "Content-Type": "application/x-www-form-urlencoded" },
          //   data: {
          //     SmallSample: JSON.stringify(params)
          //   }
          // })
          //   .then(function(response) {}.bind(this))
          //   .catch(
          //     function(error) {
          //       //		    console.log(error)
          //     }.bind(this)
          //   );
          var url = this.apiRoot + "/grain/exportCedingjilu/" + eventUrl;
          var loadiframe = document.getElementById("fordownload");

          //			var url=this.exportExcelURL+'?sampleId='+id+'&sessionid='+this.Token;
          //			window.location.assign(url);
          loadiframe.src = `${url}?smallSampleNum=${
            v.smallSampleNum
          }&sessionid=${this.Token}&sampleNum=${sampleNum}&sort=${v.sort}`;
        });
      } else if (actiontype == "refresh") {
        // 获取列表数据（第一页）
        this.getlistdata(1);
      }
    },
    //	获取多选框选中数据的id(这是一个数组)
    getchecked(checkedId, val) {
      console.log(val);
      this.checkedId = val;
    },
    messageclick(type) {
      if (type == "success") {
        console.log(type);
      } else if (type == "error") {
        console.log(type);
      }
    },
    messageClose() {
      this.messageShow = false;
    },
    getScanCode(code) {
      if (!code) {
        this.messageShow = false;
      } else {
        code = code.trim();
        code = code.substr(0, 13);
        this.messageShow = false;
        this.checkcode(code);
      }
    },
    //	去验证条码有效否
    checkcode(code) {
      this.$http({
        method: "post",
        url: this.checkURL,
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
        data: {
          smallSampleNum: code
        }
      })
        .then(
          function(response) {
            //			console.log(response)
            if (response.data.state == 1) {
              var path = this.$route.name + "/新建样品检验单";
              this.$router.push({
                name: path,
                query: {
                  checkPoint: response.data.checkPoint,
                  sort: response.data.sort,
                  smallSamplePic: response.data.smallSamplePic,
                  smallSampleNum: response.data.smallSampleNum,
                  id: response.data.id
                }
              });
              //				this.$router.push({name: path})
            } else if (response.data.state == 2) {
              var path = this.$route.name + "/编辑样品检验单";
              this.$router.push({
                name: path,
                query: {
                  checkPoint: response.data.checkPoint,
                  sort: response.data.sort,
                  smallSamplePic: response.data.smallSamplePic,
                  smallSampleNum: response.data.smallSampleNum,
                  id: response.data.id
                }
              });
              //				this.$router.push({name: path,query: {id:response.data.id,}})
            } else {
              this.$notify.error({
                title: "未获取到检验信息",
                message: "请重新核对条码信息！！！"
              });
            }
          }.bind(this)
        )
        .catch(
          function(error) {
            //		    console.log(error);

            this.$notify.error({
              title: "扫码失败",
              message: "请重新核对条码信息！！！"
            });
          }.bind(this)
        );
    },
    printitem(code) {
      this.messageShow = true;
      this.messages.type = "loading";
      this.printCodeBar(code);
    },
    printCodeBar(code) {
      LODOP = getLodop();

      LODOP.PRINT_INIT("打印条码");
      LODOP.SET_PRINTER_INDEX("Godex G530");
      LODOP.SET_PRINT_PAGESIZE(1, 700, 400, "USER");
      LODOP.ADD_PRINT_BARCODE(3, 30, 232, 115, "Codabar", code);
      //  			LODOP.PREVIEW();
      LODOP.PRINT();
    }
  },
  data() {
    return {
      datalistURL: this.apiRoot + "/grain/smallSample/data",
      //    checkURL:this.apiRoot +'/grain/smallSample/getBySmallSampleNum',
      checkURL: this.apiRoot + "/grain/smallSample/findBySmallSampleNum",
      //    checkURL:this.apiRoot +'/grain/smallSample/data',
      searchURL: this.apiRoot + "/grain/smallSample/data",
      pringURL: this.apiRoot + "/grain/exportCedingjilu/",
      deleteURL: "/liquid/role2/data/delete",
      searchText: "",
      checkedId: [],
      list: "samplinglist",
      modalVisible: false,
      modal: {
        title: "新建库点",
        formdatas: [
          {
            label: "单位名称",
            model: "unit"
          },
          {
            label: "库点名称",
            model: "lib"
          }
        ],
        submitText: "确定"
      },
      breadcrumb: {
        search: true,
        searching: ""
      },
      loading: true,
      filterStatus: "全部",
      dateStart: 0, //开始时间
      dateEnd: 9999999999999999999999999, //结束时间
      //    分页数据
      page: {
        size: 10,
        total: 0,
        currentPage: 1,
        show: true,
        tfootbtns: {
          btns: true, //是否添加按钮组
          leading_out: false, //导出按钮
          refresh: false, //刷新按钮
          delete: false, //删除按钮
          btnfree: "导出检验单" //自助系列
        }
      },
      //    弹窗数据
      alerts: [
        {
          title: "温馨提示：此页面扫码只能扫描小样条码!",
          type: "info"
        }
      ],
      //    表格数据
      listHeader: {
        createlib: false,
        createSampling: false,
        status: true,
        //    	date1:true,
        statusTitle: "检验单状态:",
        date1Title: "创建时间:",
        statusitems: [
          { label: "全部", text: "全部" },
          { label: -1, text: "待审核" },
          { label: 1, text: "未通过" },
          { label: 2, text: "已通过" },
          { label: 3, text: "草稿" }
        ],
        scanCode: true
      },
      tabledatas: [],
      items: [
        //    {
        //      id: 1,
        //      prop:'sampleNum',
        //      label: "检验单名称",
        //    },
        {
          id: 2,
          prop: "smallSampleNum",
          label: "小样编号",
          status: true,
          minWidth: 90
        },
        {
          id: 3,
          prop: "smallCheckPoint",
          label: "检验项目",
          status: true,
          minWidth: 90
        },
        {
          id: 4,
          prop: "sort",
          label: "品种"
        },
        {
          id: 5,
          prop: "checkOrderApprovalStatus",
          label: "检验单状态",
          //      sort:true,
          status: true
        },
        {
          id: 6,
          prop: "approveRemark",
          label: "审批结果备注",
          //      sort:true,
          status: true
        },
        {
          id: 7,
          prop: "checkMember",
          label: "校核员"
          //      sort:true,
          //		status:true,
        },
        {
          id: 8,
          prop: "inspector",
          label: "检验员"
          //      sort:true,
          //		status:true,
        }
        //    {
        //      id: 9,
        //      prop:'printDate',
        //      label:"创建时间",
        ////      sort:true,
        ////		status:true,
        //    },
      ],
      actions: {
        selection: true,
        number: false,
        view: false,
        //    	edit:true,
        dele: false,
        delecheck: false,
        //    	noview:true,
        //    	print:true,
        show: false,
        manuscript: false,
        safetyReport: false
      },
      messageShow: false,
      messages: {
        type: "scaning",
        scaning: {
          icon: "iconfont icon-iconset0255",
          messageTittle: "开始扫描",
          messageText:
            "不要点击键盘和鼠标请将扫码枪对准条形码，然后按下扫码枪按钮！"
        },
        success: {
          icon: "el-icon-success",
          messageTittle: "该样品已入库",
          messageText: "可点击编辑按钮修改入库信息！",
          buttonText: "编辑"
        },
        loading: {
          icon: "el-icon-printer",
          messageTittle: "正在打印中...",
          messageText: "请您耐心等待，正在打印中..."
        }
      }
    };
  }
};
</script>

