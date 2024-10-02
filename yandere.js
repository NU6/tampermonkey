		
		// ==UserScript==
// @name		yande.re
// @namespace	http://tampermonkey.net/
// @version			2024-07-12
// @description try to take over the world!
// @author		NU6
// @match		https://yande.re/post/*
// @icon		https://www.google.com/s2/favicons?sz=64&domain=yande.re
// @grant		GM_download
// ==/UserScript==

(function() {
	'use strict';
	var asd = document.createElement('div'),link;
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
		var link = document.getElementById("highres-show").href;
		asd.innerHTML="wait";
		GM_download({
		url : link,
		name : decodeURIComponent(link).match(/[^/]+$/)[0],
		onload:	() => close()
	})};
})();