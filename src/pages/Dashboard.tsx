
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, TrendingUp, Award, Search, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user, signOut } = useAuth();

  return (
    <>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4 arabic-text">لوحة التحكم الرئيسية</h2>
          <p className="text-muted-foreground arabic-text">
            إدارة الكشافة والتقارير والمواهب
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="card-scout">
            <CardHeader>
              <CardTitle className="flex items-center space-x-reverse space-x-2 arabic-text">
                <Users className="h-5 w-5" />
                <span>إدارة اللاعبين</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground arabic-text mb-4">
                عرض وإدارة ملفات اللاعبين والمواهب المكتشفة
              </p>
              <Link to="/players" className="w-full">
                <Button className="w-full">عرض اللاعبين</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="card-scout">
            <CardHeader>
              <CardTitle className="flex items-center space-x-reverse space-x-2 arabic-text">
                <BarChart3 className="h-5 w-5" />
                <span>التقارير</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground arabic-text mb-4">
                إنشاء ومراجعة تقارير الكشافة والتقييمات
              </p>
              <Link to="/reports" className="w-full">
                <Button className="w-full">إدارة التقارير</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="card-scout">
            <CardHeader>
              <CardTitle className="flex items-center space-x-reverse space-x-2 arabic-text">
                <Award className="h-5 w-5" />
                <span>الإحصائيات</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground arabic-text mb-4">
                تحليل الأداء والإحصائيات الشاملة
              </p>
              <Link to="/statistics" className="w-full">
                <Button className="w-full">عرض الإحصائيات</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
    </>
  );
}
