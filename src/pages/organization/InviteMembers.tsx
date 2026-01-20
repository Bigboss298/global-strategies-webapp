import { useState, useEffect } from 'react'
import { Mail, AlertCircle, CheckCircle } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { corporateApi } from '../../api/corporate.api'
import { authStore } from '../../store/authStore'

export default function InviteMembers() {
  const { user } = authStore()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [remainingSlots, setRemainingSlots] = useState<number | null>(null)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    if (!user?.corporateAccountId) return
    
    try {
      const dashboard = await corporateApi.getDashboard(user.corporateAccountId)
      setRemainingSlots(dashboard.remainingSlots)
    } catch (err) {
      console.error('Failed to fetch dashboard:', err)
    }
  }

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!email) {
      setError('Please enter an email address')
      return
    }

    if (!user?.corporateAccountId) {
      setError('Corporate account not found')
      return
    }

    setIsLoading(true)
    try {
      await corporateApi.inviteTeamMember({ 
        email, 
        corporateAccountId: user.corporateAccountId 
      })
      setSuccess(`Invitation sent successfully to ${email}!`)
      setEmail('')
      // Refresh dashboard to get updated remaining slots
      await fetchDashboard()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send invitation')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-8 px-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#293749] mb-3">Invite Team Members</h1>
        <p className="text-[#293749]/70 text-lg">Send invitations to strategists to join your organization</p>
      </div>

      {/* Remaining Slots Card */}
      {/* Temporarily comment since payments has been deactivated */}
      {/* {remainingSlots !== null && (
        <Card className="bg-gradient-to-br from-[#05A346] to-[#048A3B] text-[#FEFEFE] shadow-lg">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#FEFEFE]/20 backdrop-blur-sm flex items-center justify-center">
                <Users className="w-8 h-8 text-[#FEFEFE]" />
              </div>
              <div>
                <p className="text-sm text-[#FEFEFE]/80 mb-1">Available Member Slots</p>
                <p className="text-4xl font-bold">{remainingSlots}</p>
              </div>
            </div>
          </div>
        </Card>
      )} */}

      {/* Invite Form */}
      <Card className="shadow-lg">
        <div className="space-y-6 p-6">
          <div className="flex items-center gap-3 pb-6 border-b border-gray-200">
            <div className="w-12 h-12 rounded-full bg-[#183A64]/10 flex items-center justify-center">
              <Mail className="w-6 h-6 text-[#183A64]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#293749]">Send Invitation</h2>
              <p className="text-sm text-[#293749]/70">Invite a strategist by email</p>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="flex items-start gap-3 p-4 bg-green-50 border-l-4 border-[#05A346] rounded-lg">
              <CheckCircle className="w-5 h-5 text-[#05A346] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#05A346]">{success}</p>
            </div>
          )}

          <form onSubmit={handleSendInvite} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#293749] mb-2">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="strategist@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading || remainingSlots === 0}
                className="text-base"
              />
              <p className="text-xs text-[#293749]/60 mt-2">
                The strategist will receive an email with instructions to join your organization
              </p>
            </div>

            <Button
              type="submit"
              disabled={isLoading || remainingSlots === 0 || !email}
              className="w-full sm:w-auto px-8 py-3"
            >
              <Mail className="w-4 h-4 mr-2" />
              {isLoading ? 'Sending...' : 'Send Invitation'}
            </Button>
          </form>

          {remainingSlots === 0 && (
            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
              <p className="text-sm text-yellow-700">
                You have no remaining member slots. Please purchase additional slots to invite more team members.
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Information */}
      <Card className="bg-[#F3F2EF] shadow-md">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-[#293749] mb-4">How it works</h3>
          <ul className="space-y-3 text-sm text-[#293749]/80">
          <li className="flex items-start gap-2">
            <span className="text-[#05A346] font-bold">1.</span>
            <span>Enter the email address of the strategist you want to invite</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#05A346] font-bold">2.</span>
            <span>They'll receive an email with an invitation link</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#05A346] font-bold">3.</span>
            <span>The invitation is valid for 7 days</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#05A346] font-bold">4.</span>
            <span>Once accepted, they'll be added to your organization's team</span>
          </li>
          </ul>
        </div>
      </Card>
    </div>
  )
}
