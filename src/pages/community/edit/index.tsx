import client from '@/apollo/client';
import { useUpdatePostMutation } from '@/apollo/mutation/update-post.generated';
import { PostsDocument } from '@/apollo/queries/posts.generated';
import type { OnSubmitPostFunc } from '@/pages/community/_components/post-form';
import PostForm from '@/pages/community/_components/post-form';
import { useNavigate, useParams } from 'react-router';

const EditCommunityPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [updatePost] = useUpdatePostMutation();

  const onSubmit: OnSubmitPostFunc = (args) => {
    updatePost({
      variables: {
        input: {
          id: id ?? '',
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
      <PostForm isEdit={true} onSubmitPost={onSubmit} />
    </div>
  );
};

export default EditCommunityPage;
