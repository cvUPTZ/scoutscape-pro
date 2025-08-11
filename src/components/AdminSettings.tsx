import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AdminSettingsType } from "@/types/admin";

const fetchAdminSettings = async () => {
  const { data, error } = await supabase.from("admin_settings").select("*");
  if (error) {
    console.error("Error fetching admin settings:", error);
    throw error;
  }
  return data as AdminSettingsType[];
};

const updateAdminSetting = async (setting: AdminSettingsType) => {
  const { data, error } = await supabase
    .from("admin_settings")
    .update(setting)
    .eq("id", setting.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating admin setting:", error);
    throw error;
  }
  return data as AdminSettingsType;
};

const AdminSettings = () => {
  const [settings, setSettings] = useState<AdminSettingsType | null>(null);
  const { data, isLoading, isError, error } = useQuery(
    "adminSettings",
    fetchAdminSettings
  );
  const queryClient = useQueryClient();

  const mutation = useMutation(updateAdminSetting, {
    onSuccess: () => {
      queryClient.invalidateQueries("adminSettings");
    },
  });

  useEffect(() => {
    if (data && data.length > 0) {
      setSettings(data[0] as AdminSettingsType);
    }
  }, [data]);

  if (isLoading) return <div>Loading settings...</div>;
  if (isError) return <div>Error: {(error as Error).message}</div>;

  const handleSettingChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    setSettings({ ...settings, [key]: e.target.value } as AdminSettingsType);
  };

  const handleUpdateSetting = async () => {
    if (settings) {
      await mutation.mutateAsync(settings);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Settings</h1>
      {data && data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="settingSelect">Select Setting:</Label>
            <Select
              onValueChange={(value) => {
                const selectedData = data.find(item => item.id === value);
                if (selectedData) {
                  setSettings(selectedData as AdminSettingsType);
                }
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a setting" />
              </SelectTrigger>
              <SelectContent>
                {data.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.setting_key}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {settings && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="settingKey">Setting Key</Label>
                <Input
                  type="text"
                  id="settingKey"
                  value={settings.setting_key}
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="settingValue">Setting Value</Label>
                <Input
                  type="text"
                  id="settingValue"
                  value={settings.setting_value}
                  onChange={(e) => handleSettingChange(e, "setting_value")}
                />
              </div>
              <Button onClick={handleUpdateSetting} disabled={mutation.isLoading}>
                {mutation.isLoading ? "Updating..." : "Update Setting"}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div>No settings found.</div>
      )}
    </div>
  );
};

export default AdminSettings;
