Say Cheese
==========

Take a webcam snapshot or paste image data and upload it into the WordPress Media Library.

 

 - Developed in WP 3.8
 - Last tested in WP 4.0-beta3
 - Should work with WordPress 3.5+
 
 - German localization.

Browser Support
---------------
Snapshot is proofed to be working in Chrome 32+ and Firefox 26+. 
Safari and IE11+ users are offered a flash fallback.

Clipboard pasting works well in Firefox 26+ and Chrome 32+ 
Safari does [some weird things](https://bugs.webkit.org/show_bug.cgi?id=49141) with 
pasted images. It seems impossible to predict such behaviour (unless somebody can answer me
[this question](http://stackoverflow.com/questions/21366465/is-there-a-way-to-detect-webkit-fake-url-browser-behavior)), 
so the only thing that will appear after pasting an image from the clipboard is an error message.

In IE pasting images is simply not supported.

Mobile:
-------
Tested in 
 - Firefox mobile. (Snapshot)
 


ToDo:
-----
 - iOS6 support: http://www.purplesquirrels.com.au/2013/08/webcam-to-canvas-or-data-uri-with-html5-and-javascript/
 - add MSIE support
 - disable paste in safari. Requires an answer for [this question](http://stackoverflow.com/questions/21366465/is-there-a-way-to-detect-webkit-fake-url-browser-behavior).

