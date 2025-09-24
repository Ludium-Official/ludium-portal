import client from '@/apollo/client';
import { useShowProgramMutation } from '@/apollo/mutation/show-program.generated';
import { ProgramsDocument, type ProgramsQuery } from '@/apollo/queries/programs.generated';
import { Button } from '@/components/ui/button';
import { Eye, RotateCcw } from 'lucide-react';
import { useState } from 'react';

type Program = NonNullable<NonNullable<ProgramsQuery['programs']>['data']>[0];

interface ShowProgramsTableActionsProps {
  selectedPrograms: Program[];
  onReset: () => void;
  onSelectionCleared?: () => void;
}

export const ShowProgramsTableActions = ({
  selectedPrograms,
  onReset,
  onSelectionCleared,
}: ShowProgramsTableActionsProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [showProgramMutation] = useShowProgramMutation();

  const hasSelectedPrograms = selectedPrograms.length > 0;

  const handleSaveChanges = async () => {
    console.log('💾 Showing selected programs:', selectedPrograms);
    setIsSaving(true);

    try {
      // Execute mutation for each selected program
      const showPromises = selectedPrograms.map((program) => {
        if (program.id) {
          console.log(`🔄 Showing program: ${program.id}`);
          return showProgramMutation({
            variables: { id: program.id },
          });
        }
        return Promise.resolve();
      });

      // Wait for all mutations to complete
      await Promise.all(showPromises);

      console.log(
        '✅ Programs shown successfully:',
        selectedPrograms.map((p) => p.id),
      );

      // Clear selection after successful showing
      onSelectionCleared?.();

      client.refetchQueries({ include: [ProgramsDocument] });

      // Can add success notification
      // notify.success(`Successfully shown ${selectedPrograms.length} program(s)`);
    } catch (error) {
      console.error('❌ Error showing programs:', error);
      // Can add error notification
      // notify.error('Failed to show programs');
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
        <Eye className="mr-2 h-4 w-4" />
        {isSaving ? 'Showing...' : 'Show Selected'}
      </Button>
    </div>
  );
};
