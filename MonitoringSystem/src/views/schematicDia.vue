<template>
	<div class="contain">
		<div class="left" @click="clickGeneratePicture" ref="imageDom"> <img :src="require('@/assets/image/schematicDia/img'+(activeIndex+1)+'.jpg')" />
			<div class="absolute-style" v-if="item.location" :style="'top:'+item.location[0]*100+'%;left:'+item.location[1]*100+'%'"
			 v-for="(item,index) in rightList[activeIndex].deviceList"><img class="device-img" :src="imgUrl+item.pic" />
				<div class="tip red">
					<div class="tip-left"> <img src="../assets/image/schematicDia/redwarning.png" /> </div>
					<div class="tip-right">
						<div v-for="(subItem,subIndex) in item.point"> {{subItem.fullname}} {{subItem.datakey}}{{subItem.unit}} </div>
					</div>
					<div class="close">×</div>
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
		<div class="pop" v-if="imgShow"> <img :src="imgShow"></img>
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
				imgShow: ''
			}
		},
		methods: {
			getBaseData() {
				this.$get("/admin/v1/contents?type=Point&offset=-1&count=-1", {}).then(
					response => {
						response.data.map((item) => {
							this.pointList[item.id] = item
						})
					})
				this.$get("/admin/v1/contents?type=Subsys&offset=-1&count=-1", {}).then(
					response => {
						this.imgUrl = window.imgUrl
						response.data.sort((a, b) => {
							//排序基于的数据
							return a.id - b.id;
						})
						response.data.map((item) => {
							item.deviceList = []
							if (item.devices) {
								var array = []
								JSON.parse(item.devices)[0].map((subItem) => {
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
										subItem.id = subItem.id + ''
										if (item.devices.indexOf(subItem.id) > -1) {
											if (subItem.points) {
												const array = []
												JSON.parse(subItem.points[0])[0].map((childItem) => {
													const id = childItem.split(',')[0]
													childItem = this.pointList[id]
													if (childItem) array.push(childItem)
												})
												subItem.point = array
												console.log(array)
											}
											item.deviceList.push(subItem)
											if (subItem.description && subItem.description !=
												'--remove--') {
												subItem.description = subItem.description.replace(/<[^>]+>/g,
													"");
												subItem.location = JSON.parse(subItem.description)[item.fullname]
											}
										}
									}
								})
							})
							this.$forceUpdate()
						})
				})
			},
			clickGeneratePicture() { //生成图片
//				html2canvas(this.$refs.imageDom).then(canvas => {
//					// 转成图片，生成图片地址
//					debugger
//					this.imgShow = canvas.toDataURL("image/png"); //可将 canvas 转为 base64 格式
//				});
			}
		},
		mounted() {},
		created() {
			this.getBaseData()
			this.pointArray = this.$store.state
		}
	}
</script>
<style lang="less" scoped>
	.pop {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background: rgba(0,0,0,0.6);
		z-index: 100;
		img{
			position: fixed;
			left: 50%;
			margin-left: -673px;
			top:50%;
			margin-top: -467px;
			width: 1346px;
			height: 934px;
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
</style>