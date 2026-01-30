import client from '@/apollo/client';
import { useCreateCarouselItemMutation } from '@/apollo/mutation/create-carousel-item.generated';
import { useDeleteCarouselItemMutation } from '@/apollo/mutation/delete-carousel-item.generated';
import { useHidePostMutation } from '@/apollo/mutation/hide-post.generated';
import { useHideProgramMutation } from '@/apollo/mutation/hide-program.generated';
import { useShowPostMutation } from '@/apollo/mutation/show-post.generated';
import { useShowProgramMutation } from '@/apollo/mutation/show-program.generated';
import {
  CarouselItemsDocument,
  useCarouselItemsQuery,
} from '@/apollo/queries/carousel-items.generated';
import { PostDocument } from '@/apollo/queries/post.generated';
import { ProgramDocument } from '@/apollo/queries/program.generated';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CarouselItemType, PostVisibility, ProgramVisibility } from '@/types/types.generated';
import { ChevronDown, Loader2, UserCog } from 'lucide-react';
import { useState } from 'react';

type EntityType = 'program' | 'post';

interface AdminDropdownProps {
  entityId: string;
  entityType: EntityType;
  entityVisibility: ProgramVisibility | PostVisibility;
}

export const AdminDropdown = ({ entityId, entityType, entityVisibility }: AdminDropdownProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [createCarouselItem] = useCreateCarouselItemMutation();
  const [deleteCarouselItem] = useDeleteCarouselItemMutation();
  const [hideProgram] = useHideProgramMutation();
  const [showProgram] = useShowProgramMutation();
  const [hidePost] = useHidePostMutation();
  const [showPost] = useShowPostMutation();

  // Check if entity is in carousel
  const { data: carouselData } = useCarouselItemsQuery();
  const isInCarousel = carouselData?.carouselItems?.some(
    (item) =>
      item.itemId === entityId &&
      item.itemType ===
        (entityType === 'program' ? CarouselItemType.Program : CarouselItemType.Post),
  );

  const handleConfirmAction = async () => {
    if (!entityId || !selectedAction) return;

    setIsLoading(true);
    try {
      switch (selectedAction) {
        case 'add-to-carousel':
          await createCarouselItem({
            variables: {
              input: {
                isActive: true,
                itemId: entityId,
                itemType:
                  entityType === 'program' ? CarouselItemType.Program : CarouselItemType.Post,
              },
            },
          });
          console.log(`✅ ${entityType} added to carousel`);
          break;

        case 'remove-from-carousel': {
          const carouselItem = carouselData?.carouselItems?.find(
            (item) =>
              item.itemId === entityId &&
              item.itemType ===
                (entityType === 'program' ? CarouselItemType.Program : CarouselItemType.Post),
          );
          if (carouselItem?.id) {
            await deleteCarouselItem({
              variables: { id: carouselItem.id },
            });
            console.log(`✅ ${entityType} removed from carousel`);
          }
          break;
        }

        case 'hide-entity':
          if (entityType === 'program') {
            await hideProgram({ variables: { id: entityId } });
          } else {
            await hidePost({ variables: { id: entityId } });
          }
          console.log(`✅ ${entityType} hidden`);
          break;

        case 'show-entity':
          if (entityType === 'program') {
            await showProgram({ variables: { id: entityId } });
          } else {
            await showPost({ variables: { id: entityId } });
          }
          console.log(`✅ ${entityType} shown`);
          break;

        default:
          break;
      }

      // Refetch data
      const documentsToRefetch = [CarouselItemsDocument];
      if (entityType === 'program') {
        documentsToRefetch.push(ProgramDocument);
      } else {
        documentsToRefetch.push(PostDocument);
      }

      await client.refetchQueries({ include: documentsToRefetch });

      // Reset selection
      setSelectedAction('');
    } catch (error) {
      console.error(`❌ Error executing action for ${entityType}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  // Determine visibility actions based on entity type and current visibility
  const isPrivate =
    entityType === 'program'
      ? entityVisibility === ProgramVisibility.Private
      : entityVisibility === PostVisibility.Private;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="flex gap-2 items-center bg-primary hover:bg-primary/90"
          disabled={isLoading}
        >
          <UserCog className="w-4 h-4" />
          Admin
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-56 p-4">
        <RadioGroup value={selectedAction} onValueChange={setSelectedAction} className="gap-2">
          <div className="flex items-center space-x-2 pl-1">
            <RadioGroupItem
              value={isInCarousel ? 'remove-from-carousel' : 'add-to-carousel'}
              id="carousel-action"
            />
            <Label htmlFor="carousel-action" className="text-sm font-normal">
              {isInCarousel ? 'Remove banner' : 'Select as Main banner'}
            </Label>
          </div>

          <DropdownMenuSeparator className="" />

          <div className="flex items-center space-x-2 pl-1">
            <RadioGroupItem
              value={isPrivate ? 'show-entity' : 'hide-entity'}
              id="toggle-visibility"
            />
            <Label htmlFor="toggle-visibility" className="text-sm font-normal">
              {isPrivate ? 'Show' : 'Hide'}
            </Label>
          </div>
        </RadioGroup>

        <Button
          onClick={handleConfirmAction}
          disabled={!selectedAction || isLoading}
          className="w-full mt-4 bg-gray-800 hover:bg-gray-900 text-white"
        >
          {isLoading ? <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" /> : 'Confirm'}
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
