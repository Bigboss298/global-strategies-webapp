import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authStore } from '../../store/authStore'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Label } from '../../components/ui/Label'
import { Card } from '../../components/ui/Card'
import type { RegisterIndividualRequest, RegisterCorporateRequest } from '../../types'
import tbpLogo from '../../assets/TBP_logo.jpeg'

type RegistrationType = 'individual' | 'corporate'

export const Register = () => {
  const navigate = useNavigate()
  const { registerIndividual, registerCorporate, isLoading, error, clearError } = authStore()
  const [registrationType, setRegistrationType] = useState<RegistrationType>('individual')
  
  const [individualForm, setIndividualForm] = useState<Omit<RegisterIndividualRequest, 'cvFile'> & { confirmPassword: string; cvFile?: File }>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    certification: '',
    title: '',
    shortBio: '',
    cvFile: undefined,
    country: '',
  })

  const [corporateForm, setCorporateForm] = useState<RegisterCorporateRequest & { confirmPassword: string }>({
    organisationName: '',
    representativeFirstName: '',
    representativeLastName: '',
    representativeEmail: '',
    phoneNumber: '',
    country: '',
    sector: '',
    companyOverview: '',
    contributionInterestAreas: [],
    supportingDocuments: [],
    optionalNotes: '',
    password: '',
    confirmPassword: '',
    declarationAccepted: false,
  })

  const [interestAreasInput, setInterestAreasInput] = useState('')

  const handleIndividualSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    // Frontend validation matching backend rules
    const validationErrors: string[] = []
    
    if (individualForm.firstName.length > 100) {
      validationErrors.push('First name must be 100 characters or less')
    }
    if (individualForm.lastName.length > 100) {
      validationErrors.push('Last name must be 100 characters or less')
    }
    if (individualForm.country.length > 100) {
      validationErrors.push('Country must be 100 characters or less')
    }
    if (individualForm.title.length > 200) {
      validationErrors.push('Professional title must be 200 characters or less')
    }
    if (individualForm.certification.length > 100) {
      validationErrors.push('Certification must be 100 characters or less')
    }
    if (individualForm.shortBio.length > 500) {
      validationErrors.push('Short bio must be 500 characters or less')
    }
    if (individualForm.password.length < 8) {
      validationErrors.push('Password must be at least 8 characters')
    }
    if (individualForm.password.length > 100) {
      validationErrors.push('Password must be 100 characters or less')
    }
    if (individualForm.password !== individualForm.confirmPassword) {
      validationErrors.push('Passwords do not match')
    }

    if (validationErrors.length > 0) {
      alert(validationErrors.join('\n'))
      return
    }

    try {
      const { confirmPassword, ...data } = individualForm
      await registerIndividual(data)
      navigate('/strategist/dashboard')
    } catch (err) {
      // Error is handled by store
    }
  }

  const handleCorporateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    // Frontend validation matching backend rules
    const validationErrors: string[] = []

    if (!corporateForm.organisationName.trim()) {
      validationErrors.push('Organisation name is required')
    }
    if (!corporateForm.representativeFirstName.trim()) {
      validationErrors.push('Representative first name is required')
    }
    if (!corporateForm.representativeLastName.trim()) {
      validationErrors.push('Representative last name is required')
    }
    if (!corporateForm.representativeEmail.trim()) {
      validationErrors.push('Representative email is required')
    }
    if (!corporateForm.phoneNumber.trim()) {
      validationErrors.push('Phone number is required')
    }
    if (!corporateForm.country.trim()) {
      validationErrors.push('Country is required')
    }
    if (!corporateForm.sector.trim()) {
      validationErrors.push('Sector is required')
    }
    if (corporateForm.companyOverview.length < 150) {
      validationErrors.push('Company overview must be at least 150 characters')
    }
    if (corporateForm.companyOverview.length > 600) {
      validationErrors.push('Company overview must be 600 characters or less')
    }
    if (corporateForm.password.length < 8) {
      validationErrors.push('Password must be at least 8 characters')
    }
    if (corporateForm.password.length > 250) {
      validationErrors.push('Password must be 250 characters or less')
    }
    if (corporateForm.password !== corporateForm.confirmPassword) {
      validationErrors.push('Passwords do not match')
    }
    if (!corporateForm.declarationAccepted) {
      validationErrors.push('Please accept the declaration to continue')
    }

    if (validationErrors.length > 0) {
      alert(validationErrors.join('\n'))
      return
    }

    try {
      const { confirmPassword, ...data } = corporateForm
      await registerCorporate(data)
      navigate('/organization/dashboard')
    } catch (err) {
      // Error is handled by store
    }
  }

  const addInterestArea = () => {
    if (interestAreasInput.trim()) {
      setCorporateForm({
        ...corporateForm,
        contributionInterestAreas: [...corporateForm.contributionInterestAreas, interestAreasInput.trim()],
      })
      setInterestAreasInput('')
    }
  }

  const removeInterestArea = (index: number) => {
    setCorporateForm({
      ...corporateForm,
      contributionInterestAreas: corporateForm.contributionInterestAreas.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="min-h-screen bg-[#F3F2EF] flex items-center justify-center py-6 sm:py-8 md:py-12 px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="w-full max-w-2xl">
        {/* TBP Logo/Brand */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <img 
            src={tbpLogo} 
            alt="TBP Logo" 
            className="h-14 sm:h-16 md:h-20 w-auto mx-auto mb-3 sm:mb-4 object-contain"
          />
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#183A64] mb-1 sm:mb-2">Join TBP</h1>
          <p className="text-sm sm:text-base text-[#293749]/70">Create your Global Strategist Platform account</p>
        </div>

        <Card className="p-4 sm:p-6 md:p-8">
          {/* Registration Type Toggle */}
          <div className="flex flex-col sm:flex-row gap-2 mb-4 sm:mb-6 md:mb-8 p-1 bg-gray-100 rounded-xl sm:rounded-full">
            <button
              type="button"
              onClick={() => setRegistrationType('individual')}
              className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-6 rounded-lg sm:rounded-full text-sm sm:text-base font-semibold tbp-transition ${
                registrationType === 'individual'
                  ? 'bg-[#05A346] text-[#FEFEFE] shadow-md'
                  : 'text-[#293749] hover:text-[#183A64]'
              }`}
            >
              Individual Strategist
            </button>
            <button
              type="button"
              onClick={() => setRegistrationType('corporate')}
              className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-6 rounded-lg sm:rounded-full text-sm sm:text-base font-semibold tbp-transition ${
                registrationType === 'corporate'
                  ? 'bg-[#05A346] text-[#FEFEFE] shadow-md'
                  : 'text-[#293749] hover:text-[#183A64]'
              }`}
            >
              Corporate Organization
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-r-md text-xs sm:text-sm mb-4 sm:mb-6">
              {error}
            </div>
          )}

          {/* Individual Registration Form */}
          {registrationType === 'individual' && (
            <form onSubmit={handleIndividualSubmit} className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={individualForm.firstName}
                    onChange={(e) => setIndividualForm({ ...individualForm, firstName: e.target.value })}
                    required
                    maxLength={100}
                  />
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={individualForm.lastName}
                    onChange={(e) => setIndividualForm({ ...individualForm, lastName: e.target.value })}
                    required
                    maxLength={100}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={individualForm.email}
                  onChange={(e) => setIndividualForm({ ...individualForm, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  type="text"
                  placeholder="United States"
                  value={individualForm.country}
                  onChange={(e) => setIndividualForm({ ...individualForm, country: e.target.value })}
                  required
                  maxLength={100}
                />
              </div>

              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="title">Professional Title</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Senior Global Strategist"
                  value={individualForm.title}
                  onChange={(e) => setIndividualForm({ ...individualForm, title: e.target.value })}
                  required
                  maxLength={200}
                />
              </div>

              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="certification">Certification</Label>
                <Input
                  id="certification"
                  type="text"
                  placeholder="Certified Global Strategy Professional"
                  value={individualForm.certification}
                  onChange={(e) => setIndividualForm({ ...individualForm, certification: e.target.value })}
                  required
                  maxLength={100}
                />
              </div>

              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="shortBio">Short Bio</Label>
                <textarea
                  id="shortBio"
                  placeholder="Tell us about your expertise and experience..."
                  value={individualForm.shortBio}
                  onChange={(e) => setIndividualForm({ ...individualForm, shortBio: e.target.value })}
                  required
                  maxLength={500}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px] sm:min-h-[100px]"
                />
                <p className={`text-xs sm:text-sm ${individualForm.shortBio.length > 450 ? 'text-orange-500' : 'text-gray-500'} ${individualForm.shortBio.length >= 500 ? 'text-red-500 font-medium' : ''}`}>
                  {individualForm.shortBio.length}/500 characters
                </p>
              </div>

              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="cvFile">CV/Resume (Optional - PDF only)</Label>
                <Input
                  id="cvFile"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setIndividualForm({ ...individualForm, cvFile: e.target.files?.[0] })}
                />
                {individualForm.cvFile && (
                  <p className="text-xs sm:text-sm text-[#293749]/70 mt-1">Selected: {individualForm.cvFile.name}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={individualForm.password}
                    onChange={(e) => setIndividualForm({ ...individualForm, password: e.target.value })}
                    required
                    minLength={8}
                    maxLength={100}
                  />
                  <p className="text-xs text-gray-500">Minimum 8 characters</p>
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={individualForm.confirmPassword}
                    onChange={(e) => setIndividualForm({ ...individualForm, confirmPassword: e.target.value })}
                    required
                    minLength={8}
                    maxLength={100}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full text-sm sm:text-base" size="lg" isLoading={isLoading}>
                Create Individual Account
              </Button>

              <div className="text-center text-xs sm:text-sm text-[#293749]/70">
                Already have an account?{' '}
                <Link to="/login" className="text-[#05A346] hover:text-[#048A3B] font-medium tbp-transition">
                  Sign In
                </Link>
              </div>
            </form>
          )}

          {/* Corporate Registration Form */}
          {registrationType === 'corporate' && (
            <form onSubmit={handleCorporateSubmit} className="space-y-3 sm:space-y-4">
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="organisationName">Organization Name</Label>
                <Input
                  id="organisationName"
                  type="text"
                  placeholder="Acme Corporation"
                  value={corporateForm.organisationName}
                  onChange={(e) => setCorporateForm({ ...corporateForm, organisationName: e.target.value })}
                  required
                />
              </div>

              <div className="border-t pt-3 sm:pt-4">
                <h3 className="font-medium text-sm sm:text-base text-gray-900 mb-2 sm:mb-3">Representative Information</h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-1 sm:space-y-2">
                      <Label htmlFor="repFirstName">First Name</Label>
                      <Input
                        id="repFirstName"
                        type="text"
                        placeholder="John"
                        value={corporateForm.representativeFirstName}
                        onChange={(e) => setCorporateForm({ ...corporateForm, representativeFirstName: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-1 sm:space-y-2">
                      <Label htmlFor="repLastName">Last Name</Label>
                      <Input
                        id="repLastName"
                        type="text"
                        placeholder="Doe"
                        value={corporateForm.representativeLastName}
                        onChange={(e) => setCorporateForm({ ...corporateForm, representativeLastName: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1 sm:space-y-2">
                    <Label htmlFor="repEmail">Email</Label>
                    <Input
                      id="repEmail"
                      type="email"
                      placeholder="john.doe@acme.com"
                      value={corporateForm.representativeEmail}
                      onChange={(e) => setCorporateForm({ ...corporateForm, representativeEmail: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-1 sm:space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="+1 234 567 8900"
                      value={corporateForm.phoneNumber}
                      onChange={(e) => setCorporateForm({ ...corporateForm, phoneNumber: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-3 sm:pt-4">
                <h3 className="font-medium text-sm sm:text-base text-gray-900 mb-2 sm:mb-3">Company Details</h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-1 sm:space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        type="text"
                        placeholder="United States"
                        value={corporateForm.country}
                        onChange={(e) => setCorporateForm({ ...corporateForm, country: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-1 sm:space-y-2">
                      <Label htmlFor="sector">Sector</Label>
                      <Input
                        id="sector"
                        type="text"
                        placeholder="Technology"
                        value={corporateForm.sector}
                        onChange={(e) => setCorporateForm({ ...corporateForm, sector: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1 sm:space-y-2">
                    <Label htmlFor="companyOverview">Company Overview (150-600 characters)</Label>
                    <textarea
                      id="companyOverview"
                      placeholder="Describe your organization, its mission, and core activities..."
                      value={corporateForm.companyOverview}
                      onChange={(e) => setCorporateForm({ ...corporateForm, companyOverview: e.target.value })}
                      required
                      minLength={150}
                      maxLength={600}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px] sm:min-h-[100px]"
                    />
                    <p className={`text-xs ${corporateForm.companyOverview.length < 150 ? 'text-orange-500' : 'text-gray-500'} ${corporateForm.companyOverview.length >= 600 ? 'text-red-500 font-medium' : ''}`}>
                      {corporateForm.companyOverview.length}/600 characters {corporateForm.companyOverview.length < 150 && `(minimum 150)`}
                    </p>
                  </div>

                  <div className="space-y-1 sm:space-y-2">
                    <Label htmlFor="interestAreas">Contribution Interest Areas</Label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Input
                        id="interestAreas"
                        type="text"
                        placeholder="e.g., Climate Change, Economic Development"
                        value={interestAreasInput}
                        onChange={(e) => setInterestAreasInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterestArea())}
                      />
                      <Button type="button" onClick={addInterestArea} variant="outline" className="shrink-0">
                        Add
                      </Button>
                    </div>
                    {corporateForm.contributionInterestAreas.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {corporateForm.contributionInterestAreas.map((area, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm"
                          >
                            {area}
                            <button
                              type="button"
                              onClick={() => removeInterestArea(index)}
                              className="hover:text-blue-600"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1 sm:space-y-2">
                    <Label htmlFor="optionalNotes">Optional Notes</Label>
                    <textarea
                      id="optionalNotes"
                      placeholder="Any additional information you'd like to share..."
                      value={corporateForm.optionalNotes}
                      onChange={(e) => setCorporateForm({ ...corporateForm, optionalNotes: e.target.value })}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[60px] sm:min-h-[80px]"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-3 sm:pt-4">
                <h3 className="font-medium text-sm sm:text-base text-gray-900 mb-2 sm:mb-3">Security</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1 sm:space-y-2">
                    <Label htmlFor="corpPassword">Password</Label>
                    <Input
                      id="corpPassword"
                      type="password"
                      placeholder="••••••••"
                      value={corporateForm.password}
                      onChange={(e) => setCorporateForm({ ...corporateForm, password: e.target.value })}
                      required
                      minLength={8}
                      maxLength={250}
                    />
                    <p className="text-xs text-gray-500">Minimum 8 characters</p>
                  </div>

                  <div className="space-y-1 sm:space-y-2">
                    <Label htmlFor="corpConfirmPassword">Confirm Password</Label>
                    <Input
                      id="corpConfirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={corporateForm.confirmPassword}
                      onChange={(e) => setCorporateForm({ ...corporateForm, confirmPassword: e.target.value })}
                      required
                      minLength={8}
                      maxLength={250}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="declaration"
                  checked={corporateForm.declarationAccepted}
                  onChange={(e) => setCorporateForm({ ...corporateForm, declarationAccepted: e.target.checked })}
                  className="mt-1 h-4 w-4"
                  required
                />
                <Label htmlFor="declaration" className="text-xs sm:text-sm text-gray-600 cursor-pointer">
                  I declare that the information provided is accurate and I have the authority to represent this
                  organization.
                </Label>
              </div>

              <Button type="submit" className="w-full text-sm sm:text-base" size="lg" isLoading={isLoading}>
                Create Corporate Account
              </Button>

              <div className="text-center text-xs sm:text-sm text-[#293749]/70">
                Already have an account?{' '}
                <Link to="/login" className="text-[#05A346] hover:text-[#048A3B] font-medium tbp-transition">
                  Sign In
                </Link>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  )
}

