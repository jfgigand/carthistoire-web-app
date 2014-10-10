

dojo.provide('geonef.ploomap.layerDef.Base');

dojo.declare('geonef.ploomap.layerDef.Base', null,
{
  // summary:
  //    Base class for layers definitions classes
  //
  // description:
  //    Usually, an application defines its own layer def class inheriting
  //    from other layers def classes which it wants the layers of.
  //    The app layer def class is then registered
  //    on the map widgets' "layersDefinitionsClass" property.
  //

  // mapWidget: object
  //    associated map widget
  mapWidget: null,

  // layers: array
  //    Array of layers, filled at registration time - registerLayers()
  //
  //    It is an array of :
  //        {
  //            name: 'internal_name_of_layer',
  //            title: "human title",
  //            icon: 'path/to/icon.png',
  //            layers: [
  //                {
  //                    creator: function() {}
  //                }
  //            ]
  //        }
  //
  layers: null,

  postscript: function(options) {
    dojo.mixin(this, options);
    this.layers = [];
  },

  registerLayers: function() {
    // overload this
  },

  addLayers: function(layers) {
    this.layers = this.layers.concat(layers.filter(dojo.hitch(this, 'filterOnAdd')));
  },

  filterOnAdd: function(layer) {
    var def = dojo.getObject('workspaceData.settings.layers');
    //console.log('filterOnAdd', this, arguments, !def || def.indexOf(layer.name) !== -1, def);
    return !def || def.indexOf(layer.name) !== -1;
  },

  initialize: function() {
    this.registerLayers();
  },

  addLayerToMap: function(name) {
    //console.log('addLayerToMap', this, arguments);
    var ls = this.layers.filter(function(l) { return l.name === name; });
    if (!ls.length) {
      console.error('did not find named layer from layersDefs:', name, this);
      throw new Error('did not find named layer from layersDefs: '+ name);
    }
    return this.addLayerFromData(ls[0].layers);
  },

  addLayerFromData: function(l) {
    // summary:
    //          add layers for the provided definition
    //console.log('addLayerFromData', this, arguments);
    if (dojo.isArray(l)) {
      var ret;
      l.forEach(dojo.hitch(this,
        function(sl) { ret = this.addLayerFromData(
                         dojo.mixin({icon: l.icon}, sl)); }));
      return ret;
    }
    if (l.name) {
      var lst = this.mapWidget.map.layers.filter(
	  function(z) {
            return z.name === l.name || z.mapName === l.name; });
      if (lst.length > 0) {
        if (lst.length === 1 && lst[0].isBaseLayer) {
          this.mapWidget.map.setBaseLayer(lst[0]);
        } else {
          alert('Déjà sur la carte !');
        }
        return null;
      }
    }
    var layer;
    if (l.creator) {
      layer = l.creator(this.mapWidget);
    } else {
      var Class = geonef.jig.util.getClass(l.layerClass);
      if (l.name) {
        layer = new Class(l.title, l.name,
                          dojo.mixin({ icon: l.icon }, l.layerParams));
      } else {
        layer = new Class(l.title, dojo.mixin({ icon: l.icon }, l.layerParams));
      }
    }
    var zoomToExtent = function(mapWidget) {
      // TODO: manage different projections for baseLayer and this.layer
      var mapExtent = mapWidget.map.getExtent();
      if (layer.layerExtent &&
          (!mapExtent ||
           !layer.layerExtent.intersectsBounds(mapExtent, false))) {
        //console.log('zooming layerExtent', layer.layerExtent);
        mapWidget.map.setOptions({ restrictedExtent: layer.layerExtent });
        mapWidget.map.zoomToExtent(layer.layerExtent, true);
      } else if (layer.maxExtent &&
                 (!mapExtent ||
                  !layer.maxExtent.intersectsBounds(mapExtent, false))) {
        //console.log('zooming layerMaxExtent', layer.maxExtent);
        mapWidget.map.setOptions({ restrictedExtent: layer.maxExtent });
        mapWidget.map.zoomToExtent(layer.maxExtent, true);
      }
    };
    if (!layer.isBaseLayer) {
      zoomToExtent(this.mapWidget);
    }
    if (!layer.map) {
      this.mapWidget.map.addLayer(layer);
    }
    if (layer.isBaseLayer) {
      zoomToExtent(this.mapWidget);
      this.mapWidget.map.setBaseLayer(layer);
      if (!this.mapWidget.map.projection) {
        this.mapWidget.map.setOptions({ projection: layer.projection });
      }
    } else {
      dojo.publish('jig/workspace/flash',
                   [ "Couche ajoutée : "+(layer.title || layer.name) ]);
    }
    return layer;
  }


});
