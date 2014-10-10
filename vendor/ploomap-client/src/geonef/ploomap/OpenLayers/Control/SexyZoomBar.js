
/**
 * @requires OpenLayers/Control.js
 */

dojo.provide('geonef.ploomap.OpenLayers.Control.SexyZoomBar');

// parents
dojo.require('geonef.ploomap.OpenLayers.Control.Widget');

// template
dojo.require('geonef.jig.button.Action');
dojo.require('dijit.form.VerticalSlider');

// code
dojo.require('dijit.form.VerticalRule');
dojo.require('geonef.ploomap.tool.Magnifier');
dojo.require('geonef.ploomap.presentation.sexyZoomBar');

dojo.declare('geonef.ploomap.OpenLayers.Control.SexyZoomBar',
             geonef.ploomap.OpenLayers.Control.Widget,
{
  // summary:
  //    Like OL ZoomBar control, with better user experience (hover features, etc)
  //

  magnifierClass: geonef.ploomap.tool.Magnifier,
  helpPresentation: 'geonef.ploomap.presentation.sexyZoomBar',

  templateString: dojo.cache('geonef.ploomap.OpenLayers.Control',
                             'templates/SexyZoomBar.html'),

  widgetsInTemplate: true,

  layoutSwitcherPosition: 'right',

  buttonsEnabled: ['help', 'magnifier', 'location'],

  numZoomLevels: null,

  zoomLevelGroups: [
    { min: 0, max: 1, name: 'world', label: 'Monde', lineHeight: 18 },
    { min: 2, max: 3, name: 'continent', label: 'Continent', lineHeight: 18 },
    { min: 4, max: 6, name: 'country', label: 'Pays', lineHeight: 30 },
    { min: 7, max: 8, name: 'region', label: 'Région', lineHeight: 18 },
    { min: 9, max: 11, name: 'department', label: 'Département', lineHeight: 30 },
    { min: 12, max: 14, name: 'city', label: 'Commune', lineHeight: 30 },
    { min: 15, max: 16, name: 'district', label: 'Quartier', lineHeight: 18 },
    { min: 17, max: 17, name: 'street', label: 'Rue', lineHeight: 8 }
  ],

  buildRendering: function() {
    this.inherited(arguments);
    if (this.buttonsEnabled.indexOf('help') !== -1) { this.buildHelpButton();}
  },

  buildHelpButton: function() {
    this.helpButton = new dijit.form.Button(
      { label: "?", onClick: dojo.hitch(this, 'startHelpPresentation'),
        title: "Lancer la présentation d'aide" });
    dojo.addClass(this.helpButton.domNode, 'jigCacoinHelpButton notSticky');
    this.helpButton.placeAt(this.domNode, 'last');
    this.helpButton.startup();
  },

  buildLocationButton: function() {
    this.locationInput = new geonef.ploomap.input.MapExtent(
      { id: this.id + '-buttons-location', mapWidget: this.map.mapWidget });
    this.connect(this.locationInput, 'onDialogOpen',
                 dojo.hitch(this, 'setAlernateLayoutConstraint', 'location', true));
    this.connect(this.locationInput, 'onDialogClose',
                 dojo.hitch(this, 'setAlernateLayoutConstraint', 'location', false));
    this.locationInput.placeAt(this.toolsNode);
    this.locationInput.startup();
  },

  startHelpPresentation: function() {
    if (dojo.isString(this.helpPresentation)) {
      dojo['require'](this.helpPresentation);
      this.helpPresentation = dojo.getObject(this.helpPresentation);
    }
    dojo['require']('geonef.jig.macro.Player');
    geonef.jig.macro.Player.prototype.attemptPlay(this.helpPresentation);
  },

  setMap: function(map) {
    //console.log('sexyZoom setMap', this, arguments);
    this.inherited(arguments);

    if (!this.numZoomLevels) {
      this.numZoomLevels = this.map.numZoomLevels;
    }
    this.slider.attr('maximum', this.numZoomLevels - 1/*+ 1*/);
    this.slider.attr('discreteValues', this.numZoomLevels /*+ 2*/);
    this.buildRules();
    this.buildNiceHelp();
    if (this.buttonsEnabled.indexOf('location') !== -1) { this.buildLocationButton();}
    this.onZoomChange();
    this.connect(this.map.mapWidget, 'onZoomChange', 'onZoomChange');
  },

  buildNiceHelp: function() {
    this.labelList = dojo.create('div', {
      'class': 'dijitRuleContainer dijitRuleContainerV '
               + 'dijitRuleLabelsContainer '
               + 'dijitRuleLabelsContainerV rightLabels' },
      this.slider.rightDecoration/*containerNode*/);
    this.zoomList = dojo.create('div', {
      'class': 'dijitRuleContainer dijitRuleContainerV '
               + 'dijitRuleLabelsContainer '
               + 'dijitRuleLabelsContainerV leftLabels' },
      this.slider.leftDecoration /*containerNode*/);
    var count = this.numZoomLevels /*+ 2*/;
    var i;
    var interval = 100 / (count-1);
    var height = dojo.contentBox(this.slider.containerNode.parentNode).h;
    var h = height / (count - 1);
    var self = this;
    var drawZoomLevelGroup = dojo.hitch(this,
      function(group) {
        var max = Math.min(group.max, count); // this.numZoomLevels may be wrong
        var topPct = interval * (count - max - 1);
        var heightPct = interval * (max - group.min + 0.8);
        //console.log('drawZoomLevelGroup', arguments, topPct, heightPct);
        var node = dojo.create('div',
        {
          'class': 'dijitRuleLabelContainer dijitRuleLabelContainerV '
                   + 'link notSticky ' + group.name,
          style: 'top:'+topPct+'%; height:'+heightPct+'%;line-height:'+
            group.lineHeight+'px',
          innerHTML: group.label,
          title: group.name,
          onclick: function() {
            var mapZ = self.map.getZoom();
            var zoom = Math.abs(mapZ - group.min) <
                       Math.abs(mapZ - max) ? group.min : max;
            self.map.zoomTo(zoom);
          }
        }, this.labelList);
      });
    var drawZoomLevel = dojo.hitch(this,
      function(pos, ndx) {
        //console.log('draw zoom', arguments);
        var node = dojo.create('div',
        {
          'class': 'dijitRuleLabelContainer dijitRuleLabelContainerV'
                   + ' link notSticky',
          style: 'top:'+pos+'%',
          onclick: function() { self.map.zoomTo(ndx); },
          innerHTML: ndx
        }, this.zoomList);

      });
    /*console.log('ggggggg', interval, height, h,
                dojo.contentBox(this.slider.containerNode),
                dojo.contentBox(this.slider.containerNode.parentNode),
                dojo.coords(this.slider.containerNode),
                dojo.coords(this.slider.containerNode.parentNode),
                this.slider.containerNode);*/
    for (i = 0; i < count; i++) {
      drawZoomLevel(interval * (count - i - 1), i);
    }
    (this.map.mapWidget.zoomLevelGroups ||
     this.zoomLevelGroups).forEach(drawZoomLevelGroup);
  },


  buildRules: function() {
    var node = dojo.create('ol', {}, this.slider.containerNode);
    var sliderRules = new dijit.form.VerticalRule({
						count: this.map.numZoomLevels /*+ 2*/,
						style: "width:3px"
					}, node);
    dojo.addClass(sliderRules.domNode, 'rule notSticky');
  },

  onSliderChange: function() {
    if (this._noChangeEv || !this.map) {
      return;
    }
    var zoom = this.slider.attr('value');
    this.slider.sliderHandle.innerHTML = zoom;
    //console.log('slider set zoom', this, zoom);
    this.map.zoomTo(zoom);
  },

  onZoomChange: function() {
    this._noChangeEv = true;
    this.slider.attr('value', this.map.getZoom());
    this._noChangeEv = false;
  },

  openMagnifier: function() {
    if (this.magnifier) { return; }
    var
      self = this
    , widgetId = this.map.mapWidget.id+'_magnifier'
    , creator = function(id) {
                    return new geonef.ploomap.tool.Magnifier(
                      { id: id, mapWidget: self.map.mapWidget }); }
    ;
    this.magnifier = geonef.jig.workspace.loadWidget(widgetId, creator)
    ;
    if (!this.magnifier) {
      return;
    }
    geonef.jig.connectOnce(this.magnifier, 'destroy', this,
                    function() { this.magnifier = null; });
    //geonef.jig.workspace.autoAnchorWidget(widget);
    this.magnifier.placeAt(this.containerNode);
    geonef.jig.workspace.highlightWidget(this.magnifier, 'open');
    this.magnifier.startup();
  }/*,

  updateLayoutState: function() {
    var alternate = this.inherited(arguments);
    //console.log('hey', alternate, this);
    if (alternate) {
    //dojo.query('> *', this.zoomList).style('display', '');
    //this.domNode.scrollIntoView();
    //dojo.query('> *', this.labelList)
    //  .style('display', 'none').style('display', '');
    //this.slider.rightDecoration.removeChild(this.labelList);
    //this.slider.rightDecoration.addChild(this.labelList);
    //dojo.style(this.labelList, 'margin-top', '1px');
    //dojo.style(this.labelList, 'margin-top', '0');
      //this.map.updateSize();
      console.log('szb!', this);
      var box = dojo.contentBox(this.domNode);
      dojo.style(this, 'height', box.h === 279 ? '280px' : '279px');
    //dojo.style(this.zoomList, 'display', alternate ? '' : 'none');
    //dojo.style(this.labelList, 'display', alternate ? '' : 'none');
    }
    return alternate;
  }*/

});
