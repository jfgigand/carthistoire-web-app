
dojo.provide('geonef.ploomap.list.edition.MapCategory');

// parent
dojo.require('geonef.jig.list.edition.AutoProperties');

dojo.declare('geonef.ploomap.list.edition.MapCategory',
             geonef.jig.list.edition.AutoProperties,
{
  // summary:
  //   Map set edition
  //

  saveNoticeChannel: 'ploomap/mapCategory/save',

  apiModule: 'listQuery.mapCategory',

  propertyTypes: {
    published: { 'class': 'geonef.jig.input.BooleanCheckBox' }
  },

  getPropertiesOrder: function() {
    return ['title', 'published'];
  },

  _getTitleAttr: function() {
    var value = this.origValue; // this.attr('value');
    return value && value.title ?
      'Catégorie : ' + value.title :
      'Catégorie sans nom';
  }

});
