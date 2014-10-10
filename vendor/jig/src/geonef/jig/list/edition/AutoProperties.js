
dojo.provide('geonef.jig.list.edition.AutoProperties');

// parents
dojo.require('geonef.jig.list.edition.Abstract');
dojo.require('geonef.jig.list.edition._AutoPropertiesEmbed');
dojo.require('geonef.jig.widget.ButtonContainerMixin');

// code
dojo.require('geonef.jig.util');
dojo.require('geonef.jig.button.TooltipWidget');
dojo.require('geonef.jig.list.edition.tool.ApplyProperty');

dojo.declare('geonef.jig.list.edition.AutoProperties',
             [geonef.jig.list.edition.Abstract,
              geonef.jig.list.edition._AutoPropertiesEmbed,
              geonef.jig.widget.ButtonContainerMixin],
{
  // summary:
  //   Autoamtically manage a list of properties
  //

  hideControlButtons: false,

  templateString: dojo.cache('geonef.jig.list.edition',
                             'templates/AutoProperties.html'),

  _setHideControlButtonsAttr: function(hide) {
    dojo.style(this.generalNode, 'display', hide ? 'none' : '');
  },

});
