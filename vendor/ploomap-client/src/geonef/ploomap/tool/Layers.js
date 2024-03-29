
dojo.provide('geonef.ploomap.tool.Layers');

dojo.require('geonef.jig.layout._Anchor');
dojo.require('dijit._Templated');
dojo.require('dijit._Widget');
//dojo.require('geonef.ploomap.tool.LayersOptions');
dojo.require('geonef.jig.button.TooltipWidget');
dojo.require('geonef.ploomap.MapBinding');
dojo.require('dojo.dnd.Source');
dojo.require('geonef.jig.util');

dojo.declare('geonef.ploomap.tool.Layers',
	     [ geonef.jig.layout._Anchor, dijit._Templated, geonef.ploomap.MapBinding ],
{
  // summary:
  //		display a list of map layers, updated automatically from OpenLayer map
  //
  // state options:
  //            - mapWidget : ID of map widget
  //


  //helpPresentation: 'geonef.ploomap.presentation.layers',
  autoBuildAnchorButton: false,
  //widgetOptionsClass: geonef.ploomap.tool.LayersOptions,

  layerClassName: 'geonef.ploomap.tool.layer.Simple',
  layerGroupClassName: 'geonef.ploomap.tool.layer.Select',
  name: 'Couches',
  icon: dojo.moduleUrl('geonef.ploomap', 'style/icon/tool_layers.png'),
  layerLibraryClass: 'geonef.ploomap.tool.LayerLibrary',

  templateString: dojo.cache("geonef.ploomap.tool", "templates/Layers.html"),
  widgetsInTemplate: true,

  postMixInProperties: function() {
    this.inherited(arguments);
    var params = dojo.getObject('workspaceData.settings.layerManager');
    dojo.mixin(this, params);
    this.layerClass = geonef.jig.util.getClass(this.layerClassName);
    this.layerGroupClass = geonef.jig.util.getClass(this.layerGroupClassName);
    this.layerWidgets = [];
  },

  buildRendering: function() {
    this.inherited(arguments);
    this.createDnd();
  },

  createDnd: function() {
    this.listNode.dndType = this.id;
    this.listNode.type = this.id;
    this.dnd = new dojo.dnd.Source(this.listNode,
                                   { withHandles: true,
                                     singular: true,
                                     accept: this.id+'-dnd',
                                     creator: dojo.hitch(this, 'dndAvatarCreator')
                                   });
    this.connect(this.dnd, 'onDrop', 'onLocalOrderChange');
  },

  dndAvatarCreator: function(item) {
    //console.log('creator', this, arguments);
    var avatar = dojo.create('div', { innerHTML: 'Déplacement de la couche...' });
    return {
      node: avatar,
      data: item,
      type: this.id+'-dnd'
    };
  },

  onMapBound: function() {
    this.updateList();
    this.mapWidget.map.events.on(
      {
        addlayer: this.onAddLayer,
        //removelayer: this.onRemoveLayer,
        scope: this
      });
    //this.connect(this.mapWidget.map, 'addLayer', 'onAddLayer');
    //this.connect(this.mapWidget.map, 'removeLayer', 'onRemoveLayer');
  },

  destroy: function() {
    this.mapWidget.map.events.un(
      {
        addlayer: this.onAddLayer,
        //removelayer: this.onRemoveLayer,
        scope: this
      });
    this.inherited(arguments);
    this.dnd.destroy();
    this.dnd = null;
  },

  updateList: function() {
    // sort
    this.mapWidget.map.layers.forEach(
      dojo.hitch(this, function(layer) { this.onAddLayer({layer:layer}, false); }));
  },

  onAddLayer: function(event, noEffect) {
    var layer = event.layer;
    if (!layer.displayInLayerSwitcher) { return; }
    var w = this.addLayerToList(layer);
    if (w && !noEffect/* && !layer.controllerWidget*/) {
      geonef.jig.workspace.highlightWidget(w, 'open');
    }
  },

  removeLayerFromList: function(layer /*event*/) {
    //console.log('removeLayerFromList', this, arguments);
    //var layer = event.layer;
    for (var i = 0; i < this.layerWidgets.length; i++) {
      if (this.layerWidgets[i].layer === layer) {
        console.log('calling tool.layer.* destroy', this, arguments, i);
        this.layerWidgets[i].destroy();
        console.log('calling tool.layer.* destroy DONE');
	this.layerWidgets.splice(i, 1);
        //dojo.remove(layer.domNode);
	return;
      }
    }
  },

  addLayerToList: function(layer) {
    // summary:
    //          instanciate widget for layer

    if (layer.isBaseLayer) {
      layer.group = 'base';
    }
    //console.log('addLayerToList', this, layer);
    if (layer.group) {
      var _list = this.layerWidgets.filter(
	function(l) { return l.group === layer.group; });
      if (_list.length) {
	_list[0].addLayer(layer);
	return null;
      }
    }
    var
    Class = this.getWidgetClassForLayer(layer)
    , w = new Class({ mapWidget: this.mapWidget, layer: layer });
    dojo.addClass(w.domNode, 'dojoDndItem');
    /*dojo.create('span', { 'class': 'dojoDndHandle',
                          innerHTML: '&uarr;&darr;',
                          title: 'Déplacer la couche...' }, w.domNode, 'first');*/
    dojo.place(w.domNode, this.listNode, 'first');
    this.dnd.sync();
    w.startup();
    this.layerWidgets.push(w);
    //console.log('bef connect', this, arguments, this.removeLayerFromList);
    w.connect(layer, 'removeMap', dojo.hitch(this, 'removeLayerFromList', layer));
    return w;
  },

  getWidgetClassForLayer: function(layer) {
    if (layer.isBaseLayer || layer.group) {
      return this.layerGroupClass;
    }
    return this.layerClass;
  },

  onLocalOrderChange: function() {
    //console.log('onLocalOrderChange', this, arguments);
    var index = 100;
    var self = this;
    dojo.query('> div', this.listNode).reverse().forEach(
      function(div) {
        var layerW = self.layerWidgets.filter(function(w) { return w.domNode === div; })[0];
        layerW.setIndex(index);
        //self.mapWidget.map.setLayerIndex(layer, index);
        index += 100;
      });
  }

});
