function funcWithUserNameInItsData (func, target, evnt) {
  var d;
  if (!target) {
    return;
  }
  d = target.get('data');
  if (!(d && d.username)) {
    return;
  }
  ALLEX.lib.qlib.promise2console(func([d.username]), 'rwc action');
  if (target.$element) {
    target.$element.fadeOut(200, target.destroy.bind(target));
    return;
  }
  target.destroy();
}

function createRWCWidgetIntegrator (lib, applib) {
  'use strict';

  function integrateRWCAction (pp, itfname, rlm, actionname, cfg) {
    var eventname = lib.capitalize(actionname, true),
      handler,
      references,
      mycfg;
    mycfg = lib.isVal(cfg) ? cfg[actionname] : null;
    handler = (mycfg && lib.isFunction(mycfg.handler)) ? mycfg.handler : null;
    references = (mycfg && handler && mycfg.references) ? (mycfg.references+',') : '';
    return {
      triggers: pp+'.'+itfname+'!needTo'+eventname,
      references: references+'.>'+actionname+'RelationOn'+rlm,
      handler: handler ? handler : funcWithUserNameInItsData
    };
  }

  var BasicModifier = applib.BasicModifier;

  function reverseArray (arry) {
    var ret = [], i;
    if (!lib.isArray(arry)) {
      return arry;
    }
    for (i=arry.length-1; i>=0; i--) {
      ret.push(arry[i]);
    }
    return ret;
  }

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
        gif([]);
      }
    },{
      triggers: pp+'.'+itfname+'!needMatches',
      references: '.>getMatchesOn'+rlm,
      handler: function (gmf) {
        gmf([]);
      }
    },{
      triggers: '.>getCandidatesOn'+rlm,
      references: pp+'.'+itfname,
      handler: function (itf, gcf) {
        if (gcf.running) {
          return;
        }
        console.log('candidatesOn'+rlm, gcf.result);
        itf.set('candidates', reverseArray(gcf.result));
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
        console.log('likesOn'+rlm, glf.result);
        itf.set('likes', reverseArray(glf.result));
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
        itf.set('matches', reverseArray(glf.result));
        if (glf.error) {
          itf.set('matches_error', glf.error);
        }
      }
    },
    integrateRWCAction(pp, itfname, rlm, 'initiate', this.config.customhandlers),
    integrateRWCAction(pp, itfname, rlm, 'block', this.config.customhandlers),
    integrateRWCAction(pp, itfname, rlm, 'accept', this.config.customhandlers),
    integrateRWCAction(pp, itfname, rlm, 'reject', this.config.customhandlers)
    );
    /*
      logic.push({
        triggers: pp+'.'+itfname+'!needToInitiate',
        references: '.>initiateRelationOn'+rlm,
        handler: funcWithUserNameInItsData
      },{
        triggers: pp+'.'+itfname+'!needToBlock',
        references: '.>blockRelationOn'+rlm,
        handler: funcWithUserNameInItsData
      },{
        triggers: pp+'.'+itfname+'!needToAccept',
        references: '.>acceptRelationOn'+rlm,
        handler: funcWithUserNameInItsData
      },{
        triggers: pp+'.'+itfname+'!needToReject',
        references: '.>rejectRelationOn'+rlm,
        handler: funcWithUserNameInItsData
      });
    */
  };
  RWCWidgetIntegratorModifier.prototype.DEFAULT_CONFIG = function () {
    return {};
  };

  applib.registerModifier('RWCWidgetIntegrator', RWCWidgetIntegratorModifier);
}
module.exports = createRWCWidgetIntegrator;
