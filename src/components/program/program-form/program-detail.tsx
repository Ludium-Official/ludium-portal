import InputLabel from '@/components/common/label/inputLabel';
import { MarkdownEditor } from '@/components/markdown';
import { ProgramDetailProps } from '@/types/recruitment';

const ProgramDetail: React.FC<ProgramDetailProps> = ({
  register,
  errors,
  setValue,
  description,
}) => {
  return (
    <>
      <div className="bg-white px-10 py-6 rounded-lg mb-3">
        <InputLabel
          labelId="summary"
          title="Type summary"
          isPrimary
          isError={errors.summary}
          placeholder="Type name"
          register={register}
          isTextarea
        />
      </div>

      <div className="px-10 py-6 bg-white rounded-lg">
        <InputLabel
          labelId="description"
          title="Description"
          isPrimary
          isError={errors.description}
          placeholder="Type name"
          inputClassName="hidden"
        >
          <MarkdownEditor
            onChange={(value: string) => {
              setValue('description', value);
            }}
            content={description}
          />
        </InputLabel>
      </div>
    </>
  );
};

export default ProgramDetail;
