
var a = [


  // déplacement de la loupe
var zoomBar = this.getUniqueWidgetByClass(
       ploomap.OpenLayers.Control.SexyZoomBar);

zoomBar.openMagnifier();
//zoomBar.magnifier.move({x:700,y:400});

var duration = 30000;
var self = this;
var box = dojo.contentBox(this.mapWidget.map.div);
var w = box.w;
var h = box.h;
var nb = 30;

(new dojo.Animation(
 {
    curve: [0, 1],
    //easing: dojo.fx.easing.sinInOut,
    duration: duration,
    onAnimate: function(v) {
       // set
       var x = parseInt(w * v);
       var y = parseInt((Math.sin(v*nb)+1)*h/2);
       zoomBar.magnifier.move({x:x,y:y});
    },
    onEnd: function() { self.onEnd(); }
})).play();


//////////////////////////

  // déplacement de la loupe
var zoomBar = this.getUniqueWidgetByClass(
       ploomap.OpenLayers.Control.SexyZoomBar);

zoomBar.openMagnifier();
zoomBar.magnifier.attr('value',
  {active:false,layer:'ORTHOIMAGERY.ORTHOPHOTOS',
   opacity:0.7,factor:1.0});

zoomBar.magnifier.attr('value', {active:true});

//zoomBar.magnifier.move({x:700,y:400});

var duration = 50000;
var self = this;
var box = dojo.contentBox(this.mapWidget.map.div);
var w = box.w;
var h = box.h;
var nb = 30;

(new dojo.Animation(
 {
    curve: [0, 1],
    //easing: dojo.fx.easing.sinInOut,
    duration: duration,
    onAnimate: function(v) {
       // set
       var x = parseInt(w * v);
       var y = parseInt((Math.sin(v*nb)+1)*h/2);
       zoomBar.magnifier.move({x:x,y:y});
    },
    onEnd: function() { self.onEnd(); }
})).play();

////  ZOOM BAR

{"actions":[{"script":"\n  // déplacement de la loupe\nvar zoomBar = this.getUniqueWidgetByClass(\n       ploomap.OpenLayers.Control.SexyZoomBar);\n\nzoomBar.openMagnifier();\nzoomBar.magnifier.attr('value',\n  {active:false,layer:'ORTHOIMAGERY.ORTHOPHOTOS',\n   opacity:0.7,factor:1.0});\n\n/*zoomBar.magnifier.attr('value', {active:true});\n*/\n//zoomBar.magnifier.move({x:700,y:400});\n\nvar duration = 30000;\nvar self = this;\nvar box = dojo.contentBox(this.mapWidget.map.div);\nvar w = box.w;\nvar h = box.h;\nvar nb = 10;\n\n(new dojo.Animation(\n {\n    curve: [0, 1],\n    //easing: dojo.fx.easing.sinInOut,\n    duration: duration,\n    onAnimate: function(v) {\n       // set\n       var x = parseInt(w * v);\n       var y = parseInt((Math.sin(v*nb)+1)*h/2);\n       zoomBar.magnifier.move({x:x,y:y});\n    },\n    onEnd: function() { self.onEnd(); }\n})).play();\n\n","scriptCallsOnEnd":true,"runnerClass":"ploomap.macro.action.MapBindingRunner","type":"jig.macro.action.ScriptRunner"},{"terminate":true,"replay":false,"type":"jig.macro.action.MacroRunner"},{"style":{"fontSize":"1.5em"},"text":"Loupe...","clear":false,"manualNext":true,"type":"jig.macro.action.TextRunner"},{"script":"\n  // déplacement de la loupe\nvar zoomBar = this.getUniqueWidgetByClass(\n       ploomap.OpenLayers.Control.SexyZoomBar);\n\nzoomBar.openMagnifier();\n//zoomBar.magnifier.move({x:700,y:400});\n\nvar duration = 50000;\nvar self = this;\nvar box = dojo.contentBox(this.mapWidget.map.div);\nvar w = box.w;\nvar h = box.h;\nvar nb = 30;\n\n(new dojo.Animation(\n {\n    curve: [0, 1],\n    //easing: dojo.fx.easing.sinInOut,\n    duration: duration,\n    onAnimate: function(v) {\n       // set\n       var x = parseInt(w * v);\n       var y = parseInt((Math.sin(v*nb)+1)*h/2);\n       zoomBar.magnifier.move({x:x,y:y});\n    },\n    onEnd: function() { self.onEnd(); }\n})).play();\n\n","scriptCallsOnEnd":true,"runnerClass":"ploomap.macro.action.MapBindingRunner","type":"jig.macro.action.ScriptRunner"},{"style":{"fontSize":"1.2em"},"text":"En 1:1","clear":true,"manualNext":true,"type":"jig.macro.action.TextRunner"},{"layer":"ORTHOIMAGERY.ORTHOPHOTOS","defZIndex":true,"zIndex":50,"highlight":false,"remove":false,"type":"ploomap.macro.action.LayerRunner"},{"layer":"ORTHOIMAGERY.ORTHOPHOTOS","defZIndex":false,"highlight":false,"remove":true,"type":"ploomap.macro.action.LayerRunner"}]}

  ,

  /// LA GROSSE

{"actions":[{"style":{"fontSize":"2em","fontWeight":"bold"},"type":"jig.macro.action.TextRunner","text":"Bienvenue sur Carthistoire, l'histoire sur la carte ! ","clear":true,"manualNext":true},{"style":{},"type":"jig.macro.action.TextRunner","text":"On peut déplacer la carte en cliquant dessus puis en déplaçant...","clear":false,"manualNext":false},{"type":"jig.macro.action.TimeRunner","pause":true,"time":500},{"type":"ploomap.macro.action.RegionRunner","minZoom":5,"save":"initial","region":[496392,5078619,1185032,5439067],"duration":3000,"noZoomChange":true},{"style":{},"type":"jig.macro.action.TextRunner","text":"Jouons maintenant avec l'opacité des couches...","clear":true,"manualNext":true},{"type":"jig.macro.action.ScriptRunner","script":" var layer = this.findLayer('GEOGRAPHICALGRIDSYSTEMS.MAPS');\n var layerWidget = \n       this.getUniqueWidgetByClass(\n         ploomap.tool.layer.Simple,\n             function(w) { return w.layer === layer; });\nif (layerWidget) {\n   jig.workspace.highlightWidget(layerWidget, 'focus');\n}\n","scriptCallsOnEnd":false,"runnerClass":"ploomap.macro.action.MapBindingRunner"},{"style":{},"type":"jig.macro.action.TextRunner","text":"On diminue l'opacité jusqu'à 0 % ...","clear":false,"manualNext":false},{"type":"ploomap.macro.action.LayerRunner","layer":"GEOGRAPHICALGRIDSYSTEMS.MAPS","duration":1000,"opacity":0,"defZIndex":false,"remove":false},{"style":{},"type":"jig.macro.action.TextRunner","text":"... puis on l'augmente à 100 % ...","clear":false,"manualNext":false},{"type":"ploomap.macro.action.LayerRunner","layer":"GEOGRAPHICALGRIDSYSTEMS.MAPS","duration":2000,"opacity":1,"defZIndex":false,"remove":false},{"style":{},"type":"jig.macro.action.TextRunner","text":"... à nouveau à 0 %","clear":false,"manualNext":false},{"type":"ploomap.macro.action.LayerRunner","layer":"GEOGRAPHICALGRIDSYSTEMS.MAPS","duration":2000,"opacity":0,"defZIndex":false,"remove":false},{"style":{},"type":"jig.macro.action.TextRunner","text":"On la remet enfin à 100%","clear":false,"manualNext":false},{"type":"ploomap.macro.action.LayerRunner","layer":"GEOGRAPHICALGRIDSYSTEMS.MAPS","duration":500,"opacity":1,"defZIndex":false,"remove":false},{"type":"jig.macro.action.TimeRunner","time":1000},{"style":{},"type":"jig.macro.action.TextRunner","text":"On ajoute la couche satellite en arrière-plan...","clear":true,"manualNext":true},{"type":"ploomap.macro.action.LayerRunner","layer":"ORTHOIMAGERY.ORTHOPHOTOS","defZIndex":true,"zIndex":50,"remove":false},{"type":"jig.macro.action.TimeRunner","time":2000},{"style":{},"type":"jig.macro.action.TextRunner","text":"... puis on refait varier l'opacité de la carte","clear":false,"manualNext":false},{"type":"ploomap.macro.action.LayerRunner","layer":"GEOGRAPHICALGRIDSYSTEMS.MAPS","duration":300,"opacity":0,"defZIndex":false,"remove":false},{"type":"ploomap.macro.action.LayerRunner","layer":"GEOGRAPHICALGRIDSYSTEMS.MAPS","duration":1200,"opacity":1,"defZIndex":false,"remove":false},{"type":"ploomap.macro.action.LayerRunner","layer":"GEOGRAPHICALGRIDSYSTEMS.MAPS","duration":1200,"opacity":0,"defZIndex":false,"remove":false},{"type":"ploomap.macro.action.LayerRunner","layer":"GEOGRAPHICALGRIDSYSTEMS.MAPS","duration":1000,"opacity":1,"defZIndex":false,"remove":false},{"style":{},"type":"jig.macro.action.TextRunner","text":"On retire enfin la couche satellite....","clear":false,"manualNext":false},{"type":"ploomap.macro.action.LayerRunner","layer":"ORTHOIMAGERY.ORTHOPHOTOS","defZIndex":false,"remove":true},{"time":2000,"type":"jig.macro.action.TimeRunner"},{"style":{},"type":"jig.macro.action.TextRunner","text":"Voyons à présent la barre de zoom ...","clear":true,"manualNext":true},{"style":{},"type":"jig.macro.action.TextRunner","text":"... qui s'agrandit au survol de la souris","clear":false,"manualNext":false},{"script":"var zoomBar = this.getUniqueWidgetByClass(\n     ploomap.OpenLayers.Control.SexyZoomBar);\nzoomBar.attr('forceAlternateLayout', true);\njig.workspace.highlightWidget(zoomBar, 'focus');\n","scriptCallsOnEnd":false,"type":"jig.macro.action.ScriptRunner"},{"type":"jig.macro.action.TimeRunner","time":2000},{"style":{},"type":"jig.macro.action.TextRunner","text":"On change aisément d'échelle (zoom +2)... ","clear":false,"manualNext":false},{"type":"ploomap.macro.action.MapRunner","zoomChange":2,"duration":2000},{"style":{},"type":"jig.macro.action.TextRunner","text":"Puis on recule vers le zoom 5...","clear":false,"manualNext":false},{"type":"ploomap.macro.action.MapRunner","zoom":5,"duration":3000},{"type":"jig.macro.action.TimeRunner","time":2000},{"style":{},"type":"jig.macro.action.TextRunner","text":"La loupe est très utile également !","clear":true,"manualNext":true},{"type":"jig.macro.action.ScriptRunner","script":"// ouverture de la barre de zoom\nvar zoomBar = this.getUniqueWidgetByClass(\n       ploomap.OpenLayers.Control.SexyZoomBar);\n\nzoomBar.openMagnifier();\n\njig.workspace.highlightWidget(\n       zoomBar.magnifier, 'focus');\n","scriptCallsOnEnd":false},{"type":"jig.macro.action.TimeRunner","pause":true,"time":1000}]}


  ,



  {"actions":[{"style":{"fontSize":"2em","fontWeight":"bold"},"type":"jig.macro.action.TextRunner","text":"Bienvenue sur Carthistoire, l'histoire sur la carte ! ","clear":true,"manualNext":true},{"style":{},"type":"jig.macro.action.TextRunner","text":"On peut déplacer la carte en cliquant dessus puis en déplaçant...","clear":false,"manualNext":false},{"type":"jig.macro.action.TimeRunner","pause":true,"time":500},{"type":"ploomap.macro.action.RegionRunner","minZoom":5,"save":"initial","region":[496392,5078619,1185032,5439067],"duration":3000,"noZoomChange":true},{"style":{},"type":"jig.macro.action.TextRunner","text":"Jouons maintenant avec l'opacité des couches...","clear":true,"manualNext":true},{"type":"jig.macro.action.ScriptRunner","script":" var layer = this.findLayer('GEOGRAPHICALGRIDSYSTEMS.MAPS');\n var layerWidget = \n       this.getUniqueWidgetByClass(\n         ploomap.tool.layer.Simple,\n             function(w) { return w.layer === layer; });\nif (layerWidget) {\n   jig.workspace.highlightWidget(layerWidget, 'focus');\n}\n","scriptCallsOnEnd":false,"runnerClass":"ploomap.macro.action.MapBindingRunner"},{"style":{},"type":"jig.macro.action.TextRunner","text":"On diminue l'opacité jusqu'à 0 % ...","clear":false,"manualNext":false},{"type":"ploomap.macro.action.LayerRunner","layer":"GEOGRAPHICALGRIDSYSTEMS.MAPS","duration":1000,"opacity":0,"defZIndex":false,"remove":false},{"style":{},"type":"jig.macro.action.TextRunner","text":"... puis on l'augmente à 100 % ...","clear":false,"manualNext":false},{"type":"ploomap.macro.action.LayerRunner","layer":"GEOGRAPHICALGRIDSYSTEMS.MAPS","duration":2000,"opacity":1,"defZIndex":false,"remove":false},{"style":{},"type":"jig.macro.action.TextRunner","text":"... à nouveau à 0 %","clear":false,"manualNext":false},{"type":"ploomap.macro.action.LayerRunner","layer":"GEOGRAPHICALGRIDSYSTEMS.MAPS","duration":2000,"opacity":0,"defZIndex":false,"remove":false},{"style":{},"type":"jig.macro.action.TextRunner","text":"On la remet enfin à 100%","clear":false,"manualNext":false},{"type":"ploomap.macro.action.LayerRunner","layer":"GEOGRAPHICALGRIDSYSTEMS.MAPS","duration":500,"opacity":1,"defZIndex":false,"remove":false},{"type":"jig.macro.action.TimeRunner","time":1000},{"style":{},"type":"jig.macro.action.TextRunner","text":"On ajoute la couche satellite en arrière-plan...","clear":true,"manualNext":true},{"type":"ploomap.macro.action.LayerRunner","layer":"ORTHOIMAGERY.ORTHOPHOTOS","defZIndex":true,"zIndex":50,"remove":false},{"type":"jig.macro.action.TimeRunner","time":2000},{"style":{},"type":"jig.macro.action.TextRunner","text":"... puis on refait varier l'opacité de la carte","clear":false,"manualNext":false},{"type":"ploomap.macro.action.LayerRunner","layer":"GEOGRAPHICALGRIDSYSTEMS.MAPS","duration":300,"opacity":0,"defZIndex":false,"remove":false},{"type":"ploomap.macro.action.LayerRunner","layer":"GEOGRAPHICALGRIDSYSTEMS.MAPS","duration":1200,"opacity":1,"defZIndex":false,"remove":false},{"type":"ploomap.macro.action.LayerRunner","layer":"GEOGRAPHICALGRIDSYSTEMS.MAPS","duration":1200,"opacity":0,"defZIndex":false,"remove":false},{"type":"ploomap.macro.action.LayerRunner","layer":"GEOGRAPHICALGRIDSYSTEMS.MAPS","duration":1000,"opacity":1,"defZIndex":false,"remove":false},{"style":{},"type":"jig.macro.action.TextRunner","text":"On retire enfin la couche satellite....","clear":false,"manualNext":true},{"type":"ploomap.macro.action.LayerRunner","layer":"ORTHOIMAGERY.ORTHOPHOTOS","defZIndex":false,"remove":true},{"style":{},"type":"jig.macro.action.TextRunner","text":"Voyons à présent la barre de zoom ...","clear":true,"manualNext":true},{"style":{},"type":"jig.macro.action.TextRunner","text":"... qui s'agrandit au survol de la souris","clear":false,"manualNext":false},{"script":"// ouverture de la barre de zoom\nvar zoomBar = this.getUniqueWidgetByClass(\n       ploomap.OpenLayers.Control.SexyZoomBar);\n\nzoomBar.openMagnifier();\n\njig.workspace.highlightWidget(\n       zoomBar.magnifier, 'focus');\n","scriptCallsOnEnd":false,"type":"jig.macro.action.ScriptRunner"},{"type":"jig.macro.action.TimeRunner","time":2000},{"style":{},"type":"jig.macro.action.TextRunner","text":"On change aisément d'échelle (zoom +2)... ","clear":false,"manualNext":false},{"type":"ploomap.macro.action.MapRunner","zoomChange":2,"duration":2000},{"style":{},"type":"jig.macro.action.TextRunner","text":"Puis on recule vers le zoom 5...","clear":false,"manualNext":true},{"type":"ploomap.macro.action.MapRunner","zoom":5,"duration":2000},{"type":"jig.macro.action.TimeRunner","time":2000},{"style":{},"type":"jig.macro.action.TextRunner","text":"La loupe est très utile également !","clear":true,"manualNext":true},{"type":"jig.macro.action.TimeRunner","pause":true,"time":1000}]}




  ,




{
  actions: [
    { type: 'jig.macro.action.TextRunner', text: "Bienvenue sur Carthistoire, l'histoire sur la carte ! ",
      clear: true, style: { fontWeight: 'bold' }, manualNext: true },
    { type: 'jig.macro.action.TextRunner', text: "On peut déplacer la carte en cliquant dessus puis en déplaçant..." },
    { type: 'jig.macro.action.TimeRunner', time: 500, pause: true },
    { type: 'ploomap.macro.action.RegionRunner', region: [ 496392, 5078619, 1185032, 5439067 ],
      minZoom: 5, save: 'initial', duration: 3000, noZoomChange: true },
    { type: 'jig.macro.action.TextRunner', text: "Jouons maintenant avec l'opacité des couches...", clear: true, manualNext: true },
    { type: 'jig.macro.action.TextRunner', text: "On diminue l'opacité jusqu'à 0 % ..." },
    { type: 'ploomap.macro.action.LayerRunner', layer: 'GEOGRAPHICALGRIDSYSTEMS.MAPS', opacity: 0.0, duration: 500 },
    { type: 'jig.macro.action.TextRunner', text: "... puis on l'augmente à 100 % ..." },
    { type: 'ploomap.macro.action.LayerRunner', layer: 'GEOGRAPHICALGRIDSYSTEMS.MAPS', opacity: 1.0, duration: 2000 },
    { type: 'jig.macro.action.TextRunner', text: "... à nouveau à 0 %" },
    { type: 'ploomap.macro.action.LayerRunner', layer: 'GEOGRAPHICALGRIDSYSTEMS.MAPS', opacity: 0.0, duration: 2000 },
    { type: 'jig.macro.action.TextRunner', text: "On la remet enfin à 100%" },
    { type: 'ploomap.macro.action.LayerRunner', layer: 'GEOGRAPHICALGRIDSYSTEMS.MAPS', opacity: 1.0, duration: 500 },
    { type: 'jig.macro.action.TimeRunner', time: 1000 },
    { type: 'jig.macro.action.TextRunner', text: "On ajoute la couche satellite en arrière-plan...", clear: true, manualNext: true },
    { type: 'ploomap.macro.action.LayerRunner', layer: 'ORTHOIMAGERY.ORTHOPHOTOS', zIndex: 50 },
    { type: 'jig.macro.action.TimeRunner', time: 2000 },
    { type: 'jig.macro.action.TextRunner', text: "... puis on refait varier l'opacité de la carte" },
    { type: 'ploomap.macro.action.LayerRunner', layer: 'GEOGRAPHICALGRIDSYSTEMS.MAPS', opacity: 0.0, duration: 300 },
    { type: 'ploomap.macro.action.LayerRunner', layer: 'GEOGRAPHICALGRIDSYSTEMS.MAPS', opacity: 1.0, duration: 1200 },
    { type: 'ploomap.macro.action.LayerRunner', layer: 'GEOGRAPHICALGRIDSYSTEMS.MAPS', opacity: 0.0, duration: 1200 },
    { type: 'ploomap.macro.action.LayerRunner', layer: 'GEOGRAPHICALGRIDSYSTEMS.MAPS', opacity: 1.0, duration: 1000 },
    { type: 'jig.macro.action.TextRunner', text: "On retire enfin la couche satellite....", manualNext: true },
    { type: 'ploomap.macro.action.LayerRunner', layer: 'ORTHOIMAGERY.ORTHOPHOTOS', remove: true },

    { type: 'jig.macro.action.TextRunner', text: "Voyons à présent la barre de zoom ...", clear: true, manualNext: true },
    { type: 'jig.macro.action.TextRunner', text: "... qui s'agrandit au survol de la souris" },
    { type: 'jig.macro.action.TimeRunner', time: 2000 },
    { type: 'jig.macro.action.TextRunner', text: "On change aisément d'échelle (zoom +3)... " },
    { type: 'ploomap.macro.action.MapRunner', zoomChange: 3, duration: 2000 },
    { type: 'jig.macro.action.TextRunner', text: "Puis on recule vers le zoom 5...", manualNext: true },
    { type: 'ploomap.macro.action.MapRunner', zoom: 5, duration: 2000 },
    { type: 'jig.macro.action.TimeRunner', time: 2000 },
    { type: 'jig.macro.action.TextRunner', text: "La loupe est très utile également !", clear: true, manualNext: true },
    { type: 'jig.macro.action.TimeRunner', time: 2000, pause: true },
    { type: 'ploomap.macro.action.LayerRunner', layer: 'GEOGRAPHICALGRIDSYSTEMS.MAPS', opacity: 0.5 },
    { type: 'ploomap.macro.action.RegionRunner', restore: 'initial' }
  ]
}


//
// ** Présentations
// *** Révolution
// *** Guerre mondiale
// *** Application
// **** Barre de zoom
// **** Loupe
// un essai de vraie loupe sur carte IGN (zoom tel que la carte papier est la meme)
// et un essai en 1:1 avec carte+satellite
// essai en petit (défaut) et gros (300px)
// **** couches
// **** créateur de présentation
// crée une action, affiche le dropDown puis fait jouer les valeurs
// démo dnd ?
// **** barre de zoom ?
//
//


/*

            - jig.workspace
            # misc deps
            #- dojox.io.xhrPlugins

            - ploomap.tool.layer.Simple
            - ploomap.tool.layer.Select

            #- ploomap.layer.Simple
            #- ploomap.layer.Vector
            #- ploomap.OpenLayers.Control.TileLoadSpinner
            #- ploomap.OpenLayers.Control.SexyZoomBar
            #- jig.macro.Editor

            # application-specific
            #- ploomap.layer.HistoricalFact
            #- ploomap.layer.WorldWar2
            #- histoire.layerDef.Application

            # initial cacoins
            - jig.layout.RootPane
            - jig.layout.BorderContainer
            - ploomap.map.Geoportal
            - ploomap.tool.Layers
            #- histoire.info.About

            # tools
            #- ploomap.tool.Export
            #- ploomap.tool.Measure
            #- ploomap.tool.OverviewMap
            #- ploomap.tool.StreetView
            #- ploomap.tool.Itineraries
            #- histoire.info.About
            #- jig.tool.UserFeedback



 */

];
