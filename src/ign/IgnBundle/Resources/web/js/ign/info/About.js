
dojo.provide('ign.info.About');

dojo.require('jig.layout._Anchor');
dojo.require('dijit._Templated');
dojo.require('jig.version');

// we need to put it somewhere...
dojo.require('ign.settings');

dojo.declare('ign.info.About', [ jig.layout._Anchor, dijit._Templated ],
{
  templateString: dojo.cache("ign.info", "templates/About.html"),
  widgetsInTemplate: true,
  name: 'Notice',
  icon: '/images/icons/tool_about.png',

  postMixInProperties: function() {
    this.version = jig.version;
  }


});
