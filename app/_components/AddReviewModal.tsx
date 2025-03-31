"use client";

import { useState } from "react";
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
import { DB_TABLES } from "../_constants";

export default function AddReviewModal({
  productId,
  isOpen,
  onClose,
  onSuccess,
}: {
  productId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { user } = useUser();
  const supabase = useSupabase();

  const [formData, setFormData] = useState({
    rating: 5,
    title: "",
    review: "",
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const hasEmptyFields = !formData.title || !formData.rating;

      if (!formData.title) {
        setFormErrors((prev) => ({ ...prev, title: "Title is required" }));
      }

      if (!formData.rating) {
        setFormErrors((prev) => ({ ...prev, rating: "Rating is required" }));
      }

      if (hasEmptyFields) {
        setLoading(false);
        return;
      }

      const { error } = await supabase.from(DB_TABLES.REVIEW).insert([
        {
          product_id: productId,
          rating: formData.rating,
          title: formData.title,
          review: formData.review,
          user_id: user?.id as string,
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

  return (
    <Dialog
      defaultOpen
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Review</DialogTitle>
          <DialogDescription>
            Share your experience with the product
          </DialogDescription>
        </DialogHeader>

        {/* Rating Selection */}
        <div className="flex flex-col gap-1">
          <Label className="block font-semibold" htmlFor="title">
            Rating <span className="text-red-500">*</span>
          </Label>

          <div className="w-full flex items-center space-x-2">
            {[5, 4, 3, 2, 1].map((num) => (
              <Button
                key={num}
                variant={formData.rating === num ? "default" : "outline"}
                onClick={() => handleChange("rating", num)}
                size="icon"
                className="flex-1 text-xs py-1"
              >
                {num} ⭐
              </Button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div className="flex flex-col gap-1">
          <Label className="block font-semibold" htmlFor="title">
            Title <span className="text-red-500">*</span>
          </Label>
          <input
            required
            id="title"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Title of your review"
          />
          {formErrors.title && (
            <span className="text-xs text-red-700">{formErrors.title}</span>
          )}
        </div>

        {/* Comment */}
        <div className="flex flex-col gap-1">
          <Label className="block font-semibold" htmlFor="review">
            Review <span className="text-gray-500">(optional)</span>
          </Label>
          <textarea
            value={formData.review}
            id="review"
            onChange={(e) => handleChange("review", e.target.value)}
            className="w-full p-2 border rounded h-20"
            placeholder="Write your review here..."
          />
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500">{error}</p>}

        <DialogFooter>
          <div className="flex justify-end space-x-2">
            <Button variant={"outline"} onClick={onClose}>
              Cancel
            </Button>

            <Button variant="default" onClick={handleSubmit} disabled={loading}>
              {loading && <Loader size={16} className="animate-spin" />}
              Submit
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
