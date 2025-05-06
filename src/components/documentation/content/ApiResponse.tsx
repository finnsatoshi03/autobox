import {
  ContentLayout,
  CodeBlock,
  Paragraph,
  SectionHeader,
} from "./ContentLayout";

export const ApiResponse = () => {
  return (
    <ContentLayout
      title="API Response Format"
      subtitle="Understanding the response data from the AutoBox API"
    >
      <Paragraph>
        The AutoBox API returns structured responses that provide detailed
        information about the analysis results. This page explains the response
        format, available fields, and how to interpret the data for your
        application.
      </Paragraph>

      <SectionHeader>Success Response Structure</SectionHeader>
      <Paragraph>
        When a request is successful, the API returns a JSON object with the
        following structure:
      </Paragraph>
      <CodeBlock>
        {`{
  "detection_accuracy": "56.82%",
  "download_url": "http://127.0.0.1:5000/download_archive/4a824bcf-aab6-48d8-bd0a-7a857c3e3a87",
  "images_with_detections": 23,
  "message": "success",
  "processing_time": "41.83 seconds",
  "total_annotated_images": "4.26%",
  "total_images": 540
}`}
      </CodeBlock>

      <SectionHeader>Response Fields</SectionHeader>
      <div className="mb-6 overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full border-collapse text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-sm font-semibold text-gray-900">
                Field
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-900">
                Type
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-900">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium">
                message
              </td>
              <td className="px-4 py-3 text-sm">string</td>
              <td className="px-4 py-3 text-sm">
                Status message, typically "success" for successful operations
              </td>
            </tr>
            <tr>
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium">
                detection_accuracy
              </td>
              <td className="px-4 py-3 text-sm">string</td>
              <td className="px-4 py-3 text-sm">
                The estimated accuracy of detections as a percentage
              </td>
            </tr>
            <tr>
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium">
                download_url
              </td>
              <td className="px-4 py-3 text-sm">string</td>
              <td className="px-4 py-3 text-sm">
                URL to download the results archive containing annotated images
              </td>
            </tr>
            <tr>
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium">
                images_with_detections
              </td>
              <td className="px-4 py-3 text-sm">number</td>
              <td className="px-4 py-3 text-sm">
                Count of images where objects were successfully detected
              </td>
            </tr>
            <tr>
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium">
                processing_time
              </td>
              <td className="px-4 py-3 text-sm">string</td>
              <td className="px-4 py-3 text-sm">
                Total time taken to process the request
              </td>
            </tr>
            <tr>
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium">
                total_annotated_images
              </td>
              <td className="px-4 py-3 text-sm">string</td>
              <td className="px-4 py-3 text-sm">
                Percentage of target images that were successfully annotated
              </td>
            </tr>
            <tr>
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium">
                total_images
              </td>
              <td className="px-4 py-3 text-sm">number</td>
              <td className="px-4 py-3 text-sm">
                Total number of images processed in the target archive
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <SectionHeader>Download URL</SectionHeader>
      <Paragraph>
        The download_url field in the response provides a link to download the
        results of the analysis. This URL can be used to fetch a ZIP archive
        containing:
      </Paragraph>
      <ul className="mb-4 ml-6 list-disc text-gray-700">
        <li className="mb-2">Original target images</li>
        <li className="mb-2">
          Annotated versions of images where objects were detected
        </li>
        <li className="mb-2">
          JSON files containing detection coordinates and confidence scores
        </li>
        <li className="mb-2">Summary report with detection statistics</li>
      </ul>

      <SectionHeader>Error Response Structure</SectionHeader>
      <Paragraph>
        In case of errors, the API returns a JSON object with error details:
      </Paragraph>
      <CodeBlock>
        {`{
  "error": "Invalid request format: Missing required parameter 'target_archive'",
  "message": "error",
  "status": 400
}`}
      </CodeBlock>

      <div className="mb-6 overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full border-collapse text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-sm font-semibold text-gray-900">
                Field
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-900">
                Type
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-900">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium">
                error
              </td>
              <td className="px-4 py-3 text-sm">string</td>
              <td className="px-4 py-3 text-sm">
                Detailed error message explaining what went wrong
              </td>
            </tr>
            <tr>
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium">
                message
              </td>
              <td className="px-4 py-3 text-sm">string</td>
              <td className="px-4 py-3 text-sm">
                Always "error" for error responses
              </td>
            </tr>
            <tr>
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium">
                status
              </td>
              <td className="px-4 py-3 text-sm">number</td>
              <td className="px-4 py-3 text-sm">
                HTTP status code (e.g., 400 for Bad Request, 500 for Server
                Error)
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <SectionHeader>Handling Responses in JavaScript</SectionHeader>
      <CodeBlock>
        {`// Example response handling code
async function processSiftResults(apiResponse) {
  const {
    detection_accuracy,
    download_url,
    images_with_detections,
    total_images,
    total_annotated_images,
    processing_time
  } = apiResponse;

  console.log(\`Analysis complete in \${processing_time}\`);
  console.log(\`Detected objects in \${images_with_detections} of \${total_images} images\`);
  console.log(\`Detection accuracy: \${detection_accuracy}\`);
  
  // Download the results archive
  if (download_url) {
    // Option 1: Open in new tab
    window.open(download_url, '_blank');
    
    // Option 2: Programmatic download
    const response = await fetch(download_url);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sift_results.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}`}
      </CodeBlock>

      <div className="mt-8 rounded-lg bg-blue-50 p-4 text-blue-800">
        <p className="font-medium">Results Retention</p>
        <p className="mt-2">
          The download URL is only valid for a limited time (typically 24
          hours). Make sure to download the results promptly or store the URL
          for later access within this timeframe.
        </p>
      </div>
    </ContentLayout>
  );
};
