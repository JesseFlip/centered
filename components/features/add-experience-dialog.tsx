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

const experienceSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  role: z.string().min(1, 'Role is required'),
  location: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  description: z.string().optional(),
  bullets: z.string().optional(),
});

type ExperienceFormData = z.infer<typeof experienceSchema>;

export function AddExperienceDialog() {
  const [open, setOpen] = useState(false);
  const addExperience = usePersonaStore((state) => state.addExperience);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
  });

  const onSubmit = async (data: ExperienceFormData) => {
    try {
      await addExperience({
        company: data.company,
        role: data.role,
        location: data.location,
        startDate: data.startDate,
        endDate: data.endDate || undefined,
        description: data.description,
        bullets: data.bullets ? data.bullets.split('\n').filter(Boolean) : [],
        source: 'user',
        verified: true,
        confidence: 1.0,
        visibility: [],
      });
      reset();
      setOpen(false);
    } catch (error) {
      console.error('Failed to add experience:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button aria-label="Add new work experience">+ Add Experience</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Work Experience</DialogTitle>
          <DialogDescription>
            Add a new work experience to your profile. Fill in as much detail as you can.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company">Company *</Label>
            <Input
              id="company"
              {...register('company')}
              placeholder="Company name"
              aria-invalid={errors.company ? 'true' : 'false'}
            />
            {errors.company && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.company.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Input
              id="role"
              {...register('role')}
              placeholder="Job title"
              aria-invalid={errors.role ? 'true' : 'false'}
            />
            {errors.role && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.role.message}</p>
            )}
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
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                {...register('startDate')}
                aria-invalid={errors.startDate ? 'true' : 'false'}
              />
              {errors.startDate && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.startDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                {...register('endDate')}
                placeholder="Leave blank if current"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Brief overview of your role and responsibilities"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bullets">Key Achievements (one per line)</Label>
            <Textarea
              id="bullets"
              {...register('bullets')}
              placeholder="- Led team of 5 engineers&#10;- Increased performance by 40%&#10;- Launched 3 major features"
              rows={5}
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
              {isSubmitting ? 'Adding...' : 'Add Experience'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
