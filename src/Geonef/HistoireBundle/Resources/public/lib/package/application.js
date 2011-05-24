
dojo.provide('package.application');

// third-party
//dojo.require('package.proj4js');
//dojo.require('package.openlayers');

// basic
dojo.require('geonef.jig.workspace');
dojo.require('geonef.ploomap.tool.layer.Simple');
dojo.require('geonef.ploomap.tool.layer.Select');

// initial cacoins
dojo.require('geonef.jig.layout.RootPane');
dojo.require('geonef.jig.layout.BorderContainer');
dojo.require('geonef.ploomap.map.Geoportal');
dojo.require('geonef.ploomap.tool.Layers');
dojo.require('geonef.histoire.info.About');
//dojo.require('geonef.ploomap.tool.OverviewMap');

// application-specific
dojo.require('geonef.histoire.layerDef.Application');
dojo.require('geonef.histoire.layerLibrary.Application');

// macros
dojo.require('geonef.jig.macro.Runner');
dojo.require('geonef.jig.macro.Player');
dojo.require('geonef.jig.macro.Editor');
dojo.require('geonef.jig.macro.action.MacroRunner');
dojo.require('geonef.jig.macro.action.MacroEditor');
dojo.require('geonef.jig.macro.action.TextRunner');
dojo.require('geonef.jig.macro.action.TextEditor');
dojo.require('geonef.jig.macro.action.TimeRunner');
dojo.require('geonef.jig.macro.action.TimeEditor');
dojo.require('geonef.jig.macro.action.ScriptRunner');
dojo.require('geonef.jig.macro.action.ScriptEditor');
dojo.require('geonef.ploomap.macro.action.LayerRunner');
dojo.require('geonef.ploomap.macro.action.LayerEditor');
dojo.require('geonef.ploomap.macro.action.MapRunner');
dojo.require('geonef.ploomap.macro.action.MapEditor');
dojo.require('geonef.ploomap.macro.action.RegionRunner');
dojo.require('geonef.ploomap.macro.action.RegionEditor');
dojo.require('geonef.ploomap.presentation.sexyZoomBar');
dojo.require('geonef.ploomap.presentation.layers');
dojo.require('geonef.ploomap.presentation.featureTimeRange');
dojo.require('geonef.ploomap.presentation.macroEditor');
dojo.require('geonef.ploomap.presentation.magnifier');
dojo.require('geonef.ploomap.presentation.measure');

// tools
// dojo.require('geonef.ploomap.tool.Export');
// dojo.require('geonef.ploomap.tool.Measure');
// dojo.require('geonef.ploomap.tool.StreetView');
// dojo.require('geonef.ploomap.tool.OverviewMap');
// dojo.require('geonef.ploomap.tool.Itineraries');
// dojo.require('geonef.jig.tool.UserFeedback');

// misc
// dojo.require('geonef.ploomap.OpenLayers.Control.ScaleLine');
// dojo.require('geonef.ploomap.OpenLayers.Control.TileLoadSpinner');

// Optional
//dojo.require('package.presentationView');
