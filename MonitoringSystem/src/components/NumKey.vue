<template>
	<div>
		<div :style="stylePostion" class="pinPage"> <div class="top"><input disabled type="text" v-model="currentNumber"><i class="el-icon-circle-close
" @click="clear"></i></div>
			<div class="inputBtnList">
				<div @click="traceNumber" v-for="(item, key) in buttons" :key="key">{{item}}</div>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'numKey',
		data() {
			return {
				currentNumber: '',
				buttons: [1, 2, 3, 4, 5, 6, 7, 8, 9, '删除', 0, '确定']
			}
		},
		props: {
			stylePostion: {
				type: String,
				value:''
			}
		},
		methods: {
			
			traceNumber: function(event) {
				const btnText = event.target.textContent
				if (btnText === '确定') {
					this.$emit('confirmText',this.currentNumber)
				} else if (btnText === '删除') {
					this.currentNumber = this.currentNumber.substring(0, this.currentNumber.length -
						1)
				} else{
					this.currentNumber += btnText
				}
			},
			clear(){
				this.currentNumber=''
			}
		}
	}
</script>
<style lang="less" scoped>
	.pinPage {
		position: fixed;
		top:50%;
		left: 50%;
		margin-top: -120px;
		z-index: 10000;
		margin-left: -120px;
		background-size: 100% 100%;
		overflow: hidden;
		width: 240px;
		background: #fff;
		border: solid 1px #e5e5e5;
	}
	
	input {
		width: 180px;
		height: 40px;
		padding-right: 40px;
		padding-left: 20px;
		line-height: 40px;
		background-color: #fff;
		border: none;
		border-bottom: solid 1px #e5e5e5;
		
		font-size: 18px;
	}
	.top{
		position: relative;
		.el-icon-circle-close{
			color: #e5e5e5;
			position: absolute;
			right: 10px;
			top:16px;
		}
	}
	.inputBtnList {
		margin: 0 auto;
		box-sizing: border-box;
		display: flex;
		flex-wrap: wrap;
		div {
			width: 80px;
			height: 50px;
			line-height: 50px;
			box-sizing: border-box;
			color: #606266;
			text-align: center;
		}
	}
</style>