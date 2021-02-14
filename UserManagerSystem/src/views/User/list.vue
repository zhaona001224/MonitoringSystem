<template>
	<div class="list">
		<el-card class="box-card">
			<el-button type="primary" class="common-btn" @click.native="$router.push('/User/Add')">Add</el-button>
			<el-button type="primary" style="float: right;" class="common-btn"
			 @click="search">Search</el-button>
			<el-input class="search-input" style="width:340px!important;margin-right: 50px;float: right;"
			 prefix-icon="el-icon-search" v-model="keyword" placeholder="请输入搜索内容"> </el-input>
		</el-card>
		<el-table :data="tableData" width="100%">
			<el-table-column header-align="left" sortable prop="id" label="id"> </el-table-column>
			<el-table-column header-align="left" prop="email" label="email">
			</el-table-column>
			<el-table-column header-align="left" prop="admin" label="admin">
			</el-table-column>
			<el-table-column label="operation" width="240px" cell-class-name="center"
			 header-align="center">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="handleEdit(scope.row)">Edit</el-button>
					<el-button type="text" size="small" @click="handleDelete(scope.row)">Delete</el-button>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>
<script>
	export default {
		name: 'User',
		data() {
			return {
				keyword: "",
				tableData: [],
			}
		},
		methods: {
			search() {
				this.$post('/admin/v1/user/search?q=' + this.keyword, {}).then(response => {
					if (response.retCode == 0) {
						this.tableData = response.data || [];
						this.tableData.map((item) => {
							delete item.slug
						})
						this.tableData = JSON.parse(JSON.stringify(this.tableData)).filter((
							item, index) => {
							return JSON.stringify(item).indexOf(this.keyword) > -1
						})
						this.tableData && this.tableData.map((item) => {
							item.admin = item.Perm.admin + ""
						})
						this.$forceUpdate();
					} else {
						this.$message({
							type: 'warning',
							message: response.message
						});
					}
				})
			},
			handleEdit(item) {
				localStorage.setItem("userData", JSON.stringify(item))
				this.$router.push('/User/Modify')
			},
			//删除
			handleDelete(item) {
				this.$delete("/admin/v1/user/remove", {
					email: item.email
				}).then(response => {
					if (response.retCode == 0) {
						this.$message({
							message: '删除成功!',
							type: 'success'
						})
						window.location.reload();
					} else {
						this.$message({
							message: response.msg,
							type: 'warning'
						})
					}
				})
			},
		},
		created() {},
		mounted() {},
		actived() {
			this.resetDatas();
		}
	}
</script>
<style>
	@import "../../assets/css/list.css";
	.center {
		text-align: center;
	}
</style>