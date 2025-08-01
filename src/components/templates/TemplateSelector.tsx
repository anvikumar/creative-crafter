import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, Check } from "lucide-react";
import { Template, CampaignData } from "../CampaignStudio";

interface TemplateSelectorProps {
  templates: Template[];
  isGenerating: boolean;
  onTemplateSelect: (template: Template) => void;
  campaignData: CampaignData;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  templates,
  isGenerating,
  onTemplateSelect,
  campaignData
}) => {
  return (
    <Card className="h-full bg-gradient-card border-border shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Sparkles className="w-5 h-5 text-primary" />
          Template Selection
        </CardTitle>
        <div className="flex gap-2">
          <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
            {campaignData.type}
          </Badge>
          <Badge variant="outline" className="border-border text-foreground">
            {campaignData.platform}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="overflow-y-auto">
        {isGenerating ? (
          <div className="space-y-4">
            <div className="text-center py-4">
              <div className="w-8 h-8 rounded-full bg-gradient-primary mx-auto mb-3 flex items-center justify-center animate-pulse">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                AI is generating custom templates for your campaign...
              </p>
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="w-full h-40 rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-4">
            {templates.map((template) => (
              <div
                key={template.id}
                className="group cursor-pointer"
                onClick={() => onTemplateSelect(template)}
              >
                <div className="relative overflow-hidden rounded-lg border border-border bg-card hover:border-primary transition-colors">
                  <div className="aspect-[4/5] relative">
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        size="sm" 
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Select Template
                      </Button>
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium text-foreground">{template.name}</h4>
                    <p className="text-xs text-muted-foreground capitalize">
                      {template.category} template
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};