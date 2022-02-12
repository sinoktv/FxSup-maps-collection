// +----------------------------------------------------------------------
// | FxSup maps collection[地图信息收集]
// +----------------------------------------------------------------------
// | Copyright (c) 2021-2022 https://github.com/sinoktv/FxSup-maps-collection All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: FxSup <vod08@qq.com>
// +----------------------------------------------------------------------

var sTableH = '<table width="100%" border="1" id="fxsup_table_p">';
sTableH += '</table>';
var sTableR = '';


var img_DELETE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAIlJREFUeNqUUgEKwCAITOlf9bOxn9nL2kHgRC3ooIHtzvPcSETKDSqO9I7nM+cYIyVZQtXblyiVuXaM081UkLXWdmyAbIb1WhkooyHbQq3go2IHdrUdL10DpwtJ8yQCm2FZRQ3vEut4TsM7doyUZ4iAxpr83yHd+mmt6HRgo90yodu/lcslPgEGAFEkaGTDeaUwAAAAAElFTkSuQmCC";
var img_ROTATE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAI1JREFUeNqUUtsRwCAIU6+DMZqjMVqptREBPZsPD7nE8DAzc5pBJDlKC5QwK5ojwfPyR11prpNXAwewUT2C1hJPDrh7tom7Q60Jp2e8JihB9zB41DTs6ozHSqhetQGHkn4iEIxKWmC+wmha70GokJmRFN2u351afOdkOG42HU9JsvAFJGPWkv333uMWYAC/a0ukHYbbfAAAAABJRU5ErkJggg==";
var img_SAVE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAN1JREFUeNpi/P//PwMpgAWIRUVFGT5+ZODn//LlC1ZFPDw8Hz9+5Ofnf/36NSPQBkZGRoabNxnU1RctWoRVQ1xc3Lt374SEhICKWaBiampAQllZGZdLvA0NIQwmZNHfOABQ6vjkyVg04AO+viRqQA4lOBAWFiZFQ3n5lNpa7KrKy+FMWLBCoi8lBbuGOXPAasGKUTScPImu9OtXEPn+PUNwMEQDAzRpgFmYRhuJiQERVAEDA2ENl8EAWQML/jD58OEDllASERF58/YtVg3AJARlwRX8BwMiYw2oEiDAAJABhC5AmuH+AAAAAElFTkSuQmCC";
var img_EXIT = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAT9JREFUeNpi/P//PyMjIwM2AJTCFGSBs379+vXp0yc4V0REhAGPMfn5DNLSav+RAEQKDpSUJkIYTBBtoqIMrq631NSMsRpqbDzr3r3XKE7684dBVZXhy5dzzs7Oe/fuRVbt7Lzo3LlHDAysQAaQywjxdEMDSI6dnaGyEupIoCCQYWEx5+TJe0AZsN6fQMyEbNjPn+iOCQzUhKiDafjJgizNy4uuobzcGkhWVKwHSnZ0BCFCCegkILK0ZIAHDnIolZfvZmAohbBRbHjzBnvQd3S4vHv3HRpK8+bNg3gX6IHMTIaiIgaICBDAGUAwa1YShMGopqYmIyMjJLTP0JDh92+Qw4AiQAmg4JMnT+Aabt68CbUBwgJGGQ/PORUVFDmcSQMCxMWVsrMZ0FIEJkCR5uERIaiBES0NQyIYj4sAAgwAaKnyDBDAG3AAAAAASUVORK5CYII=";

var dragging = false;
var iX, iY;
var ContentTableId = chrome.i18n.getMessage("ContentTableId");
var ContentTableName = chrome.i18n.getMessage("ContentTableName");
var ContentTableName2 = chrome.i18n.getMessage("ContentTableName2");
var ContentTablePhone = chrome.i18n.getMessage("ContentTablePhone");
var ContentTableWeb = chrome.i18n.getMessage("ContentTableWeb");
var ContentTableRegion = chrome.i18n.getMessage("ContentTableRegion");
var ContentTableAddress = chrome.i18n.getMessage("ContentTableAddress");
var ContentTableType = chrome.i18n.getMessage("ContentTableType");
$(document).ready(function() {

	sTableR += '<tr><td>'
		//+ContentTableId+':{0}&nbsp;'
		+ContentTableName+':{1}&nbsp;'
		+ContentTableName2+':{2}&nbsp;'
		+ContentTablePhone+':{3}&nbsp;'
		+ContentTableWeb+':{4}&nbsp;'
		+ContentTableRegion+':{5}&nbsp;'
		+ContentTableAddress+':{6}&nbsp;'
		+ContentTableType+':{7}&nbsp;'
		+'</td>';
	sTableR += '</tr>';	
	
});
function canvsGen() {
	if (document.getElementById("fxsup_div_p")){
		closetable();
		return false;
	}
	let ContentTextRefresh = chrome.i18n.getMessage("ContentTextRefresh");
	let ContentTextExport = chrome.i18n.getMessage("ContentTextExport");
	let ContentTextClean = chrome.i18n.getMessage("ContentTextClean");
	let ContentTextClose = chrome.i18n.getMessage("ContentTextClose");
	var button_html = "";
		button_html = "&nbsp;&nbsp;<span>FxSup maps collection</span>&nbsp;&nbsp;"+
		"<img id=\"fxsup_acRun\" src=\""+img_ROTATE+"\" alt=\""+ContentTextRefresh+"\" title=\""+ContentTextRefresh+"\"/>&nbsp;"
		+"<img id=\"fxsup_acExport\" src=\""+img_SAVE+"\" alt=\""+ContentTextExport+"\" title=\""+ContentTextExport+"\"/>&nbsp;"
		+"<img id=\"fxsup_acClean\" src=\""+img_DELETE+"\" alt=\""+ContentTextClean+"\" title=\""+ContentTextClean+"\"/>&nbsp;"
		+"<img id=\"fxsup_acClose\" src=\""+img_EXIT+"\" alt=\""+ContentTextClose+"\" title=\""+ContentTextClose+"\"/>&nbsp;";
	var showtext_html = "<div id=\"showtext\"></div>";
	var ifr = $("<div></div>")
		.attr("id", "fxsup_div_p")
		;
	
	$("body").append(ifr);
	$("#fxsup_div_p").append(button_html);
	$("#fxsup_div_p").append(showtext_html);
	$("#fxsup_div_p").append(sTableH);
	
	$('#fxsup_acRun').click(function(){
		readMemDb('CumList');
	});
	$('#fxsup_acExport').click(function(){
		Export2Csv('CumList');
	});
	$('#fxsup_acClean').click(function(){
		cleanDb('CumList');
	});
	$('#fxsup_acClose').click(function(){
		closetable();
	});
     $("#fxsup_div_p").mousedown(function(e) {
         dragging = true;
         iX = e.clientX - this.offsetLeft;
         iY = e.clientY - this.offsetTop;
         this.setCapture && this.setCapture();
         return false;
     });

     document.onmousemove = function(e) {
         if (dragging) {
             var e = e || window.event;
             var oX = e.clientX - iX;
             var oY = e.clientY - iY;
             $("#fxsup_div_p").css({
                 "left": oX + "px",
                 "top": oY + "px"
             });
             return false;
         }
     };

     $(document).mouseup(function(e) {
         dragging = false;
         $("#fxsup_div_p")[0].releaseCapture();
         e.cancelBubble = true;
     })
	return true;
}
function closetable(){
	$('#fxsup_div_p').remove();
}
function showdb2table(sjson){
	$("#fxsup_table_p").remove();
	$("#fxsup_div_p").append(sTableH);
	if (sjson.length==0){
		let ContentTableNodata = chrome.i18n.getMessage("ContentTableNodata");
		$("#fxsup_table_p").append("<tr><td>"+ContentTableNodata+"</td></tr>");
		return;
	}
	let sjson_tmp = sjson.reverse();
	for(item in sjson_tmp){
		let item_json = sjson_tmp[item];
		let id = parseInt(item) + 1;
		let name = readItem2Text(item_json.name,1);
		let cnname = readItem2Text(item_json.cnname,1);
		let phone = readItem2Text(item_json.phone,1);
		let web = readItem2Text(item_json.web,1);
		let dq = readItem2Text(item_json.dq,1);
		let address = readItem2Text(item_json.address,1);
		let band = readItem2Text(item_json.band,0);
		let srow = String.format(sTableR
			,id
			,name
			,cnname
			,phone
			,web
			,dq
			,address
			,band
			);
		$("#fxsup_table_p").append(srow);
	}
}

function readMemDb(objName){
	console.log(objName);
	if (objName == 'CumList'){
		chrome.storage.local.get({CumList: ''}, function(items) {
			if (items != undefined){
				showdb2table(items.CumList);
			}
		});
	}
}
function cleanDb(objName){
	console.log(objName);
	chrome.runtime.sendMessage({"cmd":"cleanDb"}
	, function(response) {
		setTimeout(function(){readMemDb('CumList');},500);
	});
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

function Export2Csv(objName){
	console.log(objName);
	if (objName == 'CumList'){
		chrome.storage.local.get({CumList: ''}, function(sList) { // null implies all items
			// Convert object to a string.
			let sjson = sList.CumList;
			let result = [];
			let row_title = [ContentTableId,ContentTableName,ContentTableName2,ContentTablePhone,ContentTableWeb,ContentTableRegion,ContentTableAddress,ContentTableType];
			result.push(row_title.join(","));
			for(item in sjson){
				let item_json = sjson[item];
				let id = parseInt(item) + 1;//item_json.id;
				let name = readItem2Text(item_json.name,1);
				let cnname = readItem2Text(item_json.cnname,1);
				let phone = readItem2Text(item_json.phone,1);
				let web = readItem2Text(item_json.web,1);
				let dq = readItem2Text(item_json.dq,1);
				let address = readItem2Text(item_json.address,1);
				let band = readItem2Text(item_json.band,0);
				let cols = new Array(id,name,cnname,phone,web,dq,address,band);
				let row = [];
				for (let j = 0; j < cols.length; j++) {
					let columnItem = cols[j].toString();
					columnItem = columnItem.replace(/"/g, "\"\""); //as per rfc4180
					columnItem = columnItem.replace(/(\r\n\t|\n|\r\t)/gm," ").trim(); //New lines are nothing but trouble	
					row.push("\"" + columnItem + "\"");
				}
				result.push(row.join(","));
			}
			if (result.length==1){
				let ContentTableNodata = chrome.i18n.getMessage("ContentTableNodata");
				alert(ContentTableNodata);
				return;
			}
			let csv_str = String.fromCharCode(0xFEFF) + result.join("\n");
			
			let downloadLink = document.createElement("a");
			var ContentSaveAsFile = chrome.i18n.getMessage("ContentSaveAsFile");
			let fileName = prompt(ContentSaveAsFile, getNewFileName());
			if(fileName == null) return;			
			downloadLink.download = fileName != "" ? fileName + ".csv" : "table.csv"
			downloadLink.href = window.URL.createObjectURL(new Blob([csv_str], {type: "text/csv"}));
			downloadLink.style.display = "none";
			document.body.appendChild(downloadLink);
			downloadLink.click();	
		});
	}
}
function getNewFileName(){
	var d = new Date();
   var s = "table_";
   s += d.getYear() + "";
   s += (d.getMonth() + 1) + ""
   s += d.getDate() + "";
   s += d.getHours();
   s += d.getMinutes();
   s += d.getSeconds();
   return s;
}

//接收POP发来消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
	if(request.cmd == 'test'){
		//alert(request.value);
	}else if(request.cmd == 'reLoadTable'){
		if (canvsGen()){
			readMemDb('CumList');
		}
	}else if (request.cmd == 'saveLoadTable'){
		Export2Csv('CumList');
	}
	sendResponse('我收到了你的消息！');
});
