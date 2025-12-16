import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Pen, Plus } from "lucide-react";
import AboutIcon from "@/assets/icons/profile/about.svg";
import { useState } from "react";

interface AboutSectionProps {
  bio?: string | null;
}

const MAX_CHARACTERS = 1000;

export const AboutSection: React.FC<AboutSectionProps> = ({ bio }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [aboutText, setAboutText] = useState(bio || "");

  const handleSave = () => {
    // TODO: Implement API call to save about
    console.log({ bio: aboutText });
    setIsOpen(false);
  };

  const handleCancel = () => {
    setAboutText(bio || "");
    setIsOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setAboutText(bio || "");
    }
    setIsOpen(open);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg px-10 py-5">
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold">About</h2>
          {bio && (
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-10">
                <Pen className="h-4 w-4" />
              </Button>
            </DialogTrigger>
          )}
        </div>

        {bio ? (
          <div className="mb-4">
            <p className="max-h-[360px] overflow-y-auto text-sm text-slate-600 whitespace-pre-wrap">
              {bio}
            </p>
          </div>
        ) : (
          <div className="border border-gray-200 rounded-lg p-10 flex flex-col items-center justify-center">
            <img
              src={AboutIcon}
              alt="About"
              className="h-12 w-12 text-gray-300 mb-1"
            />
            <p className="text-slate-500 mb-2 font-light">
              No about added yet.
            </p>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Details
              </Button>
            </DialogTrigger>
          </div>
        )}

        <DialogContent className="sm:max-w-[782px] px-10 py-4">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-base font-semibold text-slate-800">
              About
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={handleSave}
              >
                Save
              </Button>
            </div>
          </DialogHeader>

          <div className="my-4">
            <Textarea
              placeholder="Introduce yourself. You can describe your skills, experience, and background."
              value={aboutText}
              onChange={(e) => {
                if (e.target.value.length <= MAX_CHARACTERS) {
                  setAboutText(e.target.value);
                }
              }}
              className="min-h-[200px] resize-none"
            />
            <p className="text-sm text-gray-500 text-right mt-2">
              {aboutText.length}/{MAX_CHARACTERS} characters
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
