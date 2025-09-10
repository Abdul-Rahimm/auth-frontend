"use client";

import React, { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { authApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { UpdateProfileData } from "@/types/auth";

interface UpdateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export function UpdateProfileModal({
  isOpen,
  onClose,
  onSuccess,
  onError,
}: UpdateProfileModalProps) {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState<UpdateProfileData>({
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

  const handleInputChange =
    (field: keyof UpdateProfileData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Clear specific error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
    if (errors.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    // Check if at least one field is provided
    if (!formData.email && !formData.password) {
      newErrors.general = "Please provide at least one field to update";
      setErrors(newErrors);
      return false;
    }

    // Validate email if provided
    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    // Validate password if provided
    if (formData.password) {
      if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters long";
      }
      if (formData.password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !user) return;

    setIsLoading(true);
    setErrors({});

    try {
      // Prepare update data (only include fields that have values)
      const updateData: UpdateProfileData = {};
      if (formData.email && formData.email.trim()) {
        updateData.email = formData.email.trim();
      }
      if (formData.password && formData.password.trim()) {
        updateData.password = formData.password;
      }

      await authApi.updateProfile(user.id, updateData);

      // Update the user context if email was changed
      if (updateData.email) {
        updateUser({ ...user, email: updateData.email });
      }

      // Reset form and close modal
      setFormData({ email: "", password: "" });
      setConfirmPassword("");
      onClose();

      // Call success callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      let errorMessage = "Failed to update profile";
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      }
      setErrors({ general: errorMessage });

      // Call error callback
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ email: "", password: "" });
    setConfirmPassword("");
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Update Profile"
      className="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {errors.general}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              What would you like to update?
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              You can update your email, password, or both. Leave fields empty
              if you don&apos;t want to change them.
            </p>
          </div>

          <Input
            type="email"
            label="New Email (optional)"
            placeholder={user?.email || "Enter new email"}
            value={formData.email}
            onChange={handleInputChange("email")}
            error={errors.email}
            icon={<Mail className="h-4 w-4" />}
          />

          <div className="space-y-4">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                label="New Password (optional)"
                placeholder="Enter new password"
                value={formData.password}
                onChange={handleInputChange("password")}
                error={errors.password}
                icon={<Lock className="h-4 w-4" />}
              />
              <button
                type="button"
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {formData.password && (
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  label="Confirm New Password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  error={errors.confirmPassword}
                  icon={<Lock className="h-4 w-4" />}
                />
                <button
                  type="button"
                  className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="flex-1"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" className="flex-1" disabled={isLoading}>
            <User className="h-4 w-4 mr-2" />
            {isLoading ? "Updating..." : "Update Profile"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
