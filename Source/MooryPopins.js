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
		cssClass: "",
        /**
         @since 1.3
         * */
        css: {
            id: "overlay-popin",
            cu: "ease",
            cl: "close",
            lo: "loading",
            /**
             @since 1.2
             * */
            pr: "preload"
        },
        /**
         @since 1.4
         * */
        position: {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        },
        /**
         @since 1.4
         * */
        offset: {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        },
        onShow: function() {},
        onLoad: function() {},
        onChange: function() {},
        onClose: function() {}
    },
    /**
     @constructor
     @this {MooryPopins}
     @param {Array} options for behaviours for the displaying the popin/modal
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
                        this._close(this.section);
                    }
                }.bind(this)
            }
        }).inject(document.body, "top");

        this._display(this.overlay);

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
            "class": this.options.cssClass + " " + this.options.css.pr,
            "styles": {
                "position": this.options.fixed?"fixed":"absolute",
                "top": this.options.fixed?this.options.position.top:window.getScroll().y + this.options.offset.top
            }
        }).inject(this.overlay, "after").adopt(
            new Element("button", {
                "class": this.options.css.cl,
                "events": {
                    "click": function(e) {
                        this._close(this.overlay);
                        this._close(this.section);
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
     @param {String} url to show/fetch data from
     @since 1.0
     */
    populate: function(url) {
        var sUID = this.options.framename,
            oElement;
        if (this.options.iframe) {
            if (oElement = document.id(sUID)) {
                oElement.set("src", url);
                this.change();
            } else {
                new IFrame({
                    "id": sUID,
                    "src": url,
                    "events": {
                        "load": function() {
                            this.load();
                            document.body.removeClass(this.options.css.lo);
                        }.bind(this)
                    }
                }).inject(this.section);
                this._display(this.section);
            }
        } else {
            new Request.HTML({
                "url": url,
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
                        this._display(this.section);
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
     @description Display/animate the popin when the contents has loaded
     @param obj to fade in
     @since 1.2
     */
    _display: function(obj) {
        if (this.hasTransition()) {
            this._setTransition(obj);
            (function() {
                this.setStyle("opacity", 1);
            }).delay(5, obj);
        } else {
            obj.fade("in");
        }
        if (obj === this.section) {
            this.section.removeClass(this.options.css.pr);
        }
        this.show();
    },
    /**
     @protected
     @return {void}
     @description Allow the overlay to close when user is hitting the Escape key
     @param {Event} e is the Event to listen to
     @since 1.0
     */
    _keydown: function(e) {
        var eEvent = e || window.event;
        if (eEvent.key === "esc") {
            this._close(this.overlay);
            this._close(this.section);
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
     @param {Object} obj to attach style information to
     @since 1.0
     */
    _setTransition: function(obj) {
        obj.setStyle(this.getPrefix() + "transition", "all " + this.options.duration + "ms "+ this.options.css.cu);
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
     @param {Object} obj to remove
     @since 1.0
     */
    _close: function(obj) {
        if (obj) {
            this.section.addClass(this.options.css.pr);
            if (this.hasTransition()) {
                obj.setStyle("opacity", 0);
            } else {
                obj.fade("out");
            }
            (function() {
                obj.dispose();
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