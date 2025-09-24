import client from '@/apollo/client';
import { useUnbanUserMutation } from '@/apollo/mutation/unban-user.generated';
import { AdminUsersDocument, type AdminUsersQuery } from '@/apollo/queries/admin-users.generated';
import { Button } from '@/components/ui/button';
import { RotateCcw, UserCheck } from 'lucide-react';
import { useState } from 'react';

type User = NonNullable<NonNullable<AdminUsersQuery['adminUsers']>['data']>[0];

interface UnbanUsersTableActionsProps {
  selectedUsers: User[];
  onReset: () => void;
  onSelectionCleared?: () => void;
}

export const UnbanUsersTableActions = ({
  selectedUsers,
  onReset,
  onSelectionCleared,
}: UnbanUsersTableActionsProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [unbanUserMutation] = useUnbanUserMutation();

  const hasSelectedUsers = selectedUsers.length > 0;

  const handleSaveChanges = async () => {
    console.log('💾 Unbanning selected users:', selectedUsers);
    setIsSaving(true);

    try {
      // Execute mutation for each selected user
      const unbanPromises = selectedUsers.map((user) => {
        if (user.id) {
          console.log(`🔄 Unbanning user: ${user.id}`);
          return unbanUserMutation({
            variables: { userId: user.id },
          });
        }
        return Promise.resolve();
      });

      // Wait for all mutations to complete
      await Promise.all(unbanPromises);

      console.log(
        '✅ Users unbanned successfully:',
        selectedUsers.map((u) => u.id),
      );

      // Clear selection after successful unbanning
      onSelectionCleared?.();

      client.refetchQueries({ include: [AdminUsersDocument] });

      // Can add success notification
      // notify.success(`Successfully unbanned ${selectedUsers.length} user(s)`);
    } catch (error) {
      console.error('❌ Error unbanning users:', error);
      // Can add error notification
      // notify.error('Failed to unban users');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex justify-end gap-3 mt-6">
      <Button variant="outline" onClick={onReset} disabled={!hasSelectedUsers}>
        <RotateCcw className="mr-2 h-4 w-4" />
        Reset
      </Button>
      <Button onClick={handleSaveChanges} disabled={!hasSelectedUsers || isSaving}>
        <UserCheck className="mr-2 h-4 w-4" />
        {isSaving ? 'Unbanning...' : 'Unban Selected'}
      </Button>
    </div>
  );
};
