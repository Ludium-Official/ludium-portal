import { useSubmitMilestoneMutation } from '@/apollo/mutation/submit-milestone.generated';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { type Milestone, SubmitMilestoneStatus } from '@/types/types.generated';
import { X } from 'lucide-react';
import { useState } from 'react';

function SubmitMilestoneForm({
  milestone,
  refetch,
}: { milestone: Milestone; refetch: () => void }) {
  const [file, setFile] = useState<File>();
  const [description, setDescription] = useState<string>(milestone?.description ?? '');

  const [links, setLinks] = useState<string[]>(milestone.links?.map((l) => l.url ?? '') ?? ['']);

  const [submitMutation] = useSubmitMilestoneMutation();
  const [linksError, setLinksError] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  // File validation constants
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 10MB in bytes
  const ALLOWED_FILE_TYPES = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
    'application/vnd.ms-powerpoint', // .ppt
    'application/zip',
  ];

  const validateFile = (selectedFile: File): string | null => {
    // Check file size
    if (selectedFile.size > MAX_FILE_SIZE) {
      return `File size must be less than 5MB. Current size: ${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`;
    }

    // Check file type
    if (!ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
      return 'Only PDF, DOCX, PPT, PPTX, and ZIP files are allowed.';
    }

    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      const error = validateFile(selectedFile);
      if (error) {
        setFileError(error);
        setFile(undefined);
        // Clear the input
        e.target.value = '';
      } else {
        setFileError(null);
        setFile(selectedFile);
      }
    } else {
      setFileError(null);
      setFile(undefined);
    }
  };

  const submitMilestone = (milestoneId: string) => {
    if (links?.some((l) => !/^https?:\/\/[^\s/$.?#].[^\s]*$/.test(l))) {
      setLinksError(true);
      return;
    }

    // Check if there's a file error
    if (fileError) {
      return;
    }

    document.getElementById('submit-milestone-dialog-close')?.click();

    // TODO: Backend schema needs to be updated to include file field in SubmitMilestoneInput
    // For now, we'll submit without the file until the schema is updated
    submitMutation({
      variables: {
        input: {
          id: milestoneId,
          links: links?.length ? links?.map((l) => ({ title: l, url: l })) : undefined,
          status: SubmitMilestoneStatus.Submitted,
          description,
          file, // Uncomment this when backend schema is updated
        },
      },
      onCompleted: () => {
        refetch();
      },
    });
  };

  return (
    <>
      <h2 className="text-2xl font-semibold">Submit Milestone</h2>

      <label htmlFor="title">
        <p className="font-medium text-sm">{milestone.title}</p>
      </label>

      <label htmlFor="description">
        <p className="font-medium text-sm">Description</p>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          id="description"
        />
      </label>

      <label htmlFor="links" className="space-y-2 block">
        <p className="text-sm font-medium">Links</p>
        <span className="block text-gray-text text-sm">
          Add links to your website, blog, or social media profiles.
        </span>

        {links.map((l, idx) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <div key={idx} className="flex items-center gap-2">
            <Input
              className="h-10 max-w-[431.61px]"
              value={l}
              onChange={(e) => {
                setLinks((prev) => {
                  const newLinks = [...prev];
                  newLinks[idx] = e.target.value;
                  return newLinks;
                });
              }}
            />
            {idx !== 0 && (
              <X
                onClick={() =>
                  setLinks((prev) => {
                    const newLinks = [...[...prev].slice(0, idx), ...[...prev].slice(idx + 1)];

                    return newLinks;
                  })
                }
              />
            )}
          </div>
        ))}
        <Button
          onClick={() => setLinks((prev) => [...prev, ''])}
          type="button"
          variant="outline"
          size="sm"
          className="rounded-[6px]"
        >
          Add URL
        </Button>

        {linksError && (
          <span className="text-red-400 text-sm block">
            The provided link is not valid. All links must begin with{' '}
            <span className="font-bold">https://</span>.
          </span>
        )}
      </label>

      {/* File upload section - will work once backend schema is updated */}
      <div className="w-full mb-10">
        <p className="text-sm font-medium mb-2">File</p>
        <Input
          id="picture"
          type="file"
          onChange={handleFileChange}
          accept=".pdf,.docx,.ppt,.pptx,.zip"
        />
        {file && (
          <p className="text-sm text-green-600 mt-1">
            Selected file: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </p>
        )}
        {fileError && <p className="text-sm text-red-600 mt-1">{fileError}</p>}
      </div>

      <Button
        className="bg-primary hover:bg-primary/90 max-w-[165px] w-full ml-auto h-10"
        onClick={() => {
          submitMilestone(milestone?.id ?? '');
        }}
      >
        Submit Milestone
      </Button>
    </>
  );
}

export default SubmitMilestoneForm;
