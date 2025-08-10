
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Save, Download, Upload, Trash2, Users, Shield, Bell, Globe } from "lucide-react";
import { dbService } from "@/utils/dbService";

interface AdminSettingsType {
  currency: string;
  showCurrency: boolean;
}

interface AdminSettingsProps {
  onSettingsChange: (settings: AdminSettingsType) => void;
}

const AdminSettings = ({ onSettingsChange }: AdminSettingsProps) => {
  const [settings, setSettings] = useState<AdminSettingsType>({
    currency: 'EUR',
    showCurrency: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("general");

  // إعدادات إضافية للإدارة
  const [adminConfig, setAdminConfig] = useState({
    systemLanguage: 'ar',
    timezone: 'Africa/Algiers',
    autoBackup: true,
    notificationsEnabled: true,
    maxPlayersPerPage: 20,
    defaultPlayerImage: '',
    organizationName: 'سكاوت برو',
    organizationLogo: '',
    contactEmail: 'admin@scoutpro.dz',
    privacyPolicy: '',
    termsOfService: '',
    allowPublicRegistration: false,
    requireEmailVerification: true
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await dbService.getSettings();
      setSettings(savedSettings);
    } catch (error) {
      console.error('خطأ في تحميل الإعدادات:', error);
    }
  };

  const saveSettings = async () => {
    setIsLoading(true);
    try {
      await dbService.saveSettings(settings);
      onSettingsChange(settings);
      console.log('تم حفظ الإعدادات بنجاح');
    } catch (error) {
      console.error('خطأ في حفظ الإعدادات:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportData = async () => {
    try {
      const players = await dbService.getPlayers();
      const dataToExport = {
        players,
        settings,
        adminConfig,
        exportDate: new Date().toISOString()
      };
      
      const dataStr = JSON.stringify(dataToExport, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `scout-pro-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('خطأ في تصدير البيانات:', error);
    }
  };

  const clearAllData = async () => {
    if (window.confirm('هل أنت متأكد من حذف جميع البيانات؟ هذا الإجراء لا يمكن التراجع عنه.')) {
      try {
        await dbService.savePlayers([]);
        window.location.reload();
      } catch (error) {
        console.error('خطأ في حذف البيانات:', error);
      }
    }
  };

  const menuItems = [
    { id: 'general', label: 'الإعدادات العامة', icon: Settings },
    { id: 'users', label: 'إدارة المستخدمين', icon: Users },
    { id: 'security', label: 'الأمان والخصوصية', icon: Shield },
    { id: 'notifications', label: 'الإشعارات', icon: Bell },
    { id: 'system', label: 'إعدادات النظام', icon: Globe }
  ];

  return (
    <div className="space-y-6">
      {/* قائمة التنقل */}
      <Card className="card-scout">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "default" : "outline"}
                onClick={() => setActiveSection(item.id)}
                className="flex-1 min-w-fit"
              >
                <item.icon className="w-4 h-4 ml-2" />
                {item.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* الإعدادات العامة */}
      {activeSection === 'general' && (
        <Card className="card-scout">
          <CardHeader>
            <CardTitle className="text-gradient-primary flex items-center gap-2">
              <Settings className="w-5 h-5" />
              الإعدادات العامة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="orgName">اسم المؤسسة</Label>
                <Input
                  id="orgName"
                  value={adminConfig.organizationName}
                  onChange={(e) => setAdminConfig(prev => ({ ...prev, organizationName: e.target.value }))}
                  className="text-right"
                  dir="rtl"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  value={adminConfig.contactEmail}
                  onChange={(e) => setAdminConfig(prev => ({ ...prev, contactEmail: e.target.value }))}
                  className="text-right"
                  dir="rtl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">العملة</Label>
              <Select value={settings.currency} onValueChange={(value) => setSettings(prev => ({ ...prev, currency: value }))}>
                <SelectTrigger className="text-right" dir="rtl">
                  <SelectValue placeholder="اختر العملة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EUR">يورو (EUR)</SelectItem>
                  <SelectItem value="USD">دولار أمريكي (USD)</SelectItem>
                  <SelectItem value="DZD">دينار جزائري (DZD)</SelectItem>
                  <SelectItem value="GBP">جنيه استرليني (GBP)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2 space-x-reverse">
              <Switch
                id="show-currency"
                checked={settings.showCurrency}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, showCurrency: checked }))}
              />
              <Label htmlFor="show-currency">إظهار العملة</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxPlayers">عدد اللاعبين في الصفحة</Label>
              <Input
                id="maxPlayers"
                type="number"
                min="10"
                max="100"
                value={adminConfig.maxPlayersPerPage}
                onChange={(e) => setAdminConfig(prev => ({ ...prev, maxPlayersPerPage: parseInt(e.target.value) }))}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* إدارة المستخدمين */}
      {activeSection === 'users' && (
        <Card className="card-scout">
          <CardHeader>
            <CardTitle className="text-gradient-primary flex items-center gap-2">
              <Users className="w-5 h-5" />
              إدارة المستخدمين
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Switch
                id="public-reg"
                checked={adminConfig.allowPublicRegistration}
                onCheckedChange={(checked) => setAdminConfig(prev => ({ ...prev, allowPublicRegistration: checked }))}
              />
              <Label htmlFor="public-reg">السماح بالتسجيل العام</Label>
            </div>

            <div className="flex items-center space-x-2 space-x-reverse">
              <Switch
                id="email-verification"
                checked={adminConfig.requireEmailVerification}
                onCheckedChange={(checked) => setAdminConfig(prev => ({ ...prev, requireEmailVerification: checked }))}
              />
              <Label htmlFor="email-verification">طلب تأكيد البريد الإلكتروني</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-roles">الأدوار المتاحة</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold">مدير عام</h4>
                  <p className="text-sm text-slate-600">جميع الصلاحيات</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold">كشاف</h4>
                  <p className="text-sm text-slate-600">عرض وإضافة اللاعبين</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold">مراقب</h4>
                  <p className="text-sm text-slate-600">عرض فقط</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* الأمان والخصوصية */}
      {activeSection === 'security' && (
        <Card className="card-scout">
          <CardHeader>
            <CardTitle className="text-gradient-primary flex items-center gap-2">
              <Shield className="w-5 h-5" />
              الأمان والخصوصية
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="privacy">سياسة الخصوصية</Label>
              <Textarea
                id="privacy"
                placeholder="أدخل سياسة الخصوصية..."
                value={adminConfig.privacyPolicy}
                onChange={(e) => setAdminConfig(prev => ({ ...prev, privacyPolicy: e.target.value }))}
                className="text-right min-h-32"
                dir="rtl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="terms">شروط الخدمة</Label>
              <Textarea
                id="terms"
                placeholder="أدخل شروط الخدمة..."
                value={adminConfig.termsOfService}
                onChange={(e) => setAdminConfig(prev => ({ ...prev, termsOfService: e.target.value }))}
                className="text-right min-h-32"
                dir="rtl"
              />
            </div>

            <div className="flex items-center space-x-2 space-x-reverse">
              <Switch
                id="auto-backup"
                checked={adminConfig.autoBackup}
                onCheckedChange={(checked) => setAdminConfig(prev => ({ ...prev, autoBackup: checked }))}
              />
              <Label htmlFor="auto-backup">النسخ الاحتياطي التلقائي</Label>
            </div>
          </CardContent>
        </Card>
      )}

      {/* الإشعارات */}
      {activeSection === 'notifications' && (
        <Card className="card-scout">
          <CardHeader>
            <CardTitle className="text-gradient-primary flex items-center gap-2">
              <Bell className="w-5 h-5" />
              إعدادات الإشعارات
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Switch
                id="notifications"
                checked={adminConfig.notificationsEnabled}
                onCheckedChange={(checked) => setAdminConfig(prev => ({ ...prev, notificationsEnabled: checked }))}
              />
              <Label htmlFor="notifications">تفعيل الإشعارات</Label>
            </div>

            <div className="space-y-3">
              <Label>أنواع الإشعارات:</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  'لاعب جديد مضاف',
                  'تحديث تقييم لاعب',
                  'مباراة قادمة للمراقبة',
                  'تقرير جديد مكتمل'
                ].map((type, index) => (
                  <div key={index} className="flex items-center space-x-2 space-x-reverse p-2 border rounded">
                    <Switch id={`notification-${index}`} defaultChecked />
                    <Label htmlFor={`notification-${index}`} className="text-sm">{type}</Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* إعدادات النظام */}
      {activeSection === 'system' && (
        <Card className="card-scout">
          <CardHeader>
            <CardTitle className="text-gradient-primary flex items-center gap-2">
              <Globe className="w-5 h-5" />
              إعدادات النظام
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="timezone">المنطقة الزمنية</Label>
              <Select value={adminConfig.timezone} onValueChange={(value) => setAdminConfig(prev => ({ ...prev, timezone: value }))}>
                <SelectTrigger className="text-right" dir="rtl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Africa/Algiers">الجزائر (GMT+1)</SelectItem>
                  <SelectItem value="Europe/Paris">باريس (GMT+1)</SelectItem>
                  <SelectItem value="GMT">غرينتش (GMT+0)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button onClick={exportData} variant="outline" className="w-full">
                <Download className="w-4 h-4 ml-2" />
                تصدير البيانات
              </Button>
              
              <Button variant="destructive" onClick={clearAllData} className="w-full">
                <Trash2 className="w-4 h-4 ml-2" />
                حذف جميع البيانات
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* أزرار الحفظ */}
      <div className="flex gap-4">
        <Button onClick={saveSettings} disabled={isLoading} className="flex-1 btn-primary">
          <Save className="w-4 h-4 ml-2" />
          {isLoading ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;
