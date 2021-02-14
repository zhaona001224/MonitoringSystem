<template>
	<div class="add">
		<!--面包屑-->
		<el-card class="box-card">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item :to="{ path: '/User/List' }">用户管理</el-breadcrumb-item>
				<el-breadcrumb-item>修改用户</el-breadcrumb-item>
			</el-breadcrumb>
		</el-card>

		<el-card class="box-card">
			<div class="align-center" style="width: 100%;">
				<el-form ref="form" :model="form" :rules="rules" label-width="35%" label-position="right">
					<el-form-item label="email：" prop="email">
						<el-input disabled placeholder="请填写email" v-model="form.email">
						</el-input>
					</el-form-item>
					<el-form-item label="old password：" prop="password">
						<el-input  type="password" placeholder="请填写 old password" v-model="form.password">
						</el-input>
					</el-form-item>
					<el-form-item label="new password：" prop="new_password">
						<el-input type="password"  placeholder="请填写 new password" v-model="form.new_password">
						</el-input>
					</el-form-item>
					<div class="cls"></div>
					<div class="cls"></div>
					<div class="return-btn">
						<el-button @click.native="submit" type="info" class="button-purple">确 定</el-button>
						<el-button @click.native="$util.goBack" type="info" class="button-gray">取 消</el-button>
					</div>
				</el-form>
			</div>
		</el-card>
	</div>
</template>

<script>
	import { ptn } from '@/utils/common/validate'

	export default {
		name: 'Add',

		data() {
			let that = this;
			return {
				rules: {
					email: [{
							message: "请填写email",
							required: true,
							trigger: 'blur'
						},
						{
							message: "请输入正确的email",
							pattern: ptn.email(0,40),
							trigger: 'blur'
						}
					],
					password: [{
							message: "请填写password",
							required: true,
							trigger: 'blur'
						}
					],
						new_password: [{
							message: "请填写new password",
							required: true,
							trigger: 'blur'
						}
					]

				},
				form: {}
			}
		},
		methods: {

			//新增方法
			submit() {
				var that = this;
				this.$refs.form.validate((valid) => {
					if(valid) {
							that.$post("/admin/v1/user/update", this.form).then(response => {
								if(response.retCode == 0) {
									that.$util.successAlert("Modify Success！", '/User/list', 'return list');
								} else {
									that.$message({
										type: 'warning',
										message: response.message
									});
								}

							})
					} else {
						that.$message.error("请正确填写表单！");
					}
				})
			}
		},
		created() {
			this.form.email=JSON.parse(localStorage.getItem('userData')).email;

		}

	}
</script>

<style>
	@import "../../assets/css/add.css";
</style>