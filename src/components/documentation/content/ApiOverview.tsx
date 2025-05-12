import {
  ContentLayout,
  CodeBlock,
  Paragraph,
  SectionHeader,
} from "./ContentLayout";
import { useContext } from "react";
import { DocumentationContext } from "../DocumentationContext";
import { api } from "@/services/api";

export const ApiOverview = () => {
  const { handleSectionChange } = useContext(DocumentationContext);

  return (
    <ContentLayout
      title="API Reference"
      subtitle="Integrate AutoBox into your applications"
    >
      <Paragraph>
        AutoBox provides a robust API that allows you to integrate its object
        detection capabilities into your own applications. This section provides
        comprehensive documentation on the available endpoints, request formats,
        and response structures.
      </Paragraph>

      <SectionHeader>API Base URL</SectionHeader>
      <Paragraph>
        All API requests should be made to the following base URL:
      </Paragraph>
      <CodeBlock>{api}</CodeBlock>
      <Paragraph>
        When deploying to production, replace this with your own server's URL or
        configure the environment variable.
      </Paragraph>

      <SectionHeader>Authentication</SectionHeader>
      <Paragraph>
        Currently, the API does not require authentication for requests.
        However, it's recommended to implement your own authentication layer
        when deploying to production.
      </Paragraph>

      <SectionHeader>Available Endpoints</SectionHeader>
      <div className="mb-6 overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full border-collapse text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-sm font-semibold text-gray-900">
                Endpoint
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-900">
                Method
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-900">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-blue-600">
                /run-sift
              </td>
              <td className="px-4 py-3 text-sm">POST</td>
              <td className="px-4 py-3 text-sm">
                Initiate SIFT analysis to detect objects in target images
                (asynchronous)
              </td>
            </tr>
            <tr>
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-blue-600">
                /progress/:id
              </td>
              <td className="px-4 py-3 text-sm">GET</td>
              <td className="px-4 py-3 text-sm">
                Get real-time progress of a SIFT analysis job
              </td>
            </tr>
            <tr>
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-blue-600">
                /get-results/:id
              </td>
              <td className="px-4 py-3 text-sm">GET</td>
              <td className="px-4 py-3 text-sm">
                Retrieve final results of a completed SIFT analysis job
              </td>
            </tr>
            <tr>
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-blue-600">
                /download_archive/:id
              </td>
              <td className="px-4 py-3 text-sm">GET</td>
              <td className="px-4 py-3 text-sm">
                Download results from a previous analysis
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <SectionHeader>API Usage Example</SectionHeader>
      <Paragraph>
        Here's a basic example of how to use the AutoBox API with JavaScript,
        showing the asynchronous workflow:
      </Paragraph>
      <CodeBlock>
        {`import axios from 'axios';

const API_URL = "${api}"; // Import this from your environment or config

const runSiftAnalysis = async (classValues, targetArchive, baseArchive, label) => {
  const formData = new FormData();
  
  formData.append('class', JSON.stringify({ class_values: classValues }));
  formData.append('target_archive', targetArchive);
  formData.append('base_archive', baseArchive);
  formData.append('label', label);

  try {
    // Step 1: Initiate the analysis process
    const response = await axios.post(\`\${API_URL}/run-sift\`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    const { progress_url, status_url, uid } = response.data;
    console.log('Analysis started with ID:', uid);
    
    // Step 2: Poll for progress (simplified example)
    let isComplete = false;
    while (!isComplete) {
      // Wait 1 second between polls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get current progress
      const progressResponse = await axios.get(progress_url);
      const { processed, total } = progressResponse.data;
      
      console.log(\`Progress: \${processed}/\${total} images processed\`);
      
      // Check if processing is complete
      if (processed === total && processed > 0) {
        isComplete = true;
      }
    }
    
    // Step 3: Get final results
    const resultsResponse = await axios.get(status_url);
    return resultsResponse.data;
    
  } catch (error) {
    console.error('SIFT analysis failed:', error);
    throw error;
  }
};`}
      </CodeBlock>

      <div className="mt-8 rounded-lg bg-blue-50 p-4 text-blue-800">
        <p className="font-medium">Next Steps</p>
        <p className="mt-2">
          Explore the{" "}
          <a
            href="#"
            className="text-blue-600 underline"
            onClick={() => handleSectionChange("api-sift")}
          >
            SIFT Analysis
          </a>{" "}
          endpoint documentation for details on the request parameters and{" "}
          <a
            href="#"
            className="text-blue-600 underline"
            onClick={() => handleSectionChange("api-polling")}
          >
            Asynchronous Processing
          </a>{" "}
          for information on the polling workflow.
        </p>
      </div>
    </ContentLayout>
  );
};
