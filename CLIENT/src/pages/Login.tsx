import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AuthLayout from "@/components/AuthLayout";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      if (hasCheckedAuth) return;
      try {
        const response = await axios.get("http://localhost:3500/api/auth/check-auth", {
          withCredentials: true,
        });
        if (response.data.success && isMounted) {
          toast({
            title: "Bienvenue",
            description: "Vous êtes déjà connecté !",
          });
          navigate("/dashboard", { replace: true });
        }
      } catch (error: any) {
        if (error.response?.data?.action === "refresh_token" && isMounted) {
          try {
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Délai pour éviter la boucle
            await axios.post("http://localhost:3500/api/auth/refresh", {}, { withCredentials: true });
            const retryResponse = await axios.get("http://localhost:3500/api/auth/check-auth", {
              withCredentials: true,
            });
            if (retryResponse.data.success && isMounted) {
              toast({
                title: "Bienvenue",
                description: "Session restaurée !",
              });
              navigate("/dashboard", { replace: true });
            }
          } catch (refreshError) {
            console.log('Refresh failed:', refreshError);
            // Ne pas rediriger, laisser l'utilisateur sur /login
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setHasCheckedAuth(true);
        }
      }
    };

    checkAuth();
    return () => {
      isMounted = false;
    };
  }, [navigate, toast, hasCheckedAuth]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3500/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      toast({
        title: "Succès",
        description: "Connexion réussie !",
      });
      navigate("/dashboard", { replace: true });
    } catch (error: any) {
      let errorMessage = "Une erreur est survenue. Veuillez réessayer.";
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.errors) {
        errorMessage = error.response.data.errors
          .map((err: any) => err.msg)
          .join(", ");
      }

      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <AuthLayout title="Vérification...">
        <div className="text-center">Chargement...</div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Welcome Back">
      <form onSubmit={handleLogin} className="space-y-6 animate-fade-in">
        <div className="space-y-2">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full transition-all focus:scale-[1.02]"
          />
        </div>
        <div className="space-y-2">
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full transition-all focus:scale-[1.02]"
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-[#1a365d] hover:bg-[#2d3748] transform transition-all hover:scale-[1.02]"
        >
          Login
        </Button>
        <p className="text-center text-sm text-gray-600">
          Pas de compte ?{" "}
          <Link
            to="/register"
            className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
          >
            S'inscrire
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;