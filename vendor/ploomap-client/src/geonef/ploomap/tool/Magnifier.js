
dojo.provide('geonef.ploomap.tool.Magnifier');

// parents
dojo.require('geonef.jig.layout._Anchor');
dojo.require('dijit._Templated');
dojo.require('geonef.ploomap.MapBinding');
dojo.require('geonef.jig.input._Container');

// used in template
dojo.require('geonef.jig.input.Group');
dojo.require('geonef.jig.input.BooleanToggleButton');
dojo.require('geonef.ploomap.input.Layer');
dojo.require('dijit.form.HorizontalSlider');
dojo.require('dijit.form.NumberSpinner');
dojo.require('dijit.form.Select');

// used in code
dojo.require('geonef.ploomap.presentation.magnifier');

dojo.declare('geonef.ploomap.tool.Magnifier',
             [ geonef.jig.layout._Anchor, dijit._Templated, geonef.ploomap.MapBinding,
               geonef.jig.input._Container ],
{
  // summary:
  //   Tool to display a magnify glass for map display
  //

  name: 'Loupe',
  icon: dojo.moduleUrl('geonef.ploomap', 'style/icon/tool_magnifier.png'),
  helpPresentation: 'geonef.ploomap.presentation.magnifier',

  interval: 25,

  active: false,
  size: 150,
  factor: 1,

  // attributeMap: Object
  //    Attribute map (dijit._Widget)
  attributeMap: dojo.mixin(dojo.clone(dijit._Widget.prototype.attributeMap), {
    name: { node: 'titleNode', type: 'innerHTML' }
  }),

  templateString: dojo.cache("geonef.ploomap.tool", "templates/Magnifier.html"),
  widgetsInTemplate: true,
  syncThisAttrs: true,

  /*_setEnabledAttr: function(state) {
    this.enabled = state;
    this.setSubValue('enabled', state);
    //this.updateProps();
   },*/

  _setSizeAttr: function(size) {
    //console.log('set size', this, arguments);
    this.size = size;
    this.setSubValue('size', size);
    //this.updateProps();
  },

  _setOpacityAttr: function(opacity) {
    this.opacity = opacity;
    this.setSubValue('opacity', opacity);
    //this.updateProps();
  },

  _setFactorAttr: function(factor) {
    //console.log('set factor', this, arguments);
    this.factor = parseInt(factor, 10);
    this.setSubValue('factor', factor);
    //this.updateProps();
  },

  _setLayerAttr: function(layer) {
    //console.log('set layer', this, arguments);
  },

  /*onMapBound: function() {
    this.inherited(arguments);

  },*/


  onChange: function(widget) {
    //console.log('onChange', widget.name, arguments);
    var state = this.activateButton.attr('checked');
    //this.activateButton.attr('checked', false);
    this.attr('active', false);
    if (widget) {
      this.attr(widget.name, widget.attr('value'));
    }
    this.attr('active', state);
    //this.activateButton.attr('checked', state);
    //this.activateButton.attr('checked', false);
  },

  layerFilter: function(layer) {
    return layer.displayInLayerSwitcher && !layer.isVector;
  },

  /*updateProps: function() {
    this.afterMapBound(
      function() {
        if (this.__updating) return;
        console.log('updateProps');
        this.__updating = true;
        if (this.map) {
          this.destroyMagnifier();
        }
        if (this.enabled) {
          this.createMagnifier();
        }
        this.__updating = false;
      });
  },*/

  startup: function() {
    this.inherited(arguments);
    this._inStartup = true;
    this.attr('active', this.activateButton.attr('checked'));
    this._inStartup = false;
  },

  _setActiveAttr: function(state) {
    //console.log('ACTivate', this, arguments);
    this.activateButton.attr('checked', state);
    if (!this.layerSelect.attr('value')) {
      if (!this._inStartup) {
        dojo.publish('jig/workspace/flash',
                       ["Aucune couche n'est sélectionnée !"]);
      }
      var _cnt;
      _cnt = this.connect(this, '_setLayerAttr',
        function(layer) {
          if (layer) {
            this.disconnect(_cnt);
            this.attr('active', this.activateButton.attr('checked'));
          }
        });
      return;
    }
    if (state) {
      this.createMagnifier();
    } else {
      this.destroyMagnifier();
    }
  },


  createMagnifier: function() {
    //console.log('createMagnifier', this, arguments);
    if (this.map) { return; }
    var masterMap = this.mapWidget.map;
    var selectedLayer = this.layerSelect.attr('value');
    if (selectedLayer.isBaseLayer) {
      this.layers = [ selectedLayer.clone() ];
    } else {
      this.layers = [ masterMap.baseLayer.clone(), selectedLayer.clone() ];
    }
    // add visible vector layers
    this.layers = this.layers.concat(
      masterMap.layers
        .filter(function(l) { return false && /*****/ l.isVector && l.features.length &&
                                     l.getVisibility() && l.inRange; })
        .map(function(l) {
               //console.log('treating orig layer', l);
               /*var layer = l.clone();
               layer.strategies.forEach(function(s) { s.destroy(); });
               layer.strategies = [];*/
               var _class = dojo.getObject(l.CLASS_NAME);
               var layer = new _class(l.name, { alwaysInRange: true,
                                                styleMap: l.styleMap.clone() });
               //l.clone(layer);
               layer.features = l.features.map(function(f) { return f.clone(); });
               return layer;
             }));

    //console.log('made layer list', this.layers, masterMap.baseLayer, selectedLayer);
    var options = {
      numZoomLevels: masterMap.numZoomLevels,
      projection: masterMap.projection,
      units: masterMap.units,
      maxExtent: masterMap.maxExtent,
      controls: []
    };
    //console.log('options', options);
    this.mapDiv = dojo.create('div', { 'class': 'magnifyMap',
                                       style: 'display: none' },
                              this.mapWidget.map.div);
    dojo.style(this.mapDiv, { top: '0px', left: '0px' });
    this.map = new OpenLayers.Map(this.mapDiv, options);
    var self = this;
    /*this.layers.forEach(function(layer) {
                          self.map.addLayer(layer);
                          layer.setVisibility(true);
                          layer.setOpacity(self.opacity / 100);
                          });*/
    this.handler = new OpenLayers.Handler.Drag
                     (this, {
                        down: this.move,
                        move: this.move,
                        done: this.moveDone
                      }, {
                        interval: this.interval,
                        documentDrag: false,
                        map: masterMap
                      });
    this.handler.activate();
  },

  move: function(xy) {
    //window.setTimeout(dojo.hitch(this, function() {
    if (!this.map) { return; }
    var lonlat = this.mapWidget.map.getLonLatFromViewPortPx(xy);
    if (!this.dragging) {
      //console.log('init move', this, arguments, this.size);
      dojo.style(this.mapDiv, { width: ''+this.size+'px',
                                height: ''+this.size+'px',
                                display: '',
                                position: 'absolute' });
      this.mapDivBox = dojo.coords(this.mapDiv);
      //console.log('box', this.mapDivBox);
      dojo.style(this.mapDiv, {
                   top: ''+(xy.y - (this.mapDivBox.h / 2))+'px',
                   left: ''+(xy.x - (this.mapDivBox.w / 2))+'px'
                 });
      if (!this.map.layers.length) {
        var self = this;
        this.layers.forEach(function(layer) {
                              layer.visibility = true;
                              //console.log('adding... layer...', layer);
                              self.map.addLayer(layer);
                              //console.log('added layer', layer);
                              //layer.setVisibility(true);
                                //self.layers.length === 1 || !layer.isBaseLayer);
                              layer.setOpacity(self.opacity / 100);
                            });
      }
      this.map.updateSize();
      this.zoom = this.mapWidget.map.getZoom() + this.factor;
      //console.log('zoom', this.mapWidget.map.getZoom(), this.factor, this.zoom);
      this.map.setCenter(lonlat, this.zoom);
      //dojo.style(this.mapDiv, 'z-index', 42000);
      //this.map.updateSize();
      this.dragging = true;
    } else {
      //console.log('move', lonlat, this.map.id);
      this.map.setCenter(lonlat, this.zoom);
      //this.map.updateSize();
      dojo.style(this.mapDiv, {
                   top: ''+(xy.y - (this.mapDivBox.h / 2))+'px',
                   left: ''+(xy.x - (this.mapDivBox.w / 2))+'px'
                 });
      //this.map.updateSize();
    }
                      //}), 0);
  },

  moveDone: function() {
    //console.log('moveDone', this, arguments);
    dojo.style(this.mapDiv, 'display', 'none');
    this.dragging = false;
  },

  destroyMagnifier: function() {
    if (this.map) {
      //console.log('destroyMagnifier', this);
      this.handler.destroy();
      this.handler = null;
      this.map.destroy();
      this.map = null;
      this.mapDiv.parentNode.removeChild(this.mapDiv);
      this.mapDiv = null;
      //console.log('cleaned objects', this, arguments);
    }
    this.dragging = false;
  },

  destroy: function() {
    this.destroyMagnifier();
    this.inherited(arguments);
  }

});
