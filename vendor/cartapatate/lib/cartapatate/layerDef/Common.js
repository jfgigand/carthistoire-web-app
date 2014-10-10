
dojo.provide('cartapatate.layerDef.Common');

// parents
dojo.require('geonef.ploomap.layerDef.Base');

// used in code
dojo.require('geonef.ploomap.layer.Vector'); // may be implicitly used
dojo.require('geonef.ploomap.OpenLayers.Strategy.BBOX');

dojo.declare('cartapatate.layerDef.Common', [ geonef.ploomap.layerDef.Base ],
{
  // summary:
  //   Misc layers common to multiple Cartapatate apps
  //

  registerLayers: function() {
    this.inherited(arguments);
    this.registerCartapatateCommonLayers();
  },

  registerCartapatateCommonLayers: function() {
    //console.log('registerCartapatateCommonLayers', this, arguments);
    this.addLayers(this.cartapatateCommonLayers);
  },

  // cartapatateCommonLayers: array of layer defs
  cartapatateCommonLayers: [
    {
      name: 'ign',
      title: 'IGN',
      icon: '/lib/cartapatate/style/icon/layer_ign.png',
      provider: 'cartapatate',
      layers: [
        {
	  title: 'IGN 1:25 000',
	  name: 'carte_ign',
	  layerClass: 'geonef.ploomap.OpenLayers.Layer.LegacyTMS',
	  layerParams: {
            icon: '/lib/cartapatate/style/icon/layer_ign.png',
	    type: "jpg",
	    maxResolution: "auto",
	    layerId: 'ign25',
	    group: 'ign',
            alwaysInRange: false,
            minResolution: 1.1943285667419434,  // 17
            maxResolution: 38.21851413574219,   // 12
            layerExtent: new OpenLayers.Bounds(-572331.6875, 5061675.5, 1064209.625, 6637061),
            metadata: {
              description: 'Cartes RASTER de l\'IGN (SCAN 25, SCAN Régional, SCAN 1000)',
              source: 'Institut Géographique National (IGN)',
              url: 'http://professionnels.ign.fr/11/la-gamme/gamme-de-produits.htm',
              region: 'France métropolitaine'
            }
	  }
        },
        {
	  title: 'IGN 1:250 000',
	  name: 'carte_ign_250',
	  layerClass: 'geonef.ploomap.OpenLayers.Layer.LegacyTMS',
	  layerParams: {
            icon: '/lib/cartapatate/style/icon/layer_ign.png',
	    type: "jpg",
	    maxResolution: "auto",
	    layerId: 'ign250',
	    group: 'ign', visible: false,
            alwaysInRange: false,
            minResolution: 19.109257067871095,  // 13
            maxResolution: 305.7481130859375,   // 9
            layerExtent: new OpenLayers.Bounds(-572331.6875, 5061675.5, 1064209.625, 6637061)
	  }
        },
        {
	  title: 'IGN 1:1000 000',
	  name: 'carte_ign_1m',
	  layerClass: 'geonef.ploomap.OpenLayers.Layer.LegacyTMS',
	  layerParams: {
            icon: '/lib/cartapatate/style/icon/layer_ign.png',
	    type: "jpg",
	    maxResolution: "auto",
	    layerId: 'ign1000',
	    group: 'ign', visible: false,
            alwaysInRange: false,
            minResolution: 152.87405654296876,  // 10
            maxResolution: 2445.9849046875,      // 6
            layerExtent: new OpenLayers.Bounds(-572331.6875, 5061675.5, 1064209.625, 6637061)
	  }
        }
      ]
    },

    {
      name: 'osm',
      title: 'OpenStreetMap',
      icon: '/lib/cartapatate/style/icon/layer_osm.png',
      provider: 'cartapatate',
      layers: [
        {
          creator: function() {
            return new OpenLayers.Layer.OSM('OpenStreetMap Mapnik',
                                            OpenLayers.Layer.OSM.prototype.url,
                                            { isBaseLayer: false, group: 'osm',
                                              icon: '/lib/cartapatate/style/icon/layer_osm.png' });
          }
        },
        {
          creator: function() {
            return new OpenLayers.Layer.OSM('OpenStreetMap Osmar.',
                                            'http://c.tah.openstreetmap.org/Tiles/tile/${z}/${x}/${y}.png',
                                            { isBaseLayer: false, group: 'osm',
                                              icon: '/lib/cartapatate/style/icon/layer_osm.png'});
          }
        }
      ]
    },

    {
      name: 'velib',
      title: 'Vélib',
      icon: '/lib/cartapatate/style/icon/layer_velib.png',
      provider: 'cartapatate',
      layers: [
        {
          creator: function() {
            return new OpenLayers.Layer.Vector('Vélib',
              {
                icon: '/lib/cartapatate/style/icon/layer_velib.png',
                projection: new OpenLayers.Projection('EPSG:4326'),
                strategies: [new OpenLayers.Strategy.Fixed()
                             /*new OpenLayers.Strategy.Cluster()*/],
                protocol: new OpenLayers.Protocol.HTTP(
                  {
                    url: '/data/velib.kml',
                    format: new OpenLayers.Format.KML(
                      {
                        extractStyles: false,
                        extractAttributes: true
                      })
                  }),
                optClass: 'cartapatate.layer.Velib',
                sldUrl: '/lib/cartapatate/style/sld/velib.xml'
             });
          }
        }
      ]
    },

    {
      name: 'cassini',
      title: 'Cassini',
      icon: '/lib/cartapatate/style/icon/layer_cassini.png',
      provider: 'cartapatate',
      layers: [
        {
          icon: '/lib/cartapatate/style/icon/layer_cassini.png',
          title: 'Cassini',
          name: 'cassini',
          layerClass: 'geonef.ploomap.OpenLayers.Layer.LegacyTMS',
          layerParams: {
	    type: "jpg",
	    maxResolution: "auto",
	    layerId: 'cassini',
            alwaysInRange: false,
            minResolution: 4.777314266967774,     // 15
            maxResolution: 2445.9849046875, // 6
            layerExtent: new OpenLayers.Bounds(-572331.6875, 5061675.5, 1064209.625, 6637061),
            metadata: {
              description: 'Carte de Cassini',
              //url: '',
              region: 'France métropolitaine'
            }
          }
        }
      ]
    },
    {
      name: 'communes_fr',
      title: 'Communes',
      icon: '/lib/cartapatate/style/icon/layer_communes.png',
      provider: 'cartapatate',
      layers: [
        {
          creator: function(mapWidget) {
            return new OpenLayers.Layer.Vector('Communes',
              {
                icon: '/lib/cartapatate/style/icon/layer_communes.png',
                minResolution: 0.29858214168548586, // 19
                maxResolution: 76.43702827148438, // 11
                projection: 'EPSG:4326',
                strategies: [new OpenLayers.Strategy.BBOX()],
                protocol: new OpenLayers.Protocol.WFS(
                  {
                    //version: '1.0.0',
                    url: "/wfs?",
                    featureType: "communes_fr",
                    featureNS: "http://cartapatate.net/",
                    geometryName: "wkb_geometry",
                    srsName: "EPSG:4326"
                    //outputFormat: "application/json",
	            //readFormat: new OpenLayers.Format.GeoJSON()
                  }),
                optClass: 'geonef.ploomap.layer.Vector',
                getFeatureTitle: function(feature) {
                  return feature.attributes.nom + ' (' +
                    feature.attributes.code_dpt + ')';
                },
                sldUrl: '/lib/cartapatate/style/sld/communes.xml',
                layerExtent: new OpenLayers.Bounds(-572331.6875, 5061675.5, 1064209.625, 6637061),
              });
          }
        }
      ]
    },
    // not used
    {
      name: 'communes_fr_old900913',
      title: 'Communes',
      icon: '/lib/cartapatate/style/icon/layer_communes.png',
      provider: 'cartapatate',
      layers: [
        {
          creator: function() {
            return new OpenLayers.Layer.Vector('Communes FR',
              {
                icon: '/lib/cartapatate/style/icon/layer_communes.png',
                minResolution: 0.29858214168548586, // 19
                maxResolution: 76.43702827148438, // 11
                projection: new OpenLayers.Projection('EPSG:900913'),
                strategies: [new OpenLayers.Strategy.BBOX()],
                protocol: new OpenLayers.Protocol.WFS(
                  {
                    url: "http://b.tiles.cartapatate.net:8080/geoserver/ows",
                    featureType: "communes_fr",
                    featureNS: "http://carte.cartapatate.net/",
                    geometryName: "wkb_geometry",
                    srsName: "EPSG:900913"
                  }),
                optClass: 'geonef.ploomap.layer.Vector',
                getFeatureTitle: function(feature) {
                  return feature.attributes.nom + ' (' +
                    feature.attributes.code_dpt + ')';
                },
                sldUrl: '/lib/cartapatate/style/sld/communes.xml'
              });
          }
        }
      ]
    },
    // not used
    {
      name: 'communes_fr_geoportal',
      title: 'Communes',
      icon: '/lib/cartapatate/style/icon/layer_communes.png',
      provider: 'cartapatate',
      layers: [
        {
          creator: function(mapWidget) {
            return new OpenLayers.Layer.Vector('Communes FR',
              {
                icon: '/lib/cartapatate/style/icon/layer_communes.png',
                minResolution: 0.29858214168548586, // 19
                maxResolution: 32, // 11
                strategies: [new geonef.ploomap.OpenLayers.Strategy.BBOX()],
                protocol: new OpenLayers.Protocol.WFS(
                  {
                    version: '1.0.0',
                    url: "/wfs?",
                    featureType: "communes_fr",
                    featureNS: "http://carte.cartapatate.net/",
                    geometryName: "wkb_geometry",
                    srsName: "EPSG:4326",
                    formatOptions: {
                      internalProjection: mapWidget.map.getProjectionObject(),
                      externalProjection: new OpenLayers.Projection("EPSG:4326")
                    }
                    //outputFormat: "application/json",
	            //readFormat: new OpenLayers.Format.GeoJSON()
                  }),
                optClass: 'geonef.ploomap.layer.Vector',
                getFeatureTitle: function(feature) {
                  return feature.attributes.nom + ' (' +
                    feature.attributes.code_dpt + ')';
                },
                sldUrl: '/lib/cartapatate/style/sld/communes.xml'
              });
          }
        }
      ]
    },

  ]

});
