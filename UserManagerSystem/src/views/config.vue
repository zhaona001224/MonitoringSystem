<template>
	<div class="add">
		<el-card class="box-card">
			<div class="align-center" style="width: 100%;">
				<el-form ref="form" :model="form"  label-width="20%" label-position="right">
					<el-form-item label="admin_email" prop="admin_email">
						<el-input  style="width:800px" placeholder="admin_email" v-model="form.admin_email">
						</el-input>
					</el-form-item>
					<el-form-item label="bind_addr" prop="bind_addr">
						<el-input  style="width:800px" placeholder="bind_addr" v-model="form.bind_addr">
						</el-input>
					</el-form-item>
					<el-form-item label="cache_" prop="cache_">
						<el-radio-group  v-model="form.cache_">
							<el-radio label=true>true</el-radio>
							<el-radio label=false>false</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="cors_" prop="cors_">
						<el-radio-group  v-model="form.cors_">
							<el-radio label=true>true</el-radio>
							<el-radio label=false>false</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="domain" prop="domain">
						<el-input style="width:800px" placeholder="domain" v-model="form.domain">
						</el-input>
					</el-form-item>
					<el-form-item  label="email_host" prop="email_host">
						<el-input style="width:800px" placeholder="email_host" v-model="form.email_host">
						</el-input>
					</el-form-item>
					<el-form-item label="email_password" prop="email_password">
						<el-input style="width:800px" placeholder="email_password" v-model="form.email_password">
						</el-input>
					</el-form-item>
					<el-form-item  label="http_port" prop="http_port">
						<el-input  style="width:800px" placeholder="http_port" v-model="form.http_port">
						</el-input>
					</el-form-item>
					<el-form-item  label="https_port" prop="https_port">
						<el-input  style="width:800px" placeholder="https_port" v-model="form.https_port">
						</el-input>
					</el-form-item>
					<el-form-item  label="log_file" prop="log_file">
						<el-input  style="width:800px" placeholder="log_file" v-model="form.log_file">
						</el-input>
					</el-form-item>
					<el-form-item  label="log_level" prop="log_level">
						<el-input  style="width:800px" placeholder="log_level" v-model="form.log_level">
						</el-input>
					</el-form-item>
					<el-form-item  label="name" prop="name">
						<el-input  style="width:800px" placeholder="name" v-model="form.name">
						</el-input>
					</el-form-item>
					<el-form-item  label="zip_" prop="zip_">
						<el-radio-group  v-model="form.zip_">
							<el-radio label=true>true</el-radio>
							<el-radio label=false>false</el-radio>
						</el-radio-group>
					</el-form-item>
					<div class="return-btn">
						<el-button @click.native="submit" type="info" class="button-purple">修改</el-button>
						<el-button @click.native="$util.goBack" type="info" class="button-gray">取 消</el-button>
					</div>

				</el-form>
			</div>
		</el-card>
		<div v-html="editorContent"></div>
	</div>
</template>

<script>
	import { ptn } from '@/utils/common/validate'
	import E from "wangeditor";
	export default {
		name: 'Add',
		data() {
			return {
				formData: [],
				treeData: [],
				picSource: [],
				editor: null,
				picType: {},
				editorContent: '',
				form: {
					cache_:false,
					cors_:false,
					zip_: true
				},
				
			}
		},
		methods: {
			handleAvatarSuccess(res, file) {
				this.formData.imageUrl = URL.createObjectURL(file.raw);
			},
			refreshData() {
				this.$forceUpdate();
			},
			handlePictureCardPreview(file) {
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
			},
			uploadImg1(e) {
				const form = new FormData();
				// 文件对象
				form.append("file", e.file);
				this.$post("/admin/v1/file", form).then(response => {
					this.form.logo = response.data.file.split(',')[0]
				})
			},
			beforeAvatarUpload(file) {
				//				const isJPG = file.type === 'image/jpeg';
				//				const isLt2M = file.size / 1024 / 1024 < 2;
				//
				//				if(!isJPG) {
				//					this.$message.error('上传头像图片只能是 JPG 格式!');
				//				}
				//				if(!isLt2M) {
				//					this.$message.error('上传头像图片大小不能超过 2MB!');
				//				}
				//				return isJPG && isLt2M;
			},

			//获取图片库内容
			getPicData() {
				this.$get('/admin/v1/files?count=-1', {

				}).then(response => {

					if(response.retCode == 0) {
						this.picSource = response.data;
					} else {

						this.$message({
							type: 'warning',
							message: response.message
						});
					}

				})
			},
			//新增方法
			submit() {
				var that = this;
				this.$refs.form.validate((valid) => {
					if(valid) {
						that.$post("/admin/v1/config", that.form).then(response => {
								if(response.retCode == 0) {
									that.$util.successAlert("修改成功！", '/config');
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
			},

		},

		mounted() {

			let that = this;
			this.imgUrl = window.imgUrl;

		},
		created() {
			this.getPicData();
			this.form = JSON.parse(this.store.state.configData)
			this.form.cache_=this.form.cache_+'';
			this.form.cors_=this.form.cors_+'';
			this.form.zip_=this.form.zip_+'';
		}

	}
</script>

<style>
	@import "../assets/css/add.css";
	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}
	
	.avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}
	
	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 128px;
		height: 128px;
		line-height: 128px;
		text-align: center;
	}
	
	.avatar {
		width: 128px;
		height: 128px;
		display: block;
	}
</style>