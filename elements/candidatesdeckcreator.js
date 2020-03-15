function createCandidatesDeckCreatorElement (lib, applib, templateslib, htmltemplateslib, hammerlib) {
  'use strict';

  var RWCDeckBase = applib.getElementType('RWCDeckBase');

  function CandidatesDeck (id, options) {
    if (!lib.isString(options.acceptEventName)) {
      throw new Error ('options for '+this.constructor.name+' have to have the "acceptEventName" property');
    }
    if (!lib.isString(options.rejectEventName)) {
      throw new Error ('options for '+this.constructor.name+' have to have the "rejectEventName" property');
    }
    RWCDeckBase.call(this, id, options);
  }
  lib.inherit(CandidatesDeck, RWCDeckBase);
  CandidatesDeck.prototype.createDescriptorFromArryItem = function (item) {
    var ret = RWCDeckBase.prototype.createDescriptorFromArryItem.call(this, item);
    ret.options.acceptEventName = this.getConfigVal('acceptEventName');
    ret.options.rejectEventName = this.getConfigVal('rejectEventName');
    return ret;
  };
  CandidatesDeck.prototype.presentationElementType = 'CandidatePresentationElement';
  CandidatesDeck.prototype.subElementIdPrefix = 'candidate_';
  applib.registerElementType('CandidatesDeck', CandidatesDeck);
}

module.exports = createCandidatesDeckCreatorElement;
