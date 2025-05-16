import client from '@/apollo/client';
import { useCreatePostMutation } from '@/apollo/mutation/create-post.generated';
import { PostsDocument } from '@/apollo/queries/posts.generated';
import type { OnSubmitPostFunc } from '@/pages/community/_components/post-form';
import PostForm from '@/pages/community/_components/post-form';
import { useNavigate } from 'react-router';

const CreateCommunityPage: React.FC = () => {
  const navigate = useNavigate();
  const [createPost] = useCreatePostMutation();

  const onSubmit: OnSubmitPostFunc = (args) => {
    createPost({
      variables: {
        input: {
          title: args.title,
          content: args.content,
          keywords: args.keywords,
          image: args.image,
        },
      },
      onCompleted: () => {
        navigate('/community');

        client.refetchQueries({ include: [PostsDocument] });
      },
    });
  };

  return (
    <div className="p-10 pr-[55px] w-[681px]" defaultValue="edit">
      <PostForm isEdit={false} onSubmitPost={onSubmit} />
    </div>
  );
};

export default CreateCommunityPage;
