function getinfo(){
chrome.windows.getCurrent(function(_window){
chrome.tabs.getSelected(_window.id, function(tab){
		var url=tab.url;
		var search=url.split("?")[1];
		var ret=search.split("&");
		var get = new Object();

		for(var i = 0; i < ret.length; i++) {
			var r = ret[i].split("=");
			get[r[0]] = r[1];
		}
		document.getElementById("token").value=get["token"];
		document.getElementById("token_s").value=get["token_s"];
	});
	});
}
function setting(){
	var t=("'"+document.getElementById("token").value+"'");
	var s=("'"+document.getElementById("token_s").value+"'");
	var Config = {
		token:t,
		secret:s
	};
	localStorage.BlowsingNowConfigData = JSON.stringify(Config);
	setcheck();
}
function setcheck(){
	if(localStorage.BlowsingNowConfigData){
   		document.getElementById("oauth").style.display="none";
   		document.getElementById("set").style.display="block";
	}else{
   		document.getElementById("oauth").style.display="none";
   		document.getElementById("setmiss").style.display="block";
	}
}
function open_oauth(){
chrome.windows.getCurrent(function(_window){
chrome.tabs.getSelected(_window.id, function(tab){
	chrome.tabs.create({
		index:tab.index+1,
		url:'http://pastak.cosmio.net/browsing_now_chrome/',
		selected:true
	});
});
});
}
function blowsingnow(e){
	e.preventDefault();
	document.getElementById("prompt").style.display="none";
	document.getElementById("sending").style.display="block";
	chrome.windows.getCurrent(function(_window){
		chrome.tabs.getSelected(_window.id, function(tab){
			//console.log('aaa');
			var Config = JSON.parse(localStorage.BlowsingNowConfigData);
		  	var url=tab.url;
		  	var title=tab.title;
		  	var token=Config['token'].replace(/\'/g,"");
		  	var secret=Config['secret'].replace(/\'/g,"");
		  	var text=document.getElementById('userinput').value;
		  	var req=("http://pastak.cosmio.net/browsing_now_chrome/submit.php"+"?url="+encodeURI(url)+"&title="+encodeURI(title)+"&token="+token+"&secret="+secret+"&text="+encodeURI(text));
		    //console.log(req);
		    var xhr=new XMLHttpRequest();
		    xhr.open("get",req,false);
		    xhr.onreadystatechange=function(){
		    	if(xhr.readyState==4){
		    		if(xhr.status == 200){
			    		document.getElementById("sending").style.display="none";
			    		document.getElementById("success").style.display="block";
			    	}else{
			    		document.getElementById("sending").style.display="none";
			    		document.getElementById("error").style.display="block";
			    	}
		    	};
		    };
		    xhr.send(null);
		});
	});
}

function load(){
	
	if(localStorage.BlowsingNowConfigData){
		document.body.style.width="450px";
		document.getElementById("prompt").style.display="block";
		document.getElementById("userinput").focus();
		preview({keyCode:null});
	}else{
		document.body.style.width="400px";
		document.getElementById("oauth").style.display="block";
	};
}
function preview(e){
//console.log(e.keyCode);
if(e.keyCode == 13){
	//blowsingnow();
}else{
chrome.windows.getCurrent(function(_window){
	chrome.tabs.getSelected(_window.id, function(tab){
		var u=document.getElementById("userinput").value;
		if(u===''){
		u='Now browsing';
		}
		document.getElementById("preview").textContent=(u+' : '+tab.title+" "+tab.url);
	})
})
}
}


document.addEventListener('DOMContentLoaded', function () {
	document.getElementById('sendButton').addEventListener('click',blowsingnow);
	document.getElementById('form').addEventListener('submit',blowsingnow);
	document.getElementById('userinput').addEventListener('keydown',preview);
	document.getElementById('userinput').addEventListener('keypress',preview);
	document.getElementById('jumpOAuth').addEventListener('click',open_oauth);
	document.getElementById('getInfo').addEventListener('click',getinfo);
	document.getElementById('setting').addEventListener('click',setting);

	load();
});
