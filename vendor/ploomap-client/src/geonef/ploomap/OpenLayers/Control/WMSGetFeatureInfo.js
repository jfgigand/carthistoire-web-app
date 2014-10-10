/**
 * @requires OpenLayers/Control/WMSGetFeatureInfo.js
 */

dojo.provide('geonef.ploomap.OpenLayers.Control.WMSGetFeatureInfo');

/**
 * Class: OpenLayers.Control.AireToolbar
 *
 * @todo since we have the geometry, no hover request should be made
 *       until the mouse is out of current feature shape.
 *
 * Inherits from:
 *  - <OpenLayers.Control.Panel>
 */
geonef.ploomap.OpenLayers.Control.WMSGetFeatureInfo =
  OpenLayers.Class(OpenLayers.Control.WMSGetFeatureInfo,
{
  title: "Mode clic d'informations",
  //hover: true,
  //url: '/ows/',
  layers: null,// [water],
  //layerUrls: [],
  infoFormat: 'gml',
  queryVisible: true,

  initialize: function(options) {
    OpenLayers.Control.WMSGetFeatureInfo.prototype.initialize.apply(
      this, arguments);
    this.setPloomapHandlers();
  },

  setPloomapHandlers: function() {
    this.events.on(
      {
        beforegetfeatureinfo: this.handle_beforegetfeatureinfo,
        nogetfeatureinfo: this.handle_nogetfeatureinfo,
        getfeatureinfo: this.handle_getfeatureinfo,
        scope: this
      });
  },

  destroy: function() {
    this.events.un(
      {
        beforegetfeatureinfo: this.handle_beforegetfeatureinfo,
        nogetfeatureinfo: this.handle_nogetfeatureinfo,
        getfeatureinfo: this.handle_getfeatureinfo,
        scope: this
      });
    OpenLayers.Control.prototype.destroy.call(this);
  },

  activate: function () {
    if (!this.layer) {
      this.layer = new OpenLayers.Layer.Vector('data',
        {
          //projection: this.map.getProjection(),
          //optClass: 'geonef.ploomap.layer.UserVector',
          //geometryType: OpenLayers.Geometry.Polygon
          //sldUrl: '/sld/plans.xml',
          //icon: '/images/icons/layer_plans.png'
        });
      this.map.addLayer(this.layer);
    }
    return OpenLayers.Control.WMSGetFeatureInfo.prototype.activate.apply(
      this, arguments);
  },

  deactivate: function () {
    if (this.active) {
      this.map.removeLayer(this.layer);
      this.layer = null;
    }
    return OpenLayers.Control.WMSGetFeatureInfo.prototype.deactivate.apply(
      this, arguments);
  },

  handle_beforegetfeatureinfo: function() {
    //console.log('beforegetfeatureinfo', arguments);
    dojo.publish('jig/workspace/flash',
                 ['Récupération de la donnée...']);
  },

  handle_nogetfeatureinfo: function() {
    console.log('nogetfeatureinfo', this, arguments);
    dojo.publish('jig/workspace/flash',
                 ["Aucune donnée à cet emplacement !"]);
    //alert("Aucune donnée à cet emplacement !");
  },

  handle_getfeatureinfo: function(event) {
    //console.log('getfeatureinfo', arguments);
    if (!event.features || !event.features.length) {
      console.log('no data!', this, arguments);
      //alert("Aucune donnée à cet emplacement !");
      return;
    }
    this.layer.destroyFeatures(this.layer.features.slice(0));
    this.layer.addFeatures(event.features);
    //console.log('layer/f', this, this.layer, event.features);
  }

});
