
dojo.provide('cartapatate.layerDef.Underground');

// parents
dojo.require('geonef.ploomap.layerDef.Base');

// used in code
dojo.require('geonef.ploomap.OpenLayers.Strategy.JsonAttribute');
dojo.require('geonef.ploomap.OpenLayers.Strategy.SoftDelete');
dojo.require('geonef.ploomap.OpenLayers.Strategy.SaveAttrOrder');
dojo.require('geonef.ploomap.layer.featureDetails.Element');
dojo.require('geonef.ploomap.layer.Vector'); // may be implicitly used

dojo.declare('cartapatate.layerDef.Underground', [ geonef.ploomap.layerDef.Base ],
{
  // summary:
  //   Layers related to earth underground (quarries, mines, geological...)
  //

  registerLayers: function() {
    this.inherited(arguments);
    this.registerUndergroundLayers();
  },

  registerUndergroundLayers: function() {
    this.addLayers(this.buildElementLayers());
    this.addLayers(this.undergroundLayers);
  },

  buildElementLayers: function() {
    //return [];
    var layers = [];
    geonef.jig.forEach(window.workspaceData.settings.elementTypes,
      function(def, name) {
        //console.log('in for each', this, layers, arguments);
        layers.push(
          {
            name: name,
            title: def.layerTitle,
            provider: 'cartapatate-catapatate',
            collection: 'underground-vector',
            icon: def.icon,
            layers: [
              {
                creator: function(mapWidget) {
                  /*return cartapatate.layerDef.Underground.prototype.
                    createElementLayer('acces', mapWidget);*/
                  var saveStrategy = new OpenLayers.Strategy.Save();
                  return new OpenLayers.Layer.Vector('Éléments '+def.layerTitle,
                    {
                      elementType: name,
                      maxResolution: def.maxResolution,
                      minResolution: def.minResolution,
                      projection: 'EPSG:4326',
                      //projection: mapWidget.map.getProjectionObject(), //new OpenLayers.Projection('EPSG:900913'),
                      //projection: new OpenLayers.Projection('EPSG:900913'),
                      strategies: [
                        new OpenLayers.Strategy.BBOX(),
                        new geonef.ploomap.OpenLayers.Strategy.JsonAttribute(
                          { saveStrategy: saveStrategy, schema: def.attributes }),
                        new geonef.ploomap.OpenLayers.Strategy.SoftDelete(
                          { saveStrategy: saveStrategy }),
                        new geonef.ploomap.OpenLayers.Strategy.SaveAttrOrder(
                          { saveStrategy: saveStrategy,
                            order: ['name', 'element_type', 'data', 'deleted'] }),
                        saveStrategy
                      ],
                      protocol: new OpenLayers.Protocol.WFS(
                        {
                          url: "/wfs?",
                          featureType: 'element',//name,
                          featureNS: "http://cartapatate.net/",
                          geometryName: "wkb_geometry",
                          srsName: "EPSG:4326",
                          //srsName: self.mapWidget.map.getProjection()
                        }),
                      filter: new OpenLayers.Filter.Logical(
                        {
                          type: OpenLayers.Filter.Logical.AND,
                          filters: [
                            new OpenLayers.Filter.Comparison(
                              {
                                type: OpenLayers.Filter.Comparison.EQUAL_TO,
                                property: "deleted",
                                value: 0
                              }),
                            new OpenLayers.Filter.Comparison(
                              {
                                type: OpenLayers.Filter.Comparison.EQUAL_TO,
                                property: "element_type",
                                value: name
                              })
                            ]
                         }),
                      icon: def.icon,
                      // warning: type of geometryType is OpenLayers.Geometry, not string
                      //          (despite of OL's API doc)
                      geometryType:
                          ({
                            point: OpenLayers.Geometry.Point,
                            lineString: OpenLayers.Geometry.LineString,
                            polygon: OpenLayers.Geometry.Polygon
                           }[def.geometry]),
                      //optClass: 'geonef.ploomap.layer.Element',
                      popupClass: 'geonef.ploomap.layer.featureDetails.Element',
                      popupWidth: def.popupWidth,
                      popupHeight: def.popupHeight,
                      sldUrl: '/lib/cartapatate/style/sld/element/'+name+'.xml',
                      defaultAttributes: {
                        element_type: name,
                        deleted: 0
                      },
                      metadata: {
                        description: def.description,
                        collection: 'Éléments vecteurs Catapatate',
                        source: 'Catapatate - encyclopédie des souterrainns',
                        copyright: 'Communauté Catapatate, tous droits réservés',
                        url: 'http://wiki.catapatate.net/wiki/Catégorie:' + def.wikiCategory
                      }
                    });
                }
              }
            ]
          });
      });
    return layers;
  },

  // undergroundLayers: array of layer defs
  undergroundLayers: [
    {
      name: 'igc_paris',
      title: 'IGC Paris',
      icon: '/lib/cartapatate/style/icon/layer_igc.png',
      provider: 'cartapatate-catapatate',
      collection: 'underground-baseMap',
      layers: [
        {
          title: 'IGC Paris',
          name: 'igc-blanc',
          layerClass: 'geonef.ploomap.OpenLayers.Layer.LegacyTMS',
          layerParams: {
            icon: '/lib/cartapatate/style/icon/layer_igc.png',
	    type: "png",
	    maxResolution: "auto",
	    layerId: 'igc_raster_blanc',
            alwaysInRange: false,
            minResolution: 0.07464553542137146,     // 21
            maxResolution: 76.43702827148438, // 11  //38.21851413574219,       // 12
            layerExtent: new OpenLayers.Bounds(240069.625, 6231359.5, 289269.1875, 6270007),
            vectorLayerName: 'igc_paris_vector',
            metadata: {
              description: 'Planches de l\'Inspection générale des Carrières',
              url: 'http://www.igc.explographies.com/',
              region: 'Paris, Val-de-Marne, Seine-Saint-Denis'
              //copyright: 'Propriété de l\'Inspection Générale des Carrières. Touts droits réservés.'
            }
          }
        }
      ]
    },
    {
      name: 'igc_paris_vector',
      title: 'IGC Paris (vecteurs)',
      icon: '/lib/cartapatate/style/icon/layer_igc.png',
      provider: 'cartapatate-catapatate',
      collection: 'underground-baseMap-vector',
      layers: [
        {
          creator: function(mapWidget) {
            /*return cartapatate.layerDef.Underground.prototype.
             createElementLayer('acces', mapWidget);*/
            return new OpenLayers.Layer.Vector('IGC Paris (vecteurs)',
              {
                //name: 'igc-blanc-vectors',
                minResolution: 0.07464553542137146,     // 21
                maxResolution: 76.43702827148438, // 11  //38.21851413574219,       // 12
                layerExtent: new OpenLayers.Bounds(240069.625, 6231359.5, 289269.1875, 6270007),
                projection: 'EPSG:4326',
                strategies: [new OpenLayers.Strategy.BBOX()],
                protocol: new OpenLayers.Protocol.WFS(
                  {
                    url: "/wfs?",
                    featureType: 'igc_paris',
                    featureNS: "http://cartapatate.net/",
                    geometryName: "wkb_geometry",
                    srsName: "EPSG:4326",
                    //srsName: self.mapWidget.map.getProjection()
                  }),
                icon: '/lib/cartapatate/style/icon/layer_igc.png',
                //optClass: 'geonef.ploomap.layer.Element',
                sldUrl: '/lib/cartapatate/style/sld/igc-paris.xml',
                vectorLayerName: 'igc_versailles_vector',
                getFeatureTitle: function(feature) {
                  return feature.attributes.planche + ' (' +
                    feature.attributes.annee + ')';
                },
                metadata: {
                  description: 'Planches de l\'Inspection générale des Carrières',
                  url: 'http://www.igc.explographies.com/',
                  region: 'Paris, Val-de-Marne, Seine-Saint-Denis'
                }
              });
          }
        }
      ]
    },

    {
      name: 'igc_versailles',
      title: 'IGC Versailles',
      icon: '/lib/cartapatate/style/icon/layer_igc_versailles.png',
      provider: 'cartapatate-catapatate',
      collection: 'underground-baseMap',
      layers: [
        {
          title: 'IGC Versailles',
          name: 'igc_versailles',
          layerClass: 'geonef.ploomap.OpenLayers.Layer.LegacyTMS',
          layerParams: {
            icon: '/lib/cartapatate/style/icon/layer_igc_versailles.png',
	    type: "png",
	    maxResolution: "auto",
	    layerId: 'igc_versailles_raster',
            alwaysInRange: true,
            minResolution: 0.5971642833709717,      // 18
            maxResolution: 611.496226171875,        // 8
            layerExtent: new OpenLayers.Bounds(-78846.5234375, 6145940.5, 450827.90625, 6328023),
            vectorLayerName: 'igc_versailles_vector',
            metadata: {
              description: 'Planches de l\'Inspection Générale des Carrières (Versailles)',
              url: 'http://www.igc-versailles.fr/zonages.htm',
              region: 'Yvelines, Val d\'Oise, Essonne'
            }
          }
        }
      ]
    },
    {
      name: 'igc_versailles_vector',
      title: 'IGC Versailles (vecteurs)',
      icon: '/lib/cartapatate/style/icon/layer_igc_versailles.png',
      provider: 'cartapatate-catapatate',
      collection: 'underground-baseMap-vector',
      layers: [
        {
          creator: function(mapWidget) {
            /*return cartapatate.layerDef.Underground.prototype.
             createElementLayer('acces', mapWidget);*/
            return new OpenLayers.Layer.Vector('IGC Versailles (vecteurs)',
              {
                minResolution: 0.5971642833709717,      // 18
                maxResolution: 611.496226171875,        // 8
                layerExtent: new OpenLayers.Bounds(240069.625, 6231359.5, 289269.1875, 6270007),
                projection: 'EPSG:4326',
                strategies: [new OpenLayers.Strategy.BBOX()],
                protocol: new OpenLayers.Protocol.WFS(
                  {
                    url: "/wfs?",
                    featureType: 'igc_versailles',
                    featureNS: "http://cartapatate.net/",
                    geometryName: "wkb_geometry",
                    srsName: "EPSG:4326",
                  }),
                icon: '/lib/cartapatate/style/icon/layer_igc_versailles.png',
                sldUrl: '/lib/cartapatate/style/sld/igc-versailles.xml',
                vectorLayerName: 'igc_versailles_vector',
                getFeatureTitle: function(feature) {
                  return feature.attributes.nom + ' (' +
                    feature.attributes.code_dpt + ')';
                },
                metadata: {
                  description: 'Planches de l\'Inspection Générale des Carrières (Versailles)',
                  url: 'http://www.igc-versailles.fr/zonages.htm',
                  region: 'Yvelines, Val d\'Oise, Essonne'
                }
              });
          }
        }
      ]
    },

    {
      name: 'geol',
      title: 'Géologie',
      icon: '/lib/cartapatate/style/icon/layer_geol.png',
      provider: 'cartapatate-catapatate',
      collection: 'underground-baseMap',
      layers: [
        {
	  title: 'Géol 1:50 000 couleurs',
	  name: 'carte_geologique',
	  layerClass: 'geonef.ploomap.OpenLayers.Layer.LegacyTMS',
	  layerParams: {
            icon: '/lib/cartapatate/style/icon/layer_geol.png',
	    type: "jpg",
	    maxResolution: "auto",
	    layerId: 'geologie_1_50000',
	    group: 'geol',
            minResolution: 1.1943285667419434,    // 17
            maxResolution: 305.7481130859375,     // 9
            layerExtent: new OpenLayers.Bounds(-572331.6875, 5061675.5, 1064209.625, 6637061),
            metadata: {
              description: 'Cartes géologiques du BRGM',
              source: 'Bureau des resources géologiques et minières (BRGM)',
              url: 'http://www.brgm.fr/cartegeol.jsp',
              region: 'France métropolitaine'
            }
	  }
        },
        {
	  title: 'Géol 1:50 000 détail',
	  name: 'carte_geologique_50_detail',
	  layerClass: 'geonef.ploomap.OpenLayers.Layer.LegacyTMS',
	  layerParams: {
            icon: '/lib/cartapatate/style/icon/layer_geol.png',
	    type: "jpg",
	    maxResolution: "auto",
	    layerId: 'geologie_1_50000_impr',
	    group: 'geol',
            minResolution: 4.777314266967774,     // 15
            maxResolution: 76.43702827148438,     // 11
            layerExtent: new OpenLayers.Bounds(-572331.6875, 5061675.5, 1064209.625, 6637061)
	  }
        },
        {
	  title: 'Géol 1:250 000',
	  name: 'carte_geologique_250',
	  layerClass: 'geonef.ploomap.OpenLayers.Layer.LegacyTMS',
	  layerParams: {
            icon: '/lib/cartapatate/style/icon/layer_geol.png',
	    type: "jpg",
	    maxResolution: "auto",
	    layerId: 'geologie_1_250000',
	    group: 'geol',
            minResolution: 19.109257067871095,    // 13
            maxResolution: 1222.99245234375,      // 7
            layerExtent: new OpenLayers.Bounds(-572331.6875, 5061675.5, 1064209.625, 6637061)
	  }
        },
        {
	  title: 'Géol 1:1 000 000',
	  name: 'carte_geologique_france',
	  layerClass: 'geonef.ploomap.OpenLayers.Layer.LegacyTMS',
	  layerParams: {
            icon: '/lib/cartapatate/style/icon/layer_geol.png',
	    type: "jpg",
	    maxResolution: "auto",
	    layerId: 'geologie_1_1000000',
	    group: 'geol',
            minResolution: 152.87405654296876,    // 10
            maxResolution: 9783.93961875,         // 4
            layerExtent: new OpenLayers.Bounds(-572331.6875, 5061675.5, 1064209.625, 6637061)
	  }
        }
      ]
    },

    {
      name: 'bss',
      title: 'BSS',
      icon: '/images/markers/bss.png',
      provider: 'cartapatate-catapatate',
      collection: 'underground-vector',
      layers: [
        {
          creator: function() {
            return new OpenLayers.Layer.Vector('BSS',
              {
                maxResolution: 76.43702827148438, // 11
                projection: 'EPSG:4326',
                strategies: [new OpenLayers.Strategy.BBOX()],
                protocol: new OpenLayers.Protocol.WFS(
                  {
                    url: "/wfs?",
                    featureType: "bss",
                    featureNS: "http://cartapatate.net/",
                    geometryName: "wkb_geometry",
                    srsName: "EPSG:4326"
                  }),
                optClass: 'geonef.ploomap.layer.Vector',
                getFeatureTitle: function(feature) {
                  return feature.attributes.reference;
                },
                sldUrl: '/lib/cartapatate/style/sld/bss.xml',
                icon: '/images/markers/bss.png'
              });
          }
        }
      ]
    },

    {
      name: 'plans',
      title: 'Plans',
      icon: '/lib/cartapatate/style/icon/layer_plans.png',
      provider: 'cartapatate-catapatate',
      collection: 'underground-vector',
      layers: [
        {
          creator: function() {
            return new OpenLayers.Layer.Vector('Plans',
              {
                maxResolution: 76.43702827148438, // 11
                projection: 'EPSG:4326',
                strategies: [new OpenLayers.Strategy.BBOX()],
                protocol: new OpenLayers.Protocol.WFS(
                  {
                    url: "/wfs?",
                    featureType: "plans",
                    featureNS: "http://cartapatate.net/",
                    geometryName: "wkb_geometry",
                    srsName: "EPSG:4326"
                  }),
                optClass: 'cartapatate.layer.Plans',
                getFeatureTitle: function(feature) {
                  return feature.attributes.title;
                },
                sldUrl: '/lib/cartapatate/style/sld/plans.xml',
                icon: '/lib/cartapatate/style/icon/layer_plans.png'
              });
          }
        }
      ]
    }


    //////////////////////////////////////////////////////////////////


    // {
    //   name: 'element-acces',
    //   title: 'Accès',
    //   icon: '/lib/cartapatate/style/icon/layer_element_acces.png',
    //   provider: 'cartapatate-catapatate',
    //   collection: 'element',
    //   layers: [
    //     {
    //       creator: function(mapWidget) {
    //         return cartapatate.layerDef.Underground.prototype.
    //           createElementLayer('acces', mapWidget);
    //       }
    //     }
    //   ]
    // },

    // {
    //   name: 'elements',
    //   type: 'SubListElements',
    //   title: 'Éléments',
    //   icon: '/lib/cartapatate/style/icon/layer_elements.png',
    //   provider: 'cartapatate-catapatate',
    //   //'default': 'reseau',
    //   elementTypes: [
    //     { name: 'acces', title: 'Accès',
    //       minResolution: 0.07464553542137146,
    //       maxResolution: 4.777314266967774 },
    //     { name: 'lieu', title: 'Lieux',
    //       minResolution: 0.07464553542137146,
    //       maxResolution: 4.777314266967774 },
    //     { name: 'reseau', title: 'Réseaux',
    //       minResolution: 4.777314266967774,
    //       maxResolution: 76.43702827148438 },
    //     { name: 'secteur', title: 'Secteurs',
    //       minResolution: 1.1943285667419434,
    //       maxResolution: 38.21851413574219 },
    //     { name: 'grandaxe', title: 'Grands axes',
    //       minResolution: 0.07464553542137146,
    //       maxResolution: 38.21851413574219 },
    //     { name: 'galerie', title: 'Galeries',
    //       minResolution: 0.07464553542137146,
    //       maxResolution: 2.388657133483887 },
    //     { name: 'galerie_technique', title: 'Galeries tech',
    //       minResolution: 0.07464553542137146,
    //       maxResolution: 38.21851413574219 },
    //     { name: 'egout', title: 'Égouts',
    //       minResolution: 0.07464553542137146,
    //       maxResolution: 38.21851413574219 },
    //     { name: 'delimitation', title: 'Délimitations',
    //       minResolution: 0.07464553542137146,
    //       maxResolution: 76.43702827148438 }
    //   ]
    // },

  ]

});

// cartapatate.layerDef.Underground.prototype.createElementLayer =
//   function(type, mapWidget) {
//     var defs = window.workspaceData.settings.elementTypes;
//     var et = defs[type];
//     return new OpenLayers.Layer.Vector('Éléments '+et.layerTitle,
//       {
//         maxResolution: et.maxResolution,
//         minResolution: et.minResolution,
//         projection: 'EPSG:4326',
//         //projection: mapWidget.map.getProjectionObject(), //new OpenLayers.Projection('EPSG:900913'),
//         //projection: new OpenLayers.Projection('EPSG:900913'),
//         strategies: [ new OpenLayers.Strategy.BBOX() ],
//         protocol: new OpenLayers.Protocol.WFS(
//           {
//             url: "/wfs?",
//             featureType: type,
//             featureNS: "http://cartapatate.net/",
//             geometryName: "wkb_geometry",
//             srsName: "EPSG:4326",
//             //srsName: self.mapWidget.map.getProjection()
//           }),
//         filter: /*new OpenLayers.Filter.Logical(
//           {
//             type: OpenLayers.Filter.Logical.AND,
//             filters: [*/
//               new OpenLayers.Filter.Comparison(
//                 {
//                   type: OpenLayers.Filter.Comparison.NOT_EQUAL_TO,
//                   property: "deleted",
//                   value: true
//                 }),
//               /*new OpenLayers.Filter.Comparison(
//                 {
//                   type: OpenLayers.Filter.Comparison.EQUAL_TO,
//                   property: "featuretype",
//                   value: et.name
//                 })
//             ]
//           }),*/
//         optClass: 'geonef.ploomap.layer.Element',
//         sldUrl: '/lib/cartapatate/style/sld/elements.xml'
//       });

//   };
