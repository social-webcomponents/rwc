function createRWCInterfaceElement (lib, applib, templateslib, htmltemplateslib) {
  'use strict';

  var WebElement = applib.getElementType('WebElement');

  function RWCInterfaceElement(id, options){
    WebElement.call(this, id, options);
    this.needCandidates = this.createBufferableHookCollection();
    this.needLikes = this.createBufferableHookCollection();
    this.needMatches = this.createBufferableHookCollection();
    this.needToInitiate = this.createBufferableHookCollection();
    this.needToBlock = this.createBufferableHookCollection();
    this.needToAccept = this.createBufferableHookCollection();
    this.needToReject = this.createBufferableHookCollection();
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

}
module.exports = createRWCInterfaceElement;
