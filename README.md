Say Cheese
==========

Take a webcam snapshot or paste image data and upload it into the WordPress Media Library.

 - Developed in WP 3.8 – WP 4.2
 - Should work with WordPress 3.5+
 - German and Dutch localization. 

Browser Support
---------------
*Snapshot* is proofed to be working on Chrome 32+ and Firefox 26+. 
Safari and IE11+ users will see a flash fallback.

In Mobile Safari the Snapshot feature is already implemented through the systems file upload dialog. 

*Clipboard pasting* works well in Firefox 26+ and Chrome 32+ 

**Safari** makes [some weird things](https://bugs.webkit.org/show_bug.cgi?id=49141) with 
pasted images. It seems impossible to predict such behaviour (unless somebody can answer me
[this question](http://stackoverflow.com/questions/21366465/is-there-a-way-to-detect-webkit-fake-url-browser-behavior)), 
so pasting is disabled by user agent detection.

The same is true for **Safari mobile**. Additionally iOS already provides Webcam access in the regular file upload dialog, 
so the whole plugin is totally dispensable on Apple mobile devices.

In **IE** pasting images is not supported. 

In **Firefox** you can't paste images copied from other websites than your own. Firefox only sends 
image URLs to the clipboard, not the raw image data. When pasting such an image FF will try 
to access data originating from a different domain than your own, which will result in a security 
error. You can work around this by copying an image as data url, as described here ( Scroll down to ‘Firefox’):
(http://www.abeautifulsite.net/convert-an-image-to-a-data-uri-with-your-browser/)

Mobile:
-------
Tested in 
 - Firefox mobile. (Snapshot)


Webcam Support
--------------

| Browser  | Support   |
|----------|-----------|
| Firefox  |   HTML5   |
| Chrome   |   HTML5   |
| Safari   |   Flash   |
| Opera    |     ?     |
| IE       |   Flash   |
| Edge     |     ?     |


Copy/Paste Support:
-------------------

### Mac OS:

| copy from / paste to  | Firefox  | Chrome   |
|-----------------------|----------|----------|
| Mac Finder            |    1)    |    1)    |
| Mac Finder Screenshot |    OK    |    OK    |
| Mac Preview           |    OK    |    OK    |
| Mac iPhoto            |    4)    |    5)    |
| QuickTime Player      |    OK    |    OK    |
| Photoshop CS 6        |    OK    |    3)    |
| A Webpage             |    2)    |    OK    |
| MS Word Mac           |    4)    |    OK    |
| LibreOffice           |    OK    |    OK    |


**1)** The OS Icon matching to the file type gets pasted.<br />
**2)** Error Message due to security restrictions.<br />
**3)** Large images with transparency only arrive totaly destroyed. Aditionally the pasted image will be downsized.<br />
**4)** Nothing happens.<br />
**5)** An empty image gets pasted.<br />

A Workaround for 1) – 5) is to paste into Mac Preview first and then copy again.



Filters:
--------
There are two filters allowing you to programmatically disable the plugin features.

    // will disable pasting images
    add_filter('saycheese_enable_pasteboard','__return_false');

    // will disable webcam snapshots
    add_filter('saycheese_enable_snapshot','__return_false');

ToDo:
-----
 - [x] disable paste in safari.
 - [ ] MediaFrame.Select: open library tab after upload
 - [ ] media options: enable Paste / enable Webcam
 - [ ] Upload option Format:  ( ) png, ( ) jpeg (paste: defaults to pasted data, record: defaults to jpeg)
 - [ ] Select recording size (QVGA, VGA, SVGA, HD, FullHD)
 	- [ ] Find reliable way to predict supported WebcamSizes
 - [x] Modal views: 
 	- [x] set title
 - [x] use different default file names for paste and snapshot
 - [ ] Documentation
 	- [ ] Matrix copy-from / browser+os -> result
		- [x] Mac
		- [ ] Win
		- [ ] Linux
 - [ ] Message at Error: Image size exceeds upload limit.
 - [ ] Deprecate Flash fallback

Support
-------
You like what you see? Maybe you already make some money with it? 
Here are two ways to keep me rocking:

<a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=F8NKC6TCASUXE"><img src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!" /></a>
