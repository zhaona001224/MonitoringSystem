<template>
	<div class="home-container">
		<el-container>
			<!--头部-->
			<el-header>
				<el-row type="flex" class="row-bg header" justify="space-between">
					<el-col class="header-left">
						<div class="header-left-cont">
							<!--	<img src="../assets/image/home/logo.png" height="60">-->
							<div class="header-left-cont-text" style="padding-left: 0;">
								<h2 style="line-height: 40px;font-size: 20px;">组态监控后台系统</h2> </div>
						</div>
					</el-col>
					<el-col class="header-right">
						<div class="header-right-cont">
							<el-dropdown trigger="hover"> <span class="el-dropdown-link userinfo-inner">
              <span>{{ userInfo.email }}</span> <i class="el-icon-caret-bottom"></i>								</span>
								<el-dropdown-menu slot="dropdown">
									<el-dropdown-item @click.native="doLoginOut"> <i class="el-icon-circle-close-outline"></i> 退出登录 </el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
							<el-dropdown>
								<el-button type="primary" style="background-color: rgb(138, 129, 138) !important;border-color: rgb(138, 129, 138) !important"
								 v-popover:popover>备份</el-button>
								<el-dropdown-menu slot="dropdown">
									<el-dropdown-item v-for="subItem in backUpList" :key="subItem">
										<a style="color:#544c64;text-decoration: none;" @click="visible2=false"
										 download="filename" :key="subItem" :href="store.state.baseUrl+'/admin/v1/backup?source='+subItem">{{subItem}}</a>
									</el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
						</div>
					</el-col>
				</el-row>
			</el-header>
			<el-container>
				<!--侧边栏-->
				<el-aside style="width:auto!important">
					<div @click="isCollapse=!isCollapse" style="color: #fff;padding-left: 20px;">{{isCollapse?'展开':'收起'}}<i style="position: relative;
    margin-left: 30px" :class="isCollapse?'el-submenu__icon-arrow el-icon-arrow-up':'el-submenu__icon-arrow el-icon-arrow-down'"></i></div>
					<el-menu ref="menu" :collapse="isCollapse" :router=true :default-active="onRoutes"
					 class="el-menu-vertical-demo">
						<el-submenu index="1">
							<template slot="title"> <i style="color: #fff;margin-right:10px" class="iconfont icon-stack"></i>								<span>Product</span> </template>
							<el-menu-item-group>
								<el-menu-item v-for="part in menuTrees" :index="'/template/List/'+part.name"
								 :key="part.name">{{part.name}}</el-menu-item>
							</el-menu-item-group>
						</el-submenu>
						<el-submenu index="2">
							<template slot="title"> <i style="color: #fff;margin-right:10px" class="iconfont icon-xitong"></i>								<span slot="title">Systems</span> </template>
							<el-menu-item-group>
								
								<el-menu-item index='/config' key="Config">Config</el-menu-item>
								<el-menu-item index='/user/list' key="User">User</el-menu-item>
								<el-menu-item index='/photo/list' key="Photo">Photo</el-menu-item>
								
							</el-menu-item-group>
						</el-submenu>
					</el-menu>
				</el-aside>
				<!--路由内容-->
				<el-main>
					<el-col :span="24" class="content-wrapper">
						<transition name="fade" mode="out-in">
							<router-view></router-view>
						</transition>
					</el-col>
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>
<script>
	import * as types from '../store/types'
	export default {
		name: "app",
		data() {
			return {
				onRoutes: '',
				//菜单
				menuTrees: [],
				backUpType: "",
				visible2: false,
				isCollapse: true,
				backUpList: ['system', 'uploads', 'search'],
				//用户信息(初始化获取到)
				userName: localStorage.getItem("userName"),
			}
		},
		methods: {
			//退出登录
			doLoginOut() {
				var that = this;
				this.$confirm('确认退出登录?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					that.$post("/admin/v1/user/logout", {}).then(response => {
						if (response.retCode == 0) {
							this.$store.commit(types.LOGOUT);
							this.$router.replace({
								path: '/',
								query: {
									redirect: this.$router.currentRoute.path
								}
							});
						} else {
							that.$message({
								type: 'warning',
								message: response.message
							});
						}
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消'
						});
					});
				})
			},
			backUp(e) {
				var that = this;
				that.$post("/admin/v1/backup?source=" + e, {}).then(response => {
					if (response.retCode == 0) {
						that.$message({
							type: 'success',
							message: "备份成功"
						});
					} else {
						that.$message({
							type: 'warning',
							message: response.message
						});
					}
				}).catch(() => {});
			}
		},
		created() {
			this.menuTrees = JSON.parse(this.store.state.loginData);
			this.userInfo = JSON.parse(this.store.state.configData);
			var router = this.$route.fullPath.replace("Add", 'List')
			this.onRoutes = router;
		},
		mounted() {
			//			if(this.$route.fullPath.indexOf('template')){
			//				this.$refs.menu.open(1)
			//			}
			//				
		}
	}
</script>
<style>
	.select-back {
		width: 160px
	}
	
	.select-back .el-input {
		width: 160px
	}
</style>