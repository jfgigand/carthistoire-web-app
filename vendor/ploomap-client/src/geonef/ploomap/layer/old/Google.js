dojo.provide("geonef.ploomap.layer.Google");
dojo.require("geonef.ploomap.layer.Select");
dojo.declare("geonef.ploomap.layer.Google", geonef.ploomap.layer.Select, {

	name: 'Google',
	noOpacitySlider: true,

	registerLayers: function() {
		this._layers = this.map.map.getLayersBy('isBaseLayer', true);
	},

});
