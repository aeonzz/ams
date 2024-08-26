import axios from "axios";
import { fileToBase64 } from "../fileToBase64";
import { updateUser } from "../actions/users";
import { useState } from "react";

export function useUploadFile() {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [progresses, setProgresses] = useState<Record<string, number>>({});
  const [isUploading, setIsUploading] = useState(false);
  async function handleImageUpload(files: File[]) {
    try {
      setIsUploading(true)
      const serializedFiles = await Promise.all(
        files.map(async (file) => ({
          name: file.name,
          type: file.type,
          size: file.size,
          lastModified: file.lastModified,
          content: await fileToBase64(file),
        }))
      );

      const totalSize = serializedFiles.reduce(
        (acc, file) => acc + file.size,
        0
      );
      let uploadedSize = 0;

      const response = await axios.post(
        "/api/file",
        { files: serializedFiles },
        {
          headers: {
            "Content-Type": "application/json",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total!
            );

            serializedFiles.forEach((file) => {
              const fileProgress = Math.min(
                100,
                Math.round(
                  ((uploadedSize +
                    (progressEvent.loaded * file.size) / totalSize) *
                    100) /
                    file.size
                )
              );
              setProgresses((prev) => ({ ...prev, [file.name]: fileProgress }));
            });

            if (progressEvent.loaded === progressEvent.total) {
              uploadedSize += progressEvent.loaded;
            }
          },
        }
      );

      setProgresses((prev) =>
        Object.fromEntries(Object.keys(prev).map((key) => [key, 100]))
      );

      const paths = response.data.results.map(
        (result: { filePath: string }) => result.filePath
      );
      setUploadedFiles(paths);

      return response.data.results;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data || error.message);
      } else {
        console.error("Error uploading files:", error);
      }
    } finally {
      setProgresses({});
      setIsUploading(false);
    }
  }

  return {
    uploadedFiles,
    uploadFiles: handleImageUpload,
    progresses,
    isUploading,
  };
}
