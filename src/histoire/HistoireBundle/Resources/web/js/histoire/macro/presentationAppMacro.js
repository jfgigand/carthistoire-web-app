dojo.provide('histoire.macro.presentationAppMacro');

// used in custom doPlay() functions, for FX
dojo.require('ploomap.OpenLayers.Control.SexyZoomBar');
dojo.require('ploomap.tool.layer.Simple');

dojo.mixin(histoire.macro.presentationAppMacro,
{
  actions: [
    { type: 'jig.macro.action.TextRunner', text: 'Démarrage de la démonstration...', alone: true },
    { type: 'jig.macro.action.TimeRunner', time: 2000, pause: true },
    { type: 'jig.macro.action.TextRunner', text: "Bienvenue sur Carthistoire, l'histoire sur la carte ! ",
      alone: true, style: { fontWeight: 'bold' }, manualEnd: true },
    //{ type: 'jig.macro.action.TimeRunner', time: 2000, pause: true },
    { type: 'jig.macro.action.TextRunner', text: "On peut déplacer la carte en cliquant dessus puis en déplaçant..." },
    { type: 'jig.macro.action.TimeRunner', time: 500, pause: true },
    { type: 'ploomap.macro.action.RegionRunner', region: [ 496392, 5078619, 1185032, 5439067 ],
      minZoom: 5, save: 'initial', duration: 3000, noZoomChange: true },
    { type: 'jig.macro.action.TextRunner', text: "Jouons maintenant avec l'opacité des couches...", alone: true, manualEnd: true },
    { type: 'ploomap.macro.action.MapBindingRunner',
      doPlay: function() {
        var layer = this.findLayer('GEOGRAPHICALGRIDSYSTEMS.MAPS');
        var layerWidget = this.getUniqueWidgetByClass(ploomap.tool.layer.Simple,
                                                      function(w) { return w.layer === layer; });
        if (layerWidget) {
          jig.workspace.highlightWidget(layerWidget, 'focus');
        }
        this.onEnd();
      }
    },
    { type: 'jig.macro.action.TextRunner', text: "On diminue l'opacité jusqu'à 0 % ..." },
    { type: 'ploomap.macro.action.LayerRunner', layer: 'GEOGRAPHICALGRIDSYSTEMS.MAPS', opacity: 0.0, duration: 500 },
    { type: 'jig.macro.action.TextRunner', text: "... puis on l'augmente à 100 % ..." },
    { type: 'ploomap.macro.action.LayerRunner', layer: 'GEOGRAPHICALGRIDSYSTEMS.MAPS', opacity: 1.0, duration: 2000 },
    { type: 'jig.macro.action.TextRunner', text: "... à nouveau à 0 %" },
    { type: 'ploomap.macro.action.LayerRunner', layer: 'GEOGRAPHICALGRIDSYSTEMS.MAPS', opacity: 0.0, duration: 2000 },
    { type: 'jig.macro.action.TextRunner', text: "On la remet enfin à 50%" },
    { type: 'ploomap.macro.action.LayerRunner', layer: 'GEOGRAPHICALGRIDSYSTEMS.MAPS', opacity: 0.5, duration: 500 },
    { type: 'jig.macro.action.TextRunner', manualEnd: true },
    /*{ type: 'jig.macro.action.TimeRunner', time: 1000, pause: true },
    { type: 'jig.macro.action.TextRunner', text: "On affiche la barre de zoom" },
    { type: 'jig.macro.action.TimeRunner', time: 3000, pause: true },
    { type: 'jig.macro.action.TextRunner', text: "On affiche la barre de zoom" },
    { type: 'jig.macro.action.Runner',
      doPlay: function() {
        var zoomBar = this.getUniqueWidgetByClass(ploomap.OpenLayers.Control.SexyZoomBar);
        zoomBar.attr('forceAlternateLayout', true);
        jig.workspace.highlightWidget(zoomBar, 'focus');
        this.onEnd();
      }
    },
    { type: 'jig.macro.action.TimeRunner', time: 1000, pause: true },
    { type: 'jig.macro.action.TextRunner', text: "... et la loupe !" },
    { type: 'jig.macro.action.Runner',
      doPlay: function() {
        var zoomBar = this.getUniqueWidgetByClass(ploomap.OpenLayers.Control.SexyZoomBar);
        zoomBar.openMagnifier();
        jig.workspace.highlightWidget(zoomBar.magnifier, 'focus');
        this.onEnd();
      }
    },
    { type: 'jig.macro.action.TimeRunner', time: 1000, pause: true },
    { type: 'jig.macro.action.Runner',
      doPlay: function() {
        var zoomBar = this.getUniqueWidgetByClass(ploomap.OpenLayers.Control.SexyZoomBar);
        zoomBar.attr('forceAlternateLayout', false);
        if (zoomBar.magnifier) {
          zoomBar.magnifier.destroy();
          zoomBar.magnifier = null;
        }
        this.onEnd();
      }
    },
    { type: 'jig.macro.action.TextRunner', text: "La Suisse, l'Autriche, la Slovénie...", alone: true },
    // Suisse-Autriche-Slovénie
    { type: 'ploomap.macro.action.RegionRunner', region: [ 496392, 5078619, 1185032, 5439067 ], minZoom: 5 },
    { type: 'jig.macro.action.TimeRunner', time: 3000, pause: true },
    { type: 'jig.macro.action.TextRunner', text: "L'Allemagne !", alone: false },
    // Allemagne
    { type: 'ploomap.macro.action.RegionRunner', region: [ 392968, 5563995, 1081608, 5924443 ], minZoom: 5 },*/
    //{ type: 'jig.macro.action.TimeRunner', time: 4000, pause: true },
    { type: 'jig.macro.action.TextRunner', text: 'Fin de la démonstration', alone: true },
    { type: 'ploomap.macro.action.RegionRunner', restore: 'initial' }

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

