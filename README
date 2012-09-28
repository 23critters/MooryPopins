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


CSS selector to style the overlay and its children, eg:

	ARTICLE#overlay-popin {}

Options
-----------------
    iframe:     (boolean) Show the response in an IFRAME or a DIV? | default: false (a DIV)
    fixed:      (boolean) Does the popin have a fixed position? If yes, it will follow the user when scrolling | default: false
    src:        (string) Path to the resource you want to display | default: "about:blank"
    duration:   (integer) How long should the transitions take? In milliseconds. | default: 250
    css:        (object) Some default CSS class-/id-names that are used. Change these if they're conflicting with your webpage
    onShow:     Triggers callback when the user opens popin
    onLoad:     Triggers callback when the request has loaded
    onChange:   Triggers callback when user sets new source of the popin
    onClose:    Triggers callback when the user closes popin


Methods
-----------------

The following methods are availible publicly:

    populate: takes string and fetches resource to display in the popin
    hasTransition: returns boolean for wether the browser supports CSS Transitions or not
    getPrefix: returns the browser vendor prefix


Version history
-----------------
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
