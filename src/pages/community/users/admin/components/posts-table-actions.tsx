import client from '@/apollo/client';
import { useHidePostMutation } from '@/apollo/mutation/hide-post.generated';
import { PostsDocument, type PostsQuery } from '@/apollo/queries/posts.generated';
import { Button } from '@/components/ui/button';
import { RotateCcw, Save } from 'lucide-react';
import { useState } from 'react';

type Post = NonNullable<NonNullable<PostsQuery['posts']>['data']>[0];

interface PostsTableActionsProps {
  selectedPosts: Post[];
  onReset: () => void;
  onSelectionCleared?: () => void;
}

export const PostsTableActions = ({
  selectedPosts,
  onReset,
  onSelectionCleared,
}: PostsTableActionsProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [hidePostMutation] = useHidePostMutation();

  const hasSelectedPosts = selectedPosts.length > 0;

  const handleSaveChanges = async () => {
    console.log('💾 Hiding selected posts:', selectedPosts);
    setIsSaving(true);

    try {
      // Execute mutation for each selected post
      const hidePromises = selectedPosts.map((post) => {
        if (post.id) {
          console.log(`🔄 Hiding post: ${post.id}`);
          return hidePostMutation({
            variables: { id: post.id },
          });
        }
        return Promise.resolve();
      });

      // Wait for all mutations to complete
      await Promise.all(hidePromises);

      console.log(
        '✅ Posts hidden successfully:',
        selectedPosts.map((p) => p.id),
      );

      // Clear selection after successful hiding
      onSelectionCleared?.();

      client.refetchQueries({ include: [PostsDocument] });

      // Can add success notification
      // notify.success(`Successfully hidden ${selectedPosts.length} post(s)`);
    } catch (error) {
      console.error('❌ Error hiding posts:', error);
      // Can add error notification
      // notify.error('Failed to hide posts');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex justify-end gap-3 mt-6">
      <Button variant="outline" onClick={onReset} disabled={!hasSelectedPosts}>
        <RotateCcw className="mr-2 h-4 w-4" />
        Reset
      </Button>
      <Button onClick={handleSaveChanges} disabled={!hasSelectedPosts || isSaving}>
        <Save className="mr-2 h-4 w-4" />
        {isSaving ? 'Hiding...' : 'Hide Selected'}
      </Button>
    </div>
  );
};
