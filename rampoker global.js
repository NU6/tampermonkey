// ==UserScript==
// @name		rampoker
// @namespace	http://tampermonkey.net/
// @version		0.1
// @description	rampoker global
// @author		NU6
// ==/UserScript==

(function() {


/*

Rampoker By NU6
version 0.1.1 (Beta)

Paste code bellow to taskbar
===================================================================
javascript: (function (start01,end01){
	window.param = {
		task01 : 1,
		length01 : 1,
		start01 : start01,
		end01 : end01,
		id : 0
	};
	function l(u, i) {
		var d = document;
		if (!d.getElementById(i)) {
			var s = d.createElement('script');
			s.src = u;
			s.id = i;
			d.body.appendChild(s);
		}
	} l('https://raw.githubusercontent.com/NU6/rampoker/main/rampoker.js', 'rampoker')
})();
===================================================================
*/
	var param = {
		proxy01:"",
		task01 : 5,
		length01 : 50,
		id : 0
	};
var {proxy01, task01, length01, start01, end01, id} = param;

		var urls_to_download = [];
		var file_names = [];


var tittle = '';
var throttle_interval_ms = 500;
var last_throttle_time_ms = 0;

/*request interval*/
function throttle(fn) {
	var epoch_ms = (new Date).getTime();
	var time_to_sleep_ms = Math.max(0, (last_throttle_time_ms + throttle_interval_ms) - epoch_ms);
	last_throttle_time_ms = epoch_ms + time_to_sleep_ms;
	setTimeout(fn, time_to_sleep_ms);
}

/*function retry if request failed*/
function retry(fn, retries, err) {
	retries = typeof retries !== 'undefined' ? retries : 3;
	err = typeof err !== 'undefined' ? err : null;

	if (!retries) {
		return Promise.reject(err);
	}
	return fn().catch(function(err) {
		//console.warn(`retry ${3 - retries}, err ${err}`);
		return retry(fn, (retries - 1), err);
	});
}


function final(){
	alert("done");
}

/*save file*/
function download (data,filename) {
	var file = new Blob([data]);
	if (window.navigator.msSaveOrOpenBlob) // IE10+
		window.navigator.msSaveOrOpenBlob(file, filename);
	else { // Others
		var a = document.createElement("a"),
			url = URL.createObjectURL(file);

		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		setTimeout(function() {
		document.body.removeChild(a);
		window.URL.revokeObjectURL(url);
		}, 0);
	}
}


/*ajax request*/
var fails = [];
function ajax_download_blob(url,fname) {
	return new Promise((resolve, reject) => {
		retry(() => {
			return new Promise((resolve, reject) => {
				console.log("asdsad"+url);
				GM_download({
					url : url,
					name:fname,
					onerror : function(err){
						reject(new Error(`ajax_download_blob(${url}) failed, xhr.status: ${err.error}`));
					},
					onload : function(err){
						resolve("gone");
					}
				});
			});
		}).then(resolve).catch(msg=>resolve(console.log(fails.push(url),fails,msg)));
	});
}


/*controller*/
var execing = ((t, y) => (x = 1, z, u, l, task, range, hi, fname) => {
	setTimeout(() => execing(), 500);
	throttle_interval_ms = 200;
	r = (b, e) => throttle(()=>{
		ajax_download_blob(proxy01+u[b],`${tittle}  ${fname[b]}`).then(
			function(img) {
				//download (new Blob([img]), `${tittle}  ${fname[b]}`);
				if (b < e) {
					setTimeout(x=>r(b + 1, e),10000);
				} else {
					if (hi < z) {
						r(hi, Math.min(z, hi += y) - 1);
						task++;
					}
					--task < 1 && final('done!!');
				}
			});
	});
	return function() {
		u = urls_to_download;
		l = u.length;
		z = Math.min(z || l, l);
		fname = file_names;
		--x;
		task = 0;
		hi = x;
		for (i = 0; i < t; i++) {
			task++;
			hi += y;
			if (hi < z) {
				r(hi - y, hi - 1);
			} else {
				r(hi - y, z - 1);
				break;
			}
		}
		window.sendData = x => ["h: " + hi, "z: " + z, "t: " + task];
	}
})(...[task01,length01])(...[start01,end01])
})();