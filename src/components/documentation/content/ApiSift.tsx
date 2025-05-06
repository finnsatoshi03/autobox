import {
  ContentLayout,
  CodeBlock,
  Paragraph,
  SectionHeader,
} from "./ContentLayout";

export const ApiSift = () => {
  return (
    <ContentLayout
      title="SIFT Analysis API"
      subtitle="Details on the /run-sift endpoint"
    >
      <Paragraph>
        The SIFT Analysis endpoint is the core of the AutoBox API, allowing you
        to submit images for object detection using the Scale-Invariant Feature
        Transform algorithm. This page provides comprehensive documentation on
        how to use this endpoint effectively.
      </Paragraph>

      <SectionHeader>Endpoint</SectionHeader>
      <CodeBlock>{`POST http://127.0.0.1:5000/run-sift`}</CodeBlock>

      <SectionHeader>Content Type</SectionHeader>
      <Paragraph>
        This endpoint accepts <code>multipart/form-data</code> requests to
        handle file uploads.
      </Paragraph>

      <SectionHeader>Request Parameters</SectionHeader>
      <div className="mb-6 overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full border-collapse text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-sm font-semibold text-gray-900">
                Parameter
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-900">
                Type
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-900">
                Required
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-900">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium">
                class
              </td>
              <td className="px-4 py-3 text-sm">JSON string</td>
              <td className="px-4 py-3 text-sm">Yes</td>
              <td className="px-4 py-3 text-sm">
                A JSON string containing the class_values object mapping
                filenames to indexes
              </td>
            </tr>
            <tr>
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium">
                target_archive
              </td>
              <td className="px-4 py-3 text-sm">File</td>
              <td className="px-4 py-3 text-sm">Yes</td>
              <td className="px-4 py-3 text-sm">
                A ZIP or RAR archive containing target images to analyze
              </td>
            </tr>
            <tr>
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium">
                base_archive
              </td>
              <td className="px-4 py-3 text-sm">File</td>
              <td className="px-4 py-3 text-sm">Yes</td>
              <td className="px-4 py-3 text-sm">
                A ZIP archive containing reference images for object detection
              </td>
            </tr>
            <tr>
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium">
                label
              </td>
              <td className="px-4 py-3 text-sm">File</td>
              <td className="px-4 py-3 text-sm">Yes</td>
              <td className="px-4 py-3 text-sm">
                A text file containing the class_values in JSON format
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <SectionHeader>Class Values Format</SectionHeader>
      <Paragraph>
        The class parameter should be a JSON string with the following
        structure:
      </Paragraph>
      <CodeBlock>
        {`{
  "class_values": {
    "apple-1.png": "0",
    "apple-2.png": "1",
    "green apple.png": "2",
    "apple-3.png": "3"
  }
}`}
      </CodeBlock>

      <SectionHeader>Response</SectionHeader>
      <Paragraph>
        Upon successful processing, the endpoint returns a JSON object with the
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

      <SectionHeader>Implementation Example</SectionHeader>
      <Paragraph>
        Below is an example of how to call the SIFT Analysis API using
        JavaScript and the Fetch API:
      </Paragraph>
      <CodeBlock>
        {`async function runSiftAnalysis(classValues, targetArchiveFile, baseArchiveFile, labelFile) {
  const formData = new FormData();
  
  // Append the class values as a JSON string
  formData.append('class', JSON.stringify({
    class_values: classValues
  }));
  
  // Append the file objects with their filenames
  formData.append('target_archive', targetArchiveFile, targetArchiveFile.name);
  formData.append('base_archive', baseArchiveFile, baseArchiveFile.name);
  formData.append('label', labelFile, labelFile.name);

  try {
    const response = await fetch('http://127.0.0.1:5000/run-sift', {
      method: 'POST',
      body: formData,
      // No need to set Content-Type header, fetch sets it automatically with boundary
    });
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error running SIFT analysis:', error);
    throw error;
  }
}`}
      </CodeBlock>

      <div className="mt-8 rounded-lg bg-yellow-50 p-4 text-yellow-800">
        <p className="font-medium">Important Note</p>
        <p className="mt-2">
          Processing large archives can take significant time. Design your
          application to handle asynchronous processing and provide appropriate
          feedback to users during this time.
        </p>
      </div>
    </ContentLayout>
  );
};
