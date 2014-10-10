
dojo.provide('geonef.ploomap.layerDef.Google');

// parents
dojo.require('geonef.ploomap.layerDef.Base');

/**
 * Provide official Google Maps layers through Google Maps v3 API
 *
 * @class
 */
dojo.declare('geonef.ploomap.layerDef.Google', geonef.ploomap.layerDef.Base,
{

  registerLayers: function() {
    this.inherited(arguments);
    this.registerGoogleLayers();
  },

  registerGoogleLayers: function() {
    //console.log('registerGeoportalLayers', this, arguments);
    if (!dojo.isFunction(dojo.getObject('google.maps.Map'))) {
      throw new Error('the Google layerDef class needs the GMap v3 api');
    }
    this.addLayers(this.googleLayersDefs.map(
        function(def) {
          return {
            name: 'google_'+def.name,
            title: def.title,
            icon: dojo.moduleUrl('geonef.ploomap', 'style/icon/layer_gmap.png'),
            provider: 'google',
            collection: 'google-baseMap',
            layers: [
              {
                creator: function(mapWidget) {
                  var layer = new OpenLayers.Layer.Google(def.title,
                    {
	              type: def.gmap,
                      animationEnabled: true,
                      alwaysInRange: true, inRange: true,
                      icon: dojo.moduleUrl('geonef.ploomap',
                                           'style/icon/layer_gmap.png'),
	              layerId: 'google_'+def.name,
                      metadata: {
                        description: def.description,
                        url: 'http://maps.google.com/',
                        region: 'Monde'
                      }
                    });
                  // geonef.jig.connectOnce(layer, 'loadMapObject', {},
                  //                 function() {
                  //                   console.log('enable!', this, arguments);
                  //                   layer.mapObject.enableContinuousZoom();
                  //                 });
                  return layer;
                }
              }
            ]
          };
        }, this));
  },

  googleLayersDefs: [
    {
      name: 'hybrid',
      title: "rues & satellite",
      gmap: google.maps.MapTypeId.HYBRID,
      description: "Google Maps - Vue mixte rues & satellite"
    },
    {
      name: 'normal',
      title: "rues",
      gmap: google.maps.MapTypeId.ROADMAP,
      description: ""
    },
    {
      name: 'satellite',
      title: "vue satellite",
      gmap: google.maps.MapTypeId.SATELLITE,
      description: "Google Maps - Vue satellite"
    },
    {
      name: 'physical',
      title: "relief",
      gmap: google.maps.MapTypeId.TERRAIN,
      description: "Google Maps - vue des reliefs"
    },
    // {
    //   name: 'aerial',
    //   title: "vue aérienne",
    //   gmap: G_AERIAL_MAP,
    //   description: "Google Maps - vue aérienne"
    // },
    // {
    //   name: 'aerial_hybrid',
    //   title: "rues & vue aérienne",
    //   gmap: G_AERIAL_HYBRID_MAP,
    //   description: "Google Maps - vue aérienne mixte"
    // },
    // {
    //   name: 'sky_visible',
    //   title: "Ciel",
    //   gmap: G_SKY_VISIBLE_MAP,
    //   description: "",
    //   test: true
    // },
    // {
    //   name: 'moon_elevation',
    //   title: "Lune - altitude",
    //   gmap: G_MOON_ELEVATION_MAP,
    //   description: ""
    // },
    // {
    //   name: 'moon_visible',
    //   title: "Lune - photo",
    //   gmap: G_MOON_VISIBLE_MAP,
    //   description: ""
    // },
    // {
    //   name: 'mars_elevation',
    //   title: "Mars - altitude",
    //   gmap: G_MARS_ELEVATION_MAP,
    //   description: ""
    // },
    // {
    //   name: 'mars_visible',
    //   title: "Mars - photo",
    //   gmap: G_MARS_VISIBLE_MAP,
    //   description: ""
    // },
    // {
    //   name: 'mars_infrared',
    //   title: "Mars - infrarouge",
    //   gmap: G_MARS_INFRARED_MAP,
    //   description: ""
    // }
  ]

});
