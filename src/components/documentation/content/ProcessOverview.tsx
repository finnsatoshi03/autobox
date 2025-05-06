import { ContentLayout, Paragraph, SectionHeader } from "./ContentLayout";

export const ProcessOverview = () => {
  return (
    <ContentLayout
      title="AutoBox Process Overview"
      subtitle="A detailed guide to the AutoBox workflow"
    >
      <Paragraph>
        The AutoBox process consists of several distinct steps, each designed to
        facilitate the efficient detection and annotation of objects in your
        target images. This overview will help you understand the complete
        workflow before diving into each step in detail.
      </Paragraph>

      <div className="my-8 flex flex-col gap-6">
        <div className="rounded-lg border border-gray-200 p-5">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lime-green/20 text-lime-green">
              1
            </div>
            <h3 className="text-lg font-semibold">Base Image Upload</h3>
          </div>
          <p className="text-gray-700">
            Upload reference images of objects you want to detect in your target
            dataset. These images serve as examples of what to look for. For
            best results, use clear images with the object prominently
            displayed.
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 p-5">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lime-green/20 text-lime-green">
              2
            </div>
            <h3 className="text-lg font-semibold">Image Labeling</h3>
          </div>
          <p className="text-gray-700">
            Add labels to each base image to identify what object it contains.
            These labels will be used to generate class values for the detection
            process. You can use the auto-labeling feature for multiple images
            to apply incremental labels (e.g., apple-1, apple-2).
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 p-5">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lime-green/20 text-lime-green">
              3
            </div>
            <h3 className="text-lg font-semibold">Target Image Upload</h3>
          </div>
          <p className="text-gray-700">
            Upload an archive (ZIP or RAR) containing the target images where
            you want to detect the objects. This can be a large dataset, as
            AutoBox is designed to process many images efficiently.
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 p-5">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lime-green/20 text-lime-green">
              4
            </div>
            <h3 className="text-lg font-semibold">Analysis Processing</h3>
          </div>
          <p className="text-gray-700">
            AutoBox processes the target images using the SIFT algorithm to
            detect instances of the reference objects. This involves feature
            extraction, matching, and verification to ensure accurate
            detections.
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 p-5">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lime-green/20 text-lime-green">
              5
            </div>
            <h3 className="text-lg font-semibold">Results and Download</h3>
          </div>
          <p className="text-gray-700">
            Once processing is complete, AutoBox provides detailed results
            including detection accuracy, processing time, and the number of
            annotated images. You can download the results, which include
            annotations for all detected objects.
          </p>
        </div>
      </div>

      <SectionHeader>Data Preparation</SectionHeader>
      <Paragraph>
        Before starting the AutoBox process, it's important to prepare your data
        properly:
      </Paragraph>
      <ul className="mb-4 ml-6 list-disc text-gray-700">
        <li className="mb-2">
          <strong>Base Images:</strong> Choose clear, representative images of
          the objects you want to detect.
        </li>
        <li className="mb-2">
          <strong>Target Archives:</strong> Ensure your target images are
          properly organized and compressed in a supported format (ZIP or RAR).
        </li>
        <li className="mb-2">
          <strong>Labels:</strong> Plan your labeling scheme in advance,
          especially if you have multiple similar objects to differentiate.
        </li>
      </ul>

      <div className="mt-8 rounded-lg bg-yellow-50 p-4 text-yellow-800">
        <p className="font-medium">Tip for Best Results</p>
        <p className="mt-2">
          The quality of your base images significantly affects detection
          accuracy. Use high-resolution images with good lighting and minimal
          background clutter for best results.
        </p>
      </div>
    </ContentLayout>
  );
};
