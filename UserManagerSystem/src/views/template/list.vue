<template>
	<div class="list">
		<el-card class="box-card">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item style="line-height: 33px;">{{$route.params.key}}/List</el-breadcrumb-item>
			</el-breadcrumb>
			<el-button type="primary" class="common-btn" @click.native="$router.push('/template/Add/' + $route.params.key)">Add</el-button>
			<el-button type="primary" style="float: right;" class="common-btn"
			 @click="search">Search</el-button>
			<el-input @input="selfSearch" class="search-input" style="width:340px!important;margin-right: 50px;float: right;"
			 prefix-icon="el-icon-search" v-model="keyword" placeholder="请输入搜索内容"> </el-input>
		</el-card>
		<el-card class="box-card">
			<el-table :data="tableData" width="100%" :default-sort="{prop:'name'}">
				<!--<el-table-column header-align="left" label="选择" width="80px">
					<template slot-scope="scope">
						<el-radio :label="scope.row.yun_id" v-model="selectid">&nbsp;</el-radio>
					</template>
				</el-table-column>-->
				<el-table-column header-align="left" sortable prop="ID" label="ID" width="60px">
				</el-table-column>
				<el-table-column v-for="(item,index) in formData" :key="item.ID"
				 v-if="item&&item.name=='price'" :prop="item&&item.name" :label="item&&item.name"
				 width="120px">
					<template slot-scope="scope">
						<el-input @keyup.enter.native="handleInputConfirm(scope.row.ID,scope.row.price)"
						 style="width:110px" @blur="handleInputClear(scope.row.ID,scope.row.price)"
						 v-model="scope.row.price" :placeholder="'请输入'+item.name"></el-input>
					</template>
				</el-table-column>
				<el-table-column sortable :sortable="item&&item.name=='name'" v-for="(item,index) in formData"
				 :key="item&&item.ID" v-if="item&&item.data.type!='textarea'&&item.data.type!='file'&&item.name!='price'"
				 header-align="left" :prop="item&&item.name" :label="item&&item.name" :width="(item.name=='type'||item.name=='miniNumber'||item.name=='hotItem'||item.name=='online')?'110px':'140px'">
				</el-table-column>
				<el-table-column v-for="(item,index) in formData" :key="item.ID"
				 v-if="item&&item.data.type=='file'" cell-style="text-align:center" header-align="center"
				 :prop="item&&item.name" :label="item&&item.name" width="120px">
					<template slot-scope="scope"> <img v-if="scope.row[item&&item.name]" style="width: 80px;height: 80px;" :src="imgUrl+scope.row[item&&item.name]"
						/> </template>
				</el-table-column>
				<el-table-column sortable prop="updated" sortable label="updateTime" width="160px"
				 cell-class-name="center" header-align="center"> </el-table-column>
				<el-table-column fixed="right" label="operation" min-width="240px"
				 cell-class-name="center" header-align="center">
					<template slot-scope="scope">
						<!--<el-button type="text" size="small" v-if="scope.row.online" @click="handleStatus(scope.row)">{{scope.row.online?'outLine':'online'}}</el-button>-->
						<el-button type="text" size="small" @click="handleEdit(scope.row)">Edit</el-button>
						<el-button type="text" size="small" @click="handleDelete(scope.row)">Delete</el-button>
						<el-button type="text" class="clip" size="small" :data-clipboard-text="getFromData(scope.row)"
						 @click="copy(scope.row.ID)">Copy</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination v-if="notSearch" @size-change="handleSizeChange" @current-change="handleCurrentChange"
			 :current-page.sync="pageNum" :page-sizes="[5, 10, 20, 30]" :page-size="pageSize"
			 layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
		</el-card>
	</div>
</template>
<script>
	import * as types from '@/store/types'
	export default {
		name: 'List',
		data() {
			return {
				type: "name",
				keyword: "",
				tableData: [],
				selectid: null,
				pageNum: 1,
				pageSize: 10,
				total: 0,
				formData: [],
				notSearch: true
			}
		},
		methods: {
			checkSeleted() {
				if (!this.selectid) {
					this.$message({
						message: '请先选择用户!',
						type: 'warning'
					});
					return false;
				}
				return true;
			},
			getFromData(data) {
				var string = data.ID + " " + " " + " " + " " + " " + " " + " "
				this.formData.map((item, index) => {
					if (this.dataSource.formData.data[item.name] && this.dataSource.formData
						.data[item.name].type != "textarea" && this.dataSource.formData.data[
							item.name].type != "file") {
						var str = data[item.name] ? data[item.name] : ''
						string = string + str + " " + " " + " " + " " + " " + " " + " "
					}
				})
				this.formData.map((item, index) => {
					if (this.dataSource.formData.data[item.name] && this.dataSource.formData
						.data[item.name].type == "file") {
						var str = data[item.name] ? data[item.name] : ''
						string = string + str + " " + " " + " " + " " + " " + " " + " "
					}
				})
				string = string + data.updated + " " + " " + " " + " " + " " + " " + " "
				return string
			},
			handleEdit(item) {
				localStorage.setItem('keyword', this.keyword);
				this.$router.push('/template/Add/' + this.$route.params.key + '?id=' + item
					.ID)
			},
			selfSearch() {
				if (!this.keyword) {
					this.pageNum = 1;
					this.queryTable();
					return
				}
				this.notSearch = false;
				this.tableData = JSON.parse(JSON.stringify(this.tableData1)).filter((item,
					index) => {
					return JSON.stringify(item).indexOf(this.keyword) > -1
				})
				console.log(this.tableData)
				this.originTable = JSON.parse(JSON.stringify(this.originTable1)).filter((
					item, index) => {
					return JSON.stringify(item).indexOf(this.keyword) > -1
				})
				this.$forceUpdate();
			},
			handleInputClear(ID, price) {
				this.tableData.map((item, index) => {
					if (item.ID == ID) {
						this.originTable.map((subItem, subIndex) => {
							if (subItem.ID == ID) {
								this.tableData[index].price = this.originTable[subIndex].price;
							}
						})
					}
				})
				this.$forceUpdate();
			},
			handleInputConfirm(ID, price) {
				var that = this;
				var data = this.originTable.filter((item) => item.ID == ID);
				data[0].price = price;
				that.$post("/admin/v1/content/update?type=" + this.$route.params.key +
					"&ID=" + ID, data[0]).then(response => {
					if (response.retCode == 0) {
						that.$message({
							type: 'success',
							message: "Modify success"
						});
						that.search();
					} else {
						that.$message({
							type: 'warning',
							message: response.message
						});
					}
				})
			},
			copy(ID) {
				var that = this;
				//				var clipboard1 = new this.clipboard('.clip')
				//				clipboard1.on('success', e => {
				//					console.log('复制成功')
				//					// 释放内存
				//					clipboard1.destroy()
				//				})
				//				clipboard1.on('error', e => {
				//					// 不支持复制
				//					console.log('该浏览器不支持自动复制')
				//					// 释放内存
				//					clipboard.destroy()
				//				})
				var data = this.originTable.filter((item, index) => {
					return item.ID == ID
				})
				var obj = {}
				for (var key in this.dataSource.formData.data) {
					if (key == "name") {
						obj[key] = data[0][key] + "(复制)"
					} else {
						obj[key] = data.length > 0 && data[0][key]
					}
				}
				that.$post("/admin/v1/content?type=" + this.$route.params.key, obj).then(
					response => {
						if (response.retCode == 0) {
							that.$message({
								type: 'success',
								message: "Copy success"
							});
							that.search();
						} else {
							that.$message({
								type: 'warning',
								message: response.message
							});
						}
					})
			},
			//删除
			handleStatus(item) {
				var url = ''
				if (item.online == "true") {
					url = '/admin/v1/content/reject'
				} else {
					url = '/admin/v1/content/approve'
				}
				this.$post(url + "?type=" + this.$route.params.key + "&ID=" + item.ID, {}).then(
					response => {
						if (response.retCode == 0) {
							this.$message({
								message: '操作成功!',
								type: 'success'
							})
							this.queryTable();
						} else {
							this.$message({
								message: response.msg,
								type: 'warning'
							})
						}
					})
			},
			//删除
			handleDelete(item) {
				this.$delete("/admin/v1/content?type=" + this.$route.params.key + "&ID=" +
					item.ID, {}).then(response => {
					if (response.retCode == 0) {
						this.$message({
							message: '删除成功!',
							type: 'success'
						})
						this.queryTable();
					} else {
						this.$message({
							message: response.msg,
							type: 'warning'
						})
					}
				})
			},
			queryTable() {
				this.$get('/admin/v1/contents?type=' + this.$route.params.key + "&offset=" +
					this.pageNum + "&count=" + this.pageSize, {}).then(response => {
					this.imgUrl = window.imgUrl;
					if (response.retCode == 0) {
						this.notSearch = true;
						this.tableData = response.data || [];
						this.tableData.map((item) => {
							delete item.slug
						})
						this.originTable = JSON.parse(JSON.stringify(this.tableData));
						this.originTable1 = JSON.parse(JSON.stringify(this.tableData));
						this.tableData.sort((a, b) => {
							//排序基于的数据
							return b.updated - a.updated;
						})
						this.tableData && this.tableData.map((item) => {
							for (var key in this.dataSource.formData.data) {
								if (this.dataSource.formData.data[key].type == "select" || this.dataSource
									.formData.data[key].type == "tree") {
									item[key] = item[key] && item[key].split(',')[1]
								}
								if (this.dataSource.formData.data[key].type == "multiselect") {
									var str = ""
									item[key] && JSON.parse(item[key]).map((subItem, index) => {
										if (index == JSON.parse(item[key]).length - 1) {
											var subStr = subItem && subItem.split(',')[1]
										} else {
											var subStr = subItem && subItem.split(',')[1] + ','
										}
										str = str + subStr
									})
									item[key] = str
								}
								if (this.dataSource.formData.data[key].type == "bool") {
									item[key] = item[key] + ''
								}
							}
							item.updated = this.$util.formatTime(item.updated,
								'YYYY-MM-DD HH:mm:ss');
						})
						this.tableData1 = JSON.parse(JSON.stringify(this.tableData))
						this.total = response.meta.total ? parseInt(response.meta.total) : 0;
						if (this.keyword) {
							this.selfSearch();
						}
					} else {
						this.$message({
							type: 'warning',
							message: response.message
						});
					}
				})
			},
			search() {
				if (!this.keyword) {
					this.pageNum = 1;
					this.queryTable();
					return
				}
				this.notSearch = true;
				this.$get('/admin/v1/contents/ss?type=' + this.$route.params.key + "&q=" +
					this.keyword + '&status=public&offset=' + this.pageNum + "&count=" + this
					.pageSize, {}).then(response => {
					if (response.retCode == 0) {
						this.tableData = response.data || [];
						this.tableData.map((item) => {
							delete item.slug
						})
						this.tableData = JSON.parse(JSON.stringify(this.tableData)).filter((
							item, index) => {
							return JSON.stringify(item).indexOf(this.keyword) > -1
						})
						this.originTable = JSON.parse(JSON.stringify(this.tableData));
						this.originTable1 = JSON.parse(JSON.stringify(this.tableData));
						this.tableData.sort((a, b) => {
							//排序基于的数据
							return b.updated - a.updated;
						})
						this.tableData && this.tableData.map((item) => {
							for (var key in this.dataSource.formData.data) {
								if (this.dataSource.formData.data[key].type == "multiselect") {
									var str = ""
									item[key] && JSON.parse(item[key]).map((subItem, index) => {
										if (index == JSON.parse(item[key]).length - 1) {
											var subStr = subItem && subItem.split(',')[1]
										} else {
											var subStr = subItem && subItem.split(',')[1] + ','
										}
										str = str + subStr
									})
									item[key] = str
								}
								if (this.dataSource.formData.data[key].type == "select" || this.dataSource
									.formData.data[key].type == "tree") {
									item[key] = item[key] && item[key].split(',')[1]
								}
								if (this.dataSource.formData.data[key].type == "bool") {
									item[key] = item[key] + ''
								}
							}
							item.updated = this.$util.formatTime(item.updated,
								'YYYY-MM-DD HH:mm:ss')
						})
						this.tableData1 = JSON.parse(JSON.stringify(this.tableData))
						this.total = response.meta.total ? parseInt(response.meta.total) : 0;
					} else {
						this.$message({
							type: 'warning',
							message: response.message
						});
					}
				})
			},
			//选择页数
			handleCurrentChange(val) {
				this.pageNum = val
				if (!this.keyword) {
					this.queryTable();
				} else {
					this.search();
				}
			},
			//选择每页条数
			handleSizeChange(val) {
				this.pageSize = val;
				if (!this.keyword) {
					this.queryTable();
				} else {
					this.search();
				}
			},
		},
		created() {
			var menuTrees = JSON.parse(this.store.state.loginData);
			menuTrees.map((item, index) => {
				if (item.name == this.$route.params.key) {
					this.dataSource = item
				}
			})
			for (var key in this.dataSource.formData.data) {
				this.formData[this.dataSource.formData.data[key].order - 1] = {
					name: key,
					data: this.dataSource.formData.data[key]
				}
			}
			if (localStorage.getItem('keyword')) {
				this.keyword = localStorage.getItem('keyword');
				localStorage.setItem('keyword', '');
			}
			if (localStorage.getItem('pageNum')) {
				this.pageNum = localStorage.getItem('pageNum')*1;
				localStorage.setItem('pageNum', '');
			}
			
			if (localStorage.getItem('pageSize')) {
				this.pageSize = localStorage.getItem('pageSize')*1;
				localStorage.setItem('pageSize', '');
			}
			this.queryTable();
		},
		mounted() {},
		beforeRouteEnter(to, from, next) {
			next((vm) => {
				var array = vm.store.state.keepAliveList || []
				let aliveList = ['Add']
				if (array.indexOf('List') === -1) {
					array.push('List')
					vm.$store.commit(types.KEEPALIVELIST, array);
				}
			})
		},
		beforeRouteLeave(to, from, next) {
			var array = this.store.state.keepAliveList
			let aliveList = ['Add']
			if (aliveList.indexOf(to.name) === -1) {
				array = array.filter((item) => {
					return item !== 'List'
				})
				this.$store.commit(types.KEEPALIVELIST, array);
				
			}else{
						localStorage.setItem("pageNum",this.pageNum)
			localStorage.setItem("pageSize",this.pageSize*1)
			}
	
			next()
		},
	}
</script>
<style>
	@import "../../assets/css/list.css";
	.center {
		text-align: center;
	}
</style>