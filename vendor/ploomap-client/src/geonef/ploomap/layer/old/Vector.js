
dojo.provide("geonef.ploomap.layer.Vector");
dojo.require("geonef.ploomap.layer.Simple");
dojo.declare("geonef.ploomap.layer.Vector", geonef.ploomap.layer.Simple, {

	name: 'Couche vecteur',

	catchMapMoveEvent: true,

	catchRegionChangeEvent: false,

	layerOptions: {},

	useSLD: null,

	constructor: function() {
		dojo.mixin(this, {
			catchMapMoveEvent: false,
			layerOptions: dojo.mixin({}, this.layerOptions),
			_formerRegion: null,
			_sld: null,
		});
	},

	postMixInProperties: function() {
		if (this.data.visible == undefined)
			this.data.visible = false;
		this.catchMapMoveEvent = this.catchMapMoveEvent ||
								 this.catchRegionChangeEvent;
		if (this.useSLD)
			this.layerOptions.styleMap = new OpenLayers.StyleMap();
		this.inherited(arguments);
	},

	_buildUI: function() {
		this.inherited(arguments);
		/*var activateLink = dojo.create('div');
		var link = dojo.create('span');
		dojo.addClass(link, 'link');
		dojo.connect(link, 'onclick', this, 'enable');
		link.innerHTML = 'activer';
		activateLink.appendChild(link);
		this.domNode.appendChild(activateLink);*/
	},

	registerLayer: function() {
		this._layer =
			new OpenLayers.Layer.Vector('Couche vecteur',
					dojo.mixin({ maxResolution: "auto" }, this.layerOptions));
	},

	onMapMove: function() {
		//console.log('onMapMove', this);
		if (this.catchRegionChangeEvent) {
			var region = {
				zoom: this.map.map.getZoom(),
				extent: this.boundsToData(this.map.map.getExtent())
			}
			this.onRegionChange(region, this._formerRegion);
			this._formerRegion = region;
		}
	},

	onRegionChange: function(newRegion, oldRegion) {
		// overload this method
	},

	updateFeatures: function(region) {
		// overload this method
	},

	createFeatureMarker: function(feature) {
		feature.marker = new OpenLayers.Marker(
				feature.lonlat, feature.data.icon);
	},

	addFeatures: function(features) {
		var self = this;
		var _createMarker;
		dojo.forEach(features, dojo.hitch(this, function(feature) {
			if (!this.filterFeature(feature)) {
				return;
			}
			_createMarker = feature.createMarker;
			this._layer.addFeatures(feature);
			/*dojo.mixin(feature,
				{
					createMarker: function() {
				        if (this.lonlat != null)
							feature.marker = self.createFeatureMarker(feature);
				        return feature.marker;
					}
				}
			);*/
		}));
	},

	// called by addFeature. must return true to let the feature be added
	filterFeature: function(f) {
		//console.log('filter0', f, this);
		for (var i = 0; i < this._layer.features.length; i++) {
			if (f.attributes.id === this._layer.features[i].attributes.id) {
				//console.log('refuse to add ', f.attributes.id, f, this);
				return false;
			}
		}
		//console.log('OK to add ', f.attributes.id, f, this);
		return true;
	},

	enable: function() {
		this.inherited(arguments);
		console.log('enable', this);
		if (this.widgets && this.widgets.selection) {
			this.widgets.selection.activate();
		}
		this.reloadSLD();
		this.updateFeatures({
			zoom: this.map.map.getZoom(),
			extent: this.boundsToData(this.map.map.getExtent())
		});
		//dojo.connect(this.domNode, 'onclick', this, this.reloadSLD);
	},

	reloadSLD: function() {
		var self = this;
		if (this.useSLD/* && !this._sld*/) {
			new dojo.xhrGet({
				url: this.useSLD,
				handleAs: 'xml',
				load: function(xml) {
					//console.log('got SLD response', self, xml);
					var format = new OpenLayers.Format.SLD();
					var sld = format.read(xml);
					//console.log('got sld', sld, sld.namedLayers['default'].userStyles[0]);
					dojo.mixin(self._layer.styleMap.styles, {
						'default': sld.namedLayers['default'].userStyles[0],
						'select': sld.namedLayers['select'].userStyles[0],
						'hover': sld.namedLayers['hover'].userStyles[0]
					});
					self._layer.redraw();
				}
			});
		}
	}

});
