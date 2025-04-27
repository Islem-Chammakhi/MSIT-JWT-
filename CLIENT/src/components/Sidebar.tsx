
import { Button } from "@/components/ui/button";

interface SidebarProps {
  email: string;
  onLogout: () => void;
}

const Sidebar = ({ email, onLogout }: SidebarProps) => {
  return (
    <div className="w-64 h-screen bg-[#1a365d] text-white p-6 flex flex-col animate-slide-in-right">
      <div className="text-2xl font-bold mb-8 animate-fade-in">MSIT</div>
      <div className="flex-1">
        <div className="mb-4 text-sm text-gray-300 animate-fade-in">Logged in as:</div>
        <div className="mb-8 font-medium truncate animate-fade-in">{email}</div>
      </div>
      <Button 
        variant="outline" 
        className="w-full bg-transparent border-white text-white hover:bg-white hover:text-[#1a365d] transform transition-all hover:scale-105"
        onClick={onLogout}
      >
        Logout
      </Button>
    </div>
  );
};

export default Sidebar;
