
dojo.provide('geonef.ploomap.map.Classical');

// parent classes
dojo.require("geonef.jig.layout._Anchor");
dojo.require('geonef.jig.widget._AutoState');
dojo.require('geonef.jig.widget._AsyncInit');

// used in code
dojo.require('geonef.jig.button.TooltipWidget');
dojo.require('geonef.ploomap.tool.MapTools');
dojo.require('geonef.ploomap.input.MapExtent');
dojo.require('geonef.jig.util');
dojo.require('dojo.fx.easing');

/**
 * Default OpenLayers map widget
 *
 * @class
 */
dojo.declare("geonef.ploomap.map.Classical",
	     [ geonef.jig.layout._Anchor, geonef.jig.widget._AutoState,
               geonef.jig.widget._AsyncInit ],
{
  title: 'Carte',

  map: null,

  layersDefsClass: 'geonef.ploomap.layerDef.Default',

  mapOptions: {},

  zoomAnimationFx: true,

  zoomLevelGroups: [
    { min: 0, max: 2, name: 'world', label: 'Monde', lineHeight: 30 },
    { min: 3, max: 5, name: 'continent', label: 'Continent', lineHeight: 30 },
    { min: 6, max: 7, name: 'country', label: 'Pays', lineHeight: 18 },
    { min: 8, max: 10, name: 'region', label: 'Région', lineHeight: 30 },
    { min: 11, max: 12, name: 'department', label: 'Département', lineHeight: 18 },
    { min: 13, max: 14, name: 'city', label: 'Commune', lineHeight: 18 },
    { min: 15, max: 17, name: 'district', label: 'Quartier', lineHeight: 30 },
    { min: 18, max: 21, name: 'street', label: 'Rue', lineHeight: 42 }
  ],

  /**
   * Event: widget is initialised, map ready to be built
   *
   * @type {!geonef.jig.Deferred}
   */
  asyncInit: null,

  /**
   * Event: map is initialised, built and ready to use
   *
   * Depends on asyncInit
   *
   * @type {!geonef.jig.Deferred}
   */
  isReady: null,

  /////////////////////////////////////////////////////////////
  // WIDGET LIFECYCLE

  destroy: function() {
    //console.log('destroy map');
    if (this.optionsButton) {
      this.optionsButton.destroy();
    }
    this.inherited(arguments);
  },

  postMixInProperties: function() {
    this.inherited(arguments);
    this.isReady = new geonef.jig.Deferred();
  },

  buildRendering: function() {
    this.inherited(arguments);
    dojo.addClass(this.domNode, 'jigCacoin ploomapMap');
    dojo.style(this.domNode, 'overflow', 'hidden');
  },


  onAsyncInitEnd: function() {
    this.build();
  },

  /**
   * Triggered by this.asyncInit
   * Triggers this.isReady
   */
  build: function() {
    this._activeControls = {};
    OpenLayers.ImgPath = '/images/openlayers/';
    this.createMap();
    this.setupEvents();
    this.createLayersDefs();
    this.createButtons();
    this.inherited(arguments);
    window.setTimeout(dojo.hitch(this,
      function() {
        this.isReady.callback();
        dojo.publish('ploomap/map/start', [ this ]);
      }), 50);
  },

  resize: function(size) {
    //console.log('resize map', this);
    // The map center must be re-adjusted
    // (not automatically done by OL since Firefox doesn't allow it to
    // capture the resize event)
    //
    if (this.map) {
      //console.log('before update size', this, arguments);
      this.map.updateSize();
      //console.log('after update size', this, arguments);
    }
  },


  /////////////////////////////////////////////////////////////
  // INFORMATION

  getLayerNames: function() {
    return this.map.layers.map(function(l) { return l.name; });
  },


  /////////////////////////////////////////////////////////////
  // CONSTRUCTION

  createMap: function() {
    //console.log('create Classical map', this, arguments);
    this.map = new OpenLayers.Map(this.domNode.id, dojo.mixin(
                 {
                   mapWidget: this,
                   numZoomLevels: 23,
                   projection: new OpenLayers.Projection('EPSG:900913'),
                   units: 'm',
                   maxExtent: new OpenLayers.Bounds(-20037508.34, -20037508.34,
                                                    20037508.34, 20037508.34),
                   controls: [],
                   //fractionalZoom: true,
                   //panMethod: OpenLayers.Easing.Expo.easeOut
                 }, this.mapOptions));
  },

  setupEvents: function() {
    var self = this;
    this.map.events.on({
      moveend: function() { this.onMapMove(); },
      changebaselayer: function() {
        dojo.publish('ploomap/map/changebaselayer', [self]); },
      scope: this
    });
    this.connect(this.map, 'addLayer', 'onAddLayer');
    //this.connect(this.map.div, !dojo.isMozilla ? 'onmousewheel' : 'DOMMouseScroll', 'onMouseWheel');
    //this.connect(this.map.div, 'onclick', 'onClick');
  },

  onAddLayer: function(layer) {
    if (layer.displayInLayerSwitcher && !layer.controllerWidget) {
      dojo.style(layer.div, 'opacity', 0);
      window.setTimeout(
        function() {
          dojo.animateProperty(
            {
              node: layer.div, duration: 1000,
	      properties: {
                opacity: { start: 0, end: 1 }
              },
	      easing: dojo.fx.easing.quartIn
            }).play();
        }, 800);
    }
  },

  createLayersDefs: function() {
    var _class = geonef.jig.util.getClass(this.layersDefsClass);
    this.layersDefs = new _class({ mapWidget: this });
    this.layersDefs.initialize();
  },

  createButtons: function() {
    var self = this;
    this.buttons = {};
    this.buttons.tools = new geonef.jig.button.TooltipWidget({
                      id: this.id + '-buttons-tools',
                      label: 'Outils',
	              widgetCreateFunc: function() {
	                return new geonef.ploomap.tool.MapTools({ mapWidget: self });
	              }});
    this.buttons.location = new geonef.ploomap.input.MapExtent(
                         { id: this.id + '-buttons-location', mapWidget: this });
    [ 'tools', 'location' ].forEach(dojo.hitch(this,
      function(n) {
        var button = self.buttons[n];
        button.connect(button.domNode, 'onmousedown',
                       function(evt) { evt.stopPropagation(); });
        dojo.addClass(button.domNode, 'cacoinButton');
        dojo.place(button.domNode, this.domNode);
        button.startup();
      }));
  },


  /////////////////////////////////////////////////////////////
  // EVENTS

  onMapMove: function() {
    //console.log('map onMapMove!', this);
    var newZoom = this.map.getZoom();
    if (newZoom !== this._oldZoom) {
      this.onZoomChange(newZoom);
    }
    this._oldZoom = newZoom;
  },

  onZoomChange: function(newZoom) {
    // overload this and/or dojo.connect it
  },


  /////////////////////////////////////////////////////////////
  // ACTIONS

  /**
   * Set map location based on navigator geolocation
   *
   * Warning: errors not reported to deferred.
   *
   * @return {geonef.jig.Deferred}
   */
  geoLocalizeNavigator: function() {
    dojo.publish('jig/workspace/flash',
                 ["Géolocalisation du navigateur..."]);
    var deferred = new geonef.jig.Deferred();
    if (!navigator.geolocation) {
        dojo.publish('jig/workspace/flash',
                     ["Échec de géolocalisation automatique : " + str]);
      deferred.errback(-1);
      return deferred;
    }
    var self = this;
    navigator.geolocation.getCurrentPosition(
      function(position) {
        var lonLat2 = new OpenLayers.LonLat(
          position.coords.longitude, position.coords.latitude);
        dojo.publish('jig/workspace/flash',
                     ["Géolocalisation à : "+lonLat2.toShortString()]);
        lonLat2.transform(new OpenLayers.Projection('EPSG:4326'),
                          self.map.getProjectionObject());
        //self.map.setCenter(lonLat2);
        self.map.panTo(lonLat2);
        window._pos = lonLat2;
        deferred.callback(lonLat2);
      },
      function(error) {
        //console.warn('Geolocation failure', error);
        var str = "erreur non répertoriée";
        var msgs = {
          PERMISSION_DENIED: "permission refusée",
          POSITION_UNAVAILABLE: "position non disponible",
          TIMEOUT: "temps d'attente écoulé"
        };
        var errors = error.prototype || error.__proto__;
        for (var k in msgs) {
          //console.log('k', this, k, msgs, error.code, errors, error, error.prototype, error.__proto__);
          if (msgs.hasOwnProperty(k) && errors.hasOwnProperty(k) &&
              error.code === errors[k]) {
            str = msgs[k];
            break;
          }
        }
        dojo.publish('jig/workspace/flash',
                     ["Échec de géolocalisation automatique : " + str]);
        //deferred.errback(error.code);
      },
      { enableHighAccuracy: true }
    );
    return deferred;
  },

  /**
   * Remove & layer with a nice fading effect
   *
   * @param {OpenLayers.Layer} layer
   */
  destroyLayerWithEffect: function(layer) {
    var doIt = dojo.hitch(this,
      function() {
        if (layer.group) {
          //console.log('doIt', this, arguments, this.map);
          this.map.getLayersBy('group', layer.group)
            .forEach(function(subLayer) {
                       //console.log('sublayer', this, arguments);
                       subLayer.map.removeLayer(subLayer);
                       try {
                         subLayer.destroy();
                       } catch (e) {
                         console.warn('got exception at subLayer destroy:', e, subLayer);
                       }
                     });
        } else {
          // we have to remove the layer from map before destroying
          // for vector layers (geonef.ploomap.layer.Vector and its controls)
          //console.log('doIt else', this, arguments, this.map);
          this.map.removeLayer(layer);
          try {
            // in try{}catch{} because OpenLayers.Layer.Grid.prototype.destroy
            // yields an error when trying to get map resolution...
            layer.destroy();
          } catch (e) {
            console.warn('got exception at layer destroy:', e, layer);
          }
        }
      });
    var opacity = dojo.style(layer.div, 'opacity');
    dojo.animateProperty(
      {
        node: layer.div, duration: 800,
	properties: {
          opacity: { start: opacity, end: 0 }
        },
	easing: dojo.fx.easing.sinIn,
        onEnd: doIt
      }).play();
  },


  /////////////////////////////////////////////////////////////
  // Getters + Setters

  _getStateAttr: function() {
    //console.log('map _getStateAttr', this);
    // TODO: completer...
    console.warn('ploomap map state getter not fully implemented', this);
    var data = {};
    if (this.map) {
      data.center = {
	zoom: this.map.getZoom(),
	x: parseInt(this.map.getCenter().lon),
	y: parseInt(this.map.getCenter().lat)
      };
    }
    return data;
  },

  _setLayersAttr: function(layers) {
    var self = this;
    this.isReady.addCallback(
      function() {
        console.log('setLayers', layers);
        layers.forEach(
          function(props) {
            if (!dojo.isObject(props)) {
              props = { name: props };
            }
            var layer = self.layersDefs.addLayerToMap(props.name);
            if (layer) {
              if (props.visibility === true || props.visibility === false) {
                layer.setVisibility(props.visibility);
              }
              if (typeof props.opacity == 'number') {
                layer.setOpacity(props.opacity);
              }
            }
          });
        self.map.updateSize();
      });
  },

  _setCenterAttr: function(center) {
    var self = this;
    this.isReady.addCallback(
      function() {
        var lonLat = new OpenLayers.LonLat(center.x, center.y);
        self.map.setCenter(lonLat, center.zoom);
        if (center.geoloc && navigator.geolocation) {
          self.geoLocalizeNavigator();
        }
      });
  },

  _setButtonsAttr: function(buttons) {
    var self = this;
    this.addOnStartup(
      function() {
        for (var i in buttons) {
          if (buttons.hasOwnProperty(i) && self.buttons.hasOwnProperty(i)) {
            dojo.style(self.buttons[i].domNode, 'display', buttons[i] ? '' : 'none');
          }
        }
      });
  },

  _setControlsAttr: function(controls) {
    if (!dojo.isArray(controls)) {
      return;
    }
    var self = this;
    this.isReady.addCallback(
      function() {
        controls.forEach(
          function(def) {
            var _class, options = {};
            if (dojo.isString(def)) {
              _class = def;
            } else {
              _class = def['class'],
              options = def['options'];
              if (dojo.isString(options.div)) {
                options.div = dojo.byId(options.div);
              }
            }
            var Class = geonef.jig.util.getClass(_class/*, false*/);
            var control = new Class(options);;
            self.map.addControl(control);
            if (0 && control.handlers && control.handlers.wheel)  {
              console.log('connect', self, control);
              self.connect(self.map.div, !dojo.isMozilla ? 'onmousewheel' : 'DOMMouseScroll',
                           //control.handlers.wheel.wheelListener);
                           function() {
                             console.log('event!', self, arguments);
                             control.handlers.wheel.wheelListener.apply(this/*sic*/, arguments);
                           });
            }
          });
      });
  },

  _setTitleAttr: function(title) {
    this.title = title;
  }

  // setMouseWheelHandler: function(keys, func, onDisableFunc) {
  //   console.log('setMouseWheelHandler', this, arguments);
  //   if (this.mouseWheelHandlerOnDisable) {
  //     this.mouseWheelHandlerOnDisable();
  //   }
  //   this.mouseWheelHandler = func;
  //   this.mouseWheelHandlerOnDisable = onDisableFunc;
  // },

  // onMouseWheel: function(event) {
  //   console.log('onMouseWheel', this, arguments);
  //   for (var el = event.target; el !== this.map.div; el = el.parentNode) {
  //     if (el.hasAttribute('widgetid')) {
  //       return;
  //     }
  //   }
  //   dojo.stopEvent(event);
  //   //return;
  //   var janky = !dojo.isMozilla;
  //   var scroll = event[(janky ? "wheelDelta" : "detail")] * (janky ? 1 : -1);
  //   var px = new OpenLayers.Pixel(event.clientX, event.clientY);
  //   var lonLat = this.map.getLonLatFromViewPortPx(px);
  //   var center1 = this.map.getCenter();
  //   //var centerPx = this.map.get
  //   var zoom = this.map.getZoom();
  //   //var res  = this.map.getResolution();
  //   var newZoom = zoom + (scroll > 0 ? 1 : -1);
  //   var newRes = this.map.getResolutionForZoom(newZoom);
  //   //var newRes = res * (scroll > 0 ? 0.5 : 2);
  //   var size = this.map.getSize();
  //   var delta_x = size.w / 2 - px.x;
  //   var delta_y = size.h / 2 - px.y;
  //   // var map = this.map;
  //   // var animate = function(zoom) {
  //   //   var iRes = map.getResolutionForZoom(zoom);
  //   //   var center = new OpenLayers.LonLat(lonLat.lon + delta_x * iRes,
  //   //                                      lonLat.lat + delta_y * iRes);
  //   //   map.moveTo(center, zoom, { dragging: true });
  //   //   console.log('animate', zoom, iRes, delta_x, delta_y, center);
  //   // };
  //   // var animation = new dojo.Animation(
  //   //   {
  //   //     curve: [zoom, newZoom],
  //   //     easing: dojo.fx.easing.sinInOut,
  //   //     duration: 2000,
  //   //     rate: 50,
  //   //     onAnimate: animate,
  //   //     onEnd: function() {
  //   //       var center = new OpenLayers.LonLat(lonLat.lon + delta_x * newRes,
  //   //                                          lonLat.lat + delta_y * newRes);
  //   //       map.moveTo(center, newZoom, { dragging: false });
  //   //       console.log('end', newZoom, newRes, delta_x, delta_y, center);
  //   //     }
  //   //   });
  //   // animation.play();

  //   var center = new OpenLayers.LonLat(lonLat.lon + delta_x * newRes,
  //                                      lonLat.lat - delta_y * newRes);
  //   if (this.zoomAnimationFx) {
  //     // rectangle animation
  //     var div = dojo.create('div',
  //       { style: 'z-index:100000;position:absolute;border:2px solid #f00;'},
  //                           this.domNode);
  //     // var top1 = (scroll>0? size.h/4: 0) - delta_y;
  //     // var top2 = (scroll>0? 0: size.h/4);
  //     // var left1 = (scroll>0? size.w/4: 0) - delta_x;
  //     // var left2 = (scroll>0? 0: size.w/4);
  //     var smallRectSize = 30;
  //     var bigRectSize = 60;
  //     var startRectSize = scroll > 0 ? smallRectSize : bigRectSize;
  //     var endRectSize   = scroll < 0 ? smallRectSize : bigRectSize;
  //     var props = {
  //       left:   { start: px.x - startRectSize / 2,
  //                 end: px.x - endRectSize / 2 },
  //       top:    { start: px.y - startRectSize / 2,
  //                 end: px.y - endRectSize / 2 },
  //       width:  { start:  startRectSize, end: endRectSize },
  //       height: { start:  startRectSize, end: endRectSize },
  //       opacity: { start: 1, end: 0 }
  //     };
  //     var anim = dojo.animateProperty(
  //       {
  //         node: div, duration: 800, //rate: 50,
  //         properties: props /*{
  //           left:   { start: (scroll>0? size.w/4: 0) - delta_x/2,
  //                     end:    scroll>0? 0: size.w/4-delta_x/2 },
  //           top:    { start: (scroll>0? size.h/4: 0) - delta_y/2,
  //                     end:    scroll>0? 0: size.h/4-delta_y/2 },
  //           width:  { start:  scroll>0? size.w/2: size.w,
  //                     end:    scroll>0? size.w: size.w/2 },
  //           height: { start:  scroll>0? size.h/2: size.h,
  //                     end:    scroll>0? size.h: size.h/2 }
  //         }*/,
  //         easing: dojo.fx.easing.quadOut,
  //         onEnd: function() { div.parentNode.removeChild(div); }
  //       });
  //     anim.play();
  //   }
  //   // eventually...
  //   // if (this.zoomAnimationFx) {
  //   // }
  //   var self = this;
  //   window.setTimeout(
  //     function() {
  //       // this.map.layers.forEach(
  //       //   function(l) {
  //       //     if (!l.isBaseLayer) {
  //       //       l.__vis = l.getVisibility();
  //       //       if (l.__vis) {
  //       //         console.log('hiding', l);
  //       //         l.setVisibility(false);
  //       //       }
  //       //     }
  //       //   });
  //       self.map.moveTo(center, newZoom);
  //       // this.map.layers.forEach(
  //       //   function(l) {
  //       //     if (!l.isBaseLayer && l.__vis) {
  //       //       console.log('showing', l);
  //       //       l.setVisibility(true);
  //       //       delete l.__vis;
  //       //     }
  //       //   });
  //     }, 50);
  // }

  // onClick: function(event) {
  //   var undefined;
  //   if (event.clientX !== undefined && this.map) {
  //     var px = new OpenLayers.Pixel(event.clientX, event.clientY);
  //     var lonLat = this.map.getLonLatFromViewPortPx(px);
  //     var lonLat2 = lonLat.clone().transform(
  //       this.map.getProjectionObject(), new OpenLayers.Projection('EPSG:4326'));
  //     console.log('CLICKED POINT xy=', event.clientX, event.clientY,
  //                 'coords=', lonLat.lon, lonLat.lat, '4326=', lonLat2.lon, lonLat2.lat);
  //   }
  // }

});
