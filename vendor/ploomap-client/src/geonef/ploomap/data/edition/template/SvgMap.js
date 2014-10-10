
dojo.provide('geonef.ploomap.data.edition.template.SvgMap');

// parents
dojo.require('geonef.jig.data.edition.template.Text');

dojo.declare('geonef.ploomap.data.edition.template.SvgMap',
             geonef.jig.data.edition.template.Text,
{
  module: 'SvgMap' ,

  getPropertiesOrder: function() {
    var props = ['mapElementId', 'legendElementId', 'content'];
    return this.inherited(arguments).
      filter(function(k) { return k !== 'content'; }).concat(props);
  },

  postMixInProperties: function() {
    this.inherited(arguments);
    this.propertyTypes = dojo.mixin(
      {
      }, this.propertyTypes);
  }

});
