export type SectionId = 'speech-launch' | 'speech-dev' | 'educational' | 'school-prep'
export type Page = 'auth' | 'feed' | 'child' | 'section' | 'game' | 'shop' | 'settings' | 'subscription'
export type ShopCategory = 'hat' | 'glasses' | 'scarf' | 'house' | 'background'
export type GameCategory = 'articulation' | 'phonemic' | 'breathing' | 'first-words' | 'whistling' | 'hissing' | 'sonor' | 'tongue-twisters' | 'logic' | 'memory' | 'attention' | 'emotion' | 'neuro' | 'motorics' | 'alphabet' | 'syllable' | 'reading' | 'counting' | 'grammar' | 'handwriting' | 'vocabulary'
export type SubscriptionStatus = 'active' | 'expired' | 'cancelled'
export type LogLevel = 'debug' | 'info' | 'warn' | 'error'
export type LogSource = 'api' | 'subscription' | 'auth' | 'admin' | 'game' | 'diagnostic'
export type AdminRole = 'admin' | 'superadmin'
export type PhonemicSkillType = 'distinguish-by-ear' | 'find-sound-in-word' | 'count-sounds' | 'rhyme-recognition'
export type VocabularyCategory = 'body' | 'food' | 'animals' | 'home' | 'colors' | 'nature' | 'emotions'
export type MotorSkillType = 'trace-line' | 'trace-shape' | 'color-inside' | 'copy-letter' | 'copy-word' | 'scissor-cut'
export type VoiceProvider = 'elevenlabs' | 'openvoice'

export interface User { id: string; name: string; telegramAvatarUrl?: string; createdAt: number }
export interface Child { id: string; userId: string; name: string; age: number; level: number; exp: number; foodBalance: number; goldBalance: number; lastDailyRewardAt: number | null; subscriptionId?: string; createdAt: number }
export interface Cat { id: string; childId: string; name: string; color: string; equippedItems: string[] }
export interface ShopItem { id: string; name: string; category: ShopCategory; previewUrl: string; priceFood: number | null; priceGold: number | null; levelRequirement: number | null; isPremium: boolean }
export interface Inventory { id: string; childId: string; itemId: string; purchasedAt: number }
export interface Level { level: number; stage: number; expRequired: number; rewardFood: number; rewardGold: number | null; unlockGameId?: string; unlockSection?: SectionId; isStageComplete: boolean }
export interface Game { id: string; section: SectionId; title: string; description: string; category: GameCategory; stage: number; minAge: number; maxAge: number; expReward: number; foodReward: number; requiresSubscription: boolean; unlockLevel: number | null; usesSpeech: boolean }
export interface GameSession { id: string; childId: string; gameId: string; score: number; soundsTested?: string[]; soundsPassed?: string[]; expEarned: number; foodEarned: number; completedAt: number }
export interface SoundProgress { id: string; childId: string; sound: string; stage: number; accuracy: number; lastTestedAt: number; isMastered: boolean }
export interface PhonemicSkill { id: string; childId: string; skill: PhonemicSkillType; accuracy: number; lastTestedAt: number; isMastered: boolean }
export interface LetterProgress { id: string; childId: string; letter: string; recognizes: boolean; pronounces: boolean; writes: boolean; masteredAt?: number }
export interface SyllableProgress { id: string; childId: string; syllable: string; canRead: boolean; canWrite: boolean; masteredAt?: number }
export interface VocabularyProgress { id: string; childId: string; category: VocabularyCategory; wordsLearned: number; wordsTotal: number; lastTestedAt: number }
export interface MotorSkill { id: string; childId: string; skill: MotorSkillType; accuracy: number; lastTestedAt: number; isMastered: boolean }
export interface DiagnosticResult { id: string; childId: string; overallAccuracy: number; sounds: Array<{ sound: string; accuracy: number; recommendation: string }>; summary: string; createdAt: number }
export interface Subscription { id: string; planId: string; status: SubscriptionStatus; startedAt: number; expiresAt: number }
export interface SubscriptionPlan { id: string; name: string; priceRub: number; durationDays: number }
export interface Referral { id: string; userId: string; code: string; usedByUserId?: string; goldRewardClaimed: boolean; createdAt: number }
export interface Admin { id: string; login: string; passwordHash: string; role: AdminRole; createdAt: number }
export interface FeatureFlag { id: string; key: string; description: string; enabled: boolean; updatedBy?: string; updatedAt: number }
export interface AppSetting { key: string; value: string; description: string; updatedBy?: string; updatedAt: number }
export interface LogEntry { id: string; level: LogLevel; source: LogSource; message: string; metadata?: Record<string, unknown>; adminId?: string; createdAt: number }
export interface VoiceProfile { id: string; childId: string; provider: VoiceProvider; voiceId: string; sampleCount: number; isActive: boolean; createdAt: number; expiresAt?: number }
export interface Section { id: SectionId; title: string; description: string; icon: string; stageRequired: number; isUnlocked: boolean; games: Game[] }
