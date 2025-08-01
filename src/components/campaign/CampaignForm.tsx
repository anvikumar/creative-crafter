import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Sparkles } from "lucide-react";
import { CampaignData } from "../CampaignStudio";

interface CampaignFormProps {
  onSubmit: (data: CampaignData) => void;
}

export const CampaignForm: React.FC<CampaignFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<Partial<CampaignData>>({
    type: "organic",
    platform: "instagram"
  });
  const [uploadedImage, setUploadedImage] = useState<string>("");

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedImage(result);
        setFormData(prev => ({ ...prev, uploadedImage: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.description && formData.platform && formData.type) {
      onSubmit(formData as CampaignData);
    }
  };

  return (
    <Card className="h-full bg-gradient-card border-border shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Sparkles className="w-5 h-5 text-primary" />
          Create Campaign
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="text-foreground">Campaign Image</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                {uploadedImage ? (
                  <img 
                    src={uploadedImage} 
                    alt="Uploaded" 
                    className="w-full h-32 object-cover rounded-lg mb-2"
                  />
                ) : (
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                )}
                <p className="text-sm text-muted-foreground">
                  {uploadedImage ? "Click to change image" : "Upload campaign image"}
                </p>
              </label>
            </div>
          </div>

          {/* Campaign Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">Campaign Description</Label>
            <Textarea
              id="description"
              placeholder="e.g., Summer sale campaign, New product launch..."
              value={formData.description || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              required
            />
          </div>

          {/* Campaign Type */}
          <div className="space-y-3">
            <Label className="text-foreground">Campaign Type</Label>
            <RadioGroup
              value={formData.type}
              onValueChange={(value: "organic" | "paid") => setFormData(prev => ({ ...prev, type: value }))}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="organic" id="organic" />
                <Label htmlFor="organic" className="text-foreground">Organic</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="paid" id="paid" />
                <Label htmlFor="paid" className="text-foreground">Paid</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Platform Selection */}
          <div className="space-y-2">
            <Label className="text-foreground">Platform</Label>
            <Select
              value={formData.platform}
              onValueChange={(value: "instagram" | "facebook" | "twitter" | "linkedin") => 
                setFormData(prev => ({ ...prev, platform: value }))
              }
            >
              <SelectTrigger className="bg-input border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dynamic Fields Based on Campaign Type */}
          {formData.type === "organic" ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="hashtags" className="text-foreground">Hashtags</Label>
                <Input
                  id="hashtags"
                  placeholder="#summer #sale #fashion"
                  value={formData.hashtags || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, hashtags: e.target.value }))}
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="primaryText" className="text-foreground">Primary Text</Label>
                <Textarea
                  id="primaryText"
                  placeholder="Main text for your post..."
                  value={formData.primaryText || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, primaryText: e.target.value }))}
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="websiteUrl" className="text-foreground">Website URL</Label>
                <Input
                  id="websiteUrl"
                  type="url"
                  placeholder="https://your-website.com"
                  value={formData.websiteUrl || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, websiteUrl: e.target.value }))}
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="callToAction" className="text-foreground">Call to Action</Label>
                <Select
                  value={formData.callToAction}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, callToAction: value }))}
                >
                  <SelectTrigger className="bg-input border-border text-foreground">
                    <SelectValue placeholder="Select CTA" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shop_now">Shop Now</SelectItem>
                    <SelectItem value="learn_more">Learn More</SelectItem>
                    <SelectItem value="sign_up">Sign Up</SelectItem>
                    <SelectItem value="download">Download</SelectItem>
                    <SelectItem value="contact_us">Contact Us</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="hashtags" className="text-foreground">Hashtags</Label>
                <Input
                  id="hashtags"
                  placeholder="#summer #sale #fashion"
                  value={formData.hashtags || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, hashtags: e.target.value }))}
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="primaryText" className="text-foreground">Primary Text</Label>
                <Textarea
                  id="primaryText"
                  placeholder="Main text for your ad..."
                  value={formData.primaryText || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, primaryText: e.target.value }))}
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="headline" className="text-foreground">Headline</Label>
                <Input
                  id="headline"
                  placeholder="Attention-grabbing headline"
                  value={formData.headline || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, headline: e.target.value }))}
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adDescription" className="text-foreground">Description</Label>
                <Textarea
                  id="adDescription"
                  placeholder="Additional ad description..."
                  value={formData.adDescription || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, adDescription: e.target.value }))}
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </>
          )}

          <Button 
            type="submit" 
            className="w-full bg-gradient-primary text-primary-foreground hover:shadow-glow transition-smooth"
          >
            Generate Templates
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};