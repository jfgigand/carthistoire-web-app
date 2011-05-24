

dojo.provide('geonef.histoire.layerDef.Common');

// parents
dojo.require('ploomap.layerDef.Base');

dojo.declare('geonef.histoire.layerDef.Common', [ ploomap.layerDef.Base ],
{
  // summary:
  //   Misc layers common to multiple Cartapatate apps
  //

  registerLayers: function() {
    this.inherited(arguments);
    this.registerHistoireCommonLayers();
  },

  registerHistoireCommonLayers: function() {
    //console.log('registerHistoireCommonLayers', this, arguments);
    this.addLayers(this.histoireCommonLayers);
  },

  // histoireCommonLayers: array of layer defs
  histoireCommonLayers: [
    {
      name: 'revolution_francaise',
      title: 'Révolution française',
      icon: '/images/icons/layer_histoire_faits.png',
      provider: 'cartapatate-histoire',
      layers: [
        {
          creator: function(mapWidget) {
            return new OpenLayers.Layer.Vector('revolution_francaise',
              {
                title: "Révolution française",
                //projection: 'EPSG:4326',
                minResolution: 0.07464553542137146,
                maxResolution: 76.43702827148438,
                strategies: [new ploomap.OpenLayers.Strategy.BBOX({ ratio: 1.0 }),
                             new OpenLayers.Strategy.Save(),
                             new ploomap.OpenLayers.Strategy.TimeFilter()],
                protocol: new OpenLayers.Protocol.WFS(
                  {
                    version: '1.0.0',
                    url: /*"http://a.wfs.cartapatate.net*/ "/cgi-bin/tinyows?",
                    featureType: "historicalfacts",
                    featureNS: "http://histoire.cartapatate.net/",
                    geometryName: "wkb_geometry",
                    srsName: "EPSG:4326",
                    formatOptions: {
                      internalProjection: mapWidget.map.getProjectionObject(),
                      externalProjection: new OpenLayers.Projection("EPSG:4326")
                    },
                    //schema: window.location.protocol+'//'+window.location.host+'/cgi-bin/tinyows?SERVICE=WFS&VERSION=1.1.0&REQUEST=DescribeFeatureType&typename=feature:historicalfacts'
                  }),
                optClass: 'ploomap.layer.HistoricalFact',
                getFeatureTitle: function(feature) {
                  var s = '';
                  s += feature.attributes.title;
                  if (feature.attributes.date) {
                    s += ' (' + this.getNiceDate(feature) + ')';
                  }
                  return s;
                },
                getNiceDate: function(feature) {
                  var date = new Date(feature.attributes.date.replace(/Z/, '').replace(/-/g, '/'));
                  var months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin',
                                'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
                  return ''+date.getDate()+' '+months[date.getMonth()]+' '+date.getFullYear();
                },
                sldUrl: '/res/sld/historical_facts.xml'
              });
          }
        }
      ]
    },
    {
      name: 'worldwar2',
      title: '2<sup>nde</sup> Guerre mondiale',
      icon: '/images/icons/layer_worldwar2.png',
      provider: 'cartapatate-histoire',
      layers: [
        {
          creator: function(mapWidget) {
            return new OpenLayers.Layer.Vector('worldwar2',
              {
                title: "2<sup>nde</sup> Guerre mondiale",
                //projection: 'EPSG:4326',
                minResolution: 256, // zoom 8
                maxResolution: 2050, // zoom 5 (au dessus, la projection change)
                strategies: [new ploomap.OpenLayers.Strategy.BBOX({ ratio: 1.0 }),
                             new OpenLayers.Strategy.Save(),
                             new ploomap.OpenLayers.Strategy.TimeFilter()],
                protocol: new OpenLayers.Protocol.WFS(
                  {
                    version: '1.0.0',
                    url: "/cgi-bin/tinyows?",
                    featureType: "worldwar2",
                    featureNS: "http://histoire.cartapatate.net/",
                    geometryName: "wkb_geometry",
                    srsName: "EPSG:4326",
                    formatOptions: {
                      internalProjection: mapWidget.map.getProjectionObject(),
                      externalProjection: new OpenLayers.Projection("EPSG:4326")
                    },
                    //schema: window.location.protocol+'//'+window.location.host+'/cgi-bin/tinyows?SERVICE=WFS&VERSION=1.1.0&REQUEST=DescribeFeatureType&typename=feature:worldwar2'
                  }),
                optClass: 'ploomap.layer.WorldWar2',
                getFeatureTitle: function(feature) {
                  var s = '';
                  s += feature.attributes.title;
                  if (feature.attributes.date) {
                    s += ' (' + this.getNiceDate(feature) + ')';
                  }
                  return s;
                },
                getNiceDate: function(feature) {
                  var date = new Date(feature.attributes.date.replace(/Z/, '').replace(/-/g, '/'));
                  var months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin',
                                'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
                  return ''+date.getDate()+' '+months[date.getMonth()]+' '+date.getFullYear();
                },
                sldUrl: '/res/sld/worldwar2.xml'
              });
          }
        }
      ]
    }
  ]

});
