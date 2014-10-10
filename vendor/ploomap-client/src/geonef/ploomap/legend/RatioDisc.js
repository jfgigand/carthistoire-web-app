dojo.provide('geonef.ploomap.legend.RatioDisc');

// parents
dojo.require('dijit._Widget');
dojo.require('dijit._Templated');

// used in template
dojo.require('geonef.ploomap.legend.Intervals');

dojo.declare('geonef.ploomap.legend.RatioDisc', [ dijit._Widget, dijit._Templated ],
{

  templateString: dojo.cache('geonef.ploomap.legend', 'templates/RatioDisc.html'),
  widgetsInTemplate: true,

  _setValueAttr: function(value) {
    this.intervalsLegend.attr('value', value);
    ['disc', 'hasNull'].forEach(
        function(prop) {
          if (value[prop]) {
            this.attr(prop, value[prop]);
          }
        }, this);
  },

  _setDiscAttr: function(disc) {
    this.disc = disc;
    dojo.query('> table.disc > tbody > tr > td', this.domNode).orphan();
    var et = parseInt(Math.round(disc.maxWidth - disc.minWidth));
    var list = [disc.minWidth,
                parseInt(Math.round(disc.minWidth + et / 4)),
                parseInt(Math.round(disc.minWidth + et / 2)),
                disc.maxWidth];
    list.forEach(
        function(width, key) {
          var style = 'border-bottom: '+width+'px solid '+disc.color+';';
          var label = key === 0 ? 'faible' :
                      (key === list.length - 1 ? 'forte' : '&nbsp;');
          dojo.create('td', { style: style, innerHTML: label }, this.discRow);
        }, this);
    dojo.query('> .nullDisc > .line', this.domNode)
        .style({ borderBottom: disc.nullWidth+'px solid '+disc.nullColor });
  },

  _setHasNullAttr: function(hasNull) {
    this.hasNull = hasNull;
    dojo[hasNull ? 'addClass' : 'removeClass'](this.domNode, 'hasNull');
  }

});
