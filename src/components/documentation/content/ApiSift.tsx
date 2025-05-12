import {
  ContentLayout,
  CodeBlock,
  Paragraph,
  SectionHeader,
} from "./ContentLayout";
import { useContext } from "react";
import { DocumentationContext } from "../DocumentationContext";
import { api } from "@/services/api";

export const ApiSift = () => {
  const { handleSectionChange } = useContext(DocumentationContext);

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
      <CodeBlock>{`POST ${api}/run-sift`}</CodeBlock>

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
        When a request is initiated, the endpoint returns a JSON object with
        tracking information to allow for asynchronous processing. The response
        contains the following structure:
      </Paragraph>
      <CodeBlock>
        {`{
  "message": "processing started",
  "progress_url": "${api}/progress/05e343ef-c698-4e9c-b4f4-5e91c30a313c",
  "status_url": "${api}/get-results/05e343ef-c698-4e9c-b4f4-5e91c30a313c",
  "uid": "05e343ef-c698-4e9c-b4f4-5e91c30a313c"
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
                message
              </td>
              <td className="px-4 py-3 text-sm">string</td>
              <td className="px-4 py-3 text-sm">
                Status message indicating that processing has started
              </td>
            </tr>
            <tr>
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium">
                progress_url
              </td>
              <td className="px-4 py-3 text-sm">string</td>
              <td className="px-4 py-3 text-sm">
                URL to poll for real-time progress updates
              </td>
            </tr>
            <tr>
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium">
                status_url
              </td>
              <td className="px-4 py-3 text-sm">string</td>
              <td className="px-4 py-3 text-sm">
                URL to retrieve final results once processing is complete
              </td>
            </tr>
            <tr>
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium">
                uid
              </td>
              <td className="px-4 py-3 text-sm">string</td>
              <td className="px-4 py-3 text-sm">
                Unique identifier for this processing job
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <Paragraph>
        For details about tracking the progress of analysis and retrieving the
        final results, see the{" "}
        <a
          href="#"
          className="text-blue-600 underline"
          onClick={() => handleSectionChange("api-polling")}
        >
          Asynchronous Processing
        </a>{" "}
        section.
      </Paragraph>

      <SectionHeader>Implementation Example</SectionHeader>
      <Paragraph>
        Below is an example of how to call the SIFT Analysis API using
        JavaScript and the Fetch API:
      </Paragraph>
      <CodeBlock>
        {`import { api } from "./services/api"; // Import API URL from your config

async function runSiftAnalysis(classValues, targetArchiveFile, baseArchiveFile, labelFile) {
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
    const response = await fetch(\`\${api}/run-sift\`, {
      method: 'POST',
      body: formData,
      // No need to set Content-Type header, fetch sets it automatically with boundary
    });
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    // Get initial response with tracking information
    const data = await response.json();
    console.log('Processing started with ID:', data.uid);
    console.log('Progress URL:', data.progress_url);
    console.log('Results URL:', data.status_url);
    
    // See the Asynchronous Processing section for implementing the polling mechanism
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
          Processing large archives can take significant time. The API now uses
          an asynchronous processing model that allows you to track progress in
          real-time. See the{" "}
          <a
            href="#"
            className="text-blue-600 underline"
            onClick={() => handleSectionChange("api-polling")}
          >
            Asynchronous Processing
          </a>{" "}
          section for details on implementing the polling mechanism.
        </p>
      </div>
    </ContentLayout>
  );
};
