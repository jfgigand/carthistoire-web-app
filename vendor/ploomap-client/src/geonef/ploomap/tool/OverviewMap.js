

dojo.provide('geonef.ploomap.tool.OverviewMap');

// parents
dojo.require('geonef.jig.layout._Anchor');
dojo.require('dijit._Templated');
dojo.require('geonef.ploomap.MapBinding');
dojo.require('geonef.jig.widget._AutoState');
dojo.require('geonef.jig.input._Container');

// used in template
dojo.require('dijit.form.DropDownButton');
dojo.require('dijit.TooltipDialog');
dojo.require('dijit.form.Button');
dojo.require('dijit.form.NumberSpinner');
dojo.require('dijit.form.Select');

// in code
dojo.require('geonef.ploomap.OpenLayers.Control.OverviewMap');

dojo.declare('geonef.ploomap.tool.OverviewMap',
             [ geonef.jig.layout._Anchor, dijit._Templated, geonef.ploomap.MapBinding,
               geonef.jig.widget._AutoState, geonef.jig.input._Container ],
{
  // summary:
  //    Simple tool to present an overview map synced with bound map
  //
  // todo:
  //    - récupère (et sync ?) les layers de la carte
  //      (plus malin : détecte la couche à afficher : baseLayer
  //
  //    - choix de la couche (geonef.ploomap.input.Layer)
  //

  name: "Vue d'aigle",
  icon: dojo.moduleUrl('geonef.ploomap', 'style/icon/tool_overviewmap.png'),

  panAware: true,
  delta: 5,

  copyLayer: null,

  templateString: dojo.cache("geonef.ploomap.tool", "templates/OverviewMap.html"),
  widgetsInTemplate: true,

  getInputRootNodes: function() {
    return [ this.formNode ].concat(this.inherited(arguments));
  },

  startup: function() {
    console.log('startup OV', this, arguments);
    this.inherited(arguments);
  },

  onMapBound: function() {
    this.createControl();
    this.inherited(arguments);
  },

  getControlOptions: function() {
    var options = {
      displayClass: 'olControlOverviewMap',
      //size: new OpenLayers.Size(278, 180),
      minRatio: Math.pow(2, this.delta),
      maxRatio: Math.pow(2, this.delta),
      autoPan: this.panAware,
      //fallThrough: true,
      mapOptions: {
        projection: this.mapWidget.map.getProjectionObject(),
        units: this.mapWidget.map.units,
        maxExtent: this.mapWidget.map.maxExtent,
        numZoomLevels: this.mapWidget.map.numZoomLevels
      },
      layers: []
    };
    var layer;
    if (this.copyLayer) {
      layer = this.mapWidget.map.getLayersByName(this.copyLayer)[0];
      if (!layer) {
        throw new Error('layer not found: '+this.copyLayer);
      }
      if (!layer.isBaseLayer) {
        options.layers.push(this.mapWidget.map.baseLayer.clone());
      }
      options.layers.push(layer.clone());
    } else {
      var googleLayer = dojo.getObject('google.maps.MapTypeId.HYBRID') || G_HYBRID_MAP;
      options.layers.push(new OpenLayers.Layer.Google('minimap', { sphericalMercator: true,
                                                                   type: googleLayer }));
    }
    return options;
  },

  createControl: function() {
    //console.log('createControl', this.id, this, arguments, this.mapWidget, this.mapWidget.map);
    var options = this.getControlOptions();
    //console.log('options', this, arguments);
    this.control = new geonef.ploomap.OpenLayers.Control.OverviewMap( //OpenLayers.Control.OverviewMap(
      dojo.mixin({ div: this.domNode }, options));
    this.mapWidget.map.addControl(this.control);
    dojo.query('> div > .olMap', this.domNode)
      .style({ width: '100%', height: '100%' });
    //dojo.style(this.control.mapDiv, { width: 'auto', height: 'auto' });
    dojo.addClass(this.control.element, 'olControlOverviewMapElement');
    dojo.addClass(this.control.extentRectangle, 'olControlOverviewMapExtentRectangle');
    //this.control.update();
    geonef.jig.connectOnce(this.control, 'createMap', this,
      function() {
        console.log('ovmap', this, arguments, this.control, this.control.ovmap);
        this.connect(this.control.ovmap, 'updateSize',
                     function() { this.control.update(); });
        this.connect(this, 'resize',
                     function() { this.control.ovmap.updateSize(); });
        this.resize();
      });
  },

  destroy: function() {
    if (this.control) {
      this.mapWidget.map.removeControl(this.control);
      this.control.destroy();
      this.control = null;
    }
    this.inherited(arguments);
  },

  _setPanAwareAttr: function(state) {
    if (state === 'false') { state = false; }
    state = !!state;
    this.afterMapBound(
      function() {
        this.panAware = state;
        this.control.setPanAware(state);
        this.setSubValue('panAware', state);
      });
  },

  _setDeltaAttr: function(delta) {
    this.afterMapBound(
      function() {
        var ratio = Math.pow(2, delta);
        this.delta = delta;
        this.control.minRatio = ratio;
        this.control.maxRatio = ratio;
        this.control.update();
        this.setSubValue('delta', delta);
      });
  },

  _setLayerAttr: function(layer) {
    this.afterMapBound(
      function() {
        var newLayer = layer.clone();
        var oldBaseLayer = this.control.ovmap.baseLayer;
        this.control.ovmap.addLayer(newLayer);
        this.control.ovmap.setBaseLayer(newLayer);
        if (oldBaseLayer) {
          this.control.ovmap.removeLayer(oldBaseLayer);
          oldBaseLayer.destroy();
        }
      });
  },


  onChange: function(widget) {
    //console.log('onChange', widget.name, widget);
    this.attr(widget.name, widget.attr('value'));
  },

  layerFilter: function(layer) {
    return layer.displayInLayerSwitcher && layer.isBaseLayer;
  }

});
