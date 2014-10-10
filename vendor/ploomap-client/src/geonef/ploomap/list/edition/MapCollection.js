

dojo.provide('geonef.ploomap.list.edition.MapCollection');

// parent
dojo.require('geonef.jig.list.edition.AutoProperties');

/**
 * @class Base class for map collections
 * @abstract
 */
dojo.declare('geonef.ploomap.list.edition.MapCollection', geonef.jig.list.edition.AutoProperties,
{

  saveNoticeChannel: 'ploomap/mapCollection/save',

  apiModule: 'listQuery.mapCollection',

  checkProperties: false, //true,

  propertyTypes: {
    userNotes: { 'class': 'dijit.form.Textarea' }
  },

  getPropertiesOrder: function() {
    return ['title', 'userNotes'];
  },

  _getTitleAttr: function() {
    var value = this.origValue; // this.attr('value');
    return value && value.title ?
      'Collection : ' + value.title : 'Collection sans nom';
  }

});
