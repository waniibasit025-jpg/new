import test from 'node:test';
import assert from 'node:assert/strict';
import { parseAndLookupPhoneNumber, getCountryFlag, detectCarrierAndCircle } from './phoneLookup';
import { SharingManager } from './sharingManager';

test('validates and parses US phone number with area code details', () => {
  const result = parseAndLookupPhoneNumber('+1 415 555 2671');
  assert.equal(result.isValid, true);
  assert.equal(result.countryCode, 'US');
  assert.equal(result.callingCode, '+1');
  assert.equal(result.e164, '+14155552671');
  assert.ok(result.region.includes('California'));
  assert.ok(result.location.lat !== 0);
  assert.equal(result.riskScore, 'Low');
  assert.ok(result.disclaimer.includes('consent'));
});

test('validates and parses Indian mobile number with circle & operator heuristics', () => {
  const result = parseAndLookupPhoneNumber('+91 98765 43210');
  assert.equal(result.isValid, true);
  assert.equal(result.countryCode, 'IN');
  assert.equal(result.callingCode, '+91');
  assert.equal(result.lineType, 'MOBILE');
  assert.ok(result.carrier.includes('Jio') || result.carrier.includes('Airtel') || result.carrier.includes('Telecom'));
  assert.ok(result.location.lat > 0);
});

test('handles invalid phone numbers gracefully with clear error metadata', () => {
  const result = parseAndLookupPhoneNumber('12345');
  assert.equal(result.isValid, false);
  assert.equal(result.lineType, 'UNKNOWN');
  assert.equal(result.riskScore, 'Elevated');
  assert.ok(result.riskReason.length > 0);
});

test('detects country flag correctly', () => {
  assert.equal(getCountryFlag('US'), '🇺🇸');
  assert.equal(getCountryFlag('IN'), '🇮🇳');
  assert.equal(getCountryFlag('GB'), '🇬🇧');
  assert.equal(getCountryFlag(''), '🌐');
});

test('sharing manager creates session with expiry and enforces consent before location update', () => {
  const manager = new SharingManager();
  const session = manager.createSession({
    durationMinutes: 30,
    requesterName: 'Alice',
    targetPhone: '+1 415 555 2671',
    message: 'Meet me at the station',
  });

  assert.ok(session.token);
  assert.equal(session.status, 'pending_consent');
  assert.equal(session.requesterName, 'Alice');

  // Attempting location update before consent must fail
  const prematureUpdate = manager.updateLocation(session.token, {
    latitude: 37.7749,
    longitude: -122.4194,
    accuracy: 10,
  });
  assert.equal(prematureUpdate.success, false);
  assert.ok(prematureUpdate.error?.includes('consent'));

  // Grant consent
  const consentRes = manager.updateConsent(session.token, true);
  assert.equal(consentRes.success, true);
  assert.equal(consentRes.session?.status, 'active');

  // Now location update succeeds
  const validUpdate = manager.updateLocation(session.token, {
    latitude: 37.7749,
    longitude: -122.4194,
    accuracy: 12,
    speed: 1.5,
  });
  assert.equal(validUpdate.success, true);
  assert.equal(validUpdate.session?.currentLocation?.latitude, 37.7749);
  assert.equal(validUpdate.session?.history.length, 1);

  // Stop session
  const stopRes = manager.stopSharing(session.token);
  assert.equal(stopRes.success, true);
  assert.equal(stopRes.session?.status, 'stopped');
});

test('carrier detection resolves known carriers for US, UK, and IN', () => {
  const resIN = detectCarrierAndCircle('IN', '9810123456', 'MOBILE');
  assert.ok(resIN.carrier.length > 0);

  const resUS = detectCarrierAndCircle('US', '4155551234', 'MOBILE');
  assert.ok(resUS.carrier.includes('Verizon') || resUS.carrier.includes('Wireless'));

  const resGB = detectCarrierAndCircle('GB', '7911123456', 'MOBILE');
  assert.ok(resGB.carrier.includes('EE') || resGB.carrier.includes('Vodafone'));
});

test('evaluates advanced search filters accurately', () => {
  // Mobile filter matches mobile number
  const matchRes = parseAndLookupPhoneNumber('+91 98765 43210', 'IN', {
    numberType: 'MOBILE',
    country: 'IN',
  });
  assert.equal(matchRes.isValid, true);
  assert.equal(matchRes.filterMatches, true);

  // Mismatch when country filter does not match
  const mismatchCountryRes = parseAndLookupPhoneNumber('+91 98765 43210', 'IN', {
    numberType: 'ALL',
    country: 'US',
  });
  assert.equal(mismatchCountryRes.filterMatches, false);
  assert.ok(mismatchCountryRes.filterMismatchReason?.includes('filter is set to US'));

  // Mismatch when number type does not match
  const mismatchTypeRes = parseAndLookupPhoneNumber('+91 98765 43210', 'IN', {
    numberType: 'VOIP',
    country: 'ALL',
  });
  assert.equal(mismatchTypeRes.filterMatches, false);
  assert.ok(mismatchTypeRes.filterMismatchReason?.includes('VoIP'));
});
