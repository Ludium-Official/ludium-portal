

import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

function ProfilePage() {

  return (
    <Tabs defaultValue='edit'>
      <div className="flex">
        <section className='w-[60%] px-10 py-5'>
          <TabsList className="grid grid-cols-2 w-full mb-6">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="view">View</TabsTrigger>
          </TabsList>
          <TabsContent value="edit">

            <p className='font-medium text-sm mb-2'>Profile image</p>
            <span className='block text-sm text-[#71717A] mb-2'>This is an input description</span>
            <div className='flex items-end mb-9 gap-12'>
              {/* <img src={profile} alt="profile" className='w-[113px] h-[113px]' /> */}
              <div className='w-[136px] h-[136px] bg-slate-400 rounded-full' />
              <Button size='sm' className='w-[136px]'>Upload</Button>
            </div>



            <label htmlFor="name" className='block text-foreground font-medium mb-2 text-sm'>Organization / Person name</label>
            <Input id="name" type='text' placeholder='Input text' className='mb-2 h-10' />
            <span className='block text-sm text-[#71717A] mb-10'>This is an input description</span>



            <label htmlFor="description" className='block text-foreground font-medium mb-2 text-sm'>Description</label>
            <Textarea id="description" placeholder='Input text' className='mb-2 h-10' />
            <span className='block text-sm text-[#71717A] mb-10'>This is an input description</span>


            <label htmlFor="name" className='block text-foreground font-medium mb-2 text-sm'>Roles</label>
            <Input id="name" type='text' placeholder='Input text' className='mb-2 h-10' />
            <span className='block text-sm text-[#71717A] mb-10'>This is an input description</span>

            <label htmlFor="name" className='block text-foreground font-medium mb-2 text-sm'>Links</label>
            <Input id="name" type='text' placeholder='Input text' className='mb-2 h-10' />
            <span className='block text-sm text-[#71717A] mb-10'>This is an input description</span>


            <Button className="w-[153px] h-[44px] ml-auto block mb-[83px]">Save Changes</Button>
          </TabsContent>

        </section>

        <div className='min-h-full border-l self-stretch' />

        <section className='w-[40%] px-10 py-[60px]'>
          <h2 className='text-[20px] font-medium'>PROGRAMS AS SPONSOR</h2>
          <div className='mb-10 border border-[#E9E9E9] rounded-[10px] p-5 mt-5 w-full'>

            <div className='flex justify-between'>
              <h3 className='text-[20px] font-medium'>PROGRAM NAME</h3>
              <span className='flex items-center text-xs px-2 py-1 rounded-sm border border-[#24BCFD] text-[#24BCFD] '>COMPLETED</span>
            </div>
            <p className='text-[#666666] font-bold text-sm'>50,000</p>
            <p className='text-[#666666] font-light text-sm'>Ludium's zkTLS Builder Escrow Payment Service is a decentralized payment solution that leverages </p>
          </div>

          <h2 className='text-[20px] font-medium'>PROGRAMS AS SPONSOR</h2>
          <div className='mb-10 border border-[#E9E9E9] rounded-[10px] p-5 mt-5 w-full'>

            <div className='flex justify-between'>
              <h3 className='text-[20px] font-medium'>PROGRAM NAME</h3>
              <span className='flex items-center text-xs px-2 py-1 rounded-sm border border-[#24BCFD] text-[#24BCFD] '>COMPLETED</span>
            </div>
            <p className='text-[#666666] font-bold text-sm'>50,000</p>
            <p className='text-[#666666] font-light text-sm'>Ludium's zkTLS Builder Escrow Payment Service is a decentralized payment solution that leverages </p>
          </div>

          <h2 className='text-[20px] font-medium'>PROGRAMS AS SPONSOR</h2>
          <div className='border border-[#E9E9E9] rounded-[10px] p-5 mt-5 w-full'>

            <div className='flex justify-between'>
              <h3 className='text-[20px] font-medium'>PROGRAM NAME</h3>
              <span className='flex items-center text-xs px-2 py-1 rounded-sm border border-[#24BCFD] text-[#24BCFD] '>COMPLETED</span>
            </div>
            <p className='text-[#666666] font-bold text-sm'>50,000</p>
            <p className='text-[#666666] font-light text-sm'>Ludium's zkTLS Builder Escrow Payment Service is a decentralized payment solution that leverages </p>
          </div>
        </section>
      </div>
      {/* <div className='w-full max-w-[1100px] mt-10'>
        <Button size="sm" className='block w-[122px] mx-auto'>SAVE CHANGES</Button>

      </div> */}
    </Tabs>
  );
}

export default ProfilePage;
