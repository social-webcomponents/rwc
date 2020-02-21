function createRWCWidget (lib, applib, templateslib, htmltemplateslib) {
  'use strict';

  var o = templateslib.override,
    m = htmltemplateslib,
    p = templateslib.process,
    BasicModifier = applib.BasicModifier,
    WebElement = applib.getElementType('WebElement');

  function RWCInterfaceElement(id, options){
    WebElement.call(this, id, options);
    this.needCandidates = this.createBufferableHookCollection(); //new lib.HookCollection();
    this.needLikes = this.createBufferableHookCollection(); //new lib.HookCollection();
    this.needMatches = this.createBufferableHookCollection(); //new lib.HookCollection();
    this.needToInitiate = this.createBufferableHookCollection(); //new lib.HookCollection();
    this.needToBlock = this.createBufferableHookCollection(); //new lib.HookCollection();
    this.needToAccept = this.createBufferableHookCollection(); //new lib.HookCollection();
    this.needToReject = this.createBufferableHookCollection(); //new lib.HookCollection();
  }
  lib.inherit(RWCInterfaceElement, WebElement);
  RWCInterfaceElement.prototype.__cleanUp = function(){
    if (this.needToReject) {
      this.needToReject.destroy();
    }
    this.needToReject = null;
    if (this.needToAccept) {
      this.needToAccept.destroy();
    }
    this.needToAccept = null;
    if (this.needToBlock) {
      this.needToBlock.destroy();
    }
    this.needToBlock = null;
    if (this.needToInitiate){
      this.needToInitiate.destroy();
    }
    this.needToInitiate = null;
    if (this.needMatches) {
      this.needMatches.destroy();
    }
    this.needMatches = null;
    if (this.needLikes) {
      this.needLikes.destroy();
    }
    this.needLikes = null;
    if (this.needCandidates){
      this.needCandidates.destroy();
    }
    this.needCandidates = null;
  };
  RWCInterfaceElement.prototype.set_candidates = function(data){
    this.getElement('CandidatesDeck').set('data', data);
    return true;
  };
  RWCInterfaceElement.prototype.set_likes = function(data){
    this.getElement('LikesDeck').set('data', data);
    return true;
  };
  RWCInterfaceElement.prototype.set_matches = function(data){
    this.getElement('MatchesDeck').set('data', data);
    return true;
  };
  applib.registerElementType('RWCInterface', RWCInterfaceElement);


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
    this.config.types = this.config.types || {};
    var widgetname = this.config.widget.name || 'RWCInterface';

    options.elements.push({
      name: widgetname,
      type: 'RWCInterface',
      options: lib.extend({}, {
        actual: true,
        self_selector: '.',
        default_markup: o(m.div),
        elements: this.rwcElements()
      }, this.config.widget.container),
      preprocessors: {
      },
      links: [
      ],
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
