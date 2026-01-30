import { useEffect, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { adminDashboardStore } from '../../store/admin/adminDashboardStore';

const BADGE_TYPES = [
  { value: 0, label: 'None' },
  { value: 1, label: 'Verified' },
  { value: 2, label: 'Expert' },
  { value: 3, label: 'Premium' },
  { value: 4, label: 'Corporate' },
];

export const BadgeManagement = () => {
  const {
    users,
    isLoading,
    error,
    fetchUsersForBadgeManagement,
    updateUserBadge,
    clearError,
  } = adminDashboardStore();

  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [editBadgeType, setEditBadgeType] = useState<number>(0);
  const [editIsVerified, setEditIsVerified] = useState<boolean>(false);
  const [editVerificationNote, setEditVerificationNote] = useState<string>('');

  useEffect(() => {
    fetchUsersForBadgeManagement();
    // eslint-disable-next-line
  }, []);

  const startEdit = (user: any) => {
    setEditUserId(user.id);
    setEditBadgeType(user.badgeType);
    setEditIsVerified(user.isVerified);
    setEditVerificationNote(user.verificationNote || '');
    clearError();
  };

  const cancelEdit = () => {
    setEditUserId(null);
    setEditBadgeType(0);
    setEditIsVerified(false);
    setEditVerificationNote('');
    clearError();
  };

  const saveBadge = async () => {
    if (!editUserId) return;
    try {
      await updateUserBadge(editUserId, {
        isVerified: editIsVerified,
        badgeType: editBadgeType,
        verificationNote: editVerificationNote,
      });
      cancelEdit();
    } catch {
      // error handled by store
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Badge Management</h1>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <Card className="p-4">
        <h2 className="font-semibold mb-2">Users & Badge Status</h2>
        <table className="w-full border">
          <thead>
            <tr>
              <th className="border px-2 py-1">User</th>
              <th className="border px-2 py-1">Badge</th>
              <th className="border px-2 py-1">Verified</th>
              <th className="border px-2 py-1">Note</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="border px-2 py-1">{user.firstName} {user.lastName}<br /><span className="text-xs text-gray-500">{user.email}</span></td>
                <td className="border px-2 py-1">
                  {editUserId === user.id ? (
                    <select value={editBadgeType} onChange={e => setEditBadgeType(Number(e.target.value))} className="border rounded px-2 py-1">
                      {BADGE_TYPES.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
                    </select>
                  ) : (
                    BADGE_TYPES.find(b => b.value === user.badgeType)?.label || 'None'
                  )}
                </td>
                <td className="border px-2 py-1">
                  {editUserId === user.id ? (
                    <input type="checkbox" checked={editIsVerified} onChange={e => setEditIsVerified(e.target.checked)} />
                  ) : (
                    user.isVerified ? 'Yes' : 'No'
                  )}
                </td>
                <td className="border px-2 py-1">
                  {editUserId === user.id ? (
                    <input type="text" value={editVerificationNote} onChange={e => setEditVerificationNote(e.target.value)} className="border rounded px-2 py-1 w-full" />
                  ) : (
                    user.verificationNote || ''
                  )}
                </td>
                <td className="border px-2 py-1">
                  {editUserId === user.id ? (
                    <>
                      <Button size="sm" onClick={saveBadge} disabled={isLoading}>Save</Button>
                      <Button size="sm" variant="outline" onClick={cancelEdit} disabled={isLoading} className="ml-2">Cancel</Button>
                    </>
                  ) : (
                    <Button size="sm" onClick={() => startEdit(user)} disabled={isLoading}>Edit</Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
