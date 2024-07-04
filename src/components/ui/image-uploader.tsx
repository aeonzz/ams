'use client';

import { UploadButton } from '@/lib/utils';

export default function ImageUploader() {
  return (
    <UploadButton
      endpoint="imageUploader"
      onClientUploadComplete={(res) => {
        // Do something with the response
        console.log('Files: ', res);
        alert('Upload Completed');
      }}
      onUploadError={(error: Error) => {
        console.log(error)
        // Do something with the error.
        alert(`ERROR! ${error.message}`);
      }}
    />
  );
}
