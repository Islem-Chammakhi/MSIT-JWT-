import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [protectedData, setProtectedData] = useState<string | null>(null);
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
          setUser({ email: response.data.user.email });
          try {
            const protectedResponse = await axios.get("http://localhost:3500/api/auth/protected", {
              withCredentials: true,
            });
            setProtectedData(protectedResponse.data.message);
          } catch (protectedError) {
            console.log('Failed to load protected data:', protectedError);
            setProtectedData(null);
          }
        } else if (isMounted) {
          navigate("/login", { replace: true });
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
              setUser({ email: retryResponse.data.user.email });
              try {
                const protectedResponse = await axios.get("http://localhost:3500/api/auth/protected", {
                  withCredentials: true,
                });
                setProtectedData(protectedResponse.data.message);
                toast({
                  title: "Session restaurée",
                  description: "Votre session a été renouvelée avec succès !",
                });
              } catch (protectedError) {
                console.log('Failed to load protected data:', protectedError);
                setProtectedData(null);
              }
            } else if (isMounted) {
              navigate("/login", { replace: true });
            }
          } catch (refreshError) {
            console.log('Refresh failed:', refreshError);
            if (isMounted) {
              toast({
                title: "Erreur",
                description: "Impossible de restaurer la session. Veuillez vous reconnecter.",
                variant: "destructive",
              });
              navigate("/login", { replace: true });
            }
          }
        } else if (isMounted) {
          toast({
            title: "Erreur",
            description: "Session invalide. Veuillez vous reconnecter.",
            variant: "destructive",
          });
          navigate("/login", { replace: true });
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
  }, [navigate, toast]);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3500/api/auth/logout",
        {},
        { withCredentials: true }
      );
      toast({
        title: "Déconnexion",
        description: "Vous avez été déconnecté avec succès.",
      });
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      navigate("/login", { replace: true });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen justify-center items-center">
        <div className="text-center text-gray-600">Chargement...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen">
      <Sidebar email={user.email} onLogout={handleLogout} />
      <main className="flex-1 p-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-[#1a365d] mb-6">Dashboard</h1>
        <p className="text-gray-600 leading-relaxed mb-4">
          Bienvenue sur votre tableau de bord sécurisé. Cette zone est uniquement accessible aux utilisateurs authentifiés.
        </p>
        {protectedData ? (
          <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg shadow">
            <h2 className="font-semibold">Contenu sécurisé</h2>
            <p>{protectedData}</p>
          </div>
        ) : (
          <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-lg shadow">
            <p>Impossible de charger le contenu sécurisé.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;