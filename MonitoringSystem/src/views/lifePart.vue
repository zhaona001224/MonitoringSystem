<template>
	<div class="contain">
		<div class="tab">
			<div class="left"> <img src="../assets/image/maintenance/img2.png" />
				<div> 寿命件到期提醒 </div>
			</div>
			<div class="right">
				<div class="li" v-for="(item,index) in warmList">
					<div class="text"><img src="../assets/image/maintenance/warning.png" /> 水泵润滑油补充 </div>
					<div class="btn">确认</div>
				</div>
			</div>
		</div>
		<div class="box-card">
			<el-table :data="tableData" width="100%">
				<el-table-column align="center" header-align="center" prop="id" label="编号" width="200px">
				</el-table-column>
				<el-table-column align="center" prop="name" label="零件名称"
				 width="400px" cell-class-name="center" header-align="center"> </el-table-column>
				<el-table-column align="center" prop="quantity" label="装机数"
				 width="230px" cell-class-name="center" header-align="center"> </el-table-column>
				<el-table-column align="center" prop="life" label="寿命 （年）"
				 width="230px" cell-class-name="center" header-align="center"> </el-table-column>
				<el-table-column align="center" prop="start" label="更换日期"
				 width="250px" cell-class-name="center" header-align="center"> </el-table-column>
				 <el-table-column align="center" prop="end" label="下次更换日期"
				 width="250px" cell-class-name="center" header-align="center"> </el-table-column>
			</el-table>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'maintenance',
		data() {
			return {
				warmList: [{}],
				tableData: [],
				pageNum: 1,
				pageSize: 10,
				total: 0
			}
		},
		methods: {
			//选择页数
			handleCurrentChange(val) {
				this.pageNum = val
				this.queryTable();
			},
			//选择每页条数
			handleSizeChange(val) {
				this.pageSize = val;
				this.queryTable();
			},
			queryTabel() {
				this.$get("/admin/v1/contents?type=Lifepart", {}).then(response => {
					this.tableData = response.data
				})
			}
		},
		created() {
			this.queryTabel()
		}
	}
</script>
<style lang="less" scoped>
	.contain {
		padding: 2px 21px;
		.tab {
			display: flex;
			width: 1566px;
			background-color: #ffffff;
			box-shadow: -2px 4px 30px 0px rgba(64, 129, 255, 0.08);
			border-radius: 3px;
			.left {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				width: 200px;
				height: 201px;
				background-color: #edf8fd;
				border-radius: 3px;
				color: #666666;
				font-size: 18px;
				& > div {
					margin-top: 10px;
				}
			}
			.right {
				display: flex;
				flex-wrap: nowrap;
				padding: 36px;
				min-height: 129px;
			}
			.li {
				display: flex;
				padding: 0 20px;
				min-width: 520px;
				height: 58px;
				background-color: #f7f7f7;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 12px;
				.text {
					display: flex;
					align-items: center;
					font-size: 22px;
					color: #333;
					img {
						margin-right: 5px;
					}
				}
				.btn {
					width: 94px;
					height: 40px;
					background-color: #5ac462;
					box-shadow: 3px 4px 10px 0px rgba(90, 196, 98, 0.5);
					border-radius: 4px;
					font-size: 22px;
					text-align: center;
					line-height: 40px;
					color: #fff;
				}
			}
		}
		.box-card {
			margin-top: 20px;
			box-shadow: -2px 4px 30px 0px rgba(64, 129, 255, 0.08);
			border-radius: 3px;
		}
	
	}
</style>