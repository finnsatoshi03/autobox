import {
  ContentLayout,
  CodeBlock,
  Paragraph,
  SectionHeader,
} from "./ContentLayout";

export const AdvancedUsage = () => {
  return (
    <ContentLayout
      title="Advanced Usage"
      subtitle="Tips and techniques for power users"
    >
      <Paragraph>
        This section covers advanced usage scenarios and optimization techniques
        for experienced users who want to get the most out of AutoBox. These
        techniques can help improve detection accuracy, efficiency, and
        integration options.
      </Paragraph>

      <SectionHeader>Optimizing Base Images</SectionHeader>
      <Paragraph>
        For the best detection results, consider these advanced techniques when
        preparing your base images:
      </Paragraph>

      <div className="mb-6 space-y-4">
        <div className="rounded-lg border border-gray-200 p-4">
          <h3 className="mb-2 text-lg font-medium">Image Pre-processing</h3>
          <p className="mb-2 text-gray-700">
            Apply these pre-processing techniques to your base images before
            uploading:
          </p>
          <ul className="ml-5 list-disc text-gray-700">
            <li className="mb-1">
              Normalize lighting and contrast across all images
            </li>
            <li className="mb-1">Remove or minimize background distractions</li>
            <li className="mb-1">
              Ensure consistent resolution across reference images
            </li>
            <li className="mb-1">
              Consider creating silhouette versions for shape-based detection
            </li>
          </ul>
        </div>

        <div className="rounded-lg border border-gray-200 p-4">
          <h3 className="mb-2 text-lg font-medium">Multi-angle Coverage</h3>
          <p className="mb-2 text-gray-700">
            For complex objects, create a comprehensive set of reference images:
          </p>
          <ul className="ml-5 list-disc text-gray-700">
            <li className="mb-1">
              Capture objects from multiple angles (front, side, 45-degree
              angles)
            </li>
            <li className="mb-1">
              Include close-up images of distinctive features
            </li>
            <li className="mb-1">
              Vary lighting conditions to improve robustness
            </li>
            <li className="mb-1">
              Include images at different scales/distances
            </li>
          </ul>
        </div>
      </div>

      <SectionHeader>Batch Processing with Scripts</SectionHeader>
      <Paragraph>
        For large-scale processing, you can use scripts to automate the API
        interaction:
      </Paragraph>
      <CodeBlock>
        {`// Example Node.js script for batch processing
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

async function processDirectory(baseImagesDir, targetArchivesDir, outputDir) {
  // Read directories
  const baseImages = fs.readdirSync(baseImagesDir)
    .filter(file => file.endsWith('.jpg') || file.endsWith('.png'));
  const targetArchives = fs.readdirSync(targetArchivesDir)
    .filter(file => file.endsWith('.zip') || file.endsWith('.rar'));
  
  // Create class values
  const classValues = {};
  baseImages.forEach((img, index) => {
    classValues[img] = index.toString();
  });
  
  // Create label file
  const labelContent = JSON.stringify({ class_values: classValues }, null, 2);
  fs.writeFileSync(path.join(outputDir, 'class_values.txt'), labelContent);
  
  // Create base images archive
  // This is simplified - you'd need to use a ZIP library in practice
  console.log('Creating base images archive...');
  
  // Process each target archive
  for (const archive of targetArchives) {
    console.log(\`Processing \${archive}...\`);
    const formData = new FormData();
    
    formData.append('class', JSON.stringify({ class_values: classValues }));
    formData.append('target_archive', 
      fs.createReadStream(path.join(targetArchivesDir, archive)));
    formData.append('base_archive', 
      fs.createReadStream(path.join(outputDir, 'base_images.zip')));
    formData.append('label', 
      fs.createReadStream(path.join(outputDir, 'class_values.txt')));
    
    try {
      const response = await axios.post('http://127.0.0.1:5000/run-sift', formData, {
        headers: { ...formData.getHeaders() },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      });
      
      console.log(\`Results for \${archive}:\`);
      console.log(\`Detection accuracy: \${response.data.detection_accuracy}\`);
      console.log(\`Images with detections: \${response.data.images_with_detections}\`);
      
      // Download results
      if (response.data.download_url) {
        const downloadResponse = await axios({
          method: 'get',
          url: response.data.download_url,
          responseType: 'stream'
        });
        
        const outputPath = path.join(outputDir, \`results_\${path.basename(archive)}\`);
        downloadResponse.data.pipe(fs.createWriteStream(outputPath));
        console.log(\`Results saved to \${outputPath}\`);
      }
    } catch (error) {
      console.error(\`Error processing \${archive}:\`, error.message);
    }
  }
}`}
      </CodeBlock>

      <SectionHeader>Programmatic Analysis of Results</SectionHeader>
      <Paragraph>
        You can programmatically process the detection results for integration
        with other systems:
      </Paragraph>
      <CodeBlock>
        {`// Example function for processing detection results
function analyzeDetectionResults(resultsZipPath) {
  // This assumes you've extracted the results ZIP file
  const resultsDir = 'path/to/extracted/results';
  const jsonFiles = fs.readdirSync(resultsDir)
    .filter(file => file.endsWith('.json'));
  
  const statistics = {
    totalImages: 0,
    imagesWithDetections: 0,
    detectionsByClass: {},
    confidenceAverage: 0,
    totalDetections: 0
  };
  
  jsonFiles.forEach(file => {
    const data = JSON.parse(fs.readFileSync(path.join(resultsDir, file)));
    
    statistics.totalImages++;
    if (data.detections && data.detections.length > 0) {
      statistics.imagesWithDetections++;
      
      data.detections.forEach(detection => {
        statistics.totalDetections++;
        
        // Track by class
        if (!statistics.detectionsByClass[detection.label]) {
          statistics.detectionsByClass[detection.label] = 0;
        }
        statistics.detectionsByClass[detection.label]++;
        
        // Track confidence
        statistics.confidenceAverage += detection.confidence;
      });
    }
  });
  
  // Calculate average confidence
  if (statistics.totalDetections > 0) {
    statistics.confidenceAverage /= statistics.totalDetections;
  }
  
  return statistics;
}`}
      </CodeBlock>

      <SectionHeader>Custom Deployment</SectionHeader>
      <Paragraph>
        For production use, consider deploying the AutoBox API on your own
        infrastructure:
      </Paragraph>
      <div className="mb-6 overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full border-collapse text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-sm font-semibold text-gray-900">
                Deployment Option
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-900">
                Advantages
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-900">
                Considerations
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium">
                Docker Container
              </td>
              <td className="px-4 py-3 text-sm">
                <ul className="ml-4 list-disc">
                  <li>Consistent environment</li>
                  <li>Easy scaling</li>
                  <li>Simple deployment</li>
                </ul>
              </td>
              <td className="px-4 py-3 text-sm">
                <ul className="ml-4 list-disc">
                  <li>Requires Docker runtime</li>
                  <li>Storage management for results</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium">
                Cloud Service (AWS/GCP/Azure)
              </td>
              <td className="px-4 py-3 text-sm">
                <ul className="ml-4 list-disc">
                  <li>Highly scalable</li>
                  <li>No hardware maintenance</li>
                  <li>Integration with other services</li>
                </ul>
              </td>
              <td className="px-4 py-3 text-sm">
                <ul className="ml-4 list-disc">
                  <li>Monthly costs</li>
                  <li>Data transfer limitations</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium">
                On-Premise Server
              </td>
              <td className="px-4 py-3 text-sm">
                <ul className="ml-4 list-disc">
                  <li>Data privacy</li>
                  <li>Full control</li>
                  <li>No recurring costs</li>
                </ul>
              </td>
              <td className="px-4 py-3 text-sm">
                <ul className="ml-4 list-disc">
                  <li>Hardware requirements</li>
                  <li>Maintenance responsibility</li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <SectionHeader>Performance Optimization</SectionHeader>
      <Paragraph>
        For processing large datasets efficiently, consider these optimizations:
      </Paragraph>
      <ul className="mb-4 ml-6 list-disc text-gray-700">
        <li className="mb-2">
          <strong>Image resizing:</strong> Downscale very large images to reduce
          processing time without significantly affecting detection accuracy
        </li>
        <li className="mb-2">
          <strong>Batch processing:</strong> Split large archives into smaller
          batches to process in parallel
        </li>
        <li className="mb-2">
          <strong>Pre-filtering:</strong> Use simpler algorithms to pre-filter
          images before applying the full SIFT analysis
        </li>
        <li className="mb-2">
          <strong>Hardware acceleration:</strong> When deploying your own
          instance, use CUDA-enabled GPUs to accelerate processing
        </li>
      </ul>

      <div className="mt-8 rounded-lg bg-blue-50 p-4 text-blue-800">
        <p className="font-medium">Expert Support</p>
        <p className="mt-2">
          For implementation of advanced features or custom deployments,
          consider contacting the AutoBox team for technical consulting and
          support. We can help with integration, optimization, and custom
          feature development.
        </p>
      </div>
    </ContentLayout>
  );
};
