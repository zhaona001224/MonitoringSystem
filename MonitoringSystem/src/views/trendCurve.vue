<template>
	<div class="contain">
		<div class="tab">
			<div class="li" @click="changeTab(index)" v-for="(item,index) in tabList" :key="index"><span class="li" :class="index==activeIndex?'active':''">
			<img v-if="index===activeIndex" :src="require('../assets/image/faultsInquiries/tab'+(index+1)+'-1.png')"/>
			<img v-else :src="require('../assets/image/faultsInquiries/tab'+(index+1)+'.png')"/>{{item}}
			</span><span v-if="index!==activeIndex&&index!==tabList.length-1" class="split"></span></div>
		</div>
		<div class="box-card">
			<el-row v-if="activeIndex!=1">
				<div> 测点
					<el-select @change="queryTabel" v-model="point" placeholder="请选择">
						<el-option v-for="item in options" :key="item.ID" :label="item.name" :value="item.datakey">
						</el-option>
					</el-select>
				</div> 开始
				<el-date-picker v-model="start" type="datetime" placeholder="选择日期时间"> </el-date-picker> 结束
				<el-date-picker v-model="end" type="datetime" placeholder="选择日期时间">
				</el-date-picker>
				<el-button type="primary" class="common-btn" @click="queryTabel">显示</el-button>
			</el-row>
			<div v-if="tableData.length>0" class="chart" id="myChart"> </div>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'trendCurve',
		data() {
			return {
				tabList: ['历史数据查询', '实时报警查询', '历史报警查询'],
				activeIndex: 1,
				start: '',
				end: '',
				options: [],
				tableData: [],
				point: '',
				echartData: {},
				pointData: {}
			}
		},
		methods: {
			getData() {
				this.$get("/admin/v1/contents?type=Point&offset=-1&count=-1", {}).then(response => {
					this.options = response.data
					this.options.map((item) => {
						this.pointData[item.datakey] = item
					})
					this.point = response.data[0] && response.data[0].datakey
					
				})
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
			changeTab(index) {
				this.activeIndex = index
				if (index === 1) {
					this.tableData = this.$store.state.alarmData.alarms || []
					this.dealData()
				} else {
					this.queryTabel()
				}
			},
			dealData() {
				this.echartData.data1 = []
				this.echartData.data2 = []
				this.echartData.data3 = []
				this.echartData.data4 = []
				this.tableData.map((item) => {
					
					const datetime = new Date(item.timestamp)
					const year = datetime.getFullYear()
					const month = ("0" + (datetime.getMonth() + 1)).slice(-2)
					const date = ("0" + datetime.getDate()).slice(-2)
					const hour = ("0" + datetime.getHours()).slice(-2)
					const minute = ("0" + datetime.getMinutes()).slice(-2)
					const second = ("0" + datetime.getSeconds()).slice(-2)
					item.date = year + "-" + month + '-' + date
					item.time = hour + ':' + minute + ':' + second
					const array = this.pointData[this.point].data.split(',')
					this.echartData.data1.push(item.date + ' ' + item.time)
		
					if(this.activeIndex===0){
						this.echartData.data2.push(item[this.point])
					}else{
						this.echartData.data2.push(item.value)
					}
					
					this.echartData.data3.push(array[0])
					this.echartData.data4.push(array[1])
				})
				if (this.tableData.length > 0) {
					setTimeout(() => {
						this.drawLine()
					}, 500)
				}
			},
			queryTabel() {
				const url = this.activeIndex === 0 ? "/log/history/" : "/alarm/history/"
				this.$get(url + this.point + '?start=' + this.start.getTime() + '&end=' +
					this.end.getTime(), {}).then(response => {
					this.tableData = response.data || []
					this.dealData()
				})
			},
			drawLine() {
				
				console.log(this.echartData)
				let myChart = this.$echarts.init(document.getElementById("myChart"))
				let option = {
					color: ['#ff150a', '#fd9e5e'],
					title: {
						subtext: '单位：m³/h'
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'cross',
							label: {
								backgroundColor: '#fff'
							}
						}
					},
					legend: {
						data: ['报警线', '预警线'],
						left: 'right',
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
					xAxis: [{
						type: 'category',
						boundaryGap: false,
						axisLabel: {
							show: true,
							textStyle: {
								color: '#333',
								fontSize: 14,
								lineHeight: 80,
							}
						},
						data: this.echartData.data1
					}],
					yAxis: [{
						type: 'value',
						axisLabel: {
							show: true,
							textStyle: {
								color: '#333',
								fontSize: 24,
							}
						},
					}],
					series: [{
						name: '',
						type: 'line',
						stack: '总量',
						smooth: true,
						lineStyle: {
							width: 4,
							color: '#3c7cf5'
						},
						showSymbol: false,
						areaStyle: {
							opacity: 0.4,
							color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
								offset: 0.1,
								color: '#3c7cf5'
							}, {
								offset: 1,
								color: '#fff'
							}])
						},
						emphasis: {
							focus: 'series'
						},
						data: this.echartData.data2,
					}, {
						name: '预警线',
						data: this.echartData.data3,
						type: 'line',
						symbolSize: 0,
						lineStyle: {
							color: '#fc8c3a',
							width: 3,
							type: 'dashed'
						}
					}, {
						name: '报警线',
						data: this.echartData.data4,
						type: 'line',
						symbolSize: 0,
						lineStyle: {
							color: '#ff150a',
							width: 3,
							type: 'dashed'
						}
					}]
				};
				myChart.setOption(option);
			}
		},
		created() {
			this.start = new Date(new Date() - 24*60 * 60 * 1000);
			this.end = new Date(); //获取当天23:59:59的时间
			this.getData()
		},
		mounted() {
			const that = this
			this.centrifuge.subscribe("alarmdata", (message)=> {
				console.log(that.activeIndex)
				if (message.data.timestamp && that.activeIndex === 1) {
					
					that.tableData = message.data.alarms || [];
					if(that.point) that.dealData();
					
				}
			});
		},
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
		.chart {
			padding: 0 50px;
			height: 757px;
		}
	}
</style>