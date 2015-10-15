(function (global) {
  'use strict';

  global.AccelaConfig = {
    'APP_NAME': 'Accela Angular Seed',
    'APP_VERSION': '1.0.0',
    'USE_MOCK_SERVICES': true,
    'LOG_CLIENT_ERRORS': false,
    'CONSOLE_LOGGING_ENABLED': true,
    'SERVICES': {
      'ITEMS': {
        'GET_LIST': {
          endPoint: 'spa/undefined.do',
          mockEndPoint: 'mock-api/getItems.json'
        }
      },
      'FORMS': {
        'GET_FIELDS': {
          endPoint: 'spa/undefined.do',
          mockEndPoint: 'mock-api/getFormData.json'
        }
      }
    }
  };
})(window);
