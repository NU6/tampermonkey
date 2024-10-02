// ==UserScript==
// @name		 Sankaku downloader
// @version		 1.1.0
// @description	 Sankakucomplex chanel downloader
// @icon		 https://chan.sankakucomplex.com/favicon.png
// @include		 https://chan.sankakucomplex.com/*
// @author		 NU6
// @match		 https://www.tampermonkey.net/documentation.php
// @grant		 GM_download
// @updateURL	 https://gitlab.com/nugr/imgdown/-/raw/main/chan.sankakucomplex.com/meta.js

// ==/UserScript==
"use strict";

//define throttling
var tittle = document.title.replace(/[/\\?%*:|"<>]/g, '-');


var throttle_interval_ms = 1000;
var last_throttle_time_ms = 0;

function throttle(fn) {
	var epoch_ms = (new Date).getTime();
	var time_to_sleep_ms = Math.max(0, (last_throttle_time_ms + throttle_interval_ms) - epoch_ms);
	last_throttle_time_ms = epoch_ms + time_to_sleep_ms;
	setTimeout(fn, time_to_sleep_ms);
}


var	_ =	jQuery,

	//download handler method
	a =	(([index = 1, last]) =>	{
		index--;

		var	d =	(x)	=> document.write(x),
			imageList =	[];

		//get the container elements
		_("#popular-preview, div[id^=content-page-]").remove();

		//addimage list
		let	content	= _(".content .thumb a").hide();
			content.map((a,	b) => imageList.push(_(b).attr('href')));

		//get next page url joined to page list array
		let	page = [5, _(".pagination").attr("next-page-url")];

		//rebuild page
		d("<h3>Sankaku Channel downloader By NU6</h3><br/><div id='c'></div><br/>");

		//download method
		var dl = ()	=> {
				console.log("image", index);
				let	c =	imageList[index];

				//chec if last param was initialized
				//and the last has not reached the last
				last &&	index >= last ?

					//if so
					//this will tell the download session has finished
					_("h3").html("Finished") :

					//check if there is still image to download then download the next image
					c ?

					//download next image by get image urls
					_.get(
						c,
						(o)	=> {
							console.log('next image', c);
							let	link = _("#highres", _(o)).attr("href");

							//append the link to body
							_(
								`<a	download='${c.match(/\w*$/)[0] + link.split("?")[0].match(/\.\w*$/)}' href='${link}'>`
							).html(c)
							.appendTo('body');

							console.log(link);

							//request the img data then download as file
							GM_download({
								url : "https:" + link,
								name : c.match(/\w*$/)[0] + link.split("?")[0].match(/\.\w*$/)[0],

								//show the downloaded image as thumbnail then do the next loop
								onload:	() => throttle(dl,_("#c a").eq(index++).show())
							});
						}
					) :

					//chech the next page
					page.at(-1)	?

					//request to next page
					throttle(x=>_.get(
						page.at(-1),
						(o)	=> {

							//add next page link
							let	ls = _(".pagination	a",	_(o));
							page.push(ls.length	== 2 &&	ls.slice(-1).attr("href"));
							console.log('dl', ls);

							//add image list
							imageList =	_.merge(imageList, _(".thumb.blacklisted a", _(o))
								.map((a, b)	=> _(b).appendTo(_("#c")).hide().attr("href"))
							);
							throttle(dl);
						})) :

					//this will tell the download session has finished due reached the end of page
					_("h3").html("Finished : end of page has reached!!");
		}

		//execute the download
		dl(_("#c").append(content));
		return () => [imageList, page, content];
	})

//floating form	to insert range	for	image to download
_("<div	style='position:fixed;top:160px;right:60px'><input type='text' id='range'/></div>")
	.appendTo(_('body'))
	.append(
		_("<button>HAJAR</button>")
		.click(() => a(_('#range').val().split('-')))
	);