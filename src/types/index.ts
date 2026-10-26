export type LineType =
  | 'MOBILE'
  | 'FIXED_LINE'
  | 'VOIP'
  | 'TOLL_FREE'
  | 'PREMIUM_RATE'
  | 'SHARED_COST'
  | 'PERSONAL_NUMBER'
  | 'PAGER'
  | 'UAN'
  | 'VOICEMAIL'
  | 'UNKNOWN';

export interface PhoneLookupResult {
  query: string;
  isValid: boolean;
  isPossible: boolean;
  e164: string;
  international: string;
  national: string;
  rfc3966: string;
  countryCode: string; // ISO 2 (e.g. US, IN, GB)
  countryName: string;
  callingCode: string; // e.g. +1, +91
  countryFlag: string;
  lineType: LineType;
  lineTypeLabel: string;
  carrier: string;
  region: string;
  timezones: string[];
  currentTime: string;
  riskScore: 'Low' | 'Medium' | 'Elevated';
  riskReason: string;
  filterMatches?: boolean;
  filterMismatchReason?: string;
  location: {
    lat: number;
    lng: number;
    accuracyKm: number;
    regionName: string;
    cityName?: string;
  };
  disclaimer: string;
  timestamp: string;
}

export interface SearchFilters {
  numberType: 'ALL' | 'MOBILE' | 'FIXED_LINE' | 'VOIP' | 'TOLL_FREE' | 'PREMIUM_RATE';
  country: 'ALL' | string;
}

export interface LiveLocationData {
  latitude: number;
  longitude: number;
  accuracy: number; // in meters
  altitude?: number | null;
  speed?: number | null; // in m/s
  heading?: number | null;
  timestamp: number;
  address?: string;
}

export type ShareSessionStatus =
  | 'pending_consent'
  | 'active'
  | 'stopped'
  | 'expired'
  | 'declined';

export interface ShareSession {
  id: string;
  token: string;
  createdAt: number;
  expiresAt: number;
  durationMinutes: number;
  requesterName: string;
  targetPhone?: string;
  message?: string;
  status: ShareSessionStatus;
  currentLocation?: LiveLocationData;
  history: LiveLocationData[];
  stoppedAt?: number;
  isSimulated?: boolean;
}

export interface CountryOption {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
  formatPlaceholder: string;
}
