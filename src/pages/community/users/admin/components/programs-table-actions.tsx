import client from '@/apollo/client';
import { useHideProgramMutation } from '@/apollo/mutation/hide-program.generated';
import { ProgramsDocument, type ProgramsQuery } from '@/apollo/queries/programs.generated';
import { Button } from '@/components/ui/button';
import { RotateCcw, Save } from 'lucide-react';
import { useState } from 'react';

type Program = NonNullable<NonNullable<ProgramsQuery['programs']>['data']>[0];

interface ProgramsTableActionsProps {
  selectedPrograms: Program[];
  onReset: () => void;
  onSelectionCleared?: () => void;
}

export const ProgramsTableActions = ({
  selectedPrograms,
  onReset,
  onSelectionCleared,
}: ProgramsTableActionsProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [hideProgramMutation] = useHideProgramMutation();

  const hasSelectedPrograms = selectedPrograms.length > 0;

  const handleSaveChanges = async () => {
    console.log('💾 Hiding selected programs:', selectedPrograms);
    setIsSaving(true);

    try {
      // Execute mutation for each selected program
      const hidePromises = selectedPrograms.map((program) => {
        if (program.id) {
          console.log(`🔄 Hiding program: ${program.id}`);
          return hideProgramMutation({
            variables: { id: program.id },
          });
        }
        return Promise.resolve();
      });

      // Wait for all mutations to complete
      await Promise.all(hidePromises);

      console.log(
        '✅ Programs hidden successfully:',
        selectedPrograms.map((p) => p.id),
      );

      // Clear selection after successful hiding
      onSelectionCleared?.();

      client.refetchQueries({ include: [ProgramsDocument] });

      // Can add success notification
      // notify.success(`Successfully hidden ${selectedPrograms.length} program(s)`);
    } catch (error) {
      console.error('❌ Error hiding programs:', error);
      // Can add error notification
      // notify.error('Failed to hide programs');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex justify-end gap-3 mt-6">
      <Button variant="outline" onClick={onReset} disabled={!hasSelectedPrograms}>
        <RotateCcw className="mr-2 h-4 w-4" />
        Reset
      </Button>
      <Button onClick={handleSaveChanges} disabled={!hasSelectedPrograms || isSaving}>
        <Save className="mr-2 h-4 w-4" />
        {isSaving ? 'Hiding...' : 'Hide Selected'}
      </Button>
    </div>
  );
};
