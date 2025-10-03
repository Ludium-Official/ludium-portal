import InputLabel from '@/components/common/label/inputLabel';
import CloseIcon from '@/assets/icons/common/CloseIcon.svg';
import { Badge } from '@/components/ui/badge';
import { handleImage } from '@/lib/functions/inputForm';
import { ImageIcon, Plus } from 'lucide-react';
import NetworkSelector from '@/components/network-selector';
import { ProgramStatus } from '@/types/types.generated';
import { useProgramQuery } from '@/apollo/queries/program.generated';
import CurrencySelector from '@/components/currency-selector';
import { mainnetDefaultNetwork } from '@/lib/utils';
import { DatePicker } from '@/components/ui/date-picker';
import { MultiSelect } from '@/components/ui/multi-select';
import MultipleInputLabel from '@/components/common/label/multipleInputLabel';
import { useParams } from 'react-router';
import { useUsersQuery } from '@/apollo/queries/users.generated';
import { useEffect, useState } from 'react';
import { ProgramOverviewProps } from '@/types/recruitment';

const ProgramOverview: React.FC<ProgramOverviewProps> = ({
  register,
  errors,
  extraErrors,
  keywords,
  setValue,
  imageError,
  setImageError,
  network,
  setNetwork,
  currency,
  setCurrency,
  deadline,
  setDeadline,
  selectedValidators,
  setSelectedValidators,
  selectedValidatorItems,
  setSelectedValidatorItems,
  selectedImage,
  isEdit,
  control,
}) => {
  const { id } = useParams();

  const [validatorInput, setValidatorInput] = useState<string>();
  const [debouncedValidatorInput, setDebouncedValidatorInput] = useState<string>();

  const { data: programData } = useProgramQuery({
    variables: {
      id: id ?? '',
    },
    skip: !isEdit,
  });

  const { data: validators, loading } = useUsersQuery({
    variables: {
      input: {
        limit: 5,
        offset: 0,
        filter: [
          {
            field: 'search',
            value: debouncedValidatorInput ?? '',
          },
        ],
      },
    },
    skip: !validatorInput,
  });

  const addKeyword = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      e.preventDefault();

      const newKeyword = e.currentTarget.value.trim();

      if (newKeyword && !keywords.includes(newKeyword)) {
        setValue('keywords', [...keywords, newKeyword]);
      }

      e.currentTarget.value = '';
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    setValue(
      'keywords',
      keywords.filter((keyword) => keyword !== keywordToRemove),
    );
  };

  const validatorOptions = validators?.users?.data?.map((v) => ({
    value: v.id ?? '',
    label: `${v.email} ${v.organizationName ? `(${v.organizationName})` : ''}`,
  }));

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValidatorInput(validatorInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [validatorInput]);

  return (
    <>
      <div className="bg-white py-6 px-10 rounded-lg mb-3">
        <InputLabel
          labelId="programName"
          title="Program title"
          className="mb-10"
          isPrimary={true}
          isError={errors.programName}
          placeholder="Type name"
          register={register}
        />

        <InputLabel
          labelId="keywords"
          title="Keywords"
          className="mb-10"
          isPrimary={true}
          isError={extraErrors.keyword}
          placeholder="Enter directly"
          onKeyDown={addKeyword}
        >
          {keywords.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {keywords.map((keyword) => (
                <Badge
                  key={keyword}
                  variant="secondary"
                  className="bg-gray1 text-gray-dark border-0 px-2.5 py-0.5 text-xs font-semibold"
                >
                  {keyword}
                  <button
                    type="button"
                    onClick={() => removeKeyword(keyword)}
                    className="ml-1 hover:bg-gray-200 rounded-full p-0.5 transition-colors"
                  >
                    <img src={CloseIcon} alt="remove-keyword" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </InputLabel>

        <div className="flex gap-6">
          <InputLabel
            labelId="image"
            type="file"
            inputWrapperClassName="relative overflow-hidden group flex items-center justify-center bg-gray2 w-[200px] h-[200px] rounded-lg"
            inputClassName="z-10 absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            register={register}
            onChange={(e) => {
              const file = e.target.files?.[0];
              handleImage({ file, setImageError, setValue });
            }}
          >
            <div>
              {selectedImage && selectedImage instanceof File ? (
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Preview"
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full">
                  <ImageIcon className="w-10 h-10 mb-2 text-gray-mid-dark" />
                </div>
              )}
              <div className="absolute bottom-0 right-0 bg-black/80 rounded-md w-10 h-10 flex justify-center items-center">
                <Plus className="w-5 h-5 text-white" />
              </div>
            </div>
          </InputLabel>
          <div className="flex flex-col justify-between">
            <div>
              <p className="font-medium">
                Cover Image
                <span className="ml-1 text-primary">*</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Logo image must be square, under 2MB, and in PNG, JPG, or JPEG format.
                <br />
                This image is used in the program list
              </p>
            </div>
            {imageError && (
              <span className="text-destructive text-sm block mt-2">{imageError}</span>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white px-10 pt-6 pb-[32px] rounded-lg mb-3">
        <div className="mb-10">
          <div className="flex items-end gap-2">
            <InputLabel
              labelId="network"
              title="Network"
              className="w-1/2"
              inputClassName="hidden"
              isPrimary={true}
            >
              <NetworkSelector
                disabled={isEdit && programData?.program?.status !== ProgramStatus.Pending}
                value={network}
                onValueChange={setNetwork}
                className="flex justify-between min-w-[120px] h-10 w-full bg-white border border-input text-gray-dark"
              />
            </InputLabel>
            <div className="flex items-end gap-2 w-1/2">
              <InputLabel
                labelId="price"
                type="number"
                title="Price"
                isPrimary={true}
                isError={errors.price}
                className="w-full"
                disabled={isEdit && programData?.program?.status !== ProgramStatus.Pending}
                register={register}
                placeholder="Enter price"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  handleImage({ file, setImageError, setValue });
                }}
              />
              {!!network && (
                <CurrencySelector
                  disabled={isEdit && programData?.program?.status !== ProgramStatus.Pending}
                  value={currency}
                  onValueChange={setCurrency}
                  network={network ?? mainnetDefaultNetwork}
                  className="w-[108px] h-10"
                />
              )}
            </div>
          </div>
          {isEdit && programData?.program?.status !== ProgramStatus.Pending && (
            <span className="text-destructive text-sm block">
              Price can't be updated after publishing.
            </span>
          )}
        </div>

        <InputLabel
          labelId="deadline"
          title="Deadline"
          className="mb-10"
          inputClassName="hidden"
          isPrimary={true}
          isError={extraErrors.deadline}
        >
          <DatePicker
            date={deadline}
            setDate={(date) => {
              if (date && typeof date === 'object' && 'getTime' in date) {
                const newDate = new Date(date.getTime());
                newDate.setHours(23, 59, 59, 999);
                setDeadline(newDate);
              } else {
                setDeadline(date);
              }
            }}
            disabled={{ before: new Date() }}
          />
        </InputLabel>

        <InputLabel
          labelId="validator"
          title="Validator"
          inputClassName="hidden"
          isPrimary={true}
          isError={extraErrors.validator}
        >
          <MultiSelect
            options={validatorOptions ?? []}
            value={selectedValidators}
            onValueChange={setSelectedValidators}
            placeholder="Select validator"
            animation={2}
            maxCount={20}
            inputValue={validatorInput}
            setInputValue={setValidatorInput}
            selectedItems={selectedValidatorItems}
            setSelectedItems={setSelectedValidatorItems}
            emptyText="Enter validator email or organization name"
            loading={loading}
            singleSelect={true} // TODO: remove this when multi validator flow is implemented
          />
        </InputLabel>
      </div>

      <div className="px-10 pt-6 pb-[32px] bg-white rounded-lg">
        <MultipleInputLabel
          labelId="links"
          title="Links"
          subTitle="Add links to your website, blog, or social media profiles."
          isError={extraErrors.links}
          control={control}
          placeholder="https://example.com/ludium"
          register={register}
        />
        {extraErrors.invalidLink && (
          <span className="text-destructive text-sm block">
            The provided link is not valid. All links must begin with{' '}
            <span className="font-bold">https://</span>.
          </span>
        )}
      </div>
    </>
  );
};

export default ProgramOverview;
