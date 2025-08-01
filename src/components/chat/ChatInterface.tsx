import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { Template, CampaignData } from "../CampaignStudio";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface ChatInterfaceProps {
  campaignData: CampaignData;
  selectedTemplate: Template;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  campaignData,
  selectedTemplate
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: `Great choice! I've loaded the "${selectedTemplate.name}" template for your ${campaignData.type} ${campaignData.platform} campaign. I can help you edit text, move elements, change colors, add new components, or make any other adjustments to perfect your design. What would you like to modify?`,
      role: "assistant",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getAIResponse(inputValue),
        role: "assistant",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getAIResponse = (userInput: string) => {
    const input = userInput.toLowerCase();
    
    if (input.includes("text") || input.includes("change") || input.includes("edit")) {
      return "I can help you edit any text in your design! You can click on any text element in the canvas to edit it directly, or tell me specifically what text you'd like to change and what you want it to say.";
    }
    
    if (input.includes("color") || input.includes("background")) {
      return "I'll help you adjust the colors! You can select any element and I'll change its color, or specify what colors you'd like to use for your campaign theme.";
    }
    
    if (input.includes("move") || input.includes("position")) {
      return "You can drag and drop any element to reposition it, or tell me how you'd like to rearrange the layout and I'll make those adjustments for you.";
    }
    
    if (input.includes("add") || input.includes("new")) {
      return "I can add new elements like text boxes, shapes, icons, or even additional images. What would you like to add to your design?";
    }
    
    return "I'm here to help you perfect your campaign design! You can ask me to modify text, change colors, move elements, add new components, or make any other adjustments. What specific changes would you like to make?";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="h-full bg-gradient-card border-border shadow-card flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Bot className="w-5 h-5 text-primary" />
          AI Assistant
        </CardTitle>
        <div className="flex gap-2">
          <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
            {selectedTemplate.name}
          </Badge>
          <Badge variant="outline" className="border-border text-foreground">
            {campaignData.platform}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col min-h-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
              
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
              
              {message.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-primary-foreground animate-pulse" />
              </div>
              <div className="bg-secondary text-secondary-foreground rounded-lg p-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input */}
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me to edit your design..."
            className="bg-input border-border text-foreground placeholder:text-muted-foreground"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="bg-gradient-primary text-primary-foreground hover:shadow-glow transition-smooth"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};