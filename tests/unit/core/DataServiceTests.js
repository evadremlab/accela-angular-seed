'use strict';

describe('Core : DataService : Tests', function() {
  var $httpBackend, service, config;

  beforeEach(function() {
    module('accela.core');

    inject(function(_$httpBackend_, DataService, CONFIG) {
      $httpBackend = _$httpBackend_;
      service = DataService;
      config = CONFIG;

      config.USE_MOCK_SERVICES = true;
      config.LOG_CLIENT_ERRORS = false;
      config.CONSOLE_LOGGING_ENABLED = true;
    });
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should defined the service', function() {
    expect(service).toBeDefined();
  });

  it('should defined the service interface', function() {
    expect(service.getInstance).toBeDefined();
  });

  it('should create a valid serviceUrl', function () {
    var methodName = 'GET_FIELDS';
    var dataService = service.getInstance('FORMS');
    var serviceUrl = dataService.getServiceUrl(methodName);

    expect(serviceUrl).toBeDefined();
    expect(serviceUrl).toEqual('mock-api/getFormData.json');
  });

  it('should get data using instance', function () {
    var responseData;
    var requestData = {};
    var methodName = 'GET_FIELDS';
    var dataService = service.getInstance('FORMS');
    var serviceUrl = dataService.getServiceUrl(methodName, requestData);

    var xhrData = Accela.XHR.getMockData(serviceUrl);

    $httpBackend.expect('GET', serviceUrl).respond(200, xhrData);

    dataService.send(methodName, requestData)
      .then(function (response) {
        responseData = response.data;
        console.log(JSON.stringify(response));
      });

    $httpBackend.flush();

    expect(responseData).toBeDefined();
    expect(responseData.status).toBe(200);
    expect(responseData.result).toBeDefined();
    expect(responseData.result.fields).toBeDefined();
    expect(responseData.result.fields.firstname).toBeDefined();
  });
});