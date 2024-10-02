		
		// ==UserScript==
// @name		danbooru
// @namespace	http://tampermonkey.net/
// @version		2024-07-11
// @description	danbooru
// @author		NU6
// @match		https://danbooru.donmai.us/posts/*
// @icon		https://www.google.com/s2/favicons?sz=64&domain=donmai.us
// @grant		GM_download
// ==/UserScript==

(function() {
	'use strict';
	var asd = document.createElement('div'),
		link;
	document.body.appendChild(asd);
	asd.innerHTML = "dexx";
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

	asd.onclick=x=>{
		asd.innerHTML="wait";
		GM_download({
		url : (link = $("a",$("#post-info-size"))[0].href),
		name : link.split("?")[0].match(/\w*\.\w*$/)[0],
		onload:	() => close()
	})};
	// Your code here...
})();