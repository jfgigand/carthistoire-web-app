
var a = [

{"actions":[{"style":{"fontSize":"2em","fontWeight":"bold"},"type":"jig.macro.action.TextRunner","text":"Bienvenue sur Carthistoire, l'histoire sur la carte ! ","clear":true,"manualNext":true},{"style":{},"type":"jig.macro.action.TextRunner","text":"On peut déplacer la carte en cliquant dessus puis en déplaçant...","clear":false,"manualNext":false},{"type":"jig.macro.action.TimeRunner","pause":true,"time":500},{"type":"ploomap.macro.action.RegionRunner","minZoom":5,"save":"initial","region":[496392,5078619,1185032,5439067],"duration":3000,"noZoomChange":true},{"style":{},"type":"jig.macro.action.TextRunner","text":"Jouons maintenant avec l'opacité des couches...","clear":true,"manualNext":true},{"style":{},"type":"jig.macro.action.TextRunner","text":"On diminue l'opacité jusqu'à 0 % ...","clear":false,"manualNext":false},{"type":"ploomap.macro.action.LayerRunner","layer":"GEOGRAPHICALGRIDSYSTEMS.MAPS","duration":1000,"opacity":0,"remove":false},{"style":{},"type":"jig.macro.action.TextRunner","text":"... puis on l'augmente à 100 % ...","clear":false,"manualNext":false},{"type":"ploomap.macro.action.LayerRunner","layer":"GEOGRAPHICALGRIDSYSTEMS.MAPS","duration":2000,"opacity":1,"remove":false},{"style":{},"type":"jig.macro.action.TextRunner","text":"... à nouveau à 0 %","clear":false,"manualNext":false},{"type":"ploomap.macro.action.LayerRunner","layer":"GEOGRAPHICALGRIDSYSTEMS.MAPS","duration":2000,"opacity":0,"remove":false},{"style":{},"type":"jig.macro.action.TextRunner","text":"On la remet enfin à 100%","clear":false,"manualNext":false},{"type":"ploomap.macro.action.LayerRunner","layer":"GEOGRAPHICALGRIDSYSTEMS.MAPS","duration":500,"opacity":1,"remove":false},{"type":"jig.macro.action.TimeRunner","time":1000},{"style":{},"type":"jig.macro.action.TextRunner","text":"On ajoute la couche satellite en arrière-plan...","clear":true,"manualNext":true},{"type":"ploomap.macro.action.LayerRunner","zIndex":50,"layer":"ORTHOIMAGERY.ORTHOPHOTOS","remove":false},{"type":"jig.macro.action.TimeRunner","time":2000},{"style":{},"type":"jig.macro.action.TextRunner","text":"... puis on refait varier l'opacité de la carte","clear":false,"manualNext":false},{"type":"ploomap.macro.action.LayerRunner","layer":"GEOGRAPHICALGRIDSYSTEMS.MAPS","duration":300,"opacity":0,"remove":false},{"type":"ploomap.macro.action.LayerRunner","layer":"GEOGRAPHICALGRIDSYSTEMS.MAPS","duration":1200,"opacity":1,"remove":false},{"type":"ploomap.macro.action.LayerRunner","layer":"GEOGRAPHICALGRIDSYSTEMS.MAPS","duration":1200,"opacity":0,"remove":false},{"type":"ploomap.macro.action.LayerRunner","layer":"GEOGRAPHICALGRIDSYSTEMS.MAPS","duration":1000,"opacity":1,"remove":false},{"style":{},"type":"jig.macro.action.TextRunner","text":"On retire enfin la couche satellite....","clear":false,"manualNext":true},{"type":"ploomap.macro.action.LayerRunner","layer":"ORTHOIMAGERY.ORTHOPHOTOS","remove":true},{"style":{},"type":"jig.macro.action.TextRunner","text":"Voyons à présent la barre de zoom ...","clear":true,"manualNext":true},{"style":{},"type":"jig.macro.action.TextRunner","text":"... qui s'agrandit au survol de la souris","clear":false,"manualNext":false},{"type":"jig.macro.action.TimeRunner","time":2000},{"style":{},"type":"jig.macro.action.TextRunner","text":"On change aisément d'échelle (zoom +2)... ","clear":false,"manualNext":false},{"type":"ploomap.macro.action.MapRunner","zoomChange":2,"duration":2000},{"style":{},"type":"jig.macro.action.TextRunner","text":"Puis on recule vers le zoom 5...","clear":false,"manualNext":true},{"type":"ploomap.macro.action.MapRunner","zoom":5,"duration":2000},{"type":"jig.macro.action.TimeRunner","time":2000},{"style":{},"type":"jig.macro.action.TextRunner","text":"La loupe est très utile également !","clear":true,"manualNext":true},{"type":"jig.macro.action.TimeRunner","pause":true,"time":1000},{"type":"jig.macro.action.ScriptRunner","script":"","scriptCallsOnEnd":false}]}



  ,


  {"actions":[{"style":{"fontSize":"2em","fontWeight":"bold"},"type":"jig.macro.action.TextRunner","text":"Bienvenue sur Carthistoire, l'histoire sur la carte ! ","clear":true,"manualNext":true},{"style":{},"type":"jig.macro.action.TextRunner","text":"On peut déplacer la carte en cliquant dessus puis en déplaçant...","clear":false,"manualNext":false},{"type":"jig.macro.action.TimeRunner","pause":true,"time":500},{"type":"ploomap.macro.action.RegionRunner","minZoom":5,"save":"initial","region":[496392,5078619,1185032,5439067],"duration":3000,"noZoomChange":true},{"style":{},"type":"jig.macro.action.TextRunner","text":"Jouons maintenant avec l'opacité des couches...","clear":true,"manualNext":true},{"style":{},"type":"jig.macro.action.TextRunner","text":"On diminue l'opacité jusqu'à 0 % ...","clear":false,"manualNext":false},{"type":"ploomap.macro.action.LayerRunner","layer":"GEOGRAPHICALGRIDSYSTEMS.MAPS","duration":1000,"opacity":0,"remove":false},{"style":{},"type":"jig.macro.action.TextRunner","text":"... puis on l'augmente à 100 % ...","clear":false,"manualNext":false},{"type":"ploomap.macro.action.LayerRunner","layer":"GEOGRAPHICALGRIDSYSTEMS.MAPS","duration":2000,"opacity":0,"remove":false},{"style":{},"type":"jig.macro.action.TextRunner","text":"... à nouveau à 0 %","clear":false,"manualNext":false},{"type":"ploomap.macro.action.LayerRunner","layer":"GEOGRAPHICALGRIDSYSTEMS.MAPS","duration":2000,"opacity":0,"remove":false},{"style":{},"type":"jig.macro.action.TextRunner","text":"On la remet enfin à 100%","clear":false,"manualNext":false},{"type":"ploomap.macro.action.LayerRunner","layer":"GEOGRAPHICALGRIDSYSTEMS.MAPS","duration":500,"opacity":0,"remove":false},{"type":"jig.macro.action.TimeRunner","time":1000},{"style":{},"type":"jig.macro.action.TextRunner","text":"On ajoute la couche satellite en arrière-plan...","clear":true,"manualNext":true},{"type":"ploomap.macro.action.LayerRunner","zIndex":50,"layer":"ORTHOIMAGERY.ORTHOPHOTOS","remove":false},{"type":"jig.macro.action.TimeRunner","time":2000},{"style":{},"type":"jig.macro.action.TextRunner","text":"... puis on refait varier l'opacité de la carte","clear":false,"manualNext":false},{"type":"ploomap.macro.action.LayerRunner","layer":"GEOGRAPHICALGRIDSYSTEMS.MAPS","duration":300,"opacity":0,"remove":false},{"type":"ploomap.macro.action.LayerRunner","layer":"GEOGRAPHICALGRIDSYSTEMS.MAPS","duration":1200,"opacity":0,"remove":false},{"type":"ploomap.macro.action.LayerRunner","layer":"GEOGRAPHICALGRIDSYSTEMS.MAPS","duration":1200,"opacity":0,"remove":false},{"type":"ploomap.macro.action.LayerRunner","layer":"GEOGRAPHICALGRIDSYSTEMS.MAPS","duration":1000,"opacity":0,"remove":false},{"style":{},"type":"jig.macro.action.TextRunner","text":"On retire enfin la couche satellite....","clear":false,"manualNext":true},{"type":"ploomap.macro.action.LayerRunner","layer":"ORTHOIMAGERY.ORTHOPHOTOS","remove":true},{"style":{},"type":"jig.macro.action.TextRunner","text":"Voyons à présent la barre de zoom ...","clear":true,"manualNext":true},{"style":{},"type":"jig.macro.action.TextRunner","text":"... qui s'agrandit au survol de la souris","clear":false,"manualNext":false},{"type":"jig.macro.action.TimeRunner","time":2000},{"style":{},"type":"jig.macro.action.TextRunner","text":"On change aisément d'échelle (zoom +2)... ","clear":false,"manualNext":false},{"type":"ploomap.macro.action.MapRunner","zoomChange":2,"duration":2000},{"style":{},"type":"jig.macro.action.TextRunner","text":"Puis on recule vers le zoom 5...","clear":false,"manualNext":true},{"type":"ploomap.macro.action.MapRunner","zoom":5,"duration":2000},{"type":"jig.macro.action.TimeRunner","time":2000},{"style":{},"type":"jig.macro.action.TextRunner","text":"La loupe est très utile également !","clear":true,"manualNext":true},{"type":"jig.macro.action.TimeRunner","pause":true,"time":1000},{"script":"","scriptCallsOnEnd":false,"type":"jig.macro.action.ScriptRunner"}]}









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






];
