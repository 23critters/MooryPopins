/*
---

script: MooryPopins.js

name: MooryPopins

description: A helper class for creating popins/modal windows in a web page

license: MIT-style license

authors:
  - Thomas Kunambi
  - kunambi

requires:
  - Core/Class.Extras
  - Core/Element.Event
  - Core/Fx.Tween
  - Core/Request.HTML

provides: [MooryPopins]

...
*/

var MooryPopins = new Class({
    Implements: [Options, Events],
    options: {
        iframe: false,
        fixed: false,
        src: "about:blank",
        duration: 250,
        /**
         @since 1.1
         * */
        framename: "uniquemoorypopinname",
        css: {
            id: "overlay-popin",
            cu: "ease",
            cl: "close",
            lo: "loading"
        },
        onShow: function() {},
        onLoad: function() {},
        onChange: function() {},
        onClose: function() {}
    },
    /**
     @constructor
     @this {MooryPopins}
     @param {Array} Options for behaviours for the displaying the popin/modal
     @author Thomas Kunambi
     @version 1.0
     */
    initialize: function(options) {
        this.setOptions(options);

        this.overlay = new Element("article", {
            "id": this.options.css.id,
            "events": {
                "click": function(e) {
                    e.preventDefault();
                    if (e.target === this.overlay) {
                        this._close(this.overlay);
                    }
                }.bind(this)
            }
        }).inject(document.body, "top");

        if (this.hasTransition()) {
            this._setTransition();
            (function() {
                this.setStyle("opacity", 1);
            }).delay(5, this.overlay);
        } else {
            this.overlay.fade("in");
        }

        this.keydown = this._keydown.bind(this);
        document.addEvent("keydown", this.keydown);

        this._setup();
    },
    /**
     @protected
     @return {void}
     @description Setup the container and close button
     @since 1.0
     */
    _setup: function() {
        document.body.addClass(this.options.css.lo);
        this.section = new Element("section", {
            styles: {
                "position": this.options.fixed?"fixed":"relative"
            }
        }).inject(this.overlay).adopt(
            new Element("button", {
                "class": this.options.css.cl,
                "events": {
                    "click": function(e) {
                        this._close(this.overlay);
                    }.bind(this)
                }
            })
        );
        this.populate(this.options.src);
    },
    /**
     @public
     @return {void}
     @description Populates the Section with data, either an Iframe or a Div with XHR-data
     @param {String} The URL to show/fetch data from
     @since 1.0
     */
    populate: function(sURL) {
        var sUID = this.options.framename,
            oElement;
        if (this.options.iframe) {
            if (oElement = document.id(sUID)) {
                oElement.set("src", sURL);
                this.change();
            } else {
                new IFrame({
                    "id": sUID,
                    "src": sURL,
                    "events": {
                        "load": function() {
                            this.load();
                            document.body.removeClass(this.options.css.lo);
                        }.bind(this)
                    }
                }).inject(this.section);
                this.show();
            }
        } else {
            new Request.HTML({
                "url": sURL,
                "method": "get",
                "headers": {
                    "X-HTTP-XHR": true
                },
                "onSuccess": function(tree, elems, HTML, JS) {
                    if (oElement = document.id(sUID)) {
                        oElement.set("html", HTML);
                        this.change();
                    } else {
                        new Element("div", {
                            "id": sUID,
                            "html": HTML
                        }).inject(this.section);
                        this.show();
                    }
                    this.load();
                    document.body.removeClass(this.options.css.lo);
                }.bind(this)
            }).send();
        }
    },
    /**
     @protected
     @return {void}
     @description Allow the overlay to close when user is hitting the Escape key
     @param {Event} Keystrikes to listen to
     @since 1.0
     */
    _keydown: function(e) {
        var eEvent = e || window.event;
        if (eEvent.key === "esc") {
            this._close(this.overlay);
            document.removeEvent("keydown", this.keydown);
        }
    },
    /**
     @public
     @return {String}
     @description Returns the prefix associated with the current browser brand
     @since 1.0
     */
    getPrefix: function() {
        var sVendorPrefix = "";
        switch(Browser.name) {
            case "safari":
            case "chrome":
                sVendorPrefix = "webkit";
                break;
            case "firefox":
                sVendorPrefix = "moz";
                break;
            case "ie":
                sVendorPrefix = "ms";
                break;
            case "opera":
                sVendorPrefix = "o";
                break;
        }
        return "-" + sVendorPrefix + "-";
    },
    /**
     @protected
     @return {void}
     @description Sets inline CSS transition on the overlay
     @since 1.0
     */
    _setTransition: function() {
        this.overlay.setStyle(this.getPrefix() + "transition", "opacity " + ((this.options.duration/1000).round(2)) + "s "+ this.options.css.cu);
    },
    /**
     @public
     @return {Boolean}
     @description Checks wether the browser is CSS Transform capable
     @since 1.0
     */
    hasTransition: function() {
        var oEl = document.documentElement, s;
        if (oEl && (s = oEl.style)) {
            return typeof s.WebkitTransform == "string" ||
                typeof s.MozTransform == "string" ||
                typeof s.OTransform == "string" ||
                typeof s.MsTransform == "string" ||
                typeof s.transform == "string";
        }
        return false;
    },
    /**
     @protected
     @return {void}
     @description Sets an objects opacity to 0, then removes it from DOM after default specified time
     @param {Object} HTML Object to remove
     @param {Function} Callback function to execute when HTML Object has been removed
     @since 1.0
     */
    _close: function(obj) {
        var oObj = document.id(obj);
        if (oObj) {
            if (this.hasTransition()) {
                oObj.setStyle("opacity", 0);
            } else {
                oObj.fade("out");
            }
            (function() {
                oObj.dispose();
            }).delay(this.options.duration, this);
            this.close();
        }
    },
    /**
     @public
     @return {void}
     @description Triggers callback when the user opens popin
     @since 1.1
     */
    show: function() {
        this.fireEvent("show");
    },
    /**
     @public
     @return {void}
     @description Triggers callback when the request has loaded
     @since 1.1
     */
    load: function() {
        this.fireEvent("load");
    },
    /**
     @public
     @return {void}
     @description Triggers callback when user sets new source of the popin
     @since 1.1
     */
    change: function() {
        this.fireEvent("change");
    },
    /**
     @public
     @return {void}
     @description Triggers callback when the user closes popin
     @since 1.1
     */
    close: function() {
        this.fireEvent("close");
    }
});
