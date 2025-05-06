import { ContentLayout, Paragraph, SectionHeader } from "./ContentLayout";

export const AnalysisResults = () => {
  return (
    <ContentLayout
      title="Analysis Results"
      subtitle="Understanding and using the SIFT analysis results"
    >
      <Paragraph>
        After processing your target images, AutoBox provides detailed results
        of the SIFT analysis. This page explains how to interpret these results
        and what to do with the downloaded data.
      </Paragraph>

      <div className="my-6 rounded-lg border border-gray-200 bg-gray-50 p-5">
        <h3 className="mb-2 text-lg font-semibold">Quick Summary</h3>
        <ul className="ml-5 list-disc text-gray-700">
          <li className="mb-1">
            Results include detection accuracy, detection count, and processing
            time
          </li>
          <li className="mb-1">
            A download link provides access to annotated images and detection
            data
          </li>
          <li className="mb-1">
            You can download the results and review detected objects
          </li>
          <li className="mb-1">
            After reviewing, you can start a new detection project or modify the
            current one
          </li>
        </ul>
      </div>

      <SectionHeader>Understanding the Results Dashboard</SectionHeader>
      <Paragraph>
        When processing is complete, AutoBox displays a results dashboard with
        the following metrics:
      </Paragraph>

      <div className="mb-6 overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full border-collapse text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-sm font-semibold text-gray-900">
                Metric
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-900">
                Description
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-900">
                Example
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium">
                Detection Accuracy
              </td>
              <td className="px-4 py-3 text-sm">
                Estimated accuracy of the object detections
              </td>
              <td className="px-4 py-3 text-sm">56.82%</td>
            </tr>
            <tr>
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium">
                Processing Time
              </td>
              <td className="px-4 py-3 text-sm">
                Total time taken to analyze all images
              </td>
              <td className="px-4 py-3 text-sm">41.83 seconds</td>
            </tr>
            <tr>
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium">
                Images with Detections
              </td>
              <td className="px-4 py-3 text-sm">
                Number of images where objects were found
              </td>
              <td className="px-4 py-3 text-sm">23 of 540</td>
            </tr>
            <tr>
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium">
                Annotated Images
              </td>
              <td className="px-4 py-3 text-sm">
                Percentage of images that have been annotated
              </td>
              <td className="px-4 py-3 text-sm">4.26%</td>
            </tr>
          </tbody>
        </table>
      </div>

      <SectionHeader>Downloading and Using Results</SectionHeader>
      <Paragraph>
        The results dashboard includes a "Download Results" button that allows
        you to download a ZIP archive containing:
      </Paragraph>
      <ul className="mb-4 ml-6 list-disc text-gray-700">
        <li className="mb-2">
          <strong>Annotated Images:</strong> Copies of target images with
          bounding boxes around detected objects
        </li>
        <li className="mb-2">
          <strong>JSON Files:</strong> Detection data for each image, including
          coordinates and confidence scores
        </li>
        <li className="mb-2">
          <strong>Summary Report:</strong> Overall statistics and metadata about
          the detection process
        </li>
        <li className="mb-2">
          <strong>Original Images:</strong> In the case of images with no
          detections, the originals are preserved
        </li>
      </ul>

      <div className="mb-6 rounded-lg border border-gray-200 p-5">
        <h3 className="mb-3 text-lg font-semibold">
          Example JSON Detection Data
        </h3>
        <pre className="max-h-60 overflow-y-auto rounded-md bg-gray-50 p-4 text-xs">
          {`{
  "filename": "street_scene_1.jpg",
  "detections": [
    {
      "label": "car",
      "confidence": 0.87,
      "bounding_box": {
        "x1": 120,
        "y1": 85,
        "x2": 340,
        "y2": 195
      }
    },
    {
      "label": "person",
      "confidence": 0.76,
      "bounding_box": {
        "x1": 450,
        "y1": 200,
        "x2": 510,
        "y2": 350
      }
    }
  ],
  "processing_time": 0.45
}`}
        </pre>
      </div>

      <SectionHeader>Interpreting Detection Accuracy</SectionHeader>
      <Paragraph>
        The detection accuracy metric provides an estimate of how confident the
        system is in its detections. Several factors can affect accuracy:
      </Paragraph>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 p-4">
          <h3 className="mb-2 font-semibold text-blue-700">
            High Accuracy Factors
          </h3>
          <ul className="ml-5 list-disc text-gray-700">
            <li className="mb-1">Clear, high-quality reference images</li>
            <li className="mb-1">Distinctive objects with unique features</li>
            <li className="mb-1">
              Good lighting in both reference and target images
            </li>
            <li className="mb-1">
              Multiple reference images for each object class
            </li>
          </ul>
        </div>

        <div className="rounded-lg border border-gray-200 p-4">
          <h3 className="mb-2 font-semibold text-blue-700">
            Low Accuracy Factors
          </h3>
          <ul className="ml-5 list-disc text-gray-700">
            <li className="mb-1">Poor quality reference or target images</li>
            <li className="mb-1">Objects with few distinctive features</li>
            <li className="mb-1">
              Significant differences in viewing angle or scale
            </li>
            <li className="mb-1">
              Heavy occlusion of objects in target images
            </li>
          </ul>
        </div>
      </div>

      <SectionHeader>Next Steps</SectionHeader>
      <Paragraph>
        After reviewing your results, you have several options for next steps:
      </Paragraph>
      <ul className="mb-4 ml-6 list-disc text-gray-700">
        <li className="mb-2">
          <strong>Process New Dataset with Same Base Images:</strong> Keep your
          current reference images and labels, but upload a different target
          archive for detection.
        </li>
        <li className="mb-2">
          <strong>Start Fresh with New Base Images:</strong> Begin a completely
          new detection project with different reference images and labels.
        </li>
        <li className="mb-2">
          <strong>Refine Your Approach:</strong> If results weren't
          satisfactory, consider improving your reference images or adjusting
          your labeling strategy before trying again.
        </li>
      </ul>

      <div className="mt-8 rounded-lg bg-blue-50 p-4 text-blue-800">
        <p className="font-medium">Detection Improvements</p>
        <p className="mt-2">
          If detection accuracy is lower than expected, try adding more diverse
          reference images of the same objects. Including images from different
          angles, distances, and lighting conditions can significantly improve
          detection performance.
        </p>
      </div>
    </ContentLayout>
  );
};
