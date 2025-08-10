import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAddReport } from "@/hooks/useReports";

export default function AddReportForm({ playerId, onSaved }: { playerId: number; onSaved: () => void }) {
  const [formData, setFormData] = useState({
    match_date: "",
    opponent: "",
    competition: "",
    minutes_played: "",
    rating: "",
    notes: ""
  });
  const addReport = useAddReport(playerId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addReport.mutate({
      ...formData,
      player_id: playerId
    });
    onSaved();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div>
        <Label>تاريخ المباراة</Label>
        <Input type="date" value={formData.match_date} onChange={e => setFormData({ ...formData, match_date: e.target.value })} required />
      </div>
      <div>
        <Label>المنافس</Label>
        <Input value={formData.opponent} onChange={e => setFormData({ ...formData, opponent: e.target.value })} />
      </div>
      <div>
        <Label>البطولة</Label>
        <Input value={formData.competition} onChange={e => setFormData({ ...formData, competition: e.target.value })} />
      </div>
      <div>
        <Label>الدقائق</Label>
        <Input type="number" value={formData.minutes_played} onChange={e => setFormData({ ...formData, minutes_played: e.target.value })} />
      </div>
      <div>
        <Label>التقييم</Label>
        <Input type="number" step="0.1" value={formData.rating} onChange={e => setFormData({ ...formData, rating: e.target.value })} />
      </div>
      <div>
        <Label>ملاحظات</Label>
        <Textarea value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
      </div>
      <Button type="submit" className="w-full">حفظ التقرير</Button>
    </form>
  );
}
