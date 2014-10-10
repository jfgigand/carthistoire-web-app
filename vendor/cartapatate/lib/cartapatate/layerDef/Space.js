
dojo.provide('cartapatate.layerDef.Space');

// parents
dojo.require('geonef.ploomap.layerDef.Base');

// used in code
dojo.require('geonef.ploomap.OpenLayers.Layer.RepeatedXYZ');

/**
 *
 * @see http://code.google.com/p/gmaps-samples-v3/source/browse/trunk/planetary-maptypes/planetary-maptypes.html?r=206
 *
 * @class
 */
dojo.declare('cartapatate.layerDef.Space', [ geonef.ploomap.layerDef.Base ],
{

  registerLayers: function() {
    this.inherited(arguments);
    this.registerCartapatateSpaceLayers();
  },

  registerCartapatateSpaceLayers: function() {
    //console.log('registerCartapatateCommonLayers', this, arguments);
    this.addLayers(this.cartapatateSpaceLayers);
  },

  // cartapatateCommonLayers: array of layer defs
  cartapatateSpaceLayers: [
    {
      name: 'google_sky',
      title: 'Ciel',
      icon: '/lib/cartapatate/style/icon/layer_sky.png',
      provider: 'cartapatate',
      layers: [
        // http://mw1.google.com/mw-planetary/sky/mapscontent_v1/overlayTiles/iras/zoom2/iras_1_2.png
        {
          creator: function() {
            return new geonef.ploomap.OpenLayers.Layer.RepeatedXYZ(
              'Ciel',
              'http://mw1.google.com/mw-planetary/sky/skytiles_v1/'
                + '${x}_${y}_${z}.jpg',
              {
                //group: 'sky',
                isBaseLayer: false,
                minResolution: 19,
                icon: '/lib/cartapatate/style/icon/layer_moon.png',
                metadata: {
                  description: "Vue du ciel depuis la Terre",
                  collection: "space",
                  source: "Google",
                  copyright: "Google",
                  url: "http://www.google.com/moon/#map=visible"
                }
              });
          }
        },
        // {
        //   creator: function() {
        //     return new geonef.ploomap.OpenLayers.Layer.RepeatedXYZ(
        //       'Ciel',
        //       'http://mw1.google.com/mw-planetary/sky/mapscontent_v1/overlayTiles/iras/'
        //         + 'zoom${z}/iras_${x}_${y}.png',
        //       {
        //         group: 'sky',
        //         isBaseLayer: false,
        //         minResolution: 19,
        //         icon: '/lib/cartapatate/style/icon/layer_moon.png',
        //         metadata: {
        //           description: "Vue du ciel depuis la Terre",
        //           collection: "space",
        //           source: "Google",
        //           copyright: "Google",
        //           url: "http://www.google.com/moon/#map=visible"
        //         }
        //       });
        //   }
        // }
      ]
    },
    {
      name: 'google_moon',
      title: 'Lune',
      icon: '/lib/cartapatate/style/icon/layer_moon.png',
      provider: 'cartapatate',
      layers: [
        {
          creator: function(mapWidget) {
            return new geonef.ploomap.OpenLayers.Layer.RepeatedXYZ(
              'Lune photo',
              'http://mw1.google.com/mw-planetary/lunar/lunarmaps_v1/clem_bw'
                + '/${z}/${x}/${y}.jpg',
              {
                group: 'moon',
                isBaseLayer: false,
                minResolution: 305,
                icon: '/lib/cartapatate/style/icon/layer_moon.png',
                metadata: {
                  description: "Surface de la lune (photographies)",
                  collection: "space",
                  source: "Google",
                  copyright: "Google",
                  url: "http://www.google.com/moon/about.html"
                }
              });
          }
        },
        {
          creator: function(mapWidget) {
            return new geonef.ploomap.OpenLayers.Layer.RepeatedXYZ(
              'Lune altitude',
              'http://mw1.google.com/mw-planetary/lunar/lunarmaps_v1/terrain'
                + '/${z}/${x}/${y}.jpg',
              {
                group: 'moon',
                isBaseLayer: false,
                minResolution: 1222,
                icon: '/lib/cartapatate/style/icon/layer_moon.png',
                metadata: {
                  description: "Couleurs représentant l'ltitude de la lune",
                  collection: "space",
                  source: "Google",
                  copyright: "Google",
                  url: "http://www.google.com/moon/about.html"
                }
              });
          }
        }
      ]
    },
    {
      name: 'google_mars',
      title: 'Mars',
      icon: '/lib/cartapatate/style/icon/layer_mars.png',
      provider: 'cartapatate',
      layers: [
        {
          creator: function() {
            return new geonef.ploomap.OpenLayers.Layer.RepeatedXYZ(
              'Mars photo',
              'http://mw1.google.com/mw-planetary/mars/visible/',
              {
                group: 'mars',
                isBaseLayer: false,
                marsUrl: true,
                minResolution: 305,
                icon: '/lib/cartapatate/style/icon/layer_mars.png',
                metadata: {
                  description: "Surface de Mars (photographies)",
                  collection: "space",
                  source: "Google",
                  copyright: "Google",
                  url: "http://www.google.com/mars/about.html"
                }
              });
          }
        },
        {
          creator: function() {
            return new geonef.ploomap.OpenLayers.Layer.RepeatedXYZ(
              'Mars altitude',
              'http://mw1.google.com/mw-planetary/mars/elevation/',
              {
                group: 'mars',
                isBaseLayer: false, marsUrl: true,
                MinResolution: 611,
                icon: '/lib/cartapatate/style/icon/layer_mars.png',
                metadata: {
                  description: "Couleurs représentant l'altitude de Mars",
                  collection: "space",
                  source: "Google",
                  copyright: "Google",
                  url: "http://www.google.com/mars/about.html"
                }
              });
          }
        },
        {
          creator: function() {
            return new geonef.ploomap.OpenLayers.Layer.RepeatedXYZ(
              'Mars infrarouge',
              'http://mw1.google.com/mw-planetary/mars/infrared/',
              {
                group: 'mars',
                isBaseLayer: false, marsUrl: true,
                minResolution: 305,
                icon: '/lib/cartapatate/style/icon/layer_mars.png',
                metadata: {
                  description: "Surface de Mars (infrarouge)",
                  collection: "space",
                  source: "Google",
                  copyright: "Google",
                  url: "http://www.google.com/mars/about.html"
                }
              });
          }
        }
      ]
    }
  ]

});
