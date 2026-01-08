import MarkdownPreviewer from '@/components/markdown/markdown-previewer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ShareButton } from '@/components/ui/share-button';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/lib/hooks/use-auth';
import { Eye, Heart, MessageCircleMore } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router';
import { CommentItem } from '@/components/community/comment-item';
import type { Comment } from '@/types/comment';
import { Separator } from '@radix-ui/react-dropdown-menu';

// Mock article data
const MOCK_ARTICLE = {
  id: 1,
  title: '5 Essential Tips for Navigating the Web3 Ecosystem',
  author: {
    name: 'William Smith',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  date: 'December 23, 2025',
  views: 122,
  content: `# 5 Essential Tips for Navigating the Web3 Ecosystem

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus.

![Web3 Ecosystem](https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&h=600&fit=crop)

Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna.

## 1. Understanding Decentralization

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus.

- **Key Point 1**: Decentralization ensures no single point of failure
- **Key Point 2**: Distributed networks increase security and resilience
- **Key Point 3**: Community governance becomes possible

Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.

## 2. Wallet Security Best Practices

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus.

> **Important**: Never share your private keys or seed phrases with anyone. Your wallet security is your responsibility.

Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna.

## 3. Smart Contract Interactions

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus.

### Common Use Cases

1. **DeFi Protocols**: Lending, borrowing, and yield farming
2. **NFT Marketplaces**: Buying, selling, and trading digital assets
3. **DAOs**: Participating in decentralized governance

Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra.

## 4. Gas Fees and Network Optimization

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus.

Understanding gas fees is crucial for cost-effective transactions. Monitor network congestion and choose optimal times for your transactions.

## 5. Community and Resources

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus.

Join communities, follow reputable sources, and stay updated with the latest developments in the Web3 space. Continuous learning is key to success in this rapidly evolving ecosystem.

---

*This article is part of our Web3 educational series. Stay tuned for more insights and guides.*`,
  likes: 0,
  commentCount: 5,
};

// Mock comments
const MOCK_COMMENTS: Comment[] = [
  {
    id: 1,
    author: {
      name: 'William Smith',
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
    date: 'December 23, 2025',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus.\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus.',
    likes: 0,
    replies: [
      {
        id: 11,
        author: {
          name: 'William Smith',
          avatar: 'https://i.pravatar.cc/150?img=3',
        },
        date: 'December 23, 2025',
        content:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus.',
        likes: 0,
      },
      {
        id: 12,
        author: {
          name: 'Yohana Smith',
          avatar: 'https://i.pravatar.cc/150?img=4',
        },
        date: 'December 23, 2025',
        content:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus.',
        likes: 0,
        replies: [
          {
            id: 11,
            author: {
              name: 'William Smith',
              avatar: 'https://i.pravatar.cc/150?img=3',
            },
            date: 'December 23, 2025',
            content:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus.',
            likes: 0,
          },
        ],
      },
    ],
  },
  {
    id: 2,
    author: {
      name: 'William Smith',
      avatar: 'https://i.pravatar.cc/150?img=5',
    },
    date: 'December 23, 2025',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus.',
    likes: 0,
    replies: [],
  },
  {
    id: 3,
    author: {
      name: 'William Smith',
      avatar: 'https://i.pravatar.cc/150?img=6',
    },
    date: 'December 23, 2025',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus.',
    likes: 0,
    replies: [],
  },
];

const ArticleDetailPage = () => {
  const { id } = useParams();
  const { isAuthed } = useAuth();

  const [comment, setComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(true);

  console.log('article id: ', id);

  const article = MOCK_ARTICLE;

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[936px] mx-auto pt-23 pb-25">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-6">{article.title}</h1>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-7 h-7">
                <AvatarImage src={article.author.avatar} />
                <AvatarFallback>{article.author.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-5">
                <p className="font-semibold text-sm text-muted-foreground">{article.author.name}</p>
                <p className="text-xs text-[#8C8C8C]">{article.date}</p>
                <p className="flex items-center gap-1 text-xs text-[#8C8C8C]">
                  <Eye className="w-4 h-4" />
                  {article.views}
                </p>
              </div>
            </div>
            <ShareButton />
          </div>
        </div>

        <MarkdownPreviewer value={article.content} />

        <div className="flex items-center gap-4 mt-19 mb-8">
          <button
            type="button"
            onClick={() => isAuthed && setLiked(!liked)}
            className="cursor-pointer flex items-center gap-2 border border-input rounded-md p-3 text-sm"
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
          <div
            onClick={() => setShowComments(!showComments)}
            className="cursor-pointer flex items-center gap-2 border border-input rounded-md py-3 px-4 text-sm"
          >
            <MessageCircleMore className="w-4 h-4" />
            <span>{article.commentCount}</span>
          </div>
        </div>

        {showComments && (
          <div>
            <h3 className="text-[20px] font-bold mb-2">Comments</h3>

            {isAuthed && (
              <div className="mb-8">
                <div className="flex flex-col items-end gap-3">
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="h-[100px] resize-none"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-shrink-0"
                    disabled={!comment.trim()}
                  >
                    Post
                  </Button>
                </div>
              </div>
            )}

            <div>
              {MOCK_COMMENTS.map((comment, index) => (
                <div
                  key={comment.id}
                  className={`pt-[30px] pb-4 ${index < MOCK_COMMENTS.length - 1 ? 'border-b' : ''}`}
                >
                  <CommentItem comment={comment} />
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button variant="outline">Load More Comments</Button>
            </div>
          </div>
        )}

        <Separator />
      </div>
    </div>
  );
};

export default ArticleDetailPage;
