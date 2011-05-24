
dojo.provide('histoire.layerLibrary.Application');

// parents
dojo.require('jig.layout._Anchor');
dojo.require('dijit._Templated');
dojo.require('ploomap.MapBinding');

// used in template
dojo.require('ploomap.tool.layerLibrary.AutoGrid');

dojo.declare('histoire.layerLibrary.Application',
             [ jig.layout._Anchor, dijit._Templated, ploomap.MapBinding ],
{
  // summary:
  //   // Layer library for application "histoire""
  //


  templateString: dojo.cache("histoire.layerLibrary", "templates/Application.html"),
  widgetsInTemplate: true,

  startup: function() {
    this.inherited(arguments);
    this.tabContainer.resize();
  }

});
