function createRWCDeckBaseCreatorElement (lib, applib, templateslib, htmltemplateslib, hammerlib) {
  'use strict';

  var FromDataCreator = applib.getElementType('FromDataCreator'),
    DataAwareElement = applib.getElementType('DataAwareElement'),
    o = templateslib.override,
    m = htmltemplateslib,
    HammerableMixin = hammerlib.mixins.HammerableMixin;

  function RWCDeckBase (id, options) {
    FromDataCreator.call(this, id, options);
  }
  lib.inherit(RWCDeckBase, FromDataCreator);
  RWCDeckBase.prototype.createDescriptorFromArryItem = function (item) {
    return {
      type: this.getConfigVal('presentation_type') || this.presentationElementType,
      name: (this.getConfigVal('presentation_name_prefix')||'')+'candidate_'+item.username,
      options: lib.extend({}, this.getConfigVal('presentation'), {
        actual: true,
        cdnurl: this.getConfigVal('cdnurl')
      })
    };
  };
  applib.registerElementType('RWCDeckBase', RWCDeckBase);
}

module.exports = createRWCDeckBaseCreatorElement;
