
dojo.provide('package.admin');

// third-party
dojo.require('package.proj4js');
dojo.require('package.openlayers');

// UI
dojo.require('geonef.jig.layout.RootPane');
dojo.require('geonef.jig.layout.BorderContainer');
dojo.require('geonef.jig.layout.TabContainer');
dojo.require('geonef.ploomap.map.Classical');
dojo.require('cartapatate.admin.Library');

// Admin tools
dojo.require('geonef.ploomap.list.OgrDataSource');
dojo.require('geonef.ploomap.list.OgrLayer');
dojo.require('geonef.ploomap.list.MapCategory');
dojo.require('geonef.ploomap.list.MapCollection');
dojo.require('geonef.ploomap.list.Map');
dojo.require('geonef.ploomap.list.ColorFamily');
dojo.require('geonef.jig.list.File');

// Document modules
dojo.require('geonef.ploomap.list.edition.map.Stock');
dojo.require('geonef.ploomap.list.edition.map.Ratio');
dojo.require('geonef.ploomap.list.edition.map.StockRatio');
dojo.require('geonef.ploomap.list.edition.map.RatioDisc');
dojo.require('geonef.ploomap.list.edition.map.RatioGrid');
dojo.require('geonef.ploomap.list.edition.map.Cartogram');
dojo.require('geonef.ploomap.list.edition.map.LayerList');
dojo.require('geonef.ploomap.list.edition.map.layer.OgrVector');
dojo.require('geonef.ploomap.list.edition.map.layer.Mark');
dojo.require('geonef.ploomap.list.edition.mapCollection.MultiRepr');
dojo.require('geonef.ploomap.list.edition.mapCollection.SingleRepr');
dojo.require('geonef.ploomap.list.edition.mapCollection.FreeCollection');
dojo.require('geonef.ploomap.list.edition.ogrDataSource.Generic');
dojo.require('geonef.ploomap.list.edition.ogrDataSource.PostgreSql');
dojo.require('geonef.ploomap.list.edition.ogrDataSource.File');

// input types
dojo.require('geonef.jig.input.Color');
dojo.require('geonef.jig.input.ListString');
dojo.require('geonef.ploomap.input.MsMapExtent');
dojo.require('geonef.ploomap.input.MsGeometryType');
dojo.require('geonef.ploomap.input.MsStyle');
dojo.require('geonef.ploomap.input.document.OgrLayer');
dojo.require('geonef.ploomap.input.OgrLayerField');
dojo.require('dijit.form.SimpleTextarea');

