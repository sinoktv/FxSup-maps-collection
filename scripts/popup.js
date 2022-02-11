// +----------------------------------------------------------------------
// | FxSup maps collection[地图信息收集]
// +----------------------------------------------------------------------
// | Copyright (c) 2021-2022 https://github.com/sinoktv/FxSup-maps-collection All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: FxSup <vod08@qq.com>
// +----------------------------------------------------------------------

$(document).ready(function() {
	// 读取数据，第一个参数是指定要读取的key以及设置默认值
	chrome.storage.local.get({server_id: '', server_start_snf: "0"}, function(items) {
		if (items != undefined){
			console.log(items.server_id, items.server_start_snf);
		}
	});
	
	
	chrome.storage.local.get({CumList: ''}, function(items) {
			var bg = chrome.extension.getBackgroundPage();
			if (bg.G_server_start_snf == "1"){
				$('#start_snf').attr("checked", true);
			}
			if (items != undefined){
				let G_cum_list = items.CumList;
				if (items.CumList != undefined){
					bg.showText2PopTitle(G_cum_list.length.toString());
				}
			}
		});
	
	
	
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
	{
			let url = tabs.length>0 ? tabs[0].url : "";
			if (
				(url.indexOf("https://www.google.com")==0 && url.indexOf("/maps/")>0)
				|| url.indexOf("https://map.baidu.com/")==0){
				
			}else{
				var PopupTitleNotUrl = chrome.i18n.getMessage("PopupTitleNotUrl");
				$('#cleanTable').attr('disabled',"true");
				$('#cleanTable').attr('title',PopupTitleNotUrl);
				$('#showTable').attr('disabled',"true");
				$('#showTable').attr('title',PopupTitleNotUrl);
				$('#saveTable').attr('disabled',"true");
				$('#saveTable').attr('title',PopupTitleNotUrl);
			}
	});

	$('#showTable').click(function(){
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
		{
			let url = tabs.length>0 ? tabs[0].url : "";
			if (
				(url.indexOf("https://www.google.com")==0 && url.indexOf("/maps/")>0)
				|| url.indexOf("https://map.baidu.com/")==0){
				sendMessageToContentScript({cmd:'reLoadTable', value:''}, function(response)
				{
					console.log('来自content的回复：'+response);
				});
			}else{
				//alert("请先打开网页");
			}
		});
		
	});
	$('#start_snf').change(function(){
		var call_server_id = '';//$('#call_server_id').val();
		var bg = chrome.extension.getBackgroundPage();
		var ojson = {server_id:call_server_id,server_start_snf:"0"};
		if ($('#start_snf').prop('checked')=='1'){
			ojson = {server_id:call_server_id,server_start_snf:"1"};
		}else{
		}
		bg.setConfig(ojson);
	});
	$('#cleanTable').click(function(){
		var bg = chrome.extension.getBackgroundPage();
		bg.clearCumList();
	});
	$('#saveTable').click(function(){
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
		{
			let url = tabs.length>0 ? tabs[0].url : "";
			if (
				(url.indexOf("https://www.google.com")==0 && url.indexOf("/maps/")>0)
				|| url.indexOf("https://map.baidu.com/")==0){
				sendMessageToContentScript({cmd:'saveLoadTable', value:''}, function(response)
				{
					console.log('来自content的回复：'+response);
				});
			}else{
				//alert("请先打开网页");
			}
		});
	});
});
//发给content
function sendMessageToContentScript(message, callback)
{
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
	{
		chrome.tabs.sendMessage(tabs[0].id, message, function(response)
		{
			if(callback) callback(response);
		});
	});
}
