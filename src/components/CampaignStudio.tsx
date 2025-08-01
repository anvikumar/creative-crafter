import React, { useState } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ChatInterface } from "./chat/ChatInterface";
import { CanvasEditor } from "./canvas/CanvasEditor";
import { CampaignForm } from "./campaign/CampaignForm";
import { TemplateSelector } from "./templates/TemplateSelector";
import { Sparkles } from "lucide-react";

export interface CampaignData {
  type: "organic" | "paid";
  platform: "instagram" | "facebook" | "twitter" | "linkedin";
  description: string;
  hashtags: string;
  primaryText: string;
  websiteUrl?: string;
  callToAction?: string;
  headline?: string;
  adDescription?: string;
  uploadedImage?: string;
}

export interface Template {
  id: string;
  name: string;
  thumbnail: string;
  fabricData: any;
  category: string;
}

export const CampaignStudio: React.FC = () => {
  const [campaignData, setCampaignData] = useState<CampaignData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCampaignSubmit = async (data: CampaignData) => {
    setCampaignData(data);
    setIsGenerating(true);
    
    // Generate templates based on campaign data
    // This would integrate with AI service
    setTimeout(() => {
      const mockTemplates: Template[] = [
        {
          id: "1",
          name: "Bold Gradient",
          thumbnail: "https://images.unsplash.com/photo-1611262588024-d12430b98920?w=300&h=400&fit=crop",
          fabricData: null,
          category: data.platform
        },
        {
          id: "2", 
          name: "Minimalist Clean",
          thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=400&fit=crop",
          fabricData: null,
          category: data.platform
        },
        {
          id: "3",
          name: "Dynamic Layout",
          thumbnail: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=400&fit=crop", 
          fabricData: null,
          category: data.platform
        },
        {
          id: "4",
          name: "Creative Splash",
          thumbnail: "https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?w=300&h=400&fit=crop",
          fabricData: null, 
          category: data.platform
        },
        {
          id: "5",
          name: "Professional Focus",
          thumbnail: "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=300&h=400&fit=crop",
          fabricData: null,
          category: data.platform
        }
      ];
      setTemplates(mockTemplates);
      setIsGenerating(false);
    }, 2000);
  };

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-gradient-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">AI Campaign Studio</h1>
              <p className="text-sm text-muted-foreground">Create stunning marketing campaigns with AI</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="container mx-auto p-4 h-[calc(100vh-88px)]">
        <ResizablePanelGroup direction="horizontal" className="min-h-full">
          {/* Left Sidebar - Chat & Campaign Form */}
          <ResizablePanel defaultSize={30} minSize={25} maxSize={40}>
            <div className="h-full flex flex-col gap-4">
              {!campaignData ? (
                <CampaignForm onSubmit={handleCampaignSubmit} />
              ) : !selectedTemplate ? (
                <TemplateSelector 
                  templates={templates}
                  isGenerating={isGenerating}
                  onTemplateSelect={handleTemplateSelect}
                  campaignData={campaignData}
                />
              ) : (
                <ChatInterface 
                  campaignData={campaignData}
                  selectedTemplate={selectedTemplate}
                />
              )}
            </div>
          </ResizablePanel>

          <ResizableHandle />

          {/* Main Canvas Area */}
          <ResizablePanel defaultSize={70}>
            <div className="h-full bg-gradient-card rounded-lg border border-border overflow-hidden">
              {selectedTemplate ? (
                <CanvasEditor 
                  template={selectedTemplate}
                  campaignData={campaignData}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-center">
                  <div className="space-y-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-primary mx-auto flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">Ready to Create</h3>
                      <p className="text-muted-foreground">
                        {!campaignData 
                          ? "Fill out the campaign form to get started"
                          : "Select a template to begin editing"
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};