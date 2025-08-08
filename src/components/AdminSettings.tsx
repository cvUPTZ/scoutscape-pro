
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Settings, Save } from "lucide-react";
import { dbService, AdminSettings as AdminSettingsType } from "@/utils/indexedDB";

interface AdminSettingsProps {
  onSettingsChange: (settings: AdminSettingsType) => void;
}

const AdminSettings = ({ onSettingsChange }: AdminSettingsProps) => {
  const [settings, setSettings] = useState<AdminSettingsType>({
    currency: 'EUR',
    showCurrency: true
  });
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <Card className="card-scout">
      <CardHeader>
        <CardTitle className="text-gradient-primary flex items-center gap-2">
          <Settings className="w-5 h-5" />
          إعدادات الإدارة
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="currency">العملة</Label>
          <Input
            id="currency"
            value={settings.currency}
            onChange={(e) => setSettings(prev => ({ ...prev, currency: e.target.value }))}
            placeholder="مثال: EUR, USD, DZD"
            className="text-right"
            dir="rtl"
          />
        </div>
        
        <div className="flex items-center space-x-2 space-x-reverse">
          <Switch
            id="show-currency"
            checked={settings.showCurrency}
            onCheckedChange={(checked) => setSettings(prev => ({ ...prev, showCurrency: checked }))}
          />
          <Label htmlFor="show-currency">إظهار العملة</Label>
        </div>
        
        <Button onClick={saveSettings} disabled={isLoading} className="w-full btn-primary">
          <Save className="w-4 h-4 ml-2" />
          {isLoading ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AdminSettings;
