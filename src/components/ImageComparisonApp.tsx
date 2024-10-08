import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useSession, signIn, signOut } from 'next-auth/react';

const ImageComparisonApp = () => {
  const { data: session, status } = useSession();
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [result, setResult] = useState(null);
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    if (session) {
      fetchCredits();
    }
  }, [session]);

  const fetchCredits = async () => {
    const response = await fetch(`/api/user-credits?userId=${session.user.email}`);
    const data = await response.json();
    console.log('data-------------3333333333333333-:', data);

    setCredits(data.credits);
  };

  const processImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          let { width, height } = calculateDimensions(img.width, img.height);
          
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          
          const base64 = canvas.toDataURL('image/jpeg', 0.8);
          resolve(base64);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const calculateDimensions = (width, height) => {
    if (width > height) {
      if (height > 768) {
        width = width * (768 / height);
        height = 768;
      }
      if (width > 2000) {
        height = height * (2000 / width);
        width = 2000;
      }
    } else {
      if (width > 768) {
        height = height * (768 / width);
        width = 768;
      }
      if (height > 2000) {
        width = width * (2000 / height);
        height = 2000;
      }
    }
    return { width, height };
  };

  const handleImageUpload = async (event, setImage) => {
    const file = event.target.files[0];
    if (file) {
      const processedImage = await processImage(file);
      setImage(processedImage);
    }
  };

  const compareImages = async () => {
    if (!session) {
      setResult({ error: "Please sign in to compare images." });
      return;
    }

    if (credits < 1) {
      setResult({ error: "Not enough credits. Please purchase more." });
      return;
    }

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
        body: JSON.stringify({ userId: session.user.email, image1, image2 }),
      });

      if (!response.ok) {
        throw new Error('Failed to compare images');
      }

      const data = await response.json();
      setResult(data);
      setCredits(data.remainingCredits);
    } catch (error) {
      console.error('Error comparing images:', error);
      setResult({ error: "An error occurred while comparing the images." });
    }
  };

  const renderImageUpload = (imageState, setImageFunction, labelText) => (
    <div className="w-[48%]">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleImageUpload(e, setImageFunction)}
        className="hidden"
        id={labelText.toLowerCase().replace(' ', '')}
      />
      <label htmlFor={labelText.toLowerCase().replace(' ', '')} className="cursor-pointer">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          {imageState ? (
            <img src={imageState} alt={labelText} className="max-w-full h-auto" />
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="w-12 h-12 text-gray-400" />
              <span className="mt-2 text-sm text-gray-500">Upload {labelText}</span>
            </div>
          )}
        </div>
      </label>
    </div>
  );

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Image Comparison App</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === "authenticated" ? (
          <>
            <p>Signed in as {session.user.email}</p>
            <p>Credits remaining: {credits}</p>
            <Button onClick={() => signOut()}>Sign out</Button>
          </>
        ) : (
          <Button onClick={() => signIn('google')}>Sign in with Google</Button>
        )}
        <div className="flex justify-between">
          {renderImageUpload(image1, setImage1, "Image 1")}
          {renderImageUpload(image2, setImage2, "Image 2")}
        </div>
        <Button onClick={compareImages} className="w-full" disabled={!image1 || !image2 || !session || credits < 1}>
          Compare Images
        </Button>
        {result && (
          <Alert variant={result.error ? "destructive" : (result.status === "loading" ? "default" : "default")}>
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