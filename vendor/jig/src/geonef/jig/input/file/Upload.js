dojo.provide("geonef.jig.input.file.Upload");

// parents
dojo.require("dijit._Widget");
dojo.require("dijit._Templated");

// used in template
dojo.require("dijit.form.Button");
dojo.require("dijit.ProgressBar");

// used in code
dojo.require('dojo.io.iframe');
dojo.require('geonef.jig.api');
dojo.require('dojox.uuid.generateRandomUuid');

dojo.declare("geonef.jig.input.file.Upload",
		[ dijit._Widget, dijit._Templated ],
{
  // summary:
  //    Input widget: GMail-like FileUpload
  //

  // dijit._Templated HTML template file
  templatePath: dojo.moduleUrl('geonef.jig.input.file', 'templates/Upload.html'),

  // Whether we have widgets (attr dojoType="...")
  widgetsInTemplate: true,

  // Name of server API module
  apiModule: 'file',

  // Name of server API module action
  apiAction: 'upload',

  // Optional parameters for API request
  apiParams: {},

  // name: string
  //    Name of this input as such
  name: 'file',

  // Name of file <input> element (randomly created if falsy)
  inputName: '',

  // File UUID
  uuid: null,

  postMixInProperties: function() {
    this.inherited(arguments);
    this.apiParams = dojo.mixin({}, this.apiParams);
  },

  destroy: function() {
    this._requestParams = null;
    this.inherited(arguments);
  },

  startup: function() {
    this.inherited(arguments);
    this.showUploadControl();
  },

  startSending: function() {
    this._requestParams = dojo.mixin({}, this.apiParams,
      { module: this.apiModule,
        action: this.apiAction,
        outputMethod: 'textarea',
        fileParam: this.fileInputNode.name });
    this.jsonInputNode.value = dojo.toJson(this._requestParams);
    //console.log('apiParams', this.apiParams, this);
    this.deferred = dojo.io.iframe.send(dojo.mixin(
      {
	url: geonef.jig.api.url,
	form: this.formNode,
	handleAs: 'json',
	handle: dojo.hitch(this, 'onUploadComplete'),
	error: dojo.hitch(this, 'onUploadTransportError')
      }, this.apiParams));
    //console.log('IO ret:', ret);
  },

  /**
   * Build <input type="file"> element
   */
  showUploadControl: function() {
    if (this.fileInputNode) { return; }
    dojo.style(this.uploadFormNode, 'display', '');
    var inputName = this.inputName || dojox.uuid.generateRandomUuid();
    this.fileInputNode = dojo.create('input',
      {
	type: 'file',
	name: inputName,
	onchange: dojo.hitch(this, 'onFileChosen')
      }, this.uploadCancelButton.domNode, 'before');
  },

  cleanUploadControl: function() {
    if (this.fileInputNode) {
      this.formNode.removeChild(this.fileInputNode);
      this.fileInputNode = null;
    }
  },

  _getValueAttr: function() {
    return this.uuid;
  },

  _setValueAttr: function() {
    throw new Error('widget value attr is readonly: ' + this.id);
  },

  /**
   * Event handlers
   *
   *****************************************************/

  /**
   * Hook: when the file has changed (after upload completes)
   */
  onChange: function() {
    console.log('onChange', this);
  },

  onUploadButtonClick: function() {
    //console.log('upload!', this);
    dojo.style(this.promptNode, 'display', 'none');
    this.showUploadControl();
  },

  onUploadCancelButtonClick: function() {
    //console.log('cancel!', this);
    this.cleanUploadControl();
    //dojo.style(this.promptNode, 'display', '');
    //dojo.style(this.uploadFormNode, 'display', 'none');
  },

  onFileChosen: function() {
    //console.log('onFileChosen', this, arguments);
    dojo.style(this.uploadFormNode, 'display', 'none');
    dojo.style(this.waitNode, 'display', '');
    this.startSending();
    this.cleanUploadControl();
  },

  onSendCancelButtonClick: function() {
    var p = dojo.io.iframe._frame.parentNode;
    p.removeChild(dojo.io.iframe._frame);
    p.appendChild(dojo.io.iframe._frame);
    this.deferred.cancel();
    this.deferred = null;
    dojo.style(this.waitNode, 'display', 'none');
    dojo.style(this.uploadFormNode, 'display', '');
  },

  onUploadComplete: function(data, xhr) {
    //console.log('onUploadComplete', data, xhr);
    if (data.status === 'exception') {
      geonef.jig.api.processException(this._requestParams, data);
      this.onUploadError(data.exception.message, data, xhr);
      return;
    }
    if (!data.error && !data.uuid) {
      data.error = 'noMedia';
    }
    if (data.error) {
      var msg = data.error; //this.getI18nMsg('errors.' + data.error.replace(':', '.'));
      this.onUploadError(msg, data, xhr);
      return;
    }
    this.uuid = data.uuid;
    //console.log('bef onChange', this, arguments);
    this.onChange();
  },

  onUploadError: function(msg, data, xhr) {
    console.error('onUploadError:', msg, data, xhr);
    alert(msg);
  },

  onUploadTransportError: function(data, xhr) {
    console.error('upload transport error', data, xhr);
    //alert('error');
    dojo.style(this.waitNode, 'display', 'none');
    return false;
  }

});
