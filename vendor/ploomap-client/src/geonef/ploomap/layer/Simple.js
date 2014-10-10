
dojo.provide('geonef.ploomap.layer.Simple');

// parents
dojo.require('geonef.jig.layout._Anchor');
dojo.require('dijit._Templated');
dojo.require('geonef.ploomap.MapBinding');
dojo.require('geonef.jig.widget.ButtonContainerMixin');

// used in template
//dojo.require('dijit.layout.TabContainer');
//dojo.require('dijit.layout.ContentPane');

// used in code
dojo.require('geonef.ploomap.input.ExtentView');

dojo.declare('geonef.ploomap.layer.Simple',
             [ geonef.jig.layout._Anchor, dijit._Templated, geonef.ploomap.MapBinding,
               geonef.jig.widget.ButtonContainerMixin ],
{
  layerTitle: '-',

  layerWidget: '',

  templateString: dojo.cache("geonef.ploomap.layer", "templates/Simple.html"),
  widgetsInTemplate: true,


  //
  // UI UPDATE
  ///////////////////////////////////////////////

  onMapBound: function() {
    this.layerWidget = dijit.byId(this.layerWidget);
    this.layer = this.layerWidget.layer;
    this.layer.optWidget = this;
    if (this.layer.layerExtent || this.layer.isBaseLayer) {
      this.extent = new geonef.ploomap.input.ExtentView({
                      mapWidget: this.mapWidget, autoPanMap: false });
      this.extent.attr('value', this.layer.layerExtent ||
                                this.layer.map.getMaxExtent());
      this.extent.placeAt(this.generalNode);
      this.extent.startup();
    }
    if (this.layer.vectorLayerName && !this.layer.isVector) {
      this.buildButton('general', 'actionVectorLayer', "Afficher vecteurs");
    }
    if (!this.layer.isBaseLayer) {
      this.buildButton('general', 'actionRemove', "Retirer");
    }
    this.setMetadata();
  },

  setMetadata: function() {
    var props = {
      description: 'Description',
      source: 'Source',
      url: 'En savoir plus',
      copyright: 'Droits',
      region: 'Région'
    };
    if (!dojo.isObject(this.layer.metadata)) {
      return;
    }
    for (var i in props) {
      if (props.hasOwnProperty(i) && this.layer.metadata.hasOwnProperty(i)) {
        var ct = this.layer.metadata[i];
        if (ct.search(/http:\/\//) === 0) {
          ct = '<a href="'+ct+'" target="_blank">'+ct+'</a>';
        }
        var tr = dojo.create('tr', {}, this.metadataListNode)
        , td1 = dojo.create('td', { 'class': 'n', innerHTML: props[i] }, tr)
        , td2 = dojo.create('td', { innerHTML: ct }, tr);
      }
    }
  },


  //
  // ACTIONS
  ///////////////////////////////////////////////

  actionRemove: function() {
    //console.log('remove simple', this, arguments);
    if (this.layer.controllerWidget) {
      geonef.jig.workspace.highlightWidget(this.layer.controllerWidget, 'warn');
    } else {
      this.mapWidget.destroyLayerWithEffect(this.layer);
    }
  },

  actionZoomToMaxExtent: function() {
    var extent = this.layer.layerExtent || this.layer.maxExtent;
    if (extent) {
      this.layer.map.zoomToExtent(extent, true);
    } else {
      dojo.publish('jig/workspace/flash', [ 'Étendue non définie pour cette couche' ]);
    }
  },

  actionOpacityWheel: function() {
    var self = this;
    if (this.opacityWheelButton.attr('checked')) {
      console.log('set handler', this, arguments);
      this.mapWidget.setMouseWheelHandler(
        function(dir) {
          var _o;
          self.layer.setOpacity(
            _o=Math.max(0.0, Math.min(1.0, self.layer.opacity + (dir > 0 ? 0.1 : -0.1))));
          console.log('setOp', self, _o);
        },
        function() { self.opacityWheelButton.attr('checked', false); });
    } else {
      this.mapWidget.setMouseWheelHandler(null, null);
    }
  },

  actionVectorLayer: function() {
    this.mapWidget.layersDefs.addLayerToMap(this.layer.vectorLayerName);
  }

});
