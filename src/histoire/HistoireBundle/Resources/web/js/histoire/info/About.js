
dojo.provide('histoire.info.About');

dojo.require('jig.layout._Anchor');
dojo.require('dijit._Templated');
dojo.require('jig.version');
dojo.require('dijit.layout.AccordionContainer');
dojo.require('jig.tool.UserFeedback');

// we need to put it somewhere...
dojo.require('histoire.settings');

// used in code
dojo.require('histoire.macro.presentationAppMacro');
dojo.require('jig.workspace');

dojo.declare('histoire.info.About', [ jig.layout._Anchor, dijit._Templated ],
{
  templateString: dojo.cache("histoire.info", "templates/About.html"),
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
    var widget = jig.workspace.loadWidget(null,
      function(id) { return new jig.tool.UserFeedback; });
    jig.workspace.autoAnchorWidget(widget);
    widget.startup();
  },

  startPresentation: function(event) {
    console.log('startPresentation', this, arguments);
    dojo['require']('jig.macro.Player');
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
      jig.macro.Player.prototype.attemptPlay(macro);
    }
  },

  createPresentation: function() {
    dojo['require']('jig.macro.Player');
    var player = new jig.macro.Player();
    player.actionCreate();
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
