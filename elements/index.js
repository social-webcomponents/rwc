function createElements (lib, applib, templateslib, htmltemplateslib, hammerlib) {
  'use strict';

  require('./candidatepresentationcreator')(lib, applib, templateslib, htmltemplateslib, hammerlib);
  require('./candidatesdeckcreator')(lib, applib, templateslib, htmltemplateslib, hammerlib);
}

module.exports = createElements;
