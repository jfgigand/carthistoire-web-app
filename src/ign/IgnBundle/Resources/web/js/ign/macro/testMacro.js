
// presentation / guide
//
// création:
//   - soit manuelle (comme écrire le code ci-dessous)
//   - soit UI (l'outil génère la structure ci-dessous)
//
// Graphical composer:
//      - on se sert d'un input.ArrayContainer
//      - un bouton "add" permet d'ajouter une action de type au choix
//      - DnD permet de ré-ordonner les actions
//      - chaque action a dans l'ordre:
//              - une zone DnD (cf. GMail)
//              - le label du type
//              - des éléments éventuels propres au type
//              - un dropDownBouton qui offre:
//                      - un bouton "supprimer"
//                      - des réglages propres au type
//
//      - les types concrets d'action sont des widgets héritant
//        de jig.guide.Action
//      - jig.guide.Action gère le DnD, le label...
//        l'instanciation du DropDownButton
//      - les widgets concrets déclarent le DropDownButton
//        en simple <div dojoAttachPoint="dropDownButton"></div>
//
// Animator:
//      - jig.guide.Animator
//      - à faire en premier
//      - chaque type d'action est : function? class?
//
// ploomap.guide.action.Layer
// ploomap.guide.actionEditor.Layer
//

dojo.provide('ign.macro.testMacro');

dojo.require('ploomap.OpenLayers.Control.SexyZoomBar');

dojo.mixin(ign.macro.testMacro,
{
  actions: [
    {
      type: 'jig.macro.action.TextRunner',
      text: 'La démonstration commence ...',
      alone: false      // replace any previous text
    },
    {
      type: 'jig.macro.action.TimeRunner',
      time: 1000, // milliseconds
      pause: true
    },
    {
      type: 'jig.macro.action.TextRunner',
      text: "On affiche la barre de zoom"
    },
    {
      type: 'jig.macro.action.Runner',
      doPlay: function() {
        console.log('my doPlay!' , this, arguments);
        var zoomBar = this.getUniqueWidgetByClass(ploomap.OpenLayers.Control.SexyZoomBar);
        console.log('zoomBar', zoomBar);
        zoomBar.attr('forceAlternateLayout', true);
        this.onEnd();
      }
    },
    {
      type: 'jig.macro.action.TimeRunner',
      time: 1000, // milliseconds
      pause: true
    },
    {
      type: 'jig.macro.action.TextRunner',
      text: "... et la loupe !"
    },
    {
      type: 'jig.macro.action.Runner',
      doPlay: function() {
        var zoomBar = this.getUniqueWidgetByClass(ploomap.OpenLayers.Control.SexyZoomBar);
        zoomBar.openMagnifier();
        this.onEnd();
      }
    },
    {
      type: 'jig.macro.action.TimeRunner',
      time: 1000, // milliseconds
      pause: true
    },
    {
      type: 'jig.macro.action.Runner',
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
    {
      type: 'jig.macro.action.TextRunner',
      text: "La Suisse, l'Autriche, la Slovénie...",
      alone: true
    },
    {
      type: 'ploomap.macro.action.RegionRunner',
      region: [ 496392, 5078619, 1185032, 5439067 ], // Suisse-Autriche-Slovénie
      minZoom: 5
      //duration: 600     // miliseconds
    },
    {
      type: 'jig.macro.action.TimeRunner',
      time: 3000, // milliseconds
      pause: true
    },
    {
      type: 'jig.macro.action.TextRunner',
      text: "L'Allemagne !",
      alone: false      // replace any previous text
    },
    {
      type: 'ploomap.macro.action.RegionRunner',
      region: [ 392968, 5563995, 1081608, 5924443 ], // Allemagne
      minZoom: 5
      //duration: 600     // miliseconds
    },
    {
      type: 'jig.macro.action.TimeRunner',
      time: 3000, // milliseconds
      pause: true
    },
    {
      type: 'jig.macro.action.TextRunner',
      text: 'Fin de la démonstration',
      alone: true      // replace any previous text
    }, // ploomap.macro.action.RegionRunner

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

