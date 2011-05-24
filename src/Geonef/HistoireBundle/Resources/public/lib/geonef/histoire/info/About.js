
dojo.provide('geonef.histoire.info.About');

dojo.require('geonef.jig.layout._Anchor');
dojo.require('dijit._Templated');
dojo.require('geonef.jig.version');
dojo.require('dijit.layout.AccordionContainer');
dojo.require('geonef.jig.tool.UserFeedback');

// we need to put it somewhere...
dojo.require('geonef.histoire.settings');

// used in code
dojo.require('geonef.histoire.macro.presentationAppMacro');
dojo.require('geonef.jig.workspace');

dojo.declare('geonef.histoire.info.About', [ geonef.jig.layout._Anchor, dijit._Templated ],
{
  templateString: dojo.cache("geonef.histoire.info", "templates/About.html"),
  widgetsInTemplate: true,
  name: 'Notice',
  icon: '/images/icons/tool_about.png',

  postMixInProperties: function() {
    this.version = geonef.jig.version;
  },

  /*startup: function() {
    console.log('startup', this, arguments);
    this.inherited(arguments);
    this.acc.startup();
  },*/

  sendFeedback: function() {
    var widget = geonef.jig.workspace.loadWidget(null,
      function(id) { return new geonef.jig.tool.UserFeedback; });
    geonef.jig.workspace.autoAnchorWidget(widget);
    widget.startup();
  },

  startPresentation: function(event) {
    console.log('startPresentation', this, arguments);
    dojo['require']('geonef.jig.macro.Player');
    for (var node = event.target; !node.hasAttribute('widgetid');
         node = node.parentNode) {
      //
    }
    console.log('node', node);
    var button = dijit.byNode(node);
    var name = button.attr('value');
    console.log('name', name);
    if (name) {
      dojo['require'](name);
      var macro = dojo.getObject(name);
      console.log('macro', macro);
      geonef.jig.macro.Player.prototype.attemptPlay(macro);
    }
  },

  createPresentation: function() {
    dojo['require']('geonef.jig.macro.Player');
    var player = new geonef.jig.macro.Player();
    player.actionCreate();
  },

  resize: function() {
    try {
      this.acc.resize.apply(this.acc, arguments);
    }
    catch(e) {
      //console.error('exception in  resize', e);
    }
  }

});
