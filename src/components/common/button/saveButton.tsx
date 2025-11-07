import { useUsersV2Query } from '@/apollo/queries/users-v2.generated';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import notify from '@/lib/notify';
import type { LabelValueProps, VisibilityProps } from '@/types/common';
import { useEffect, useState } from 'react';
import type { UseFormSetValue } from 'react-hook-form';

interface SaveButtonProps {
  isAllFill: boolean;
  loading?: boolean;
  setValue: UseFormSetValue<any>;
  visibility?: VisibilityProps;
  selectedInviters: string[];
  setSelectedInviters: React.Dispatch<React.SetStateAction<string[]>>;
  selectedInviterItems: LabelValueProps[];
  setSelectedInviterItems: React.Dispatch<React.SetStateAction<LabelValueProps[]>>;
  formRef: React.RefObject<HTMLFormElement | null>;
  onBeforeSubmit?: () => void;
}

const SaveButton: React.FC<SaveButtonProps> = ({
  isAllFill,
  loading,
  setValue,
  visibility,
  selectedInviters,
  setSelectedInviters,
  selectedInviterItems,
  setSelectedInviterItems,
  formRef,
  onBeforeSubmit,
}) => {
  const [inviterInput, setInviterInput] = useState<string>();
  const [debouncedInviterInput, setDebouncedInviterInput] = useState<string>();

  const { data: invitersData, loading: invitersLoading } = useUsersV2Query({
    variables: {
      query: {
        limit: 5,
        search: debouncedInviterInput ?? '',
      },
    },
    skip: !inviterInput,
  });

  const InviterOptions = invitersData?.usersV2?.users?.map((v) => ({
    value: v.id ?? '',
    label: `${v.email} ${v.organizationName ? `(${v.organizationName})` : ''}`,
  }));

  const extraValidation = () => {
    if (isAllFill) {
      notify('Please fill in all required fields.', 'error');
    }

    if (onBeforeSubmit) {
      onBeforeSubmit();
    }

    formRef?.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedInviterInput(inviterInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [inviterInput]);

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          type="button"
          className="min-w-[97px] bg-primary hover:bg-primary/90"
          size="lg"
          disabled={loading}
        >
          Publish
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-[440px]">
        <h2 className="text-foreground font-semibold text-center text-lg">Visibility</h2>
        <p className="text-center text-muted-foreground text-sm mb-4">
          Choose when to publish and who can see your program.
        </p>

        <RadioGroup
          defaultValue="public"
          className="space-y-2 mb-8"
          value={visibility}
          onValueChange={(value: VisibilityProps) => {
            setValue('visibility', value);
          }}
        >
          <div className="flex items-start gap-3">
            <RadioGroupItem value="private" id="r1" className="border-foreground" />
            <div className="flex-1">
              <Label htmlFor="r1" className="font-medium mb-[6px]">
                Private
              </Label>
              <p className="text-sm text-muted-foreground mb-2">
                Only invited users can view this program.
              </p>
              {visibility === 'private' && (
                <MultiSelect
                  options={InviterOptions ?? []}
                  value={selectedInviters}
                  onValueChange={setSelectedInviters}
                  placeholder="Search Inviter"
                  animation={2}
                  maxCount={20}
                  inputValue={inviterInput}
                  setInputValue={setInviterInput}
                  selectedItems={selectedInviterItems}
                  setSelectedItems={setSelectedInviterItems}
                  emptyText="Enter Inviter email or organization name"
                  loading={invitersLoading}
                  className="mt-2"
                />
              )}
            </div>
          </div>
          <div className="flex items-start gap-3">
            <RadioGroupItem value="restricted" id="r2" className="border-foreground" />
            <div>
              <Label htmlFor="r2">Restricted</Label>
              <p className="text-sm text-muted-foreground">Only users with links can view.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <RadioGroupItem value="public" id="r3" className="border-foreground" />
            <div>
              <Label htmlFor="r3">Public</Label>
              <p className="text-sm text-muted-foreground">Anyone can view this program.</p>
            </div>
          </div>
        </RadioGroup>

        <Button
          onClick={() => {
            extraValidation();
          }}
          type="submit"
          className="w-full bg-primary hover:bg-primary/90"
          disabled={loading}
        >
          Save
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default SaveButton;
