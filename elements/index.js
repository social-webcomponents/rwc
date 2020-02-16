function createElements (lib, applib, templateslib, htmltemplateslib, hammerlib) {
  'use strict';

  require('./candidatepresentationcreator')(lib, applib, templateslib, htmltemplateslib, hammerlib);
  require('./matchpresentationcreator')(lib, applib, templateslib, htmltemplateslib, hammerlib);
  require('./rwcdeckbasecreator')(lib, applib, templateslib, htmltemplateslib, hammerlib);
  require('./candidatesdeckcreator')(lib, applib, templateslib, htmltemplateslib, hammerlib);
  require('./matchesdeckcreator')(lib, applib, templateslib, htmltemplateslib, hammerlib);
}

module.exports = createElements;
