import client from '@/apollo/client';
import { useShowPostMutation } from '@/apollo/mutation/show-post.generated';
import { PostsDocument, type PostsQuery } from '@/apollo/queries/posts.generated';
import { Button } from '@/components/ui/button';
import { Eye, RotateCcw } from 'lucide-react';
import { useState } from 'react';

type Post = NonNullable<NonNullable<PostsQuery['posts']>['data']>[0];

interface ShowPostsTableActionsProps {
  selectedPosts: Post[];
  onReset: () => void;
  onSelectionCleared?: () => void;
}

export const ShowPostsTableActions = ({
  selectedPosts,
  onReset,
  onSelectionCleared,
}: ShowPostsTableActionsProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [showPostMutation] = useShowPostMutation();

  const hasSelectedPosts = selectedPosts.length > 0;

  const handleSaveChanges = async () => {
    console.log('💾 Showing selected posts:', selectedPosts);
    setIsSaving(true);

    try {
      // Execute mutation for each selected post
      const showPromises = selectedPosts.map((post) => {
        if (post.id) {
          console.log(`🔄 Showing post: ${post.id}`);
          return showPostMutation({
            variables: { id: post.id },
          });
        }
        return Promise.resolve();
      });

      // Wait for all mutations to complete
      await Promise.all(showPromises);

      console.log(
        '✅ Posts shown successfully:',
        selectedPosts.map((p) => p.id),
      );

      // Clear selection after successful showing
      onSelectionCleared?.();

      client.refetchQueries({ include: [PostsDocument] });

      // Can add success notification
      // notify.success(`Successfully shown ${selectedPosts.length} post(s)`);
    } catch (error) {
      console.error('❌ Error showing posts:', error);
      // Can add error notification
      // notify.error('Failed to show posts');
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
        <Eye className="mr-2 h-4 w-4" />
        {isSaving ? 'Showing...' : 'Show Selected'}
      </Button>
    </div>
  );
};
