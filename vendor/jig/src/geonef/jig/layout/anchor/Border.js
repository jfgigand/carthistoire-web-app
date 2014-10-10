dojo.provide('geonef.jig.layout.anchor.Border');

dojo.require('dijit._Widget');
dojo.require('geonef.jig.layout.BorderContainer');

dojo.declare('geonef.jig.layout.anchor.Border', dijit._Widget,
{

  // designate which border
  // one among: ['left','right','top','bottom']
  border: null,

  // buffer in pixels
  buffer: 15,

  buildRendering: function() {
    this.inherited(arguments);
    this.domNode.innerHTML = 'ANCHOR';
    dojo.style(this.domNode, {
		 backgroundColor: '#ff0',
		 border: '1px solid #f00',
		 padding: '10px',
		 zIndex: 300000,
		 position: 'absolute',
		 width: '30px',
		 height: '30px'
		 /*top: '0',
		  left: '0',*/
	       });
    this.installBorder();
  },

  installBorder: function() {
    //var b = 10, // buffer (in px) to avoid conflicts between widgets
    this.box = dojo.coords(this.widget.domNode);
    var dim = 60,
    style = {};
    style[this.border] = 0;
    if (this.border === 'top') {
      this.x = this.box.x + (this.box.w / 2);
      this.y = this.box.y + this.buffer;
      style.left = '' + this.x - (dim / 2) + 'px';
      this.domNode.innerHTML = 'BORDER T';
    } else if (this.border === 'right') {
      this.x = this.box.x + this.box.w - this.buffer;
      this.y = this.box.y + (this.box.h / 2);
      style.top = '' + this.y - (dim / 2) + 'px';
      this.domNode.innerHTML = 'BORDER R';
    } else if (this.border === 'bottom') {
      this.x = this.box.x + (this.box.w / 2);
      this.y = this.box.y + this.box.h - this.buffer;
      style.left = '' + this.x - (dim / 2) + 'px';
      this.domNode.innerHTML = 'BORDER B';
    } else if (this.border === 'left') {
      this.x = this.box.x + this.buffer;
      this.y = this.box.y + (this.box.h / 2);
      style.top = '' + this.y - (dim / 2) + 'px';
      this.domNode.innerHTML = 'BORDER L';
    }
    this.domNode.innerHTML = '';
    dojo.style(this.domNode, style);
    dojo.place(this.domNode, this.widget.domNode);
  },

  _setHighlightedAttr: function(state) {
    this.highlighted = state;
    dojo.addClass(this.domNode, state ? 'highlighted' : 'notHighlighted');
    dojo.removeClass(this.domNode, !state ? 'highlighted' : 'notHighlighted');
    dojo.style(this.domNode, 'backgroundColor', state ? '#f00' : '#ff0');
  },

  /**
   * Accept: given widget is anchored through this class
   *
   * @param {dijit._Widget} the widget to anchor
   * @param {number} size_ optional new widget size once anchored
   */
  accept: function(widget, size_) {
    /*console.log('accept border ', this, ' (', this.border, '!!!!',
		widget, '!!! IN !!', this.widget);*/
    var getParent = function(w) {
      return w.getParent ? w.getParent() :
        dijit._Contained.prototype.getParent.call(w);
    };
    var parent = getParent(this.widget);
    var wParent = getParent(widget);
    parent.smartResize = false;
    if (wParent === parent) {
      //console.log('accept: same parent');
      var children = parent.getChildren(),
      child1 = children[0],
      child2 = children[1];
      parent.removeChild(child2, true);
      parent.removeChild(child1, true);
      parent.design = this.border === 'left' || this.border === 'right' ?
	'sidebar' : 'headline';
      parent.addChild(child2);
      parent.addChild(child1);
    } else {
      //console.log('different parents');
      var container = new geonef.jig.layout.BorderContainer(
	{ design: this.border === 'left' || this.border === 'right' ?
	  'sidebar' : 'headline' });
      if (size_) {
        container.paneSize = size_;
      }
      parent.replaceChild(this.widget, container);
      //console.log('wParent', wParent);
      //console.log('container', container);
      if (wParent && wParent.removeChild) {
	wParent.removeChild(widget);
      } else if (widget.domNode.parentNode) {
	widget.domNode.parentNode.removeChild(widget.domNode);
      } else {
        //console.log('no detach, widget was orphean');
      }
      widget._floatAnchor = undefined;
      if (this.border === 'left' || this.border === 'top') {
	container.addChild(widget);
	container.addChild(this.widget);
      } else {
	container.addChild(this.widget);
	container.addChild(widget);
      }
      container.startup();
    }
    //parent.smartResize = false;
    parent.resize();
    //parent.smartResize = true;
  }

});
