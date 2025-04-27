import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AuthLayout from "@/components/AuthLayout";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password || !confirmPassword) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3500/api/auth/register",
        { email, password, confirmPassword }, // Inclure confirmPassword
        { withCredentials: true }
      );

      toast({
        title: "Succès",
        description: "Compte créé avec succès !",
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Créer un compte">
      <form onSubmit={handleRegister} className="space-y-6 animate-fade-in">
        <div className="space-y-2">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full transition-all focus:scale-[1.02]"
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full transition-all focus:scale-[1.02]"
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Input
            type="password"
            placeholder="Confirmer le mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full transition-all focus:scale-[1.02]"
            disabled={isLoading}
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-[#1a365d] hover:bg-[#2d3748] transform transition-all hover:scale-[1.02]"
          disabled={isLoading}
        >
          {isLoading ? "Inscription..." : "S'inscrire"}
        </Button>
        <p className="text-center text-sm text-gray-600">
          Déjà un compte ?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
          >
            Se connecter
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Register;