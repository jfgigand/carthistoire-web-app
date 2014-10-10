dojo.provide("geonef.ploomap.layer.PlanList");

dojo.require("dijit._Widget");
dojo.require("geonef.ploomap.MapBinding");
dojo.require("geonef.ploomap.layer.Utils");

dojo.declare("geonef.ploomap.layer.PlanList",
	[dijit._Widget, geonef.ploomap.MapBinding, geonef.ploomap.layer.Utils], {

	label: 'Plans',
	name: 'Plans',
	catchMapMoveEvent: true,

	constructor: function() {
		console.log('planList start', this);
		dojo.mixin(this, {
			_bindMapMove: null,
			_listNode: null,
			_formerRegion: null,
			_enabled: null,
			plans: {},
		});
	},

	mapBound: function() {
		this.setVisibility();
		this.buildUI();
		if (this.data.enabled || this.data.enabled === undefined)
			this.enable();
	},

	buildUI: function() {
		// visibility checkbox
		dojo.addClass(this.domNode, 'layer');
		var input = document.createElement('input');
		dojo.mixin(input, {
			type: 'checkbox',
			checked: this.data.visible
		});
		this.domNode.appendChild(input);
		dojo.connect(input, 'onchange', this,
			function() { this.setVisibility(input.checked); });

		// label
		var b = document.createElement('b');
		b.appendChild(document.createTextNode(this.label));
		var titleSpan = document.createElement('span');
		dojo.addClass(titleSpan, 'draghandle');
		titleSpan.appendChild(b);
		this.domNode.appendChild(titleSpan);
		this.domNode.appendChild(document.createElement('br'));
		this._listNode = document.createElement('div');
		this.domNode.appendChild(this._listNode);
	},

	setVisibility: function(state) {
		if (state === undefined) {
			state = this.data.visible && this.data.enabled ? true : false;
		}
		this.data.visible = state;
		if (state) this.enable(); else this.disable();
	},

	/*enable: function() {
		this.data.enabled = true;
		this._formerRegion = null;
		this._bindMapMove = dojo.connect(this.map, 'mapMove', this,
			function() { this.onMapMove(); });
		this.onMapMove();
	},*/

	disable: function() {
		/*this.data.enabled = false;
		if (this._bindMapMove) {
			dojo.disconnect(this._bindMapMove);
			this._bindMapMove = null;
		}*/
		this.inherited(arguments);
		this.clearList();
	},

	addPlan: function(widget) {
		this.plans[widget.getLayerId()] = widget;
		this._listNode.appendChild(widget.domNode);
		widget.startup();
		widget.roomReady();
	},

	removePlan: function(widget_or_layerId) {
		if (typeof widget_or_layerId == 'string')
			var layerId = widget_or_layerId;
		else
			for (var i in this.plans)
				if (this.plans[i] == widget_or_layerId) {
					var layerId = i;
					break;
				}
		this.plans[layerId].destroy();
		delete this.plans[layerId];
	},

	clearList: function() {
		for (var i in this.plans) {
			this._listNode.removeChild(this.plans[i].domNode);
			this.plans[i].destroy();
		}
	},

	onMapMove: function() {
		console.log('onMapMove (plan list)', this, arguments);
		var region = {
			zoom: this.map.map.getZoom(),
			extent: this.boundsToData(this.map.map.getExtent())
		}
		this.onRegionChange(region, this._formerRegion);
		this._formerRegion = region;
	},

	onRegionChange: function(newRegion, oldRegion) {
		// overload this method
	},

    getMenuItems: function(menu, baseId) {
        var menuPlans = new dijit.Menu({
            parentMenu: menu,
            id: baseId+'_plans'
        });
        for (var i in this.plans) {
        	if (this.plans.hasOwnProperty(i)) {
        		if (this.plans[i].getMenuItems) {
        			var subMenu = new dijit.Menu({
        				parentMenu: menuPlans,
        				id: baseId+'_plans_'+this.plans[i].name
        			});
        			var subItems = this.plans[i].getMenuItems(subMenu,
        					baseId+'_plans_'+this.plans[i].name);
					for (var j = 0, jl = subItems.length; j < jl; j++) {
						subMenu.addChild(subItems[j]);
					}
        			menuPlans.addChild(new dijit.PopupMenuItem({
        				label: this.plans[i].name,
        				popup: subMenu
        			}));
        		}
        	}
        }
        return [
            new dijit.PopupMenuItem({
                label: 'Plans',
                popup: menuPlans
            }),
/*            new dijit.MenuItem({
                label: 'Cacoin gestionnaire de couches',
                onClick: function() {
                	_this._addLayerWidget();
                }
            }),*/
        ];
    },


});
