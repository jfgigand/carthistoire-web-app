
dojo.provide('cartapatate.layer.featureDetails.Velib');

// parents
dojo.require('geonef.ploomap.layer.featureDetails.StackContainerBase');

// used in template
//dojo.require('dijit.layout.StackContainer');

dojo.declare('cartapatate.layer.featureDetails.Velib',
             [ geonef.ploomap.layer.featureDetails.StackContainerBase ],
{
  // summary:
  //   Feature details - automatic list of properties
  //

  attrSchema: {
    name: { label: 'Nom de la station', type: 'string' },
    description: { label: 'Description', type: 'string' }
  }

});
