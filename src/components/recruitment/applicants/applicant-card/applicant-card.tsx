import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import type { RecruitmentApplicant } from '@/types/recruitment';
import { Heart, MapPin, Star } from 'lucide-react';
import { Link } from 'react-router';

interface ApplicantCardProps {
  applicant: RecruitmentApplicant;
  onTogglePick?: (applicationId?: string | null, currentPicked?: boolean) => void;
}

const ApplicantCard: React.FC<ApplicantCardProps> = ({ applicant, onTogglePick }) => {
  const { id, userInfo, appliedDate, picked } = applicant;
  const fullName = `${userInfo.firstName || ''} ${userInfo.lastName || ''}`.trim();
  const initials = `${userInfo.firstName?.[0] || ''}${userInfo.lastName?.[0] || ''}`.toUpperCase();

  return (
    <div className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-cetner gap-3">
              <Avatar className="h-16 w-16">
                <AvatarImage src={userInfo.image || ''} alt={fullName} />
                <AvatarFallback className="text-lg font-semibold">
                  {initials || '??'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col justify-around">
                <div className="flex items-center gap-3 text-xl text-neutral-700">
                  <Link to={`/users/${userInfo.userId}`} className="font-bold">
                    {fullName}
                  </Link>
                  {userInfo.role && (
                    <p className="text-sm text-muted-foreground">{userInfo.role}</p>
                  )}
                </div>
                <div className="flex items-center text-slate-500 text-sm">
                  {userInfo.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{userInfo.location}</span>
                    </div>
                  )}
                  {userInfo.hourlyRate && (
                    <div className="flex items-center">
                      <span className="mx-1">∙</span>
                      <div className="flex items-center gap-1">
                        <span>${userInfo.hourlyRate}/hour</span>
                      </div>
                    </div>
                  )}
                  {userInfo.star && (
                    <div className="flex items-center">
                      <span className="mx-1">∙</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{userInfo.star}</span>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center">
                    <span className="mx-1">∙</span>
                    <div className="flex items-center gap-1">
                      Applied {appliedDate && formatDate(appliedDate)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={() => onTogglePick?.(id, picked)}>
                {picked ? <Heart className="fill-red-500 text-red-500" /> : <Heart />}
              </Button>
              <Button>Message</Button>
            </div>
          </div>

          <div className="flex flex-col gap-5 text-sm">
            {userInfo.summary && (
              <div className="flex gap-3">
                <div className="w-[65px] text-gray-dark font-bold">Summary</div>
                <p className="text-gray-700 line-clamp-2">{userInfo.summary}</p>
              </div>
            )}

            {userInfo.skills && userInfo.skills.length > 0 && (
              <div className="flex gap-3">
                <div className="w-[65px] text-gray-dark font-bold">Skills</div>
                {userInfo.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            )}

            {userInfo.tools && userInfo.tools.length > 0 && (
              <div className="flex gap-3">
                <div className="w-[65px] text-gray-dark font-bold">Tools</div>
                {userInfo.tools.map((tool) => (
                  <Badge key={tool} variant="secondary" className="text-xs">
                    {tool}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantCard;
