import { ArrowLeft } from "lucide-react";


const DetailsPage: React.FC = () => {
  return (
    <div className="p-10 pr-[55px]">
      <section className="flex justify-between items-center mb-3 bg-white">
        <button type="button" className="flex gap-2 items-center text-[#861CC4] text-lg">
          <ArrowLeft />
          BACK
        </button>
        DETAILS
      </section>
    </div>
  );
};

export default DetailsPage;