dojo.provide('geonef.ploomap.tool.StreetView');


dojo.require('geonef.jig.layout._Anchor');
dojo.require('dijit._Templated');
dojo.require('geonef.ploomap.MapBinding');
dojo.require('dijit.form.DropDownButton');
dojo.require('dijit.TooltipDialog');
dojo.require('geonef.jig.button.Action');
dojo.require('geonef.ploomap.layer.StreetView');

dojo.declare('geonef.ploomap.tool.StreetView',
             [ geonef.jig.layout._Anchor, dijit._Templated, geonef.ploomap.MapBinding ],
{
  templateString: dojo.cache("geonef.ploomap.tool", "templates/StreetView.html"),
  widgetsInTemplate: true,
  name: "Rues 3D",
  icon: dojo.moduleUrl('geonef.ploomap', 'style/icon/tool_streetview.png'),
  sldUrl: dojo.moduleUrl('geonef.ploomap', 'style/sld/streetview.xml'),
  directionFeatureDistanceMin: 60, // pixels
  directionFeatureDistanceMax: 120, // pixels
  numZoomLevels: 4,
  anchorType: 'map',
  anchorPosition: 'right',

  /**
   * Options for google.maps.StreetViewPanorama
   *
   * @type {google.maps.StreetViewPanoramaOptions}
   */
  panoramaOptions: {
    //enableFullScreen: true
  },

  postMixInProperties: function() {
    this.inherited(arguments);
    dojo.mixin(this, {
		 gsvContainer: dojo.create('div'),
		 gsvObject: null,
		 gsvOverlay: null,
		 positionFeature: null,
		 moveControl: null,
		 layerZIndex: null,
                 heading: 0, zoom: 0,
                 wgs84: new OpenLayers.Projection('EPSG:4326')
	       });
  },

  onMapBound: function() {
    //console.log('mapBound', this);
    this.inherited(arguments);
    this.domNode.appendChild(this.gsvContainer);
    dojo.addClass(this.gsvContainer, 'streetViewContainer');
    this.connect(this.mapWidget, 'onZoomChange', 'onMapZoomChange');
    this.layer = new OpenLayers.Layer.Vector('Vue des rues',
      {
        //minResolution: 1.1943285667419434,  // 17
        //maxResolution: 38.21851413574219,   // 12
        //projection: this.mapWidget.map.getProjection(),
        //minResolution: null,
        //maxResolution: this.mapWidget.map.maxResolution,
        //maxExtent: this.mapWidget.map.getMaxExtent(),
        controllerWidget: this,
        sldUrl: this.sldUrl,
        icon: '/lib/geonef/ploomap/style/icon/tool_streetview.png',
        //optClass: geonef.ploomap.layer.StreetView
      });
    console.log('layer', this, this.layer);
    this.layer.events.on({ visibilitychanged: this.onLayerVisibilityChange,
                           scope: this});
    this.mapWidget.map.addLayer(this.layer);
    this.layer.optWidget.connect(this.layer.optWidget, 'applySld',
        dojo.hitch(this, function() { this.symbolizers = null; }));
    this.createGsvObject();
    this.initCustom();
    this.setVisibility(true);
    console.log('end onMapBound', this, arguments);
  },

  destroy: function() {
    if (this.layer) {
      this.layer.events.un({ visibilitychanged: this.onLayerVisibilityChange,
                             scope: this});
      this.layer.controllingWidget = null;
      this.mapWidget.map.removeLayer(this.layer);
      this.layer.destroy();
      this.layer = null;
    }
    this.positionFeature = this.directionFeature = null;
    if (this.moveControl) {
      this.moveControl.onStart = null;
      this.moveControl.onDrag = null;
      this.moveControl.onComplete = null;
      this.mapWidget.map.removeControl(this.moveControl);
      this.moveControl = null;
    }
    this.inherited(arguments);
  },

  createGsvObject: function() {
    //console.log('createGSV', this);
    //this.gsvObject = new GStreetviewPanorama(this.gsvContainer, { enableFullScreen: true });
    this.gsvObject = new google.maps.StreetViewPanorama(
      this.gsvContainer, dojo.mixin(
        { /*pano: 'okapi',*/ panoProvider: dojo.hitch(this, 'getPanorama') },
        this.panoramaOptions));
    google.maps.event.addListener(this.gsvObject, 'error', dojo.hitch(this, 'gsvError'));
    google.maps.event.addListener(this.gsvObject, 'position_changed', dojo.hitch(this, 'gsvMove'));
    google.maps.event.addListener(this.gsvObject, 'pov_changed', dojo.hitch(this, 'gsvPovChange'));
    //google.maps.event.addListener(this.gsvObject, 'zoomchanged', dojo.hitch(this, 'gsvZoomChange'));
    //this.gsvOverlay = new google.maps.StreetViewOverlay();
    var center = this.mapWidget.map.getCenter();
    var geometry = new OpenLayers.Geometry.Point(center.lon, center.lat);
    this.positionFeature = new OpenLayers.Feature.Vector(geometry);
    this.positionFeature.attributes.type = 'position';
    this.positionFeature.attributes.name = "Vue 3D<br/>"
      + "<small>Cliquer et déplacer pour changer d'endroit...</small>";
    this.directionFeature = new OpenLayers.Feature.Vector(geometry.clone());
    this.directionFeature.attributes.type = 'direction';
    this.directionFeature.attributes.name = "Direction observée<br/>"
      + "<small>Cliquer et déplacer pour tourner et zoomer...</small>";
    this.layer.addFeatures([this.positionFeature, this.directionFeature]);
    this.updateDirectionFeature();
    this.moveControl = new OpenLayers.Control.DragFeature(this.layer, {
	onStart: dojo.hitch(this, 'onDragStart'),
        onDrag: dojo.hitch(this, 'onDrag'),
	onComplete: dojo.hitch(this, 'onDragEnd')
    });
    this.mapWidget.map.addControl(this.moveControl);
    this.moveControl.activate();
    this.moveControl.handlers.feature.moveLayerBack();
    this.moveControl.onComplete(this.positionFeature);
  },

  onDragStart: function(feature, pixel) {
    this.dragging = true;
    if (feature.attributes.type === 'position') {
      this.dragPositionGeom = this.positionFeature.geometry.clone();
      this.dragDirectionGeom = this.directionFeature.geometry.clone();
      if (!this.gsvOverlayActive) {
        if (this.gsvOverlay &&
            this.mapWidget.map.baseLayer.mapObject &&
            this.mapWidget.map.baseLayer.mapObject.addOverlay) {
          this.mapWidget.map.baseLayer.mapObject.addOverlay(this.gsvOverlay);
          this.layerZIndex = this.mapWidget.map.baseLayer.getZIndex();
          this.mapWidget.map.baseLayer.setZIndex(this.layer.getZIndex() - 1);
          this.gsvOverlayActive = true;
        }
      }
    } else if (feature.attributes.type === 'direction') {
    }
  },

  onDrag: function(feature, pixel) {
    if (feature.attributes.type === 'position') {
      var x = feature.geometry.x - this.dragPositionGeom.x;
      var y = feature.geometry.y - this.dragPositionGeom.y;
      this.directionFeature.move(new OpenLayers.LonLat(
          this.dragDirectionGeom.x + x, this.dragDirectionGeom.y + y));
      //this.updateGsvLocation(new OpenLayers.LonLat(feature.geometry.x, feature.geometry.y));
    } else if (feature.attributes.type === 'direction') {
      var geom = this.positionFeature.geometry;
      var x = feature.geometry.x - geom.x;
      var y = feature.geometry.y - geom.y;
      var h = Math.sqrt(x * x + y * y);
      var hPx = h / this.mapWidget.map.getResolution();
      var zoom = this.numZoomLevels * (hPx - this.directionFeatureDistanceMin) /
        (this.directionFeatureDistanceMax - this.directionFeatureDistanceMin);
      var ac = Math.acos(x / h);
      var angle = y > 0 ? ac : (2 * Math.PI - ac);
      //var as = Math.asin(y / h);
      //var deg = angle * 180 / Math.PI + 90;
      var deg = 90 - angle * 180 / Math.PI;
      deg %= 360;
      if (deg < 0) { deg += 360; }
      var izoom = Math.round(Math.min(this.numZoomLevels, Math.max(0, zoom)));
      //console.log('drag', parseInt(deg), izoom, zoom, hPx);
      var pov = this.gsvObject.getPov();
      this.gsvObject.setPov({ heading: deg, zoom: izoom, pitch: pov.pitch });
      //this.gsvObject.setPOV({ heading: deg, zoom: izoom });
    }
  },


  onDragEnd: function(f) {
    this.dragging = false;
    if (f && f.attributes.type === 'position') {
      this.updateGsvLocation(new OpenLayers.LonLat(f.geometry.x, f.geometry.y));
      if (this.gsvOverlayActive) {
        this.mapWidget.map.baseLayer.setZIndex(this.layerZIndex);
        this.mapWidget.map.baseLayer.mapObject.removeOverlay(this.gsvOverlay);
        this.gsvOverlayActive = false;
      }
    } else if (f.attributes.type === 'direction') {
      this.updateDirectionFeature();
    }
  },

  gsvMove: function() {
    // when the user moves through GSV
    var point = this.gsvObject.getPosition();
    //console.log('gsvMove', this, point);
    if (!point) {
      return;
    }
    dojo.style(this.noViewNode, 'display', 'none');
    this.positionFeature.attributes.name = "Vue 3D"/* - " + loc.description*/ + "<br/>"
      + "<small>Cliquer et déplacer pour changer d'endroit...</small>";
    if (this.dragging) {
      this.layer.optWidget.createContextMover(this.positionFeature);
      return;
    }
    var lonLat = new OpenLayers.LonLat(point.lng(), point.lat());
    lonLat.transform(this.wgs84, this.mapWidget.map.getProjectionObject());
    this.positionFeature.move(lonLat);
    this.mapWidget.map.panTo(lonLat);
    this.updateDirectionFeature();
  },

  gsvPovChange: function() {
    //console.log('gsvPovChange', this, arguments);
    var pov = this.gsvObject.getPov();
    if (!pov.heading || Math.abs(pov.heading - this.heading) > 1) {
      this.gsvHeadingChange(pov.heading);
    }
    if (pov.zoom !== this.zoom) {
      this.gsvZoomChange(pov.zoom);
    }
  },

  gsvHeadingChange: function(heading) {
    //console.log('gsvHeadingChange', arguments);
    if (!this.symbolizers) {
      // explore styleMap and grab refs to symbolizer objects,
      // for quick update of rotation property
      this.symbolizers = [];
      geonef.jig.forEach(this.layer.styleMap.styles,
          function(style) {
            style.rules.forEach(
                function(rule) {
                  if (rule.symbolizer.Point) {
                    this.symbolizers.push(rule.symbolizer.Point);
                  }
                }, this);
          }, this);
    }
    this.symbolizers.forEach(function(symb) { symb.rotation = heading; });
    this.positionFeature.layer.drawFeature(this.positionFeature);
    this.heading = heading;
    this.updateDirectionFeature();
  },

  gsvZoomChange: function(zoom) {
    //console.log('gsvZoomChange', this, arguments);
    this.zoom = zoom;
    this.updateDirectionFeature();
  },

  updateDirectionFeature: function() {
    this.directionFeature.attributes.name = "Direction observée - "
      + Math.round(this.heading)+"° zoom "
      + (Math.round(this.zoom*10)/10)+"<br/>"
      + "<small>Cliquer et déplacer pour tourner et zoomer...</small>";
    if (this.dragging) {
      //this.layer.optWidget.createContextMover(this.directionFeature);
      return;
    }
    var pt = this.positionFeature.geometry;
    var distancePx = this.directionFeatureDistanceMin +
      (this.directionFeatureDistanceMax - this.directionFeatureDistanceMin)
      * this.zoom / this.numZoomLevels;
    var distance = distancePx * this.mapWidget.map.getResolution();
    //console.log('update distance', distance, distancePx, this.zoom);
    var lonLat = new OpenLayers.LonLat(
      pt.x + Math.cos((90 - this.heading) * Math.PI * 2 / 360) * distance,
      pt.y + Math.sin((90 - this.heading) * Math.PI * 2 / 360) * distance);
    this.directionFeature.move(lonLat);
  },

  gsvError: function(errorCode) {
    switch(errorCode) {
    case 603:
      alert("Il manque le plugin flash à ce navigateur.\n\nLa vue 3D ne peut s'afficher.");
      return;
    case 600:
      dojo.style(this.noViewNode, 'display', '');
      dojo.publish('jig/workspace/flash', ['Pas de vue de rues pour cet emplacement !']);
      return;
    }
  },

  updateGsvLocation: function(lonlat) {
    // update GSV location to lonlat, or map center if null
    if (!lonlat.lon || !lonlat.lat) {
      lonlat = this.mapWidget.map.getCenter();
    }
    lonlat.transform(this.mapWidget.map.getProjectionObject(), this.wgs84);

    //console.log('set loc', this, lonlat, loc);
    this.gsvObject.setPosition(new google.maps.LatLng(lonlat.lat, lonlat.lon));
    //this.gsvObject.setLocationAndPOV(/*loc*/ new google.maps.LatLng(lonlat.lat, lonlat.lon));
  },

  resize: function() {
    //console.log('resize', this, arguments);
    this.inherited(arguments);
    if (this.gsvObject) {
      dojo.query('object', this.domNode).style({ width: '100%', height: '100%' });
      google.maps.event.trigger(this.gsvObject, 'resize');
      //this.gsvObject.checkResize();
    }
  },

  onMapZoomChange: function() {
    this.updateDirectionFeature();
  },

  onLayerVisibilityChange: function(event) {
    //console.log('onLayerVisibilityChange', this, arguments);
    //this.layer.getVisibility()
  },

  setVisibility: function(state) {
    if (state) {
      this.enable();
    } else {
      this.disable();
    }
  },

  enable: function() {
    //console.log('enable', this);
    //this.data.enabled = true;
  },

  disable: function() {
    //this.data.enabled = false;
  },

  testPanoramas: {
    pano1: {
      title: 'Carrière Hospice - Panorama 1',
      position: [2.35055995966558, 48.80932367370656],
      heading: 0,
      links: [
        { heading: 120, description: "Vers l'injection", pano: 'pano2' },
        { heading: 330, description: "Vers l'entrée", pano: 'pano3' }
      ]
    },
    pano2: {
      title: 'Carrière Hospice - Panorama 2 (longue pose)',
      position: [2.350644449249506, 48.809270681246986],
      heading: 270,
      links: [
        { heading: 315, description: "Pano longue pose", pano: 'pano1' }
      ]
    },
    pano3: {
      title: 'Carrière Hospice - Panorama 3',
      position: [2.350484857813151, 48.80941729358103],
      heading: 135,
      links: [
        { heading: 135, description: "Pano longue pose", pano: 'pano1' },
        { heading: 270, description: "Vers l'escalier d'accès", pano: 'pano4' }
      ]
    },
    pano4: {
      title: 'Carrière Hospice - Panorama 4',
      position: [2.3504030504382243, 48.80947381870344],
      heading: 45,
      links: [
        { heading: 135, description: "Vers la longue pose", pano: 'pano3' },
        { heading: 315, description: "Vers l'escalier d'accès", pano: 'pano5' }
      ]
    },
    pano5: {
      title: "Carrière Hospice - Panorama 5",
      position: [2.350141535059807, 48.80959570078181],
      heading: 100,
      links: [
        { heading: 110, description: "Vers la longue pose", pano: 'pano4' },
        { heading: 310, description: "Escalier d\'accès", pano: 'pano6' }
      ]
    },
    pano6: {
      title: "Carrière Hospice - En bas de l'escalier",
      position: [2.3496600785403956, 48.809495015610366],
      heading: 10,
      links: [
        { heading: 135, description: "L'autre salle", pano: 'pano5' },
        { heading: 10, description: "Sortir", pano: 'pano7' }
      ]
    },
    pano7: {
      title: "Carrière Hospice - Devant l'entrée",
      position: [2.349690923944067, 48.809718465767304],
      heading: 190,
      links: [
        { heading: 190, description: "Descendre...", pano: 'pano6' },
        //{ heading: 315, description: "Rue Séverine", pano: '_entry_' }
      ]
    }
  },

  getPanorama: function(pano,zoom,tileX,tileY) {
    //console.log('getCustomPanorama', this, arguments);
    if (!this.testPanoramas[pano]) {
      return null;
    }
    var def = this.testPanoramas[pano];
    var links = (def.links || []).map(
      function(o) {
        return dojo.mixin({roadColor: '#a02020'}, o);
      }, this);
    var latLng = def.position ?
      new google.maps.LatLng(def.position[1], def.position[0]) : null;
    return {
      location: {
        pano: pano,
        description: def.title,
        latLng: latLng
      },
      copyright: '(c) 2011, Communauté Catapatate',
      tiles: {
          tileSize: new google.maps.Size(256, 256),
          worldSize: new google.maps.Size(16384, 8192),
          centerHeading: def.heading || 0,
          getTileUrl: function(pano,zoom,tileX,tileY) {
            //console.log('getTestPanoramaTileUrl', arguments);
            return '/images/test/'+pano+'/tile-'+zoom+'-'+tileX+'-'+tileY+'.jpg';
          }
      },
      links: links
    };
  },

  onLinksChanged: function() {
    //console.log('onLinksChanged', this, arguments);
    if (this.entryPanoId) {
      var links = this.gsvObject.getLinks();
      var panoId = this.gsvObject.getPano();
      switch(panoId) {
      case this.entryPanoId:
        links.push(
          { 'heading': 90, 'description' : "Entrée de la carrière Hospice", 'pano' : 'pano7' });
        break;
      case 'pano7':
        links.push(
          { heading: 315, description: "Rue Séverine", 'pano' : this.entryPanoId });
        break;
      default:
        return;
      }
    }
  },

  initCustom: function() {
    var client = new google.maps.StreetViewService();
    var entryPoint = new google.maps.LatLng(48.809655, 2.349668);
    client.getPanoramaByLocation(entryPoint, 50, dojo.hitch(this,
      function(result, status) {
        if (status == google.maps.StreetViewStatus.OK) {
          this.entryPanoId = result.location.pano;
        }
      }));
    google.maps.event.addListener(this.gsvObject, 'links_changed',
                                  dojo.hitch(this, 'onLinksChanged'));
  },

  catas: function() {
    this.gsvObject.setPano(this.entryPanoId);
    var self = this;
    window.setTimeout(
      function() { self.mapWidget.map.zoomTo(19); }, 50);
  }


});

