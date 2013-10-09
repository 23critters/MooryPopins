Moory Popins
===========

Moory Popins is a nifty widget, written in MooTools framework, that allows you to show popin (modal) windows within a
web page. Browsers that doesn't support CSS Transitions will utilize Javascript fading instead. Settings currently allow
you to show the information in an Iframe or if you want the popin in a fixed position (follows the user when scrolling)

How to use
-----------------

Javascript snippet to initialize the class:

	window.addEvent("domready", function() {
        MP = new MooryPopins({
            src: "MooryPopins.html",
            iframe: false,
            fixed: true,
            onShow: function() {
                console.log("opening");
            },
            onLoad: function() {
                console.log("loaded");
            },
            onClose: function() {
                console.log("closing");
            },
            onChange: function() {
                console.log("set new uri");
            }
        });
	});


CSS selector to style the overlay and its siblings, eg:

	ARTICLE#overlay-popin {}
	ARTICLE#overlay-popin + SECTION {}

Options
-----------------
    iframe:     (boolean) Show the response in an IFRAME or a DIV? | default: false (a DIV)
    fixed:      (boolean) Does the popin have a fixed position? If yes, it will follow the user when scrolling | default: false
    src:        (string) Path to the resource you want to display | default: "about:blank"
    duration:   (integer) How long should the transitions take? In milliseconds. | default: 250
	cssClass:	(string) If you want to supply an additional css-class to the <section> | default: ""
    css:        (object) Some default CSS class-/id-names that are used. Change these if they're conflicting with your webpage
	position:	(object) If you want to set the position of the SECTION, currently only the key "top" is used. | default: 0
	offset:		(object) If you want to offset the position of the SECTION, currently only the key "top" is used. | default: 0
	evalScript: (boolean) If you want to evaluate javascript in the HTML-response. Only used when "iframe" is false | default: true
    onShow:     Triggers callback when the user opens popin
    onLoad:     Triggers callback when the request has loaded
    onChange:   Triggers callback when user sets new source of the popin
    onClose:    Triggers callback when the user closes popin


Methods
-----------------

The following methods are availible publicly:

    populate: takes string and fetches resource to display in the popin
    hasTransition: returns boolean for wether the browser supports CSS Transitions or not
	closeObj: closes and disposes the passed object
    getPrefix: returns the browser vendor prefix

JS Fiddle
-----------------
JS Fiddle can be found here: http://jsfiddle.net/gn5U6/
However, it doesn't seem to work well with cross-site ajax requests, nor opening iframes within iframes. But at least it's up there.


Version history
-----------------
Version 1.4.5

	* Added option evalScript, wether to evaluate javascript in the HTML-response
	* Hopefully squashed the last bugs in IE8

Version 1.4.1

	* Updated inline docs
	* Refactored _close to closeObj

Version 1.4

	* Added option ´position´ and ´offset´ making it slightly easier to move the modal box

Version 1.3

	* Added option cssClass, easier to allow different styling for different modals

Version 1.2

    * Fixed bug with position fixed/absolute. Moved the section-layer outside the overlay
    * Added a private method to display objects
    * Added some nicer CSS for when the popin fades in/out.

Version 1.1

    * Added multiple callbacks that you can set via options; onShow, onLoad, onChange, onClose.
    * Fixed some coding inconsistencies
    * Made hasTransition and getPrefix publicly availible

Version 1.0

    * First version


Known bugs
-----------------

Known bugs that hopefully will be squashed in future releases

	* None atm


Wish list
-----------------

Future features I'd like to implement

    * postMessage API between MooryPopins and any iframe being opened
	* Please create an issue on github if you have any nifty ideas!
