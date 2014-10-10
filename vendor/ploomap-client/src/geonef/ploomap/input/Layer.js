
dojo.provide('geonef.ploomap.input.Layer');

dojo.require('dijit.form.Select');
dojo.require('geonef.ploomap.MapBinding');

/**
 * Provides a SELECT menu for choosing between the layers of the bound map
 *
 * The list of layer is kept synced with map's.
 *
 * @class
 */
dojo.declare('geonef.ploomap.input.Layer',
             [ dijit.form.Select, geonef.ploomap.MapBinding ],
{
  // summary:
  //    Extends dijit.form.Select to provide a list of map layers (auto-refreshed)
  //

  postMixInProperties: function() {
    this.inherited(arguments);
    if (dojo.isString(this.filter)) {
      this.filter = dojo.getObject(this.filter);
    }
  },

  filter: function(layer) {
    // overload this to filter the layers appearing in the list
    return true;
  },

  onMapBound: function() {
    this.createInitialOptions();
    this.connect(this.mapWidget.map, 'addLayer', 'onAddLayer');
    this.connect(this.mapWidget.map, 'removeLayer', 'onRemoveLayer');
  },

  createInitialOptions: function() {
    var self = this;
    this.mapWidget.map.layers.filter(this.filter)
      .forEach(function(layer) {
                 self.addOption(
                   { value: layer, label: self.getLayerLabel(layer) });
               });
  },

  _setValueAttr: function(value, priorityChange) {
    //console.log('_setValueAttr', this, arguments);
    if (dojo.isString(value)) {
      var options = this.getOptions();
      //console.log('options', options);
      var option = options.filter(function(o) { return o.value.name === value; })[0];
      //console.log('found', option);
      if (!option) {
        //console.error('value', value, 'not found in options', options, 'for', this);
      }
      dijit.form.Select.prototype._setValueAttr.call(this, option, priorityChange);
    } else {
      this.inherited(arguments);
    }
  },

  getLayerLabel: function(layer) {
    return layer.title || layer.name;
  },

  onAddLayer: function(layer) {
    if (this.filter(layer)) {
      this.addOption({ value: layer, label: this.getLayerLabel(layer) });
    }
  },

  onRemoveLayer: function(layer) {
    var self = this;
    this.getOptions().filter(function(option) { return option.value === layer; })
      .forEach(function(option) { self.removeOption(option); });
  },

  compare: function(/*anything*/val1, /*anything*/val2){
    // overload needed, as dijit implementation only works with scalar values
    return val1 === val2 ? 0 : 1;
  }

});
