'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { usePersonaStore } from '@/lib/store';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const educationSchema = z.object({
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().optional(),
  field: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  gpa: z.string().optional(),
  honors: z.string().optional(),
  description: z.string().optional(),
});

type EducationFormData = z.infer<typeof educationSchema>;

export function AddEducationDialog() {
  const [open, setOpen] = useState(false);
  const addEducation = usePersonaStore((state) => state.addEducation);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
  });

  const onSubmit = async (data: EducationFormData) => {
    try {
      await addEducation({
        institution: data.institution,
        degree: data.degree,
        field: data.field,
        location: data.location,
        startDate: data.startDate,
        endDate: data.endDate,
        gpa: data.gpa,
        honors: data.honors ? data.honors.split('\n').filter(Boolean) : [],
        description: data.description,
        source: 'user',
        verified: true,
        confidence: 1.0,
        visibility: [],
      });
      reset();
      setOpen(false);
    } catch (error) {
      console.error('Failed to add education:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button aria-label="Add new education">+ Add Education</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Education</DialogTitle>
          <DialogDescription>
            Add your educational background.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="institution">Institution *</Label>
            <Input
              id="institution"
              {...register('institution')}
              placeholder="University or School name"
              aria-invalid={errors.institution ? 'true' : 'false'}
            />
            {errors.institution && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.institution.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="degree">Degree</Label>
              <Input
                id="degree"
                {...register('degree')}
                placeholder="e.g., Bachelor of Science"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="field">Field of Study</Label>
              <Input
                id="field"
                {...register('field')}
                placeholder="e.g., Computer Science"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              {...register('location')}
              placeholder="City, State/Country"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                {...register('startDate')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                {...register('endDate')}
                placeholder="Leave blank if ongoing"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gpa">GPA</Label>
            <Input
              id="gpa"
              {...register('gpa')}
              placeholder="e.g., 3.8/4.0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="honors">Honors & Awards (one per line)</Label>
            <Textarea
              id="honors"
              {...register('honors')}
              placeholder="- Dean's List&#10;- Summa Cum Laude&#10;- Presidential Scholarship"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Additional Information</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Relevant coursework, thesis, activities, etc."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Education'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
