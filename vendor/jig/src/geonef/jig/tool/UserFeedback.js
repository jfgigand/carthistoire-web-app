
dojo.provide('geonef.jig.tool.UserFeedback');

// parents
dojo.require('dijit._Widget');
dojo.require('dijit._Templated');


// used in template
dojo.require('geonef.jig.input.Group');
dojo.require('dijit.form.TextBox');
dojo.require('dijit.form.Textarea');
dojo.require('geonef.jig.button.Action');

// used in code
dojo.require('geonef.jig.api');
dojo.require('geonef.jig.version');

dojo.declare('geonef.jig.tool.UserFeedback', [ dijit._Widget, dijit._Templated ],
{
  // summary:
  //   Form to submit a feedback through the API
  //

  templateString: dojo.cache('geonef.jig.tool', 'templates/UserFeedback.html'),
  widgetsInTemplate: true,
  name: 'Feedback',
  icon: dojo.moduleUrl('jig', 'style/icon/tool_feedback.png'),

  apiModule: 'user',

  apiAction: 'feedback',

  // attributeMap: Object
  //    Attribute map (dijit._Widget)
  attributeMap: dojo.mixin(dojo.clone(dijit._Widget.prototype.attributeMap), {
    name: { node: 'titleNode', type: 'innerHTML' }
  }),

  startup: function() {
    this.attr('value', null);
  },

  onChange: function() {
    this.sendButton.attr('disabled', !this.groupInput.isValid());
  },

  send: function() {
    //console.log('send', this, arguments);
    var value = this.groupInput.attr('value');
    geonef.jig.api.request(
      {
        module: this.apiModule,
        action: this.apiAction,
        user: value.user,
        message: value.message,
        host: window.location.host,
        version: geonef.jig.version,
        callback: dojo.hitch(this, 'onSent')
      });

  },

  onSent: function(data) {
    //console.log('onSent', this, arguments);
    alert('Votre retour a été enregistré. Merci !');
    this.groupInput.attr('value', null);
  }


});
