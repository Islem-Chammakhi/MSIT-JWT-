
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AuthLayout = ({ children, title }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-gray-100">
      <Card className="w-[400px] shadow-lg transform transition-all hover:shadow-xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <Link 
              to="/" 
              className="text-2xl font-bold text-blue-900 hover:text-blue-700 transition-colors"
            >
              MSIT
            </Link>
          </div>
          <CardTitle className="text-2xl font-semibold text-center mt-4">{title}</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
};

export default AuthLayout;
