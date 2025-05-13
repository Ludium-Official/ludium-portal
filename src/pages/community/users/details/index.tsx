import { useUserQuery } from '@/apollo/queries/user.generated';
import avatarPlaceholder from '@/assets/avatar-placeholder.png';
import { useParams } from 'react-router';

function UserDetailsPage() {
  const { id } = useParams();

  const { data: userData } = useUserQuery({
    variables: {
      id: id ?? '',
    },
  });

  return (
    <div className="bg-[#F7F7F7]">
      <div className="flex px-10 py-5 justify-between bg-white rounded-b-2xl mb-3">
        <section className="">
          <h1 className="text-xl font-bold mb-6">Profile</h1>

          <h3 className="text-[#A3A3A3] text-xs font-medium mb-2">Profile image</h3>

          <div className="px-6 py-2 mb-9">
            <img
              src={userData?.user?.image ?? avatarPlaceholder}
              alt="avatar"
              className="w-[121px] h-[121px] rounded-full object-cover"
            />
          </div>

          <h3 className="text-[#A3A3A3] text-xs font-medium mb-2">Organization / Person name</h3>
          <p className="text-[#18181B] text-sm font-medium mb-10">
            {userData?.user?.organizationName} / {userData?.user?.firstName}{' '}
            {userData?.user?.lastName}
          </p>

          <h3 className="text-[#A3A3A3] text-xs font-medium mb-2">Description</h3>
          <p className="text-[#18181B] text-sm font-medium mb-10">{userData?.user?.about}</p>

          <h3 className="text-[#A3A3A3] text-xs font-medium mb-2">Wallet</h3>
          <div className="p-6 mb-10 border min-w-[282px] bg-muted rounded-lg shadow-sm relative">
            {userData?.user?.wallet?.address && (
              <p className="text-xs text-[#71717A]">{userData?.user?.wallet?.address}</p>
            )}
          </div>

          <h3 className="text-[#A3A3A3] text-xs font-medium mb-2">Links</h3>
          <p className="text-[#18181B] text-sm font-medium mb-10">
            {userData?.user?.links?.map((l) => (
              <p key={l.url}>{l.url}</p>
            ))}
            {userData?.user?.links?.length === 0 && <span>No links provided</span>}
          </p>
        </section>
      </div>
    </div>
  );
}

export default UserDetailsPage;
