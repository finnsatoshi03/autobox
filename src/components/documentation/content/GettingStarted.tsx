import { ContentLayout, Paragraph, SectionHeader } from "./ContentLayout";

export const GettingStarted = () => {
  return (
    <ContentLayout
      title="Getting Started with AutoBox"
      subtitle="Learn how to use AutoBox for automated object detection and annotation"
    >
      <Paragraph>
        AutoBox is a powerful tool for detecting and annotating objects in
        images using the Scale-Invariant Feature Transform (SIFT) algorithm.
        This documentation will guide you through the process of using AutoBox
        and integrating it into your own applications.
      </Paragraph>

      <SectionHeader>What is AutoBox?</SectionHeader>
      <Paragraph>
        AutoBox is an automated object detection and annotation tool that uses
        computer vision techniques to identify objects in images based on
        reference examples. It's particularly useful for applications that
        require:
      </Paragraph>
      <ul className="mb-4 ml-6 list-disc text-gray-700">
        <li className="mb-2">
          Detection of specific objects across large datasets
        </li>
        <li className="mb-2">
          Automated image annotation for machine learning training
        </li>
        <li className="mb-2">
          Feature matching between reference and target images
        </li>
        <li className="mb-2">Processing of large image archives efficiently</li>
      </ul>

      <SectionHeader>How it Works</SectionHeader>
      <Paragraph>AutoBox uses the following workflow:</Paragraph>
      <ol className="mb-4 ml-6 list-decimal text-gray-700">
        <li className="mb-2">
          <strong>Base Image Upload:</strong> You upload reference images of
          objects you want to detect.
        </li>
        <li className="mb-2">
          <strong>Image Labeling:</strong> You label each reference image to
          identify what object it contains.
        </li>
        <li className="mb-2">
          <strong>Target Image Upload:</strong> You upload a target archive of
          images where you want to detect the reference objects.
        </li>
        <li className="mb-2">
          <strong>Analysis:</strong> The system analyzes the target images using
          SIFT to find instances of the reference objects.
        </li>
        <li className="mb-2">
          <strong>Results:</strong> The system provides detection results and
          annotations for all matched objects.
        </li>
      </ol>

      <SectionHeader>Key Features</SectionHeader>
      <ul className="mb-4 ml-6 list-disc text-gray-700">
        <li className="mb-2">Support for multiple reference images</li>
        <li className="mb-2">
          Automatic incremental labeling for large reference sets
        </li>
        <li className="mb-2">Batch processing of target images</li>
        <li className="mb-2">Support for ZIP and RAR archives</li>
        <li className="mb-2">
          Detailed analysis results with accuracy metrics
        </li>
        <li className="mb-2">API for integration with other applications</li>
      </ul>

      <div className="mt-8 rounded-lg bg-blue-50 p-4 text-blue-800">
        <p className="font-medium">Ready to get started?</p>
        <p className="mt-2">
          Head over to the Process Steps section to learn how to use the AutoBox
          interface, or check out the API Reference if you're looking to
          integrate AutoBox into your application.
        </p>
      </div>
    </ContentLayout>
  );
};
