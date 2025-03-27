"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Check, CheckIcon, PencilIcon, PlusIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { CVData, CVDataSchema } from "@/lib/schemas/cvDataSchema";

interface StepConfirmationProps {
  cvData: CVData;
  onConfirm: () => void;
  onChangeCvData: (updatedCvData: CVData) => void;
}

function StepConfirmation({
  cvData,
  onConfirm,
  onChangeCvData,
}: StepConfirmationProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<CVData>(cvData);
  const [newSkill, setNewSkill] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData(cvData);
  };

  const handleSave = () => {
    const result = CVDataSchema.safeParse(editedData);
    if (result.success) {
      onChangeCvData(editedData);
      setIsEditing(false);
      setErrors([]);
    } else {
      setErrors(result.error.errors.map((err) => err.message));
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !editedData.skills.includes(newSkill.trim())) {
      setEditedData({
        ...editedData,
        skills: [...editedData.skills, newSkill.trim()],
      });
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setEditedData({
      ...editedData,
      skills: editedData.skills.filter((skill) => skill !== skillToRemove),
    });
  };

  const handleYearsExperienceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove leading zeros and ensure it's a positive number
    const value = e.target.value.replace(/^0+/, '');
    
    // If empty, default to empty string (will be validated on save)
    if (value === '') {
      setEditedData({ ...editedData, years_experience: 0 });
      return;
    }
    
    // Parse as integer and ensure it's not negative
    const numValue = parseInt(value, 10);
    if (numValue >= 0) {
      setEditedData({ ...editedData, years_experience: numValue });
    }
  };

  return (
    <Card className="w-full border border-slate-500">
      <CardContent className="">
        <div className="space-y-8">
          <div className="flex flex-col items-center space-y-4 pb-5">
            <div className="bg-green-500 p-4 rounded-full">
              <CheckIcon className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-semibold text-foreground tracking-tight">CV Analysis Complete</h2>
              <p className="text-foreground tracking-tight">
                Our AI has extracted the following information from your CV.
                Please verify it&apos;s correct.
              </p>
            </div>
          </div>
          {errors.length > 0 && (
            <div className="bg-red-100 text-red-800 p-3 rounded-md">
              <ul>
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}


          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label className="text-foreground tracking-tight text-md font-bold">Role</Label>
                {isEditing ? (
                  <Input
                    value={editedData.role}
                    onChange={(e) =>
                      setEditedData({ ...editedData, role: e.target.value })
                    }
                    placeholder="Enter your role"
                  />
                ) : (
                  <p className="text-2xl text-foreground tracking-tight">{cvData.role}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-foreground tracking-tight text-md font-bold">Experience</Label>
                {isEditing ? (
                  <Input
                    type="number"
                    value={editedData.years_experience || ""}
                    onChange={handleYearsExperienceChange}
                    min="0"
                    placeholder="Years of experience"
                  />
                ) : (
                  <p className="text-2xl text-foreground tracking-tight">
                    {cvData.years_experience} years
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-foreground tracking-tight text-md font-bold">Location</Label>
                {isEditing ? (
                  <Input
                    value={editedData.location}
                    onChange={(e) =>
                      setEditedData({ ...editedData, location: e.target.value })
                    }
                    placeholder="Enter your location"
                  />
                ) : (
                  <p className="text-2xl text-foreground tracking-tight">
                    {cvData.location}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-foreground tracking-tight text-md font-bold">Skills</Label>
                <div className="flex flex-wrap gap-2">
                  {(isEditing ? editedData : cvData).skills.map(
                    (skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className={cn(
                          "text-sm tracking-tight border border-slate-500",
                          isEditing &&
                            "pr-2 hover:bg-destructive/10 hover:text-destructive transition-colors"
                        )}
                      >
                        {skill}
                        {isEditing && (
                          <button
                            onClick={() => handleRemoveSkill(skill)}
                            className="ml-1 hover:text-red-600 focus:outline-none cursor-pointer"
                          >
                            <XIcon className="h-3 w-3" />
                            <span className="sr-only">Remove {skill}</span>
                          </button>
                        )}
                      </Badge>
                    )
                  )}
                  {isEditing && (
                    <div className="flex gap-2">
                      <Input
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddSkill();
                          }
                        }}
                        placeholder="Add a skill"
                        className="h-8 w-[150px]"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleAddSkill}
                        className="h-8 w-8 p-0"
                      >
                        <PlusIcon className="h-4 w-4" />
                        <span className="sr-only">Add skill</span>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground tracking-tight text-md font-bold">Summary</Label>
              {isEditing ? (
                <Textarea
                  value={editedData.summary}
                  onChange={(e) =>
                    setEditedData({ ...editedData, summary: e.target.value })
                  }
                  placeholder="Enter your professional summary"
                  className="min-h-[100px]"
                />
              ) : (
                <p className="text-xl text-foreground tracking-tight">
                  {cvData.summary}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-3">
        {isEditing ? (
          <>
            <Button
              className="w-1/2 border-0 bg-red-500 hover:bg-red-600 text-white cursor-pointer tracking-tight text-md transition-colors duration-300"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button className="w-1/2 bg-green-500 hover:bg-green-600 text-white cursor-pointer tracking-tight text-md transition-colors duration-300" onClick={handleSave}>
              Save Changes
            </Button>
          </>
        ) : (
          <div className="flex flex-col gap-4 md:gap-0 md:flex-row md:justify-between w-full mt-4">
            <Button
              className="cursor-pointer bg-[#3b82f6] hover:bg-[#2563eb] text-white tracking-tight text-md transition-colors duration-300"
              onClick={handleEdit}
            >
              <PencilIcon className="h-4 w-4" />
              Edit Information
            </Button>
            <Button className="cursor-pointer bg-green-500 hover:bg-green-600 text-white cursor-pointer tracking-tight text-md transition-colors duration-300" onClick={onConfirm}>
              <Check className="h-4 w-4" />
              Confirm and Find Jobs
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

export default StepConfirmation;
