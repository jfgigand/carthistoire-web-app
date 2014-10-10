
dojo.provide('geonef.ploomap.layer.Vector');

// parents
dojo.require('geonef.ploomap.layer.Simple');

// used in template
dojo.require('dijit.form.Textarea');

// used in code
dojo.require('geonef.jig.workspace');
dojo.require('geonef.ploomap.OpenLayers.Control.FeatureSelect');
dojo.require('geonef.ploomap.OpenLayers.Control.FeaturePopup');
dojo.require('geonef.ploomap.OpenLayers.Control.FeatureDrag');
dojo.require('geonef.ploomap.OpenLayers.Control.FeatureModify');
dojo.require('geonef.ploomap.OpenLayers.Control.FeatureDraw');
dojo.require('geonef.ploomap.OpenLayers.Format.SLD');

/**
 * @class OPT box for vector layers
 *
 * Notes:
 *    - OpenLayers.Layer.Vectors has a "selectedFeatures" property,
 *      updated by OpenLayers.Control.SelectFeatures, who send
 *      corresponding events :
 *            "beforefeatureselected", "featureselected", "featureunselected"
 *
 *    - OpenLayers.Control.SelectFeatures does not catch any layer
 *      events "{on,before}feature{,s}removed"
 *
 *    - the vector layer does not offer itself any method to manage the
 *      selection
 *
 *    - exception "d.layer is null" if we unselect a selected feature
 *      at "beforefeatureremoved" event (seems that style tries to redraw
 *      feature after it has been removed from layer)
 *      -> workaround: only close popup, not unselect
 *
 */
dojo.declare('geonef.ploomap.layer.Vector', geonef.ploomap.layer.Simple,
{

  /**
   * Overload member from geonef.ploomap.layer.Simple
   *
   * @type {OpenLayers.Layer.Vector}
   */
  layer: null,

  selectControlActive: true,
  //initialCreateControlState: false,

  /**
   * Click control activated initially.
   *
   * @type {?OpenLayers.Control|geonef.ploomap.OpenLayers.Control.Widget}
   */
  defaultClickControl: geonef.ploomap.OpenLayers.Control.FeaturePopup,

  /**
   * Control to enable when the edit button is clicked
   *
   * If its prototype container has a "supportedGeometryTypes" member,
   * that array is searched for the layer's geometryType. If not found,
   * the controlClass' "fallbackClass" member is used to set this property.
   * (done in method "setupLayer")
   *
   * This is typically used for POINT layers, not supporting geometry
   * modification (fallback is the dragging control).
   *
   * @type {?OpenLayers.Control|geonef.ploomap.OpenLayers.Control.Widget}
   */
  editionClickControlClass: geonef.ploomap.OpenLayers.Control.FeatureModify,

  multipleSelect: false,

  selectControlOptions: {
    // multipleKey: 'altKey',
    // toggleKey: 'altKey',
    // clickout: true,
    // box: false,
    // multiple: false,
    // toggle: true
  },

  /**
   * @type {string}
   */
  defaultStyleName: 'default',

  /** @type {string} */
  hoverStyleName: 'hover',

  /** @type {string} */
  selectStyleName: 'hover',

  /** @inheritDoc */
  templateString: dojo.cache("geonef.ploomap.layer", "templates/Vector.html"),

  /**
   * Current enabled click control
   *
   * @type {?OpenLayers.Control|geonef.ploomap.OpenLayers.Control.Widget}
   */
  clickControl: null,

  iconUrl: dojo.moduleUrl('geonef.ploomap', 'style/icon/layer_vector_active.png'),

  /////////////////////////////////////////////////////////////
  // Widget lifecycle

  postMixInProperties: function() {
    this.inherited(arguments);
    this.selectControlOptions = dojo.mixin({}, this.selectControlOptions);
  },

  destroy: function() {
    //console.log('destroy vector', this);
    this._destroying = true;
    this.removeContextMover();
    if (this.clickControl) {
      this.setClickControl(null, true);
    }
    this.attr('selectControlActive', false);
    if (this.saveStrategy) {
      // has strategy been destroyed?
      this.saveStrategy.events.un(
        {
          "start": this.saveStart,
          "success": this.saveSuccess,
          "fail": this.saveFailure,
          scope: this
        });
      this.saveStrategy = null;
    }
    this.layer.events.un(
      {
        "featuresadded": this.afterFeaturesAdded,
        "beforefeatureremoved": this.beforeFeatureRemoved,
        "featureselected": this.onFeatureSelect,
        "featureunselected": this.onFeatureUnselect,
        //"visibilitychanged": this.visibilityChanged,
        scope: this
      });
    this.inherited(arguments);
  },

  onMapBound: function() {
    this.inherited(arguments);
    this.setupLayer();
    this.setupUI();
    this.setClickControl();
    this.initStyle();
  },


  /////////////////////////////////////////////////////////////
  // LAYER & CONTROL

  setupLayer: function() {
    this.layer.events.on(
      {
        featuresadded: this.afterFeaturesAdded,
        beforefeatureremoved: this.beforeFeatureRemoved,
        featureselected: this.onFeatureSelect,
        featureunselected: this.onFeatureUnselect,
        //visibilitychanged: this.visibilityChanged,
        scope: this
      });
    if (this.layer.protocol && this.layer.protocol.format) {
      this.layer.protocol.format.getSrsName = function(feature, options) {
        var srsName = options && options.srsName;
        if(!srsName) {
          srsName = this.srsName;
        }
        return srsName;
      };
    }
    if (this.layer.strategies) {
      this.saveStrategy = this.layer.strategies.filter(
        function(s) { return s.CLASS_NAME === 'OpenLayers.Strategy.Save'; })[0];
      if (this.saveStrategy) {
        this.saveStrategy.events.on(
          {
            start: this.saveStart,
            success: this.saveSuccess,
            fail: this.saveFailure,
            scope: this
          });
      }
    }
    if (this.editionClickControlClass &&
        this.editionClickControlClass.prototype.supportedGeometryTypes &&
        this.editionClickControlClass.prototype.supportedGeometryTypes
            .indexOf(this.layer.geometryType) === -1) {
      this.editionClickControlClass =
        this.editionClickControlClass.prototype.fallbackClass;
    }
  },

  setupUI: function() {
    this.buildButton('general', 'actionRefresh', "Recharger");
    if (this.saveStrategy) {
      //this.buildButton('vector', dojo.hitch(this, 'setClickControl',
      //    geonef.ploomap.OpenLayers.Control.FeatureDrag), "Déplacer...");
      this.buildButton('vector', dojo.hitch(this, 'setClickControl',
          geonef.ploomap.OpenLayers.Control.FeatureDraw), "Mode création");
      this.buildButton('vector',
          dojo.hitch(this, 'setClickControl', this.editionClickControlClass),
          "Mode édition");
    }
    this.buildButton('style', 'applySld', "Appliquer les changements");
    if (this.layer.sldUrl) {
      this.buildButton('style', 'loadSld', "Recharger le style initial");
    }
  },

  createSelectControl: function() {
    //console.log('createSelectControl', this, arguments);
    if (this.mapWidget.selectControl) {
      console.error('select control already exists on map',
                    this.mapWidget.selectControl, this.mapWidget, this);
      throw new Error('select control already exists',
                      this.mapWidget.selectControl, this);
    }
    var control;
    control = new geonef.ploomap.OpenLayers.Control.FeatureSelect(
        [this.layer], dojo.mixin(
          {
            callbacks: {
              over: function(f) { control.overFeature(f); },
              out: function(f) { control.outFeature(f); }
            }
          }, this.selectControlOptions));
    this.mapWidget.selectControl = control;
    this.mapWidget.map.addControl(control);
    dojo.mixin(control.handlers.feature,
	{ stopUp: false, stopDown: false, stopClick: true });
    control.activate();
  },



  /////////////////////////////////////////////////////////////
  // EVENTS

  afterFeaturesAdded: function(event) {
    var features = event.features;
    //console.log('beforeFeaturesAdded', features);
  },

  beforeFeatureRemoved: function(event) {
    var feature = event.feature;
    //console.log('beforeFeatureRemoved', feature, feature.attributes.name);
    feature._ploomapFeatureRemove = true;
    if (this.layer.selectedFeatures.indexOf(feature) !== -1) {
      this.mapWidget.selectControl.unselect(feature);
    }
  },

  onFeatureSelect: function(event) {
    var f = event.feature;
    //console.log('onFeatureSelect', f, f.attributes.name);
    this.addToSelectionList(f);
    this.layer.drawFeature(f, this.selectStyleName);
  },

  onFeatureUnselect: function(event) {
    var f = event.feature;
    //console.log('onFeatureUnselect', f, f.attributes.name);
    this.removeFromSelectionList(f);
    this.layer.drawFeature(f, this.defaultStyleName);
  },

  onFeatureOver: function(f) {
    if (f.layer !== this.layer) { return; }
    //console.log('onFeatureOver', this, arguments);
    var label = this.featureToString(f);
    this.layer.drawFeature(f, this.hoverStyleName);
    this.createContextMover(f);
    if (dojo.isFunction(f.onMouseOver)) {
      f.onMouseOver();
    }
  },

  onFeatureOut: function(f) {
    if (f.layer !== this.layer) { return; }
    //console.log('onFeatureOut', this, arguments);
    var selected = this.layer.selectedFeatures.indexOf(f) !== -1;
    this.layer.drawFeature(f, selected ?
                           this.selectStyleName : this.defaultStyleName);
    this.removeContextMover();
    if (dojo.isFunction(f.onMouseOut)) {
      f.onMouseOut();
    }
  },

  onFeatureCreated: function(feature) {
    console.log('onFeatureCreated', this, arguments);
    //this.attr('createControlActive', false);
    this.mapWidget.selectControl.select(feature);
  },

  saveStart: function(event) {
    dojo.publish('ploomap/layer/save/start', [this.layer, event]);
    dojo.publish('jig/workspace/flash',
                 [ "Enregistrement de \""+this.layer.name+"\"..." ]);
  },

  saveSuccess: function(event) {
    dojo.publish('ploomap/layer/save/success', [this.layer, event]);
    dojo.publish('ploomap/layer/save/end', [this.layer, event]);
    dojo.publish('jig/workspace/flash',
                 [ "Enregistrement de \""+this.layer.name+"\" : OK :)" ]);
  },

  saveFailure: function(event) {
    dojo.publish('ploomap/layer/save/failure', [this.layer, event]);
    dojo.publish('ploomap/layer/save/end', [this.layer, event]);
    dojo.publish('jig/workspace/flash',
                 [ "Enregistrement de \""+this.layer.name+"\" : échec :(" ]);
  },

  onFeatureAdded: function(f) {
    // NOT CALLED! comment above
    //console.log('onFeatureAdded', f.attributes.id, f, this);
    //this.mapWidget.selectControl.select(f);
  },


  /////////////////////////////////////////////////////////////
  // MANAGEMENT

  addToSelectionList: function(f) {
    //console.log('addToSelectionList', f);
    if (!this.listNode) { return; }
    var geomType = f.geometry.CLASS_NAME.replace(/.*\./, '')
    , c = dojo.create
    , tr = c('tr', {}, this.listNode)
    , td1 = c('td', { "class": "n", innerHTML: geomType }, tr)
    , td2 = c('td', { innerHTML: this.featureToString(f) }, tr);
    tr.feature = f;
  },

  removeFromSelectionList: function(f) {
    //console.log('removeFromSelectionList', this, arguments);
    if (!this.listNode) { return; }
    var self = this;
    dojo.query('> tr', this.listNode)
      .filter(function(tr) { return tr.feature === f; })
      .forEach(function(tr) { self.listNode.removeChild(tr); });
  },

  featureToString: function(f) {
    return this.layer.getFeatureTitle ? this.layer.getFeatureTitle(f) :
      (f.attributes.name || f.id);
  },

  /////////////////////////////////////////////////////////////
  // UI

  createContextMover: function(f, content_) {
    if (this._contextNode && this._contextNode.ploomapFeature !== f) {
      this.removeContextMover();
    }
    var oX = oY = 15;
    var newContext;
    if (!this._contextNode) {
      //console.log('createContextMover F', this, arguments);
      this._contextNode = dojo.create('div');
      this._contextNode.ploomapFeature = f;
      dojo.addClass(this._contextNode, 'mouseContextBubble');
      var _mouseMove = dojo.hitch(this, function(e) {
                                    //if (this._contextNode)
			            this._contextNode.style.left = '' + (e.clientX + oX) + 'px';
			            this._contextNode.style.top = '' + (e.clientY + oY) + 'px';
		                  });
      geonef.jig.connectOnce(this.mapWidget.map.node, 'onmouseout', this,
                      function(evt) {
		        this.removeContextMover();
		      });
      geonef.jig.connectOnce(window, 'onmousemove', this,
                      function(evt) {
                        this._contextNode.style.position = 'absolute';
		        _mouseMove(evt);
		        dojo.body().appendChild(this._contextNode);
		        this._contextHandler =
			  dojo.connect(window, 'onmousemove', this, _mouseMove);
			//this._contextMover = new dojo.dnd.Mover(node, evt);
		      });
    }
    this._contextNode.innerHTML = content_ || this.featureToString(f);
  },

  removeContextMover: function() {
    if (this._contextHandler) {
      dojo.disconnect(this._contextHandler);
      this._contextHandler = null;
    }
    if (this._contextNode) {
      this._contextNode.ploomapFeature = null;
      dojo.body().removeChild(this._contextNode);
      this._contextNode = null;
    }
  },


  buildFeatureNode: function(f, node) {
    node.innerHTML = 'Vecteur';
  },


  /////////////////////////////////////////////////////////////
  // ACTIONS - getters+setters

  actionRefresh: function() {
    //console.log('refresh', this, arguments);
    this.layer.destroyFeatures();
    this.layer.refresh();
  },

  _setSelectControlActiveAttr: function(state) {
    // Change whether this layer is enabled within the select control
    //
    this.toggleSelectControlButton.attr('checked', state);
    this.afterMapBound(
      function() {
        //console.log('_setSelectControlActiveAttr afterMapBound', state);
        if (state) {
          if (!this._selCnts) {
            if (!this.mapWidget.selectControl) {
              this.createSelectControl();
            } else {
              //console.log('add to sel control', this, arguments);
              this.mapWidget.selectControl.layer.resetRoots();
              this.mapWidget.selectControl.layer.layers.push(this.layer);
              this.mapWidget.selectControl.layer.collectRoots();
              /*this.mapWidget.map.setLayerIndex(
                  this.mapWidget.selectControl.layer,
                  this.mapWidget.map.layers.length);*/
            }
            this._selCnts = [
              dojo.connect(this.mapWidget.selectControl, 'overFeature',
                           this, 'onFeatureOver'),
              dojo.connect(this.mapWidget.selectControl, 'outFeature',
                           this, 'onFeatureOut')
            ];
            //console.log('made connects', this, this._selCnts);
          }
        } else {
          if (this._selCnts) {
            //console.log('remove from sel control', this, arguments);
            this._selCnts.forEach(dojo.disconnect);
            this._selCnts = null;
            this.mapWidget.selectControl.layer.resetRoots();
            OpenLayers.Util.removeItem(
              this.mapWidget.selectControl.layer.layers, this.layer);
            if (this.mapWidget.selectControl.layer.layers.length === 0) {
              //console.log('destroying', this, this.mapWidget.selectControl);
              this.mapWidget.selectControl.deactivate();
              this.mapWidget.selectControl.destroy();
              this.mapWidget.selectControl = null;
            } else {
              //console.log('just recollect', this, arguments);
              this.mapWidget.selectControl.layer.collectRoots();
            }
          }
        }
      });
  },

  // _setCreateControlActiveAttr: function(state) {
  //   this.toggleCreateControlButton.attr('checked', state);
  //   if (this.createControl) {
  //     if (state) {
  //       this.createControl.activate();
  //     } else {
  //       //console.log('bef createC deact', this, arguments);
  //       this.createControl.deactivate();
  //       //console.log('after createC deact', this, arguments);
  //     }
  //   }
  // },

  /**
   * @param {?!OpenLayers.Control|geonef.ploomap.OpenLayers.Control.Widget}
   *                    control to enable
   * @param {?boolean}  if true, don't require user confirmation,
   *                    even in case of unsaved data
   */
  setClickControl: function(Class, anyway_) {
    //console.log('setClickControl', this, arguments);
    var control, undefined;
    if (this.clickControl) {
      if (this.clickControl.canBeClosed && anyway_ !== true &&
          !this.clickControl.canBeClosed()) {
        return;
      }
      control = this.clickControl;
      // destroy connected func won't do anything
      this.clickControl = null; // this is a way to say "no initiative"
      control.destroy();
    }
    if (Class === undefined) {
      Class = this.defaultClickControl;
    }
    if (Class) {
      control = new Class({ layer: this.layer });
      this.clickControl = control;
      this.mapWidget.map.addControl(control);
      control.activate();
      if (control.startup) { control.startup(); }
      geonef.jig.connectOnce(control, 'destroy', this,
        function() {
          if (this.clickControl) {
            // means destroy() wasn't called from the code above
            this.clickControl = null;
            this.setClickControl();
          }});
    }
  },


  /////////////////////////////////////////////////////////////
  // STYLE

  initStyle: function() {
    if (this.layer.sldUrl) {
      this.loadSld();
    }
    //dojo.style(this.loadSldButton.domNode, 'display',
    //           !this.layer.sldUrl ? 'none' : '');
  },

  loadSld: function() {
    var url = this.layer.sldUrl;
    dojo.publish('jig/workspace/flash', [
                   "Téléchargement de la feuille de style pour "
                   + "la couche : "+this.layer.name ]);
    var self = this;
    dojo.xhrGet(
      {
        url: url, //handleAs: 'xml',
        load: function(xml) {
          self.sldTextarea.attr('value', xml);
          self.applySld();
        },
        error: function() {
          console.error('error', self, arguments);
          dojo.publish('jig/workspace/flash', [ 'Échec du téléchargement.' ]);
        }
      });
  },

  applySld: function() {
    dojo.publish('jig/workspace/flash', [ 'Application du style...' ]);
    var xml = this.sldTextarea.attr('value');
    //var format = new OpenLayers.Format.SLD();
    var format = new geonef.ploomap.OpenLayers.Format.SLD();
    //var format = new OpenLayers.Format.SLD({ options: { multipleSymbolizers: true } });
    var sld = format.read(xml);
    var self = this;
    [ 'default', 'select', 'hover' ].forEach(
      function(n) {
        if (sld.namedLayers[n]) {
          self.layer.styleMap.styles[n] = sld.namedLayers[n].userStyles[0];
          //console.log('style', n, self.layer.styleMap.styles[n], this);
        }
      });
    this.layer.redraw();
  }

});
