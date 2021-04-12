function createCandidatePresentationElement (lib, applib, templateslib, htmltemplateslib, rwcweblib) {
  'use strict';

  var FromDataCreator = applib.getElementType('FromDataCreator'),
    DataAwareElement = applib.getElementType('DataAwareElement'),
    o = templateslib.override,
    m = htmltemplateslib,
    CandidatePresentationMixin = rwcweblib.mixins.CandidatePresentation,
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
    if (!('data_markup' in options)) {
      options.data_markup = createDataMarkup(options.data_markup_options);
    }
    CandidatePresentationMixin.call(this, options);
    DataAwareElement.call(this, id, options);
    //SwipablePresentationMixin.call(this, options);
  }
  lib.inherit(CandidatePresentationElement, DataAwareElement);
  CandidatePresentationMixin.addMethods(CandidatePresentationElement);
  //SwipablePresentationMixin.addMethods(CandidatePresentationElement, DataAwareElement);
  CandidatePresentationElement.prototype.__cleanUp = function () {
    //SwipablePresentationMixin.prototype.destroy.call(this);
    DataAwareElement.prototype.__cleanUp.call(this);
    CandidatePresentationMixin.prototype.destroy.call(this);
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

  applib.registerElementType('CandidatePresentationElement', CandidatePresentationElement);

}
module.exports = createCandidatePresentationElement;
