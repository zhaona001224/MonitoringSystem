<template>
	<div class="add">
		<!--面包屑-->
		<el-card class="box-card">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item :to="{ path: '/template/list/'+this.$route.params.key }">{{$route.params.key}}</el-breadcrumb-item>
				<el-breadcrumb-item>{{$route.query.id?'Edit':'Add'}}</el-breadcrumb-item>
			</el-breadcrumb>
		</el-card>
		<el-card class="box-card">
			<div class="align-center" style="width: 100%;">
				<el-form ref="form" :model="form" :rules="rules" label-width="20%" label-position="right">
					<el-form-item v-for="(item,index) in formData" :label="item&&item.name+''" :prop="item&&item.name"
					 :key="index" v-if="item">
						<el-input style="width:800px" v-if="item.data.type=='input'&&item.name!='stock'"
						 :placeholder="'请填写 '+item.name" maxlength="" v-model="form[item.name]"> </el-input>
						<el-input style="width:800px" v-if="item.data.type=='input'&&item.name=='stock'"
						 :placeholder="'请填写 '+item.name" max="999999" maxlength="6" v-model="form[item.name]">
						</el-input>
						<!--	{{formData}}-->
						<el-tree :default-expand-all="true" v-if="item.data.type=='tree'" ref="tree"
						 :props="defaultProps" style="width:800px" :data="item.data.source[0].name?item.data.source:[]"
						 :key="item.data.id" :highlight-current="true" node-key="id" :label="item.name"
						 :value="item.id" accordion @node-click="handleNodeClick"> </el-tree>
						<el-select :clearable="true" @change="refreshData(subItem.name)"
						 style="width:800px" multiple v-if="item.data.type=='multiselect'" v-model="form[item.name]"
						 :placeholder="'请选择'+item.name">
							<el-option v-for="subItem in item.data.source" :key="subItem.id" :label="subItem.name"
							 :value="subItem.id"> </el-option>
						</el-select>
						<el-select :clearable="true" @click="judgeGame(subItem.name)" @change="refreshData"
						 style="width:800px" v-if="item.data.type=='select'" v-model="form[item.name]"
						 :placeholder="'请选择'+item.name">
							<el-option v-for="subItem in item.data.source" :key="subItem.id" :label="subItem.name"
							 :value="subItem.id"> </el-option>
						</el-select>
						<el-radio-group v-if="item.data.type=='bool'" v-model="form[item.name]" @change="refreshData">
							<el-radio :label="item.data.source[0]?item.data.source[0]:true">{{item.data.source[0]?item.data.source[0]:true}}</el-radio>
							<el-radio :label="item.data.source[1]?item.data.source[1]:false">{{item.data.source[1]?item.data.source[1]:false}}</el-radio>
						</el-radio-group>
						<el-radio-group v-if="item.data.type=='file'" v-model="picType[item.name]"
						 @change="refreshData">
							<el-radio value="1" label="1">Select from Gallery</el-radio>
							<el-radio value="2" label="2">Upload</el-radio>
						</el-radio-group>
						<el-date-picker value-format="yyyy-MM-dd" v-if="item.data.dataType=='date'" v-model="form[item.name]"
						 type="date" placeholder="选择日期"> </el-date-picker>
						<el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-if="item.data.dataType=='time'" v-model="form[item.name]" type="datetime" placeholder="选择日期时间">
						</el-date-picker>
						<div style="display: inline-block" v-if="item.data.type=='file'"
						 @click='activeKey=item.name'>
							<el-select filterable clearable style="display: inline-block;width: 800px;margin:20px 0 "
							 v-if="item.data.type=='file'&&picType[item.name]==1" v-model="form[item.name]"
							 :placeholder="'请选择'+item.name">
								<el-option v-for="subItem in picSource" :key="subItem.id" :label="subItem.name"
								 :value="subItem.id"> </el-option>
							</el-select>
							<div style="position: relative;" v-if="form[item.name]&&picType[item.name]==1">
							<img :src="imgUrl+form[item.name]" class="avatar" /> <span style="position: absolute;left: 130px;top:-14px;display: block;"
								 class="el-upload-list__item-delete" @click="form[item.name]=''">
          <i class="el-icon-delete"></i>
        </span> </div>
							<el-upload class="avatar-uploader" action="" :http-request="uploadImg"
							 v-if="item.data.type=='file'&&picType[item.name]==2" :show-file-list="false"
							 :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload"> <img v-if="form[item.name]" :src="imgUrl+form[item.name]" class="avatar">								<i v-else class="el-icon-plus avatar-uploader-icon"></i> </el-upload>
						</div>
						<div v-if="item.data.type=='textarea'" :ref="'editorElem'+item.name" style="z-index: 1000;">
							<div v-model="form[item.name]" style="text-align:left;"></div>
						</div>
						<el-popover v-if="dataSource.formData.data[item.name].helpText" placement="top-start"
						 title="" trigger="hover" :content="dataSource.formData.data[item.name].helpText">
						<i style="color: #666;margin-left:10px;" slot="reference" class="iconfont icon-tishi1"></i>							</el-popover>
					</el-form-item>
					<div class="cls"></div>
					<div class="cls"></div>
					<div class="return-btn">
						<el-button @click.native="submit" type="info" class="button-purple">confirm</el-button>
						<el-button @click.native="$util.goBack" type="info" class="button-gray">cancel</el-button>
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
				form: {},
				categoryUrl: '',
				activeKey: '',
				roles: [],
				defaultProps: {
					label: 'name',
				},
				imgUrl: '',
				rules: {
					//										name: [{
					//											message: "请填写name",
					//											required: true,
					//											trigger: 'blur'
					//										}],
				},
			}
		},
		methods: {
			handleAvatarSuccess(res, file) {
				this.formData.imageUrl = URL.createObjectURL(file.raw);
			},
			refreshData(e) {
				this.$forceUpdate();
			},
			judgeGame(e) {
				if (e == "category" && this.dataSource.formData.data[e].source.length == 0) {
					this.$message({
						type: 'warning',
						message: "Place Select Game"
					});
				}
			},
			changeSelect() {},
			handlePictureCardPreview(file) {
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
			},
			uploadImg(e) {
				const form = new FormData();
				// 文件对象
				form.append("file", e.file);
				this.$post("/admin/v1/file", form).then(response => {
					this.form[this.activeKey] = response.data.file.split(',')[0];
					this.$forceUpdate();
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
			//获取所有角色
			getRoles() {
				this.$post("/role/index", {
					per_page: 10000
				}).then(response => {
					this.roles = response.data.data;
				})
			},
			//点击组织结构树，选择事件
			handleNodeClick(obj) {
				this.form.belongto = obj.id;
				this.$forceUpdate();
			},
			//获取图片库内容
			getPicData() {
				this.$get('/admin/v1/files?count=-1', {}).then(response => {
					if (response.retCode == 0) {
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
				var form = {};
				form = JSON.parse(JSON.stringify(this.form)); //this.templateData是父组件传递的对象  
				var that = this;
				for (var key in form) {
					if (key != 'id' && this.dataSource.formData.data[key] && this.form[key]) {
						if (this.dataSource.formData.data[key].type == "select" || this.dataSource
							.formData.data[key].type == "tree") {
							if (key == "belongto") {
								var source = this.treeData
							} else {
								var source = this.dataSource.formData.data[key].source
							}
							if (this.form[key].toString().indexOf(',') > -1) return
							var data = source.filter((item, index) => {
								return item.id == this.form[key]
							})
							form[key] = this.form[key] + "," + data[0].name
						}
						if (this.dataSource.formData.data[key].type == "multiselect") {
							var source = this.dataSource.formData.data[key].source;
							var array = [];
							this.form[key].map((formItem) => {
								var data = source.filter((item, index) => {
									return item.id == formItem
								})
								array.push(formItem + "," + data[0].name)
							})
							form[key] = JSON.stringify(array)
						}
					}
				}
				this.$refs.form.validate((valid) => {
					if (valid) {
						if (this.$route.query.id) {
							for (var key in form) {
								if (form[key] === '') {
									form[key] = '--remove--'
								}
							}
							that.$post("/admin/v1/content/update?type=" + this.$route.params.key +
								"&id=" + this.$route.query.id, form).then(response => {
								if (response.retCode == 0) {
									that.$util.successAlert("Modify Success！", '/template/list/' +
										this.$route.params.key, 'return list');
								} else {
									that.$message({
										type: 'warning',
										message: response.message
									});
								}
							})
						} else {
							that.$post("/admin/v1/content?type=" + this.$route.params.key, form).then(
								response => {
									if (response.retCode == 0) {
										that.$util.successAlert("Add Success！", '/template/list/' + this.$route
											.params.key, 'return list');
									} else {
										that.$message({
											type: 'warning',
											message: response.message
										});
									}
								})
						}
					} else {
						that.$message.error("请填写 the form correctly！");
					}
				})
			},
			getTreeList(data, fn) {
				data && data.map((item, index) => {
					if (!item.id) return
					item.children = this.treeData.filter((subItem, index) => {
						return parseInt(subItem.belongto && subItem.belongto.split(',')[0]) ==
							item.id
					})
					this.getTreeList(item.children)
				})
			},
			getTreeSource(key) {
				var that = this;
				if (!this.form.game) return
				var source = this.dataSource.formData.data['game'].source
				if (source[0].name) {
					var data = source.filter((item, index) => {
						return item.id == this.form.game
					})
					var q = data[0].name
				} else {
					return
				}
				this.$get('/admin/v1/contents/search?type=Category&q=' + q, {}).then(
					response => {
						if (response.retCode == 0) {
							response.data && response.data.map((item) => {
								item.name = item.name + '-' + item.sname
								item.id = item.id + ''
							})
							this.treeData = response.data || [];
							var Node1 = this.treeData && this.treeData.filter((item, index) => {
								return !item.belongto
							})
							Node1.unshift({
								name: 'none',
								id: ''
							})
							this.getTreeList(Node1)
							this.dataSource.formData.data[key] = this.dataSource.formData.data[key] || {}
							this.dataSource.formData.data[key].source = Node1 || [];
							console.log(this.dataSource.formData.data[key].source)
							this.$forceUpdate();
						} else {
							that.$message({
								type: 'warning',
								message: response.message
							});
						}
					})
			},
			getServeData(key, url) {
				if (key == "items" || key == "coins") {
					var key1 = key.split('s')[0]
					var url =
						`/admin/v1/contents/search?type=Product&filter=type:${key1},${key1}&count=-1&q=`
				}
				if (!this.form.game) return
				var source = this.dataSource.formData.data['game'].source
				if (source[0].name) {
					var data = source.filter((item, index) => {
						return item.id == this.form.game
					})
					var q = data[0].name
				} else {
					return
				}
				this.$get(url + q, {}).then(response => {
					if (response.retCode == 0) {
						response.data && response.data.map((item) => {
							item.name = item.name + '-' + item.sname
							item.id = item.id + ''
						})
						this.dataSource.formData.data[key].source = response.data || [];
						this.$forceUpdate();
					} else {
						that.$message({
							type: 'warning',
							message: response.message
						});
					}
				})
			},
			getDataSource(url, key) {
				if (key) var that = this;
				that.$get(url, {}).then(response => {
					if (response.retCode == 0) {
						response.data.map((item) => {
							item.id = item.id + ''
						})
						this.dataSource.formData.data[key].source = response.data || [];
						//						this.getServeData('category');
						//						this.getTreeSource('belongto');
						if (this.dataSource.formData.data[key].required && this.dataSource.formData
							.data[key].source.length == 0) {
							this.$alert('请先创建' + key, '提示', {
								confirmButtonText: '确定',
								callback: action => {
									this.$router.push('/template/Add/' + key.charAt(0).toUpperCase() +
										key.slice(1))
								}
							});
						}
						if (this.$route.query.id) {
							setTimeout(() => {
								for (var key in that.dataSource.formData.data) {
									if (that.dataSource.formData.data[key].isFilter) {
										that.getServeData(key, that.dataSource.formData.data[key].ajaxUrl);
									}
								}
							}, 500)
						}
						this.$forceUpdate();
					} else {
						that.$message({
							type: 'warning',
							message: response.message
						});
					}
				})
			},
			creatEdit(key) {
				var that = this;
				setTimeout(() => {
					this['editor' + key] = new E(this.$refs['editorElem' + key]);
					// 编辑器的事件，每次改变会获取其html内容
					this['editor' + key].customConfig.onchange = html => {
						that.form[key] = html;
					};
					this['editor' + key].create(); // 创建富文本实例
					console.log(this['editor' + key])
					this['editor' + key].txt.html(that.form[key])
				}, 1000)
			},
		},
		mounted() {
			let that = this;
			this.imgUrl = window.imgUrl;
			var menuTrees = JSON.parse(this.store.state.loginData);
			menuTrees.map((item, index) => {
				if (item.name == this.$route.params.key) {
					this.dataSource = item
				}
			})
			for (var key in this.dataSource.formData.data) {
				if (this.dataSource.formData.data[key].required) {
					var text = this.dataSource.formData.data[key].type == "select" || this.dataSource
						.formData.data[key].type == "multiselect" ? "select" : "fill in"
					this.rules[key] = [{
						message: "Place " + text + key,
						required: true,
						trigger: 'blur'
					}]
				}
				this.formData[this.dataSource.formData.data[key].order - 1] = {
					name: key,
					data: this.dataSource.formData.data[key]
				}
				if (this.dataSource.formData.data[key].type == "textarea") {
					this.creatEdit(key);
				}
				if (this.dataSource.formData.data[key].type == "file") {
					this.picType[key] = '1';
				}
				if (this.dataSource.formData.data[key].type == "bool") {
					if (this.form[key]) {
						this.form[key] = true
					} else {
						this.form[key] = false
					}
				}
				if (this.dataSource.formData.data[key].type == "select" || this.dataSource.formData
					.data[key].type == "multiselect") {
					if (this.dataSource.formData.data[key].source.length > 0 && this.dataSource
						.formData.data[key].source[0].indexOf('/') > -1) {
						if (this.dataSource.formData.data[key].source[0].indexOf('q=[[game]]') >
							-1) {
							//							如果初始化数据元带有[game]则需要加个标识为了
							this.dataSource.formData.data[key].isFilter = true;
							this.dataSource.formData.data[key].ajaxUrl = this.dataSource.formData.data[
								key].source[0].split('[[game]]')[0]
							this.categoryUrl = this.dataSource.formData.data[key].source[0].split(
								'[[')[0]
						} else {
							that.getDataSource(this.dataSource.formData.data[key].source[0], key);
						}
					} else {
						this.dataSource.formData.data[key].source.map((item, index) => {
							this.dataSource.formData.data[key].source[index] = {
								id: item,
								value: item,
								name: item
							}
						})
					}
				}
				if (this.dataSource.formData.data[key].type == "tree") {
					that.getTreeSource(key);
				}
				console.log(this.dataSource.formData)
			}
			this.$forceUpdate();
		},
		created() {
			if (this.$route.query.id) {
				this.$get("/admin/v1/content?type=" + this.$route.params.key + "&id=" +
					this.$route.query.id, {}).then(response => {
					if (response.retCode == 0) {
						this.form = response.data;
						this.getPicData();
						for (var key in this.dataSource.formData.data) {
							if (this.dataSource.formData.data[key].type == "select") {
								if (this.form[key]) {
									this.form[key] = this.form[key] && this.form[key].split(',')[0]
								}
							}
							if (this.dataSource.formData.data[key].type == "multiselect") {
								if (this.form[key]) {
									var data = [];
									this.form[key] && JSON.parse(this.form[key]).map((item, index) => {
										data.push(item && item.split(',')[0])
									})
									this.form[key] = data
								}
							}
							if (this.dataSource.formData.data[key].type == "tree") {
								this.form[key] = this.form[key] && parseInt(this.form[key].split(',')[
									0]);
								this.$forceUpdate();
								this.$refs.tree[0].setCurrentKey(this.form[key]);
							}
							if (this.dataSource.formData.data[key].type == "file") {
								if (this.form[key]) {
									this.form[key] = parseInt(this.form[key]);
								}
							}
							this.$forceUpdate();
						}
					} else {
						this.$message({
							message: response.msg,
							type: 'warning'
						})
					}
				})
			} else {
				this.getPicData();
			}
		},
		watch: {
			'form.game': { //深度监听，可监听到对象、数组的变化
				handler(val, oldVal) {
					var that = this;
					if (oldVal && val != oldVal) {
						for (var key in that.dataSource.formData.data) {
							if (that.dataSource.formData.data[key].isFilter) {
								if (that.dataSource.formData.data[key].type == "select") {
									this.form[key] = '';
								} else {
									this.form[key] = [];
								}
								that.getServeData(key, that.dataSource.formData.data[key].ajaxUrl);
							}
						}
					}
				},
				deep: true //true 深度监听
			}
		}
	}
</script>
<style scoped="">
	@import "../../assets/css/add.css";
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
		background-color: #fbfdff;
		border: 1px dashed #c0ccda;
		border-radius: 6px;
	}
	
	/deep/ .el-select > .el-input {
		display: inline-block;
	}
	
	.avatar {
		width: 128px;
		height: 128px;
		display: block;
	}
	
	/deep/ .w-e-text-container {
		z-index: 1999!important;
	}
	
	/deep/ .w-e-menu {
		z-index: 2000!important;
	}
</style>