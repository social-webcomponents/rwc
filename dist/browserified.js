(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
function createCandidatePresentationElement (lib, applib, templateslib, htmltemplateslib, hammerlib) {
  'use strict';

  var FromDataCreator = applib.getElementType('FromDataCreator'),
    DataAwareElement = applib.getElementType('DataAwareElement'),
    o = templateslib.override,
    m = htmltemplateslib,
    HammerableMixin = hammerlib.mixins.HammerableMixin;


  function createDataMarkup (options){
    return o(m.div,
      'CLASS', 'candidate-container',
      'CONTENTS', [
        o(m.div,
          'CLASS', 'candidate',
          'CONTENTS', [
            o(m.span,
              'CONTENTS', '{{item.nick || item.username}}'
            ),
            o(m.div,
              'CLASS', 'deck-profile-image',
              'CONTENTS', '<img src="{{this.makeCandidatePicture(item.picture)}}" />'
            )
          ]
        )
      ]
    );
  }


  function CandidatePresentationElement (id, options) {
    console.log('new CandidatePresentationElement', options);
    if (!lib.isString(options.acceptEventName)) {
      throw new Error ('options for '+this.constructor.name+' have to have "acceptEventName" property');
    }
    if (!lib.isString(options.rejectEventName)) {
      throw new Error ('options for '+this.constructor.name+' have to have "rejectEventName" property');
    }
    options.data_markup = options.data_markup || createDataMarkup(options.data_markup_options);
    DataAwareElement.call(this, id, options);
    HammerableMixin.call(this, options);
  }
  lib.inherit(CandidatePresentationElement, DataAwareElement);
  HammerableMixin.addMethods(CandidatePresentationElement, DataAwareElement);
  CandidatePresentationElement.prototype.__cleanUp = function () {
    HammerableMixin.prototype.destroy.call(this);
    DataAwareElement.prototype.__cleanUp.call(this);
  };
  CandidatePresentationElement.prototype.makeCandidatePicture = function (pic, size, imgcode) {
    var ret;
    if (!lib.isString(pic)) {
      return '';
    }
    ret = this.getConfigVal('cdnurl');
    if (!lib.isString(ret)) {
      return '';
    }
    if(ret[ret.length-1]!=='/'){
      ret+='/';
    }
    return ret+pic+(size ? '-'+size : '');
  };
  CandidatePresentationElement.prototype.resetHammerPosition = function () {
    if (this.hammerPos) {
      this.$element.css({opacity: 1});
      //this.$element.css({transform: 'rotate(0deg)'});
      this.$element.offset(this.hammerPos);
    } else {
      console.warn('no hammerPos?');
    }
  };
  CandidatePresentationElement.prototype.onHammerPan = function (hevnt) {
    HammerableMixin.prototype.onHammerPan.call(this, hevnt);
    this.$element.css({opacity: 1-(hevnt.distance/200)});
    //this.$element.css({transform: 'rotate('+(Math.sign(hevnt.deltaX)*hevnt.distance/15)+'deg)'});
  };
  CandidatePresentationElement.prototype.onHammerSwipe = function (hevnt) {
    var curpos;
    if (!this.lastKnownHammerPos) {
      return;
    }
    if (this.isDistanceWeak(hevnt)) {
      return;
    }
    curpos = this.$element.offset();
    if (this.lastKnownHammerPos.left>curpos.left) {
      this.onHammerSwipeLeft();
      return;
    }
    this.onHammerSwipeRight();
  };
  CandidatePresentationElement.prototype.onHammerSwipeLeft = function () {
    console.log('reject!');
    //this.__parent.__parent.needToReject.fire(this.data.username);
    this.__parent.__parent[this.getConfigVal('rejectEventName')].fire(this.data.username);
    this.destroy();
  };
  CandidatePresentationElement.prototype.onHammerSwipeRight = function () {
    console.log('candi-date!');
    //this.__parent.__parent.needToInitiate.fire(this.data.username);
    this.__parent.__parent[this.getConfigVal('acceptEventName')].fire(this.data.username);
    this.destroy();
  };

  applib.registerElementType('CandidatePresentationElement', CandidatePresentationElement);

}
module.exports = createCandidatePresentationElement;

},{}],2:[function(require,module,exports){
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
  applib.registerElementType('CandidatesDeck', CandidatesDeck);
}

module.exports = createCandidatesDeckCreatorElement;

},{}],3:[function(require,module,exports){
function createElements (lib, applib, templateslib, htmltemplateslib, hammerlib) {
  'use strict';

  require('./candidatepresentationcreator')(lib, applib, templateslib, htmltemplateslib, hammerlib);
  require('./matchpresentationcreator')(lib, applib, templateslib, htmltemplateslib, hammerlib);
  require('./rwcdeckbasecreator')(lib, applib, templateslib, htmltemplateslib, hammerlib);
  require('./candidatesdeckcreator')(lib, applib, templateslib, htmltemplateslib, hammerlib);
  require('./matchesdeckcreator')(lib, applib, templateslib, htmltemplateslib, hammerlib);
}

module.exports = createElements;

},{"./candidatepresentationcreator":1,"./candidatesdeckcreator":2,"./matchesdeckcreator":4,"./matchpresentationcreator":5,"./rwcdeckbasecreator":6}],4:[function(require,module,exports){
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
  applib.registerElementType('MatchesDeck', MatchesDeck);
}

module.exports = createMatchesDeckCreatorElement;

},{}],5:[function(require,module,exports){
function createMatchPresentationElement (lib, applib, templateslib, htmltemplateslib, hammerlib) {
  'use strict';

  var FromDataCreator = applib.getElementType('FromDataCreator'),
    DataAwareElement = applib.getElementType('DataAwareElement'),
    o = templateslib.override,
    m = htmltemplateslib;


  function createDataMarkup (options){
    return o(m.div,
      'CLASS', 'match-container',
      'CONTENTS', [
        o(m.div,
          'CLASS', 'match',
          'CONTENTS', [
            o(m.span,
              'CONTENTS', '{{item.nick || item.username}}'
            ),
            o(m.div,
              'CLASS', 'deck-profile-image',
              'CONTENTS', '<img src="{{this.makeMatchPicture(item.picture)}}" />'
            )
          ]
        )
      ]
    );
  }


  function MatchPresentationElement (id, options) {
    console.log('new MatchPresentationElement', options);
    if (!lib.isString(options.openEventName)) {
      throw new Error ('options for '+this.constructor.name+' have to have "openEventName" property');
    }
    if (!lib.isString(options.dropEventName)) {
      throw new Error ('options for '+this.constructor.name+' have to have "dropEventName" property');
    }
    options.data_markup = options.data_markup || createDataMarkup(options.data_markup_options);
    DataAwareElement.call(this, id, options);
  }
  lib.inherit(MatchPresentationElement, DataAwareElement);
  MatchPresentationElement.prototype.__cleanUp = function () {
    DataAwareElement.prototype.__cleanUp.call(this);
  };
  MatchPresentationElement.prototype.makeMatchPicture = function (pic, size, imgcode) {
    var ret;
    if (!lib.isString(pic)) {
      return '';
    }
    ret = this.getConfigVal('cdnurl');
    if (!lib.isString(ret)) {
      return '';
    }
    if(ret[ret.length-1]!=='/'){
      ret+='/';
    }
    return ret+pic+(size ? '-'+size : '');
  };

  applib.registerElementType('MatchPresentationElement', MatchPresentationElement);

}
module.exports = createMatchPresentationElement;

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
(function createRWCWebComponent (execlib) {

  var lib = execlib.lib,
    lR = execlib.execSuite.libRegistry,
    applib = lR.get('allex_applib'),
    templateslib = lR.get('allex_templateslitelib'),
    htmltemplateslib = lR.get('allex_htmltemplateslib'),
    hammerlib = lR.get('allex_hammerjslib');
   
  //var utils = require('./utils')(lib);

  require('./elements')(lib, applib, templateslib, htmltemplateslib, hammerlib);
  require('./prepreprocessors')(lib, applib);
  require('./modifiers')(lib, applib, templateslib, htmltemplateslib);

})(ALLEX);

},{"./elements":3,"./modifiers":8,"./prepreprocessors":11}],8:[function(require,module,exports){
function createModifiers (lib, applib, templateslib, htmltemplateslib) {
  'use strict';

  require('./rwcwidgetcreator')(lib, applib, templateslib, htmltemplateslib);
  require('./rwcwidgetintegrator')(lib, applib);
}

module.exports = createModifiers;

},{"./rwcwidgetcreator":9,"./rwcwidgetintegrator":10}],9:[function(require,module,exports){
function createRWCWidget (lib, applib, templateslib, htmltemplateslib) {
  'use strict';

  var o = templateslib.override,
    m = htmltemplateslib,
    p = templateslib.process,
    BasicModifier = applib.BasicModifier,
    WebElement = applib.getElementType('WebElement');

  function RWCInterfaceElement(id, options){
    WebElement.call(this, id, options);
    this.needCandidates = new lib.HookCollection();
    this.needLikes = new lib.HookCollection();
    this.needMatches = new lib.HookCollection();
    this.needToInitiate = new lib.HookCollection();
    this.needToBlock = new lib.HookCollection();
    this.needToAccept = new lib.HookCollection();
    this.needToReject = new lib.HookCollection();
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
    var widgetname = this.config.widget.name || 'RWCInterface';

    options.elements.push({
      name: widgetname,
      type: 'RWCInterface',
      options: {
        actual: true,
        self_selector: '.',
        default_markup: o(m.div),
        elements: this.rwcElements()
      },
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
      type: 'MatchesDeck',
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
      actual: true,
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

},{}],10:[function(require,module,exports){
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
      triggers: pp+'.RWCInterface!needMatches',
      references: '.>getMatchesOn'+rlm,
      handler: function (gmf) {
        gmf([{}]);
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
    },{
      triggers: '.>getMatchesOn'+rlm,
      references: pp+'.RWCInterface',
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

},{}],11:[function(require,module,exports){
function createPrePreprocessors (lib, applib) {
  'use strict';

  require('./initcreator')(lib, applib);
}
module.exports = createPrePreprocessors;

},{"./initcreator":12}],12:[function(require,module,exports){
function createInitRWCPrePreprocessor (lib, applib) {
  'use strict';

  var BasicProcessor = applib.BasicProcessor;

  function InitRWCPrePreprocessor () {
    BasicProcessor.call(this);
  }
  lib.inherit(InitRWCPrePreprocessor, BasicProcessor);
  function commander (envname, rlm, fnname) {
    return {
      environment: envname,
      entity: {
        name: fnname+rlm,
        options: {
          sink: '.',
          name: fnname+rlm
        }
      }
    };
  }
  InitRWCPrePreprocessor.prototype.process = function (desc) {
    var env = this.config.environment,
      rlm = this.config.rwcrealm;
    desc.preprocessors = desc.preprocessors || {};
    desc.preprocessors.Command = desc.preprocessors.Command || [];

    desc.preprocessors.Command.push.apply(desc.preprocessors.Command, [
      'getCandidatesOn',
      'getInitiatorsOn',
      'getMatchesOn',
      'initiateRelationOn',
      'blockRelationOn',
      'acceptRelationOn',
      'rejectRelationOn'
    ].map(commander.bind(null, env, rlm)));


    env = null;
    rlm = null;
  };

  InitRWCPrePreprocessor.prototype.neededConfigurationNames = ['environment', 'rwcrealm'];

  applib.registerPrePreprocessor('RWCInit', InitRWCPrePreprocessor);
}
module.exports = createInitRWCPrePreprocessor;

},{}]},{},[7]);
