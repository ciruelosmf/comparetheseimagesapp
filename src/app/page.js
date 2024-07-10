"use client"




import ImageComparisonApp from '../components/ImageComparisonApp';

import Image from "next/image";
import React, { useState } from 'react';
import { Upload, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';










export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Image Comparison App</h1>
      <ImageComparisonApp />
    </div>
  );
}