export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bookings: {
        Row: {
          amount_wellcoins: number | null
          amount_zar: number | null
          booking_date: string
          consumer_id: string
          created_at: string
          id: string
          notes: string | null
          payment_method: string
          provider_id: string
          service_id: string
          status: string
          updated_at: string
        }
        Insert: {
          amount_wellcoins?: number | null
          amount_zar?: number | null
          booking_date: string
          consumer_id: string
          created_at?: string
          id?: string
          notes?: string | null
          payment_method: string
          provider_id: string
          service_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          amount_wellcoins?: number | null
          amount_zar?: number | null
          booking_date?: string
          consumer_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          payment_method?: string
          provider_id?: string
          service_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_consumer_id_fkey"
            columns: ["consumer_id"]
            isOneToOne: false
            referencedRelation: "consumer_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "provider_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          comments_count: number | null
          content: string
          created_at: string
          id: string
          likes_count: number | null
          post_type: string
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          comments_count?: number | null
          content: string
          created_at?: string
          id?: string
          likes_count?: number | null
          post_type: string
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          comments_count?: number | null
          content?: string
          created_at?: string
          id?: string
          likes_count?: number | null
          post_type?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      consumer_profiles: {
        Row: {
          created_at: string | null
          id: string
          location: string | null
          preferred_services: string[] | null
          updated_at: string | null
          wellcoin_balance: number | null
          wellness_goals: string[] | null
        }
        Insert: {
          created_at?: string | null
          id: string
          location?: string | null
          preferred_services?: string[] | null
          updated_at?: string | null
          wellcoin_balance?: number | null
          wellness_goals?: string[] | null
        }
        Update: {
          created_at?: string | null
          id?: string
          location?: string | null
          preferred_services?: string[] | null
          updated_at?: string | null
          wellcoin_balance?: number | null
          wellness_goals?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "consumer_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_sessions: {
        Row: {
          completed: boolean | null
          created_at: string | null
          current_step: number | null
          id: string
          session_data: Json | null
          total_steps: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          current_step?: number | null
          id?: string
          session_data?: Json | null
          total_steps?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          current_step?: number | null
          id?: string
          session_data?: Json | null
          total_steps?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          user_type: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          user_type: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          user_type?: string
        }
        Relationships: []
      }
      provider_profiles: {
        Row: {
          availability: Json | null
          business_name: string | null
          certifications: string[] | null
          created_at: string | null
          description: string | null
          experience_years: number | null
          id: string
          location: string | null
          phone: string | null
          pricing_info: Json | null
          profile_image_url: string | null
          specialties: string[] | null
          updated_at: string | null
          verified: boolean | null
          website: string | null
          wellcoin_balance: number | null
        }
        Insert: {
          availability?: Json | null
          business_name?: string | null
          certifications?: string[] | null
          created_at?: string | null
          description?: string | null
          experience_years?: number | null
          id: string
          location?: string | null
          phone?: string | null
          pricing_info?: Json | null
          profile_image_url?: string | null
          specialties?: string[] | null
          updated_at?: string | null
          verified?: boolean | null
          website?: string | null
          wellcoin_balance?: number | null
        }
        Update: {
          availability?: Json | null
          business_name?: string | null
          certifications?: string[] | null
          created_at?: string | null
          description?: string | null
          experience_years?: number | null
          id?: string
          location?: string | null
          phone?: string | null
          pricing_info?: Json | null
          profile_image_url?: string | null
          specialties?: string[] | null
          updated_at?: string | null
          verified?: boolean | null
          website?: string | null
          wellcoin_balance?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "provider_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          booking_id: string
          created_at: string
          id: string
          rating: number
          review_text: string | null
          review_type: string
          reviewee_id: string
          reviewer_id: string
        }
        Insert: {
          booking_id: string
          created_at?: string
          id?: string
          rating: number
          review_text?: string | null
          review_type: string
          reviewee_id: string
          reviewer_id: string
        }
        Update: {
          booking_id?: string
          created_at?: string
          id?: string
          rating?: number
          review_text?: string | null
          review_type?: string
          reviewee_id?: string
          reviewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewee_id_fkey"
            columns: ["reviewee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          active: boolean | null
          category: string | null
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          id: string
          images: string[] | null
          is_online: boolean | null
          location: string | null
          price_wellcoins: number | null
          price_zar: number | null
          provider_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          images?: string[] | null
          is_online?: boolean | null
          location?: string | null
          price_wellcoins?: number | null
          price_zar?: number | null
          provider_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          images?: string[] | null
          is_online?: boolean | null
          location?: string | null
          price_wellcoins?: number | null
          price_zar?: number | null
          provider_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "services_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "provider_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount_wellcoins: number | null
          amount_zar: number | null
          created_at: string
          description: string
          id: string
          related_service_id: string | null
          related_user_id: string | null
          status: string
          transaction_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_wellcoins?: number | null
          amount_zar?: number | null
          created_at?: string
          description: string
          id?: string
          related_service_id?: string | null
          related_user_id?: string | null
          status?: string
          transaction_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_wellcoins?: number | null
          amount_zar?: number | null
          created_at?: string
          description?: string
          id?: string
          related_service_id?: string | null
          related_user_id?: string | null
          status?: string
          transaction_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_related_service_id_fkey"
            columns: ["related_service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_related_user_id_fkey"
            columns: ["related_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      want_responses: {
        Row: {
          created_at: string
          id: string
          message: string
          proposed_price_wellcoins: number | null
          proposed_price_zar: number | null
          provider_id: string
          status: string
          want_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          proposed_price_wellcoins?: number | null
          proposed_price_zar?: number | null
          provider_id: string
          status?: string
          want_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          proposed_price_wellcoins?: number | null
          proposed_price_zar?: number | null
          provider_id?: string
          status?: string
          want_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "want_responses_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "provider_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "want_responses_want_id_fkey"
            columns: ["want_id"]
            isOneToOne: false
            referencedRelation: "wants"
            referencedColumns: ["id"]
          },
        ]
      }
      wants: {
        Row: {
          budget_wellcoins: number | null
          budget_zar: number | null
          category: string | null
          created_at: string
          description: string
          expires_at: string | null
          id: string
          location: string | null
          responses_count: number | null
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          budget_wellcoins?: number | null
          budget_zar?: number | null
          category?: string | null
          created_at?: string
          description: string
          expires_at?: string | null
          id?: string
          location?: string | null
          responses_count?: number | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          budget_wellcoins?: number | null
          budget_zar?: number | null
          category?: string | null
          created_at?: string
          description?: string
          expires_at?: string | null
          id?: string
          location?: string | null
          responses_count?: number | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
