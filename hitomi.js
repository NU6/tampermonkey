// ==UserScript==
// @name		hitomi.la
// @namespace	http://tampermonkey.net/
// @version		2024-07-13
// @description	get gallery items
// @author		NU6
// @match		https://hitomi.la/*
// @icon		https://www.google.com/s2/favicons?sz=64&domain=hitomi.la
// @grant		none
// ==/UserScript==

(function() {
	'use strict';

	window.throttle_interval_ms = 10;

	var	urls_to_download = [],
		image_names_to_download = [],
		galleryname_to_download = galleryinfo['japanese_title'] ? galleryinfo['japanese_title'] : galleryinfo['title']

		/*get gallery items url*/
		$.each(galleryinfo['files'], function(i, image) {
				if (image['hasavif']) {
						urls_to_download.push(url_from_url_from_hash(galleryid, image, 'avif', undefined, 'a'));
						image_names_to_download.push(image.name.replace(/[^.]*$/, 'avif'));
				} else if (image['haswebp']) {
						urls_to_download.push(url_from_url_from_hash(galleryid, image, 'webp', undefined, 'a'));
						image_names_to_download.push(image.name.replace(/[^.]*$/, 'webp'));
				} else {
						urls_to_download.push(url_from_url_from_hash(galleryid, image));
						image_names_to_download.push(image.name);
				}
		});

	/*strart process queue*/
	var dump =
		function(m = 1, n) {
			var a = m-1,//index of items aray
				b = urls_to_download,
				c = b.length;
			ajax_download_blob(b[a]).then(function(o) {
				saveAs(
					new Blob([o]),
					galleryname_to_download + " " + image_names_to_download[a]
				),
				a < Math.min(n || c, c) - 1
					? throttle(x=>dump(++m,n))
					: ($("#dl-button").show(),$("#progressbar").hide())
			});
		};

		/*adding button to each thumbnails*/
		[...document.querySelectorAll("ul[class=thumbnail-list]>li")].map((x,y)=>{

			var asd = document.createElement('div')
			x.appendChild(asd);

			asd.innerHTML = "Download";
			asd.style = `
				position: unset;
				top: 0px;
				font-size: 10px;
				cursor: pointer;
				background-color: white;
				color: black;
				border: 2px solid rgb(0, 140, 186);
			`;
			asd.onclick=x=>{
				dump(y+1,y+1);
				$("#dl-button").hide();
				$("#progressbar").show().progressbar({value: false})
			};

		});

		/*adding input for start and end*/
		var inputStyle= `
			width: 40px;
			margin: 4px 4px 0px 0px;
			margin-top: 4px;
			padding: 0px;
			color: #ffffff;
			font: bold 13px Arial, Helvetica, sans-serif;
			text-align: center;
			text-shadow: -1px -1px 0 #29313e, 1px -1px 0 #29313e, -1px 1px 0 #29313e, 1px 1px 0 #29313e, 0px -2px 0 #29313e, 0px 2px 0 #29313e, -2px 0px 0 #29313e, 2px 0px 0 #29313e;
			background-color: #53617b;
			border: 1px solid #29313e;
		`,

		begin = document.createElement("input");
		begin.type = "text";
		begin.id = "beginDownload";
		begin.style = inputStyle;

		var finish = document.createElement("input");
		finish.type = "text";
		finish.id = "finishDownload";
		finish.style = inputStyle;

		var fetch = document.createElement("div");
		fetch.style = inputStyle;
		fetch.innerHTML = "fetch";
		fetch.onclick=x=>{
			dump(
				document.getElementById("beginDownload").value||1,
				document.getElementById("finishDownload").value
			);
			$("#dl-button").hide();
			$("#progressbar").show().progressbar({value: false});
		};

		/*appending elements to parents*/
		var parent =document.querySelectorAll("div.cover-column.lillie")[0];
		parent.appendChild(begin);
		parent.appendChild(finish);
		parent.appendChild(fetch);

})();