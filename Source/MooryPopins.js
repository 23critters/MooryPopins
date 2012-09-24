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
  - Core/Class
  - Core/Element
  - Core/Element.Event
  - Core/Fx.Tween
  - Core/Request.HTML

provides: [MooryPopins]

...
*/

var MooryPopins = new Class({
    Implements: Options,
    options: {
        iframe: false,
        fixed: false,
        src: "about:blank",
        duration: 250,
        css: {
            id: "overlay-popin",
            cu: "ease",
            cl: "close",
            lo: "loading"
        }
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

        if (this._hasTransition()) {
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
     @protected
     @return {void}
     @description Populates the Section with data, either an Iframe or a Div with XHR-data
     @param {String} The URL to show/fetch data from
     @since 1.0
     */
    populate: function(sURL) {
        var sUID = "uniquemoorypopinname";
        if (this.options.iframe) {
            if (document.id(sUID)) {
                document.id(sUID).set("src", sURL);
            } else {
                new IFrame({
                    "id": sUID,
                    "src": sURL,
                    "events": {
                        "load": function() {
                            document.body.removeClass(this.options.css.lo);
                        }.bind(this)
                    }
                }).inject(this.section);
            }
        } else {
            new Request.HTML({
                "url": sURL,
                "method": "get",
                "headers": {
                    "X-HTTP-XHR": true
                },
                "onSuccess": function(tree, elems, HTML, JS) {
                    if (document.id(sUID)) {
                        document.id(sUID).set("html", HTML);
                    } else {
                        new Element("div", {
                            "id": sUID,
                            "html": HTML
                        }).inject(this.section);
                    }
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
     @protected
     @return {String}
     @description Returns the prefix associated with the current browser brand
     @since 1.0
     */
    _getPrefix: function() {
        var sPrefix = "";
        switch(Browser.name) {
            case "safari":
            case "chrome":
                sPrefix = "webkit";
                break;
            case "firefox":
                sPrefix = "moz";
                break;
            case "ie":
                sPrefix = "ms";
                break;
            case "opera":
                sPrefix = "o";
                break;
        }
        return sPrefix;
    },
    /**
     @protected
     @return {void}
     @description Sets inline CSS transition on the overlay
     @since 1.0
     */
    _setTransition: function() {
        this.overlay.setStyle("-" + this._getPrefix() + "-transition", "opacity " + ((this.options.duration/1000).round(2)) + "s "+ this.options.css.cu);
    },
    /**
     @protected
     @return {Boolean}
     @description Checks wether the browser is CSS Transform capable
     @since 1.0
     */
    _hasTransition: function() {
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
    _close: function(obj, fnCallback) {
        var obj = document.id(obj);
        if (obj) {
            if (this._hasTransition()) {
                obj.setStyle("opacity", 0);
            } else {
                obj.fade("out");
            }
            (function() {
                obj.dispose();
                if (fnCallback) {
                    fnCallback();
                }
            }).delay(this.options.duration, this)
        }
    }
});
