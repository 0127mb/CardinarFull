"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { assetUrl } from "../lib/assets";

type ProfileImageUploaderProps = {
  fullName: string;
  initialImage: string;
  defaultImage: string;
  uploadText: string;
  uploadingText: string;
};

type UploadResponse = {
  profileImage?: string | null;
  message?: string;
};

export default function ProfileImageUploader({
  fullName,
  initialImage,
  defaultImage,
  uploadText,
  uploadingText,
}: ProfileImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState(initialImage || defaultImage);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function uploadProfileImage(file: File) {
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.set("profileImage", file);

    try {
      const response = await fetch("/api/profile-image", {
        method: "PATCH",
        body: formData,
      });
      const data = (await response.json().catch(() => null)) as
        | UploadResponse
        | null;

      if (!response.ok) {
        throw new Error(data?.message ?? "Upload failed");
      }

      if (data?.profileImage) {
        setImage(assetUrl(data.profileImage));
      }
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : "Upload failed",
      );
    } finally {
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <Image
          src={image}
          alt={fullName}
          width={128}
          height={128}
          unoptimized
          className="h-32 w-32 rounded-full border border-zinc-200 bg-zinc-50 object-cover"
        />
        <button
          type="button"
          aria-label={uploadText}
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-lg font-semibold text-zinc-900 shadow-sm transition hover:border-zinc-400 disabled:opacity-60"
        >
          {uploading ? "..." : "✎"}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            void uploadProfileImage(file);
          }
        }}
      />
      <p className="min-h-5 text-xs font-medium text-zinc-500">
        {uploading ? uploadingText : error}
      </p>
    </div>
  );
}
