import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  onClose: () => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  color,
  onChange,
  onClose
}) => {
  const [selectedColor, setSelectedColor] = useState(color);

  const presetColors = [
    "#000000", "#ffffff", "#ff0000", "#00ff00", "#0000ff",
    "#ffff00", "#ff00ff", "#00ffff", "#ff6b6b", "#4ecdc4",
    "#45b7d1", "#96ceb4", "#ffeaa7", "#dda0dd", "#98d8c8",
    "#f7dc6f", "#bb8fce", "#85c1e9", "#f8c471", "#82e0aa"
  ];

  const handleColorChange = (newColor: string) => {
    setSelectedColor(newColor);
    onChange(newColor);
  };

  return (
    <Card className="w-64 bg-gradient-card border-border shadow-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm text-foreground">Color Picker</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Color Input */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              type="color"
              value={selectedColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-12 h-8 p-0 border-border"
            />
            <Input
              type="text"
              value={selectedColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className="flex-1 bg-input border-border text-foreground"
              placeholder="#000000"
            />
          </div>
        </div>

        {/* Preset Colors */}
        <div>
          <p className="text-xs text-muted-foreground mb-2">Preset Colors</p>
          <div className="grid grid-cols-5 gap-1">
            {presetColors.map((presetColor) => (
              <button
                key={presetColor}
                onClick={() => handleColorChange(presetColor)}
                className={`w-8 h-8 rounded border-2 transition-all hover:scale-110 ${
                  selectedColor === presetColor
                    ? "border-primary shadow-glow"
                    : "border-border"
                }`}
                style={{ backgroundColor: presetColor }}
                title={presetColor}
              />
            ))}
          </div>
        </div>

        {/* Current Color Preview */}
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded border border-border"
            style={{ backgroundColor: selectedColor }}
          />
          <span className="text-xs text-muted-foreground">Current: {selectedColor}</span>
        </div>
      </CardContent>
    </Card>
  );
};