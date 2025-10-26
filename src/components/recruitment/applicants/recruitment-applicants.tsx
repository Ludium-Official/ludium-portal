import { mockRecruitmentPrograms } from '@/mock/recruitment-applicants';
import { useState } from 'react';
import ApplicantCard from './applicant-card/applicant-card';

const RecruitmentApplicants: React.FC = () => {
  const [applicants, setApplicants] = useState(mockRecruitmentPrograms);

  const handlePickApplicant = (userId?: string | null) => {
    console.log('Pick applicant:', userId);
    // TODO: Implement pick applicant logic
  };

  const handleTogglePick = (userId?: string | null, currentPicked?: boolean) => {
    setApplicants((prev) =>
      prev.map((applicant) =>
        applicant.userInfo.userId === userId ? { ...applicant, picked: !currentPicked } : applicant,
      ),
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {applicants.length > 0 ? (
          applicants.map((applicant) => (
            <ApplicantCard
              key={applicant.id}
              applicant={applicant}
              onPickApplicant={handlePickApplicant}
              onTogglePick={handleTogglePick}
            />
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">No applicants yet</div>
        )}
      </div>
    </div>
  );
};

export default RecruitmentApplicants;
