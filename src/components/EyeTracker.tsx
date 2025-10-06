import { useEffect, useRef, useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Camera, CameraOff, Eye, Monitor, AlertTriangle } from 'lucide-react';

interface BlinkData {
  timestamp: number;
  blinkRate: number;
  distance: number;
  eyePosition: { x: number; y: number };
}

interface EyeTrackerProps {
  onDataUpdate?: (data: BlinkData) => void;
  isActive?: boolean;
}

export function EyeTracker({ onDataUpdate, isActive = false }: EyeTrackerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState<string>('');
  const [blinkCount, setBlinkCount] = useState(0);
  const [lastBlinkTime, setLastBlinkTime] = useState(0);
  const [blinkRate, setBlinkRate] = useState(0);
  const [estimatedDistance, setEstimatedDistance] = useState(50);
  const [faceDetected, setFaceDetected] = useState(false);

  // Enhanced blink detection variables
  const blinkThreshold = 0.25; // Eye aspect ratio threshold for blink detection
  const consecutiveFrames = 3; // Frames to confirm a blink
  const [eyeClosedFrames, setEyeClosedFrames] = useState(0);
  const [blinkDetected, setBlinkDetected] = useState(false);
  const [blinkStartTime, setBlinkStartTime] = useState(0);
  
  // Face detection model state
  const [faceDetectionReady, setFaceDetectionReady] = useState(false);

  // Initialize camera access
  const startCamera = useCallback(async () => {
    try {
      setError('');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user' // Front-facing camera
        }
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
        setIsTracking(true);
      }
    } catch (err) {
      setError('Camera access denied or not available');
      console.error('Camera error:', err);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsTracking(false);
    setFaceDetected(false);
  }, [stream]);

  // Simple eye aspect ratio calculation for blink detection
  const calculateEyeAspectRatio = (eyeLandmarks: number[][]) => {
    // Calculate vertical distances
    const A = Math.sqrt(Math.pow(eyeLandmarks[1][0] - eyeLandmarks[5][0], 2) + 
                       Math.pow(eyeLandmarks[1][1] - eyeLandmarks[5][1], 2));
    const B = Math.sqrt(Math.pow(eyeLandmarks[2][0] - eyeLandmarks[4][0], 2) + 
                       Math.pow(eyeLandmarks[2][1] - eyeLandmarks[4][1], 2));
    
    // Calculate horizontal distance
    const C = Math.sqrt(Math.pow(eyeLandmarks[0][0] - eyeLandmarks[3][0], 2) + 
                       Math.pow(eyeLandmarks[0][1] - eyeLandmarks[3][1], 2));
    
    // Eye aspect ratio
    return (A + B) / (2.0 * C);
  };

  // Estimate distance based on face size in frame
  const estimateDistance = (faceWidth: number) => {
    // Average face width is about 14cm, this is a rough estimation
    const averageFaceWidth = 14; // cm
    const focalLength = 500; // Approximate focal length for web cameras
    
    if (faceWidth > 0) {
      const distance = (averageFaceWidth * focalLength) / faceWidth;
      return Math.max(20, Math.min(100, distance)); // Clamp between 20-100cm
    }
    return 50;
  };

  // Enhanced face detection and blink analysis
  const detectFaceAndBlinks = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !isTracking) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Enhanced face detection with better algorithms
    const faceRegion = detectFaceRegionEnhanced(imageData);
    
    if (faceRegion) {
      setFaceDetected(true);
      
      // Draw face detection overlay
      ctx.strokeStyle = 'green';
      ctx.lineWidth = 2;
      ctx.strokeRect(faceRegion.x, faceRegion.y, faceRegion.width, faceRegion.height);
      
      // Estimate distance based on face size with improved accuracy
      const faceWidth = faceRegion.width;
      const distance = estimateDistanceEnhanced(faceWidth, canvas.width);
      setEstimatedDistance(distance);
      
      // Enhanced eye detection and blink analysis
      const eyeRegions = detectEyeRegionsEnhanced(faceRegion, imageData);
      
      if (eyeRegions.leftEye && eyeRegions.rightEye) {
        // Draw eye detection overlay
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 1;
        ctx.strokeRect(eyeRegions.leftEye.x, eyeRegions.leftEye.y, eyeRegions.leftEye.width, eyeRegions.leftEye.height);
        ctx.strokeRect(eyeRegions.rightEye.x, eyeRegions.rightEye.y, eyeRegions.rightEye.width, eyeRegions.rightEye.height);
        
        const leftEAR = analyzeEyeRegionEnhanced(eyeRegions.leftEye, imageData);
        const rightEAR = analyzeEyeRegionEnhanced(eyeRegions.rightEye, imageData);
        const averageEAR = (leftEAR + rightEAR) / 2;
        
        // Enhanced blink detection logic
        if (averageEAR < blinkThreshold) {
          if (eyeClosedFrames === 0) {
            setBlinkStartTime(Date.now());
          }
          setEyeClosedFrames(prev => prev + 1);
        } else {
          if (eyeClosedFrames >= consecutiveFrames && !blinkDetected) {
            // Blink detected - calculate blink duration
            const blinkDuration = Date.now() - blinkStartTime;
            
            // Only count as valid blink if duration is reasonable (50-500ms)
            if (blinkDuration >= 50 && blinkDuration <= 500) {
              const currentTime = Date.now();
              setBlinkCount(prev => prev + 1);
              
              // Calculate instantaneous blink rate
              const timeDiff = currentTime - lastBlinkTime;
              if (timeDiff > 0 && lastBlinkTime > 0) {
                const instantRate = 60000 / timeDiff;
                setBlinkRate(prev => {
                  // Smooth the blink rate using exponential moving average
                  const alpha = 0.3;
                  return alpha * Math.min(instantRate, 30) + (1 - alpha) * prev;
                });
              }
              
              setLastBlinkTime(currentTime);
              setBlinkDetected(true);
            }
          }
          setEyeClosedFrames(0);
          setBlinkDetected(false);
        }
      }
      
      // Send enhanced data to parent component
      if (onDataUpdate) {
        onDataUpdate({
          timestamp: Date.now(),
          blinkRate: blinkRate,
          distance: distance,
          eyePosition: { x: faceRegion.x + faceRegion.width / 2, y: faceRegion.y + faceRegion.height / 2 }
        });
      }
    } else {
      setFaceDetected(false);
    }
  }, [isTracking, blinkRate, lastBlinkTime, onDataUpdate, eyeClosedFrames, blinkDetected, blinkStartTime]);

  // Enhanced face detection using multiple algorithms
  const detectFaceRegionEnhanced = (imageData: ImageData) => {
    const { data, width, height } = imageData;
    
    // Combine multiple detection methods
    const skinColorRegion = detectSkinColorRegion(data, width, height);
    const edgeRegion = detectFaceByEdges(data, width, height);
    
    // Use the region that seems more reliable
    if (skinColorRegion && edgeRegion) {
      // If both methods detect something, use the intersection or the larger one
      const overlapArea = calculateOverlap(skinColorRegion, edgeRegion);
      if (overlapArea > 0.3) {
        return mergeRegions(skinColorRegion, edgeRegion);
      }
      return skinColorRegion.width * skinColorRegion.height > edgeRegion.width * edgeRegion.height 
        ? skinColorRegion : edgeRegion;
    }
    
    return skinColorRegion || edgeRegion;
  };

  const detectSkinColorRegion = (data: Uint8ClampedArray, width: number, height: number) => {
    let minX = width, minY = height, maxX = 0, maxY = 0;
    let facePixels = 0;
    
    // Enhanced skin color detection with YCbCr color space
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Convert to YCbCr for better skin detection
      const y = 0.299 * r + 0.587 * g + 0.114 * b;
      const cb = -0.169 * r - 0.331 * g + 0.5 * b + 128;
      const cr = 0.5 * r - 0.419 * g - 0.081 * b + 128;
      
      // Skin color detection in YCbCr space
      if (y > 80 && cb >= 85 && cb <= 135 && cr >= 135 && cr <= 180) {
        const x = (i / 4) % width;
        const y = Math.floor((i / 4) / width);
        
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
        facePixels++;
      }
    }
    
    // Enhanced validation
    if (facePixels > 2000 && maxX > minX && maxY > minY) {
      const aspectRatio = (maxY - minY) / (maxX - minX);
      // Face should have reasonable aspect ratio (0.8 to 1.5)
      if (aspectRatio > 0.8 && aspectRatio < 1.5) {
        return {
          x: minX,
          y: minY,
          width: maxX - minX,
          height: maxY - minY
        };
      }
    }
    
    return null;
  };

  const detectFaceByEdges = (data: Uint8ClampedArray, width: number, height: number) => {
    // Simple edge detection for face outline
    const edges = new Array(width * height).fill(0);
    
    // Sobel edge detection
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = y * width + x;
        const pixelIdx = idx * 4;
        
        // Convert to grayscale
        const gray = 0.299 * data[pixelIdx] + 0.587 * data[pixelIdx + 1] + 0.114 * data[pixelIdx + 2];
        
        // Sobel operators
        const gx = -1 * getGray(data, x-1, y-1, width) + 1 * getGray(data, x+1, y-1, width) +
                   -2 * getGray(data, x-1, y, width) + 2 * getGray(data, x+1, y, width) +
                   -1 * getGray(data, x-1, y+1, width) + 1 * getGray(data, x+1, y+1, width);
        
        const gy = -1 * getGray(data, x-1, y-1, width) - 2 * getGray(data, x, y-1, width) - 1 * getGray(data, x+1, y-1, width) +
                   1 * getGray(data, x-1, y+1, width) + 2 * getGray(data, x, y+1, width) + 1 * getGray(data, x+1, y+1, width);
        
        edges[idx] = Math.sqrt(gx * gx + gy * gy);
      }
    }
    
    // Find regions with strong edges that could be face contours
    // This is a simplified approach - in real applications, you'd use more sophisticated methods
    return null; // Placeholder - implement edge-based face detection if needed
  };

  const getGray = (data: Uint8ClampedArray, x: number, y: number, width: number) => {
    const idx = (y * width + x) * 4;
    return 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
  };

  const calculateOverlap = (region1: any, region2: any) => {
    const x1 = Math.max(region1.x, region2.x);
    const y1 = Math.max(region1.y, region2.y);
    const x2 = Math.min(region1.x + region1.width, region2.x + region2.width);
    const y2 = Math.min(region1.y + region1.height, region2.y + region2.height);
    
    if (x2 <= x1 || y2 <= y1) return 0;
    
    const overlapArea = (x2 - x1) * (y2 - y1);
    const area1 = region1.width * region1.height;
    const area2 = region2.width * region2.height;
    
    return overlapArea / Math.min(area1, area2);
  };

  const mergeRegions = (region1: any, region2: any) => {
    const minX = Math.min(region1.x, region2.x);
    const minY = Math.min(region1.y, region2.y);
    const maxX = Math.max(region1.x + region1.width, region2.x + region2.width);
    const maxY = Math.max(region1.y + region1.height, region2.y + region2.height);
    
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  };

  // Enhanced eye region detection with better positioning
  const detectEyeRegionsEnhanced = (faceRegion: any, imageData: ImageData) => {
    // More accurate eye positioning based on facial proportions
    const eyeY = faceRegion.y + faceRegion.height * 0.35; // Slightly lower
    const eyeHeight = faceRegion.height * 0.15; // Smaller, more precise
    const eyeWidth = faceRegion.width * 0.15;
    
    // Account for face angle and positioning
    const leftEyeX = faceRegion.x + faceRegion.width * 0.25;
    const rightEyeX = faceRegion.x + faceRegion.width * 0.6;
    
    return {
      leftEye: {
        x: leftEyeX,
        y: eyeY,
        width: eyeWidth,
        height: eyeHeight
      },
      rightEye: {
        x: rightEyeX,
        y: eyeY,
        width: eyeWidth,
        height: eyeHeight
      }
    };
  };

  // Enhanced eye analysis using multiple metrics
  const analyzeEyeRegionEnhanced = (eyeRegion: any, imageData: ImageData) => {
    const { data, width } = imageData;
    let totalBrightness = 0;
    let darkPixels = 0;
    let pixelCount = 0;
    let verticalVariance = 0;
    
    // Analyze the eye region with multiple metrics
    const centerY = eyeRegion.y + eyeRegion.height / 2;
    
    for (let y = eyeRegion.y; y < eyeRegion.y + eyeRegion.height; y++) {
      let rowBrightness = 0;
      let rowPixels = 0;
      
      for (let x = eyeRegion.x; x < eyeRegion.x + eyeRegion.width; x++) {
        if (x >= 0 && x < width && y >= 0 && y < imageData.height) {
          const i = (y * width + x) * 4;
          const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
          
          totalBrightness += brightness;
          rowBrightness += brightness;
          pixelCount++;
          rowPixels++;
          
          // Count dark pixels (likely eyelashes or pupil)
          if (brightness < 80) {
            darkPixels++;
          }
        }
      }
      
      // Calculate vertical variance (open eyes have more variation)
      if (rowPixels > 0) {
        const rowAvg = rowBrightness / rowPixels;
        const distanceFromCenter = Math.abs(y - centerY);
        verticalVariance += rowAvg * (1 - distanceFromCenter / (eyeRegion.height / 2));
      }
    }
    
    if (pixelCount === 0) return 0.5; // Default value
    
    const averageBrightness = totalBrightness / pixelCount;
    const darkPixelRatio = darkPixels / pixelCount;
    const normalizedVariance = verticalVariance / pixelCount;
    
    // Combine metrics for better eye openness detection
    // Lower values indicate closed eyes
    const brightnessScore = averageBrightness / 255;
    const varianceScore = normalizedVariance / 100;
    const darknessScore = 1 - darkPixelRatio;
    
    // Weighted combination
    const eyeOpenness = (brightnessScore * 0.4 + varianceScore * 0.4 + darknessScore * 0.2);
    
    return Math.max(0, Math.min(1, eyeOpenness));
  };

  // Enhanced distance estimation
  const estimateDistanceEnhanced = (faceWidth: number, frameWidth: number) => {
    // More accurate distance calculation using multiple factors
    const averageFaceWidthCm = 14; // Average human face width in cm
    const estimatedFocalLength = frameWidth * 0.8; // More accurate focal length estimation
    
    if (faceWidth > 20) { // Minimum face width threshold
      // Basic distance calculation
      let distance = (averageFaceWidthCm * estimatedFocalLength) / faceWidth;
      
      // Apply correction factors based on face width relative to frame
      const faceWidthRatio = faceWidth / frameWidth;
      
      if (faceWidthRatio < 0.1) {
        distance *= 1.2; // Person is likely further
      } else if (faceWidthRatio > 0.4) {
        distance *= 0.8; // Person is likely closer
      }
      
      // Clamp to reasonable range
      return Math.max(25, Math.min(150, distance));
    }
    
    return 60; // Default distance
  };

  // Animation loop for continuous detection
  useEffect(() => {
    let animationId: number;
    
    if (isTracking) {
      const analyze = () => {
        detectFaceAndBlinks();
        animationId = requestAnimationFrame(analyze);
      };
      animationId = requestAnimationFrame(analyze);
    }
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isTracking, detectFaceAndBlinks]);

  // Calculate current blink rate based on recent blinks
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const timeSinceLastBlink = now - lastBlinkTime;
      
      // If more than 10 seconds since last blink, recalculate rate
      if (timeSinceLastBlink > 10000 && blinkCount > 0) {
        const newRate = Math.max(0, blinkRate * 0.9); // Gradually decrease
        setBlinkRate(newRate);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [lastBlinkTime, blinkCount, blinkRate]);

  // Start/stop tracking based on isActive prop
  useEffect(() => {
    if (isActive && !isTracking) {
      startCamera();
    } else if (!isActive && isTracking) {
      stopCamera();
    }
  }, [isActive, isTracking, startCamera, stopCamera]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Eye className="w-5 h-5 mr-2" />
          Eye Tracking System
        </CardTitle>
        <CardDescription>
          Real-time blink detection and distance measurement using your webcam
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="flex items-center space-x-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <span className="text-sm text-destructive">{error}</span>
          </div>
        )}

        {!isTracking && !error && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Getting Started</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Click "Start Tracking" to access your camera</li>
              <li>• Position yourself 40-60cm from the screen</li>
              <li>• Look directly at the camera for best detection</li>
              <li>• Green overlay shows face detection is working</li>
              <li>• Blue boxes will appear around detected eyes</li>
            </ul>
          </div>
        )}
        
        {/* Camera Feed */}
        <div className="relative">
          <video
            ref={videoRef}
            className="w-full max-w-md rounded-lg border"
            autoPlay
            playsInline
            muted
            style={{ transform: 'scaleX(-1)' }} // Mirror the video
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-50"
            style={{ transform: 'scaleX(-1)' }}
          />
          
          {isTracking && (
            <div className="absolute top-2 right-2">
              <Badge variant={faceDetected ? "default" : "secondary"}>
                {faceDetected ? "Face Detected" : "No Face"}
              </Badge>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          <Button
            onClick={isTracking ? stopCamera : startCamera}
            variant={isTracking ? "secondary" : "default"}
          >
            {isTracking ? <CameraOff className="w-4 h-4 mr-2" /> : <Camera className="w-4 h-4 mr-2" />}
            {isTracking ? 'Stop Tracking' : 'Start Tracking'}
          </Button>
        </div>

        {/* Real-time Metrics */}
        {isTracking && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Blink Rate</span>
                  <span className="text-sm font-medium">{blinkRate.toFixed(1)}/min</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Blinks</span>
                  <span className="text-sm font-medium">{blinkCount}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Distance</span>
                  <span className="text-sm font-medium">{estimatedDistance.toFixed(0)}cm</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant={faceDetected ? "default" : "secondary"}>
                    {faceDetected ? "Tracking" : "No Face"}
                  </Badge>
                </div>
              </div>
            </div>
            
            {/* Additional Debug Info */}
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>Eye Closed Frames:</span>
                <span>{eyeClosedFrames}</span>
              </div>
              <div className="flex justify-between">
                <span>Last Blink:</span>
                <span>{lastBlinkTime > 0 ? `${Math.floor((Date.now() - lastBlinkTime) / 1000)}s ago` : 'None'}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}