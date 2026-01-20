"use client";

import React, { useState, useEffect } from "react";
import { useCategories } from "@/hooks/category.hook";
import { useSizes } from "@/hooks/sizes.hook";
import { useCreateMenu, useUpdateMenu } from "@/hooks/menu.hook";
import { useAuth } from "@/lib/stores/useAuth";
import { ITEMS_API } from "@/app/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Upload, X } from "lucide-react";

interface AddItemFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  instance?: any; // MenuItem instance for editing
  onSuccess?: () => void;
}

const AddItemForm: React.FC<AddItemFormProps> = ({
  open,
  onOpenChange,
  instance,
  onSuccess,
}) => {
  // Form states
  const [formData, setFormData] = useState({
    name: "",
    main_price: "",
    prev_price: "",
    details: "",
    category_id: "",
    size_id: "",
    status: true,
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  // Hooks
  const { token } = useAuth();
  const { categories, loading: categoriesLoading } = useCategories();
  const { sizes, loading: sizesLoading } = useSizes();
  const { loading: createLoading } = useCreateMenu();
  const { loading: updateLoading } = useUpdateMenu();

  const isLoading = createLoading || updateLoading;
  const isEdit = !!instance;

  // FormData-based API functions
  const createMenuWithFormData = async (formData: FormData) => {
    if (!token) return null;

    try {
      const response = await fetch(ITEMS_API, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: formData,
      });

      const data = await response.json();
      console.log("Create response:", data);

      if (data.success) {
        return data.data;
      } else {
        console.error("Create validation errors:", data.errors);
        throw new Error(data.message || "Failed to create menu item");
      }
    } catch (error) {
      console.error("Error creating menu item:", error);
      throw error;
    }
  };

  const updateMenuWithFormData = async (id: string, formData: FormData) => {
    if (!token) return null;

    try {
      const response = await fetch(`${ITEMS_API}/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        return data.data;
      } else {
        console.error("Update validation errors:", data.errors);
        throw new Error(data.message || "Failed to update menu item");
      }
    } catch (error) {
      console.error("Error updating menu item:", error);
      throw error;
    }
  };

  // Initialize form data when instance changes
  useEffect(() => {
    if (instance) {
      setFormData({
        name: instance.name || "",
        main_price: instance.main_price || "",
        prev_price: instance.prev_price || "",
        details: instance.details || "",
        category_id: instance.category_id?.toString() || "",
        size_id: instance.size_id?.toString() || "",
        status:
          instance.status === "active" ||
          instance.status === 1 ||
          instance.status === "1" ||
          instance.status === true ||
          instance.status === "true",
      });

      // Set thumbnail preview if exists
      if (instance.thumbnail) {
        setThumbnailPreview(
          `${process.env.NEXT_PUBLIC_API_URL}/public/${instance.thumbnail}`
        );
      }
    } else {
      // Reset form for new item
      setFormData({
        name: "",
        main_price: "",
        prev_price: "",
        details: "",
        category_id: "",
        size_id: "",
        status: true,
      });
      setThumbnail(null);
      setThumbnailPreview(null);
    }
  }, [instance]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    setThumbnailPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.main_price ||
      !formData.category_id ||
      !formData.size_id
    ) {
      return;
    }

    try {
      // Create FormData
      const submitData = new FormData();
      submitData.append("name", formData.name.trim());
      submitData.append("main_price", formData.main_price);
      submitData.append("prev_price", formData.prev_price || "0");
      submitData.append("details", formData.details.trim());
      submitData.append("category_id", formData.category_id);
      submitData.append("size_id", formData.size_id);
      // Send status as 0 or 1 for API
      submitData.append("status", formData.status ? "1" : "0");

      if (thumbnail) {
        submitData.append("thumbnail", thumbnail);
      }

      // Debug: Log FormData contents
      // console.log('FormData contents:');
      // for (const [key, value] of submitData.entries()) {
      //   console.log(key, value);
      // }

      let result;
      if (isEdit) {
        // Update existing item - use FormData for PUT request
        result = await updateMenuWithFormData(
          instance.id.toString(),
          submitData
        );
      } else {
        // Create new item - use FormData for POST request
        result = await createMenuWithFormData(submitData);
      }

      if (result) {
        onSuccess?.();
        onOpenChange(false);
        // Reset form
        setFormData({
          name: "",
          main_price: "",
          prev_price: "",
          details: "",
          category_id: "",
          size_id: "",
          status: true,
        });
        setThumbnail(null);
        setThumbnailPreview(null);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset form when closing
    if (!isEdit) {
      setFormData({
        name: "",
        main_price: "",
        prev_price: "",
        details: "",
        category_id: "",
        size_id: "",
        status: true,
      });
      setThumbnail(null);
      setThumbnailPreview(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Menu Item" : "Add New Menu Item"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the menu item information below."
              : "Fill in the details to create a new menu item."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Item Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter item name..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status ? "true" : "false"}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: e.target.value === "true",
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Main Price *
              </label>
              <input
                type="number"
                step="0.01"
                name="main_price"
                value={formData.main_price}
                onChange={handleInputChange}
                placeholder="0.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Previous Price
              </label>
              <input
                type="number"
                step="0.01"
                name="prev_price"
                value={formData.prev_price}
                onChange={handleInputChange}
                placeholder="0.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category and Size */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
                disabled={categoriesLoading}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {categoriesLoading && (
                <p className="text-sm text-gray-500 mt-1">
                  Loading categories...
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Size *
              </label>
              <select
                name="size_id"
                value={formData.size_id}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
                disabled={sizesLoading}
              >
                <option value="">Select Size</option>
                {sizes.map((size) => (
                  <option key={size.id} value={size.id}>
                    {size.size}
                  </option>
                ))}
              </select>
              {sizesLoading && (
                <p className="text-sm text-gray-500 mt-1">Loading sizes...</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="details"
              value={formData.details}
              onChange={handleInputChange}
              placeholder="Enter item description..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Thumbnail Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thumbnail Image
            </label>
            <div className="space-y-4">
              {/* File Input */}
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG or JPEG (MAX. 2MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                  />
                </label>
              </div>

              {/* Thumbnail Preview */}
              {thumbnailPreview && (
                <div className="relative inline-block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={removeThumbnail}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center gap-3 justify-end pt-4 border-t">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                isLoading ||
                !formData.name.trim() ||
                !formData.main_price ||
                !formData.category_id ||
                !formData.size_id
              }
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEdit ? "Update Item" : "Create Item"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemForm;
