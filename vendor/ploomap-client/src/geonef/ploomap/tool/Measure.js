
dojo.provide('geonef.ploomap.tool.Measure');

dojo.require('geonef.jig.layout._Anchor');
dojo.require('dijit._Templated');
dojo.require('geonef.ploomap.MapBinding');

dojo.declare('geonef.ploomap.tool.Measure', [ geonef.jig.layout._Anchor, dijit._Templated, geonef.ploomap.MapBinding ],
{
  // summary:
  //    Tool for measuring distances or areas by drawing on the map
  //

  //helpPresentation: 'geonef.ploomap.presentation.measure',
  name: 'Mesure',
  icon: dojo.moduleUrl('geonef.ploomap', 'style/icon/tool_measure.png'),

  templateString: dojo.cache("geonef.ploomap.tool", "templates/Measure.html"),
  widgetsInTemplate: true,

  measureDistance: function() {
    this.measureControls.polygon.deactivate();
    this.measureControls.line.activate();
    this.cancelButton.attr('disabled', false);
    this.distanceButton.attr('disabled', true);
    this.areaButton.attr('disabled', false);
    dojo.publish('jig/workspace/flash',
                 ["Cliquer sur la carte pour tracer le chemin...."]);
  },

  measureArea: function() {
    this.measureControls.line.deactivate();
    this.measureControls.polygon.activate();
    this.cancelButton.attr('disabled', false);
    this.distanceButton.attr('disabled', false);
    this.areaButton.attr('disabled', true);
    dojo.publish('jig/workspace/flash',
                 ["Cliquer sur la carte pour tracer l'aire...."]);
  },

  cancel: function() {
    this.measureControls.line.deactivate();
    this.measureControls.polygon.deactivate();
    if (this.currentLi) {
      this.listNode.removeChild(this.currentLi);
      this.currentLi = null;
    }
    this.cancelButton.attr('disabled', true);
    this.distanceButton.attr('disabled', false);
    this.areaButton.attr('disabled', false);
  },

  clean: function() {
    var self = this;
    dojo.query('> li', this.listNode)
      .forEach(function(li) { self.listNode.removeChild(li); });
    this.cleanButton.attr('disabled', true);
  },

  destroy: function() {
    this.cancel();
    this.inherited(arguments);
  },


  onMapBound: function() {
    this.initControls();
  },

  toggleGeodesic: function() {
     for (key in this.measureControls) {
       this.measureControls[key].geodesic =
         this.geodesicCheckBox.attr('checked');
     }
  },


  initControls: function() {
    var sketchSymbolizers = {
      "Point": {
        pointRadius: 4,
        graphicName: "square",
        fillColor: "white",
        fillOpacity: 1,
        strokeWidth: 1,
        strokeOpacity: 1,
        strokeColor: "#333333"
      },
      "Line": {
        strokeWidth: 3,
        strokeOpacity: 1,
        strokeColor: "#666666",
        strokeDashstyle: "dash"
      },
      "Polygon": {
        strokeWidth: 2,
        strokeOpacity: 1,
        strokeColor: "#666666",
        fillColor: "white",
        fillOpacity: 0.3
      }
    };
    var style = new OpenLayers.Style();
    style.addRules([ new OpenLayers.Rule({symbolizer: sketchSymbolizers}) ]);
    var styleMap = new OpenLayers.StyleMap({"default": style});
    this.measureControls = {
      line: new OpenLayers.Control.Measure(
        OpenLayers.Handler.Path, {
          persist: true,
          handlerOptions: {
            layerOptions: {styleMap: styleMap}
          }
        }
      ),
      polygon: new OpenLayers.Control.Measure(
        OpenLayers.Handler.Polygon, {
          persist: true,
          handlerOptions: {
            layerOptions: {styleMap: styleMap}
          }
        }
      )
    };
    var control;
    for(var key in this.measureControls) {
      control = this.measureControls[key];
      control.events.on({
        "measure": dojo.hitch(this, 'finishMeasurement'),
        "measurepartial": dojo.hitch(this, 'handleMeasurements')
      });
      this.mapWidget.map.addControl(control);
    }
    this.toggleGeodesic();
  },

  handleMeasurements: function(event) {
    if (!this.currentLi) {
      this.currentLi = dojo.create('li', { 'class': 'item' }, this.listNode);
      this.cleanButton.attr('disabled', false);
    }
    var geometry = event.geometry
      , order = event.order
      , units = event.units
      , unit = order == 1 ? units : units + '<sup>2</sup>'
      , measure = event.measure
      , out;
    this.currentLi.innerHTML = '' + measure.toFixed(3) + ' ' + unit;
  },

  finishMeasurement: function(event) {
    this.handleMeasurements(event);
    dojo.style(this.currentLi, 'fontWeight', 'bold');
    this.currentLi = null;
    this.cancel();
  }

});
