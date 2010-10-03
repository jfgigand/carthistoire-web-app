
dojo.provide('ign.info.About');

dojo.require('jig.layout._Anchor');
dojo.require('dijit._Templated');
dojo.require('jig.version');
dojo.require('dijit.layout.AccordionContainer');
dojo.require('jig.tool.UserFeedback');

// we need to put it somewhere...
dojo.require('ign.settings');

// used in code
dojo.require('jig.macro.Player');
dojo.require('ign.macro.presentationAppMacro');
dojo.require('jig.workspace');

dojo.declare('ign.info.About', [ jig.layout._Anchor, dijit._Templated ],
{
  templateString: dojo.cache("ign.info", "templates/About.html"),
  widgetsInTemplate: true,
  name: 'Notice',
  icon: '/images/icons/tool_about.png',

  postMixInProperties: function() {
    this.version = jig.version;
  },

  /*startup: function() {
    console.log('startup', this, arguments);
    this.inherited(arguments);
    this.acc.startup();
  },*/

  sendFeedback: function() {
    console.log('sendFeedback', this, arguments);
    var widget = jig.workspace.loadWidget(null,
      function(id) { return new jig.tool.UserFeedback; });
    jig.workspace.autoAnchorWidget(widget);
    widget.startup();
  },

  startDemo: function() {
    var player = new jig.macro.Player(
      {
        macro: ign.macro.presentationAppMacro //testMacro
        //playing: true
      });
    jig.workspace.autoAnchorWidget(player);
    player.startup();
    player.attr('playing', true);
  },


  resize: function() {
    //console.log('resize', this, arguments);
    try {
      this.acc.resize.apply(this.acc, arguments);
    }
    catch(e) {
      //console.error('exception in  resize', e);
    }
  }


});