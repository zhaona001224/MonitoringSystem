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
								<div class="title"><img class="logo" src="../assets/image/login/icon-logo.png" />冷却设备监控系统</div>
							</div>
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
						</div>
					</el-col>
				</el-row>
			</el-header>
			<el-container>
				<!--侧边栏-->
				<el-aside>
					<!--<div @click="isCollapse=!isCollapse" style="color: #fff;padding-left: 20px;">{{isCollapse?'展开':'收起'}}<i style="position: relative;
    margin-left: 30px" :class="isCollapse?'el-submenu__icon-arrow el-icon-arrow-up':'el-submenu__icon-arrow el-icon-arrow-down'"></i></div>-->
					<el-menu ref="menu" :collapse="isCollapse" :router=true :default-active="onRoutes"
					 class="el-menu-vertical-demo">
						<el-menu-item :key="index" :index="item.path" v-for="(item,index) in menuTrees">
						<img v-if="onRoutes!=item.path" :src="require('../assets/image/home/menu'+(index+1)+'.png')"
							/> <img v-else :src="require('../assets/image/home/menu'+(index+1)+'-1.png')"
							/>
							<div class="text">{{item.text}}</div>
						</el-menu-item>
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
				menuTrees: [{
					text: '原理图',
					path: '/schematicDia'
				}, {
					text: '参数监控',
					path: '/222'
				}],
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
			}
		},
		created() {
			this.userInfo = {}
			this.onRoutes = this.$route.fullPath
		},
		mounted() {
			//			if(this.$route.fullPath.indexOf('template')){
			//				this.$refs.menu.open(1)
			//			}
			//				
		}
	}
</script>
<style scoped="" lang="less">
	.el-header {
		width: 1920px;
		height: 98px!important;
		background-image: linear-gradient(90deg, #2092cb 0%, #2796cd 100%);
		box-shadow: -2px 4px 30px 0px rgba(64, 129, 255, 0.08);
		.header {
			display: flex;
			align-items: center;
			height: 98px!important;
			.title {
				display: flex;
				align-items: center;
				font-family: FZZYJW--GB1-0;
				font-size: 38px;
				color: #fff;
				img {
					width: 46px;
					height: 46px;
					margin-left: 25px;
					margin-right: 20px;
				}
			}
			.header-right-cont {
				text-align: right;
				.el-dropdown {
					color: #fff;
				}
			}
		}
	}
	
	.el-aside {
		width: 272px!important;
		height: 982px;
		background-image: linear-gradient(0deg, #52d6ce 0%, #3b9cd4 100%);
		.el-menu--collapse {
			width: 251px;
			margin-left: 21px;
			background: none;
			border-right: none;
			.el-menu-item {
				width: 251px;
				height: 156px;
				box-sizing: border-box;
				text-align: center;
				img {
					margin-top: 32px;
					width: 39px;
					margin-bottom: 8px;
				}
				&.is-active {
					background: url(../assets/image/home/Active.png) no-repeat;
					background-size: contain;
					.text {
						color: #2796cd;
						font-weight: 600;
					}
				}
				.text {
					color: #fff;
					font-size: 24px;
					line-height: 34px;
				}
			}
		}
	}
</style>