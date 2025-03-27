"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { BrainCircuitIcon, SendIcon } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useAIStore } from "@/lib/stores/ai-store"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function AIAssistantDialog() {
  const [open, setOpen] = React.useState(false)
  const [input, setInput] = React.useState("")
  const [messages, setMessages] = React.useState<Message[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const { activeModel } = useAIStore()

  const handleSend = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponse: Message = {
        role: "assistant",
        content: getAIResponse(input),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsLoading(false)
    }, 1500)
  }

  const getAIResponse = (query: string): string => {
    // Simple response generation based on query
    if (query.toLowerCase().includes("hello") || query.toLowerCase().includes("hi")) {
      return "Hello! How can I help you today?"
    }

    if (query.toLowerCase().includes("repository") || query.toLowerCase().includes("repo")) {
      return "I can help you with repository management. Would you like to see your repositories, create a new one, or check the status of existing ones?"
    }

    if (query.toLowerCase().includes("issue") || query.toLowerCase().includes("bug")) {
      return "I can help you manage issues. Would you like to create a new issue, view existing ones, or get suggestions for resolving them?"
    }

    if (
      query.toLowerCase().includes("pull request") ||
      query.toLowerCase().includes("pr") ||
      query.toLowerCase().includes("merge")
    ) {
      return "I can assist with pull requests. Would you like to create a new PR, review existing ones, or get help with merge conflicts?"
    }

    return "I'm here to help with your development workflow. You can ask me about repositories, issues, pull requests, or any other development-related questions."
  }

  // Scroll to bottom when messages change
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="relative h-9 w-auto hidden md:flex">
          <BrainCircuitIcon className="mr-2 h-4 w-4" />
          Ask AI Assistant
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] md:max-w-[700px] h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BrainCircuitIcon className="h-5 w-5" />
            AI Assistant
            <Badge variant="outline" className="ml-2">
              Using {activeModel}
            </Badge>
          </DialogTitle>
          <DialogDescription>Ask me anything about your repositories, issues, or pull requests.</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 border rounded-md my-4">
          <AnimatePresence>
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full text-center text-muted-foreground"
              >
                <BrainCircuitIcon className="h-12 w-12 mb-4 opacity-20" />
                <p>No messages yet. Ask me anything about your development workflow!</p>
              </motion.div>
            ) : (
              messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 ${message.role === "assistant" ? "" : "justify-end"}`}
                >
                  {message.role === "assistant" && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`rounded-lg p-3 max-w-[80%] ${
                      message.role === "assistant" ? "bg-muted" : "bg-primary text-primary-foreground"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  {message.role === "user" && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>ME</AvatarFallback>
                    </Avatar>
                  )}
                </motion.div>
              ))
            )}
            {isLoading && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div className="rounded-lg p-3 bg-muted">
                  <div className="flex space-x-2">
                    <div className="h-2 w-2 rounded-full bg-foreground/30 animate-bounce [animation-delay:0.2s]"></div>
                    <div className="h-2 w-2 rounded-full bg-foreground/30 animate-bounce [animation-delay:0.4s]"></div>
                    <div className="h-2 w-2 rounded-full bg-foreground/30 animate-bounce [animation-delay:0.6s]"></div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </AnimatePresence>
        </div>

        <DialogFooter className="flex-shrink-0">
          <div className="flex w-full gap-2">
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={handleSend} disabled={!input.trim() || isLoading}>
              <SendIcon className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

