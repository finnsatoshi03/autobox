import {
  ContentLayout,
  CodeBlock,
  Paragraph,
  SectionHeader,
} from "./ContentLayout";
import { api } from "@/services/api";

export const ApiPolling = () => {
  return (
    <ContentLayout
      title="Asynchronous Processing"
      subtitle="Understanding the polling mechanism for tracking progress"
    >
      <Paragraph>
        The AutoBox API uses an asynchronous processing model for handling SIFT
        analysis requests. This allows for efficient handling of large datasets
        and provides real-time progress updates during processing. This page
        explains how the polling mechanism works and how to integrate it into
        your applications.
      </Paragraph>

      <SectionHeader>Initial Response</SectionHeader>
      <Paragraph>
        When you submit a request to the <code>/run-sift</code> endpoint, the
        API immediately returns a response with tracking information rather than
        waiting for the entire processing to complete.
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
                Status message indicating processing has started
              </td>
            </tr>
            <tr>
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium">
                progress_url
              </td>
              <td className="px-4 py-3 text-sm">string</td>
              <td className="px-4 py-3 text-sm">
                URL to poll for real-time processing progress updates
              </td>
            </tr>
            <tr>
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium">
                status_url
              </td>
              <td className="px-4 py-3 text-sm">string</td>
              <td className="px-4 py-3 text-sm">
                URL to poll for final results once processing is complete
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

      <SectionHeader>Polling for Progress</SectionHeader>
      <Paragraph>
        Use the <code>progress_url</code> to track the real-time progress of
        your processing job. This endpoint returns information about how many
        images have been processed and detailed status for individual images.
      </Paragraph>
      <CodeBlock>
        {`// Example progress response from progress_url
{
    "details": [
        {
            "confidence": 0,
            "image": "a_f001.png",
            "status": "done"
        },
        {
            "confidence": 0,
            "image": "a_f003.png",
            "status": "done"
        },
        {
            "confidence": 0,
            "image": "a_f002.png",
            "status": "done"
        }
    ],
    "processed": 540,
    "total": 540
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
                processed
              </td>
              <td className="px-4 py-3 text-sm">number</td>
              <td className="px-4 py-3 text-sm">
                Number of images processed so far
              </td>
            </tr>
            <tr>
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium">
                total
              </td>
              <td className="px-4 py-3 text-sm">number</td>
              <td className="px-4 py-3 text-sm">
                Total number of images to process
              </td>
            </tr>
            <tr>
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium">
                details
              </td>
              <td className="px-4 py-3 text-sm">array</td>
              <td className="px-4 py-3 text-sm">
                Array of objects containing status details for individual images
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <SectionHeader>Monitoring Process Completion</SectionHeader>
      <Paragraph>
        You can determine when processing is complete by comparing the{" "}
        <code>processed</code> and <code>total</code> values. When they are
        equal and greater than zero, processing has finished and you can query
        the <code>status_url</code> for the final results.
      </Paragraph>

      <SectionHeader>Retrieving Final Results</SectionHeader>
      <Paragraph>
        Once processing is complete, use the <code>status_url</code> to retrieve
        the final analysis results. This endpoint returns the same response
        format as described in the API Response section.
      </Paragraph>
      <CodeBlock>
        {`// Example final results response from status_url
{
    "detection_accuracy": "71.02%",
    "download_url": "${api}/download_archive/05e343ef-c698-4e9c-b4f4-5e91c30a313c",
    "images_with_detections": 5,
    "message": "success",
    "processing_time": "75.46 seconds",
    "total_annotated_images": "0.93%",
    "total_images": 540
}`}
      </CodeBlock>

      <SectionHeader>Implementation Example</SectionHeader>
      <Paragraph>
        Here's a practical example of how to implement the polling mechanism in
        JavaScript:
      </Paragraph>
      <CodeBlock>
        {`import axios from 'axios';
import { api } from './services/api'; // Import from your config

async function processSiftAnalysis(formData) {
  try {
    // Submit the initial request
    const initialResponse = await axios.post(\`\${api}/run-sift\`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    const { progress_url, status_url } = initialResponse.data;
    
    // Start polling for progress
    return new Promise((resolve, reject) => {
      const progressInterval = setInterval(async () => {
        try {
          const progressResponse = await axios.get(progress_url);
          const { processed, total } = progressResponse.data;
          
          // Report progress
          const percentComplete = Math.round((processed / total) * 100);
          console.log(\`Processing: \${percentComplete}% complete (\${processed}/\${total})\`);
          
          // Check if processing is complete
          if (processed === total && processed > 0) {
            clearInterval(progressInterval);
            
            // Allow some time for final processing
            setTimeout(async () => {
              try {
                // Get final results
                const resultsResponse = await axios.get(status_url);
                resolve(resultsResponse.data);
              } catch (error) {
                reject(error);
              }
            }, 2000);
          }
        } catch (error) {
          clearInterval(progressInterval);
          reject(error);
        }
      }, 1000); // Poll every second
    });
  } catch (error) {
    console.error('Error initiating SIFT analysis:', error);
    throw error;
  }
}`}
      </CodeBlock>

      <div className="mt-8 rounded-lg bg-blue-50 p-4 text-blue-800">
        <p className="font-medium">Best Practices for Polling</p>
        <p className="mt-2">
          - Use a reasonable polling interval (1-2 seconds is recommended)
        </p>
        <p className="mt-1">
          - Implement exponential backoff if necessary for large datasets
        </p>
        <p className="mt-1">- Always handle network errors gracefully</p>
        <p className="mt-1">
          - Consider setting a maximum polling duration to prevent indefinite
          waiting
        </p>
      </div>
    </ContentLayout>
  );
};
