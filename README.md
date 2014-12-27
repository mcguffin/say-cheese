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

**Safari** makes [some weird things](https://bugs.webkit.org/show_bug.cgi?id=49141) with 
pasted images. It seems impossible to predict such behaviour (unless somebody can answer me
[this question](http://stackoverflow.com/questions/21366465/is-there-a-way-to-detect-webkit-fake-url-browser-behavior)), 
so the only thing that will appear after pasting an image from the clipboard will be an error message.

The same is true for **Safari mobile**. Additionally iOS already provides Webcam access in the regular file upload dialog, so the whole plugin is totally dispensable on Apple mobile devices.

In **IE** pasting images is not supported. Webcam support on older IEs is achieved through a Flash fallback.

In **Firefox** you can't paste images copied from other websites than your own. Firefox only sends 
image URLs to the clipboard, not the raw image data. When pasting such an image FF will try 
to access data originating from a different domain than your own, which will result in a security 
error. You can work around this by copying an image as data url, as described here ( Scroll down to ‘Firefox’):
(http://www.abeautifulsite.net/convert-an-image-to-a-data-uri-with-your-browser/)

Mobile:
-------
Tested in 
 - Firefox mobile. (Snapshot)

ToDo:
-----
 - disable paste in safari. Requires an answer for [this question](http://stackoverflow.com/questions/21366465/is-there-a-way-to-detect-webkit-fake-url-browser-behavior).
 - open library tab after upload


Support
-------
You like what you see? Maybe you already make some money with it? 
Here are two ways to keep me rocking:

[![Flattr this git repo](http://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/submit/auto?user_id=joern.lund&url=https://github.com/mcguffin/say-cheese&title=Say%20Cheese&language=php&tags=github&category=software)
<a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=F8NKC6TCASUXE"><img src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!" /></a>
