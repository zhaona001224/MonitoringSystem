<template>
	<div class="contain">
		<div class="tab">
			<div class="left"> <img src="../assets/image/maintenance/img1.png" />
				<div>维护保养提醒</div>
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
					<el-table-column align="center" prop="name" label="维保内容" width="810px" cell-class-name="center"
					 header-align="center"> </el-table-column>
					<el-table-column align="center" prop="duration" label="保养周期"
					 width="230px" cell-class-name="center" header-align="center"> </el-table-column>
					<el-table-column align="center" prop="start" label="保养日期"
					 width="250px" cell-class-name="center" header-align="center"> </el-table-column>
					<el-table-column align="center" prop="end" label="下次保养日期"
					 width="250px" cell-class-name="center" header-align="center"> </el-table-column>
				</el-table>
			</div>
		</div>
		<el-dialog title="" :visible.sync="showTip" width="33%">
			<div style="font-size: 16px;  color: #000;margin-bottom: 10px;"> {{ activeObj.name }} </div>
			<div style="margin-bottom: 30px;">上述维护工作已完成？</div>
			<div style="margin-bottom: 20px; align: center"> <span style="width: 116px; display: inline-block">周期</span>
				<el-input style="width: 260px; height: 40px"
				 v-model="activeObj.duration" @change="changeDate" type="number" placeholder="请输入周期"></el-input>
			</div>
			<div> <span style="margin-bottom:30px;width: 116px; display: inline-block">保养日期</span>
				<el-date-picker style="width: 260px; height: 40px"
				 v-model="activeObj.start" @change="changeDate"  type="date" placeholder="选择保养日期" value-format="yyyy-MM-dd"> </el-date-picker>
			</div>
			<div style=" align: center"> <span style="width: 116px; display: inline-block">下次保养结束时间</span>
				<el-input readonly style="width: 260px; height: 40px"
				 v-model="activeObj.end" placeholder="下次保养结束时间"></el-input>
			</div>
			<span slot="footer" class="dialog-footer">
        <el-button @click="showTip = false">取 消</el-button>
        <el-button type="primary" @click="sendData">确 定</el-button>
      </span> </el-dialog>
	</div>
</template>
<script>
	import BScroll from "better-scroll";
	export default {
		name: "maintenance",
		components: {
			BScroll,
		},
		data() {
			return {
				warmList: [],
				tableData: [],
				showTip: false,
				alarmData: [],
				activeObj: {}
			};
		},
		methods: {
			fix(item) {
				this.activeObj = item;
				this.showTip = true;
			},
			changeDate(){
				const end = new Date(this.activeObj.start)
				this.activeObj.end = new Date(end.setMonth(end.getMonth() +this.activeObj.duration * 1))
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
					alarmclass: "M",
					data: JSON.stringify(this.activeObj)
				};
				const that = this;
				debugger
				this.centrifuge.publish("alarmdata", obj).then(function(res) {
					that.showTip = false;
					that.$message({
						message: "操作成功!",
						type: "success",
					});
					that.activeObj={}
				}, function(err) {
					console.log("publish error", err);
				});
			},
		},
		mounted() {
			const that = this;
			this.centrifuge.subscribe("alarmdata", function(message) {
				if (message.data.timestamp) {
					console.log(message.data.maintains)
					that.alarmData = message.data.maintains;
					that.tableData = message.data.maintains.filter((item) => !item.isWarning) || []
				}
			});
		}
	};
</script>
<style lang="less" scoped>
	.contain {
		padding: 2px 21px;
		/deep/ .el-date-editor--datetime .el-input__inner {
			height: 40px;
		}
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
				flex-shrink: 0;
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
			height: 740px;
			overflow-y: auto;
		}
	}
</style>