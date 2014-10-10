
dojo.provide('cartapatate.layer.Velib');

// parents
dojo.require('geonef.ploomap.layer.Vector');

dojo.declare('cartapatate.layer.Velib', [ geonef.ploomap.layer.Vector ],
{
  // summary:
  //   Layer details for Velib station (French Paris bike service)
  //

  featureDetailsClass: 'cartapatate.layer.featureDetails.Velib',

  popupWidth: '330px',
  popupHeight: '200px'

});
