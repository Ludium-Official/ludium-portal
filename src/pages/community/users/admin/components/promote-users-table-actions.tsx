import client from '@/apollo/client';
import { usePromoteToAdminMutation } from '@/apollo/mutation/promote-to-admin.generated';
import { AdminUsersDocument, type AdminUsersQuery } from '@/apollo/queries/admin-users.generated';
import { Button } from '@/components/ui/button';
import { RotateCcw, UserPlus } from 'lucide-react';
import { useState } from 'react';

type User = NonNullable<NonNullable<AdminUsersQuery['adminUsers']>['data']>[0];

interface PromoteUsersTableActionsProps {
  selectedUsers: User[];
  onReset: () => void;
  onSelectionCleared?: () => void;
}

export const PromoteUsersTableActions = ({
  selectedUsers,
  onReset,
  onSelectionCleared,
}: PromoteUsersTableActionsProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [promoteToAdminMutation] = usePromoteToAdminMutation();

  const hasSelectedUsers = selectedUsers.length > 0;

  const handleSaveChanges = async () => {
    console.log('💾 Promoting selected users to admin:', selectedUsers);
    setIsSaving(true);

    try {
      // Execute mutation for each selected user
      const promotePromises = selectedUsers.map((user) => {
        if (user.id) {
          console.log(`🔄 Promoting user to admin: ${user.id}`);
          return promoteToAdminMutation({
            variables: { userId: user.id },
          });
        }
        return Promise.resolve();
      });

      // Wait for all mutations to complete
      await Promise.all(promotePromises);

      console.log(
        '✅ Users promoted to admin successfully:',
        selectedUsers.map((u) => u.id),
      );

      // Clear selection after successful promotion
      onSelectionCleared?.();

      client.refetchQueries({ include: [AdminUsersDocument] });

      // Can add success notification
      // notify.success(`Successfully promoted ${selectedUsers.length} user(s) to admin`);
    } catch (error) {
      console.error('❌ Error promoting users to admin:', error);
      // Can add error notification
      // notify.error('Failed to promote users to admin');
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
        <UserPlus className="mr-2 h-4 w-4" />
        {isSaving ? 'Promoting...' : 'Promote to Admin'}
      </Button>
    </div>
  );
};
