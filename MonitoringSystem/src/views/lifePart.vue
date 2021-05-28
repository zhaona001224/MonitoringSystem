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
					<el-table-column align="center" prop="name" label="零件名称" width="610px" cell-class-name="center"
					 header-align="center"> </el-table-column>
					<el-table-column align="center" prop="quantity" label="装机数"
					 width="216px" cell-class-name="center" header-align="center"> </el-table-column>
					<el-table-column align="center" label="寿命 （月）" width="216px"
					 cell-class-name="center" header-align="center">
						<template slot-scope="scope">
							<div style="line-height: 63px;font-size: 22px;    color: #4081ff;
" @click="fix(scope.row,1)">{{scope.row.life}}</div>
						</template>
					</el-table-column>
					<el-table-column align="center" label="更换日期" width="280px" cell-class-name="center"
					 header-align="center">
						<template slot-scope="scope">
							<div style="line-height: 63px;font-size: 22px;    color: #4081ff;
" @click="fix(scope.row,1)">{{scope.row.target}}</div>
						</template>
					</el-table-column>
					<el-table-column align="center" prop="next" label="下次更换日期" width="280px" cell-class-name="center"
					 header-align="center"> </el-table-column>
				</el-table>
			</div>
		</div>
		<el-dialog title="" :visible.sync="showTip" width="33%">
			<div style="font-size: 16px;  color: #000;margin-bottom: 10px;"> {{ activeObj.name }} </div>
			<div style="margin-bottom: 30px;" v-if="type!=1">上述维护工作已完成？</div>
			<div style="margin-bottom: 20px; align: center"> <span style="width: 116px; display: inline-block">口令</span>
				<el-input style="width: 260px; height: 40px"
				 v-model="activeObj.pass" type="password" placeholder="请输入口令"></el-input>
			</div>
			<div style="margin-bottom: 20px; align: center"> <span style="width: 116px; display: inline-block">装机数</span>
				<el-input style="width: 260px; height: 40px"
				 v-model="activeObj.quantity" type="number" placeholder="请输入装机数"></el-input>
			</div>
			<div style="margin-bottom: 20px; align: center"> <span style="width: 116px; display: inline-block">寿命</span>
				<el-input style="width: 260px; height: 40px"
				 v-model="activeObj.life" @change="changeDate" type="number" placeholder="请输入寿命"></el-input>
			</div>
			<div> <span style="margin-bottom:30px;width: 116px; display: inline-block">更换日期</span>
				<el-date-picker style="width: 260px; height: 40px" v-model="activeObj.target"
				 @change="changeDate" type="date" placeholder="选择更换日期" value-format="yyyy-MM-dd">
				</el-date-picker>
			</div>
			<div style=" align: center"> <span style="width: 116px; display: inline-block">下次更换日期</span>
				<el-input readonly
				 style="width: 260px; height: 40px" v-model="activeObj.next" placeholder="下次更换日期"></el-input>
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
				activeObj: {},
				type: ''
			};
		},
		methods: {
			fix(item, type) {
				this.activeObj = item;
				this.showTip = true;
				this.type = type
			},
			changeDate() {
				const end = new Date(this.activeObj.target)
				this.activeObj.next = new Date(end.setMonth(end.getMonth() + this.activeObj
					.life * 1))
				const year = this.activeObj.next.getFullYear()
				const month = ("0" + (this.activeObj.next.getMonth() + 1)).slice(-2)
				const date = ("0" + this.activeObj.next.getDate()).slice(-2)
				this.activeObj.next = year + "-" + month + '-' + date
			},
			sendData() {
				if (!this.activeObj.pass) {
					this.$message({
						message: "请输入口令!",
						type: "warning",
					});
					return
				} else {
					this.$post("/api/v1/auth", {
						user: localStorage.userName,
						pass: this.activeObj.pass
					}).then(response => {
							if (response.retCode == 0) {
								if (!this.activeObj.quantity) {
									this.$message({
										message: "请填写数量!",
										type: "warning",
									});
									return
								}
								if (!this.activeObj.life) {
									this.$message({
										message: "请填写寿命!",
										type: "life",
									});
									return
								}
								if (!this.activeObj.target) {
									this.$message({
										message: "请选择日期!",
										type: "warning",
									});
									return
								}
								this.activeObj.quantity = this.activeObj.quantity * 1
								this.activeObj.life = this.activeObj.life * 1
								var obj = {
									cmd: "cmd",
									alarmclass: "L",
									data: JSON.stringify(this.activeObj),
								};
								const that = this;
								if (this.type === 1) {
									this.$post("/admin/v1/content/update?type=Lifepart&ID=" + this.activeObj
										.id, {
											next: this.activeObj.next,
											target: this.activeObj.target,
											quantity: this.activeObj.quantity,
											life: this.activeObj.life,
										}).then(response => {
										if (response.retCode == 0) {
											this.showTip = false;
											that.$message({
												message: "操作成功!",
												type: "success",
											});
											that.activeObj = {}
										} else {
											that.$message({
												type: 'warning',
												message: response.message
											});
										}
									})
								} else {
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
								}
							} else {
								that.$message({
									type: 'warning',
									message: '口令错误'
								});
							}
						
					})
			}
		},
	},
	mounted() {
		const that = this
		this.centrifuge.subscribe("alarmdata", function(message) {
			if (message.data.timestamp) {
				console.log(message.data.lifes)
				that.alarmData = message.data.lifes;
				that.tableData = message.data.lifes.filter((item) => !item.isWarning) || []
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