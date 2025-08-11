import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Target } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
    const { user, role, signOut } = useAuth();

    return (
        <header className="border-b bg-white/80 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/dashboard" className="flex items-center space-x-reverse space-x-2">
                    <Target className="h-8 w-8 text-primary" />
                    <h1 className="text-2xl font-bold text-primary">سكاوت الجزائر</h1>
                </Link>
                <div className="flex items-center space-x-reverse space-x-4">
                    {role === 'admin' && (
                        <Link to="/admin">
                            <Button variant="outline">Admin</Button>
                        </Link>
                    )}
                    <span className="text-sm text-muted-foreground arabic-text">
                        مرحباً، {user?.email}
                    </span>
                    <Button onClick={signOut} variant="outline">
                        تسجيل الخروج
                    </Button>
                </div>
            </div>
        </header>
    );
};

export default Header;
