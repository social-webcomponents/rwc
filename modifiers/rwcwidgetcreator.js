function createRWCWidget (lib, applib, templateslib, htmltemplateslib) {
  'use strict';

  var o = templateslib.override,
    m = htmltemplateslib,
    p = templateslib.process,
    BasicModifier = applib.BasicModifier;


///////////////
//HELPERS

//////////////

  function RWCWidgetModifier(options){
    BasicModifier.call(this, options);
  }
  lib.inherit(RWCWidgetModifier, BasicModifier);
  RWCWidgetModifier.prototype.doProcess = function(name, options, links, logic, resources){
    this.config = this.config || {};
    this.config.widget = this.config.widget || {};
    this.config.links = this.config.links || {};
    this.config.types = this.config.types || {};
    var itfname = this.config.widget.name || 'RWCInterface';

    options.elements.push({
      name: itfname,
      type: 'RWCInterface',
      options: lib.extendWithConcat({}, {
        actual: true,
        self_selector: '.',
        default_markup: o(m.div),
        elements: this.rwcElements()
      }, this.config.widget.container),
      preprocessors: {
      },
      links: [
      ].concat(this.config.links.container || []),
      logic: [
        {
          triggers: '.CandidatesDeck:actual',
          references: '.!needCandidates',
          handler: function(needCandidates, actual){
            if (!!actual){
              needCandidates.emitter.fire();
            }
          }
        },
        {
          triggers: '.LikesDeck:actual',
          references: '.!needLikes',
          handler: function(needLikes, actual){
            if (!!actual){
              needLikes.emitter.fire();
            }
          }
        },
        {
          triggers: '.MatchesDeck:actual',
          references: '.!needMatches',
          handler: function(needMatches, actual){
            if (!!actual){
              needMatches.emitter.fire();
            }
          }
        }
      ]
    });
  };

  RWCWidgetModifier.prototype.rwcElements = function () {
    return [{
      name: 'CandidatesDeck',
      type: 'CandidatesDeck',
      options: this.deckWidgetOptions(this.config.widget || {}, 'candidates', {
        acceptEventName: 'needToInitiate', 
        rejectEventName: 'needToBlock'
      })
    },{
      name: 'LikesDeck',
      type: 'CandidatesDeck',
      options: this.deckWidgetOptions(this.config.widget || {}, 'likes', {
        acceptEventName: 'needToAccept', 
        rejectEventName: 'needToReject'
      })
    },{
      name: 'MatchesDeck',
      type: this.config.types.matches || 'MatchesDeck',
      options: this.deckWidgetOptions(this.config.widget || {}, 'matches', {
        openEventName: 'needToOpen', 
        dropEventName: 'needToDrop'
      })
    }];
  };
  RWCWidgetModifier.prototype.deckWidgetOptions = function(params, configname, events){
    if (!configname) {
      throw new Error('RWCWidgetModifier.prototype.deckWidgetOptions needs a configname');
    }
    params = params || {};
    params[configname] = params[configname] || {};
    params[configname].div = params[configname].div || {};
    return lib.extend({
      //actual: true,
      self_selector: '.',
      default_markup: o(m.div
        ,'CLASS', (params[configname].div.class || '')
        ,'ATTRS', params[configname].div.attrs || ''
        ,'CONTENTS', params[configname].div.text || ''
      ),
      cdnurl: params.cdnurl
    }, events, params[configname])
  };
  RWCWidgetModifier.prototype.DEFAULT_CONFIG = function () {
    return {};
  };

  applib.registerModifier('RWCWidget', RWCWidgetModifier);
}

module.exports = createRWCWidget;
