<template>
	<div class="main">
		<div class="login-main">
			<div class="title"><img class="logo" src="../assets/image/login/icon-logo.png" />冷却设备监控系统</div>
			<div
			 class="form-main">
				<div> <img style="width: 547px;" src="../assets/image/login/loginimg.png" /> </div>
				<div class="right">
					<div class="form-title">用户登录</div>
					<el-form :model="login" :rules="rules" ref="login">
						<el-form-item prop="userName">
							<div class="img"><img src="../assets/image/login/user.png" /></div>
							<el-input type="text" v-model="login.userName"
							 placeholder="请输入账号" auto-complete="off"></el-input>
						</el-form-item>
						<el-form-item prop="userPwd">
							<div class="img"> <img src="../assets/image/login/pwd.png" /> </div>
							<el-input type="password"
							 v-model="login.userPwd" placeholder="请输入密码" auto-complete="off"></el-input>
						</el-form-item>
						<el-button type="primary" class="login-btn" @click.native.prevent="doLogin('login')">登 录</el-button>
					</el-form>
				</div>
				<div v-show="isShowTip" style="color: red;margin-top:20px">错误5次以上，账号锁定，24小时自动解锁。</div>
		</div>
	</div>
	</div>
</template>
<script>
	import * as types from '../store/types'
	import axios from 'axios'
	export default {
		created() {
			this.doKeyCode()
			if (localStorage.token) {
				this.$router.push('/schematicDia')
								
			}
		},
		data() {
			var validateUserName = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请输入用户名'));
				} else {
					callback();
				}
			};
			var validateUserPwd = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请输入密码'));
				} else {
					callback();
				}
			};
			return {
				reload: false,
				checked: true,
				isShowTip: false,
				//登录
				login: {
					userName: "", //lq@163.com
					userPwd: "" //qweasdzxc
				},
				//登录信息验证
				rules: {
					userName: [{
						validator: validateUserName,
						trigger: 'blur'
					}],
					userPwd: [{
						validator: validateUserPwd,
						trigger: 'blur'
					}]
				},
			}
		},
		methods: {
			create() {
				localStorage.removeItem('token');
				localStorage.removeItem('loginData');
				document.cookie = ''
				state.token = null;
			},
			//表单验证
			doLogin(formName) {
				const that = this;
				this.$refs[formName].validate((valid) => {
					if (valid) {
						that.$post("/admin/v1/login", {
							email: that.login.userName,
							password: that.login.userPwd
						}).then(response => {
							if (response.retCode == 0) {
								localStorage.setItem('token', response.data);
								this.loginData = JSON.parse(response.contents);
								that.$message({
									type: 'success',
									message: '登录成功!'
								});
								this.$router.push('/schematicDia')
								
								
							} else {
								that.$message({
									type: 'warning',
									message: response.message
								});
							}
						})
					} else {
						return false;
					}
				})
			},
			//enter键登录
			doKeyCode() {
				var self = this;
				document.addEventListener("keydown", function(e) {
					if (e.keyCode == 13) {
						self.doLogin('login');
					}
				});
			}
		},
	}
</script>
<style lang="less" scoped="">
	.main {
		position: relative;
		width: 100%;
		height: 100%;
		background: url(../assets/image/login/bg.png) no-repeat;
		background-size: cover;
		overflow: hidden;
	}
	
	.login-main {
		margin: 124px auto 0;
		width: 1185px;
		height: 550px;
		box-sizing: border-box;
		.title {
			display: flex;
			align-items: center;
			font-family: FZZYJW--GB1-0;
			font-size: 38px;
			color: #fff;
			margin-bottom: 54px;
			img {
				width: 46px;
				height: 46px;
				margin-left: 25px;
				margin-right: 20px;
			}
		}
		.form-main {
			display: flex;
			width: 1185px;
			height: 640px;
			background-color: #ffffff;
			border-radius: 30px;
			.right {
				width: 554px;
				.form-title {
					width: 100%;
					margin: 88px auto 73px;
					text-align: center;
					font-size: 36px;
					letter-spacing: 7px;
					color: #000000;
				}
			}
			/deep/.el-form-item__content {
				display: flex;
				.img {
					display: flex;
					align-items: center;
					width: 82px;
					height: 73px;
					justify-content: center;
					background-image: linear-gradient(90deg, #58baff 0%, #329dff 100%);
					opacity: 0.8;
				}
				input {
					width: 459px;
					height: 73px;
					background-color: #f5f8ff;
					border: none;
					font-size: 29px;
					color: #333;
				}
				
			}
			/deep/.el-button {
				margin-top: 54px;
					width: 540px;
					height: 73px;
					background-image: linear-gradient(90deg, #58baff 0%, #45acff 50%, #329dff 100%);
					border-radius: 36px;
					span{
						font-size: 27px;
					}
				}
		}
	}
</style>