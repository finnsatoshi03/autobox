import {
  ContentLayout,
  CodeBlock,
  Paragraph,
  SectionHeader,
} from "./ContentLayout";
import { useContext } from "react";
import { DocumentationContext } from "../DocumentationContext";

export const ApiRequest = () => {
  const { handleSectionChange } = useContext(DocumentationContext);

  return (
    <ContentLayout
      title="API Request Format"
      subtitle="How to structure requests to the AutoBox API"
    >
      <Paragraph>
        Understanding how to properly format requests to the AutoBox API is
        essential for successful integration. This page details the request
        structure, including headers, body format, and example implementations
        in various programming languages.
      </Paragraph>

      <SectionHeader>Request Headers</SectionHeader>
      <Paragraph>
        When making requests to the AutoBox API, you should include the
        following headers:
      </Paragraph>
      <div className="mb-6 overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full border-collapse text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-sm font-semibold text-gray-900">
                Header
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-900">
                Value
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-900">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium">
                Content-Type
              </td>
              <td className="px-4 py-3 text-sm">multipart/form-data</td>
              <td className="px-4 py-3 text-sm">
                Required for file uploads. Most HTTP clients set this
                automatically with the appropriate boundary.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <SectionHeader>FormData Structure</SectionHeader>
      <Paragraph>
        The API expects requests in multipart/form-data format to accommodate
        file uploads. Here's how to structure the form data properly:
      </Paragraph>

      <div className="mb-6 rounded-lg border border-gray-200 p-5">
        <h3 className="mb-3 text-lg font-semibold">class</h3>
        <p className="mb-2 text-gray-700">
          A JSON string containing the mapping of image filenames to their
          corresponding indices.
        </p>
        <CodeBlock>
          {`{
  "class_values": {
    "apple-1.png": "0",
    "apple-2.png": "1",
    "banana.png": "2"
  }
}`}
        </CodeBlock>
      </div>

      <div className="mb-6 rounded-lg border border-gray-200 p-5">
        <h3 className="mb-3 text-lg font-semibold">target_archive</h3>
        <p className="mb-2 text-gray-700">
          A file object containing the target images to analyze, packaged as a
          ZIP or RAR archive.
        </p>
        <ul className="ml-5 list-disc text-gray-700">
          <li className="mb-1">Must be a valid ZIP or RAR file</li>
          <li className="mb-1">
            Should contain only image files (JPG, PNG, etc.)
          </li>
          <li className="mb-1">
            Directory structure within the archive is preserved during
            processing
          </li>
        </ul>
      </div>

      <div className="mb-6 rounded-lg border border-gray-200 p-5">
        <h3 className="mb-3 text-lg font-semibold">base_archive</h3>
        <p className="mb-2 text-gray-700">
          A file object containing the reference images used for detection,
          packaged as a ZIP archive.
        </p>
        <ul className="ml-5 list-disc text-gray-700">
          <li className="mb-1">Must be a valid ZIP file</li>
          <li className="mb-1">
            Should contain images with filenames matching those specified in the
            class_values
          </li>
          <li className="mb-1">
            Each image should clearly display the object to be detected
          </li>
        </ul>
      </div>

      <div className="mb-6 rounded-lg border border-gray-200 p-5">
        <h3 className="mb-3 text-lg font-semibold">label</h3>
        <p className="mb-2 text-gray-700">
          A text file containing the same class_values JSON object as provided
          in the 'class' parameter.
        </p>
        <p className="mb-2 text-gray-700">
          This redundancy ensures the class values are preserved even if the
          JSON string is malformed.
        </p>
      </div>

      <SectionHeader>Request Example in JavaScript (Axios)</SectionHeader>
      <CodeBlock>
        {`import axios from 'axios';
import { api } from './services/api'; // Import from your config

const sendSiftRequest = async () => {
  // Sample class values
  const classValues = {
    "apple-1.png": "0",
    "apple-2.png": "1",
    "banana.png": "2"
  };
  
  // Create the label file with class values
  const labelContent = JSON.stringify({ class_values: classValues }, null, 2);
  const labelFile = new File([labelContent], "class_values.txt", { type: "text/plain" });
  
  // Create form data
  const formData = new FormData();
  formData.append("class", JSON.stringify({ class_values: classValues }));
  formData.append("target_archive", targetArchiveFile);
  formData.append("base_archive", baseArchiveFile);
  formData.append("label", labelFile);
  
  // Send the request
  try {
    const response = await axios.post(\`\${api}/run-sift\`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    
    // Get tracking information from the initial response
    const { progress_url, status_url, uid } = response.data;
    
    console.log("Processing started with ID:", uid);
    console.log("You can track progress at:", progress_url);
    console.log("Final results will be available at:", status_url);
    
    // See the Asynchronous Processing section for details on how to
    // implement polling with these URLs
    
    return response.data;
  } catch (error) {
    console.error("Error during SIFT analysis:", error);
    throw error;
  }
};`}
      </CodeBlock>

      <div className="mt-8 rounded-lg bg-blue-50 p-4 text-blue-800">
        <p className="font-medium">Request Validation</p>
        <p className="mt-2">
          The API performs validation on all requests and will return
          appropriate error messages if the request format is invalid. Always
          check the response status and error messages to troubleshoot
          integration issues.
        </p>
        <p className="mt-2">
          Note that the response format has changed to support asynchronous
          processing. See the{" "}
          <a
            href="#"
            className="text-blue-600 underline"
            onClick={() => handleSectionChange("api-polling")}
          >
            Asynchronous Processing
          </a>{" "}
          section for details on how to handle the response.
        </p>
      </div>
    </ContentLayout>
  );
};
