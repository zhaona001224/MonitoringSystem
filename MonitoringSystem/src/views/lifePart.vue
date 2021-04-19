<template>
	<div class="contain">
		<div class="tab">
			<div class="left"> <img src="../assets/image/maintenance/img2.png" />
				<div>寿命件到期提醒</div>
			</div>
			<div class="right">
				<div class="li" v-if="item.isWarning" v-for="(item, index) in alarmData" :key="index">
					<div class="text"> <img src="../assets/image/maintenance/warning.png" /> {{ item.name }} </div>
					<div class="btn" @click="fix(item)">确认</div>
				</div>
			</div>
		</div>
		<div class="box-card scroll-wrapper" ref="bscroll">
			<div>
				<el-table :data="tableData" width="100%">
					<el-table-column align="center" prop="name" label="零件名称" width="400px" cell-class-name="center"
					 header-align="center"> </el-table-column>
					<el-table-column align="center" prop="quantity" label="装机数"
					 width="230px" cell-class-name="center" header-align="center"> </el-table-column>
					<el-table-column align="center" prop="life" label="寿命 （月）"
					 width="230px" cell-class-name="center" header-align="center"> </el-table-column>
					<el-table-column align="center" prop="target" label="更换日期"
					 width="230px" cell-class-name="center" header-align="center"> </el-table-column>
					<el-table-column align="center" prop="next" label="下次更换日期"
					 width="230px" cell-class-name="center" header-align="center"> </el-table-column>
				</el-table>
			</div>
		</div>
		<el-dialog title="" :visible.sync="showTip" width="30%">
			<div style="font-size: 16px;  color: #000;margin-bottom: 10px;"> {{ activeObj.name }} </div>
			<div style="margin-bottom: 30px;">上述维护工作已完成？</div>
			<div style="margin-bottom: 20px; align: center"> <span style="width: 66px; display: inline-block">周期</span>
				<el-input style="width: 280px; height: 40px"
				 v-model="activeObj.duration" @change="changeDate" type="number" placeholder="请输入周期"></el-input>
			</div>
			<div> <span style="margin-bottom:30px;width: 66px; display: inline-block">保养日期</span>
				<el-date-picker style="width: 280px; height: 40px" v-model="activeObj.start"
				 @change="changeDate" type="date" placeholder="选择保养日期" value-format="yyyy-MM-dd">
				</el-date-picker>
			</div>
			<div style=" align: center"> <span style="width: 66px; display: inline-block">周期</span>
				<el-input readonly
				 style="width: 280px; height: 40px" v-model="activeObj.end" placeholder="下次保养结束时间"></el-input>
			</div> <span slot="footer" class="dialog-footer">
        <el-button @click="showTip = false">取 消</el-button>
        <el-button type="primary" @click="sendData">确 定</el-button>
      </span> </el-dialog>
	</div>
</template>
<script>
	import BScroll from "better-scroll";
	export default {
		name: "LifePart",
		components: {
			BScroll,
		},
		data() {
			return {
				tableData: [],
				pageNum: 1,
				pageSize: 10,
				total: 0,
				scroll: "",
				alarmData: [],
				showTip: false,
				activeObj:{}
			};
		},
		methods: {
			fix(item) {
				this.activeObj = item;
				this.showTip = true;
			},
			changeDate() {
				const end = new Date(this.activeObj.start)
				this.activeObj.end = new Date(end.setMonth(end.getMonth() + this.activeObj.duration *
					1))
				const year = this.activeObj.end.getFullYear()
				const month = ("0" + (this.activeObj.end.getMonth() + 1)).slice(-2)
				const date = ("0" + this.activeObj.end.getDate()).slice(-2)
				this.activeObj.end = year + "-" + month + '-' + date
			},
			sendData() {
				if (!this.activeObj.duration) {
					this.$message({
						message: "请填写周期!",
						type: "warning",
					});
					return
				}
				if (!this.activeObj.start) {
					this.$message({
						message: "请选择日期!",
						type: "warning",
					});
					return
				}
				var obj = {
					cmd: "cmd",
					alarmclass: "L",
					data: JSON.stringify(this.activeObj),
				};
				const that = this;
				this.centrifuge.publish("alarmdata", obj).then(function(res) {
					that.showTip = false;
					that.$message({
						message: "操作成功!",
						type: "success",
					});
					that.activeObj = {}
				}, function(err) {
					console.log("publish error", err);
				});
			},
		},
		mounted() {
			const that = this
			this.centrifuge.subscribe("alarmdata", function(message) {
				if (message.data.timestamp) {
					console.log(message.data.lifes)
					that.alarmData = message.data.lifes;
					that.tableData = message.data.lifes.filter((item) => !item.IsWarning) || []
				}
			});
		}
	};
</script>
<style lang="less" scoped>
	.contain {
		padding: 2px 21px;
		height: 950px;
		overflow-x: hidden;
		overflow-y: auto;
		.tab {
			display: flex;
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
				flex-shrink: 0;
				& > div {
					margin-top: 10px;
				}
			}
			.right {
				display: flex;
				flex-wrap: wrap;
				padding: 36px;
				max-height: 129px;
				overflow-y: auto;
				justify-content: space-between;
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
			height: 728px;
			overflow-y: hidden;
		}
	}
</style>