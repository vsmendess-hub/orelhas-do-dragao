/**
 * Tipos TypeScript gerados do schema Supabase
 * Representa as tabelas do banco de dados
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      characters: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          race: string;
          subrace: string | null;
          class: string;
          archetype: string | null;
          level: number;
          alignment: string;
          background: string | null;
          personality_traits: string | null;
          ideals: string | null;
          bonds: string | null;
          flaws: string | null;
          attributes: Json;
          skills: Json;
          proficiencies: Json;
          equipment: Json;
          spells: Json | null;
          features: Json;
          hit_points: Json;
          armor_class: number;
          speed: number;
          initiative: number;
          proficiency_bonus: number;
          inspiration: boolean;
          experience_points: number;
          notes: string | null;
          avatar_url: string | null;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          race: string;
          subrace?: string | null;
          class: string;
          archetype?: string | null;
          level?: number;
          alignment: string;
          background?: string | null;
          personality_traits?: string | null;
          ideals?: string | null;
          bonds?: string | null;
          flaws?: string | null;
          attributes: Json;
          skills: Json;
          proficiencies: Json;
          equipment: Json;
          spells?: Json | null;
          features: Json;
          hit_points: Json;
          armor_class?: number;
          speed?: number;
          initiative?: number;
          proficiency_bonus?: number;
          inspiration?: boolean;
          experience_points?: number;
          notes?: string | null;
          avatar_url?: string | null;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          race?: string;
          subrace?: string | null;
          class?: string;
          archetype?: string | null;
          level?: number;
          alignment?: string;
          background?: string | null;
          personality_traits?: string | null;
          ideals?: string | null;
          bonds?: string | null;
          flaws?: string | null;
          attributes?: Json;
          skills?: Json;
          proficiencies?: Json;
          equipment?: Json;
          spells?: Json | null;
          features?: Json;
          hit_points?: Json;
          armor_class?: number;
          speed?: number;
          initiative?: number;
          proficiency_bonus?: number;
          inspiration?: boolean;
          experience_points?: number;
          notes?: string | null;
          avatar_url?: string | null;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_preferences: {
        Row: {
          id: string;
          user_id: string;
          theme: string;
          notifications_enabled: boolean;
          default_dice_skin: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          theme?: string;
          notifications_enabled?: boolean;
          default_dice_skin?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          theme?: string;
          notifications_enabled?: boolean;
          default_dice_skin?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Helper types
export type Character = Database['public']['Tables']['characters']['Row'];
export type CharacterInsert = Database['public']['Tables']['characters']['Insert'];
export type CharacterUpdate = Database['public']['Tables']['characters']['Update'];

export type UserPreferences = Database['public']['Tables']['user_preferences']['Row'];
export type UserPreferencesInsert = Database['public']['Tables']['user_preferences']['Insert'];
export type UserPreferencesUpdate = Database['public']['Tables']['user_preferences']['Update'];

// Tipos de domínio D&D 5e
export interface Attributes {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
}

export interface Skill {
  name: string;
  attribute: keyof Attributes;
  proficient: boolean;
  expertise: boolean;
}

export interface HitPoints {
  current: number;
  max: number;
  temporary: number;
}
