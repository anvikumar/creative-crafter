import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  MousePointer2, 
  Type, 
  Square, 
  Circle, 
  Image as ImageIcon, 
  Download, 
  Undo, 
  Redo,
  Trash2,
  Palette
} from "lucide-react";

interface CanvasToolbarProps {
  selectedTool: string;
  onToolSelect: (tool: string) => void;
  onDelete: () => void;
  onDownload: () => void;
  hasActiveObject: boolean;
  onColorPicker: () => void;
}

export const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  selectedTool,
  onToolSelect,
  onDelete,
  onDownload,
  hasActiveObject,
  onColorPicker
}) => {
  const tools = [
    { id: "select", icon: MousePointer2, label: "Select" },
    { id: "text", icon: Type, label: "Add Text" },
    { id: "rectangle", icon: Square, label: "Rectangle" },
    { id: "circle", icon: Circle, label: "Circle" },
    { id: "image", icon: ImageIcon, label: "Add Image" },
  ];

  return (
    <div className="flex items-center gap-2 p-4 border-b border-border bg-gradient-card">
      {/* Selection Tools */}
      <div className="flex gap-1">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Button
              key={tool.id}
              variant={selectedTool === tool.id ? "default" : "ghost"}
              size="sm"
              onClick={() => onToolSelect(tool.id)}
              className={selectedTool === tool.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}
              title={tool.label}
            >
              <Icon className="w-4 h-4" />
            </Button>
          );
        })}
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Object Actions */}
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onColorPicker}
          disabled={!hasActiveObject}
          className="text-muted-foreground hover:text-foreground disabled:opacity-50"
          title="Change Color"
        >
          <Palette className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          disabled={!hasActiveObject}
          className="text-muted-foreground hover:text-destructive disabled:opacity-50"
          title="Delete Selected"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* History Actions */}
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1" />

      {/* Export */}
      <Button
        onClick={onDownload}
        className="bg-gradient-primary text-primary-foreground hover:shadow-glow transition-smooth"
        size="sm"
      >
        <Download className="w-4 h-4 mr-2" />
        Download
      </Button>
    </div>
  );
};