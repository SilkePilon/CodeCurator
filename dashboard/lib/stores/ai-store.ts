import { create } from "zustand"
import { persist } from "zustand/middleware"

export type AIModel = "OpenAI GPT-4o" | "Anthropic Claude 3" | "Google Gemini Pro" | "Mistral Large"

interface AIState {
  activeModel: AIModel
  availableModels: AIModel[]
  setActiveModel: (model: AIModel) => void
}

export const useAIStore = create<AIState>()(
  persist(
    (set) => ({
      activeModel: "OpenAI GPT-4o",
      availableModels: ["OpenAI GPT-4o", "Anthropic Claude 3", "Google Gemini Pro", "Mistral Large"],
      setActiveModel: (model) => set({ activeModel: model }),
    }),
    {
      name: "ai-settings",
    },
  ),
)

