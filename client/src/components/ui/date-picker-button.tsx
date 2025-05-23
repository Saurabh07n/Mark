import { CalendarIcon } from 'lucide-react';

interface DatePickerButtonProps {
  date: string;
  onClick?: () => void;
  className?: string;
}

const DatePickerButton = ({
  date,
  onClick,
  className = '',
}: DatePickerButtonProps) => {
  return (
    <div 
      className={`flex items-center bg-gray-200 rounded-md px-3 py-2 space-x-2 cursor-pointer hover:bg-gray-300 ${className}`}
      onClick={onClick}
    >
      <span className="text-sm text-gray-700 font-medium whitespace-nowrap">{date}</span>
      <CalendarIcon className="text-gray-700 h-4 w-4" />
    </div>
  );
};

export default DatePickerButton; 