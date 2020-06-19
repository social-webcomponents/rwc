function createCandidatePresentationElement (lib, applib, templateslib, htmltemplateslib, rwcweblib) {
  'use strict';

  var FromDataCreator = applib.getElementType('FromDataCreator'),
    DataAwareElement = applib.getElementType('DataAwareElement'),
    o = templateslib.override,
    m = htmltemplateslib,
    SwipablePresentationMixin = rwcweblib.mixins.SwipablePresentation;


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
    if (!lib.isString(options.acceptEventName)) {
      throw new Error ('options for '+this.constructor.name+' have to have "acceptEventName" property');
    }
    if (!lib.isString(options.rejectEventName)) {
      throw new Error ('options for '+this.constructor.name+' have to have "rejectEventName" property');
    }
    options.data_markup = options.data_markup || createDataMarkup(options.data_markup_options);
    options.elements = options.elements || [];
    if (options.clickables) {
      options.elements.push(options.clickables.reject);
      options.elements.push(options.clickables.accept);
    }
    DataAwareElement.call(this, id, options);
    //SwipablePresentationMixin.call(this, options);
  }
  lib.inherit(CandidatePresentationElement, DataAwareElement);
  //SwipablePresentationMixin.addMethods(CandidatePresentationElement, DataAwareElement);
  CandidatePresentationElement.prototype.__cleanUp = function () {
    //SwipablePresentationMixin.prototype.destroy.call(this);
    DataAwareElement.prototype.__cleanUp.call(this);
  };
  CandidatePresentationElement.prototype.initiateCandidatePresentationElement = function () {
    var clickables = this.getConfigVal('clickables');
    if (!clickables) {
      return;
    }
    this.getElement(clickables.reject.name).clicked.attach(this.fireReject.bind(this));
    this.getElement(clickables.accept.name).clicked.attach(this.fireAccept.bind(this));
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
  CandidatePresentationElement.prototype.fireReject = function () {
    console.log('reject!');
    //this.__parent.__parent.needToReject.fire(this.data.username);
    this.__parent.__parent[this.getConfigVal('rejectEventName')].fire(this);
  };
  CandidatePresentationElement.prototype.fireAccept = function () {
    console.log('candi-date!');
    //this.__parent.__parent.needToInitiate.fire(this.data.username);
    this.__parent.__parent[this.getConfigVal('acceptEventName')].fire(this);
  };

  CandidatePresentationElement.prototype.postInitializationMethodNames = DataAwareElement.prototype.postInitializationMethodNames.concat('initiateCandidatePresentationElement');
  applib.registerElementType('CandidatePresentationElement', CandidatePresentationElement);

}
module.exports = createCandidatePresentationElement;
