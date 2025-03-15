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

  return (
    <Card className="w-full ">
      <CardContent className="">
        <div className="space-y-8">
          <div className="flex flex-col items-center space-y-4 pb-5">
            <div className="bg-green-500 p-4 rounded-full">
              <CheckIcon className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-semibold">CV Analysis Complete</h2>
              <p className="text-muted-foreground">
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
                <Label>Role</Label>
                {isEditing ? (
                  <Input
                    value={editedData.role}
                    onChange={(e) =>
                      setEditedData({ ...editedData, role: e.target.value })
                    }
                    placeholder="Enter your role"
                  />
                ) : (
                  <p className="text-xl text-muted-foreground">{cvData.role}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Experience</Label>
                {isEditing ? (
                  <Input
                    type="number"
                    value={editedData.years_experience}
                    onChange={(e) =>
                      setEditedData({
                        ...editedData,
                        years_experience: Number.parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="Years of experience"
                  />
                ) : (
                  <p className="text-xl text-muted-foreground">
                    {cvData.years_experience} years
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Location</Label>
                {isEditing ? (
                  <Input
                    value={editedData.location}
                    onChange={(e) =>
                      setEditedData({ ...editedData, location: e.target.value })
                    }
                    placeholder="Enter your location"
                  />
                ) : (
                  <p className="text-xl text-muted-foreground">
                    {cvData.location}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Skills</Label>
                <div className="flex flex-wrap gap-2">
                  {(isEditing ? editedData : cvData).skills.map(
                    (skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className={cn(
                          "text-md",
                          isEditing &&
                            "pr-2 hover:bg-destructive/10 hover:text-destructive transition-colors"
                        )}
                      >
                        {skill}
                        {isEditing && (
                          <button
                            onClick={() => handleRemoveSkill(skill)}
                            className="ml-1 hover:text-destructive focus:outline-none"
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
              <Label>Summary</Label>
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
                <p className="text-xl text-muted-foreground">
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
              variant="outline"
              className="w-1/2"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button className="w-1/2" onClick={handleSave}>
              Save Changes
            </Button>
          </>
        ) : (
          <div className="flex flex-col gap-4 md:gap-0 md:flex-row md:justify-between w-full mt-4">
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={handleEdit}
            >
              <PencilIcon className="mr-1 h-4 w-4" />
              Edit Information
            </Button>
            <Button className="cursor-pointer" onClick={onConfirm}>
              <Check className="mr-1 h-4 w-4" />
              Confirm and Find Jobs
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

export default StepConfirmation;
