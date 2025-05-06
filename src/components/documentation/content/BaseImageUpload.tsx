import { ContentLayout, Paragraph, SectionHeader } from "./ContentLayout";

export const BaseImageUpload = () => {
  return (
    <ContentLayout
      title="Base Image Upload"
      subtitle="How to upload reference images for object detection"
    >
      <Paragraph>
        The first step in the AutoBox workflow is uploading your base
        (reference) images. These images serve as examples of the objects you
        want to detect in your target dataset. This page explains how to select
        and upload effective reference images.
      </Paragraph>

      <div className="my-6 rounded-lg border border-gray-200 bg-gray-50 p-5">
        <h3 className="mb-2 text-lg font-semibold">Quick Summary</h3>
        <ul className="ml-5 list-disc text-gray-700">
          <li className="mb-1">
            Upload clear, high-quality images of the objects you want to detect
          </li>
          <li className="mb-1">
            You can upload multiple images with no limit on the number
          </li>
          <li className="mb-1">
            Supported formats include JPG, PNG, and other common image formats
          </li>
          <li className="mb-1">
            Each image should predominantly feature a single object or class
          </li>
        </ul>
      </div>

      <SectionHeader>Selecting Good Reference Images</SectionHeader>
      <Paragraph>
        The quality of your reference images significantly impacts the accuracy
        of object detection. Follow these guidelines for best results:
      </Paragraph>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 p-4">
          <h3 className="mb-2 font-semibold text-green-700">✓ Do</h3>
          <ul className="ml-5 list-disc text-gray-700">
            <li className="mb-1">Use high-resolution, clear images</li>
            <li className="mb-1">Ensure good lighting conditions</li>
            <li className="mb-1">
              Capture objects from multiple angles for better recognition
            </li>
            <li className="mb-1">
              Include images with minimal background clutter
            </li>
            <li className="mb-1">
              Use images where the object takes up a significant portion of the
              frame
            </li>
          </ul>
        </div>

        <div className="rounded-lg border border-gray-200 p-4">
          <h3 className="mb-2 font-semibold text-red-700">✗ Avoid</h3>
          <ul className="ml-5 list-disc text-gray-700">
            <li className="mb-1">Blurry or low-resolution images</li>
            <li className="mb-1">Images with heavy shadows or poor lighting</li>
            <li className="mb-1">
              Images where the object is too small or distant
            </li>
            <li className="mb-1">
              Excessive background clutter that might confuse the algorithm
            </li>
            <li className="mb-1">
              Images with multiple overlapping objects of different classes
            </li>
          </ul>
        </div>
      </div>

      <SectionHeader>Uploading Your Images</SectionHeader>
      <Paragraph>
        To upload your base images to AutoBox, follow these steps:
      </Paragraph>
      <ol className="mb-6 ml-6 list-decimal text-gray-700">
        <li className="mb-3">
          <strong>Navigate to the Playground</strong>
          <p className="mt-1">
            Access the Playground section from the main navigation.
          </p>
        </li>
        <li className="mb-3">
          <strong>Upload Images</strong>
          <p className="mt-1">
            Either drag and drop your image files onto the upload area or click
            to browse and select files.
          </p>
        </li>
        <li className="mb-3">
          <strong>Review Uploaded Images</strong>
          <p className="mt-1">
            Verify that your images have been uploaded correctly. You can remove
            any mistakenly uploaded images.
          </p>
        </li>
      </ol>

      <SectionHeader>Using Multiple Reference Images</SectionHeader>
      <Paragraph>
        For better detection results, consider uploading multiple reference
        images for each object class:
      </Paragraph>
      <ul className="mb-4 ml-6 list-disc text-gray-700">
        <li className="mb-2">
          <strong>Different viewpoints:</strong> Include images of the object
          from different angles
        </li>
        <li className="mb-2">
          <strong>Lighting variations:</strong> Include images under different
          lighting conditions
        </li>
        <li className="mb-2">
          <strong>Scale variations:</strong> Include images with the object at
          different distances/sizes
        </li>
        <li className="mb-2">
          <strong>Background variation:</strong> Include images with different
          backgrounds
        </li>
      </ul>

      <div className="mt-8 rounded-lg bg-yellow-50 p-4 text-yellow-800">
        <p className="font-medium">Tip for Efficiency</p>
        <p className="mt-2">
          While there's no hard limit on the number of base images you can
          upload, using 3-5 high-quality reference images per object class
          typically provides good results while keeping processing time
          reasonable.
        </p>
      </div>

      <div className="mt-4">
        <Paragraph>
          Once you've uploaded your reference images, the next step is to label
          them to identify what object each image contains. Continue to the next
          section to learn about image labeling.
        </Paragraph>
      </div>
    </ContentLayout>
  );
};
