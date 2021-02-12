<template>
	<div class="contain">
		<div class="left"> <img :src="require('@/assets/image/schematicDia/img'+(activeIndex+1)+'.jpg')" />			</div>
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
	export default {
		name: 'schematicDia',
		data() {
			return {
				rightList: ['淡水冷却系统', '海水冷却系统', '1#环控系统', '2#环控系统', '3#环控系统', '4#环控系统'],
				activeIndex: 0
			}
		},
		methods: {},
		mounted() {},
		created() {}
	}
</script>
<style lang="less" scoped>
	.contain {
		display: flex;
		padding: 41px 22px;
		justify-content: space-between;
		.left {
			display: flex;
			align-items: center;
			justify-content: center;
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