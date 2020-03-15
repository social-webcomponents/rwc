function createMatchesDeckCreatorElement (lib, applib, templateslib, htmltemplateslib, hammerlib) {
  'use strict';

  var RWCDeckBase = applib.getElementType('RWCDeckBase');

  function MatchesDeck (id, options) {
    if (!lib.isString(options.openEventName)) {
      throw new Error ('options for '+this.constructor.name+' have to have the "openEventName" property');
    }
    if (!lib.isString(options.dropEventName)) {
      throw new Error ('options for '+this.constructor.name+' have to have the "dropEventName" property');
    }
    RWCDeckBase.call(this, id, options);
  }
  lib.inherit(MatchesDeck, RWCDeckBase);
  MatchesDeck.prototype.createDescriptorFromArryItem = function (item) {
    var ret = RWCDeckBase.prototype.createDescriptorFromArryItem.call(this, item);
    ret.options.openEventName = this.getConfigVal('openEventName');
    ret.options.dropEventName = this.getConfigVal('dropEventName');
    return ret;
  };
  MatchesDeck.prototype.presentationElementType = 'MatchPresentationElement';
  MatchesDeck.prototype.subElementIdPrefix = 'match_';
  applib.registerElementType('MatchesDeck', MatchesDeck);
}

module.exports = createMatchesDeckCreatorElement;
