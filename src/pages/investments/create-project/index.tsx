
import { useCreateApplicationMutation } from '@/apollo/mutation/create-application.generated';
import ProjectForm, { type OnSubmitProjectFunc } from '@/pages/investments/_components/project-form';
import { ApplicationStatus, } from '@/types/types.generated';
import { useParams } from 'react-router';

const CreateProjectPage: React.FC = () => {
  const [createApplication] = useCreateApplicationMutation();

  const { id } = useParams()

  // const { isLoggedIn, isAuthed } = useAuth();

  // useEffect(() => {
  //   if (!isLoggedIn) {
  //     navigate('/');
  //     notify('Please login first', 'success');
  //     return;
  //   }
  //   if (!isAuthed) {
  //     navigate('/profile/edit');
  //     notify('Please add your email', 'success');
  //     return;
  //   }
  // }, [isLoggedIn, isAuthed]);

  const onSubmit: OnSubmitProjectFunc = (args) => {
    createApplication({
      variables: {
        input: {
          name: args.name,
          content: args.description,
          summary: args.summary,
          milestones: args.milestones?.map((m) => ({
            deadline: m.endDate ?? new Date().toISOString(),
            title: m.title,
            percentage: m.payoutPercentage,
            summary: m.summary,
            description: m.description,
            // title: m.title,
            // payoutPercentage: m.payoutPercentage,
            // endDate: m.endDate,
            // summary: m.summary,
            // description: m.description,
          })) ?? [],
          investmentTerms: args.investmentTerms?.map((t) => ({
            title: t.title ?? '',
            price: t.prize ?? '',
            purchaseLimit: Number(t.purchaseLimit) ?? 0,
            description: t.description ?? '',

          })) ?? [],
          price: args.fundingToBeRaised ?? '0',
          programId: id ?? args?.programId ?? '',
          status: ApplicationStatus.Pending,
          // currency: args.currency,
          // price: args.price ?? '0',
          // description: args.description,
          // summary: args.summary,
          // deadline: args.deadline ?? '',
          // keywords: args.keywords,
          links: args.links,
          // network: args.network,
          // image: args.image,

          // visibility: args.visibility as ProgramVisibility,

          // type: ProgramType.Funding,

          // applicationStartDate: args.applicationStartDate ?? '',
          // applicationEndDate: args.applicationDueDate ?? '',
          // fundingStartDate: args.fundingStartDate ?? '',
          // fundingEndDate: args.fundingDueDate ?? '',

          // fundingCondition: args.fundingCondition,
          // tierSettings: args.tierSettings,
        },
      },
      onCompleted: async (data) => {
        console.log(data);
      },
      onError: (error) => {
        console.log(error);
      },
    });
  };

  return (
    <div className="w-full bg-[#f7f7f7] p-10 pr-[55px]" defaultValue="edit">
      <ProjectForm isEdit={false} onSubmitProject={onSubmit} />
    </div>
  );
};

export default CreateProjectPage;
