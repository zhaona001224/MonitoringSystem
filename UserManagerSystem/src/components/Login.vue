<template>
	<div class="main">
		<div class="login-main">
			<div class="form-main">
				<div class="title">管理中心</div>

				<el-form :model="login" :rules="rules" ref="login" status-icon label-position="right" label-width="90px">
					<el-form-item label="账号" prop="userName">
						<el-input type="text" v-model="login.userName" placeholder="请输入账号" auto-complete="off"></el-input>
					</el-form-item>

					<el-form-item label="密码" prop="userPwd">
						<el-input type="password" v-model="login.userPwd" placeholder="请输入密码" auto-complete="off"></el-input>
					</el-form-item>

					<el-button type="primary" class="login-btn" @click.native.prevent="doLogin('login')">登 录</el-button>
				</el-form>
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
			this.doKeyCode();
			this.menuTrees = this.store.state.loginData&&JSON.parse(this.store.state.loginData);
			if(localStorage.token) {
				this.$router.push('/template/List/' + this.menuTrees[0].name);
			}

		},
		data() {
			var validateUserName = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('请输入用户名'));
				} else {
					callback();
				}
			};

			var validateUserPwd = (rule, value, callback) => {
				if(value === '') {
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
					userName: "",//lq@163.com
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
				localStorage.removeItem('configData');
				document.cookie = ''
				state.token = null;
			},
			//表单验证
			doLogin(formName) {
				const that = this;
				this.$refs[formName].validate((valid) => {
					if(valid) {
						that.$post("/admin/v1/login", {
							email: that.login.userName,
							password: that.login.userPwd
						}).then(response => {
							if(response.retCode == 0) {
								localStorage.setItem('token',response.data);
								this.loginData = JSON.parse(response.contents);
								this.menuTrees = [];
								for(var key in this.loginData) {
									this.menuTrees.push({
										name: key,
										formData: this.loginData[key]
									})
								}
								this.menuTrees.sort((a, b) => {
									//排序基于的数据
									return a.formData.no - b.formData.no;
								})

								that.$store.commit(types.LOGINDATA, JSON.stringify(this.menuTrees));
								that.$message({
									type: 'success',
									message: '登录成功!'
								});
								that.$get("/admin/v1/config", {

								}).then(response1 => {
									response1.data[0].data.email=that.login.userName;
									if(response1.retCode == 0) {
										that.$store.commit(types.CONFIGDATA, JSON.stringify(response1.data[0].data))
										that.$router.push('/template/List/' + this.menuTrees[0].name);
									} else {

										that.$message({
											type: 'warning',
											message: response.message
										});
									}

								})

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
					if(e.keyCode == 13) {
						self.doLogin('login');
					}
				});
			}

		},

	}
</script>

<style>
	@import "../assets/css/login.css";
</style>