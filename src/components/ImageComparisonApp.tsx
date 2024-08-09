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
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const compareImages = async () => {
    if (!image1 || !image2) {
      setResult({ error: "Please upload both images before comparing." });
      return;
    }

    setResult({ status: "loading" });

    try {
      const response = await fetch('/api/compare-images-api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image1, image2 }),
      });

      if (!response.ok) {
        throw new Error('Failed to compare images');
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error comparing images:', error);
      

      setResult({ error: "An error occurred while comparing the images." });
    }
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



        <Button onClick={compareImages} className="w-full" disabled={!image1 || !image2}>
          Compare Images
        </Button>
        {result && (
          <Alert variant={result.error ? "destructive" : (result.status === "loading" ? "default" : (result.result.includes("same subject") ? "default" : "destructive"))}>
            <AlertTitle>
              {result.error ? "Error" : (result.status === "loading" ? "Processing" : "Result")}
            </AlertTitle>
            <AlertDescription>
              {result.error ? result.error : (
                result.status === "loading" ? "Comparing images..." : result.result
              )}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="text-sm text-gray-500">
        Upload 2 images and click "Compare Images" to see if they match.
      </CardFooter>
    </Card>
  );
};

export default ImageComparisonApp;