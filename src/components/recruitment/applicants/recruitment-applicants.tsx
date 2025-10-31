import { useApplicationsByProgramV2Query } from "@/apollo/queries/applications-by-program-v2.generated";
import type { ApplicationsByProgramV2Query } from "@/apollo/queries/applications-by-program-v2.generated";
import { usePickApplicationV2Mutation } from "@/apollo/mutation/pick-application-v2.generated";
import type { ApplicationsByProgramV2QueryInput } from "@/types/types.generated";
import type { RecruitmentApplicant } from "@/types/recruitment";
import notify from "@/lib/notify";
import { useParams } from "react-router";
import ApplicantCard from "./applicant-card/applicant-card";

type ApplicationData = NonNullable<
  NonNullable<ApplicationsByProgramV2Query["applicationsByProgramV2"]>["data"]
>[number];

const RecruitmentApplicants: React.FC = () => {
  const { id } = useParams();

  const queryInput: ApplicationsByProgramV2QueryInput = {
    programId: id || "",
  };

  const { data, loading, error, refetch } = useApplicationsByProgramV2Query({
    variables: {
      query: queryInput,
    },
    skip: !id,
  });

  const [pickApplication] = usePickApplicationV2Mutation();

  const applications = data?.applicationsByProgramV2?.data || [];

  const handleTogglePick = async (
    applicationId?: string | null,
    currentPicked?: boolean
  ) => {
    if (!applicationId) return;

    try {
      await pickApplication({
        variables: {
          id: applicationId,
          input: {
            picked: !currentPicked,
          },
        },
      });

      // Refetch to update the UI
      refetch();
      notify(
        !currentPicked
          ? "Applicant picked successfully!"
          : "Applicant unpicked successfully!",
        "success"
      );
    } catch (error) {
      console.error("Error toggling pick:", error);
      notify("Failed to update pick status. Please try again.", "error");
    }
  };

  // Transform GraphQL data to match ApplicantCard expected format
  const transformToApplicant = (
    application: ApplicationData
  ): RecruitmentApplicant => {
    return {
      id: application.id || "",
      appliedDate: application.createdAt,
      picked: application.picked || false,
      userInfo: {
        userId: application.applicant?.id,
        image: application.applicant?.profileImage,
        firstName: application.applicant?.firstName,
        lastName: application.applicant?.lastName,
        cv: application.content,
        location: null, // Not in GraphQL schema
        hourlyRate: null, // Not in GraphQL schema
        star: null, // Not in GraphQL schema
        role: application.applicant?.organizationName,
        skills: application.applicant?.skills,
        tools: null, // Not in GraphQL schema
      },
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-lg text-gray-500">Loading applicants...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-lg text-red-500">
          Error loading applicants. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {applications.length > 0 ? (
          applications.map((application) => (
            <ApplicantCard
              key={application.id}
              applicant={transformToApplicant(application)}
              onTogglePick={handleTogglePick}
            />
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No applicants yet
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruitmentApplicants;
