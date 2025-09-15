import client from '@/apollo/client';
import { useBanUserMutation } from '@/apollo/mutation/ban-user.generated';
import { AdminUsersDocument, type AdminUsersQuery } from '@/apollo/queries/admin-users.generated';
import { Button } from '@/components/ui/button';
import { RotateCcw, UserX } from 'lucide-react';
import { useState } from 'react';

type User = NonNullable<NonNullable<AdminUsersQuery['adminUsers']>['data']>[0];

interface UsersTableActionsProps {
  selectedUsers: User[];
  onReset: () => void;
  onSelectionCleared?: () => void;
}

export const UsersTableActions = ({
  selectedUsers,
  onReset,
  onSelectionCleared,
}: UsersTableActionsProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [banUserMutation] = useBanUserMutation();

  const hasSelectedUsers = selectedUsers.length > 0;

  const handleSaveChanges = async () => {
    console.log('💾 Banning selected users:', selectedUsers);
    setIsSaving(true);

    try {
      // Execute mutation for each selected user
      const banPromises = selectedUsers.map((user) => {
        if (user.id) {
          console.log(`🔄 Banning user: ${user.id}`);
          return banUserMutation({
            variables: {
              userId: user.id,
              reason: 'Banned by admin',
            },
          });
        }
        return Promise.resolve();
      });

      // Wait for all mutations to complete
      await Promise.all(banPromises);

      console.log(
        '✅ Users banned successfully:',
        selectedUsers.map((u) => u.id),
      );

      // Clear selection after successful banning
      onSelectionCleared?.();

      client.refetchQueries({ include: [AdminUsersDocument] });

      // Can add success notification
      // notify.success(`Successfully banned ${selectedUsers.length} user(s)`);
    } catch (error) {
      console.error('❌ Error banning users:', error);
      // Can add error notification
      // notify.error('Failed to ban users');
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
        <UserX className="mr-2 h-4 w-4" />
        {isSaving ? 'Banning...' : 'Ban Selected'}
      </Button>
    </div>
  );
};
