'use strict';

/**
 * Validate a fixture object for required fields.
 * Returns an array of error strings (empty if valid).
 */
function validateFixture(fixture) {
  const errors = [];

  if (!fixture.route) {
    errors.push('missing "route" object');
    return errors;
  }

  if (!fixture.route.method) {
    errors.push('missing "route.method"');
  }

  if (!fixture.route.path) {
    errors.push('missing "route.path"');
  }

  if (fixture.route.method && !/^(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)$/i.test(fixture.route.method)) {
    errors.push(`invalid "route.method": ${fixture.route.method}`);
  }

  if (!fixture.response) {
    errors.push('missing "response" object');
  }

  if (fixture.response && fixture.response.status !== undefined) {
    if (!Number.isInteger(fixture.response.status) || fixture.response.status < 100 || fixture.response.status > 599) {
      errors.push(`invalid "response.status": ${fixture.response.status}`);
    }
  }

  return errors;
}

module.exports = { validateFixture };
