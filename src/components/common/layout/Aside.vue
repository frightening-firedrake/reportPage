<template>

	<!--<el-menu unique-opened :default-active="activePath" class="el-menu-vertical-demo" :router=true @open="handleOpen" @select="handleSelect" @close="handleClose" :collapse="this.isCollapse" :background-color="backgroundColor">-->
	<el-menu unique-opened :default-active="activePath" class="el-menu-vertical-demo" :router=true @open="handleOpen" @select="handleSelect" @close="handleClose" :collapse="this.isCollapse" :background-color="backgroundColor">
		<!--用户信息-->
		<!--<div class="user" style="width:2.5rem;">
			<div class="photo">
				<img :src="user.avater" alt="">
			</div>
			<div class="userinfo">
				<h3>
					<span>{{userName?userName:"未登录"}}</span>
				</h3>
				<p>
					<template v-if="userName">
						<span class="circle" style="background-color:#029441;"></span>
						<span>在线</span>
					</template>
					<template v-else>
						<span class="circle" style="background-color:red;"></span>
						<span>离线</span>
					</template>
				</p>
			</div>
		</div>-->

		<el-menu-item index="/index/home">


			<i class="iconfont icon-ziyuan firstlevel"></i>
			<span slot="title">首页</span>
		</el-menu-item>

		<template v-for="item in navlist" v-if="item.pid==0">
			<el-submenu :index="item.lid.toString()">

				<template slot="title">
					<div class="rightborder"></div>
					<div class="rightarrow"></div>
					<i class="iconfont firstlevel" :class="item.icon"></i>

					<el-badge slot="title" v-if="item.badge" :value="item.badge" class="navbadge">
						<span>{{item.title}}</span>
					</el-badge>
					<span v-else slot="title">{{item.title}}</span>
				</template>

				<template v-if="item.level==3">
					<template v-for="item2 in navlist" v-if="item2.pid==item.lid">

						<el-submenu :index="item2.lid.toString()">
							<template slot="title">
								<i class="iconfont secondlevel" :class="item2.icon"></i>

								<el-badge slot="title" v-if="item2.badge" :value="item2.badge" class="navbadge">
									<span>{{item2.title}}</span>
								</el-badge>
								<span v-else slot="title">{{item2.title}}</span>
							</template>

							<template v-for="item3 in navlist" v-if="item3.pid==item2.lid">
								<el-menu-item :index="item3.linkto">

									<div class="leftline"></div>
									<i class="iconfont thirdlevel" :class="item3.icon"></i>

									<el-badge slot="title" v-if="item3.badge" :value="item3.badge" class="navbadge">
										<span>{{item3.title}}</span>
									</el-badge>
									<span v-else slot="title">{{item3.title}}</span>
								</el-menu-item>
							</template>

						</el-submenu>

					</template>
				</template>

				<template v-if="item.level==2">
					<template v-for="item4 in navlist" v-if="item4.pid==item.lid">
						<el-menu-item :index="item4.linkto">

							<i class="iconfont secondlevel" :class="item4.icon"></i>

							<el-badge slot="title" v-if="item4.badge" :value="item4.badge" class="navbadge">
								<span>{{item4.title}}</span>
							</el-badge>
							<span class='positiontitle' v-else-if='item4.wrap' slot="title">{{item4.title}}</span>
							<span v-else slot="title">{{item4.title}}</span>
						</el-menu-item>
					</template>

				</template>

			</el-submenu>
		</template>

	</el-menu>
</template>
<script>
require("../../../assets/style/common/Sidebar.css");
//import '@/assets/style/index/index.scss';
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
export default {
  components: {},
  computed: {
    ...mapState(["isCollapse"]),
    ...mapGetters([
      "modal_id",
      "libraryId",
      "libraryName",
      "userName",
      "userAuth",
      "roleName"
    ]),
    activePath() {
      var path = this.$route.path.split("/");
      var zpath = path[0];
      for (var i = 1; i <= 3; i++) {
        if (path[i]) {
          zpath += "/" + path[i];
        }
      }
      return zpath;
    }
  },
  mounted() {},
  data() {
    return {
      //			isCollapse: false,
      backgroundColor: "#dff0f9",
      user: {
        name: "12345号",
        avater: "static/images/test/photo_01.png",
        status: 1
      },
      navlist: [
     
        {
          icon: "icon-hetong",
          title: "扫黑除恶警情案件",
          linkto: "",
          level: 2,
          pid: 0,
          lid: 1
        },
        {
          icon: "icon-hetong",
          title: "综合案件列表",
          linkto: "/index/evilCriminalCases/comprehensiveCriminalCaseList",
          level: 2,
          pid: 1,
          lid: 2
        },
        {
          icon: "icon-daishenhe",
          title: "待审核案件",
          linkto: "/index/evilCriminalCases/pendingTrialCaseList",
          level: 2,
          pid: 1,
          lid: 3
        },
		{
			icon: 'icon-tongguos',
			title: '审核通过案件',
			linkto: '/index/evilCriminalCases/passedCaseList',
			level: 2,
			pid: 1,
			lid: 4
		},
		{
			icon: 'icon-tongji',
			title: '数据字典管理',
			linkto: '',
			level: 2,
			pid: 0,
			lid: 5
		},

        {
          icon: "icon-fankui",
          title: "反馈信息编辑",
          linkto: "/index/dataDictionaryManagement/feedbackInformation",
          level: 2,
          pid: 5,
          lid: 6
        },
        {
          icon: "icon-tongji1",
          title: "报表统计",
          linkto: "",
          level: 2,
          pid: 0,
          lid: 7
        },
        {
          icon: "icon-tongji1",
          title: "数据汇总情况统计",
          linkto: "/index/reportStatistics/dataCollection",
          level: 2,
          pid: 7,
          lid: 8
        },
        
        {
          icon: "icon-quanxianguanli",
          title: "权限管理",
          linkto: "",
          level: 2,
          pid: 0,
          lid: 9,
//        needAuth: "AuthorityManagement"
        },
        {
          icon: "icon-jiaoseguanli",
          title: "角色管理",
          linkto: "/index/AuthorityManagement/RoleList",
          level: 2,
          pid: 9,
          lid: 10
        },
        {
          icon: "icon-yonghuguanli",
          title: "用户管理",
          linkto: "/index/AuthorityManagement/UserList",
          level: 2,
          pid: 9,
          lid: 11
        },
        {
          icon: "icon-ziyuanguanli",
          title: "资源管理",
          linkto: "/index/AuthorityManagement/ResourcesList",
          level: 2,
          pid: 9,
          lid: 12
        },
        {
          icon: "icon-diqufenbu",
          title: "地区管理",
          linkto: "/index/AuthorityManagement/RegionalManagement",
          level: 2,
          pid: 9,
          lid: 13
        },
        {
          icon: "icon-zixunliebiao",
          title: "信息管理",
          linkto: "",
          level: 2,
          pid: 0,
          lid: 14,
//        needAuth: "AuthorityManagement"
        },
        {
          icon: "icon-leimupinleifenleileibie",
          title: "举报种类管理",
          linkto: "/index/InformationManagement/ReportTypes",
          level: 2,
          pid: 14,
          lid: 15
        },
        {
          icon: "icon-bianmaguize",
          title: "保密规定管理",
          linkto: "/index/InformationManagement/Confidentiality",
          level: 2,
          pid: 14,
          lid: 16
        },
        {
          icon: "icon-jianglijilu",
          title: "奖励规定管理",
          linkto: "/index/InformationManagement/RewardRules",
          level: 2,
          pid: 14,
          lid: 17
        },
        {
          icon: "icon-shiyongxuzhi",
          title: "举报须知管理",
          linkto: "/index/InformationManagement/ReportNotes",
          level: 2,
          pid: 14,
          lid: 18
        },
        {
          icon: "icon-guanyuwomen",
          title: "关于我们管理",
          linkto: "/index/InformationManagement/AboutUs",
          level: 2,
          pid: 14,
          lid: 19
        },
      ]
    };
  },
  methods: {
    ...mapMutations(["slideToggle", "route_click"]),
    ...mapActions(["addAction"]),
    handleOpen(key, keyPath) {
      // console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath);
    },
    handleSelect(key, keyPath) {
      //			console.log(key, keyPath);
      this.route_click();
    },
    tostr(num) {
      return num.toString();
    },
    show_messions() {
      this.mission_show = true;
    },
    hidden_messions() {
      this.mission_show = false;
    },
    slide() {
      this.mission_show = false;
      setTimeout(() => {
        this.slideToggle();
      }, 100);
    },
    //		原计划控制显示用的权限检测方法目前处于弃用状态
    checkAuth(userAuth, needAuth) {
      if (!needAuth) {
        return true;
      }
      if (!userAuth) {
        return false;
      }
      userAuth = userAuth.split(",");
      return userAuth.includes(needAuth);
    }
  }
};
</script>
