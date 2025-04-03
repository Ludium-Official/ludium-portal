import EditProgramForm from "./_components/edit-program-form";

const CreateProgram: React.FC = () => {
  return (
    <div className="p-10 pr-[55px] w-[681px]" defaultValue="edit">
      <EditProgramForm />
    </div>
  );
};

export default CreateProgram;