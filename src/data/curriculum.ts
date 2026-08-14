export interface SectionMeta {
  id: string;
  label: string;
  icon: string;
  topicCount: number;
  description: string;
}

export const SECTIONS: SectionMeta[] = [
  {
    id: 'fundamentals',
    label: 'Fundamentals',
    icon: '🧱',
    topicCount: 6,
    description: 'Core concepts every software engineer must know',
  },
  {
    id: 'building-blocks',
    label: 'Building Blocks',
    icon: '⚙️',
    topicCount: 10,
    description: 'The components that power real-world systems',
  },
  {
    id: 'patterns',
    label: 'Design Patterns',
    icon: '🔧',
    topicCount: 8,
    description: 'Advanced techniques for scalable architecture',
  },
  {
    id: 'case-studies',
    label: 'Case Studies',
    icon: '📐',
    topicCount: 10,
    description: 'Design real systems like a senior engineer',
  },
  {
    id: 'interview-prep',
    label: 'Interview Prep',
    icon: '🎯',
    topicCount: 4,
    description: 'Ace your system design interview',
  },
];

export const TOTAL_TOPICS = 38;
