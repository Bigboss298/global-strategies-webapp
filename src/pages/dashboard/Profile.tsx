import { useState } from 'react'
import { strategistStore } from '../../store/strategistStore'
import { authStore } from '../../store/authStore'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Textarea } from '../../components/ui/Textarea'
import { Label } from '../../components/ui/Label'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'

export const Profile = () => {
  const { user, setUser } = authStore()
  const { updateProfile, isLoading, error } = strategistStore()
  const [formData, setFormData] = useState({
    name: user?.fullName || `${user?.firstName} ${user?.lastName}` || '',
    country: user?.country || '',
    professionalHeadline: user?.headline || '',
    bio: user?.shortBio || '',
  })
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (!user?.id) {
        alert('User ID not found')
        return
      }
      
      await updateProfile(user.id, {
        fullName: formData.name,
        headline: formData.professionalHeadline,
        country: formData.country,
      })
      
      // Profile will be updated in store, refresh user from store
      const { currentStrategist } = strategistStore.getState()
      if (currentStrategist) {
        setUser(currentStrategist)
      }
      alert('Profile updated successfully')
    } catch (err) {
      // Error handled by store
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess('')

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match')
      return
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters')
      return
    }

    try {
      // TODO: Implement password change endpoint in backend
      setPasswordError('Password change feature is not yet implemented')
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || 'Failed to change password')
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile</h1>

      <div className="space-y-6">
        {/* Profile Photo */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Photo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {user?.profilePhotoUrl ? (
                  <img src={user.profilePhotoUrl} alt={user.fullName || `${user.firstName} ${user.lastName}`} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-3xl font-semibold text-gray-600">
                    {user?.firstName?.charAt(0).toUpperCase() || 'U'}
                  </span>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Upload a new profile photo</p>
                <Input type="file" accept="image/*" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user?.email || ''} disabled />
                <p className="text-sm text-gray-500">Email cannot be changed</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="headline">Professional Headline</Label>
                <Input
                  id="headline"
                  value={formData.professionalHeadline}
                  onChange={(e) => setFormData({ ...formData, professionalHeadline: e.target.value })}
                  placeholder="e.g., Global Trade Strategist"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  rows={6}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                />
              </div>

              <Button type="submit" isLoading={isLoading}>
                Update Profile
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              {passwordError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {passwordError}
                </div>
              )}

              {passwordSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
                  {passwordSuccess}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="oldPassword">Current Password</Label>
                <Input
                  id="oldPassword"
                  type="password"
                  value={passwordData.oldPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  required
                  minLength={8}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  required
                />
              </div>

              <Button type="submit">Change Password</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

