
dojo.provide('cartapatate.layer.Plans');

// parents
dojo.require('geonef.ploomap.layer.Vector');

// used in code
dojo.require('geonef.ploomap.OpenLayers.Control.CreateLayerPlan');

dojo.declare('cartapatate.layer.Plans', geonef.ploomap.layer.Vector,
{
  // summary:
  //   Layer details for element layer (reseau, galeries, acces..)
  //

  defaultClickControl: geonef.ploomap.OpenLayers.Control.CreateLayerPlan,
  selectStyleName: 'select',
  multipleSelect: true,

  // postMixInProperties: function() {
  //   this.inherited(arguments);
  //   this.selectControlOptions = dojo.mixin(
  //     {}, this.selectControlOptions, { multiple: true, clickout: false });
  // },

  destroy: function() {
    this.mapWidget.map.events.un({
      removelayer: this.onLayerRemoved, scope: this
    });
    this.inherited(arguments);
  },

  setupLayer: function() {
    this.inherited(arguments);
    this.mapWidget.map.events.on({
      removelayer: this.onLayerRemoved, scope: this
    });
  },

  afterFeaturesAdded: function(event) {
    this.inherited(arguments);
    var features = event.features;
    //console.log('beforeFeaturesAdded', features);
    features.forEach(
        function(feature) {
          if (this.findLayerPlan(feature)) {
            this.mapWidget.selectControl.select(feature);
          }
        }, this);

  },

  findLayerPlan: function(feature) {
    return this.mapWidget.map.layers.filter(
      function(layer) {
        return layer.CLASS_NAME === 'OpenLayers.Layer.pmTMS' &&
          layer.mapName === feature.attributes.name;
      }, this)[0];
  },

  onLayerRemoved: function(event) {
    var layer = event.layer;
    var feature = this.layer.features.filter(
      function(f) { return f.attributes.name === layer.mapName; })[0];
    if (feature && this.layer.selectedFeatures.indexOf(feature) !== -1) {
      this.mapWidget.selectControl.unselect(feature);
    }
  }

});
