<template>
  <div class='listpagewrap'>
    <!--面包屑-->
    <sinograin-breadcrumb :breadcrumb="breadcrumb"></sinograin-breadcrumb>
    <!--alert-->
    <!--<sinograin-prompt :alerts="alerts"></sinograin-prompt>-->
    <!--表格上的时间选框以及 创建-->
    <list-header :listHeader="listHeader"></list-header>
    <!--表格-->
    <sinograin-list class="list" :librarylist='librarylist' :tabledata="tabledatas" :items="items" :actions="actions" v-on:getchecked="getchecked" :loading="loading" v-on:emptyCreate="emptyCreate">
    </sinograin-list>
    <!--分页-->
    <sinograin-pagination :page="page" v-on:paginationEvent="paginationEvent" v-on:getCurrentPage="getCurrentPage"></sinograin-pagination>
  </div>
</template>

<script>
import SinograinList from "@/components/common/action/List.vue";
import SinograinBreadcrumb from "@/components/common/action/Breadcrumb.vue";
import SinograinPagination from "@/components/common/action/Pagination.vue";
import ListHeader from "@/components/common/action/ListHeader.vue";
export default {
  components: {
    SinograinList,
    ListHeader,
    SinograinBreadcrumb,
    SinograinPagination
  },
  data() {
    return {
      //    分页数据
      page: {
        size: 10,
        total: 0,
        currentPage: 1,
        show: true,
        tfootbtns: {
          btns: false, //是否添加按钮组
          leading_out: false, //导出按钮
          refresh: false, //刷新按钮
          delete: false //删除按钮
        }
      },
      dataUrl: this.apiRoot + "/grain/summaryCheck/findCheckAndSample",
      loading: false,
      breadcrumb: {
        search: false,
        searching: ""
      },
      //    表格数据
      listHeader: {
        createlib: false,
        createSampling: false,
        status: false,
        date: false,
        subtitle: true,
        title: this.$route.query.title.tablename
      },
      tabledatas: [],
      librarylist: [],
      actions: {
        selection: false,
        number: false,
        message: false,
        view: false,
        edit: false,
        dele: false
      },
      items: [
        {
          id: 1,
          prop: "smallSampleNum",
          label: "样品编号"
          //   status: true
          //      sort:true,
        },
        {
          id: 2,
          prop: "sort",
          label: "品种",
          sort: false
        },
        {
          id: 3,
          prop: "inspector",
          label: "检测人员",
          sort: false
        },
        {
          id: 4,
          prop: "checkOrderApprovalStatus", //-1待审核1已通过2未通过
          label: "状态",
          sort: false
        },
        {
          id: 5,
          prop: "createTime",
          label: "申请日期",
          sort: false
        }
      ]
    };
  },
  mounted() {
    console.log(this.$route.query);
    this.init();
  },
  created() {
    //  获取列表数据（第一页）
    // this.getlibrarylist()
    //	移除监听事件
    this.$root.eventHub.$off("delelistitem");
    this.$root.eventHub.$off("viewlistitem");
    //	监听列表点击查看事件
    this.$root.eventHub.$on(
      "viewlistitem",
      function(id, row) {
        console.log(row);
        row.tablename = this.$route.query.title.checkName
        this.$router.push({
          path:
            "/index/sampleDetection/examineList/sampleexamineList/examineLisrdetail",
          query: row
        });
      }.bind(this)
    );
  },
  methods: {
    paginationEvent() {},
    getCurrentPage() {},
    getchecked() {},
    emptyCreate() {},
    init() {
      this.$http({
        method: "post",
        url: this.dataUrl,
        transformRequest: [
          function(data) {
            // 				// Do whatever you want to transform the data
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
        data: {
          checkName: this.$route.query.title.checkName,
          sort: this.$route.query.title.sort
        },
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      })
        .then(
          function(response) {
            response.data.forEach((v, i) => {
              switch (v.checkOrderApprovalStatus) {
                case -1:
                  v.checkOrderApprovalStatus = "待审核";
                  break;
                case 1:
                  v.checkOrderApprovalStatus = "已通过";
                  break;
                case 2:
                  v.checkOrderApprovalStatus = "未通过";
                  break;
              }
            });
            console.log(this.tabledatas);
            this.tabledatas = response.data;
            this.loading = false;
          }.bind(this)
        )
        .catch(
          function(error) {
            console.log(error);
          }.bind(this)
        );
    }
  }
};
</script>

<style>
</style>

