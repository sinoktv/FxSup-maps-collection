// +----------------------------------------------------------------------
// | FxSup maps collection[地图信息收集]
// +----------------------------------------------------------------------
// | Copyright (c) 2021-2022 https://github.com/sinoktv/FxSup-maps-collection All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: FxSup <vod08@qq.com>
// +----------------------------------------------------------------------

chrome.webRequest.onCompleted.addListener( 
	function(details) {
		if (G_server_start_snf != "1"){return;}
		var url = details.url;
		var check_url = "reget=1";
		if (url.indexOf(check_url)==-1){
			url += "&" + check_url;
			if (url.indexOf("google.com")>0){
				sendRequest(url,'googlemaps');
			}else if (url.indexOf("baidu.com")>0){
				sendRequest(url,'baidumaps');
			}
		}else{
		}
	},
	{
		urls: ["https://www.google.com/search*","https://www.google.com/maps/preview/place*"
		,"https://www.google.com.hk/search*","https://www.google.com.hk/maps/preview/place*"
		,"https://map.baidu.com/?newmap=1&reqflag=pcmap&biz=1&from=webmap&da_par=direct&pcevaname=pc4.1&qt=spot*"
		,"https://map.baidu.com/?uid=*"
		]
		,types: ["xmlhttprequest"]
	}
);
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	if (message.cmd){
		if (message.cmd == "cleanDb"){
			clearCumList();
		}
	}
	sendResponse('已收到你的消息');
});
function setConfig(message){
	console.log(message);
	G_server_start_snf = message.server_start_snf;
	chrome.storage.local.set({server_id: message.server_id,server_start_snf:message.server_start_snf}, function() {
	});
}
function setCumList(CumList){
	console.log(CumList);
	chrome.storage.local.set({CumList:CumList}, function() {
	});
}
function clearCumList(){
	G_cum_list=[];
	showText2PopTitle(G_cum_list.length.toString());
	chrome.storage.local.set({CumList:[]}, function() {
	});
}
var G_server_start_snf = false;
var G_cum_list=[];
function readMemDb(objName){
	if (objName == 'CumList'){
		chrome.storage.local.get({CumList: ''}, function(items) {
			if (items != undefined){
				if (items.CumList != undefined){
					if (typeof(items.CumList) == object){
						G_cum_list = items.CumList;
					}
				}
			}
		});
	}
}
readMemDb('CumList');

function sendRequest(url,stype) {
    var req = new XMLHttpRequest();
      req.open("GET", url, true);
      req.onreadystatechange = function() {
          if (req.readyState == 4) {
            if (req.status == 200) {
              let re_text = req.responseText;
			  re_text = re_text.replace(/\/\*\"\"\*\//g,"");
			  if (stype == "googlemaps"){
				readGoogleMapCumJson(url,re_text);
			  }else if (stype == "baidumaps"){
				readBaiduMapCumJson(url,re_text);
			  }
            }
          }
        };
    req.send();
}

function readGoogleMapCumJson(url,re_text)
{
  if (url.indexOf("preview/place")>0){
	 re_text = re_text.substring(re_text.indexOf("["),re_text.length);
	 let re_json = JSON.parse(re_text);
	 if (re_json.length>=6){
		 let cum_item_json = re_json[6];
		 getGoogleMapCumItemStr(cum_item_json);
		 showText2PopTitle(G_cum_list.length.toString());
		 setCumList(G_cum_list);
	 }
  }else{
	  let re_json = JSON.parse(re_text);
	  if (re_json.d){
		  let re_text2 = re_json.d;
		  re_text2 = re_text2.substring(re_text2.indexOf("["),re_text2.length);
		  var cum_list = [];
		  let re_json2 = JSON.parse(re_text2);
		  if (re_json2.length >= 1){
			  if (re_json2[0].length >= 2){
				  let cum_json = re_json2[0][1];
				  for (let i = 0; i < cum_json.length; i++) {
					  if (cum_json[i].length>=15){
						  let cum_item_json = cum_json[i][14];
						  getGoogleMapCumItemStr(cum_item_json);
					  }
				  }
			  }
		  }
		  showText2PopTitle(G_cum_list.length.toString());
		  setCumList(G_cum_list);
	  }			  
  }

}
function getGoogleMapCumItemStr(cum_item_json)
{
  let hash_id = readItem2Text(cum_item_json[11],1) + readItem2Text(cum_item_json[14],1) + readItem2Text(cum_item_json[18],1);
  hash_id = hash_id.hashCode();
  let is_find = false;
  for(item in G_cum_list){
	if (G_cum_list[item].id == hash_id){
		is_find = true;break;
	}
  }
  if (is_find==false){
	  let item_tmp = {
		  id:hash_id,
		  name: cum_item_json[11],cnname:cum_item_json[14]
	  ,dq:cum_item_json[30],address:cum_item_json[18],addressItem:cum_item_json[4]
	  ,band:cum_item_json[13],web:cum_item_json[7],phone:cum_item_json[178]
	  };
	  G_cum_list.push(item_tmp);
  }
}
function readBaiduMapCumJson(url,re_text)
{
	let re_json = JSON.parse(re_text);
	if (re_json.content){
		if (url.indexOf("/?uid=")>0){
			let cum_item_json = re_json.content;
			getBaiduMapCumItemStr(cum_item_json);
			showText2PopTitle(G_cum_list.length.toString());
			setCumList(G_cum_list);	
		}else{
			var cum_list = [];
			let cum_json = re_json.content;
			for (let i = 0; i < cum_json.length; i++) {
				let cum_item_json = cum_json[i];
				getBaiduMapCumItemStr(cum_item_json);
			}
			showText2PopTitle(G_cum_list.length.toString());
			setCumList(G_cum_list);		
		}
	}
}
function getBaiduMapCumItemStr(cum_item_json)
{
  let hash_id = readItem2Text(cum_item_json.geo,1)+readItem2Text(cum_item_json.addr,1);
  hash_id = hash_id.hashCode();
  let is_find = false;
  for(item in G_cum_list){
	if (G_cum_list[item].id == hash_id){
		is_find = true;break;
	}
  }
  if (is_find==false){
	  let phone = readItem2Text(cum_item_json.tel,1);
	  if (phone.length==0){phone = readItem2Text(cum_item_json.phone,1);}
	  let showtag = readItem2Text(cum_item_json.tag,1);
	  if (showtag.length==0){showtag = readItem2Text(cum_item_json.showtag,1);}
	  let item_tmp = {
		  id:hash_id,
		  name: readItem2Text(cum_item_json.name,1),cnname:""
	  ,dq:readItem2Text(cum_item_json.area_name,1),address:readItem2Text(cum_item_json.addr,1)
	  ,addressItem:readItem2Text(cum_item_json.address_norm,1)
	  ,band:showtag,web:readItem2Text(cum_item_json.web,1)
	  ,phone:phone
	  };
	  G_cum_list.push(item_tmp);
  }
}

function showText2PopTitle(msg){
	chrome.browserAction.setBadgeText({text: msg});
	chrome.browserAction.setBadgeBackgroundColor({color: [255, 200, 200, 255]});
}
//取信息里的值
function readItem2Text(item,id){
	if (item == null){return "";}
	if (id === 1){
		let type_tmp = typeof(item);
		if (type_tmp=="object"){
			return (item.length>0 ? readItem2Text(item[0],1) : "");
		}else if (type_tmp=="object"){
			return (item.length>0 ? readItem2Text(item[0],1) : "");
		}else{
			return item;
		}	
	}else{
		let type_tmp = typeof(item);
		if (type_tmp=="object"){
			let item_text = "";
			for(item_tmp in item){
				item_text += (item_text.length>0 ? "," : "") + readItem2Text(item[item_tmp],1);
			}
			return item_text;
		}else{
			return item;
		}		
	}
}
String.prototype.hashCode = function() {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};