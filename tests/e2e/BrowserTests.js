/**
 * you have to run "webdriver-manager start" before testing
 */
'use strict';

var util = require('./util');

/**
 * Tests are assumed to be running on localhost using mock data.
 */

describe('E2E : Browser Tests', function() {
  it('should launch the app', function() {
    browser.get('http://localhost:3000/index.html#/');
    expect(browser.getTitle()).toEqual('Accela Automation Seed');
  });

//  it('table should have 3 rows', function() {
//    expect(element.all(by.repeater('(key,value) in formData')).count()).toEqual(3);
//  });
});

