"use client";

import { useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import useSupabase from "@/hooks/useSupabase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Loader } from "lucide-react";
import { DB_TABLES, STORAGE_BUCKET } from "../_constants";
import { ReviewType } from "@/types";
import Image from "next/image";

export default function ReviewModal({
  productId,
  isOpen,
  onClose,
  onSuccess,
  selectedReview,
}: {
  productId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedReview?: ReviewType | null;
}) {
  const { user } = useUser();
  const supabase = useSupabase();

  const inputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    rating: selectedReview?.rating || 0,
    review: selectedReview?.review || "",
    image_url: selectedReview?.image_url || "", // Store image URL
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const isEditing = !!selectedReview?.id;

  const handleImageUpload = async (file: File) => {
    const fileName = `${user?.id}-${Date.now()}-${file.name}`;

    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET.REVIEW_IMAGES)
      .upload(fileName, file);

    if (error) {
      toast.error("Image upload failed: " + error.message);
      return null;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET.REVIEW_IMAGES)
      .getPublicUrl(data?.path);

    return urlData.publicUrl;
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      if (!formData.rating) {
        setFormErrors((prev) => ({ ...prev, rating: "Rating is required" }));
        setLoading(false);
        return;
      }

      const prevUploadedImageUrl = formData.image_url;
      let newUploadedImageUrl;
      if (selectedFile) {
        newUploadedImageUrl = await handleImageUpload(selectedFile);
      }

      const uploadedImageUrl = newUploadedImageUrl || prevUploadedImageUrl;

      // Update existing review
      if (isEditing) {
        const { error } = await supabase
          .from(DB_TABLES.REVIEW)
          .update({
            rating: formData.rating,
            review: formData.review,
            image_url: uploadedImageUrl,
          })
          .eq("id", selectedReview?.id)
          .select();

        if (error) {
          return toast.error(error.message);
        }

        toast.success("Review updated successfully");
        onSuccess();

        return;
      }

      // Create new review
      const { error } = await supabase.from(DB_TABLES.REVIEW).insert([
        {
          user_id: user?.id as string,
          product_id: productId,
          rating: formData.rating,
          review: formData.review,
          image_url: uploadedImageUrl,
        },
      ]);

      if (error) {
        return toast.error(error.message);
      }

      toast.success("Review submitted successfully");
      onSuccess();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    field: keyof typeof formData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error message if field is not empty
    if (value) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  if (!isOpen) return <></>;

  const hasImage = formData.image_url || selectedFile;
  const imageURL = formData.image_url
    ? formData.image_url
    : selectedFile
    ? URL.createObjectURL(selectedFile as any)
    : "";
  return (
    <Dialog
      defaultOpen
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="px-4">
        <DialogHeader className="pb-2 border-b">
          <DialogTitle>
            {isEditing ? "Update Review" : "Add Review"}
          </DialogTitle>
          <DialogDescription>
            Share your experience with the product
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 pb-6 overflow-y-auto max-h-[70vh]">
          {/* Rating Selection */}
          <div className="flex flex-col gap-1">
            <Label className="block font-semibold" htmlFor="title">
              Rating <span className="text-red-500">*</span>
            </Label>

            <div className="w-full flex items-center space-x-2 md:space-x-4">
              <div>
                <span className="text-2xl md:text-4xl py-1 cursor-pointer">
                  😢
                </span>
              </div>
              {[1, 2, 3, 4, 5].map((num) => {
                const isChecked = num <= formData.rating;
                return (
                  <span
                    key={num}
                    onClick={() => handleChange("rating", num)}
                    role="button"
                    aria-label={`Rate ${num} star`}
                    className={`text-2xl md:text-4xl py-1 cursor-pointer ${
                      isChecked ? "text-yellow-500" : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                );
              })}

              <div>
                <span className="text-2xl md:text-4xl py-1 cursor-pointer">
                  😃
                </span>
              </div>
            </div>

            {formErrors.rating && (
              <p className="text-red-500 text-sm">{formErrors.rating}</p>
            )}
          </div>

          {/* Comment */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="review">
              Review{" "}
              <span className="text-gray-500 font-light">(optional)</span>
            </Label>
            <textarea
              value={formData.review}
              id="review"
              onChange={(e) => handleChange("review", e.target.value)}
              className="w-full p-2 border rounded h-20 font-light text-sm"
              placeholder="Write your review here..."
            />
          </div>

          {/* Image Upload */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="image">
              Upload Image{" "}
              <span className="text-gray-500 font-light">(optional)</span>
            </Label>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              id="image"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              // Make it invisible and use a button to trigger file selection
              className="w-full p-2 border rounded font-light text-sm hidden"
            />

            <div className="flex items-center gap-2">
              {hasImage ? (
                <Image
                  src={imageURL}
                  alt="Review Image"
                  className="w-32 h-32 object-cover rounded-lg border-1 p-1"
                  width={128}
                  height={128}
                />
              ) : (
                <div className="w-32 h-32 bg-gray-100 rounded-lg border-1 p-1 flex justify-center items-center">
                  <span className="text-gray-500">No image</span>
                </div>
              )}
              <Button
                variant="outline"
                onClick={() => inputRef?.current?.click()}
              >
                {hasImage ? "Change" : "Upload"}
              </Button>
            </div>

            {selectedFile && (
              <p className="text-xs text-gray-500">{selectedFile.name}</p>
            )}
          </div>
        </div>
        <DialogFooter className="border-t pt-2">
          <div className="flex justify-end space-x-2">
            <Button variant={"outline"} onClick={onClose}>
              Cancel
            </Button>

            <Button variant="default" onClick={handleSubmit} disabled={loading}>
              {loading && <Loader size={16} className="animate-spin" />}
              {isEditing ? "Update" : "Submit"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
