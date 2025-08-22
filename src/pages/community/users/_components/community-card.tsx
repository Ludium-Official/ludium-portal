import type { Post } from '@/types/types.generated';
import { format } from 'date-fns';

type Props = {
  post: Post;
};
export default function CommunityCard({ post }: Props) {
  return (
    <div className="flex items-center gap-4 p-5 border rounded-lg">
      <div className="w-[356px] h-[200px] bg-gradient-to-r from-purple-300 to-blue-300 rounded-md shrink-0">
        {post?.image ? (
          <img src={post.image} alt={'Post'} className="w-full h-[200px] object-cover rounded-lg" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="w-16 h-16 bg-white/20 rounded-full" />
          </div>
        )}
      </div>
      <div className="flex flex-col justify-between h-[200px]">
        <div className="flex flex-col gap-1">
          <p className="font-bold text-gray-dark">{post.title}</p>
          <p className="font-bold text-xs text-muted-foreground">
            {post.author?.firstName} {post.author?.lastName}
          </p>
          <div className="flex gap-[6px] text-xs text-muted-foreground">
            {post.createdAt && <span>{format(new Date(post.createdAt), 'dd.MM.yyyy')}</span>}
            <span>•</span>
            <span>Views {12}</span>
          </div>
        </div>
        <p className="line-clamp-4 text-sm text-slate-500">{post.summary}</p>
        <div className="flex items-center gap-1">
          <p className="font-medium text-sm text-muted-foreground">Comment</p>
          <p className="font-bold text-sm text-primary">{post.comments?.length ?? 0}</p>
        </div>
      </div>
    </div>
  );
}
