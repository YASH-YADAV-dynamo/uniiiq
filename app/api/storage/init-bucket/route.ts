import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { ApiResponse } from "@/lib/api/response";

export async function POST(request: NextRequest) {
  try {
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();
    
    if (listError) {
      return ApiResponse.error(listError.message, 400);
    }

    const bucketExists = buckets?.some(bucket => bucket.id === "profile-pictures");

    if (bucketExists) {
      return ApiResponse.success({ message: "Bucket already exists" });
    }

    // Create the bucket
    const { data, error } = await supabaseAdmin.storage.createBucket("profile-pictures", {
      public: true,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
    });

    if (error) {
      return ApiResponse.error(error.message, 400);
    }

    return ApiResponse.success({ message: "Bucket created successfully", data });
  } catch (error: any) {
    console.error("Init bucket error:", error);
    return ApiResponse.serverError(error.message || "Failed to initialize bucket");
  }
}

