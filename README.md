Say Cheese
==========

Take a webcam snapshot or paste image data and upload it into the WordPress Media Library.


 - Developed in WP 3.8
 - Last tested in WP 4.1-alpha
 - Should work with WordPress 3.5+
 - German localization.

Browser Support
---------------
*Snapshot* is proofed to be working on Chrome 32+ and Firefox 26+. 
Safari and IE11+ users will see a flash fallback.

In Mobile Safari the Snapshot feature is already implemented through the systems file upload dialog. 

*Clipboard pasting* works well in Firefox 26+ and Chrome 32+ 

Safari makes [some weird things](https://bugs.webkit.org/show_bug.cgi?id=49141) with 
pasted images. It seems impossible to predict such behaviour (unless somebody can answer me
[this question](http://stackoverflow.com/questions/21366465/is-there-a-way-to-detect-webkit-fake-url-browser-behavior)), 
so the only thing that will appear after pasting an image from the clipboard will be an error message.


In IE pasting images is not supported.


Mobile:
-------
Tested in 
 - Firefox mobile. (Snapshot)


ToDo:
-----
 - disable paste in safari. Requires an answer for [this question](http://stackoverflow.com/questions/21366465/is-there-a-way-to-detect-webkit-fake-url-browser-behavior).

