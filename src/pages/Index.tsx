
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, TrendingUp, Award, Search, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

export default function Index() {
  const { user, signOut } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5" dir="rtl">
        {/* Header */}
        <header className="border-b bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-reverse space-x-2">
              <Target className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-primary">سكاوت الجزائر</h1>
            </div>
            <div className="flex space-x-reverse space-x-4">
              <Link to="/auth">
                <Button variant="outline">تسجيل الدخول</Button>
              </Link>
              <Link to="/auth">
                <Button>إنشاء حساب</Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20 text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-5xl font-bold mb-6 text-gradient-primary arabic-text">
              منصة الكشافة الاحترافية للمواهب الجزائرية
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto arabic-text leading-relaxed">
              اكتشف وقيم وطور المواهب الكروية في الجزائر باستخدام أحدث التقنيات والأدوات المتقدمة
            </p>
            <div className="flex justify-center space-x-reverse space-x-4">
              <Link to="/auth">
                <Button size="lg" className="btn-primary">
                  ابدأ الآن مجاناً
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                شاهد العرض التوضيحي
              </Button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-bold text-center mb-12 arabic-text">
              لماذا تختار سكاوت الجزائر؟
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="card-scout">
                <CardHeader className="text-center">
                  <Search className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle className="arabic-text">كشافة متقدمة</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center arabic-text">
                    أدوات كشافة احترافية لتقييم اللاعبين وتحليل الأداء بدقة عالية
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="card-scout">
                <CardHeader className="text-center">
                  <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle className="arabic-text">تحليل شامل</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center arabic-text">
                    تقارير مفصلة وإحصائيات دقيقة لمساعدتك في اتخاذ القرارات الصحيحة
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="card-scout">
                <CardHeader className="text-center">
                  <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle className="arabic-text">شبكة احترافية</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center arabic-text">
                    تواصل مع الكشافين والأندية والمدربين في جميع أنحاء الجزائر
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div className="stat-card p-6">
                <h4 className="text-3xl font-bold text-primary mb-2">500+</h4>
                <p className="text-muted-foreground arabic-text">لاعب مسجل</p>
              </div>
              <div className="stat-card p-6">
                <h4 className="text-3xl font-bold text-primary mb-2">50+</h4>
                <p className="text-muted-foreground arabic-text">كشاف نشط</p>
              </div>
              <div className="stat-card p-6">
                <h4 className="text-3xl font-bold text-primary mb-2">25+</h4>
                <p className="text-muted-foreground arabic-text">نادي شريك</p>
              </div>
              <div className="stat-card p-6">
                <h4 className="text-3xl font-bold text-primary mb-2">48</h4>
                <p className="text-muted-foreground arabic-text">ولاية مغطاة</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-3xl font-bold mb-6 arabic-text">
              انضم إلى مستقبل كرة القدم الجزائرية
            </h3>
            <p className="text-xl mb-8 opacity-90 arabic-text">
              ابدأ رحلتك في اكتشاف المواهب اليوم
            </p>
            <Link to="/auth">
              <Button size="lg" variant="secondary">
                سجل الآن مجاناً
              </Button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t bg-muted/30 py-8">
          <div className="container mx-auto px-4 text-center">
            <p className="text-muted-foreground arabic-text">
              © 2024 سكاوت الجزائر. جميع الحقوق محفوظة.
            </p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10" dir="rtl">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-reverse space-x-2">
            <Target className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">سكاوت الجزائر</h1>
          </div>
          <div className="flex items-center space-x-reverse space-x-4">
            <span className="text-sm text-muted-foreground arabic-text">
              مرحباً، {user.email}
            </span>
            <Button onClick={signOut} variant="outline">
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
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
              <Button className="w-full">عرض اللاعبين</Button>
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
              <Button className="w-full">إدارة التقارير</Button>
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
              <Button className="w-full">عرض الإحصائيات</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
