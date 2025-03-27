import { create } from "zustand"
import { persist } from "zustand/middleware"

interface APIKeysState {
  githubApiKey: string | null
  gitlabApiKey: string | null
  githubApiKeyVerified: boolean
  gitlabApiKeyVerified: boolean
  setGithubApiKey: (key: string | null) => void
  setGitlabApiKey: (key: string | null) => void
  setGithubApiKeyVerified: (verified: boolean) => void
  setGitlabApiKeyVerified: (verified: boolean) => void
  dataLoaded: boolean
  setDataLoaded: (loaded: boolean) => void
}

export const useAPIKeysStore = create<APIKeysState>()(
  persist(
    (set) => ({
      githubApiKey: null,
      gitlabApiKey: null,
      githubApiKeyVerified: false,
      gitlabApiKeyVerified: false,
      dataLoaded: false,
      setGithubApiKey: (key) => set({ githubApiKey: key }),
      setGitlabApiKey: (key) => set({ gitlabApiKey: key }),
      setGithubApiKeyVerified: (verified) => set({ githubApiKeyVerified: verified }),
      setGitlabApiKeyVerified: (verified) => set({ gitlabApiKeyVerified: verified }),
      setDataLoaded: (loaded) => set({ dataLoaded: loaded }),
    }),
    {
      name: "api-keys",
    },
  ),
)

