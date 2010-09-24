
dojo.provide('ign.info.About');

dojo.require('jig.layout._Anchor');
dojo.require('dijit._Templated');
dojo.require('jig.version');
dojo.require('dijit.layout.AccordionContainer');

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
  },

  startup: function() {
    console.log('startup', this, arguments);
    this.inherited(arguments);
    this.acc.startup();
  },

  resize: function() {
    console.log('resize', this, arguments);
    try {
      this.acc.resize.apply(this.acc, arguments);
    }
    catch(e) {
      console.error('exception in  resize', e);
    }
  }


});
