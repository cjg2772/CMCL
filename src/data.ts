import { type ContentItem } from './types'

export const defaultBackgrounds = [
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1618005198919-d3d4b5a92eee?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1400&q=80',
]

export const contentCatalog: Record<'mods' | 'resourcePacks' | 'shaders' | 'worlds', ContentItem[]> = {
  mods: [
    {
      id: 'sodium',
      name: 'Sodium',
      source: 'modrinth',
      versions: [
        {
          id: 'sodium-1.21-latest',
          title: 'Sodium 0.6.0',
          publishedAt: '2025-12-02',
          gameVersions: ['1.21'],
          compatibility: 'recommended',
          loaders: ['fabric', 'quilt'],
        },
        {
          id: 'sodium-1.20.4',
          title: 'Sodium 0.5.9',
          publishedAt: '2025-08-14',
          gameVersions: ['1.20.4'],
          compatibility: 'compatible',
          loaders: ['fabric', 'quilt'],
        },
        {
          id: 'sodium-1.19.2',
          title: 'Sodium 0.4.10',
          publishedAt: '2024-01-12',
          gameVersions: ['1.19.2'],
          compatibility: 'incompatible',
          loaders: ['fabric', 'quilt'],
        },
      ],
    },
    {
      id: 'optifine',
      name: 'OptiFine',
      source: 'curseforge',
      versions: [
        {
          id: 'optifine-1.21',
          title: 'OptiFine HD U M2',
          publishedAt: '2025-11-21',
          gameVersions: ['1.21'],
          compatibility: 'compatible',
          loaders: ['optifine'],
        },
        {
          id: 'optifine-1.20.6',
          title: 'OptiFine HD U L9',
          publishedAt: '2025-03-02',
          gameVersions: ['1.20.6'],
          compatibility: 'recommended',
          loaders: ['optifine'],
        },
        {
          id: 'optifine-1.19.4',
          title: 'OptiFine HD U I4',
          publishedAt: '2023-10-11',
          gameVersions: ['1.19.4'],
          compatibility: 'incompatible',
          loaders: ['optifine'],
        },
      ],
    },
  ],
  resourcePacks: [
    {
      id: 'faithful',
      name: 'Faithful 32x',
      source: 'curseforge',
      versions: [
        {
          id: 'faithful-1.21',
          title: 'Faithful 32x 1.21',
          publishedAt: '2025-07-19',
          gameVersions: ['1.21'],
          compatibility: 'recommended',
          loaders: ['vanilla', 'forge', 'neoforge', 'fabric', 'quilt'],
        },
        {
          id: 'faithful-1.20.4',
          title: 'Faithful 32x 1.20.4',
          publishedAt: '2024-09-05',
          gameVersions: ['1.20.4'],
          compatibility: 'compatible',
          loaders: ['vanilla', 'forge', 'neoforge', 'fabric', 'quilt'],
        },
      ],
    },
  ],
  shaders: [
    {
      id: 'iris',
      name: 'Iris + Complimentary Reimagined',
      source: 'modrinth',
      versions: [
        {
          id: 'iris-1.21',
          title: 'Iris 1.8.0 + CR 1.4.2',
          publishedAt: '2025-09-13',
          gameVersions: ['1.21'],
          compatibility: 'recommended',
          loaders: ['fabric', 'quilt'],
        },
        {
          id: 'iris-1.20.1',
          title: 'Iris 1.7.0 + CR 1.3.5',
          publishedAt: '2024-05-01',
          gameVersions: ['1.20.1'],
          compatibility: 'compatible',
          loaders: ['fabric', 'quilt'],
        },
      ],
    },
  ],
  worlds: [
    {
      id: 'skylands',
      name: 'Skylands Survival',
      source: 'curseforge',
      versions: [
        {
          id: 'skylands-1.21',
          title: 'Skylands 1.21',
          publishedAt: '2025-06-30',
          gameVersions: ['1.21'],
          compatibility: 'recommended',
          loaders: ['vanilla'],
        },
        {
          id: 'skylands-1.20.2',
          title: 'Skylands 1.20.2',
          publishedAt: '2024-03-22',
          gameVersions: ['1.20.2'],
          compatibility: 'compatible',
          loaders: ['vanilla'],
        },
      ],
    },
  ],
}
