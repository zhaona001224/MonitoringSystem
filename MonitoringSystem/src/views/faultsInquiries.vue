<template>
	<div class="contain">
		<div class="tab">
			<div class="li" @click="changeTab(index)" v-for="(item,index) in tabList" :key="index"><span class="li" :class="index==activeIndex?'active':''">
			<img v-if="index===activeIndex" :src="require('../assets/image/faultsInquiries/tab'+(index+1)+'-1.png')"/>
			<img v-else :src="require('../assets/image/faultsInquiries/tab'+(index+1)+'.png')"/>
			{{item}}
			</span><span v-if="index!==activeIndex&&index!==tabList.length-1" class="split"></span></div>
		</div>
		<div class="box-card">
			<el-row v-if="activeIndex!==1">
				<div v-if="activeIndex==0"> 测点
					<el-select v-model="point" placeholder="请选择">
						<el-option v-for="item in options" :key="item.ID" :label="item.name" :value="item.ID">
						</el-option>
					</el-select>
				</div> 开始
				<el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="start" type="datetime"
				 placeholder="选择日期时间"> </el-date-picker> 结束
				<el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="end"
				 type="datetime" @change="judgeTime" placeholder="选择日期时间"> </el-date-picker>
				<el-button type="primary" class="common-btn" @click="queryTabel">查询</el-button>
			</el-row>
			<div class="table" v-if="activeIndex==0">
				<el-table :data="tableData" width="100%">
					<el-table-column align="center" header-align="center" prop="id" label="编号" width="200px">
					</el-table-column>
					<el-table-column align="center" prop="updated" label="日期"
					 width="200px" cell-class-name="center" header-align="center"> </el-table-column>
					<el-table-column align="center" prop="updated" label="时间"
					 width="200px" cell-class-name="center" header-align="center"> </el-table-column>
					<el-table-column align="center" prop="updated" label="测点"
					 width="530px" cell-class-name="center" header-align="center"> </el-table-column>
					<el-table-column align="center" prop="updated" label="运行值"
					 width="360px" cell-class-name="center" header-align="center"> </el-table-column>
				</el-table>
			</div>
			<div class="box-card" v-if="activeIndex==1">
				<el-table :data="tableData" width="100%">
					<el-table-column align="center" header-align="center" prop="id" label="编号" width="100px">
					</el-table-column>
					<el-table-column align="center" prop="updated" label="日期"
					 width="200px" cell-class-name="center" header-align="center"> </el-table-column>
					<el-table-column align="center" prop="updated" label="时间"
					 width="200px" cell-class-name="center" header-align="center"> </el-table-column>
					<el-table-column align="center" prop="name" label="报警内容"
					 width="430px" cell-class-name="center" header-align="center"> </el-table-column>
					<el-table-column align="center" prop="type" label="报警级别"
					 width="260px" cell-class-name="center" header-align="center"> </el-table-column>
					<el-table-column label="处理措施" min-width="140px" cell-class-name="center"
					 header-align="center">
						<template slot-scope="scope">
							<div class="fix">预防检修 </div>
							<div class="fix1">故障排除 </div>
						</template>
					</el-table-column>
					<el-table-column label="故障确认" min-width="140px" cell-class-name="center" header-align="center">
						<template slot-scope="scope">
							<div class="confirm">确认 </div>
						</template>
					</el-table-column>
				</el-table>
			
			</div>
			<div class="box-card" v-if="activeIndex==2">
				<el-table :data="tableData" width="100%">
					<el-table-column align="center" header-align="center" prop="id" label="编号" width="200px">
					</el-table-column>
					<el-table-column align="center" prop="updated" label="日期"
					 width="200px" cell-class-name="center" header-align="center"> </el-table-column>
					<el-table-column align="center" prop="updated" label="时间"
					 width="200px" cell-class-name="center" header-align="center"> </el-table-column>
					<el-table-column align="center" prop="updated" label="报警内容"
					 width="530px" cell-class-name="center" header-align="center"> </el-table-column>
					<el-table-column align="center" prop="updated" label="报警级别"
					 width="360px" cell-class-name="center" header-align="center"> </el-table-column>
				</el-table>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'parameterMon',
		data() {
			return {
				tabList: ['历史数据查询', '实时报警查询', '历史报警查询'],
				activeIndex: 0,
				tableData: [{
					updated: '1201221',
					id: 1
				}],
				pageNum: 1,
				pageSize: 10,
				start: '',
				end: '',
				total: 0,
				options: [],
				point: ''
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
			//校验时间格式
			judgeTime() {
				if (!this.start || !this.end) return
				const time1 = this.start.getTime()
				const time2 = this.end.getTime()
				if (time1 - time2 > 0) {
					this.$message({
						type: 'warning',
						message: "开始时间不能大于结束时间"
					});
				}
			},
			queryTabel() {
				const param=encodeURI("point:"+this.point+" start:"+this.start+' end:'+this.end)
				this.$get("/admin/v1/contents?type=Logs&count=-1&&q="+param, {
				}).then(response => {
					this.tableData =response.data||[]
					this.total = response.meta.total
				})
			},
			getBaseData(){
				this.$get("/admin/v1/contents?type=Point&offset=-1&count=-1", {}).then(
					response => {
						this.options=response.data
						
					})
			},
			changeTab(index){
				this.activeIndex=index
				if(index===1){
this.tableData=this.$store.state.alarmData.alarms||[]
this.tableData.map((item)=>{
item.updated = this.$util.formatTime(item.updated,
								'YYYY-MM-DD HH:mm:ss');
})

				}else{
					this.queryTabel()
				}
			}
		},
		created() {
			this.getBaseData()
			// this.queryTabel()
		}
	}
</script>
<style lang="less" scoped>
	.contain {
		padding: 2px 21px;
		.tab {
			display: flex;
			align-items: center;
			width: 1566px;
			background-color: #ffffff;
			box-shadow: -2px 4px 30px 0px rgba(64, 129, 255, 0.08);
			border-radius: 3px;
			.li {
				display: flex;
				height: 59px;
				align-items: center;
				width: 250px;
				text-align: center;
				font-size: 20px;
				color: #b3b3b3;
				justify-content: center;
				img {
					margin-right: 8px;
				}
				&.active {
					background-color: #229ffe;
					border-radius: 3px;
					color: #fff;
				}
			}
			.split {
				display: block;
				width: 1px;
				height: 26px;
				background: #d2d2d2;
			}
		}
		.box-card {
			margin-top: 20px;
			box-shadow: -2px 4px 30px 0px rgba(64, 129, 255, 0.08);
			border-radius: 3px;
		}
		.el-row {
			padding: 24px 0;
			padding-left: 20px;
			display: flex;
			align-items: center;
		}
		.fix {
			color: #fff;
			text-align: center;
			font-size: 20px;
			line-height: 40px;
			width: 119px;
			height: 40px;
			background-color: #229ffe;
			box-shadow: 3px 4px 10px 0px rgba(34, 159, 254, 0.5);
			border-radius: 4px;
		}
		.fix1 {
			color: #fff;
			text-align: center;
			font-size: 20px;
			line-height: 40px;
			width: 119px;
			height: 40px;
			background-color: #fe4e46;
			box-shadow: 3px 4px 10px 0px rgba(254, 51, 90, 0.5);
			border-radius: 4px;
		}
		.confirm {
			color: #fff;
			text-align: center;
			font-size: 20px;
			line-height: 40px;
			width: 94px;
			height: 40px;
			background-color: #5ac462;
			box-shadow: 3px 4px 10px 0px rgba(90, 196, 98, 0.5);
			border-radius: 4px;
		}
		/deep/ .el-table th {
			background-color: #f7f7f7!important;
		}
		.common-btn {
			width: 140px;
			height: 50px;
			background-image: linear-gradient(90deg, rgba(87, 185, 255, 0.5) 0%, rgba(115, 118, 247, 0.5) 100%, rgba(115, 155, 247, 0.5) 100%), linear-gradient( #57b9ff, #57b9ff);
			border-radius: 25px;
			font-size: 22px;
			color: #f6f7fb;
		}
	}
</style>