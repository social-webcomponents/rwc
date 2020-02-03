function createCandidatesWidget (lib, applib, templateslib, htmltemplateslib) {
  'use strict';

  var o = templateslib.override,
    m = htmltemplateslib,
    p = templateslib.process,
    BasicModifier = applib.BasicModifier,
    WebElement = applib.getElementType('WebElement');

  function RWCInterfaceElement(id, options){
    WebElement.call(this, id, options);
    this.needCandidates = new lib.HookCollection();
    this.needToInitiate = new lib.HookCollection();
  }
  lib.inherit(RWCInterfaceElement, WebElement);
  RWCInterfaceElement.prototype.__cleanUp = function(){
    if (this.needToInitiate){
      this.needToInitiate.destroy();
    }
    this.needToInitiate = null;
    if (this.needCandidates){
      this.needCandidates.destroy();
    }
    this.needCandidates = null;
  };
  RWCInterfaceElement.prototype.set_candidates = function(data){
    //TODO
    this.getElement('CandidatesDeck').set('data', data);
    return true;
  };
  applib.registerElementType('RWCInterface', RWCInterfaceElement);


///////////////
//HELPERS

//////////////

  function CandidatesWidgetModifier(options){
    BasicModifier.call(this, options);
  }
  lib.inherit(CandidatesWidgetModifier, BasicModifier);
  CandidatesWidgetModifier.prototype.doProcess = function(name, options, links, logic, resources){
    var widgetname = this.config.widget.name || 'RWCInterface';

    options.elements.push({
      name: widgetname,
      type: 'RWCInterface',
      options: {
        actual: true,
        self_selector: '.',
        default_markup: o(m.div),
        /*
        elements: [{
          type: 'WebElement',
          name: 'Candidates',
          options: {
            default_markup: '<div></div>',
            self_selector: '.',
            elements: this.candidatesElements()
          }
        }]
        */
        elements: this.candidatesElements()
      },
      preprocessors: {
        TabView: {
          'rwcmenu': {
            selector: 'rwcmenu',
            tabs: {
              'CandidatesDeck': 'candidates'
            }
          }
        }
      },
      links: [
        //Button logic
        /*
        {
          source: '.candidatesDeckButton.$element!click',
          target: '.!needCandidates'
        }
        */
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
        }
      ]
    });
  };

  CandidatesWidgetModifier.prototype.candidatesElements = function () {
    var menudesc = {
      name: 'rwcmenu',
      type: 'WebElement',
      options: {
        actual: true,
        self_selector: 'attrib:daterightelement',
        default_markup: '<div><ul><li><a href="#" data-route="candidates">Candidates</a></li></ul></div>'
      },
      modifiers: [{
        name: 'RouteController',
        options: {
          selector: 'ul li a'
        }
      }]
    };
    return [{
      name: 'rwcmenu',
      type: 'WebElement',
      options: {
        actual: true,
        self_selector: 'attrib:daterightelement',
        default_markup: '<div><ul><li><a href="#" data-route="candidates">Candidates</a></li></ul></div>'
      },
      modifiers: [{
        name: 'RouteController',
        options: {
          selector: 'ul li a'
        }
      }]
    },
    //Button
    /*
    {
      name: 'candidatesDeckButton',
      type: 'WebElement',
      options: {
        actual: true,
        self_selector: '.',
        default_markup: o(m.button,
          'CLASS', 'get-candidates-button',
          'CONTENTS', 'GET CANDIDATES'
        )
      }
    }
    */
    //TabView
    {
      name: 'CandidatesDeck',
      type: 'CandidatesDeck',
      options: this.deckWidgetOptions(this.config.widget)
    }];
  };
  CandidatesWidgetModifier.prototype.deckWidgetOptions = function(params){
    params = params || {};
    return {
      actual: params.actual || true /*!! will not matter once TabViewController comes into play*/,
      self_selector: '.',
      default_markup: o(m.div,
        'CLASS', 'candidates-container'
      ),
      cdnurl: this.config.widget.cdnurl
    }
  };
  CandidatesWidgetModifier.prototype.DEFAULT_CONFIG = function () {
    return {};
  };

  applib.registerModifier('RWCWidget', CandidatesWidgetModifier);
}

module.exports = createCandidatesWidget;
