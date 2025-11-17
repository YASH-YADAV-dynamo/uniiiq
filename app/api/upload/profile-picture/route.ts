import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { ApiResponse } from "@/lib/api/response";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;

    if (!file) {
      return ApiResponse.error("No file provided", 400);
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return ApiResponse.error("File must be an image", 400);
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return ApiResponse.error("File size must be less than 5MB", 400);
    }

    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = userId ? `${userId}-${Date.now()}.${fileExt}` : `temp-${Date.now()}.${fileExt}`;

    // Convert file to buffer
    const fileBuffer = await file.arrayBuffer();

    // Check if bucket exists, create if not
    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.id === "profile-pictures");

    if (!bucketExists) {
      // Create the bucket
      const { error: createError } = await supabaseAdmin.storage.createBucket("profile-pictures", {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
      });

      if (createError) {
        console.error("Bucket creation error:", createError);
        return ApiResponse.error("Storage bucket not available. Please contact support.", 500);
      }
    }

    // Upload to Supabase Storage using admin client
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from("profile-pictures")
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return ApiResponse.error(uploadError.message || "Failed to upload file", 400);
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from("profile-pictures")
      .getPublicUrl(fileName);

    return ApiResponse.success({
      url: publicUrl,
      fileName: fileName,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return ApiResponse.serverError(error.message || "Failed to upload profile picture");
  }
}

