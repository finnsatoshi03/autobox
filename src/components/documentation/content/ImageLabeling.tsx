import { ContentLayout, Paragraph, SectionHeader } from "./ContentLayout";

export const ImageLabeling = () => {
  return (
    <ContentLayout
      title="Image Labeling"
      subtitle="How to label base images for effective object detection"
    >
      <Paragraph>
        After uploading your base images, the next step is to label each image
        to identify the objects they contain. Proper labeling is crucial for
        accurate object detection. This section explains how to label your
        images effectively.
      </Paragraph>

      <div className="my-6 rounded-lg border border-gray-200 bg-gray-50 p-5">
        <h3 className="mb-2 text-lg font-semibold">Quick Summary</h3>
        <ul className="ml-5 list-disc text-gray-700">
          <li className="mb-1">
            Each base image must have a label describing its content
          </li>
          <li className="mb-1">
            Labels should be concise and descriptive (e.g., "apple", "car",
            "cat")
          </li>
          <li className="mb-1">
            For multiple images of the same object, you can use auto-incremental
            labeling
          </li>
          <li className="mb-1">
            Labels are used to generate class values for the detection algorithm
          </li>
        </ul>
      </div>

      <SectionHeader>Labeling Individual Images</SectionHeader>
      <Paragraph>
        After uploading your base images, you'll be taken to the labeling
        interface. Here's how to label each image:
      </Paragraph>
      <ol className="mb-6 ml-6 list-decimal text-gray-700">
        <li className="mb-3">
          <strong>Select an image</strong> from the thumbnails at the bottom of
          the screen.
        </li>
        <li className="mb-3">
          <strong>Enter a label</strong> in the text field beneath the selected
          image.
        </li>
        <li className="mb-3">
          <strong>Keep labels concise</strong> and descriptive, using lowercase
          letters (e.g., "apple", "dog", "car").
        </li>
        <li className="mb-3">
          <strong>Repeat for all images</strong> until each has a label.
        </li>
      </ol>

      <SectionHeader>Using Auto-Labeling for Multiple Images</SectionHeader>
      <Paragraph>
        If you have 5 or more images, AutoBox provides a convenient
        auto-labeling feature to save time:
      </Paragraph>
      <ol className="mb-6 ml-6 list-decimal text-gray-700">
        <li className="mb-3">
          <strong>Enter a base label</strong> in the auto-label input field
          (e.g., "apple").
        </li>
        <li className="mb-3">
          <strong>Click the "Auto-label" button</strong> to apply incremental
          labels to all images.
        </li>
        <li className="mb-3">
          <strong>Review the generated labels</strong>, which will follow the
          pattern "base-1", "base-2", etc. (e.g., "apple-1", "apple-2").
        </li>
      </ol>

      <div className="mb-8 rounded-lg border border-gray-200 p-5">
        <h3 className="mb-3 text-lg font-semibold">
          Example: Auto-Labeling Process
        </h3>
        <p className="mb-3 text-gray-700">
          If you have 5 images of apples and enter "apple" as the base label,
          clicking the auto-label button will generate the following labels:
        </p>
        <div className="space-y-2 rounded-md bg-gray-50 p-4">
          <p className="font-mono text-gray-800">Image 1: apple-1</p>
          <p className="font-mono text-gray-800">Image 2: apple-2</p>
          <p className="font-mono text-gray-800">Image 3: apple-3</p>
          <p className="font-mono text-gray-800">Image 4: apple-4</p>
          <p className="font-mono text-gray-800">Image 5: apple-5</p>
        </div>
      </div>

      <SectionHeader>Best Practices for Labeling</SectionHeader>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 p-4">
          <h3 className="mb-2 font-semibold text-green-700">✓ Recommended</h3>
          <ul className="ml-5 list-disc text-gray-700">
            <li className="mb-1">Use consistent naming conventions</li>
            <li className="mb-1">Keep labels short and descriptive</li>
            <li className="mb-1">Use lowercase letters</li>
            <li className="mb-1">
              Use hyphens for multi-word labels (e.g., "red-apple")
            </li>
            <li className="mb-1">
              Group similar objects with common base labels
            </li>
          </ul>
        </div>

        <div className="rounded-lg border border-gray-200 p-4">
          <h3 className="mb-2 font-semibold text-red-700">✗ Not Recommended</h3>
          <ul className="ml-5 list-disc text-gray-700">
            <li className="mb-1">Very long or complex labels</li>
            <li className="mb-1">Using special characters except hyphens</li>
            <li className="mb-1">Inconsistent capitalization</li>
            <li className="mb-1">Vague labels (e.g., "object1", "thing")</li>
            <li className="mb-1">Using spaces in labels</li>
          </ul>
        </div>
      </div>

      <SectionHeader>How Labels Are Used</SectionHeader>
      <Paragraph>
        Labels serve two important purposes in the AutoBox system:
      </Paragraph>
      <ol className="mb-6 ml-6 list-decimal text-gray-700">
        <li className="mb-3">
          <strong>Creating filenames for base images:</strong> Your labels are
          used to create filenames for the reference images in the ZIP archive
          that's sent to the API.
        </li>
        <li className="mb-3">
          <strong>Generating class values:</strong> Labels are converted into a
          class_values object that maps each filename to an index, which is used
          by the SIFT algorithm for detection.
        </li>
      </ol>

      <div className="mt-8 rounded-lg bg-blue-50 p-4 text-blue-800">
        <p className="font-medium">Proceed When Complete</p>
        <p className="mt-2">
          Once you've labeled all your base images, you can proceed to the next
          step by clicking the "Process and Continue" button. All images must
          have a label before you can proceed.
        </p>
      </div>
    </ContentLayout>
  );
};
