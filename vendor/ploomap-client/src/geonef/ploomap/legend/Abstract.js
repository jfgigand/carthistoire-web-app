
dojo.provide('geonef.ploomap.legend.Abstract');

// parents
dojo.require('dijit._Widget');
dojo.require('dijit._Templated');
dojo.require('geonef.jig.input._Container');

// used in code
dojo.require('geonef.jig.util.number');

// used in template
dojo.require('geonef.jig.input.Label');

dojo.declare('geonef.ploomap.legend.Abstract',
             [ dijit._Widget, dijit._Templated, geonef.jig.input._Container ],
{
  // summary:
  //   Base class for legend widgets
  //

  resolution: null,

  manageValueKeys: ['hasNull', 'unit'],
  templateString: dojo.cache('geonef.ploomap.legend', 'templates/Abstract.html'),
  widgetsInTemplate: true,

  buildRendering: function() {
    this.inherited(arguments);
    dojo.addClass(this.domNode, 'ploomapLegend');
  },

  formatNumber: function(num) {
    return geonef.jig.util.number.formatDims([num], { units: [''] });
  },

  _setTextAttr: function(text) {
    this.textNode.innerHTML = text;
  },

  _setHasNullAttr: function(hasNull) {
    dojo.query('> .hasNull', this.domNode)
        .style('display', hasNull ? '' : 'none');
  },

  _setUnitAttr: function(unit) {
    this.unit = unit;
    var label = unit ? ('('+unit+')') : '';
    this.unitNode.innerHTML = label;
  }

});
