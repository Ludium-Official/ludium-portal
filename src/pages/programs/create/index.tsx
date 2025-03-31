import EditProgramForm from "./_components/edit-program-form";

const CreateProgram: React.FC = () => {
  return (
    <div className="p-10 pr-[55px] w-[681px]" defaultValue="edit">
      <EditProgramForm />
      {/* <TabsList className="grid grid-cols-2 w-full mb-6">
        <TabsTrigger value="edit">Edit</TabsTrigger>
        <TabsTrigger value="view">View</TabsTrigger>
      </TabsList>

      <TabsContent value="edit">
        <EditProgramForm />
      </TabsContent>
      <TabsContent value="view">View Program</TabsContent> */}
    </div>
  );
};

export default CreateProgram;