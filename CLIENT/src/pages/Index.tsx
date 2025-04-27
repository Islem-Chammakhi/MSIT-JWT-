
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          <h1 className="text-5xl font-bold text-[#1a365d] mb-6 animate-slide-in-right">
            Welcome to MSIT
          </h1>
          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            Delivering innovative IT solutions for modern businesses. Our expertise helps
            companies transform their digital infrastructure and achieve their technology goals.
          </p>
          <div className="space-x-4">
            <Button 
              asChild 
              className="bg-[#1a365d] hover:bg-[#2d3748] transform transition-all hover:scale-105"
            >
              <Link to="/register">Register</Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              className="border-[#1a365d] text-[#1a365d] hover:bg-[#1a365d] hover:text-white transform transition-all hover:scale-105"
            >
              <Link to="/login">Login</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
