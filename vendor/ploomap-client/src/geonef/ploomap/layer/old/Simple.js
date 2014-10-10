
dojo.provide("geonef.ploomap.layer.Simple");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require('room.widget.WidgetList')
dojo.require("geonef.ploomap.MapBinding");
dojo.require("geonef.ploomap.layer.Utils");

dojo.declare("geonef.ploomap.layer.Simple",
		[dijit._Widget, dijit._Templated,
		 geonef.ploomap.MapBinding, geonef.ploomap.layer.Utils, room.widget.WidgetList], {

	name: 'Couche',
	notice: '',
	noOpacitySlider: false,

	// set true to prevent enable/disable/setVisibility to change
	// the visibility of the OL layer
	ignoreLayerVisibility: false,
	minZoom: null,
	maxZoom: null,

	templatePath: dojo.moduleUrl('geonef.ploomap.layer', 'templates/Simple.html'),

	attributeMap: dojo.mixin(dojo.clone(dijit._Widget.prototype.attributeMap), {
		name: { node: 'titleNode', type: 'innerHTML' },
		notice: { node: 'noticeNode', type: 'innerHTML' },
	}),

	constructor: function() {
		dojo.mixin(this, {
			_layer: null,
			_vsNode: null,
		});
		//console.log('simple', this);
	},

	destroy: function () {
	    if (this._layer) {
    	    this.map.map.removeLayer(this._layer);
	    }
	    this.inherited(arguments);
	},

	mapBound: function() {
		//console.log('map bound', this);
		this.registerLayer();
		this.map.map.addLayer(dojo.mixin(this._layer, { visibility: false }));
		if (this.minZoom !== null || this.masZoom !== null) {
			dojo.connect(this.map, 'zoomChange', this,
				function() { this.onZoomChange(); });
		}
		dojo.connect(this.map)
		this._buildUI();
		this.setVisibility();
		this.setOpacity();
		//console.log('map bound end', this);
	},

	registerLayer: function() {
		// to be overloaded
	},

	_buildUI: function() {
		//console.log('_buildUI', this);
		var self = this;
		this._vsNode.checked = this.data.visible;
		dojo.connect(this._vsNode, 'onchange', this,
			function() { this.setVisibility(this._vsNode.checked); });
		if (this._layer) {
			dojo.addClass(this.titleNode, 'roomPositionUpdate')
			this.titleNode.roomUpdatePosition =
				function(index) { return self.updatePosition(index); };
		}
		if (!this.noOpacitySlider) {
			this.buildOpacitySlider(this.domNode);
		}
		//console.log('_buildUI end');
	},

	updatePosition: function(index) {
		//var self = this;

		/*var _updateLayerPosition = function(layer, idx) {
			layer.setZIndex(index + (dojo.isObject(self.features) ? 10000 : 0));
			return idx + 20;
		}*/
		if (this._layer) {
			index += 20;
			if (dojo.isObject(this._layer.features)) {
				var realIndex = index + 10000;
			} else {
				var realIndex = index;
			}
			this._layer.setZIndex(realIndex);
			//index = _updateLayerPosition(this._layer, index);
	    	//console.log('updatedPosition', this._layer.name, this, index, realIndex);
		}
		return index;
	},

	setVisibility: function(state) {
		//console.log('layer simple visibility', state, this);
		if (state === undefined) {
			state = this.data.visible !== undefined && this.data.visible;
		}
		this.data.visible = state;
		if (this._vsNode)
			this._vsNode.checked = state;
		if (this.data.visible && this.visibilityCheck())
			this.enable();
		else
			this.disable();
	},

	visibilityCheck: function() {
		//console.log('visibilityCheck', this);
		var zoom = this.map.map.getZoom();
		if (this.minZoom !== null && zoom < this.minZoom) {
			this.attr('notice', 'inactif : zoom trop petit');
			return false;
		}
		if (this.maxZoom !== null && zoom > this.maxZoom) {
			this.attr('notice', 'inactif : zoom trop grand');
			return false;
		}
		this.attr('notice', '');
		return true;
	},

	setOpacity: function(opacity) {
		if (opacity === undefined)
			opacity = this.data.opacity === undefined
				? 1.0 : this.data.opacity;
		this.data.opacity = opacity;
		this._layer.setOpacity(opacity);
	},

	enable: function() {
		//console.log('enable', this);
		if (!this.ignoreLayerVisibility) {
			this._layer.setVisibility(true);
		}
		if (!this.noOpacitySlider) {
			this.setOpacitySlider(true);
		}
		this.inherited(arguments);
	},

	disable: function() {
		if (!this.ignoreLayerVisibility) {
			this._layer.setVisibility(false);
		}
		if (!this.noOpacitySlider) {
			this.setOpacitySlider(false);
		}
		this.inherited(arguments);
	},

	destroy: function() {
		if (this.map.map && this._layer) {
			this.map.map.removeLayer(this._layer);
		}
		this.inherited(arguments);
	},

/*	onMapMove: function() {
		if (!this.visibilityCheck()) {
			this.disable();
		}
	},*/

	onZoomChange: function() {
		var check = this.visibilityCheck();
		if (this.data.visible) {
			if (!this.data.enabled && check) {
				this.enable();
			} else if (this.data.enabled && !check) {
				this.disable();
			}
		}
	}

});
