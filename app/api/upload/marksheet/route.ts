import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { ApiResponse } from "@/lib/api/response";
import { requireAuth } from "@/lib/api/auth";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return ApiResponse.error("No file provided", 400);
    }

    // Validate file type (PDF, images)
    const allowedTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return ApiResponse.error("File must be a PDF or image (PNG, JPEG, JPG, WEBP)", 400);
    }

    // Validate file size (10MB max for marksheets)
    if (file.size > 10 * 1024 * 1024) {
      return ApiResponse.error("File size must be less than 10MB", 400);
    }

    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `marksheets/${user.id}-${Date.now()}.${fileExt}`;

    // Convert file to buffer
    const fileBuffer = await file.arrayBuffer();

    // Check if bucket exists, create if not
    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.id === "marksheets");

    if (!bucketExists) {
      // Create the bucket
      const { error: createError } = await supabaseAdmin.storage.createBucket("marksheets", {
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: [
          "application/pdf",
          "image/png",
          "image/jpeg",
          "image/jpg",
          "image/webp",
        ],
      });

      if (createError) {
        console.error("Bucket creation error:", createError);
        return ApiResponse.error("Storage bucket not available. Please contact support.", 500);
      }
    }

    // Upload to Supabase Storage using admin client
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from("marksheets")
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
      .from("marksheets")
      .getPublicUrl(fileName);

    return ApiResponse.success({
      url: publicUrl,
      fileName: fileName,
    });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return ApiResponse.unauthorized();
    }
    console.error("Upload error:", error);
    return ApiResponse.serverError(error.message || "Failed to upload marksheet");
  }
}

