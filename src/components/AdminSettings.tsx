
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Save, Plus, Trash2 } from 'lucide-react';
import { AdminSettingsType } from '@/types/admin';

const AdminSettings = () => {
  const [newSetting, setNewSetting] = useState({ key: '', value: '' });
  const queryClient = useQueryClient();

  const fetchSettings = async (): Promise<AdminSettingsType[]> => {
    const { data, error } = await supabase
      .from('admin_settings')
      .select('*')
      .order('setting_key');
    
    if (error) throw error;
    return data as AdminSettingsType[];
  };

  const updateSetting = async (setting: AdminSettingsType): Promise<AdminSettingsType> => {
    const { data, error } = await supabase
      .from('admin_settings')
      .update({ 
        setting_value: setting.setting_value,
        updated_at: new Date().toISOString()
      })
      .eq('id', setting.id)
      .select()
      .single();
    
    if (error) throw error;
    return data as AdminSettingsType;
  };

  const { data: settings, isLoading } = useQuery({
    queryKey: ['adminSettings'],
    queryFn: fetchSettings,
  });

  const updateMutation = useMutation({
    mutationFn: updateSetting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSettings'] });
    },
  });

  const handleUpdate = (setting: AdminSettingsType) => {
    updateMutation.mutate(setting);
  };

  if (isLoading) {
    return <div className="text-center">Loading settings...</div>;
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center space-x-reverse space-x-2">
        <Settings className="h-6 w-6" />
        <h2 className="text-2xl font-bold arabic-text">إعدادات النظام</h2>
      </div>

      <div className="grid gap-4">
        {settings && settings.length > 0 ? (
          settings.map((setting) => (
            <Card key={setting.id}>
              <CardHeader>
                <CardTitle className="arabic-text">{setting.setting_key}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  value={setting.setting_value || ''}
                  onChange={(e) => {
                    const updatedSettings = settings.find(s => s.id === setting.id);
                    if (updatedSettings) {
                      updatedSettings.setting_value = e.target.value;
                    }
                  }}
                  className="arabic-text"
                />
                <Button 
                  onClick={() => handleUpdate(setting)}
                  disabled={updateMutation.isPending}
                  className="w-full"
                >
                  <Save className="h-4 w-4 ml-2" />
                  {updateMutation.isPending ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground arabic-text">لا توجد إعدادات متاحة</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminSettings;
