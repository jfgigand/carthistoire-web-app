dojo.provide('geonef.histoire.macro.presentationAppMacro');

// used in custom doPlay() functions, for FX
dojo.require('geonef.ploomap.OpenLayers.Control.SexyZoomBar');
dojo.require('geonef.ploomap.tool.layer.Simple');

dojo.mixin(geonef.histoire.macro.presentationAppMacro,
{
  actions: [
    { type: 'geonef.jig.macro.action.TextRunner', text: "Bienvenue sur Carthistoire, l'histoire sur la carte ! ",
      clear: true, style: { fontWeight: 'bold' }, manualNext: true },
    //{ type: 'geonef.jig.macro.action.TimeRunner', time: 2000, pause: true },
    { type: 'geonef.jig.macro.action.TextRunner', text: "On peut déplacer la carte en cliquant dessus puis en déplaçant..." },
    { type: 'geonef.jig.macro.action.TimeRunner', time: 500, pause: true },
    { type: 'geonef.ploomap.macro.action.RegionRunner', region: [ 496392, 5078619, 1185032, 5439067 ],
      minZoom: 5, save: 'initial', duration: 3000, noZoomChange: true },
    { type: 'geonef.jig.macro.action.TextRunner', text: "Jouons maintenant avec l'opacité des couches...", clear: true, manualNext: true },
    { type: 'geonef.ploomap.macro.action.MapBindingRunner',
      doPlay: function() {
        var layer = this.findLayer('GEOGRAPHICALGRIDSYSTEMS.MAPS');
        var layerWidget = this.getUniqueWidgetByClass(geonef.ploomap.tool.layer.Simple,
                                                      function(w) { return w.layer === layer; });
        if (layerWidget) {
          geonef.jig.workspace.highlightWidget(layerWidget, 'focus');
        }
      }
    },
    { type: 'geonef.jig.macro.action.TextRunner', text: "On diminue l'opacité jusqu'à 0 % ..." },
    { type: 'geonef.ploomap.macro.action.LayerRunner', layer: 'GEOGRAPHICALGRIDSYSTEMS.MAPS', opacity: 0.0, duration: 500 },
    { type: 'geonef.jig.macro.action.TextRunner', text: "... puis on l'augmente à 100 % ..." },
    { type: 'geonef.ploomap.macro.action.LayerRunner', layer: 'GEOGRAPHICALGRIDSYSTEMS.MAPS', opacity: 1.0, duration: 2000 },
    { type: 'geonef.jig.macro.action.TextRunner', text: "... à nouveau à 0 %" },
    { type: 'geonef.ploomap.macro.action.LayerRunner', layer: 'GEOGRAPHICALGRIDSYSTEMS.MAPS', opacity: 0.0, duration: 2000 },
    { type: 'geonef.jig.macro.action.TextRunner', text: "On la remet enfin à 100%" },
    { type: 'geonef.ploomap.macro.action.LayerRunner', layer: 'GEOGRAPHICALGRIDSYSTEMS.MAPS', opacity: 1.0, duration: 500 },
    { type: 'geonef.jig.macro.action.TimeRunner', time: 1000 },
    { type: 'geonef.jig.macro.action.TextRunner', text: "On ajoute la couche satellite en arrière-plan...", clear: true, manualNext: true },
    { type: 'geonef.ploomap.macro.action.LayerRunner', layer: 'ORTHOIMAGERY.ORTHOPHOTOS', zIndex: 50 },
    { type: 'geonef.jig.macro.action.TimeRunner', time: 2000 },
    { type: 'geonef.jig.macro.action.TextRunner', text: "... puis on refait varier l'opacité de la carte" },
    { type: 'geonef.ploomap.macro.action.LayerRunner', layer: 'GEOGRAPHICALGRIDSYSTEMS.MAPS', opacity: 0.0, duration: 300 },
    { type: 'geonef.ploomap.macro.action.LayerRunner', layer: 'GEOGRAPHICALGRIDSYSTEMS.MAPS', opacity: 1.0, duration: 1200 },
    { type: 'geonef.ploomap.macro.action.LayerRunner', layer: 'GEOGRAPHICALGRIDSYSTEMS.MAPS', opacity: 0.0, duration: 1200 },
    { type: 'geonef.ploomap.macro.action.LayerRunner', layer: 'GEOGRAPHICALGRIDSYSTEMS.MAPS', opacity: 1.0, duration: 1000 },
    { type: 'geonef.jig.macro.action.TextRunner', text: "On retire enfin la couche satellite....", manualNext: true },
    { type: 'geonef.ploomap.macro.action.LayerRunner', layer: 'ORTHOIMAGERY.ORTHOPHOTOS', remove: true },

    { type: 'geonef.jig.macro.action.TextRunner', text: "Voyons à présent la barre de zoom ...", clear: true, manualNext: true },
    { type: 'geonef.jig.macro.action.TextRunner', text: "... qui s'agrandit au survol de la souris" },
    { type: 'geonef.jig.macro.action.Runner',
      doPlay: function() {
        var zoomBar = this.getUniqueWidgetByClass(geonef.ploomap.OpenLayers.Control.SexyZoomBar);
        zoomBar.attr('forceAlternateLayout', true);
        geonef.jig.workspace.highlightWidget(zoomBar, 'focus');
        this.onEnd();
      }
    },
    { type: 'geonef.jig.macro.action.TimeRunner', time: 2000 },
    { type: 'geonef.jig.macro.action.TextRunner', text: "On change aisément d'échelle (zoom +3)... " },
    { type: 'geonef.ploomap.macro.action.MapRunner', zoomChange: 3, duration: 2000 },
    { type: 'geonef.jig.macro.action.TextRunner', text: "Puis on recule vers le zoom 5...", manualNext: true },
    { type: 'geonef.ploomap.macro.action.MapRunner', zoom: 5, duration: 2000 },
    { type: 'geonef.jig.macro.action.TimeRunner', time: 2000 },
    { type: 'geonef.jig.macro.action.TextRunner', text: "La loupe est très utile également !", clear: true, manualNext: true },
    { type: 'geonef.jig.macro.action.Runner',
      doPlay: function() {
        var zoomBar = this.getUniqueWidgetByClass(geonef.ploomap.OpenLayers.Control.SexyZoomBar);
        zoomBar.openMagnifier();
        geonef.jig.workspace.highlightWidget(zoomBar.magnifier, 'focus');
        this.onEnd();
      }
    },
    { type: 'geonef.jig.macro.action.TimeRunner', time: 2000, pause: true },
    /*{ type: 'geonef.jig.macro.action.TextRunner', text: "La Suisse, l'Autriche, la Slovénie...", clear: true },
    // Suisse-Autriche-Slovénie
    { type: 'geonef.ploomap.macro.action.RegionRunner', region: [ 496392, 5078619, 1185032, 5439067 ], minZoom: 5 },
    { type: 'geonef.jig.macro.action.TimeRunner', time: 3000, pause: true },
    { type: 'geonef.jig.macro.action.TextRunner', text: "L'Allemagne !", clear: false },
    // Allemagne
    { type: 'geonef.ploomap.macro.action.RegionRunner', region: [ 392968, 5563995, 1081608, 5924443 ], minZoom: 5 },*/
    //{ type: 'geonef.jig.macro.action.TimeRunner', time: 4000, pause: true },
    //{ type: 'geonef.jig.macro.action.TextRunner', text: 'Fin de la démonstration', clear: true, manualNext: true },
    { type: 'geonef.jig.macro.action.Runner',
      doPlay: function() {
        var zoomBar = this.getUniqueWidgetByClass(geonef.ploomap.OpenLayers.Control.SexyZoomBar);
        zoomBar.attr('forceAlternateLayout', false);
        if (zoomBar.magnifier) {
          zoomBar.magnifier.destroy();
          zoomBar.magnifier = null;
        }
        this.onEnd();
      }
    },
    { type: 'geonef.ploomap.macro.action.LayerRunner', layer: 'GEOGRAPHICALGRIDSYSTEMS.MAPS', opacity: 0.5 },
    { type: 'geonef.ploomap.macro.action.RegionRunner', restore: 'initial' }

    /*{
      type: 'layer',
      layer: 'FXXBLABLA',
      visible: true,
      opacity: 0.8
    },
    {
      type: 'bubble',
      layer: 'worldwar2',
      feature: 'fid.76767'      // feature.fid
    },
    }*/
  ]

});

