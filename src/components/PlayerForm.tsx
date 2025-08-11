
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Player } from '@/types';

export interface PlayerFormProps {
  player?: Player;
  onPlayerSaved: () => void;
  onCancel: () => void;
}

const PlayerForm: React.FC<PlayerFormProps> = ({ player, onPlayerSaved, onCancel }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Partial<Player>>({
    defaultValues: player || {}
  });

  const onSubmit = (data: Partial<Player>) => {
    console.log('Player data:', data);
    onPlayerSaved();
  };

  return (
    <Card className="w-full max-w-2xl" dir="rtl">
      <CardHeader>
        <CardTitle className="arabic-text">
          {player ? 'تعديل اللاعب' : 'إضافة لاعب جديد'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="arabic-text">الاسم</Label>
              <Input 
                id="name" 
                {...register('name', { required: 'الاسم مطلوب' })} 
                className="arabic-text"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>
            
            <div>
              <Label htmlFor="age" className="arabic-text">العمر</Label>
              <Input 
                id="age" 
                type="number" 
                {...register('age', { required: 'العمر مطلوب', min: 16, max: 40 })} 
              />
              {errors.age && <p className="text-red-500 text-sm">{errors.age.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="position" className="arabic-text">المركز</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="اختر المركز" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GK">حارس مرمى</SelectItem>
                  <SelectItem value="DEF">مدافع</SelectItem>
                  <SelectItem value="MID">وسط</SelectItem>
                  <SelectItem value="FWD">مهاجم</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="club" className="arabic-text">النادي</Label>
              <Input 
                id="club" 
                {...register('club', { required: 'النادي مطلوب' })} 
                className="arabic-text"
              />
              {errors.club && <p className="text-red-500 text-sm">{errors.club.message}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="location" className="arabic-text">الموقع</Label>
            <Input 
              id="location" 
              {...register('location', { required: 'الموقع مطلوب' })} 
              className="arabic-text"
            />
            {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="height" className="arabic-text">الطول</Label>
              <Input 
                id="height" 
                {...register('height')} 
                placeholder="مثال: 180cm"
                className="arabic-text"
              />
            </div>
            
            <div>
              <Label htmlFor="weight" className="arabic-text">الوزن</Label>
              <Input 
                id="weight" 
                {...register('weight')} 
                placeholder="مثال: 75kg"
                className="arabic-text"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="phone" className="arabic-text">رقم الهاتف</Label>
            <Input 
              id="phone" 
              {...register('phone')} 
              className="arabic-text"
            />
          </div>

          <div>
            <Label htmlFor="notes" className="arabic-text">ملاحظات</Label>
            <Textarea 
              id="notes" 
              {...register('notes')} 
              className="arabic-text"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-reverse space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              إلغاء
            </Button>
            <Button type="submit">
              {player ? 'تحديث' : 'إضافة'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PlayerForm;
