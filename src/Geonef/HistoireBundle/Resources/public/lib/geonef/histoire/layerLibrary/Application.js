
dojo.provide('geonef.histoire.layerLibrary.Application');

// parents
dojo.require('geonef.jig.layout._Anchor');
dojo.require('dijit._Templated');
dojo.require('geonef.ploomap.MapBinding');

// used in template
dojo.require('geonef.ploomap.tool.layerLibrary.AutoGrid');

dojo.declare('geonef.histoire.layerLibrary.Application',
             [ geonef.jig.layout._Anchor, dijit._Templated, geonef.ploomap.MapBinding ],
{
  // summary:
  //   // Layer library for application "histoire""
  //


  templateString: dojo.cache("geonef.histoire.layerLibrary", "templates/Application.html"),
  widgetsInTemplate: true,

  startup: function() {
    this.inherited(arguments);
    this.tabContainer.resize();
  }

});
