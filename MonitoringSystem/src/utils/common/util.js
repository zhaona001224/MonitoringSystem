/**
 * 公共方法
 */
import ElementUI from 'element-ui'
import router from '../../router'

export default {
	//成功弹框，确定返回列表页面
	successAlert(content,path,text){
		ElementUI.MessageBox.alert('<div class="confirmWindow"><img src="./static/success.png"/><div class="confirmText">'+content+'</div><div class="cls"></div><div class="cls"></div></div>',{
          confirmButtonText: text,
          confirmButtonClass:"button-purple btn-width",
          type: '',
          dangerouslyUseHTMLString:true,
          center:true
        }).then(() => {
          router.push({path:path});
        })
	},
	//后退
	goBack(){
		window.history.go(-1);
	},
	//导出
	downloadFile(name,url){
		var a = document.createElement("a");
		a.setAttribute("download",name);
		a.setAttribute("href",url);
		a.setAttribute("target","_blank");
		a.click();
	},
	//获取当周时间
	getLatestWeek(){
		var now = new Date();
		var last = new Date(now.getTime()-7*24*3600*1000);
		return [last,now];
	},
	//获取当月时间
	getLatestMonth(){
		var now = new Date();
		var last = new Date(now.getTime()-30*24*3600*1000);
		return [last,now];
	},
	//获取精确到秒而㐊毫秒的timestamp
	getTime(date){
		if(!date){
			return null;
		}
		return Math.floor((date.getTime()-date.getTimezoneOffset()*60*1000)/1000);
	},
	//获取精确到秒而㐊毫秒的timestamp
	getTimeOfStr(str){
		if(!str){
			return null;
		}
		return Math.floor((Date.parse(str)-date.getTimezoneOffset()*60*1000)/1000);
	},
	//格式化时间
	formatDate(date, fmt) {
		function padLeftZero (str) {
		    return ('00' + str).substr(str.length);
		};
		if(!fmt){
			fmt = "yyyy-MM-dd";
		}
		if (/(y+)/.test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
		}
		let o = {
			'M+': date.getMonth() + 1,
			'd+': date.getDate(),
			'h+': date.getHours(),
			'm+': date.getMinutes(),
			's+': date.getSeconds()
			}
		for (let k in o) {
			if (new RegExp(`(${k})`).test(fmt)) {
				let str = o[k] + ''
					fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str))
			}
		}
		return fmt;
	},
	formatTime(time, format) {
			var t = new Date(time);
			var tf = function(i) {
				return(i < 10 ? '0' : '') + i
			};
			var tzo=(new Date().getTimezoneOffset()/60)*(-1); //北京 8
			
			return format.replace(/YYYY|MM|DD|HH|mm|ss/g, function(a) {
				switch(a) {
					case 'YYYY':
						return tf(t.getFullYear());
						break;
					case 'MM':
						return tf(t.getMonth() + 1);
						break;
					case 'mm':
						return tf(t.getMinutes());
						break;
					case 'DD':
						return tf(t.getDate());
						break;
					case 'HH':
						return tf(t.getHours());
						break;
					case 'ss':
						return tf(t.getSeconds());
						break;
				}
			})
	},

	//检查数据元素
	inArrayObject(arr,val,column){
		if(!arr||!val||!column){
			return -1;
		}
		for(let i=0;i<arr.length;i++){
			if(arr[i][column]==val){
				return i
			}
		}
		return -1;
	},
	//校验时间
	checkDates(dates){
		if(!dates||dates.length==0||!dates[0]||!dates[1]){
			ElementUI.Message.error('请选择时间！');
			return false;
		}
		if(dates[0]<new Date(2018,0,1)){
			ElementUI.Message.error('开始时间不能早于2018-01-01！');
			return false;
		}
		if(dates[0]>dates[1]){
			ElementUI.Message.error('开始时间不能早于结束时间！');
			return false;
		}
		if(dates[1]>new Date(dates[0].getTime()+365*24*3600*1000)){
			ElementUI.Message.error('结束时间不能晚于开始时间一年以后！');
			return false;
		}
		if(dates[1]>new Date()){
			ElementUI.Message.error('结束时间不能晚于当前时间！');
			return false;
		}
		return true;
	}
}