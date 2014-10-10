dojo.provide('cartapatate.admin.Library');

dojo.require('geonef.jig.tool.Library');

dojo.declare('cartapatate.admin.Library', geonef.jig.tool.Library,
{
  name: 'Administration',
  title: 'Administration',
  widgetListPath: 'workspaceData.settings.adminWidgets',
  cssClass: 'cartapatateAdminLibrary'
});
