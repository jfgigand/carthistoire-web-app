dojo.provide('geonef.jig.list.header.generic.AbstractField');

//dojo.require('geonef.jig.widget._I18n');

dojo.declare('geonef.jig.list.header.generic.AbstractField', null,
{
  getAdminWidget: function() {
    console.warn('getAdminWidget is deprecated!');
    return this.getListWidget();
  },

  getListWidget: function() {
    if (!this.adminWidget) {
      //console.log('getListWidget', this, this.domNode.parentNode.parentNode);
      this.adminWidget = dijit.getEnclosingWidget(
	this.domNode.parentNode.parentNode.parentNode);
    }
    return this.adminWidget;
  }
});
