import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Type, 
  Square, 
  Circle, 
  Image as ImageIcon, 
  Download, 
  Undo, 
  Redo,
  Trash2,
  Move,
  Palette
} from "lucide-react";
import { Template, CampaignData } from "../CampaignStudio";
import { CanvasToolbar } from "./CanvasToolbar";
import { ColorPicker } from "./ColorPicker";

interface CanvasEditorProps {
  template: Template;
  campaignData: CampaignData;
}

export const CanvasEditor: React.FC<CanvasEditorProps> = ({ 
  template, 
  campaignData 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const [activeObject, setActiveObject] = useState<fabric.Object | null>(null);
  const [selectedTool, setSelectedTool] = useState<string>("select");
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize Fabric.js canvas
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 600,
      height: 800,
      backgroundColor: "#ffffff",
      selection: true,
    });

    // Initialize with template content
    initializeTemplate(canvas);

    // Set up event listeners
    canvas.on("selection:created", (e: any) => {
      setActiveObject(e.target || e.selected?.[0]);
    });

    canvas.on("selection:updated", (e: any) => {
      setActiveObject(e.target || e.selected?.[0]);
    });

    canvas.on("selection:cleared", () => {
      setActiveObject(null);
    });

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, [template]);

  const initializeTemplate = (canvas: fabric.Canvas) => {
    // Create a sample template based on campaign data
    const platformDimensions = getPlatformDimensions(campaignData.platform);
    canvas.setDimensions(platformDimensions);

    // Add background
    const background = new fabric.Rect({
      left: 0,
      top: 0,
      width: platformDimensions.width,
      height: platformDimensions.height,
      fill: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      selectable: false,
      evented: false,
    });
    canvas.add(background);

    // Add campaign image if provided
    if (campaignData.uploadedImage) {
      fabric.Image.fromURL(campaignData.uploadedImage, (img) => {
        img.set({
          left: 50,
          top: 50,
          scaleX: 0.5,
          scaleY: 0.5,
        });
        canvas.add(img);
      });
    }

    // Add campaign text elements
    if (campaignData.headline || campaignData.primaryText) {
      const headline = new fabric.Text(campaignData.headline || campaignData.primaryText || "", {
        left: 50,
        top: campaignData.uploadedImage ? 300 : 150,
        fontSize: 32,
        fontWeight: "bold",
        fill: "#ffffff",
        fontFamily: "Arial",
        shadow: "2px 2px 4px rgba(0,0,0,0.3)"
      });
      canvas.add(headline);
    }

    // Add description if available
    if (campaignData.adDescription || campaignData.description) {
      const description = new fabric.Text(campaignData.adDescription || campaignData.description || "", {
        left: 50,
        top: campaignData.uploadedImage ? 400 : 250,
        fontSize: 16,
        fill: "#ffffff",
        fontFamily: "Arial",
        textAlign: "left",
        width: platformDimensions.width - 100,
      });
      canvas.add(description);
    }

    // Add CTA button for paid campaigns
    if (campaignData.type === "paid" && campaignData.callToAction) {
      const ctaButton = new fabric.Rect({
        left: 50,
        top: platformDimensions.height - 120,
        width: 200,
        height: 50,
        fill: "#ff6b6b",
        rx: 25,
        ry: 25,
      });

      const ctaText = new fabric.Text(campaignData.callToAction.replace("_", " ").toUpperCase(), {
        left: 150,
        top: platformDimensions.height - 107,
        fontSize: 16,
        fontWeight: "bold",
        fill: "#ffffff",
        fontFamily: "Arial",
        originX: "center",
        originY: "center",
      });

      canvas.add(ctaButton);
      canvas.add(ctaText);
    }

    canvas.renderAll();
  };

  const getPlatformDimensions = (platform: string) => {
    switch (platform) {
      case "instagram":
        return { width: 600, height: 600 }; // Square post
      case "facebook":
        return { width: 600, height: 315 }; // Landscape
      case "twitter":
        return { width: 600, height: 335 }; // Twitter post
      case "linkedin":
        return { width: 600, height: 315 }; // LinkedIn post
      default:
        return { width: 600, height: 600 };
    }
  };

  const handleToolSelect = (tool: string) => {
    setSelectedTool(tool);
    
    if (!fabricCanvas) return;

    switch (tool) {
      case "text":
        addText();
        break;
      case "rectangle":
        addRectangle();
        break;
      case "circle":
        addCircle();
        break;
      case "image":
        addImage();
        break;
      default:
        fabricCanvas.isDrawingMode = false;
    }
  };

  const addText = () => {
    if (!fabricCanvas) return;

    const text = new fabric.Text("Double click to edit", {
      left: 100,
      top: 100,
      fontSize: 24,
      fill: "#333333",
      fontFamily: "Arial",
    });

    fabricCanvas.add(text);
    fabricCanvas.setActiveObject(text);
  };

  const addRectangle = () => {
    if (!fabricCanvas) return;

    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      width: 150,
      height: 100,
      fill: "#3b82f6",
      stroke: "#1d4ed8",
      strokeWidth: 2,
    });

    fabricCanvas.add(rect);
    fabricCanvas.setActiveObject(rect);
  };

  const addCircle = () => {
    if (!fabricCanvas) return;

    const circle = new fabric.Circle({
      left: 100,
      top: 100,
      radius: 50,
      fill: "#ef4444",
      stroke: "#dc2626",
      strokeWidth: 2,
    });

    fabricCanvas.add(circle);
    fabricCanvas.setActiveObject(circle);
  };

  const addImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && fabricCanvas) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imgElement = new Image();
          imgElement.onload = () => {
            const fabricImage = new fabric.Image(imgElement, {
              left: 50,
              top: 50,
              scaleX: 0.5,
              scaleY: 0.5,
            });
            fabricCanvas.add(fabricImage);
            fabricCanvas.setActiveObject(fabricImage);
          };
          imgElement.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
      }
    };
    
    input.click();
  };

  const deleteObject = () => {
    if (fabricCanvas && activeObject) {
      fabricCanvas.remove(activeObject);
      setActiveObject(null);
    }
  };

  const downloadCanvas = () => {
    if (!fabricCanvas) return;
    
    const dataURL = fabricCanvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 2,
    });
    
    const link = document.createElement("a");
    link.download = `${campaignData.platform}-campaign.png`;
    link.href = dataURL;
    link.click();
  };

  const changeColor = (color: string) => {
    if (fabricCanvas && activeObject) {
      if (activeObject.type === "text") {
        (activeObject as fabric.Text).set("fill", color);
      } else {
        activeObject.set("fill", color);
      }
      fabricCanvas.renderAll();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <CanvasToolbar
        selectedTool={selectedTool}
        onToolSelect={handleToolSelect}
        onDelete={deleteObject}
        onDownload={downloadCanvas}
        hasActiveObject={!!activeObject}
        onColorPicker={() => setShowColorPicker(!showColorPicker)}
      />

      {/* Canvas Area */}
      <div className="flex-1 flex items-center justify-center p-4 bg-muted/20">
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="border border-border rounded-lg shadow-card bg-white"
          />
          
          {/* Color Picker Overlay */}
          {showColorPicker && activeObject && (
            <div className="absolute top-0 right-0 z-10">
              <ColorPicker
                color="#3b82f6"
                onChange={changeColor}
                onClose={() => setShowColorPicker(false)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Object Properties Panel */}
      {activeObject && (
        <Card className="m-4 bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Selected: {activeObject.type}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="border-border text-foreground"
              >
                <Palette className="w-4 h-4 mr-2" />
                Color
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={deleteObject}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};