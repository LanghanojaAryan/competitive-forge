import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { useToast } from '../../hooks/use-toast';

const CreateExamModal = ({ isOpen, onClose, onCreateExam, classes = [] }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    duration: '',
    startTime: '',
    startDate: '',
    className: '',
    description: '',
    instructions: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: '',
        duration: '',
        startTime: '',
        startDate: '',
        className: '',
        description: '',
        instructions: ''
      });
    }
  }, [isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const { name, duration, startTime, startDate, className } = formData;
    
    if (!name.trim()) {
      toast({
        title: "Validation Error",
        description: "Exam name is required",
        variant: "destructive"
      });
      return false;
    }

    if (!duration || duration <= 0) {
      toast({
        title: "Validation Error", 
        description: "Valid duration is required",
        variant: "destructive"
      });
      return false;
    }

    if (!startTime) {
      toast({
        title: "Validation Error",
        description: "Start time is required",
        variant: "destructive"
      });
      return false;
    }

    if (!startDate) {
      toast({
        title: "Validation Error",
        description: "Start date is required", 
        variant: "destructive"
      });
      return false;
    }

    if (!className) {
      toast({
        title: "Validation Error",
        description: "Class selection is required",
        variant: "destructive"
      });
      return false;
    }

    // Check if exam is scheduled in the past
    const examDateTime = new Date(`${startDate}T${startTime}`);
    const now = new Date();
    
    if (examDateTime <= now) {
      toast({
        title: "Validation Error",
        description: "Exam must be scheduled for a future date and time",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const selectedClass = classes.find(c => c.id.toString() === formData.className);
      
      const examData = {
        title: formData.name.trim(),
        duration: parseInt(formData.duration),
        startDate: formData.startDate,
        endDate: formData.startDate, // Same day for now
        startTime: formData.startTime,
        endTime: calculateEndTime(formData.startTime, parseInt(formData.duration)),
        class: selectedClass,
        description: formData.description.trim(),
        instructions: formData.instructions.trim() || 'Please read all questions carefully and submit before the time limit.',
        status: 'draft',
        allowedLanguages: ['python', 'java', 'cpp', 'javascript'],
        questions: 0,
        totalMarks: 0,
        questionsList: []
      };

      await onCreateExam(examData);
      onClose();
      
      toast({
        title: "Success",
        description: "Exam created successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create exam. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateEndTime = (startTime, durationMinutes) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0);
    
    const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
    
    return endDate.toTimeString().slice(0, 5);
  };

  const generateMinTimeOptions = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // If it's today's date, set minimum time to current time + 1 hour
    const selectedDate = new Date(formData.startDate);
    const today = new Date();
    
    if (selectedDate.toDateString() === today.toDateString()) {
      const minHour = currentHour + 1;
      const minTime = `${minHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      return minTime;
    }
    
    return "00:00";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Exam</DialogTitle>
          <DialogDescription>
            Set up a new exam for your students. Make sure to configure all details before publishing.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Exam Name */}
            <div className="space-y-2">
              <Label htmlFor="examName">Exam Name *</Label>
              <Input
                id="examName"
                placeholder="e.g., Midterm Exam - Data Structures"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full"
              />
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes) *</Label>
              <Input
                id="duration"
                type="number"
                min="15"
                max="480"
                placeholder="e.g., 120"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Start Date */}
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className="w-full"
              />
            </div>

            {/* Start Time */}
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time *</Label>
              <Input
                id="startTime"
                type="time"
                min={formData.startDate === new Date().toISOString().split('T')[0] ? generateMinTimeOptions() : "00:00"}
                value={formData.startTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {/* Class Selection */}
          <div className="space-y-2">
            <Label htmlFor="className">Select Class *</Label>
            <Select value={formData.className} onValueChange={(value) => handleInputChange('className', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a class for this exam" />
              </SelectTrigger>
              <SelectContent>
                {classes.length > 0 ? (
                  classes.map((classItem) => (
                    <SelectItem key={classItem.id} value={classItem.id.toString()}>
                      {classItem.name} ({classItem.students} students)
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-classes" disabled>
                    No classes available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the exam content and topics covered..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
            />
          </div>

          {/* Instructions */}
          <div className="space-y-2">
            <Label htmlFor="instructions">Instructions for Students</Label>
            <Textarea
              id="instructions"
              placeholder="Special instructions, rules, or notes for students taking this exam..."
              value={formData.instructions}
              onChange={(e) => handleInputChange('instructions', e.target.value)}
              rows={3}
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Exam'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateExamModal;