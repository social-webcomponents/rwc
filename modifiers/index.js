function createModifiers (lib, applib, templateslib, htmltemplateslib) {
  'use strict';

  require('./rwcwidgetcreator')(lib, applib, templateslib, htmltemplateslib);
  require('./rwcwidgetintegrator')(lib, applib);
}

module.exports = createModifiers;
