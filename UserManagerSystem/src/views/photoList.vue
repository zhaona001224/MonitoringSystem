<template>

	<div class="list">
		<el-card class="box-card" style="margin-bottom: 20px;">
			<el-input class="search-input" prefix-icon="el-icon-search" v-model="keyword" placeholder="请输入搜索内容">
			</el-input>
			<el-button type="primary" class="common-btn" @click="search">Search</el-button>
		</el-card>
		<div style="text-align: left;" class="el-upload-list el-upload-list--picture-card
	">
			<div style="position: relative;display: inline-block;" v-for="(item,index) in picSource" onload="getWIDth(item)" :key="item.ID">
				<div class="el-upload-list__item is-ready">
					<div>
						<img class="el-upload-list__item-thumbnail" :src="imgUrl+item.ID" alt="">
						<span class="el-upload-list__item-actions">
        <span
          class="el-upload-list__item-preview"
          @click="handlePictureCardPreview(imgUrl+item.ID)"
        >
          <i class="el-icon-zoom-in"></i>
        </span>
						<!--<span class="el-upload-list__item-delete" @click="handleDownload(file)">
          <i class="el-icon-download"></i>
        </span>-->
						<span class="el-upload-list__item-delete" @click="handleRemove(item.ID)">
          <i class="el-icon-delete"></i>
        </span>
						</span>

					</div>

				</div>

				<div class="hIDden-style" style="wIDth: 148px;text-align: center;margin:0 0 10px">{{item.name}}</div>
				<div class="hIDden-style" style="wIDth: 148px;text-align: center;margin:0 0 10px">({{item.wIDth}}*{{item.height}})</div>
			</div>
		</div>
		<el-upload action="#" :show-file-list="false" :http-request="uploadImg" style="display: inline-block;">
			<div class="el-upload--picture-card"><i slot="default" class="el-icon-plus"></i></div>

		</el-upload>
		<el-dialog :visible.sync="dialogVisible">
			<img wIDth="100%" :src="dialogImageUrl" alt="">
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				dialogImageUrl: '',
				picSource: [],
				dialogVisible: false,
				disabled: false,
				keyword: ''
			};
		},
		methods: {

			handleRemove(ID) {
				this.$delete("/admin/v1/file?id=" + ID, {}).then(response => {
					this.getPicData();
				})
			},
			search() {
				if(!this.keyword) {
					this.getPicData();
					return
				}
				this.$get('/admin/v1/files/search?q=' + this.keyword, {

				}).then(response => {

					if(response.retCode == 0) {
						this.picSource = response.data;
					} else {

						this.$message({
							type: 'warning',
							message: response.message
						});
					}

				})

			},
			handlePictureCardPreview(file) {
				this.dialogImageUrl = file;
				this.dialogVisible = true;
			},
			getWIDth(item) {
				var that=this;
				var img = new Image();
				img.src = this.imgUrl + item.ID;
				img.onload = function() {
					item.height = img.height;
					item.wIDth = img.wIDth;
					that.$forceUpdate();

				};

			},
			//获取图片库内容
			getPicData() {
				this.$get('/admin/v1/files?count=-1', {

				}).then(response => {

					if(response.retCode == 0) {
						this.picSource = response.data;
						this.picSource.map((item) => {
							this.getWIDth(item);
						})
					} else {

						this.$message({
							type: 'warning',
							message: response.message
						});
					}

				})
			},
			uploadImg(e) {
				console.log(e.file)
				const form = new FormData();
				// 文件对象
				form.append("file", e.file);
				this.$post("/admin/v1/file", form).then(response => {
					this.getPicData();
				})
			},
		},
		created() {
			this.imgUrl = window.imgUrl;
			this.getPicData();
		}
	}
</script>
<style>
	@import "../assets/css/list.css";
	.center {
		text-align: center;
	}
	
	.search-input {
		wIDth: 500px
	}
</style>