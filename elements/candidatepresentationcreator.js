function createCandidatePresentationElement (lib, applib, templateslib, htmltemplateslib, hammerlib) {
  'use strict';

  var FromDataCreator = applib.getElementType('FromDataCreator'),
    DataAwareElement = applib.getElementType('DataAwareElement'),
    o = templateslib.override,
    m = htmltemplateslib,
    HammerableMixin = hammerlib.mixins.HammerableMixin;


  function createDataMarkup (options){
    return o(m.div,
      'CLASS', 'candidate-container',
      'CONTENTS', [
        o(m.div,
          'CLASS', 'candidate',
          'CONTENTS', [
            o(m.span,
              'CONTENTS', '{{item.nick || item.username}}'
            ),
            o(m.div,
              'CLASS', 'deck-profile-image',
              'CONTENTS', '<img src="{{this.makeCandidatePicture(item.picture)}}" />'
            )
          ]
        )
      ]
    );
  }


  function CandidatePresentationElement (id, options) {
    console.log('new CandidatePresentationElement', options);
    if (!lib.isString(options.acceptEventName)) {
      throw new Error ('options for '+this.constructor.name+' have to have "acceptEventName" property');
    }
    if (!lib.isString(options.rejectEventName)) {
      throw new Error ('options for '+this.constructor.name+' have to have "rejectEventName" property');
    }
    options.data_markup = options.data_markup || createDataMarkup(options.data_markup_options);
    DataAwareElement.call(this, id, options);
    HammerableMixin.call(this, options);
  }
  lib.inherit(CandidatePresentationElement, DataAwareElement);
  HammerableMixin.addMethods(CandidatePresentationElement, DataAwareElement);
  CandidatePresentationElement.prototype.__cleanUp = function () {
    HammerableMixin.prototype.destroy.call(this);
    DataAwareElement.prototype.__cleanUp.call(this);
  };
  CandidatePresentationElement.prototype.makeCandidatePicture = function (pic, size, imgcode) {
    var ret;
    if (!lib.isString(pic)) {
      return '';
    }
    ret = this.getConfigVal('cdnurl');
    if (!lib.isString(ret)) {
      return '';
    }
    if(ret[ret.length-1]!=='/'){
      ret+='/';
    }
    return ret+pic+(size ? '-'+size : '');
  };
  CandidatePresentationElement.prototype.resetHammerPosition = function () {
    if (this.hammerPos) {
      this.$element.css({opacity: 1});
      //this.$element.css({transform: 'rotate(0deg)'});
      this.$element.offset(this.hammerPos);
    } else {
      console.warn('no hammerPos?');
    }
  };
  CandidatePresentationElement.prototype.onHammerPan = function (hevnt) {
    HammerableMixin.prototype.onHammerPan.call(this, hevnt);
    this.$element.css({opacity: 1-(hevnt.distance/200)});
    //this.$element.css({transform: 'rotate('+(Math.sign(hevnt.deltaX)*hevnt.distance/15)+'deg)'});
  };
  CandidatePresentationElement.prototype.onHammerSwipe = function (hevnt) {
    var curpos;
    if (!this.lastKnownHammerPos) {
      return;
    }
    if (this.isDistanceWeak(hevnt)) {
      return;
    }
    curpos = this.$element.offset();
    if (this.lastKnownHammerPos.left>curpos.left) {
      this.onHammerSwipeLeft();
      return;
    }
    this.onHammerSwipeRight();
  };
  CandidatePresentationElement.prototype.onHammerSwipeLeft = function () {
    console.log('reject!');
    //this.__parent.__parent.needToReject.fire(this.data.username);
    this.__parent.__parent[this.getConfigVal('rejectEventName')].fire(this.data.username);
    this.destroy();
  };
  CandidatePresentationElement.prototype.onHammerSwipeRight = function () {
    console.log('candi-date!');
    //this.__parent.__parent.needToInitiate.fire(this.data.username);
    this.__parent.__parent[this.getConfigVal('acceptEventName')].fire(this.data.username);
    this.destroy();
  };

  applib.registerElementType('CandidatePresentationElement', CandidatePresentationElement);

}
module.exports = createCandidatePresentationElement;
