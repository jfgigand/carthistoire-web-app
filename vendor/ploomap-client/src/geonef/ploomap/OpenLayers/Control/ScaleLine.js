/**
 * @requires OpenLayers/Control/ScaleLine.js
 */

dojo.provide('geonef.ploomap.OpenLayers.Control.ScaleLine');

dojo.require('geonef.ploomap.tool.Measure');

geonef.ploomap.OpenLayers.Control.ScaleLine = OpenLayers.Class(OpenLayers.Control.ScaleLine,
{
  // summary:
  //    Extend Openlayers's scale line to make it clickable to open the measure tool
  //

  integratedMeasureTool: true,
  msgShow: "Cliquer pour afficher l'outil de mesure",
  msgHide: "Cliquer pour cacher l'outil de mesure",

  draw: function() {
    var div = OpenLayers.Control.ScaleLine.prototype.draw.apply(this, arguments);
    dojo.addClass(div, 'olControlScaleLine');
    dojo.query('> .ploomapolControlScaleLineTop', this.div).
      addClass('olControlScaleLineTop link').connect('onclick', dojo.hitch(this, 'onClick'));
    dojo.query('> .ploomapolControlScaleLineBottom', this.div).
      addClass('olControlScaleLineBottom link');
    this.div.title = this.msgShow;
    this._cnt = dojo.connect(div, 'onmousedown',
                             function(evt) { evt.stopPropagation(); });
    return div;
  },

  destroy: function() {
    if (this._cnt) { dojo.disconnect(this._cnt); }
    OpenLayers.Control.ScaleLine.prototype.destroy.call(this);
  },


  createMeasureTool: function() {
    if (this.measureTool) {
      return;
    }
    this.measureTool = new geonef.ploomap.tool.Measure({ mapWidget: this.map.mapWidget });
    geonef.jig.connectOnce(this.measureTool, 'destroy', this,
                    function() { this.measureTool = null; });
    if (this.integratedMeasureTool) {
      this.measureTool.placeAt(this.div, 'first');
      geonef.jig.workspace.highlightWidget(this.measureTool, 'open');
    } else {
      geonef.jig.workspace.autoAnchorWidget(measure);
    }
    this.measureTool.startup();
  },

  onClick: function() {
    var visible = this.measureTool &&
      dojo.style(this.measureTool.domNode, 'display') !== 'none';
    this.createMeasureTool();
    if (this.integratedMeasureTool) {
      dojo.style(this.measureTool.domNode, 'display', visible ? 'none' : '');
      this.div.title = visible ? this.msgShow : this.msgHide;
    }
  },

  CLASS_NAME: 'geonef.ploomap.OpenLayers.Control.ScaleLine'

});
