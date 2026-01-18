'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  FileText,
  Film,
  Image as ImageIcon,
  Play,
  Plus,
  Trash2,
  ChevronRight,
  BookOpen,
  Clock,
  MapPin,
  User,
  Loader2,
  Check,
  Download,
  RefreshCw,
  Video,
  Clapperboard,
  DollarSign,
  Save,
  CloudOff,
  Cloud
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Project ID for persistence
const PROJECT_ID = 'edgar-tekere-documentary';

// Pre-loaded research for Edgar Tekere
const EDGAR_TEKERE_RESEARCH = {
  subject: 'Edgar "Twoboy" Tekere',
  dates: '1 April 1937 – 7 June 2011',
  summary: 'Zimbabwean liberation hero who co-founded ZANU, spent 10 years in prison with Robert Mugabe, walked to Mozambique to continue the armed struggle, then became disillusioned with corruption and formed the opposition Zimbabwe Unity Movement (ZUM).',
  timeline: [
    { year: '1937', event: 'Born near Rusape, Manicaland. Son of Anglican pastor.' },
    { year: '1963', event: 'Co-founded Zimbabwe African National Union (ZANU) with Robert Mugabe and others.' },
    { year: '1964', event: 'Arrested by Rhodesian colonial government. Sent to Hwa Hwa Prison.' },
    { year: '1964-1974', event: '10 years imprisoned with Robert Mugabe. They bonded as comrades.' },
    { year: '1974', event: 'Released from prison. Walked on foot to Mozambique with Mugabe to continue liberation war.' },
    { year: '1975-1979', event: 'Served on ZANU High Command (Dare reChimurenga). Led guerrilla operations.' },
    { year: '1979', event: 'Led ZANU delegation at Lancaster House talks. Invited Bob Marley to independence celebrations.' },
    { year: '1980', event: 'Zimbabwe independence. Became Minister of Manpower Planning.' },
    { year: '1988', event: 'Expelled from ZANU-PF for criticizing corruption. Called one-party state "evil".' },
    { year: '1990', event: 'Founded Zimbabwe Unity Movement (ZUM). Challenged Mugabe in presidential election, got 17%.' },
    { year: '2000s', event: 'Lived in obscurity. Health declined. Financial hardship.' },
    { year: '2011', event: 'Died of prostate cancer at 74. Declared national hero. Buried at Heroes Acre against his wishes.' },
  ],
  quotes: [
    '"A one-party state was never one of the founding principles of ZANU-PF. Experience in Africa has shown that it brought the evils of nepotism, corruption and inefficiency."',
    '"I do not want to be buried among thieves and killers." (His last wish, ignored by ZANU-PF)',
  ],
  sources: [
    { name: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Edgar_Tekere' },
    { name: 'Pindula', url: 'https://www.pindula.co.zw/Edgar_Tekere' },
    { name: 'The Scotsman Obituary', url: 'https://www.scotsman.com/news/obituaries/obituary-edgar-zivanai-tekere-zimbabwean-liberation-war-icon-1672914' },
  ]
};

// Pre-defined scenes for the story
const INITIAL_SCENES: Scene[] = [
  {
    id: '1',
    title: 'Birth of a Revolutionary',
    narration: 'In 1937, in the hills near Rusape, Edgar Tekere was born. The son of an Anglican pastor, he would grow to question not just colonial rule, but eventually his own comrades.',
    imagePrompt: 'Dramatic documentary style image: Rural African village in Zimbabwe, 1930s. Thatched huts on rolling hills. Anglican mission church in background. Sepia-toned, cinematic lighting. Faceless mannequin-style figure of a young boy standing alone, looking toward distant mountains. Atmospheric, nostalgic mood.',
    imageUrl: null,
    videoPrompt: 'Cinematic documentary footage: Rural African village in Zimbabwe, 1930s aesthetic. Camera slowly pans across thatched huts on rolling hills. Morning mist rising. Anglican mission church bell tower visible in distance. A faceless mannequin-style young boy figure walks slowly toward the horizon. Sepia-toned color grading. Atmospheric, nostalgic mood. Ken Burns style gentle zoom.',
    videoUrl: null,
    duration: 12,
  },
  {
    id: '2',
    title: 'The Prison Years',
    narration: 'For ten long years, Tekere and Mugabe shared a cell in Hwa Hwa Prison. In that darkness, they dreamed of a free Zimbabwe. They could not know that their paths would one day diverge so violently.',
    imagePrompt: 'Documentary cinematic image: Dark prison cell interior, harsh shadows from barred window. Two faceless mannequin-style figures in prison uniforms sitting on concrete floor, planning together. Papers with maps scattered between them. Dramatic chiaroscuro lighting. Rhodesian colonial prison 1960s. Gritty, tense atmosphere.',
    imageUrl: null,
    videoPrompt: 'Dramatic documentary footage: Dark prison cell interior, 1960s Rhodesia. Harsh light streaming through barred window creates moving shadows. Two faceless mannequin-style figures in prison uniforms sit on concrete floor, gesturing as they plan. Papers with maps between them. Camera slowly orbits around them. Dust particles floating in light beams. Chiaroscuro lighting. Tense, conspiratorial atmosphere.',
    videoUrl: null,
    duration: 15,
  },
  {
    id: '3',
    title: 'The Walk to Freedom',
    narration: 'In 1974, released but not free, Tekere and Mugabe made an extraordinary decision. They walked across the border into Mozambique to join the armed struggle. Two men, one dream.',
    imagePrompt: 'Epic documentary image: Two faceless mannequin-style figures walking through African bush at dawn. Silhouettes against orange sunrise. Carrying small bags. Mountains of Mozambique in distance. Cinematic wide shot. Determined postures. Dust on their clothes. Freedom fighters 1970s Africa. Atmospheric, heroic mood.',
    imageUrl: null,
    videoPrompt: 'Epic cinematic footage: Wide shot of two faceless mannequin-style figures walking through African savanna at golden hour. Silhouettes against dramatic orange sunrise. Tall grass swaying in wind. Mountains of Mozambique visible in distance. Camera tracks alongside them in slow motion. Dust kicked up by their footsteps. 1970s documentary aesthetic. Heroic, determined mood. Atmospheric lens flares.',
    videoUrl: null,
    duration: 14,
  },
  {
    id: '4',
    title: 'Independence Day',
    narration: 'April 18, 1980. Zimbabwe was born. Tekere had invited Bob Marley himself to play at the celebrations. It was the greatest triumph of his life.',
    imagePrompt: 'Documentary celebration image: Massive crowd at stadium, Zimbabwe independence 1980. Faceless mannequin figures in crowd celebrating, arms raised. Zimbabwean flags waving. Stage in background. Confetti in air. Night scene with dramatic stadium lights. Joy and triumph atmosphere. Historic moment.',
    imageUrl: null,
    videoPrompt: 'Euphoric documentary footage: Massive stadium celebration, Zimbabwe independence 1980. Crowd of faceless mannequin figures cheering with arms raised. Zimbabwean flags waving throughout. Confetti falling. Camera sweeps across ecstatic crowd in slow motion. Stadium lights creating dramatic beams. Stage visible in background. Night scene. Pure joy and triumph atmosphere. Historic moment captured.',
    videoUrl: null,
    duration: 12,
  },
  {
    id: '5',
    title: 'The Breaking Point',
    narration: 'But Tekere saw what others chose to ignore. Corruption spreading like a cancer. Comrades enriching themselves. The dream rotting from within. He could not stay silent.',
    imagePrompt: 'Tense documentary image: Faceless mannequin figure in suit standing alone in government office. Other faceless figures in background counting money, looking corrupt. Stark contrast between lone figure and group. 1980s Zimbabwe. Dark mood, dramatic shadows. Moral isolation theme.',
    imageUrl: null,
    videoPrompt: 'Tense documentary footage: Government office 1980s Zimbabwe. Single faceless mannequin figure in suit stands isolated, looking troubled. Behind glass partition, other faceless figures visible counting stacks of money, corrupt gestures. Camera slowly pushes in on isolated figure. Contrast between moral integrity and corruption. Dark shadows, moody lighting. Slow realization and disgust on the lone figure.',
    videoUrl: null,
    duration: 14,
  },
  {
    id: '6',
    title: 'The Challenge',
    narration: '1990. Edgar Tekere did the unthinkable. He formed the Zimbabwe Unity Movement and challenged Mugabe for the presidency. 17 percent voted for him despite the intimidation.',
    imagePrompt: 'Political documentary image: Faceless mannequin figure giving speech at rally. Crowd of supporters with ZUM banners. Opposition campaign 1990s Zimbabwe. Determined posture despite small crowd. Armed soldiers visible in background watching. Tension between hope and threat. Cinematic lighting.',
    imageUrl: null,
    videoPrompt: 'Documentary political footage: 1990s Zimbabwe opposition rally. Faceless mannequin figure on makeshift stage giving passionate speech, gesturing powerfully. Modest but devoted crowd holding ZUM banners. Armed soldiers visible watching from perimeter, menacing presence. Camera captures both hope of supporters and threat of authorities. Dust and heat visible. Determined defiance against intimidation.',
    videoUrl: null,
    duration: 13,
  },
  {
    id: '7',
    title: 'Final Days',
    narration: 'He died in 2011, in pain, in poverty. His last wish was simple: do not bury me among thieves and killers. ZANU-PF ignored him. They buried him at Heroes Acre anyway.',
    imagePrompt: 'Somber documentary image: Single faceless mannequin figure lying in simple hospital bed. Sparse room, minimal furniture. Window showing Zimbabwe landscape outside. Evening light. Lonely, dignified death. Medical equipment. Poignant, respectful mood. 2011 setting.',
    imageUrl: null,
    videoPrompt: 'Poignant documentary footage: Simple hospital room, 2011. Single faceless mannequin figure lies in bed, peaceful but frail. Sparse furnishings speak to poverty. Soft evening light streams through window showing Zimbabwe landscape. Camera slowly pulls back. Medical equipment beeping softly. Dignified solitude. A life of principle ending in quiet obscurity. Respectful, somber mood.',
    videoUrl: null,
    duration: 15,
  },
  {
    id: '8',
    title: 'Legacy',
    narration: 'Edgar Twoboy Tekere. He walked into prison with Mugabe. He walked to war with Mugabe. And when he saw what Mugabe had become, he walked away. Some called him a traitor. History may call him a prophet.',
    imagePrompt: 'Memorial documentary image: Empty chair in spotlight, representing absence. Old photograph on the chair showing silhouette of man. Zimbabwe flag draped nearby. Heroes Acre grave site visible through window. Reflective, contemplative mood. Legacy and memory theme. Cinematic lighting.',
    imageUrl: null,
    videoPrompt: 'Contemplative documentary footage: Empty chair illuminated by single spotlight in dark room. Old sepia photograph resting on the chair shows silhouette of a man. Zimbabwe flag draped nearby, gently moving in breeze. Through window, Heroes Acre grave site visible at dusk. Camera slowly orbits the scene. Dust motes floating in light. Memorial, legacy, memory. History being reconsidered.',
    videoUrl: null,
    duration: 16,
  },
];

interface Scene {
  id: string;
  title: string;
  narration: string;
  imagePrompt: string;
  imageUrl: string | null;
  imagePath?: string | null;  // Server path for persistence
  videoPrompt: string;
  videoUrl: string | null;
  videoPath?: string | null;  // Server path for persistence
  duration: number;
}

type TabType = 'research' | 'scenes' | 'preview';

export default function JournalistStudio() {
  const [activeTab, setActiveTab] = useState<TabType>('research');
  const [scenes, setScenes] = useState<Scene[]>(INITIAL_SCENES);
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null);
  const [generating, setGenerating] = useState<string | null>(null);
  const [generatingVideo, setGeneratingVideo] = useState<string | null>(null);
  const [characterStyle, setCharacterStyle] = useState('faceless-mannequin');
  const [videoCostEstimate, setVideoCostEstimate] = useState<{totalCost: number; totalDuration: number} | null>(null);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved' | 'error'>('unsaved');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load project on mount
  useEffect(() => {
    loadProject();
  }, []);

  // Auto-save when scenes change (debounced)
  useEffect(() => {
    if (!isLoaded) return; // Don't save on initial load

    const timer = setTimeout(() => {
      saveProject();
    }, 2000); // Save 2 seconds after last change

    return () => clearTimeout(timer);
  }, [scenes, isLoaded]);

  const loadProject = async () => {
    try {
      const response = await fetch(`${API_URL}/api/journalist/projects/${PROJECT_ID}`);
      if (response.ok) {
        const project = await response.json();
        if (project.scenes && project.scenes.length > 0) {
          // Merge saved data with defaults (in case we added new scenes)
          const mergedScenes = INITIAL_SCENES.map(initial => {
            const saved = project.scenes.find((s: Scene) => s.id === initial.id);
            return saved ? { ...initial, ...saved } : initial;
          });
          setScenes(mergedScenes);
          console.log('[Journalist] Loaded project with', project.scenes.length, 'scenes');
          setSaveStatus('saved');
        }
      } else {
        // Create new project
        await createProject();
      }
    } catch (err) {
      console.log('[Journalist] No saved project found, using defaults');
      await createProject();
    }
    setIsLoaded(true);
  };

  const createProject = async () => {
    try {
      await fetch(`${API_URL}/api/journalist/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: PROJECT_ID,
          name: 'Edgar Tekere Documentary',
          subject: EDGAR_TEKERE_RESEARCH.subject,
          scenes: INITIAL_SCENES,
          research: EDGAR_TEKERE_RESEARCH
        })
      });
      console.log('[Journalist] Created new project');
    } catch (err) {
      console.error('[Journalist] Failed to create project:', err);
    }
  };

  const saveProject = async () => {
    setSaveStatus('saving');
    try {
      const response = await fetch(`${API_URL}/api/journalist/projects/${PROJECT_ID}/scenes`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenes })
      });

      if (response.ok) {
        const data = await response.json();
        // Update scenes with persisted URLs (base64 converted to file paths)
        if (data.project?.scenes) {
          setScenes(data.project.scenes);
        }
        setSaveStatus('saved');
        console.log('[Journalist] Project saved');
      } else {
        setSaveStatus('error');
      }
    } catch (err) {
      console.error('[Journalist] Failed to save:', err);
      setSaveStatus('error');
    }
  };

  const generateImage = async (sceneId: string) => {
    const scene = scenes.find(s => s.id === sceneId);
    if (!scene) return;

    setGenerating(sceneId);

    try {
      const response = await fetch(`${API_URL}/api/images/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: scene.imagePrompt
        }),
      });

      const data = await response.json();

      if (data.imageUrl) {
        // imageUrl is a base64 data URL from Gemini
        setScenes(prev => prev.map(s =>
          s.id === sceneId ? { ...s, imageUrl: data.imageUrl } : s
        ));
      } else if (data.error) {
        console.error('Image generation error:', data.error);
        alert(`Failed to generate: ${data.error}`);
      }
    } catch (err) {
      console.error('Failed to generate image:', err);
      alert('Failed to connect to image generation API');
    } finally {
      setGenerating(null);
    }
  };

  const generateAllImages = async () => {
    for (const scene of scenes) {
      if (!scene.imageUrl) {
        await generateImage(scene.id);
        await new Promise(r => setTimeout(r, 2000)); // Rate limiting
      }
    }
  };

  // Veo 3.1 Video Generation
  const generateVideo = async (sceneId: string) => {
    const scene = scenes.find(s => s.id === sceneId);
    if (!scene) return;

    setGeneratingVideo(sceneId);

    try {
      // Use image-to-video if we have an image, otherwise text-to-video
      const endpoint = scene.imageUrl
        ? `${API_URL}/api/veo/generate-from-image`
        : `${API_URL}/api/veo/generate`;

      const body: any = {
        prompt: scene.videoPrompt,
        duration: 8, // 8 second clips
        aspectRatio: '16:9'
      };

      // If we have an image, use it as reference
      if (scene.imageUrl) {
        body.imageBase64 = scene.imageUrl;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success && data.videoUrl) {
        setScenes(prev => prev.map(s =>
          s.id === sceneId ? { ...s, videoUrl: data.videoUrl } : s
        ));
      } else if (data.error) {
        console.error('Video generation error:', data.error);
        alert(`Failed to generate video: ${data.error}`);
      }
    } catch (err) {
      console.error('Failed to generate video:', err);
      alert('Failed to connect to video generation API');
    } finally {
      setGeneratingVideo(null);
    }
  };

  const generateStoryboard = async () => {
    const confirmed = window.confirm(
      `Generate all ${scenes.length} video clips?\n\nEstimated cost: $${(scenes.length * 0.5).toFixed(2)}\nEstimated time: ${scenes.length * 2} minutes`
    );
    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/api/veo/storyboard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'edgar-tekere-documentary',
          aspectRatio: '16:9',
          resolution: '720p',
          scenes: scenes.map(scene => ({
            id: scene.id,
            name: scene.title.toLowerCase().replace(/\s+/g, '-'),
            duration: 8,
            prompt: scene.videoPrompt,
            negativePrompt: 'text, watermark, logo, blurry, distorted faces'
          }))
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update scenes with video URLs
        const updatedScenes = [...scenes];
        data.clips.forEach((clip: any, index: number) => {
          if (clip.success && clip.videoUrl) {
            updatedScenes[index] = { ...updatedScenes[index], videoUrl: clip.videoUrl };
          }
        });
        setScenes(updatedScenes);
        alert(`Storyboard complete!\n${data.successfulClips}/${data.totalClips} clips generated\nTotal cost: $${data.totalCost.toFixed(2)}`);
      } else {
        alert('Storyboard generation failed');
      }
    } catch (err) {
      console.error('Storyboard generation failed:', err);
      alert('Failed to generate storyboard');
    }
  };

  const estimateVideoCost = async () => {
    try {
      const response = await fetch(`${API_URL}/api/veo/cost-estimate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenes: scenes.map(s => ({ duration: 8 }))
        }),
      });
      const data = await response.json();
      setVideoCostEstimate(data);
    } catch (err) {
      console.error('Cost estimate failed:', err);
    }
  };

  const updateScene = (id: string, updates: Partial<Scene>) => {
    setScenes(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const tabs = [
    { id: 'research' as TabType, label: 'Research', icon: Search },
    { id: 'scenes' as TabType, label: 'Scenes', icon: Film },
    { id: 'preview' as TabType, label: 'Preview', icon: Play },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-600 to-amber-500 flex items-center justify-center">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white">Journalist Studio</h1>
              <p className="text-xs text-zinc-500">Documentary Video Creator</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Save Status */}
            <div className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded ${
              saveStatus === 'saved' ? 'text-green-400 bg-green-500/10' :
              saveStatus === 'saving' ? 'text-amber-400 bg-amber-500/10' :
              saveStatus === 'error' ? 'text-red-400 bg-red-500/10' :
              'text-zinc-500 bg-zinc-800'
            }`}>
              {saveStatus === 'saved' && <><Cloud className="w-3 h-3" /> Saved</>}
              {saveStatus === 'saving' && <><Loader2 className="w-3 h-3 animate-spin" /> Saving...</>}
              {saveStatus === 'error' && <><CloudOff className="w-3 h-3" /> Error</>}
              {saveStatus === 'unsaved' && <><CloudOff className="w-3 h-3" /> Not saved</>}
            </div>

            <span className="text-sm text-zinc-400">
              <ImageIcon className="w-3 h-3 inline mr-1" />
              {scenes.filter(s => s.imageUrl).length}/{scenes.length}
              <span className="mx-2">|</span>
              <Video className="w-3 h-3 inline mr-1" />
              {scenes.filter(s => s.videoUrl).length}/{scenes.length}
            </span>
            <button
              onClick={generateAllImages}
              className="btn-secondary flex items-center gap-2 text-sm"
            >
              <ImageIcon className="w-4 h-4" />
              All Images
            </button>
            <button
              onClick={generateStoryboard}
              className="btn-primary flex items-center gap-2"
            >
              <Clapperboard className="w-4 h-4" />
              Generate Videos ($4)
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="border-b border-white/10 bg-black/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all border-b-2 ${
                    activeTab === tab.id
                      ? 'text-red-500 border-red-500'
                      : 'text-zinc-400 border-transparent hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <AnimatePresence mode="wait">
          {/* Research Tab */}
          {activeTab === 'research' && (
            <motion.div
              key="research"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Subject Header */}
              <div className="glass-panel p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-red-600/20 to-amber-500/20 flex items-center justify-center border border-red-500/30">
                    <User className="w-8 h-8 text-red-400" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white">{EDGAR_TEKERE_RESEARCH.subject}</h2>
                    <p className="text-zinc-400 mt-1">{EDGAR_TEKERE_RESEARCH.dates}</p>
                    <p className="text-zinc-300 mt-3 leading-relaxed">{EDGAR_TEKERE_RESEARCH.summary}</p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="glass-panel p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-400" />
                  Timeline
                </h3>
                <div className="space-y-3">
                  {EDGAR_TEKERE_RESEARCH.timeline.map((item, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="w-16 flex-shrink-0 text-amber-400 font-mono font-bold">{item.year}</div>
                      <div className="flex-1 text-zinc-300 pb-3 border-b border-white/5">{item.event}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quotes */}
              <div className="glass-panel p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-red-400" />
                  Key Quotes
                </h3>
                <div className="space-y-4">
                  {EDGAR_TEKERE_RESEARCH.quotes.map((quote, i) => (
                    <blockquote key={i} className="border-l-4 border-red-500 pl-4 italic text-zinc-300">
                      {quote}
                    </blockquote>
                  ))}
                </div>
              </div>

              {/* Sources */}
              <div className="glass-panel p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Sources</h3>
                <div className="flex flex-wrap gap-3">
                  {EDGAR_TEKERE_RESEARCH.sources.map((source, i) => (
                    <a
                      key={i}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-lg bg-white/5 text-zinc-300 hover:bg-white/10 transition-colors text-sm"
                    >
                      {source.name} →
                    </a>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setActiveTab('scenes')}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                Continue to Scene Planning
                <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {/* Scenes Tab */}
          {activeTab === 'scenes' && (
            <motion.div
              key="scenes"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-3 gap-6"
            >
              {/* Scene List */}
              <div className="col-span-1 space-y-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white">Scenes ({scenes.length})</h3>
                  <button className="btn-secondary text-sm flex items-center gap-1">
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>

                {scenes.map((scene, i) => (
                  <div
                    key={scene.id}
                    onClick={() => setSelectedScene(scene)}
                    className={`glass-panel p-4 cursor-pointer transition-all ${
                      selectedScene?.id === scene.id ? 'border-red-500' : 'hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${
                        scene.videoUrl ? 'bg-purple-500/20 text-purple-400' :
                        scene.imageUrl ? 'bg-green-500/20 text-green-400' : 'bg-zinc-800 text-zinc-500'
                      }`}>
                        {scene.videoUrl ? <Video className="w-5 h-5" /> :
                         scene.imageUrl ? <Check className="w-5 h-5" /> : i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white truncate">{scene.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                          <span>{scene.duration}s</span>
                          {scene.imageUrl && <span className="text-green-400">IMG</span>}
                          {scene.videoUrl && <span className="text-purple-400">VID</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Scene Editor */}
              <div className="col-span-2">
                {selectedScene ? (
                  <div className="glass-panel p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-white">{selectedScene.title}</h3>
                      <span className="text-sm text-zinc-500">{selectedScene.duration} seconds</span>
                    </div>

                    {/* Media Preview - Video or Image */}
                    <div className="aspect-video bg-zinc-900 rounded-xl overflow-hidden border border-white/10 relative">
                      {selectedScene.videoUrl ? (
                        <video
                          src={`${API_URL}${selectedScene.videoUrl}`}
                          controls
                          autoPlay
                          loop
                          muted
                          className="w-full h-full object-cover"
                        />
                      ) : selectedScene.imageUrl ? (
                        <img
                          src={selectedScene.imageUrl.startsWith('data:') ? selectedScene.imageUrl : `${API_URL}${selectedScene.imageUrl}`}
                          alt={selectedScene.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                          <ImageIcon className="w-16 h-16 text-zinc-700" />
                          <button
                            onClick={() => generateImage(selectedScene.id)}
                            disabled={generating === selectedScene.id}
                            className="btn-primary flex items-center gap-2"
                          >
                            {generating === selectedScene.id ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Generating...
                              </>
                            ) : (
                              <>
                                <ImageIcon className="w-4 h-4" />
                                Generate Image
                              </>
                            )}
                          </button>
                        </div>
                      )}
                      {/* Media type badge */}
                      {(selectedScene.imageUrl || selectedScene.videoUrl) && (
                        <div className="absolute top-3 right-3 flex gap-2">
                          {selectedScene.videoUrl && (
                            <span className="px-2 py-1 bg-purple-500/80 rounded text-xs font-bold text-white flex items-center gap-1">
                              <Video className="w-3 h-3" /> 8s
                            </span>
                          )}
                          {selectedScene.imageUrl && !selectedScene.videoUrl && (
                            <span className="px-2 py-1 bg-green-500/80 rounded text-xs font-bold text-white">
                              IMAGE
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Narration */}
                    <div>
                      <label className="text-sm font-medium text-zinc-400 mb-2 block">Narration</label>
                      <textarea
                        value={selectedScene.narration}
                        onChange={(e) => updateScene(selectedScene.id, { narration: e.target.value })}
                        className="w-full h-24 bg-zinc-900 border border-white/10 rounded-lg p-3 text-white resize-none focus:outline-none focus:border-red-500"
                      />
                    </div>

                    {/* Prompts Section */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Image Prompt */}
                      <div>
                        <label className="text-sm font-medium text-zinc-400 mb-2 block flex items-center gap-2">
                          <ImageIcon className="w-4 h-4" />
                          Image Prompt (Gemini)
                        </label>
                        <textarea
                          value={selectedScene.imagePrompt}
                          onChange={(e) => updateScene(selectedScene.id, { imagePrompt: e.target.value })}
                          className="w-full h-28 bg-zinc-900 border border-white/10 rounded-lg p-3 text-white text-sm resize-none focus:outline-none focus:border-green-500"
                        />
                      </div>

                      {/* Video Prompt */}
                      <div>
                        <label className="text-sm font-medium text-zinc-400 mb-2 block flex items-center gap-2">
                          <Video className="w-4 h-4" />
                          Video Prompt (Veo 3.1)
                        </label>
                        <textarea
                          value={selectedScene.videoPrompt}
                          onChange={(e) => updateScene(selectedScene.id, { videoPrompt: e.target.value })}
                          className="w-full h-28 bg-zinc-900 border border-white/10 rounded-lg p-3 text-white text-sm resize-none focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 flex-wrap">
                      <button
                        onClick={() => generateImage(selectedScene.id)}
                        disabled={generating === selectedScene.id}
                        className="btn-secondary flex items-center gap-2"
                      >
                        {generating === selectedScene.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <ImageIcon className="w-4 h-4" />
                        )}
                        {selectedScene.imageUrl ? 'Regenerate' : 'Generate'} Image
                      </button>

                      <button
                        onClick={() => generateVideo(selectedScene.id)}
                        disabled={generatingVideo === selectedScene.id}
                        className="btn-primary flex items-center gap-2"
                      >
                        {generatingVideo === selectedScene.id ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Generating (~2 min)...
                          </>
                        ) : (
                          <>
                            <Video className="w-4 h-4" />
                            {selectedScene.videoUrl ? 'Regenerate' : 'Generate'} Video
                            <span className="text-xs opacity-70">($0.50)</span>
                          </>
                        )}
                      </button>

                      {(selectedScene.imageUrl || selectedScene.videoUrl) && (
                        <button className="btn-secondary flex items-center gap-2">
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      )}
                    </div>

                    {/* Cost info */}
                    <div className="bg-zinc-900/50 rounded-lg p-3 text-xs text-zinc-500 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      <span>
                        Image: ~$0.04 (Gemini) | Video: ~$0.50/8s clip (Veo 3.1) | Full documentary: ~$4.00
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="glass-panel p-12 text-center">
                    <Film className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                    <p className="text-zinc-500">Select a scene to edit</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Preview Tab */}
          {activeTab === 'preview' && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="glass-panel p-6 text-center">
                <h3 className="text-xl font-bold text-white mb-2">The Story of Edgar Tekere</h3>
                <p className="text-zinc-400">A Documentary in {scenes.length} Scenes</p>
                <p className="text-sm text-zinc-500 mt-2">
                  Total Duration: {scenes.reduce((sum, s) => sum + s.duration, 0)} seconds
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {scenes.map((scene, i) => (
                  <div key={scene.id} className="glass-panel overflow-hidden">
                    <div className="aspect-video bg-zinc-900 relative">
                      {scene.videoUrl ? (
                        <video
                          src={`${API_URL}${scene.videoUrl}`}
                          muted
                          loop
                          autoPlay
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      ) : scene.imageUrl ? (
                        <img
                          src={scene.imageUrl.startsWith('data:') ? scene.imageUrl : `${API_URL}${scene.imageUrl}`}
                          alt={scene.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-12 h-12 text-zinc-700" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3 px-2 py-1 bg-black/70 rounded text-xs font-bold text-white">
                        Scene {i + 1}
                      </div>
                      <div className="absolute top-3 right-3 flex gap-1">
                        {scene.videoUrl && (
                          <span className="px-2 py-1 bg-purple-500/80 rounded text-xs text-white flex items-center gap-1">
                            <Video className="w-3 h-3" />
                          </span>
                        )}
                        {scene.imageUrl && !scene.videoUrl && (
                          <span className="px-2 py-1 bg-green-500/80 rounded text-xs text-white">
                            <ImageIcon className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 rounded text-xs text-zinc-300">
                        {scene.videoUrl ? '8s' : `${scene.duration}s`}
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-white mb-2">{scene.title}</h4>
                      <p className="text-sm text-zinc-400 line-clamp-2">{scene.narration}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Export Section */}
              <div className="glass-panel p-6 space-y-4">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Clapperboard className="w-5 h-5 text-amber-400" />
                  Export Options
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <button className="btn-secondary flex items-center justify-center gap-2 py-4">
                    <ImageIcon className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-medium">Image Slideshow</div>
                      <div className="text-xs text-zinc-500">Ken Burns effect</div>
                    </div>
                  </button>
                  <button
                    onClick={generateStoryboard}
                    className="btn-primary flex items-center justify-center gap-2 py-4"
                  >
                    <Video className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-medium">AI Video</div>
                      <div className="text-xs opacity-70">Veo 3.1 (~$4)</div>
                    </div>
                  </button>
                  <button className="btn-secondary flex items-center justify-center gap-2 py-4">
                    <Play className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-medium">Final Export</div>
                      <div className="text-xs text-zinc-500">Stitch + Audio</div>
                    </div>
                  </button>
                </div>
                <p className="text-xs text-zinc-500 text-center">
                  Total duration: {scenes.reduce((sum, s) => sum + (s.videoUrl ? 8 : s.duration), 0)}s |
                  Videos: {scenes.filter(s => s.videoUrl).length}/{scenes.length} |
                  Est. cost: ${(scenes.filter(s => !s.videoUrl).length * 0.5).toFixed(2)} remaining
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
