dojo.provide("geonef.ploomap.layer.Utils");
dojo.require('dijit.form.Slider');
dojo.require('dojo.dnd.Selector');
dojo.declare("geonef.ploomap.layer.Utils", null, {

	constructor: function() {
		this._opacitySliderNode = document.createElement('div');
	},

	buildOpacitySlider: function(parentNode) {
		parentNode.appendChild(this._opacitySliderNode);
	},

	setOpacitySlider: function(state) {
		if (state) {
			if (!this._opacitySlider)
				this._buildOpacitySlider();
			dojo.style(this._opacitySlider.domNode, 'display', '');
		} else if (this._opacitySlider)
			dojo.style(this._opacitySlider.domNode, 'display', 'none');
	},

	_buildOpacitySlider: function() {
		var _wit = false;;
		this._opacitySlider =
			new dijit.form.HorizontalSlider({
  				value: this.data.opacity * 100.0,
				maximum: 100,
				minimum: 0,
				pageIncrement: 20,
				showButtons: false,
				intermediateChanges: true,
				style: /*"width:90%;*/'height: 20px;',
				onChange: dojo.hitch(this, function(p) {
					_wit = true;
					this.setOpacity(p / 100.0);
					_wit = false;
				})
			}, this._opacitySliderNode);
		dojo.connect(this, 'setOpacity', this, function() {
			if (!_wit) {
				//console.log('update slider', this, _wit);
				this._opacitySlider.attr('value', this.data.opacity * 100.0);
			}
		});
	},

	boundsToData: function(olBounds) {
		return [olBounds.left, olBounds.bottom, olBounds.right, olBounds.top];
	},

	dataToBounds: function(struct) {
		return new OpenLayers.Bounds(struct[0], struct[1],
									 struct[2], struct[3]);
	},

});
