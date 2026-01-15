/**
 * Country name to flag emoji mapping utility
 * Uses Unicode flag emojis based on ISO 3166-1 alpha-2 codes
 */

interface CountryData {
  name: string
  code: string
  flag: string
}

// ISO 3166-1 alpha-2 country codes to names
const COUNTRY_CODE_TO_NAME: Record<string, string> = {
  'AF': 'Afghanistan', 'AL': 'Albania', 'DZ': 'Algeria', 'AD': 'Andorra', 'AO': 'Angola',
  'AR': 'Argentina', 'AM': 'Armenia', 'AU': 'Australia', 'AT': 'Austria', 'AZ': 'Azerbaijan',
  'BS': 'Bahamas', 'BH': 'Bahrain', 'BD': 'Bangladesh', 'BB': 'Barbados', 'BY': 'Belarus',
  'BE': 'Belgium', 'BZ': 'Belize', 'BJ': 'Benin', 'BT': 'Bhutan', 'BO': 'Bolivia',
  'BA': 'Bosnia and Herzegovina', 'BW': 'Botswana', 'BR': 'Brazil', 'BN': 'Brunei', 'BG': 'Bulgaria',
  'BF': 'Burkina Faso', 'BI': 'Burundi', 'KH': 'Cambodia', 'CM': 'Cameroon', 'CA': 'Canada',
  'CV': 'Cape Verde', 'CF': 'Central African Republic', 'TD': 'Chad', 'CL': 'Chile', 'CN': 'China',
  'CO': 'Colombia', 'KM': 'Comoros', 'CG': 'Congo', 'CR': 'Costa Rica', 'HR': 'Croatia',
  'CU': 'Cuba', 'CY': 'Cyprus', 'CZ': 'Czech Republic', 'DK': 'Denmark', 'DJ': 'Djibouti',
  'DM': 'Dominica', 'DO': 'Dominican Republic', 'EC': 'Ecuador', 'EG': 'Egypt', 'SV': 'El Salvador',
  'GQ': 'Equatorial Guinea', 'ER': 'Eritrea', 'EE': 'Estonia', 'ET': 'Ethiopia', 'FJ': 'Fiji',
  'FI': 'Finland', 'FR': 'France', 'GA': 'Gabon', 'GM': 'Gambia', 'GE': 'Georgia',
  'DE': 'Germany', 'GH': 'Ghana', 'GR': 'Greece', 'GD': 'Grenada', 'GT': 'Guatemala',
  'GN': 'Guinea', 'GW': 'Guinea-Bissau', 'GY': 'Guyana', 'HT': 'Haiti', 'HN': 'Honduras',
  'HU': 'Hungary', 'IS': 'Iceland', 'IN': 'India', 'ID': 'Indonesia', 'IR': 'Iran',
  'IQ': 'Iraq', 'IE': 'Ireland', 'IL': 'Israel', 'IT': 'Italy', 'JM': 'Jamaica',
  'JP': 'Japan', 'JO': 'Jordan', 'KZ': 'Kazakhstan', 'KE': 'Kenya', 'KI': 'Kiribati',
  'KP': 'North Korea', 'KR': 'South Korea', 'KW': 'Kuwait', 'KG': 'Kyrgyzstan', 'LA': 'Laos',
  'LV': 'Latvia', 'LB': 'Lebanon', 'LS': 'Lesotho', 'LR': 'Liberia', 'LY': 'Libya',
  'LI': 'Liechtenstein', 'LT': 'Lithuania', 'LU': 'Luxembourg', 'MK': 'North Macedonia', 'MG': 'Madagascar',
  'MW': 'Malawi', 'MY': 'Malaysia', 'MV': 'Maldives', 'ML': 'Mali', 'MT': 'Malta',
  'MH': 'Marshall Islands', 'MR': 'Mauritania', 'MU': 'Mauritius', 'MX': 'Mexico', 'FM': 'Micronesia',
  'MD': 'Moldova', 'MC': 'Monaco', 'MN': 'Mongolia', 'ME': 'Montenegro', 'MA': 'Morocco',
  'MZ': 'Mozambique', 'MM': 'Myanmar', 'NA': 'Namibia', 'NR': 'Nauru', 'NP': 'Nepal',
  'NL': 'Netherlands', 'NZ': 'New Zealand', 'NI': 'Nicaragua', 'NE': 'Niger', 'NG': 'Nigeria',
  'NO': 'Norway', 'OM': 'Oman', 'PK': 'Pakistan', 'PW': 'Palau', 'PA': 'Panama',
  'PG': 'Papua New Guinea', 'PY': 'Paraguay', 'PE': 'Peru', 'PH': 'Philippines', 'PL': 'Poland',
  'PT': 'Portugal', 'QA': 'Qatar', 'RO': 'Romania', 'RU': 'Russia', 'RW': 'Rwanda',
  'KN': 'Saint Kitts and Nevis', 'LC': 'Saint Lucia', 'VC': 'Saint Vincent and the Grenadines',
  'WS': 'Samoa', 'SM': 'San Marino', 'ST': 'Sao Tome and Principe', 'SA': 'Saudi Arabia',
  'SN': 'Senegal', 'RS': 'Serbia', 'SC': 'Seychelles', 'SL': 'Sierra Leone', 'SG': 'Singapore',
  'SK': 'Slovakia', 'SI': 'Slovenia', 'SB': 'Solomon Islands', 'SO': 'Somalia', 'ZA': 'South Africa',
  'SS': 'South Sudan', 'ES': 'Spain', 'LK': 'Sri Lanka', 'SD': 'Sudan', 'SR': 'Suriname',
  'SZ': 'Eswatini', 'SE': 'Sweden', 'CH': 'Switzerland', 'SY': 'Syria', 'TW': 'Taiwan',
  'TJ': 'Tajikistan', 'TZ': 'Tanzania', 'TH': 'Thailand', 'TL': 'Timor-Leste', 'TG': 'Togo',
  'TO': 'Tonga', 'TT': 'Trinidad and Tobago', 'TN': 'Tunisia', 'TR': 'Turkey', 'TM': 'Turkmenistan',
  'TV': 'Tuvalu', 'UG': 'Uganda', 'UA': 'Ukraine', 'AE': 'United Arab Emirates', 'GB': 'United Kingdom',
  'US': 'United States', 'UY': 'Uruguay', 'UZ': 'Uzbekistan', 'VU': 'Vanuatu', 'VA': 'Vatican City',
  'VE': 'Venezuela', 'VN': 'Vietnam', 'YE': 'Yemen', 'ZM': 'Zambia', 'ZW': 'Zimbabwe'
}

// Comprehensive country to flag mapping
const COUNTRY_FLAGS: Record<string, string> = {
  // A
  'Afghanistan': '🇦🇫',
  'Albania': '🇦🇱',
  'Algeria': '🇩🇿',
  'Andorra': '🇦🇩',
  'Angola': '🇦🇴',
  'Argentina': '🇦🇷',
  'Armenia': '🇦🇲',
  'Australia': '🇦🇺',
  'Austria': '🇦🇹',
  'Azerbaijan': '🇦🇿',
  // B
  'Bahamas': '🇧🇸',
  'Bahrain': '🇧🇭',
  'Bangladesh': '🇧🇩',
  'Barbados': '🇧🇧',
  'Belarus': '🇧🇾',
  'Belgium': '🇧🇪',
  'Belize': '🇧🇿',
  'Benin': '🇧🇯',
  'Bhutan': '🇧🇹',
  'Bolivia': '🇧🇴',
  'Bosnia and Herzegovina': '🇧🇦',
  'Botswana': '🇧🇼',
  'Brazil': '🇧🇷',
  'Brunei': '🇧🇳',
  'Bulgaria': '🇧🇬',
  'Burkina Faso': '🇧🇫',
  'Burundi': '🇧🇮',
  // C
  'Cambodia': '🇰🇭',
  'Cameroon': '🇨🇲',
  'Canada': '🇨🇦',
  'Cape Verde': '🇨🇻',
  'Central African Republic': '🇨🇫',
  'Chad': '🇹🇩',
  'Chile': '🇨🇱',
  'China': '🇨🇳',
  'Colombia': '🇨🇴',
  'Comoros': '🇰🇲',
  'Congo': '🇨🇬',
  'Costa Rica': '🇨🇷',
  'Croatia': '🇭🇷',
  'Cuba': '🇨🇺',
  'Cyprus': '🇨🇾',
  'Czech Republic': '🇨🇿',
  'Czechia': '🇨🇿',
  // D
  'Denmark': '🇩🇰',
  'Djibouti': '🇩🇯',
  'Dominica': '🇩🇲',
  'Dominican Republic': '🇩🇴',
  // E
  'Ecuador': '🇪🇨',
  'Egypt': '🇪🇬',
  'El Salvador': '🇸🇻',
  'Equatorial Guinea': '🇬🇶',
  'Eritrea': '🇪🇷',
  'Estonia': '🇪🇪',
  'Ethiopia': '🇪🇹',
  // F
  'Fiji': '🇫🇯',
  'Finland': '🇫🇮',
  'France': '🇫🇷',
  // G
  'Gabon': '🇬🇦',
  'Gambia': '🇬🇲',
  'Georgia': '🇬🇪',
  'Germany': '🇩🇪',
  'Ghana': '🇬🇭',
  'Greece': '🇬🇷',
  'Grenada': '🇬🇩',
  'Guatemala': '🇬🇹',
  'Guinea': '🇬🇳',
  'Guinea-Bissau': '🇬🇼',
  'Guyana': '🇬🇾',
  // H
  'Haiti': '🇭🇹',
  'Honduras': '🇭🇳',
  'Hungary': '🇭🇺',
  // I
  'Iceland': '🇮🇸',
  'India': '🇮🇳',
  'Indonesia': '🇮🇩',
  'Iran': '🇮🇷',
  'Iraq': '🇮🇶',
  'Ireland': '🇮🇪',
  'Israel': '🇮🇱',
  'Italy': '🇮🇹',
  'Ivory Coast': '🇨🇮',
  // J
  'Jamaica': '🇯🇲',
  'Japan': '🇯🇵',
  'Jordan': '🇯🇴',
  // K
  'Kazakhstan': '🇰🇿',
  'Kenya': '🇰🇪',
  'Kiribati': '🇰🇮',
  'Kuwait': '🇰🇼',
  'Kyrgyzstan': '🇰🇬',
  // L
  'Laos': '🇱🇦',
  'Latvia': '🇱🇻',
  'Lebanon': '🇱🇧',
  'Lesotho': '🇱🇸',
  'Liberia': '🇱🇷',
  'Libya': '🇱🇾',
  'Liechtenstein': '🇱🇮',
  'Lithuania': '🇱🇹',
  'Luxembourg': '🇱🇺',
  // M
  'Madagascar': '🇲🇬',
  'Malawi': '🇲🇼',
  'Malaysia': '🇲🇾',
  'Maldives': '🇲🇻',
  'Mali': '🇲🇱',
  'Malta': '🇲🇹',
  'Marshall Islands': '🇲🇭',
  'Mauritania': '🇲🇷',
  'Mauritius': '🇲🇺',
  'Mexico': '🇲🇽',
  'Micronesia': '🇫🇲',
  'Moldova': '🇲🇩',
  'Monaco': '🇲🇨',
  'Mongolia': '🇲🇳',
  'Montenegro': '🇲🇪',
  'Morocco': '🇲🇦',
  'Mozambique': '🇲🇿',
  'Myanmar': '🇲🇲',
  // N
  'Namibia': '🇳🇦',
  'Nauru': '🇳🇷',
  'Nepal': '🇳🇵',
  'Netherlands': '🇳🇱',
  'New Zealand': '🇳🇿',
  'Nicaragua': '🇳🇮',
  'Niger': '🇳🇪',
  'Nigeria': '🇳🇬',
  'North Korea': '🇰🇵',
  'North Macedonia': '🇲🇰',
  'Norway': '🇳🇴',
  // O
  'Oman': '🇴🇲',
  // P
  'Pakistan': '🇵🇰',
  'Palau': '🇵🇼',
  'Palestine': '🇵🇸',
  'Panama': '🇵🇦',
  'Papua New Guinea': '🇵🇬',
  'Paraguay': '🇵🇾',
  'Peru': '🇵🇪',
  'Philippines': '🇵🇭',
  'Poland': '🇵🇱',
  'Portugal': '🇵🇹',
  // Q
  'Qatar': '🇶🇦',
  // R
  'Romania': '🇷🇴',
  'Russia': '🇷🇺',
  'Russian Federation': '🇷🇺',
  'Rwanda': '🇷🇼',
  // S
  'Saint Lucia': '🇱🇨',
  'Samoa': '🇼🇸',
  'San Marino': '🇸🇲',
  'Saudi Arabia': '🇸🇦',
  'Senegal': '🇸🇳',
  'Serbia': '🇷🇸',
  'Seychelles': '🇸🇨',
  'Sierra Leone': '🇸🇱',
  'Singapore': '🇸🇬',
  'Slovakia': '🇸🇰',
  'Slovenia': '🇸🇮',
  'Solomon Islands': '🇸🇧',
  'Somalia': '🇸🇴',
  'South Africa': '🇿🇦',
  'South Korea': '🇰🇷',
  'South Sudan': '🇸🇸',
  'Spain': '🇪🇸',
  'Sri Lanka': '🇱🇰',
  'Sudan': '🇸🇩',
  'Suriname': '🇸🇷',
  'Sweden': '🇸🇪',
  'Switzerland': '🇨🇭',
  'Syria': '🇸🇾',
  // T
  'Taiwan': '🇹🇼',
  'Tajikistan': '🇹🇯',
  'Tanzania': '🇹🇿',
  'Thailand': '🇹🇭',
  'Timor-Leste': '🇹🇱',
  'Togo': '🇹🇬',
  'Tonga': '🇹🇴',
  'Trinidad and Tobago': '🇹🇹',
  'Tunisia': '🇹🇳',
  'Turkey': '🇹🇷',
  'Turkmenistan': '🇹🇲',
  'Tuvalu': '🇹🇻',
  // U
  'Uganda': '🇺🇬',
  'Ukraine': '🇺🇦',
  'United Arab Emirates': '🇦🇪',
  'UAE': '🇦🇪',
  'United Kingdom': '🇬🇧',
  'UK': '🇬🇧',
  'United States': '🇺🇸',
  'USA': '🇺🇸',
  'United States of America': '🇺🇸',
  'Uruguay': '🇺🇾',
  'Uzbekistan': '🇺🇿',
  // V
  'Vanuatu': '🇻🇺',
  'Vatican City': '🇻🇦',
  'Venezuela': '🇻🇪',
  'Vietnam': '🇻🇳',
  // Y
  'Yemen': '🇾🇪',
  // Z
  'Zambia': '🇿🇲',
  'Zimbabwe': '🇿🇼',
}

// Cache for normalized lookups
const flagCache = new Map<string, string>()

/**
 * Normalize country name for lookup
 * - Converts to lowercase
 * - Removes special characters
 * - Trims whitespace
 */
function normalizeCountryName(country: string): string {
  return country
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '')
}

/**
 * Convert ISO 3166-1 alpha-2 country code to flag emoji
 * @param code - 2-letter country code (e.g., 'US', 'NG', 'GB')
 * @returns Flag emoji
 */
function countryCodeToFlag(code: string): string {
  if (!code || code.length !== 2) return ''
  
  const codePoints = code
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0))
  
  return String.fromCodePoint(...codePoints)
}

/**
 * Get flag emoji for a country name or code
 * @param countryName - The name or 2-letter code of the country
 * @returns Flag emoji or empty string if not found
 */
export function getCountryFlag(countryName: string | null | undefined): string {
  if (!countryName) return ''
  
  const trimmed = countryName.trim()
  
  // Check if it's a 2-letter country code
  if (trimmed.length === 2 && /^[A-Za-z]{2}$/.test(trimmed)) {
    return countryCodeToFlag(trimmed)
  }
  
  // Check cache first
  const cacheKey = normalizeCountryName(trimmed)
  if (flagCache.has(cacheKey)) {
    return flagCache.get(cacheKey)!
  }
  
  // Try exact match first
  let flag = COUNTRY_FLAGS[trimmed]
  
  // If not found, try normalized match
  if (!flag) {
    const normalized = cacheKey
    const matchedKey = Object.keys(COUNTRY_FLAGS).find(
      key => normalizeCountryName(key) === normalized
    )
    flag = matchedKey ? COUNTRY_FLAGS[matchedKey] : ''
  }
  
  // Cache the result
  flagCache.set(cacheKey, flag)
  
  return flag
}

/**
 * Get full country name from ISO code or return the input if it's already a name
 * @param countryInput - 2-letter ISO code or full country name
 * @returns Full country name
 */
export function getCountryName(countryInput: string | null | undefined): string {
  if (!countryInput) return ''
  
  const trimmed = countryInput.trim()
  
  // Check if it's a 2-letter country code
  if (trimmed.length === 2 && /^[A-Za-z]{2}$/.test(trimmed)) {
    return COUNTRY_CODE_TO_NAME[trimmed.toUpperCase()] || trimmed
  }
  
  // Otherwise return as-is (it's already a name)
  return trimmed
}

/**
 * Get country data including flag and name
 * @param countryInput - The ISO code or name of the country
 * @returns Country data object
 */
export function getCountryData(countryInput: string | null | undefined): CountryData | null {
  if (!countryInput) return null
  
  const name = getCountryName(countryInput)
  const flag = getCountryFlag(countryInput)
  
  return {
    name,
    code: countryInput.length === 2 ? countryInput.toUpperCase() : '',
    flag,
  }
}

/**
 * Check if a country has a flag mapping
 * @param countryName - The name of the country
 * @returns True if flag exists
 */
export function hasCountryFlag(countryName: string | null | undefined): boolean {
  return !!getCountryFlag(countryName)
}

export default {
  getCountryFlag,
  getCountryName,
  getCountryData,
  hasCountryFlag,
}
