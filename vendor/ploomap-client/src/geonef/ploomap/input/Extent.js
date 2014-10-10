
dojo.provide('geonef.ploomap.input.Extent');

// parents
dojo.require('geonef.ploomap.input.ExtentView');

// used in template
dojo.require('dijit.form.DropDownButton');
dojo.require('dijit.TooltipDialog');
dojo.require('dijit.layout.TabContainer');
dojo.require('dijit.layout.ContentPane');
dojo.require('dijit.form.TextBox');
dojo.require('dijit.form.ToggleButton');

// used in code
dojo.require('geonef.jig.clipboard');

dojo.declare('geonef.ploomap.input.Extent', geonef.ploomap.input.ExtentView,
{
  // summary:
  //    Special input for geographic extent. Provides rich UI to manipulate it.
  //
  // todo:
  //    - bookmarks
  //    - address history (autocomplete)
  //    - mouse cursor change on drawMode (layer div onMouseOver)
  //

  templateString: dojo.cache('geonef.ploomap.input', 'templates/Extent.html'),
  widgetsInTemplate: true,

  name: 'extent',
  value: undefined,

  hideSelectMapExtentButton: false,

  label: "Région",

  geocodingEnabled: true,

  postMixInProperties: function() {
    //console.log('prop', this, arguments);
    //window.tt = this;
    this.inherited(arguments);
    this.history = [];
    this.historyCurrent = Number.NaN;
  },

  buildRendering: function() {
    this.inherited(arguments);
    if (this.hideSelectMapExtentButton) {
      dojo.style(this.selectMapExtentButton.domNode, 'display', 'none');
    }
  },

  postCreate: function() {
    this.inherited(arguments);
    dojo.query('.geocoding', this.tabContainer.domNode)
      .style('display', this.geocodingEnabled ? '' : 'none');
  },


  // EXTENT-RELATED
  /////////////////////////////////////////////////////////////

  _doSetValue: function(bounds) {
    var s = this.inherited(arguments);
    if (s) {
      this.pushToHistory(bounds);
    }
  },

  goZoom: function() {
    var value = this.attr('value');
    if (value) {
      this.attr('value', value.scale(0.5));
    }
  },

  goUnZoom: function() {
    var value = this.attr('value');
    if (value) {
      this.attr('value', value.scale(2));
    }
  },

  selectMapExtent: function() {
    this.isMapExtent = true;
    this.destroyVectorLayer();
    this.attr('label', this.label);
    this.onChange();
  },

  geolocNavigator: function() {
    this.mapWidget.geoLocalizeNavigator();
  },


  // RECTANGLE TRACING FUNCTIONALITY
  /////////////////////////////////////////////////////////////

  toggleDraw: function(state) {
    this.afterMapBound(
      function() {
        var _dh
        , _destroyDrawControl = dojo.hitch(this,
          function() {
            if (_dh) { this.disconnect(_dh); _dh = null; }
            if (this.drawControl) {
              this.drawControl.deactivate();
              this.mapWidget.map.removeControl(this.drawControl);
              this.drawControl.destroy(); // forgotten
              this.drawControl = null;
              this.destroyVectorLayer();
              this.toggleDrawButton.attr('checked', false);
            }
          });
        if (state) {
          if (this.drawControl) { return; }
          var _drawEnd = dojo.hitch(this,
              function(feature) {
                window.setTimeout(dojo.hitch(this,
                  function() {
                    this.attr('value', feature.geometry.getBounds());
                    _destroyDrawControl();
                  }), 10);
              });
          this.createVectorLayer();
          this.drawControl = new OpenLayers.Control.DrawFeature(
                               this.vectorLayer, OpenLayers.Handler.RegularPolygon,
                                 { handlerOptions: { sides: 4, irregular: true },
                                   featureAdded: _drawEnd });
          this.connect(this.drawControl.handler, 'activate',
                       function() {
                         if (this.drawControl.handler.layer) {
                           this.drawControl.handler.layer.controllerWidget = this;
                         }
                       });
          _dh = this.connect(this, 'destroyVectorLayer', _destroyDrawControl);
          this.mapWidget.map.addControl(this.drawControl);
          this.drawControl.activate();
          dojo.publish('jig/workspace/flash', ['Mode tracé activé.']);
          dojo.publish('jig/workspace/flash', ['Veuillez cliquer puis déplacer pour définir le rectangle.']);
        } else {
          _destroyDrawControl();
        }
      });
  },

  createVectorLayer: function() {
    //console.log('createVectorLayer', this, arguments);
    if (!this.vectorLayer) {
      this.vectorLayer = new OpenLayers.Layer.Vector(
        'Région : tracé', { maxResolution: 'auto', controllerWidget: this,
                            displayInLayerSwitcher: false });
      this.mapWidget.map.addLayer(this.vectorLayer);
    }
    // add feature
    if (!this.isMapExtent) {
      var bounds = this.attr('value');
      if (bounds) {
        var feature = new OpenLayers.Feature.Vector(bounds.toGeometry());
        this.vectorLayer.destroyFeatures();
        this.vectorLayer.addFeatures([feature]);
      }
    }
  },

  destroyVectorLayer: function() {
    if (this.vectorLayer) {
      //this.mapWidget.map.removeLayer(this.vectorLayer);
      this.mapWidget.destroyLayerWithEffect(this.vectorLayer);
      this.vectorLayer = null;
    }

  },

  onDialogOpen: function() {
    this.dialogOpen = true;
    this.createVectorLayer();
    /*if (this.vectorLayer) {
      this.vectorLayer.setVisibility(true);
    }*/
  },

  onDialogClose: function() {
    this.dialogOpen = false;
    if (this.vectorLayer && !this.drawControl) {
      //this.vectorLayer.setVisibility(false);
      this.destroyVectorLayer();
    }
  },


  // HISTORY FUNCTIONALITY
  /////////////////////////////////////////////////////////////

  goBackward: function() {
    this.goHistory(-1);
  },

  goForward: function() {
    this.goHistory(1);
  },

  pushToHistory: function(bounds) {
    if (this._noHistory) { return; }
    if (this.historyCurrent !== this.history.length - 1 && !isNaN(this.historyCurrent)) {
      var self = this;
      dojo.query('> li', this.historyNode).slice(0, this.history.length - this.historyCurrent - 1)
        .forEach(function(li) { self.historyNode.removeChild(li); });
      this.history.splice(this.historyCurrent + 1, this.history.length - this.historyCurrent);
    }
    var current = this.historyCurrent = this.history.push(bounds) - 1;
    var label = ''+current+' - '+this.formatSize(bounds);
    var self = this,
      node = dojo.create('li',
        {
          onclick: function() { self.goHistory(current, true); },
          innerHTML: label,
          'class': 'link item'
        }, this.historyNode, 'first');
    this.onHistoryChange();
  },

  goHistory: function(shift, isIndex) {
    if (!this.history.length) { return false; }
    //console.log('goHistory', arguments);
    var idx = isIndex ? shift : this.historyCurrent + shift;
    if (idx < 0) { idx = 0; }
    if (idx >= this.history.length) { idx = this.history.length - 1; }
    if (idx === this.historyCurrent) { return false; }
    this.historyCurrent = idx;
    this._noHistory = true;
    this._doSetValue(this.history[this.historyCurrent]);
    this._noHistory = false;
    this.onHistoryChange();
    return idx;
  },

  onHistoryChange: function() {
    this.goBackwardButton.attr('disabled', !(this.historyCurrent > 0));
    this.goForwardButton.attr('disabled',  !(this.historyCurrent < this.history.length - 1));
  },

  // GEOCODING FUNCTIONALITY
  /////////////////////////////////////////////////////////////

  actionGeocode: function() {
    var value = this.geocodeTextBox.attr('value');
    this.queryGeocoder(value);
  },

  onGeocodeTextBoxInput: function(e) {
    //console.log('key', e);
    if (e.keyCode === 13) {
      this.actionGeocode();
    }
  },

  queryGeocoder: function(query) {
    //console.log('query geocoder');
    //dojo.publish('jig/workspace/flash',
    //  [ 'Localisation de l\'adresse : ' + query]);
    dojo.publish('jig/workspace/flash', ['Recherche de : '+query+' ...']);
    //var geocoder = new GClientGeocoder();
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({address: query}, dojo.hitch(this, 'geocoderResponse'));
    //geocoder.getLocations(query, dojo.hitch(this, 'geocoderResponse'));
  },

  geocoderResponse: function(r, status) {
    var p;
    //console.log('response', r);
    //if (r.Status.code === G_GEO_UNKNOWN_ADDRESS) {
    if (status === google.maps.GeocoderStatus.ZERO_RESULTS) {
      console.log('Aucun emplacement trouvé !', r);
      alert('Désolé, aucun emplacement trouvé.\n'+
            'Essayez de restreindre la recherche en précisant '
            + 'le pays et/ou le département.');
      dojo.publish('jig/workspace/flash', ['Aucun emplacement trouvé !']);
      return;
    }
    if (status !== google.maps.GeocoderStatus.OK) {
      console.log('Geocoder error', r);
      alert('Erreur (réseau ?).\nRéessayez.');
      dojo.publish('jig/workspace/flash', ['Erreur lors de la recherche'/* : statut '+r.Status.code*/]);
      return;
    }
    dojo.publish('jig/workspace/flash',
		 [ '' + r.length + ' emplacement(s) trouvé(s)']);
		 //[ '' + r.Placemark.length + ' emplacement(s) trouvé(s)']);
    if (r.length === 1) {
    //if (r.Placemark.length === 1) {
      //console.log('only one');
      this.choosePlacemark(r[0], true);
      //this.choosePlacemark(r.Placemark[0], true);
    } else {
      //console.log('must find');
      // p = this.selectOneGeocoderPlacemark(r);
      // if (p) {
      //   this.choosePlacemark(p, true);
      // } else {
	this.showList(r);
      // }
    }
  },

  choosePlacemark: function(p, addToMenu) {
    //console.log('choosePlacemark', this, p);
    dojo.publish('jig/workspace/flash',
		 [ 'Sélection de l\'adresse : ' + p.address_components[0].long_name]);
    //		 [ 'Sélection de l\'adresse : ' + p.address]);
    //var coord = p.Point.coordinates
    var
        sphericalMeractor = OpenLayers.Layer.SphericalMercator
      , box = p.geometry.bounds
      , ne = box.getNorthEast()
      , sw = box.getSouthWest()
      //, box = p.ExtendedData.LatLonBox
      , lonLatSW = sphericalMeractor.forwardMercator(sw.lng(), sw.lat())
      , lonLatNE = sphericalMeractor.forwardMercator(ne.lng(), ne.lat())
      // , lonLatSW = sphericalMeractor.forwardMercator(box.west, box.south)
      // , lonLatNE = sphericalMeractor.forwardMercator(box.east, box.north)
      , value = new OpenLayers.Bounds(
                  lonLatSW.lon, lonLatSW.lat, lonLatNE.lon, lonLatNE.lat)
      , pointProj = new OpenLayers.Projection('EPSG:900913')
      , projected = value.transform(
                      pointProj, this.mapWidget.map.getProjectionObject());
    //value = sphericalMeractor.forwardMercator(coord[0], coord[1]),
    ;
    //console.log(box, lonLatSW, lonLatNE, value);
    this.attr('value', projected);
  },

  // selectOneGeocoderPlacemark: function(r) {
  //   var a = [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  //   max = 0, maxP = null;
  //   dojo.forEach(r.Placemark, function(p) {
  //       	   a[p.AddressDetails.Accuracy]++;
  //       	   if (p.AddressDetails.Accuracy > max) {
  //       	     max = p.AddressDetails.Accuracy;
  //       	     maxP = p;
  //       	   }
  //       	 });
  //   if (dojo.some(a, function(i) { return i > 1; })) {
  //     //console.log('multiple', r);
  //     return null;
  //   }
  //   //console.log('unique', maxP);
  //   return maxP;
  // },

  showList: function(r) {
    var self = this;
    dojo.query('> li', this.geocodeNode)
      .forEach(function(li) { self.geocodeNode.removeChild(li); });
    dojo.forEach(r,
    //dojo.forEach(r.Placemark,
      dojo.hitch(this, function(p) { this.processPlace(p); }));
    this.tabContainer.selectChild(this.id+'-tab-geocode');
  },

  processPlace: function(p) {
    //console.log('processPlace', p);
    var
      self = this
    , human = p.address_components[0].long_name
    //, human = p.address
    //, acc = p.AddressDetails.Accuracy
    , c = p.geometry.location
    //, c = p.Point.coordinates
    , coords = '' + c.lng() + ' ; ' + c.lat()
    //, coords = '' + c[0] + ' ; ' + c[1]
    , node = dojo.create('li',
        {
          onclick: function() { self.choosePlacemark(p); },
          innerHTML: human,
          'class': 'link item'
        }, this.geocodeNode)
    ;
  },


  // CLIPBOARD FUNCTIONALITY
  /////////////////////////////////////////////////////////////

  pasteFromClipboard: function() {
    var obj = geonef.jig.clipboard.fetch('extent');
    if (!dojo.isArray(obj)) {
      alert('Aucune région à coller !');
      return;
    };
    var value = OpenLayers.Bounds.fromArray(obj);
    console.log('paste location', value);
    this.attr('value', value);
    dojo.publish('jig/workspace/flash', [ 'Région collée depuis le presse-papier' ]);
  },

  // copyToClipboard defined in geonef.ploomap.input.ExtentView

});
