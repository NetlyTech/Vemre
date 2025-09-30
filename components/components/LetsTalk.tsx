'use client';
import { useRouter } from 'next/navigation';
interface NavigateButtonProps {
  to: string; // path to navigate to
  children: React.ReactNode;
  className?: string;
}
const NavigateButton: React.FC<NavigateButtonProps> = ({ to, children, className }) => {
  const router = useRouter();
  return (
    <div className='flex items-center justify-center bg-[#ccd5d4] pt-4 pb-8'>
      <button
      onClick={() => router.push('/contact')}
      className={` px-6 py-3 bg-green-800 text-white rounded hover:bg-black transition ${className ?? ''}`}
      type="button"
    > Let's Talk - Send A message
      {children}
    </button>
    </div>
    
  );
};
export default NavigateButton;