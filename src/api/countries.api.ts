import axios from 'axios'

const COUNTRIES_API_BASE = 'https://restcountries.com/v3.1'

export interface CountryFlag {
  png: string
  svg: string
  alt?: string
}

export interface CountryApiResponse {
  name: {
    common: string
    official: string
  }
  flags: CountryFlag
  cca2: string
  cca3: string
}

export const countries = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan',
  'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia',
  'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi',
  'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia',
  'Comoros', 'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic',
  'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic',
  'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia',
  'Fiji', 'Finland', 'France',
  'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana',
  'Haiti', 'Honduras', 'Hungary',
  'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy',
  'Jamaica', 'Japan', 'Jordan',
  'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan',
  'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg',
  'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius',
  'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar',
  'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway',
  'Oman',
  'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal',
  'Qatar',
  'Romania', 'Russia', 'Rwanda',
  'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe',
  'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands',
  'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria',
  'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey',
  'Turkmenistan', 'Tuvalu',
  'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan',
  'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam',
  'Yemen',
  'Zambia', 'Zimbabwe'
]

export const countriesApi = {
  /**
   * Fetches country flag by country name
   * @param countryName - The name of the country (e.g., "Nigeria", "United States")
   * @returns The flag URLs (PNG and SVG) or null if not found
   */
  getCountryFlag: async (countryName: string): Promise<CountryFlag | null> => {
    try {
      const response = await axios.get<CountryApiResponse[]>(
        `${COUNTRIES_API_BASE}/name/${encodeURIComponent(countryName)}`
      )
      
      if (response.data && response.data.length > 0) {
        return response.data[0].flags
      }
      
      return null
    } catch (error) {
      console.error(`Error fetching flag for country: ${countryName}`, error)
      return null
    }
  },

  /**
   * Fetches country information including flag by country name
   * @param countryName - The name of the country
   * @returns The full country data or null if not found
   */
  getCountryInfo: async (countryName: string): Promise<CountryApiResponse | null> => {
    try {
      const response = await axios.get<CountryApiResponse[]>(
        `${COUNTRIES_API_BASE}/name/${encodeURIComponent(countryName)}`
      )
      
      if (response.data && response.data.length > 0) {
        return response.data[0]
      }
      
      return null
    } catch (error) {
      console.error(`Error fetching country info: ${countryName}`, error)
      return null
    }
  },

  /**
   * Gets the PNG flag URL for a country
   * @param countryName - The name of the country
   * @returns The PNG flag URL or an empty string if not found
   */
  getCountryFlagPng: async (countryName: string): Promise<string> => {
    const flag = await countriesApi.getCountryFlag(countryName)
    return flag?.png || ''
  },

  /**
   * Gets the SVG flag URL for a country
   * @param countryName - The name of the country
   * @returns The SVG flag URL or an empty string if not found
   */
  getCountryFlagSvg: async (countryName: string): Promise<string> => {
    const flag = await countriesApi.getCountryFlag(countryName)
    return flag?.svg || ''
  },
}
