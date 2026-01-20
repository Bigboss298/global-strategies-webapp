import { useEffect } from 'react'
import { organizationDashboardStore } from '../../store/organization/organizationDashboardStore'
import { authStore } from '../../store/authStore'
import { CountryFlag } from '../../components/ui/CountryFlag'

export default function OrganizationOverview() {
  const user = authStore((state) => state.user)
  const { strategists, reports, fetchOrganizationStrategists, fetchOrganizationReports, setOrganizationId } = organizationDashboardStore()

  useEffect(() => {
    if (user?.corporateAccountId) {
      setOrganizationId(user.corporateAccountId)
      fetchOrganizationStrategists()
      fetchOrganizationReports()
    }
  }, [user])

  const stats = [
    {
      label: 'Our Strategists',
      value: strategists.length,
      color: 'bg-[#183A64]',
    },
    {
      label: 'Total Reports',
      value: reports.length,
      color: 'bg-[#05A346]',
    },
    {
      label: 'This Month',
      value: reports.filter((r) => {
        const date = new Date(r.dateCreated)
        const now = new Date()
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
      }).length,
      color: 'bg-[#293749]',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Member Slots Card */}
      {/* Temporarily commendted out since payments has been deactivated */}
      {/* {dashboard && (
        <div className="bg-gradient-to-br from-[#05A346] to-[#048A3B] rounded-2xl p-6 text-[#FEFEFE] tbp-card-shadow">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5" />
                <h3 className="font-semibold">Team Member Capacity</h3>
              </div>
              <p className="text-[#FEFEFE]/90 text-sm mb-4">
                Monitor your organization's available member slots
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[#FEFEFE]/70 text-xs mb-1">Total Slots</p>
                  <p className="text-2xl font-bold">{dashboard.totalSlots}</p>
                </div>
                <div>
                  <p className="text-[#FEFEFE]/70 text-xs mb-1">Used Slots</p>
                  <p className="text-2xl font-bold">{dashboard.usedMemberSlots}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[#FEFEFE]/70 text-sm mb-1">Remaining</p>
              <div className="w-20 h-20 rounded-full bg-[#FEFEFE]/20 backdrop-blur-sm flex items-center justify-center">
                <span className="text-3xl font-bold">{dashboard.remainingSlots}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-[#FEFEFE]/20 text-sm text-[#FEFEFE]/80">
            Free: {dashboard.freeMemberSlots} • Paid: {dashboard.paidMemberSlots}
          </div>
        </div>
      )} */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-[#FEFEFE] rounded-2xl tbp-card-shadow p-6"
          >
            <div className={`w-12 h-12 ${stat.color} rounded-xl mb-4 flex items-center justify-center text-[#FEFEFE] font-bold text-lg`}>
              {stat.value}
            </div>
            <p className="text-[#293749]/70 text-sm">{stat.label}</p>
            <p className="text-3xl font-bold text-[#293749] mt-2">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Strategists */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Recent Strategists</h3>
          <div className="space-y-3">
            {strategists.slice(0, 5).map((strategist) => (
              <div key={strategist.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    {strategist.firstName} {strategist.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{strategist.email}</p>
                </div>
                <CountryFlag countryName={strategist.countryName} />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Recent Reports</h3>
          <div className="space-y-3">
            {reports.slice(0, 5).map((report) => (
              <div key={report.id} className="border-b pb-2">
                <p className="font-medium text-gray-900">{report.title}</p>
                <p className="text-sm text-gray-500">
                  {new Date(report.dateCreated).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
