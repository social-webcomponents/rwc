(function createRWCWebComponent (execlib) {

  var lib = execlib.lib,
    lR = execlib.execSuite.libRegistry,
    applib = lR.get('allex_applib'),
    templateslib = lR.get('allex_templateslitelib'),
    htmltemplateslib = lR.get('allex_htmltemplateslib'),
    rwcweblib = lR.get('social_rwcweblib');
   
  //var utils = require('./utils')(lib);

  require('./elements')(lib, applib, templateslib, htmltemplateslib, rwcweblib);
  require('./prepreprocessors')(lib, applib);
  require('./modifiers')(lib, applib, templateslib, htmltemplateslib);

})(ALLEX);
