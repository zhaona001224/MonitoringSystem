<template>
	<div id="app">
		<transition name="fade" mode="out-in">
			<keep-alive :include="keepAlive">
				<router-view :key="$route.fullPath"></router-view>
			</keep-alive>
		</transition>
	</div>
</template>
<script>
	import * as types from '@/store/types'
	export default {
		name: 'App',
		data() {
			return {}
		},
		computed: {
			keepAlive() {
				console.log(this.store.state.keepAliveList)
				return this.store.state.keepAliveList
			}
		}
	}
</script>
<style>
	#app {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2c3e50;
	}
</style>