import profile from '@/assets/icons/profile-thin.svg'

import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

function ProfilePage() {

  return (
    <div className=''>
      <div className="flex gap-[58px]">
        <section className='w-[509px]'>
          <div className='mb-7'>
            <Button size="sm" className="w-[62px] mr-[5px]">Edit</Button>
            <Button size="sm" className="w-[62px]" disabled>View</Button>
          </div>

          <p className='text-[#7C7C7C] font-bold mb-1'>PROFILE PIC</p>
          <div className='flex items-end mb-5'>
            <img src={profile} alt="profile" className='w-[113px] h-[113px]' />
            <Button size='sm' className='w-[105px]'>UPLOAD</Button>
          </div>


          <label htmlFor="name" className='text-[#7C7C7C] font-bold mb-1'>ORGANIZATION/PERSON NAME</label>
          <Input id="name" type='text' placeholder='Input text' className='mb-7' />


          <label htmlFor="description" className='text-[#7C7C7C] font-bold mb-1'>DESCRIPTION</label>
          <Textarea id="description" placeholder='Input text' className='mb-7' />


          <label htmlFor="name" className='text-[#7C7C7C] font-bold mb-1'>ROLES</label>
          <Input id="name" type='text' placeholder='Input text' className='mb-7' />

          <label htmlFor="name" className='text-[#7C7C7C] font-bold mb-1'>LINKS</label>
          <Input id="name" type='text' placeholder='Input text' className='mb-7' />
        </section>

        <section>
          <h2 className='text-[20px] font-medium'>PROGRAMS AS SPONSOR</h2>
          <div className='mb-10 border border-[#E9E9E9] rounded-[10px] p-5 mt-5 w-[487px]'>

            <div className='flex justify-between'>
              <h3 className='text-[20px] font-medium'>PROGRAM NAME</h3>
              <span className='flex items-center text-xs px-2 py-1 rounded-sm border border-[#24BCFD] text-[#24BCFD] '>COMPLETED</span>
            </div>
            <p className='text-[#666666] font-bold text-sm'>50,000</p>
            <p className='text-[#666666] font-light text-sm'>Ludium's zkTLS Builder Escrow Payment Service is a decentralized payment solution that leverages </p>
          </div>

          <h2 className='text-[20px] font-medium'>PROGRAMS AS SPONSOR</h2>
          <div className='mb-10 border border-[#E9E9E9] rounded-[10px] p-5 mt-5 w-[487px]'>

            <div className='flex justify-between'>
              <h3 className='text-[20px] font-medium'>PROGRAM NAME</h3>
              <span className='flex items-center text-xs px-2 py-1 rounded-sm border border-[#24BCFD] text-[#24BCFD] '>COMPLETED</span>
            </div>
            <p className='text-[#666666] font-bold text-sm'>50,000</p>
            <p className='text-[#666666] font-light text-sm'>Ludium's zkTLS Builder Escrow Payment Service is a decentralized payment solution that leverages </p>
          </div>

          <h2 className='text-[20px] font-medium'>PROGRAMS AS SPONSOR</h2>
          <div className='border border-[#E9E9E9] rounded-[10px] p-5 mt-5 w-[487px]'>

            <div className='flex justify-between'>
              <h3 className='text-[20px] font-medium'>PROGRAM NAME</h3>
              <span className='flex items-center text-xs px-2 py-1 rounded-sm border border-[#24BCFD] text-[#24BCFD] '>COMPLETED</span>
            </div>
            <p className='text-[#666666] font-bold text-sm'>50,000</p>
            <p className='text-[#666666] font-light text-sm'>Ludium's zkTLS Builder Escrow Payment Service is a decentralized payment solution that leverages </p>
          </div>
        </section>
      </div>
      <div className='w-full max-w-[1100px] mt-10'>
        <Button size="sm" className='block w-[122px] mx-auto'>SAVE CHANGES</Button>

      </div>
    </div>
  );
}

export default ProfilePage;
