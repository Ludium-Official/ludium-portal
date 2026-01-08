export interface CommentAuthor {
  name: string;
  avatar: string;
}

export interface Comment {
  id: number;
  author: CommentAuthor;
  date: string;
  content: string;
  likes: number;
  replies?: Comment[];
}
