// ==UserScript==
// @name		bonckrax
// @namespace	http://tampermonkey.net/
// @version		2024-10-01
// @description	bonckrax
// @author		NU6
// @match		https://bunkr.ax/*
// @icon		https://www.google.com/s2/favicons?sz=64&domain=bunkr.ax
// @grant		GM_download
// ==/UserScript==

(function() {
	'use strict';

	var asd = document.createElement('div'),link;
	document.body.appendChild(asd);
	asd.innerHTML = "image";
	asd.style = `
		position:fixed;
		left:100px;
		top:100px;
		padding: 15px 32px;
		text-align: center;
		text-decoration: none;
		display: inline-block;
		font-size: 16px;
		margin: 4px 2px;
		cursor: pointer;
		border-radius:10px;
		background-color: white;
		color: black;
		border: 2px solid #008CBA;
	`;


	var mp4 = document.createElement('div');
	document.body.appendChild(mp4);
	mp4.innerHTML = "video";
	mp4.style = `
		position:fixed;
		left:200px;
		top:100px;
		padding: 15px 32px;
		text-align: center;
		text-decoration: none;
		display: inline-block;
		font-size: 16px;
		margin: 4px 2px;
		cursor: pointer;
		border-radius:10px;
		background-color: white;
		color: black;
		border: 2px solid #008C0A;
	`;

	var urls_to_download,file_names;

	/*downloads*/
	function run(idx){
		console.log(idx,"88899988999",[urls_to_download]);
		if(!urls_to_download[idx]){
			alert("done");
			return;
		}
		GM_download({
			url : urls_to_download[idx],
			name : file_names[idx],
			//show the downloaded image as thumbnail then do the next loop
			onload:	() => run(idx+1)
		})
	};

	asd.onclick=x=>{
		/*remove unnecessary elements*/
		[...document.getElementsByClassName("grid-images_box")]
			.map(x=>
				x.getElementsByClassName("mt-0 text-[10px] font-medium dark:text-white-700")[0]
				.innerHTML.slice(-3)=='mp4' && x.remove()
			);

		urls_to_download = [...document.getElementsByClassName("grid-images_box-img")]
					.map(x=>x.getAttribute("src").replace("/thumbs",'').replace(/\.png/,'.jpg'));

		file_names = urls_to_download
			.map(x=>x.split("/").at(-1));

		asd.innerHTML="wait";
		run(/*insert number manually*/);
		};

	mp4.onclick=x=>{
		[...document.getElementsByClassName("grid-images_box")]
			.map(x=>
				x.getElementsByClassName("mt-0 text-[10px] font-medium dark:text-white-700")[0]
				.innerHTML.slice(-3)!='mp4' && x.remove()
			);

		urls_to_download = [...document.getElementsByClassName("grid-images_box-img")]
					.map(x=>x.getAttribute("src").replace("/thumbs",'').replace(/\.png/,'.jpg'));

		file_names = urls_to_download
			.map(x=>x.split("/").at(-1));

		mp4.innerHTML="wait";
		//run(0);
		};
})();