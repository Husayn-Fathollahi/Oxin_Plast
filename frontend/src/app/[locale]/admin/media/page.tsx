/**
 * Admin — Media library page.
 * Upload and manage images and PDF catalogs.
 * TODO: integrate with /api/v1/files endpoints.
 */
export default function AdminMediaPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Media Library</h1>
        {/* TODO: <UploadButton /> */}
      </div>
      {/* TODO: <MediaGrid /> — thumbnails for images, icon+name for PDFs */}
    </div>
  );
}
