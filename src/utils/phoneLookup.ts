import { parsePhoneNumberFromString, CountryCode } from 'libphonenumber-js/max';
import { PhoneLookupResult, LineType, CountryOption, SearchFilters } from '../types';

export const POPULAR_COUNTRIES: CountryOption[] = [
  { name: 'United States', code: 'US', dialCode: '+1', flag: '🇺🇸', formatPlaceholder: '(555) 123-4567' },
  { name: 'India', code: 'IN', dialCode: '+91', flag: '🇮🇳', formatPlaceholder: '98765 43210' },
  { name: 'United Kingdom', code: 'GB', dialCode: '+44', flag: '🇬🇧', formatPlaceholder: '7911 123456' },
  { name: 'Canada', code: 'CA', dialCode: '+1', flag: '🇨🇦', formatPlaceholder: '(416) 123-4567' },
  { name: 'Australia', code: 'AU', dialCode: '+61', flag: '🇦🇺', formatPlaceholder: '412 345 678' },
  { name: 'Germany', code: 'DE', dialCode: '+49', flag: '🇩🇪', formatPlaceholder: '151 12345678' },
  { name: 'France', code: 'FR', dialCode: '+33', flag: '🇫🇷', formatPlaceholder: '6 12 34 56 78' },
  { name: 'Japan', code: 'JP', dialCode: '+81', flag: '🇯🇵', formatPlaceholder: '90-1234-5678' },
  { name: 'United Arab Emirates', code: 'AE', dialCode: '+971', flag: '🇦🇪', formatPlaceholder: '50 123 4567' },
  { name: 'Brazil', code: 'BR', dialCode: '+55', flag: '🇧🇷', formatPlaceholder: '11 91234-5678' },
  { name: 'Singapore', code: 'SG', dialCode: '+65', flag: '🇸🇬', formatPlaceholder: '9123 4567' },
  { name: 'South Africa', code: 'ZA', dialCode: '+27', flag: '🇿🇦', formatPlaceholder: '82 123 4567' },
  { name: 'Mexico', code: 'MX', dialCode: '+52', flag: '🇲🇽', formatPlaceholder: '55 1234 5678' },
  { name: 'Spain', code: 'ES', dialCode: '+34', flag: '🇪🇸', formatPlaceholder: '612 34 56 78' },
  { name: 'Italy', code: 'IT', dialCode: '+39', flag: '🇮🇹', formatPlaceholder: '312 345 6789' },
  { name: 'Netherlands', code: 'NL', dialCode: '+31', flag: '🇳🇱', formatPlaceholder: '6 12345678' },
  { name: 'Switzerland', code: 'CH', dialCode: '+41', flag: '🇨🇭', formatPlaceholder: '78 123 45 67' },
  { name: 'Pakistan', code: 'PK', dialCode: '+92', flag: '🇵🇰', formatPlaceholder: '300 1234567' },
  { name: 'Nigeria', code: 'NG', dialCode: '+234', flag: '🇳🇬', formatPlaceholder: '802 123 4567' },
  { name: 'Indonesia', code: 'ID', dialCode: '+62', flag: '🇮🇩', formatPlaceholder: '812-3456-7890' },
  { name: 'Saudi Arabia', code: 'SA', dialCode: '+966', flag: '🇸🇦', formatPlaceholder: '50 123 4567' },
  { name: 'Philippines', code: 'PH', dialCode: '+63', flag: '🇵🇭', formatPlaceholder: '917 123 4567' },
  { name: 'Ireland', code: 'IE', dialCode: '+353', flag: '🇮🇪', formatPlaceholder: '87 123 4567' },
  { name: 'New Zealand', code: 'NZ', dialCode: '+64', flag: '🇳🇿', formatPlaceholder: '21 123 4567' },
];

export const COUNTRY_CENTROIDS: Record<string, { lat: number; lng: number; accuracyKm: number; name: string }> = {
  US: { lat: 37.0902, lng: -95.7129, accuracyKm: 2500, name: 'United States' },
  IN: { lat: 20.5937, lng: 78.9629, accuracyKm: 1800, name: 'India' },
  GB: { lat: 55.3781, lng: -3.4360, accuracyKm: 600, name: 'United Kingdom' },
  CA: { lat: 56.1304, lng: -106.3468, accuracyKm: 2800, name: 'Canada' },
  AU: { lat: -25.2744, lng: 133.7751, accuracyKm: 2200, name: 'Australia' },
  DE: { lat: 51.1657, lng: 10.4515, accuracyKm: 500, name: 'Germany' },
  FR: { lat: 46.2276, lng: 2.2137, accuracyKm: 550, name: 'France' },
  JP: { lat: 36.2048, lng: 138.2529, accuracyKm: 900, name: 'Japan' },
  AE: { lat: 23.4241, lng: 53.8478, accuracyKm: 250, name: 'United Arab Emirates' },
  BR: { lat: -14.2350, lng: -51.9253, accuracyKm: 2500, name: 'Brazil' },
  SG: { lat: 1.3521, lng: 103.8198, accuracyKm: 30, name: 'Singapore' },
  ZA: { lat: -30.5595, lng: 22.9375, accuracyKm: 900, name: 'South Africa' },
  MX: { lat: 23.6345, lng: -102.5528, accuracyKm: 1200, name: 'Mexico' },
  ES: { lat: 40.4637, lng: -3.7492, accuracyKm: 600, name: 'Spain' },
  IT: { lat: 41.8719, lng: 12.5674, accuracyKm: 650, name: 'Italy' },
  NL: { lat: 52.1326, lng: 5.2913, accuracyKm: 180, name: 'Netherlands' },
  CH: { lat: 46.8182, lng: 8.2275, accuracyKm: 180, name: 'Switzerland' },
  PK: { lat: 30.3753, lng: 69.3451, accuracyKm: 850, name: 'Pakistan' },
  NG: { lat: 9.0820, lng: 8.6753, accuracyKm: 700, name: 'Nigeria' },
  ID: { lat: -0.7893, lng: 113.9213, accuracyKm: 1800, name: 'Indonesia' },
  SA: { lat: 23.8859, lng: 45.0792, accuracyKm: 1100, name: 'Saudi Arabia' },
  PH: { lat: 12.8797, lng: 121.7740, accuracyKm: 800, name: 'Philippines' },
  IE: { lat: 53.1424, lng: -7.6921, accuracyKm: 220, name: 'Ireland' },
  NZ: { lat: -40.9006, lng: 174.8860, accuracyKm: 900, name: 'New Zealand' },
};

// Regional & Area Code mappings
interface AreaData {
  region: string;
  city?: string;
  lat: number;
  lng: number;
  accuracyKm: number;
  timezones: string[];
}

const US_AREA_CODES: Record<string, AreaData> = {
  '201': { region: 'New Jersey', city: 'Jersey City / Hackensack', lat: 40.7282, lng: -74.0776, accuracyKm: 35, timezones: ['America/New_York'] },
  '202': { region: 'District of Columbia', city: 'Washington DC', lat: 38.9072, lng: -77.0369, accuracyKm: 25, timezones: ['America/New_York'] },
  '206': { region: 'Washington', city: 'Seattle', lat: 47.6062, lng: -122.3321, accuracyKm: 30, timezones: ['America/Los_Angeles'] },
  '212': { region: 'New York', city: 'New York City (Manhattan)', lat: 40.7831, lng: -73.9712, accuracyKm: 15, timezones: ['America/New_York'] },
  '213': { region: 'California', city: 'Los Angeles (Downtown)', lat: 34.0522, lng: -118.2437, accuracyKm: 25, timezones: ['America/Los_Angeles'] },
  '214': { region: 'Texas', city: 'Dallas', lat: 32.7767, lng: -96.7970, accuracyKm: 35, timezones: ['America/Chicago'] },
  '305': { region: 'Florida', city: 'Miami / Keys', lat: 25.7617, lng: -80.1918, accuracyKm: 30, timezones: ['America/New_York'] },
  '312': { region: 'Illinois', city: 'Chicago (Central)', lat: 41.8781, lng: -87.6298, accuracyKm: 25, timezones: ['America/Chicago'] },
  '415': { region: 'California', city: 'San Francisco', lat: 37.7749, lng: -122.4194, accuracyKm: 20, timezones: ['America/Los_Angeles'] },
  '512': { region: 'Texas', city: 'Austin', lat: 30.2672, lng: -97.7431, accuracyKm: 30, timezones: ['America/Chicago'] },
  '617': { region: 'Massachusetts', city: 'Boston / Cambridge', lat: 42.3601, lng: -71.0589, accuracyKm: 25, timezones: ['America/New_York'] },
  '650': { region: 'California', city: 'San Mateo / Palo Alto', lat: 37.4419, lng: -122.1430, accuracyKm: 25, timezones: ['America/Los_Angeles'] },
  '702': { region: 'Nevada', city: 'Las Vegas', lat: 36.1699, lng: -115.1398, accuracyKm: 30, timezones: ['America/Los_Angeles'] },
  '713': { region: 'Texas', city: 'Houston', lat: 29.7604, lng: -95.3698, accuracyKm: 35, timezones: ['America/Chicago'] },
  '808': { region: 'Hawaii', city: 'Honolulu / Oahu', lat: 21.3069, lng: -157.8583, accuracyKm: 80, timezones: ['Pacific/Honolulu'] },
  '917': { region: 'New York', city: 'New York City (All 5 Boroughs)', lat: 40.7128, lng: -74.0060, accuracyKm: 20, timezones: ['America/New_York'] },
};

const IN_TELECOM_CIRCLES: Record<string, AreaData> = {
  'delhi': { region: 'Delhi NCR', city: 'New Delhi', lat: 28.6139, lng: 77.2090, accuracyKm: 50, timezones: ['Asia/Kolkata'] },
  'mumbai': { region: 'Maharashtra (Mumbai)', city: 'Mumbai', lat: 19.0760, lng: 72.8777, accuracyKm: 40, timezones: ['Asia/Kolkata'] },
  'karnataka': { region: 'Karnataka', city: 'Bengaluru', lat: 12.9716, lng: 77.5946, accuracyKm: 90, timezones: ['Asia/Kolkata'] },
  'tamilnadu': { region: 'Tamil Nadu & Chennai', city: 'Chennai', lat: 13.0827, lng: 80.2707, accuracyKm: 90, timezones: ['Asia/Kolkata'] },
  'maharashtra': { region: 'Maharashtra & Goa', city: 'Pune', lat: 18.5204, lng: 73.8567, accuracyKm: 180, timezones: ['Asia/Kolkata'] },
  'andhra': { region: 'Andhra Pradesh & Telangana', city: 'Hyderabad', lat: 17.3850, lng: 78.4867, accuracyKm: 150, timezones: ['Asia/Kolkata'] },
  'gujarat': { region: 'Gujarat', city: 'Ahmedabad', lat: 23.0225, lng: 72.5714, accuracyKm: 140, timezones: ['Asia/Kolkata'] },
  'punjab': { region: 'Punjab & Chandigarh', city: 'Chandigarh', lat: 30.7333, lng: 76.7794, accuracyKm: 110, timezones: ['Asia/Kolkata'] },
  'westbengal': { region: 'West Bengal & Kolkata', city: 'Kolkata', lat: 22.5726, lng: 88.3639, accuracyKm: 100, timezones: ['Asia/Kolkata'] },
  'rajasthan': { region: 'Rajasthan', city: 'Jaipur', lat: 26.9124, lng: 75.7873, accuracyKm: 160, timezones: ['Asia/Kolkata'] },
  'kerala': { region: 'Kerala', city: 'Kochi / Thiruvananthapuram', lat: 9.9312, lng: 76.2673, accuracyKm: 120, timezones: ['Asia/Kolkata'] },
  'upwest': { region: 'Uttar Pradesh (West) & Uttarakhand', city: 'Noida / Meerut', lat: 28.5355, lng: 77.3910, accuracyKm: 150, timezones: ['Asia/Kolkata'] },
  'upeast': { region: 'Uttar Pradesh (East)', city: 'Lucknow', lat: 26.8467, lng: 80.9462, accuracyKm: 180, timezones: ['Asia/Kolkata'] },
};

const UK_AREA_CODES: Record<string, AreaData> = {
  '20': { region: 'Greater London', city: 'London', lat: 51.5074, lng: -0.1278, accuracyKm: 30, timezones: ['Europe/London'] },
  '121': { region: 'West Midlands', city: 'Birmingham', lat: 52.4862, lng: -1.8904, accuracyKm: 30, timezones: ['Europe/London'] },
  '161': { region: 'Greater Manchester', city: 'Manchester', lat: 53.4808, lng: -2.2426, accuracyKm: 30, timezones: ['Europe/London'] },
  '141': { region: 'Scotland', city: 'Glasgow', lat: 55.8642, lng: -4.2518, accuracyKm: 30, timezones: ['Europe/London'] },
  '113': { region: 'West Yorkshire', city: 'Leeds', lat: 53.8008, lng: -1.5491, accuracyKm: 30, timezones: ['Europe/London'] },
  '151': { region: 'Merseyside', city: 'Liverpool', lat: 53.4084, lng: -2.9916, accuracyKm: 30, timezones: ['Europe/London'] },
  '29': { region: 'Wales', city: 'Cardiff', lat: 51.4816, lng: -3.1791, accuracyKm: 30, timezones: ['Europe/London'] },
};

export function detectCarrierAndCircle(countryCode: string, nationalNumber: string, lineType: LineType): { carrier: string; circle?: AreaData } {
  // Carrier heuristics based on public National Numbering Plans
  if (countryCode === 'IN') {
    const prefix2 = nationalNumber.slice(0, 2);
    const prefix4 = nationalNumber.slice(0, 4);

    let carrier = 'Reliance Jio / Bharti Airtel / Vi / BSNL (Telecom Operator)';
    let circleKey = 'delhi';

    // India telecom circle & series patterns
    if (['98', '99', '97', '96', '95', '94', '93', '92', '91', '90', '89', '88', '87', '86', '85', '84', '83', '82', '81', '80', '79', '78', '77', '76', '75', '74', '73', '72', '71', '70', '63', '62'].includes(prefix2)) {
      if (['70', '79', '63', '62', '89'].includes(prefix2) || nationalNumber.startsWith('9876')) {
        carrier = 'Reliance Jio Infocomm Ltd';
      } else if (['98', '99', '80', '95', '81'].includes(prefix2)) {
        carrier = 'Bharti Airtel Telecom Ltd';
      } else if (['94', '95'].includes(prefix2)) {
        carrier = 'BSNL Mobile (Bharat Sanchar Nigam Ltd)';
      } else {
        carrier = 'Vodafone Idea Ltd (Vi)';
      }
    }

    // Rough circle estimate
    const numInt = parseInt(prefix4, 10);
    if (numInt >= 9810 && numInt <= 9811) circleKey = 'delhi';
    else if (numInt >= 9820 && numInt <= 9821) circleKey = 'mumbai';
    else if (numInt >= 9845 && numInt <= 9846) circleKey = 'karnataka';
    else if (numInt >= 9840 && numInt <= 9841) circleKey = 'tamilnadu';
    else if (numInt >= 9822 && numInt <= 9823) circleKey = 'maharashtra';
    else if (numInt >= 9848 && numInt <= 9849) circleKey = 'andhra';
    else if (numInt >= 9825 && numInt <= 9826) circleKey = 'gujarat';
    else if (numInt >= 9814 && numInt <= 9815) circleKey = 'punjab';
    else if (numInt >= 9830 && numInt <= 9831) circleKey = 'westbengal';
    else if (numInt >= 9829 && numInt <= 9830) circleKey = 'rajasthan';
    else if (numInt >= 9847 && numInt <= 9848) circleKey = 'kerala';
    else circleKey = 'delhi';

    return { carrier, circle: IN_TELECOM_CIRCLES[circleKey] };
  }

  if (countryCode === 'US' || countryCode === 'CA') {
    const areaCode = nationalNumber.slice(0, 3);
    const area = US_AREA_CODES[areaCode];

    let carrier = 'Major Wireless / Fixed Network (Verizon, AT&T, T-Mobile, or Regional)';
    if (lineType === 'MOBILE') {
      carrier = 'Verizon Wireless / AT&T Mobility / T-Mobile US';
    } else if (lineType === 'VOIP') {
      carrier = 'VoIP Network Operator (Twilio / Bandwidth / Google Voice)';
    } else if (lineType === 'TOLL_FREE') {
      carrier = 'Toll-Free Telecommunications Service';
    } else {
      carrier = 'Local Exchange Carrier (ILEC / CLEC)';
    }

    return { carrier, circle: area };
  }

  if (countryCode === 'GB') {
    let circle: AreaData | undefined;
    if (nationalNumber.startsWith('20')) circle = UK_AREA_CODES['20'];
    else if (nationalNumber.startsWith('121')) circle = UK_AREA_CODES['121'];
    else if (nationalNumber.startsWith('161')) circle = UK_AREA_CODES['161'];
    else if (nationalNumber.startsWith('141')) circle = UK_AREA_CODES['141'];

    let carrier = 'British Telecom / EE / O2 / Vodafone / Three UK';
    if (nationalNumber.startsWith('7')) {
      carrier = 'EE / O2 UK / Vodafone UK / Three (Mobile)';
    }

    return { carrier, circle };
  }

  if (countryCode === 'DE') {
    let carrier = 'Deutsche Telekom / Vodafone Deutschland / Telefónica O2';
    if (nationalNumber.startsWith('15') || nationalNumber.startsWith('16') || nationalNumber.startsWith('17')) {
      carrier = 'Deutsche Telekom / Vodafone / O2 (Cellular)';
    }
    return { carrier };
  }

  if (countryCode === 'FR') {
    let carrier = 'Orange / SFR / Bouygues Telecom / Free Mobile';
    return { carrier };
  }

  if (countryCode === 'AU') {
    let carrier = 'Telstra / Optus / TPG Telecom (Vodafone AU)';
    return { carrier };
  }

  if (countryCode === 'JP') {
    let carrier = 'NTT Docomo / KDDI (au) / SoftBank / Rakuten Mobile';
    return { carrier };
  }

  return { carrier: 'Standard Regional Telecommunication Operator' };
}

export function parseAndLookupPhoneNumber(
  rawInput: string,
  defaultCountryCode?: string,
  filters?: SearchFilters
): PhoneLookupResult {
  const sanitized = rawInput.trim();
  const fallbackCountry = (defaultCountryCode || 'US').toUpperCase() as CountryCode;

  const parsed = parsePhoneNumberFromString(sanitized, fallbackCountry);

  const now = new Date();
  const timeFormatted = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' });

  if (!parsed || !parsed.isValid()) {
    // If invalid or unparseable, return structured error/invalid response
    const possibleCountry = parsed?.country || fallbackCountry;
    const countryMetadata = COUNTRY_CENTROIDS[possibleCountry] || { lat: 20, lng: 0, accuracyKm: 4000, name: possibleCountry };

    return {
      query: sanitized,
      isValid: false,
      isPossible: parsed ? parsed.isPossible() : false,
      e164: parsed ? parsed.number : sanitized,
      international: parsed ? parsed.formatInternational() : sanitized,
      national: parsed ? parsed.formatNational() : sanitized,
      rfc3966: parsed ? parsed.getURI() : `tel:${sanitized}`,
      countryCode: (parsed?.country || fallbackCountry).toString(),
      countryName: countryMetadata.name,
      callingCode: parsed?.countryCallingCode ? `+${parsed.countryCallingCode}` : '',
      countryFlag: getCountryFlag(parsed?.country || fallbackCountry),
      lineType: 'UNKNOWN',
      lineTypeLabel: 'Invalid / Unassigned Format',
      carrier: 'Unknown / Not Registered',
      region: countryMetadata.name,
      timezones: ['UTC'],
      currentTime: timeFormatted,
      riskScore: 'Elevated',
      riskReason: 'Number failed international ITU E.164 allocation checks or contains invalid area/subscriber digits.',
      filterMatches: false,
      filterMismatchReason: 'Number is invalid and could not be verified against search criteria.',
      location: {
        lat: countryMetadata.lat,
        lng: countryMetadata.lng,
        accuracyKm: countryMetadata.accuracyKm,
        regionName: countryMetadata.name,
      },
      disclaimer: 'This phone number format is invalid according to standard ITU / telecommunications prefix rules.',
      timestamp: now.toISOString(),
    };
  }

  // Valid number parsed!
  const countryCode = parsed.country || fallbackCountry;
  const rawType = parsed.getType(); // e.g. 'MOBILE', 'FIXED_LINE', etc.
  const lineType: LineType = (rawType as LineType) || 'UNKNOWN';

  const typeLabels: Record<LineType, string> = {
    MOBILE: 'Mobile / Cellular',
    FIXED_LINE: 'Fixed-Line / Landline',
    VOIP: 'VoIP (Virtual / IP-PBX)',
    TOLL_FREE: 'Toll-Free / Business Service',
    PREMIUM_RATE: 'Premium Rate Service',
    SHARED_COST: 'Shared Cost Service',
    PERSONAL_NUMBER: 'Personal Number Service',
    PAGER: 'Pager Network',
    UAN: 'Universal Access Number',
    VOICEMAIL: 'Voicemail Service',
    UNKNOWN: 'Standard Telephone Line',
  };

  const lineTypeLabel = typeLabels[lineType] || 'Standard Telephone Line';

  const countryCentroid = COUNTRY_CENTROIDS[countryCode] || {
    lat: 20,
    lng: 0,
    accuracyKm: 3000,
    name: countryCode,
  };

  // Extract carrier & regional circle details
  const { carrier, circle } = detectCarrierAndCircle(countryCode, parsed.nationalNumber, lineType);

  let lat = countryCentroid.lat;
  let lng = countryCentroid.lng;
  let accuracyKm = countryCentroid.accuracyKm;
  let regionName = countryCentroid.name;
  let cityName: string | undefined;
  let timezones = ['UTC'];

  if (circle) {
    lat = circle.lat;
    lng = circle.lng;
    accuracyKm = circle.accuracyKm;
    regionName = `${circle.region}, ${countryCentroid.name}`;
    cityName = circle.city;
    timezones = circle.timezones;
  }

  // Risk evaluation
  let riskScore: 'Low' | 'Medium' | 'Elevated' = 'Low';
  let riskReason = 'Verified valid ITU-T standard telecom subscriber allocation.';

  if (lineType === 'VOIP') {
    riskScore = 'Medium';
    riskReason = 'VoIP / virtual numbers carry elevated spoofing risk as they are cloud-routed rather than SIM-bound.';
  } else if (lineType === 'PREMIUM_RATE') {
    riskScore = 'Elevated';
    riskReason = 'Premium rate numbers incur high billing fees to callers.';
  } else if (lineType === 'UNKNOWN') {
    riskScore = 'Medium';
    riskReason = 'Number format valid but carrier line type is unclassified in telecom registries.';
  }

  // Check filter criteria if provided
  let filterMatches = true;
  let filterMismatchReason: string | undefined;

  if (filters) {
    if (filters.country && filters.country !== 'ALL' && filters.country.toUpperCase() !== countryCode.toUpperCase()) {
      filterMatches = false;
      filterMismatchReason = `Number belongs to ${countryCentroid.name} (${countryCode}), but filter is set to ${filters.country}.`;
    } else if (filters.numberType && filters.numberType !== 'ALL') {
      const target = filters.numberType;
      const isTypeMatch =
        (target === 'MOBILE' && (lineType === 'MOBILE' || lineType === 'FIXED_LINE_OR_MOBILE' as any)) ||
        (target === 'FIXED_LINE' && (lineType === 'FIXED_LINE' || lineType === 'FIXED_LINE_OR_MOBILE' as any)) ||
        (target === 'VOIP' && lineType === 'VOIP') ||
        (target === 'TOLL_FREE' && lineType === 'TOLL_FREE') ||
        (target === 'PREMIUM_RATE' && lineType === 'PREMIUM_RATE');

      if (!isTypeMatch) {
        filterMatches = false;
        filterMismatchReason = `Number is classified as ${lineTypeLabel}, but filter requires ${typeLabels[target as LineType] || target}.`;
      }
    }
  }

  return {
    query: sanitized,
    isValid: true,
    isPossible: true,
    e164: parsed.number,
    international: parsed.formatInternational(),
    national: parsed.formatNational(),
    rfc3966: parsed.getURI(),
    countryCode,
    countryName: countryCentroid.name,
    callingCode: `+${parsed.countryCallingCode}`,
    countryFlag: getCountryFlag(countryCode),
    lineType,
    lineTypeLabel,
    carrier,
    region: regionName,
    timezones,
    currentTime: timeFormatted,
    riskScore,
    riskReason,
    filterMatches,
    filterMismatchReason,
    location: {
      lat,
      lng,
      accuracyKm,
      regionName,
      cityName,
    },
    disclaimer: 'Registered telecom allocation only. Live GPS tracking is legally and technically impossible through a phone number lookup without explicit recipient device consent.',
    timestamp: now.toISOString(),
  };
}

export function getCountryFlag(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return '🌐';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
