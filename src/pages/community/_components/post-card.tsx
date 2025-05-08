import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/lib/hooks/use-auth';
import type { Post } from '@/types/types.generated';
import { format } from 'date-fns';
import { ArrowRight, Settings } from 'lucide-react';
import { Link } from 'react-router';

interface PostCardProps {
  post: Post;
  size?: 'large' | 'regular';
}

function PostCard({ post, size = 'regular' }: PostCardProps) {
  const { isSponsor } = useAuth();
  const { id, title, content, keywords, createdAt } = post ?? {};
  const badgeVariants = ['teal', 'orange', 'pink'];
  
  const comments = [
    {
      id: '1',
      author: 'William Smith',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc convallis nisl...',
      createdAt: new Date('2023-10-22T08:00:00'),
    },
    {
      id: '2',
      author: 'William Smith',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc convallis nisl...',
      createdAt: new Date('2023-10-22T09:00:00'),
    },
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const authorName = `${post?.author?.firstName} ${post?.author?.lastName}`;
  const authorInitials = getInitials(authorName);

  return (
    <div className="block w-full border border-[#E9E9E9] rounded-[20px] overflow-hidden">
      <div className="relative">
        <div className="w-full h-48 bg-gradient-to-r from-purple-300 to-blue-300 flex items-center justify-center">
          {post?.image ? (
            <img 
              src={post.image} 
              alt={title || 'Post'} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 bg-white/20 rounded-full" />
            </div>
          )}
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              {keywords?.slice(0, 3).map((k, i) => (
                <Badge
                  key={k.id}
                  variant={
                    badgeVariants[i % badgeVariants.length] as 'default' | 'secondary' | 'purple'
                  }
                  className="rounded-full px-3 py-1 text-xs"
                >
                  {k.name}
                </Badge>
              ))}
            </div>
            <span className="text-xs text-gray-500">
              {format(new Date(createdAt ?? new Date()), 'yyyy.MM.dd')}
              {size === 'large' && ` - ${format(new Date(createdAt ?? new Date()), 'yyyy.MM.dd')}`}
              {isSponsor && (
                <Link to={`/community/${post?.id}/edit`} className="ml-2">
                  <Settings className="w-4 h-4 inline" />
                </Link>
              )}
            </span>
          </div>

          <div className="mb-4">
            <div className="flex items-center mb-2">
              <Avatar className="w-8 h-8 mr-2">
                <AvatarImage src="" alt={authorName} />
                <AvatarFallback>{authorInitials}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-sm">{authorName}</h3>
              </div>
            </div>
            <h2 className="text-lg font-bold mb-3">{title}</h2>
            <p className="text-sm text-gray-700 line-clamp-3">{content}</p>
          </div>

          {size === 'large' && comments.length > 0 && (
            <div className="mt-6 border-t border-gray-100 pt-4">
              <h4 className="text-sm font-semibold mb-3">New comment</h4>
              {comments.map(comment => (
                <div key={comment.id} className="mb-4">
                  <div className="flex items-start mb-1">
                    <Avatar className="w-6 h-6 mr-2">
                      <AvatarFallback>{getInitials(comment.author)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h5 className="text-sm font-semibold">{comment.author}</h5>
                        <span className="text-xs text-gray-500">
                          {format(comment.createdAt, 'MMM dd, yyyy, h:mm a')}
                        </span>
                      </div>
                      <p className="text-xs text-gray-700">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center mt-4">
            <div />
            <Link to={`/community/posts/${id}`} className="flex items-center gap-1 text-xs font-medium text-purple-600 hover:text-purple-700">
              View more <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostCard;
