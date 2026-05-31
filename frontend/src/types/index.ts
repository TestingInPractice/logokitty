export interface User { id: string; name: string; telegramAvatarUrl?: string; createdAt: number }
export interface Child { id: string; userId: string; name: string; age: number; level: number; exp: number; foodBalance: number; goldBalance: number; lastDailyRewardAt: number | null; subscriptionId?: string; createdAt: number }
export interface Cat { id: string; childId: string; name: string; color: string; equippedItems: string[] }
export interface ShopItem { id: string; name: string; category: 'hat' | 'glasses' | 'scarf' | 'house' | 'background'; previewUrl: string; priceFood: number | null; priceGold: number | null; levelRequirement: number | null; isPremium: boolean }
export interface Inventory { id: string; childId: string; itemId: string; purchasedAt: number }
export interface Game { id: string; section: string; title: string; description: string; category: string; stage: number; minAge: number; maxAge: number; expReward: number; foodReward: number; requiresSubscription: boolean; unlockLevel: number | null; usesSpeech: boolean }
export interface GameSession { id: string; childId: string; gameId: string; score: number; expEarned: number; foodEarned: number; completedAt: number }
export interface Level { level: number; stage: number; expRequired: number; rewardFood: number; rewardGold: number | null; isStageComplete: boolean }
export interface Section { id: string; title: string; description: string; icon: string; stageRequired: number; isUnlocked: boolean; games: Game[] }
export type Page = 'auth' | 'feed' | 'child' | 'section' | 'game' | 'shop' | 'settings' | 'subscription'
