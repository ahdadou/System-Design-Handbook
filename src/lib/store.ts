import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface LearningStore {
  completedTopics: string[];
  quizScores: Record<string, number>;
  darkMode: boolean;
  sidebarOpen: boolean;
  markComplete: (slug: string) => void;
  markIncomplete: (slug: string) => void;
  setQuizScore: (slug: string, score: number) => void;
  getChapterProgress: (chapter: number) => number;
  getOverallProgress: () => number;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleDarkMode: () => void;
}

// Topic counts per chapter
const CHAPTER_TOPIC_COUNTS = [12, 15, 12, 10, 6];

const CHAPTER_TOPIC_SLUGS: Record<number, string[]> = {
  1: [
    'ip-addresses', 'osi-model', 'tcp-and-udp', 'dns',
    'load-balancing', 'clustering', 'caching', 'cdn',
    'proxy', 'availability', 'scalability', 'storage'
  ],
  2: [
    'databases-and-dbms', 'sql-databases', 'nosql-databases', 'sql-vs-nosql',
    'database-replication', 'indexes', 'normalization-and-denormalization',
    'acid-and-base', 'cap-theorem', 'pacelc-theorem', 'transactions',
    'distributed-transactions', 'sharding', 'consistent-hashing', 'database-federation'
  ],
  3: [
    'n-tier-architecture', 'message-brokers', 'message-queues', 'publish-subscribe',
    'enterprise-service-bus', 'monoliths-and-microservices', 'event-driven-architecture',
    'event-sourcing', 'cqrs', 'api-gateway', 'rest-graphql-grpc', 'long-polling-websockets-sse'
  ],
  4: [
    'geohashing-and-quadtrees', 'circuit-breaker', 'rate-limiting', 'service-discovery',
    'sla-slo-sli', 'disaster-recovery', 'virtual-machines-vs-containers',
    'oauth-and-openid', 'single-sign-on', 'ssl-tls-mtls'
  ],
  5: [
    'system-design-interview-tips', 'url-shortener', 'whatsapp', 'twitter', 'netflix', 'uber'
  ],
};

export const useLearningStore = create<LearningStore>()(
  persist(
    (set, get) => ({
      completedTopics: [],
      quizScores: {},
      darkMode: true,
      sidebarOpen: true,

      markComplete: (slug: string) => {
        set((state) => ({
          completedTopics: state.completedTopics.includes(slug)
            ? state.completedTopics
            : [...state.completedTopics, slug],
        }));
      },

      markIncomplete: (slug: string) => {
        set((state) => ({
          completedTopics: state.completedTopics.filter((t) => t !== slug),
        }));
      },

      setQuizScore: (slug: string, score: number) => {
        set((state) => ({
          quizScores: { ...state.quizScores, [slug]: score },
        }));
      },

      getChapterProgress: (chapter: number) => {
        const { completedTopics } = get();
        const slugs = CHAPTER_TOPIC_SLUGS[chapter] || [];
        if (slugs.length === 0) return 0;
        const completed = slugs.filter((s) => completedTopics.includes(s)).length;
        return Math.round((completed / slugs.length) * 100);
      },

      getOverallProgress: () => {
        const { completedTopics } = get();
        const total = Object.values(CHAPTER_TOPIC_SLUGS).flat().length;
        if (total === 0) return 0;
        return Math.round((completedTopics.length / total) * 100);
      },

      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }));
      },

      setSidebarOpen: (open: boolean) => {
        set({ sidebarOpen: open });
      },

      toggleDarkMode: () => {
        set((state) => ({ darkMode: !state.darkMode }));
      },

    }),
    {
      name: 'system-design-academy',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export { CHAPTER_TOPIC_SLUGS };
