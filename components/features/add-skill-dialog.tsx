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

const skillSchema = z.object({
  name: z.string().min(1, 'Skill name is required'),
  category: z.string().optional(),
  proficiency: z.string().optional(),
  yearsOfExperience: z.string().optional(),
});

type SkillFormData = z.infer<typeof skillSchema>;

export function AddSkillDialog() {
  const [open, setOpen] = useState(false);
  const addSkill = usePersonaStore((state) => state.addSkill);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
  });

  const onSubmit = async (data: SkillFormData) => {
    try {
      await addSkill({
        name: data.name,
        category: data.category,
        proficiency: data.proficiency,
        yearsOfExperience: data.yearsOfExperience ? parseFloat(data.yearsOfExperience) : undefined,
        source: 'user',
        verified: true,
        confidence: 1.0,
        visibility: [],
      });
      reset();
      setOpen(false);
    } catch (error) {
      console.error('Failed to add skill:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button aria-label="Add new skill">+ Add Skill</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Skill</DialogTitle>
          <DialogDescription>
            Add a new skill to your profile.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Skill Name *</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="e.g., React, Python, Project Management"
              aria-invalid={errors.name ? 'true' : 'false'}
            />
            {errors.name && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              {...register('category')}
              placeholder="e.g., Technical, Soft Skills, Language"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="proficiency">Proficiency Level</Label>
            <Input
              id="proficiency"
              {...register('proficiency')}
              placeholder="e.g., Beginner, Intermediate, Expert"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="yearsOfExperience">Years of Experience</Label>
            <Input
              id="yearsOfExperience"
              type="number"
              step="0.5"
              {...register('yearsOfExperience')}
              placeholder="e.g., 3.5"
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
              {isSubmitting ? 'Adding...' : 'Add Skill'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
