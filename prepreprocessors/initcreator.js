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
