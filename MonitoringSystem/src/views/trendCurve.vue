<template>
	<div class="contain">
		<div class="tab">
			<div class="li" @click="activeIndex=index" v-for="(item,index) in tabList" :key="index"><span class="li" :class="index==activeIndex?'active':''">
			<img v-if="index===activeIndex" :src="require('../assets/image/faultsInquiries/tab'+(index+1)+'-1.png')"/>
			<img v-else :src="require('../assets/image/faultsInquiries/tab'+(index+1)+'.png')"/>
			{{item}}
			</span><span v-if="index!==activeIndex&&index!==tabList.length-1" class="split"></span></div>
		</div>
		<div class="box-card">
			<el-row>
				<div v-if="activeIndex==0"> 测点
					<el-select v-model="value" placeholder="请选择">
						<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</div> 开始
				<el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="start" type="datetime"
				 placeholder="选择日期时间"> </el-date-picker> 结束
				<el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="end"
				 type="datetime" placeholder="选择日期时间"> </el-date-picker>
				<el-button type="primary" class="common-btn" @click="query">显示</el-button>
			</el-row>
			<div class="chart" id="myChart"> </div>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'trendCurve',
		data() {
			return {
				tabList: ['历史数据查询', '实时报警查询', '历史报警查询'],
				activeIndex: 0,
				start: '',
				end: '',
				options: [],
				value: ''
			}
		},
		methods: {
			query() {},
			drawLine() {
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
						data: ['2020/06/11 14:00', '2020/06/11 14:58', '2020/06/11 14:58',
							'2020/06/11 14:58', '2020/06/11 14:59', '2020/06/11 13:02',
							'2020/06/11 13:06'
						]
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
						data: [140, 232, 101, 264, 90, 340, 250],
					}, {
						name: '预警线',
						data: [100, 100, 100, 100, 100, 100, 100],
						type: 'line',
						symbolSize: 0,
						lineStyle: {
							color: '#fc8c3a',
							width: 3,
							type: 'dashed'
						}
					}, {
						name: '报警线',
						data: [300, 300, 300, 300, 300, 300, 300],
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
		mounted() {
			this.drawLine()
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
		.chart {
			padding: 0 50px;
			height: 757px;
		}
	}
</style>