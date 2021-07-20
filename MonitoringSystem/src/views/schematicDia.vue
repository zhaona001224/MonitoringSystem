<template>
	<div class="contain">
		<viewer :options="options" @inited="inited" ref="viewer" :images="imgShow" v-if="imgShow.length>0">
		<img style="display: none;" v-for="(item,index) in imgShow" :src="item" :key="index"
			/> </viewer>
		<div class="left"  ref="imageDom" v-if="rightList[activeIndex]">
		<img @click="clickGeneratePicture" :src="require('@/assets/image/schematicDia/'+(rightList[activeIndex].name)+'-Model.jpg')"
			/>
			<div :class="item.location[1]>0.8?'absolute-style left-style':'absolute-style'"
			 v-if="item.location&&!item.notShow" :style="'top:'+item.location[0]*100+'%;left:'+item.location[1]*100+'%'"
			 v-for="(item,index) in rightList[activeIndex]&&rightList[activeIndex].deviceList">
				<!--<img class="device-img" v-if="item.pic" :src="imgUrl+item.pic" />-->
				<div>
					<div class="tip green" v-if="item.point">
						<div class="tip-left"> <img v-if="!item.isWarning" src="../assets/image/schematicDia/greencheck.png"
							/> <img v-else src="../assets/image/schematicDia/redwarning.png" /> </div>
						<div class="tip-right">
							<div @click.stop="queryTabel(subItem)" v-for="(subItem,subIndex) in item.point">
								<div class="blink" v-if="alarmData[subItem.datakey]"> {{alarmData[subItem.datakey].name}} </div>
								<div> {{subItem.name}} {{$store.state.baseData[subItem.offset]?$store.state.baseData[subItem.offset]:'--'}}{{subItem.unit}}
									</div>
							</div>
						</div>
						<div class="close" @click="changeStatus(index)">×</div>
					</div>
				</div>
			</div>
			<div class="pop" @click="showTable=false" v-if="showTable">
				<div class="close" @click="showTable=false">×</div>
				<div class="container" @click.stop="">
					<div class="title">{{activeTitle}}</div>
					<div class="chart" id="myChart"> </div>
				</div>
			</div>
		</div>
		<div class="right">
			<div class="title"> 所属系统 </div>
			<div :key="item.id" @click="activeIndex=index" v-for="(item,index) in rightList">
				<div :class="index===activeIndex?'li active':'li'"> {{item.fullname}} </div>
				<div class="split" v-if="index!==activeIndex"></div>
			</div>
		</div>
	</div>
</template>
<script>
	import html2canvas from "html2canvas"
	export default {
		name: 'schematicDia',
		data() {
			return {
				rightList: [],
				activeIndex: 1,
				pointList: {},
				imgShow: [],
				showTable: false,
				activeTitle: '',
				options: {
					"button": false,
					"navbar": false,
					"title": false,
					"toolbar": false,
					"tooltip": false,
					"movable": true,
					"zoomable": true,
					"rotatable": true,
					"scalable": true,
					"transition": true,
					"fullscreen": true
				},
				echartData: {},
				alarmData: {}
			}
		},
		methods: {
			inited(viewer) {
				this.$viewer = viewer
			},
			close() {
				this.imgShow = []
			},
			changeStatus(index, str) {
				this.rightList[this.activeIndex].deviceList[index].notShow = !this.rightList[this.activeIndex].deviceList[index].notShow
				this.$forceUpdate()
			},
			judge() {
				this.rightList.map((item, index) => {
					item.deviceList.map((subItem, index) => {
						subItem.point && subItem.point.map((childItem, index) => {
							if (this.alarmData[childItem.datakey]) {
								subItem.isWarning = true
							}
						})
					})
				})
			},
			queryTabel(item) {
				this.start = new Date(new Date() - 5 * 60 * 1000);
				this.activeTitle = item.name
				this.end = new Date(); //获取当天23:59:59的时间
				const url = "/log/history/"
				this.$get(url + item.datakey + '?start=' + this.start.getTime() + '&end=' +
					this.end.getTime(), {}).then(response => {
					this.tableData = response.data || []
					this.dealData(item)
				})
			},
			dealData(obj) {
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
					const array = this.pointList[obj.ID].data.split(',')
					this.echartData.data1.push(item.date + ' ' + item.time)
					this.echartData.data2.push(item[obj.datakey])
					this.echartData.data3.push(array[0])
					this.echartData.data4.push(array[1])
				})
				this.showTable = true
				if (this.tableData.length > 0) {
					setTimeout(() => {
						this.drawLine()
					}, 500)
				}
			},
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
			},
			getBaseData() {
				this.$get("/admin/v1/contents?type=Point&offset=-1&count=-1", {}).then(
					response => {
						response.data.map((item) => {
							this.pointList[item.ID] = item
						})
					})
				this.$get("/admin/v1/contents?type=Subsys&offset=-1&count=-1", {}).then(
					response => {
						this.imgUrl = window.imgUrl
						response.data.sort((a, b) => {
							//排序基于的数据
							return a.ID - b.ID;
						})
						response.data.map((item) => {
							item.deviceList = []
							if (item.devices) {
								var array = []
								JSON.parse(item.devices).map((subItem) => {
									array.push(subItem.split(',')[0])
								})
								item.devices = array
							}
						})
						this.rightList = response.data
					}).then(() => {
					this.$get("/admin/v1/contents?type=Device&offset=-1&count=-1", {}).then(
						response => {
							this.rightList.map((item, index) => {
								response.data.map((subItem, index) => {
									if (item.devices) {
										subItem.ID = subItem.ID + ''
										if (item.devices.indexOf(subItem.ID) > -1) {
											if (item.deviceinfo && item.deviceinfo != '--remove--') {
												item.deviceinfo = item.deviceinfo.replace(/<[^>]+>/g, "");
												subItem.location = item.deviceinfo && JSON.parse(item.deviceinfo)[
													subItem.name]
											}
											var array = []
											if (subItem.points) {
												JSON.parse(subItem.points).map((childItem) => {
													array.push(this.pointList[childItem.split(',')[0]])
												})
												subItem.point = array
											}
											item.deviceList.push(subItem)
										}
									}
								})
							})
							this.judge()
							this.$forceUpdate()
						})
				})
			},
			clickGeneratePicture() { //生成图片
				html2canvas(this.$refs.imageDom, {
					width: 1346,
					height: 934
				}).then(canvas => {
					this.imgShow = []
					// 转成图片，生成图片地址
					this.imgShow.push(canvas.toDataURL("image/png")); //可将 canvas 转为 base64 格式
					//					console.log(this)
					setTimeout(() => {
						this.$viewer.show()
					}, 500)
				});
			}
		},
		mounted() {},
		created() {
			this.$store.state.alarmData && this.$store.state.alarmData.alarms.map((item) => {
				this.alarmData[item.rel] = item
			})
			this.getBaseData()
		}
	}
</script>
<style lang="less" scoped>
	.pop {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.6);
		z-index: 100;
		.close {
			position: absolute;
			right: 20px;
			color: #fff;
			top: 0;
			font-size: 40px;
		}
		.container {
			padding: 50px;
			margin: 60px auto 0;
			width: 1000px;
			height: 710px;
			background: #fff;
		}
		.title {
			font-size: 20px;
		}
		.chart {
			height: 600px;
		}
	}
	
	.contain {
		display: flex;
		padding: 2px 21px;
		justify-content: space-between;
		.left {
			position: relative;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 1346px;
			height: 934px;
			background-color: #ffffff;
			box-shadow: -2px 4px 30px 0px rgba(64, 129, 255, 0.08);
			& > img {
				width: 1292px;
				height: 879px;
				box-shadow: -2px 4px 30px 0px rgba(64, 129, 255, 0.08);
				margin: 0 auto;
			}
			.absolute-style {
				position: absolute;
				display: flex;
				.device-img {
					width: 100px;
					height: 100px;
				}
				.tip {
					position: relative;
					display: flex;
					padding: 19px 14px;
					.close {
						position: absolute;
						right: 4px;
						top: 0px;
						font-size: 22px;
						color: #fff;
					}
					.tip-left {
						margin-right: 12px;
						& > img {
							width: 49px;
							height: 49px;
						}
					}
					.tip-right {
						min-width: 200px;
						font-size: 16px;
						font-weight: bold;
						font-stretch: normal;
						line-height: 26px;
						letter-spacing: 0px;
						color: #ffffff;
						box-shadow: 0px 1px 1px 0px rgba(0, 0, 0, 0.3);
					}
					&.red {
						background: url(../assets/image/schematicDia/red.png) no-repeat;
						background-size: cover;
					}
					&.green {
						background: url(../assets/image/schematicDia/green.png) no-repeat;
						background-size: cover;
					}
				}
				&.left-style {
					.tip {
						position: absolute;
						left: -300px;
					}
				}
			}
		}
		.right {
			text-align: center;
			padding: 0 9px;
			box-sizing: border-box;
			width: 186px;
			height: 934px;
			background-color: #ffffff;
			box-shadow: -2px 4px 30px 0px rgba(64, 129, 255, 0.08);
			.title {
				font-size: 20px;
				line-height: 66px;
				letter-spacing: 1px;
				color: #333333;
			}
			.li {
				width: 100%;
				height: 120px;
				text-align: center;
				line-height: 120px;
				font-size: 22px;
				font-weight: bold;
				letter-spacing: 0px;
				color: #9ea1a9;
				&.active {
					background: url(../assets/image/schematicDia/system-current.png) no-repeat;
					background: contain;
					color: #fff;
				}
			}
			.split {
				margin: 0 auto;
				width: 133px;
				height: 1px;
				background: #e5e5e5;
			}
		}
	}
	
	@keyframes fade {
		from {
			background: rgba(236, 0, 10, 1);
		}
		50% {
			background: rgba(236, 0, 10, 0.2);
		}
		to {
			background: rgba(236, 0, 10, 1);
		}
	}
	
	@-webkit-keyframes fade {
		from {
			background: rgba(236, 0, 10, 1);
		}
		50% {
			background: rgba(236, 0, 10, 0.2);
		}
		to {
			background: rgba(236, 0, 10, 1);
		}
	}
	
	.blink {
		animation: fade 1500ms infinite;
		-webkit-animation: fade 1500ms infinite;
	}
</style>