import client from '@/apollo/client';
import { useDemoteFromAdminMutation } from '@/apollo/mutation/demote-from-admin.generated';
import { AdminUsersDocument, type AdminUsersQuery } from '@/apollo/queries/admin-users.generated';
import { Button } from '@/components/ui/button';
import { RotateCcw, UserMinus } from 'lucide-react';
import { useState } from 'react';

type User = NonNullable<NonNullable<AdminUsersQuery['adminUsers']>['data']>[0];

interface DemoteUsersTableActionsProps {
  selectedUsers: User[];
  onReset: () => void;
  onSelectionCleared?: () => void;
}

export const DemoteUsersTableActions = ({
  selectedUsers,
  onReset,
  onSelectionCleared,
}: DemoteUsersTableActionsProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [demoteFromAdminMutation] = useDemoteFromAdminMutation();

  const hasSelectedUsers = selectedUsers.length > 0;

  const handleSaveChanges = async () => {
    console.log('💾 Demoting selected admins to users:', selectedUsers);
    setIsSaving(true);

    try {
      // Execute mutation for each selected user
      const demotePromises = selectedUsers.map((user) => {
        if (user.id) {
          console.log(`🔄 Demoting admin to user: ${user.id}`);
          return demoteFromAdminMutation({
            variables: { userId: user.id },
          });
        }
        return Promise.resolve();
      });

      // Wait for all mutations to complete
      await Promise.all(demotePromises);

      console.log(
        '✅ Admins demoted to users successfully:',
        selectedUsers.map((u) => u.id),
      );

      // Clear selection after successful demotion
      onSelectionCleared?.();

      client.refetchQueries({ include: [AdminUsersDocument] });

      // Can add success notification
      // notify.success(`Successfully demoted ${selectedUsers.length} admin(s) to users`);
    } catch (error) {
      console.error('❌ Error demoting admins to users:', error);
      // Can add error notification
      // notify.error('Failed to demote admins to users');
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
        <UserMinus className="mr-2 h-4 w-4" />
        {isSaving ? 'Demoting...' : 'Demote to User'}
      </Button>
    </div>
  );
};
