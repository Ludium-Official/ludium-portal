import { useProfileQuery } from '@/apollo/queries/profile.generated';
import { useUserQuery } from '@/apollo/queries/user.generated';
import { useParams } from 'react-router';

export default function UserDescriptionTab({ myProfile }: { myProfile?: boolean }) {
  const { id } = useParams();

  const { data: userData } = useUserQuery({
    variables: {
      id: id ?? '',
    },
    skip: myProfile,
  });

  const { data: profileData } = useProfileQuery({
    fetchPolicy: 'network-only',
    skip: !myProfile,
  });

  const user = myProfile ? profileData?.profile : userData?.user;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex h-12 px-4">
        <h1 className="font-bold text-xl text-gray-dark">Description</h1>
      </div>
      {/* <div style={{ width: 425, height: 239 }}>
        <iframe
          width="425"
          height="239"
          src="https://www.youtube.com/embed/LXb3EKWsInQ?start=10"
          title="YouTube video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div> */}
      <div>
        <p className="text-sm text-slate-600">{user?.about}</p>
      </div>
    </div>
  );
}
