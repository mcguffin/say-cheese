Say Cheese
==========

Take a webcam snapshot or paste image data and upload it into the WordPress Media Library.

 - Developed in WP 3.8 – WP 4.2
 - Should work with WordPress 3.5+
 - German and Dutch localization. 

Browser Support
---------------

### Snapshot Support

 - Chrome 32+ (requires https connection)
 - Firefox 26+
 - Safari (using a flash fallback)
 - IE11+ (flash fallback)
 - Edge / Windows 10 should work in theory, though I have no possibility to relaibaly test it. 
   If anybody knows more, please let me know too.


### Clipboard pasting Support

The pasteboard Script is pretty moch the same as on (http://pasteboard.co), so 

 - Chrome 32+
 - Firefox 26+

#### Konwn Issues:

 - **Safari** makes [some weird things](https://bugs.webkit.org/show_bug.cgi?id=49141) with 
   pasted images. It seems impossible to predict such behaviour (unless somebody can answer me
   [this question](http://stackoverflow.com/questions/21366465/is-there-a-way-to-detect-webkit-fake-url-browser-behavior)), 
   so pasting is disabled by user agent detection.

 - The same is true for **Safari mobile**. Additionally iOS already provides Webcam access in the regular file upload dialog, 
   so the whole plugin is totally dispensable on Apple mobile devices.

 - In **IE** pasting images is not supported. 

 - In **Firefox** you can't paste images copied from other websites than your own. Firefox only sends 
   the image Element to the clipboard, not the raw image data. 
   You can work around this by copying an image as data url, as described here ( Scroll down to ‘Firefox’):
   (http://www.abeautifulsite.net/convert-an-image-to-a-data-uri-with-your-browser/)


Mobile:
-------
Tested in 
 - Firefox mobile. (Snapshot)


Snapshot:
---------

| Browser  | Support   |
|----------|-----------|
| Firefox  |   WebRTC  |
| Chrome   |   WebRTC  |
| Safari   |   Flash   |
| Opera    |     ?     |
| IE       |   Flash   |
| Edge     |     ?     |



Clipboard Pasting:
------------------

### Mac OS 10.10+:

| copy from / paste to  | Firefox  | Chrome   |
|-----------------------|----------|----------|
| Mac Finder            |    1)    |    OK    |
| Mac Finder Screenshot |    OK    |    OK    |
| Mac Preview           |    OK    |    OK    |
| Mac Photos App        |    1)    |    OK    |
| QuickTime Player      |    OK    |    OK    |
| Photoshop CS 6        |    OK    |    OK    |
| A Webpage             |    1)    |    OK    |
| MS Word Mac           |    1)    |    OK    |
| LibreOffice           |    OK    |    OK    |

**1)** Nothing happens. As a Workaround paste into Mac Preview first and then copy again.




### Windows 10

| copy from / paste to  | Firefox  | Chrome   |
|-----------------------|----------|----------|
| A Webpage             |    ?     |    ?     |
| Camera App            |    ?     |    ?     |
| Mail App              |    ?     |    ?     |






Filters:
--------
There are two filters allowing you to programmatically disable the plugin features.

    // will disable pasting images
    add_filter('saycheese_enable_pasteboard','__return_false');

    // will disable webcam snapshots
    add_filter('saycheese_enable_snapshot','__return_false');

ToDo:
-----
 - [ ] JS
 	- [x] media-view: use wp.media.cheese namespace
 	- [ ] rework everything
 - [ ] Upload option Format:  ( ) png, ( ) jpeg (paste: defaults to pasted data, record: defaults to jpeg)
 - [ ] Select recording size (QVGA, VGA, SVGA, HD, FullHD)
 	- [ ] Find reliable way to predict supported WebcamSizes
 - [x] use different default file names for paste and snapshot
 - [ ] Documentation
 	- [ ] Matrix copy-from / browser+os -> result
		- [x] Mac
		- [ ] Win
		- [ ] Linux
 - [ ] Add Messages after upload Error
 - [ ] Deprecate Flash fallback

Support
-------
You like what you see? Maybe you already make some money with it? 
Here are two ways to keep me rocking:

<a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=F8NKC6TCASUXE"><img src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!" /></a>
