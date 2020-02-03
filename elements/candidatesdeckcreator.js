function createCandidatesDeckCreatorElement (lib, applib, templateslib, htmltemplateslib, hammerlib) {
  'use strict';

  var FromDataCreator = applib.getElementType('FromDataCreator'),
    DataAwareElement = applib.getElementType('DataAwareElement'),
    o = templateslib.override,
    m = htmltemplateslib,
    HammerableMixin = hammerlib.mixins.HammerableMixin;

  function CandidatesDeck (id, options) {
    if (!lib.isString(options.acceptEventName)) {
      throw new Error ('options for '+this.constructor.name+' have to have "acceptEventName" property');
    }
    if (!lib.isString(options.rejectEventName)) {
      throw new Error ('options for '+this.constructor.name+' have to have "rejectEventName" property');
    }
    FromDataCreator.call(this, id, options);
  }
  lib.inherit(CandidatesDeck, FromDataCreator);
  CandidatesDeck.prototype.createDescriptorFromArryItem = function (item) {
    return {
      type: this.getConfigVal('presentation_type') || 'CandidatePresentationElement',
      name: 'candidate_'+item.username,
      options: lib.extend(this.getConfigVal('presentation'), {
        actual: true,
        cdnurl: this.getConfigVal('cdnurl'),
        acceptEventName: this.getConfigVal('acceptEventName'),
        rejectEventName: this.getConfigVal('rejectEventName')
      })
    };
  };
  applib.registerElementType('CandidatesDeck', CandidatesDeck);
}

module.exports = createCandidatesDeckCreatorElement;
