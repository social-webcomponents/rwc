function funcWithTargetName (func, targetname) {
  func([targetname]);
}

function createRWCWidgetIntegrator (lib, applib) {
  'use strict';

  var BasicModifier = applib.BasicModifier;

  function RWCWidgetIntegratorModifier (options) {
    if (! ('rwcrealm' in options)) {
      throw new Error('options for '+this.constructor.name+' must have a "rwcrealm" property');
    }
    if (!('rwcwidgetparentpath' in options)) {
      throw new Error('options for '+this.constructor.name+' must have a "rwcwidgetparentpath" property');
    }
    BasicModifier.call(this, options);
  }
  lib.inherit(RWCWidgetIntegratorModifier, BasicModifier);

  RWCWidgetIntegratorModifier.prototype.doProcess = function(name, options, links, logic, resources){
    var pp = this.config.rwcwidgetparentpath,
      rlm = this.config.rwcrealm;

    logic.push({
      triggers: pp+'.RWCInterface!needCandidates',
      references: '.>getCandidatesOn'+rlm,
      handler: function (gcf) {
        gcf([{}]);
      }
    },{
      triggers: pp+'.RWCInterface!needLikes',
      references: '.>getInitiatorsOn'+rlm,
      handler: function (gif) {
        gif([{}]);
      }
    },{
      triggers: pp+'.RWCInterface!needToInitiate',
      references: '.>initiateRelationOn'+rlm,
      handler: funcWithTargetName
    },{
      triggers: pp+'.RWCInterface!needToBlock',
      references: '.>blockRelationOn'+rlm,
      handler: funcWithTargetName
    },{
      triggers: pp+'.RWCInterface!needToAccept',
      references: '.>acceptRelationOn'+rlm,
      handler: funcWithTargetName
    },{
      triggers: pp+'.RWCInterface!needToReject',
      references: '.>rejectRelationOn'+rlm,
      handler: funcWithTargetName
    },{
      triggers: '.>getCandidatesOn'+rlm,
      references: pp+'.RWCInterface',
      handler: function (itf, gcf) {
        if (gcf.running) {
          return;
        }
        itf.set('candidates', gcf.result);
        if (gcf.error) {
          itf.set('candidates_error', gcf.error);
        }
      }
    },{
      triggers: '.>getInitiatorsOn'+rlm,
      references: pp+'.RWCInterface',
      handler: function (itf, glf) {
        if (glf.running) {
          return;
        }
        itf.set('likes', glf.result);
        if (glf.error) {
          itf.set('likes_error', glf.error);
        }
      }
    })
  };
  RWCWidgetIntegratorModifier.prototype.DEFAULT_CONFIG = function () {
    return {};
  };

  applib.registerModifier('RWCWidgetIntegrator', RWCWidgetIntegratorModifier);
}
module.exports = createRWCWidgetIntegrator;
