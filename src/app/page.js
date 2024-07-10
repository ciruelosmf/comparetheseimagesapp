"use client"





import Image from "next/image";
import React, { useState } from 'react';
import { Upload, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const ImageComparisonApp = () => {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [result, setResult] = useState(null);

  const handleImageUpload = (event, setImage) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const compareImages = async () => {
    if (!image1 || !image2) {
      setResult({ error: "Please upload both images before comparing." });
      return;
    }

    // Simulating an API call to a backend service
    setResult({ status: "loading" });
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing time

    // Simulated result (in reality, this would come from the backend)
    const simulatedResult = Math.random() > 0.5;
    setResult({
      match: simulatedResult,
      confidence: Math.floor(Math.random() * 40) + 60 // Random confidence between 60-99%
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Image Comparison App</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <div className="w-[48%]">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, setImage1)}
              className="hidden"
              id="image1"
            />
            <label htmlFor="image1" className="cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                {image1 ? (
                  <img src={image1} alt="First" className="max-w-full h-auto" />
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="w-12 h-12 text-gray-400" />
                    <span className="mt-2 text-sm text-gray-500">Upload Image 1</span>
                  </div>
                )}
              </div>
            </label>
          </div>
          <div className="w-[48%]">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, setImage2)}
              className="hidden"
              id="image2"
            />
            <label htmlFor="image2" className="cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                {image2 ? (
                  <img src={image2} alt="Second" className="max-w-full h-auto" />
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="w-12 h-12 text-gray-400" />
                    <span className="mt-2 text-sm text-gray-500">Upload Image 2</span>
                  </div>
                )}
              </div>
            </label>
          </div>
        </div>
        <Button onClick={compareImages} className="w-full">
          Compare Images
        </Button>
        {result && (
          <Alert variant={result.error ? "destructive" : (result.match ? "default" : "destructive")}>
            <AlertTitle>
              {result.error ? "Error" : (result.match ? "Match Found" : "No Match")}
            </AlertTitle>
            <AlertDescription>
              {result.error ? result.error : (
                result.status === "loading" ? "Comparing images..." : (
                  <>
                    {result.match ? "The images appear to be of the same subject. " : "The images do not appear to be of the same subject. "}
                    Confidence: {result.confidence}%
                  </>
                )
              )}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="text-sm text-gray-500">
        Upload two images and click "Compare Images" to see if they match.
      </CardFooter>
    </Card>
  );
};

export default ImageComparisonApp;