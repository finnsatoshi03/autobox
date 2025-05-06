import { ContentLayout, Paragraph, SectionHeader } from "./ContentLayout";

export const TargetImageUpload = () => {
  return (
    <ContentLayout
      title="Target Image Upload"
      subtitle="How to upload and prepare target images for detection"
    >
      <Paragraph>
        After labeling your base (reference) images, the next step is to upload
        the target images where you want to detect objects. This page explains
        how to prepare and upload your target images for optimal results.
      </Paragraph>

      <div className="my-6 rounded-lg border border-gray-200 bg-gray-50 p-5">
        <h3 className="mb-2 text-lg font-semibold">Quick Summary</h3>
        <ul className="ml-5 list-disc text-gray-700">
          <li className="mb-1">
            Target images must be uploaded as a ZIP or RAR archive
          </li>
          <li className="mb-1">
            The archive can contain many images (hundreds or thousands)
          </li>
          <li className="mb-1">
            Supported image formats include JPG, PNG, and other common formats
          </li>
          <li className="mb-1">
            There's no folder structure requirement; all images will be
            processed
          </li>
        </ul>
      </div>

      <SectionHeader>Preparing Your Target Archive</SectionHeader>
      <Paragraph>
        Before uploading to AutoBox, you need to prepare your target images:
      </Paragraph>
      <ol className="mb-6 ml-6 list-decimal text-gray-700">
        <li className="mb-3">
          <strong>Collect all target images</strong> where you want to detect
          the reference objects.
        </li>
        <li className="mb-3">
          <strong>Ensure images are in a supported format</strong> (JPG, PNG,
          etc.).
        </li>
        <li className="mb-3">
          <strong>Compress the images into a ZIP or RAR archive</strong> using
          your preferred compression tool.
        </li>
      </ol>

      <Paragraph>
        You can organize your images in folders within the archive if desired.
        The folder structure will be preserved in the results, but doesn't
        affect the detection process.
      </Paragraph>

      <SectionHeader>Uploading the Target Archive</SectionHeader>
      <Paragraph>To upload your target archive to AutoBox:</Paragraph>
      <ol className="mb-6 ml-6 list-decimal text-gray-700">
        <li className="mb-3">
          <strong>After labeling your base images</strong>, click "Process and
          Continue" to proceed to the target upload step.
        </li>
        <li className="mb-3">
          <strong>Drag and drop your archive file</strong> onto the upload area,
          or click to browse and select the file.
        </li>
        <li className="mb-3">
          <strong>Wait for the upload to complete</strong>. For large archives,
          this may take some time depending on your internet connection.
        </li>
      </ol>

      <div className="mb-6 rounded-lg border border-gray-200 p-5">
        <h3 className="mb-3 text-lg font-semibold">
          Supported Archive Formats
        </h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center rounded-md bg-gray-50 px-4 py-2">
            <span className="font-medium">ZIP</span>
            <span className="ml-2 text-sm text-gray-600">(.zip)</span>
          </div>
          <div className="flex items-center rounded-md bg-gray-50 px-4 py-2">
            <span className="font-medium">RAR</span>
            <span className="ml-2 text-sm text-gray-600">(.rar)</span>
          </div>
        </div>
      </div>

      <SectionHeader>Optimizing Target Images</SectionHeader>
      <Paragraph>
        While AutoBox can process images of various qualities, following these
        guidelines will help achieve better detection results:
      </Paragraph>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 p-4">
          <h3 className="mb-2 font-semibold text-green-700">✓ Recommended</h3>
          <ul className="ml-5 list-disc text-gray-700">
            <li className="mb-1">
              Maintain a reasonable resolution for detection
            </li>
            <li className="mb-1">Ensure adequate lighting in images</li>
            <li className="mb-1">
              Use uncompressed or lightly compressed images for better quality
            </li>
            <li className="mb-1">Include images from different perspectives</li>
          </ul>
        </div>

        <div className="rounded-lg border border-gray-200 p-4">
          <h3 className="mb-2 font-semibold text-red-700">✗ Not Recommended</h3>
          <ul className="ml-5 list-disc text-gray-700">
            <li className="mb-1">Heavily compressed images with artifacts</li>
            <li className="mb-1">Very low resolution images</li>
            <li className="mb-1">Images with extreme lighting conditions</li>
            <li className="mb-1">Significantly cropped or distorted images</li>
          </ul>
        </div>
      </div>

      <SectionHeader>Processing Time Considerations</SectionHeader>
      <Paragraph>
        The time required to process your target archive depends on several
        factors:
      </Paragraph>
      <ul className="mb-4 ml-6 list-disc text-gray-700">
        <li className="mb-2">
          <strong>Number of images:</strong> More images require more processing
          time
        </li>
        <li className="mb-2">
          <strong>Image resolution:</strong> Higher resolution images take
          longer to process
        </li>
        <li className="mb-2">
          <strong>Number of base images:</strong> More reference images increase
          processing time
        </li>
        <li className="mb-2">
          <strong>Server load:</strong> The current load on the processing
          server can affect processing time
        </li>
      </ul>

      <div className="mt-8 rounded-lg bg-yellow-50 p-4 text-yellow-800">
        <p className="font-medium">Be Patient with Large Datasets</p>
        <p className="mt-2">
          Large archives with many high-resolution images may take significant
          time to process. AutoBox provides real-time progress information
          during processing. Do not refresh or close the page during processing,
          as this will interrupt the operation.
        </p>
      </div>

      <div className="mt-4">
        <Paragraph>
          Once your target archive has been uploaded, click the "Process and
          Continue" button to start the SIFT analysis. The system will then
          detect objects in your target images based on the reference images you
          provided.
        </Paragraph>
      </div>
    </ContentLayout>
  );
};
