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
      itfname = this.config.rwcwidgetname || 'RWCInterface',
      rlm = this.config.rwcrealm;

    logic.push({
      triggers: pp+'.'+itfname+'!needCandidates',
      references: '.>getCandidatesOn'+rlm,
      handler: function (gcf) {
        gcf([{}]);
      }
    },{
      triggers: pp+'.'+itfname+'!needLikes',
      references: '.>getInitiatorsOn'+rlm,
      handler: function (gif) {
        gif([{}]);
      }
    },{
      triggers: pp+'.'+itfname+'!needMatches',
      references: '.>getMatchesOn'+rlm,
      handler: function (gmf) {
        gmf([{}]);
      }
    },{
      triggers: pp+'.'+itfname+'!needToInitiate',
      references: '.>initiateRelationOn'+rlm,
      handler: funcWithTargetName
    },{
      triggers: pp+'.'+itfname+'!needToBlock',
      references: '.>blockRelationOn'+rlm,
      handler: funcWithTargetName
    },{
      triggers: pp+'.'+itfname+'!needToAccept',
      references: '.>acceptRelationOn'+rlm,
      handler: funcWithTargetName
    },{
      triggers: pp+'.'+itfname+'!needToReject',
      references: '.>rejectRelationOn'+rlm,
      handler: funcWithTargetName
    },{
      triggers: '.>getCandidatesOn'+rlm,
      references: pp+'.'+itfname,
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
      references: pp+'.'+itfname,
      handler: function (itf, glf) {
        if (glf.running) {
          return;
        }
        itf.set('likes', glf.result);
        if (glf.error) {
          itf.set('likes_error', glf.error);
        }
      }
    },{
      triggers: '.>getMatchesOn'+rlm,
      references: pp+'.'+itfname,
      handler: function (itf, glf) {
        if (glf.running) {
          return;
        }
        itf.set('matches', glf.result);
        if (glf.error) {
          itf.set('matches_error', glf.error);
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
