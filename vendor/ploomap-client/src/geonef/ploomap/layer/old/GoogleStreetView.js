
dojo.provide("geonef.ploomap.layer.GoogleStreetView");

dojo.require("geonef.ploomap.layer.Simple");

dojo.declare("geonef.ploomap.layer.GoogleStreetView", geonef.ploomap.layer.Simple, {

	name: 'Google Street View',
	noOpacitySlider: true,
	locationPointStyle: {
		graphicWidth: 21,
		graphicHeight: 25,
		graphicXOffset: -10,
		graphicYOffset: -24,
		externalGraphic: "/images/featureTypes/lieu.png"
	},

	constructor: function() {
		dojo.mixin(this, {
			_gsvContainer: document.createElement('div'),
			_gsvObject: null,
			_gsvOverlay: null,
			_positionFeature: null,
			_moveControl: null,
			_layerZIndex: null
		});
	},

	destroy: function () {
	    this.inherited(arguments);
	},

	mapBound: function() {
		//console.log('mapBound', this);
	    this.inherited(arguments);
		dojo.connect(this.room, 'openMenu', this, function() {
			if (this._gsvContainer)
				dojo.style(this._gsvContainer, 'visibility', 'hidden');
		});
		dojo.connect(this.room, 'closeMenu', this, function() {
			if (this._gsvContainer)
				dojo.style(this._gsvContainer, 'visibility', 'visible');
		});
	},

	registerLayer: function() {
		this._layer = new OpenLayers.Layer.Vector('Google Street View', {
			maxResolution: "auto",

		});
	},

	_buildUI: function() {
		//this.inherited(arguments);
		this.domNode.appendChild(this._gsvContainer);
		dojo.addClass(this._gsvContainer, 'streetViewContainer');
		this._createGsvObject();
		this.setVisibility(true);
	},

	_createGsvObject: function() {
		//console.log('createGSV', this);
		this._gsvObject = new GStreetviewPanorama(this._gsvContainer);
		GEvent.addListener(this._gsvObject, 'error',
			dojo.hitch(this, function(code) { this.gsvError(code); }));
		GEvent.addListener(this._gsvObject, 'initialized',
			dojo.hitch(this, function(loc) { this.gsvMove(loc); }));
		this._gsvOverlay = new GStreetviewOverlay();
		var center = this.map.map.getCenter();
		var geometry = new OpenLayers.Geometry.Point(center.lon, center.lat);
		this._positionFeature = new OpenLayers.Feature.Vector(geometry);
		this._positionFeature.style = this.locationPointStyle;
		this._layer.addFeatures([this._positionFeature]);
		this._moveControl = new OpenLayers.Control.DragFeature(this._layer, {
			onStart: dojo.hitch(this, function(f) {
				this.map.map.baseLayer.mapObject.addOverlay(this._gsvOverlay);
				this._layerZIndex = this.map.map.baseLayer.getZIndex();
				this.map.map.baseLayer.setZIndex(this._layer.getZIndex() - 1);
			}),
			onComplete: dojo.hitch(this, function(f) {
				//console.log('move feature', arguments);
				if (f) {
					this.updateGsvLocation
						(new OpenLayers.LonLat(f.geometry.x, f.geometry.y));
				}
				this.map.map.baseLayer.setZIndex(this._layerZIndex);
				this.map.map.baseLayer.mapObject.removeOverlay(this._gsvOverlay);
			})
		});
		this.map.map.addControl(this._moveControl);
		this._moveControl.activate();
		this._moveControl.onComplete(this._positionFeature);
	},

	gsvMove: function(loc) {
		this._positionFeature.move
			(this.map.map.baseLayer.forwardMercator(loc.lng, loc.lat));
	},

	gsvError: function(errorCode) {
		switch(errorCode) {
			case 603:
				alert("Il manque le plugin flash à ce navigateur.\n\nLa vue 3D ne peut s'afficher.");
				return;
			case 600:
				console.log('GSV not av', this);
				//alert("Street View non disponible pour cet emplacement.");
				return;
		}
	},

	updateGsvLocation: function(lonlat) {
		var loc = this.map.map.baseLayer.
			getMapObjectLonLatFromLonLat(lonlat.lon, lonlat.lat);
		this._gsvObject.setLocationAndPOV(loc);
	},
	resize: function() {
		//this.inherited(arguments);
		if (this._gsvObject) {
			//console.log('resize Google Street View');
			this._gsvObject.checkResize();
		}
	},

	setVisibility: function(state) {
		this.inherited(arguments);
		if (this.data.visible) {
			this.enable();
		} else {
			this.disable();
		}
	},

	enable: function() {
		//console.log('enable', this);
		this.data.enabled = true;
		this._bindMapMove = dojo.connect(this.map, 'mapMove', this,
			function() { this.onMapMove(); });
		this.onMapMove();
	},

	disable: function() {
		this.data.enabled = false;
		if (this._bindMapMove) {
			dojo.disconnect(this._bindMapMove);
			this._bindMapMove = null;
		}
	},

	onMapMove: function() {
		//this.updateGsvLocation();
	}

});
