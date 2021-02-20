<template>
	<div class="contain">
		<div class="left" ref="wrapper">
			<ul class="table-style">
				<li v-for="(item,index) in tableData" :key="index"> <span class="index">{{index+1}}</span> <span class="title">前高频舱密闭机柜回水流量(m3/h)</span>
					<div class="value ">
						<div class="color1">14.5</div>
						<div class="sub-title">运行值</div>
					</div>
					<div class="split"></div>
					<div class="value">
						<div class="color2">21.7</div>
						<div class="sub-title">预警值</div>
					</div>
					<div class="split"></div>
					<div class="value">
						<div class="color3">20.0</div>
						<div class="sub-title">报警值</div>
					</div>
				</li>
			</ul>
		</div>
		<div class="right">
			<div class="title"> 所属系统 </div>
			<div :key="item" @click="activeIndex=index" v-for="(item,index) in rightList">
				<div :class="index===activeIndex?'li active':'li'"> {{item}} </div>
				<div class="split" v-if="index!==activeIndex"></div>
			</div>
		</div>
	</div>
</template>
<script>
	import BScroll from 'better-scroll'
	export default {
		name: 'parameterMon',
		data() {
			return {
				rightList: ['淡水冷却系统', '海水冷却系统', '1#环控系统', '2#环控系统', '3#环控系统', '4#环控系统'],
				activeIndex: 0,
				tableData: [{},{},{},{},{},{},{},{},{},{},{},{}]
			}
		},
		methods: {},
		mounted() {
			this.$nextTick(() => {
				this.scroll = new BScroll(this.$refs.wrapper, {})
			})
		},
		created() {}
	}
</script>
<style lang="less" scoped>
	.contain {
		display: flex;
		padding: 2px 21px;
		justify-content: space-between;
		.left {
			width: 1346px;
			height: 934px;
			background-color: #ffffff;
			box-shadow: -2px 4px 30px 0px rgba(64, 129, 255, 0.08);
			img {
				width: 1292px;
				height: 879px;
				box-shadow: -2px 4px 30px 0px rgba(64, 129, 255, 0.08);
				margin: 0 auto;
			}
			li {
				list-style: none;
				width: 1346px;
				height: 121px;
				background-color: #ffffff;
				border-radius: 3px;
				display: flex;
				align-items: center;
				height: 121px;
				.index {
					width: 140px;
					text-align: center;
					font-family: SimSun;
					font-size: 72px;
					font-weight: bold;
					font-style: italic;
					font-stretch: normal;
					line-height: 114px;
					letter-spacing: 4px;
					color: #d9e6ff;
				}
				.title {
					width: 565px;
					font-size: 28px;
					letter-spacing: 1px;
					color: #333333;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				.value {
					width: 200px;
					text-align: center;
					font-family: Bahnschrift;
					font-size: 48px;
					.color1{
						font-size: 48px;
						color: #4081ff;
					}
					.color2{
						font-size: 48px;
						color: #aeb4be;
					}
					.color3{
						font-size: 48px;
						color: #fe4e46;
					}
					.sub-title {
							color: #aeb4be;s
						font-size: 18px;
						font-weight: normal;
						font-stretch: normal;
						
					}
				}
				.split {
					width: 3px;
					height: 51px;
					background: #dcdcdc;
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