function createMatchPresentationElement (lib, applib, templateslib, htmltemplateslib, hammerlib) {
  'use strict';

  var FromDataCreator = applib.getElementType('FromDataCreator'),
    DataAwareElement = applib.getElementType('DataAwareElement'),
    o = templateslib.override,
    m = htmltemplateslib;


  function createDataMarkup (options){
    return o(m.div,
      'CLASS', 'match-container',
      'CONTENTS', [
        o(m.div,
          'CLASS', 'match',
          'CONTENTS', [
            o(m.span,
              'CONTENTS', '{{item.nick || item.username}}'
            ),
            o(m.div,
              'CLASS', 'deck-profile-image',
              'CONTENTS', '<img src="{{this.makeMatchPicture(item.picture)}}" />'
            )
          ]
        )
      ]
    );
  }


  function MatchPresentationElement (id, options) {
    if (!lib.isString(options.openEventName)) {
      throw new Error ('options for '+this.constructor.name+' have to have "openEventName" property');
    }
    if (!lib.isString(options.dropEventName)) {
      throw new Error ('options for '+this.constructor.name+' have to have "dropEventName" property');
    }
    if (!('data_markup' in options)) {
      options.data_markup = createDataMarkup(options.data_markup_options);
    }
    DataAwareElement.call(this, id, options);
  }
  lib.inherit(MatchPresentationElement, DataAwareElement);
  MatchPresentationElement.prototype.__cleanUp = function () {
    DataAwareElement.prototype.__cleanUp.call(this);
  };
  MatchPresentationElement.prototype.set_actual = function (act) {
    return DataAwareElement.prototype.set_actual.call(this, act);
  };
  MatchPresentationElement.prototype.makeMatchPicture = function (pic, size, imgcode) {
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

  applib.registerElementType('MatchPresentationElement', MatchPresentationElement);

}
module.exports = createMatchPresentationElement;
