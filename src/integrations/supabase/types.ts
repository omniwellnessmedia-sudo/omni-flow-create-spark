export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      affiliate_brands: {
        Row: {
          advertiser_id: string
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          is_featured: boolean | null
          logo_url: string | null
          name: string
          product_count: number | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          advertiser_id: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_featured?: boolean | null
          logo_url?: string | null
          name: string
          product_count?: number | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          advertiser_id?: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_featured?: boolean | null
          logo_url?: string | null
          name?: string
          product_count?: number | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      affiliate_clicks: {
        Row: {
          affiliate_program_id: string
          click_id: string
          country_code: string | null
          created_at: string | null
          destination_url: string
          device_type: string | null
          id: string
          ip_address: string | null
          referrer_url: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          affiliate_program_id: string
          click_id: string
          country_code?: string | null
          created_at?: string | null
          destination_url: string
          device_type?: string | null
          id?: string
          ip_address?: string | null
          referrer_url?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          affiliate_program_id?: string
          click_id?: string
          country_code?: string | null
          created_at?: string | null
          destination_url?: string
          device_type?: string | null
          id?: string
          ip_address?: string | null
          referrer_url?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_clicks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_clicks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_commissions: {
        Row: {
          affiliate_program_id: string
          approved_at: string | null
          click_id: string | null
          commission_amount: number
          commission_currency: string
          commission_rate: number | null
          created_at: string | null
          id: string
          notes: string | null
          order_amount: number
          order_id: string | null
          paid_at: string | null
          payment_batch_id: string | null
          product_id: string | null
          product_name: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          affiliate_program_id: string
          approved_at?: string | null
          click_id?: string | null
          commission_amount: number
          commission_currency: string
          commission_rate?: number | null
          created_at?: string | null
          id?: string
          notes?: string | null
          order_amount: number
          order_id?: string | null
          paid_at?: string | null
          payment_batch_id?: string | null
          product_id?: string | null
          product_name?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          affiliate_program_id?: string
          approved_at?: string | null
          click_id?: string | null
          commission_amount?: number
          commission_currency?: string
          commission_rate?: number | null
          created_at?: string | null
          id?: string
          notes?: string | null
          order_amount?: number
          order_id?: string | null
          paid_at?: string | null
          payment_batch_id?: string | null
          product_id?: string | null
          product_name?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_commissions_click_id_fkey"
            columns: ["click_id"]
            isOneToOne: false
            referencedRelation: "affiliate_clicks"
            referencedColumns: ["click_id"]
          },
          {
            foreignKeyName: "affiliate_commissions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_commissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_commissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_payouts: {
        Row: {
          commission_count: number | null
          created_at: string | null
          id: string
          payment_gateway: string | null
          payment_reference: string | null
          payout_period_end: string
          payout_period_start: string
          processed_at: string | null
          status: string | null
          total_amount_eur: number | null
          total_amount_usd: number | null
          total_amount_zar: number | null
        }
        Insert: {
          commission_count?: number | null
          created_at?: string | null
          id?: string
          payment_gateway?: string | null
          payment_reference?: string | null
          payout_period_end: string
          payout_period_start: string
          processed_at?: string | null
          status?: string | null
          total_amount_eur?: number | null
          total_amount_usd?: number | null
          total_amount_zar?: number | null
        }
        Update: {
          commission_count?: number | null
          created_at?: string | null
          id?: string
          payment_gateway?: string | null
          payment_reference?: string | null
          payout_period_end?: string
          payout_period_start?: string
          processed_at?: string | null
          status?: string | null
          total_amount_eur?: number | null
          total_amount_usd?: number | null
          total_amount_zar?: number | null
        }
        Relationships: []
      }
      affiliate_products: {
        Row: {
          additional_images: Json | null
          advertiser_id: string | null
          advertiser_name: string | null
          affiliate_program_id: string
          affiliate_url: string
          availability: string | null
          brand: string | null
          brand_logo_url: string | null
          category: string | null
          color: string | null
          commission_rate: number | null
          condition: string | null
          created_at: string | null
          description: string | null
          external_product_id: string
          google_category: Json | null
          gtin: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_featured: boolean | null
          is_trending: boolean | null
          last_synced_at: string | null
          long_description: string | null
          manufacturer: string | null
          material: string | null
          mpn: string | null
          name: string
          price_eur: number | null
          price_usd: number | null
          price_zar: number | null
          product_details: Json | null
          product_highlights: Json | null
          sale_price_eur: number | null
          sale_price_usd: number | null
          sale_price_zar: number | null
          size: string | null
          view_count: number | null
        }
        Insert: {
          additional_images?: Json | null
          advertiser_id?: string | null
          advertiser_name?: string | null
          affiliate_program_id: string
          affiliate_url: string
          availability?: string | null
          brand?: string | null
          brand_logo_url?: string | null
          category?: string | null
          color?: string | null
          commission_rate?: number | null
          condition?: string | null
          created_at?: string | null
          description?: string | null
          external_product_id: string
          google_category?: Json | null
          gtin?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          is_trending?: boolean | null
          last_synced_at?: string | null
          long_description?: string | null
          manufacturer?: string | null
          material?: string | null
          mpn?: string | null
          name: string
          price_eur?: number | null
          price_usd?: number | null
          price_zar?: number | null
          product_details?: Json | null
          product_highlights?: Json | null
          sale_price_eur?: number | null
          sale_price_usd?: number | null
          sale_price_zar?: number | null
          size?: string | null
          view_count?: number | null
        }
        Update: {
          additional_images?: Json | null
          advertiser_id?: string | null
          advertiser_name?: string | null
          affiliate_program_id?: string
          affiliate_url?: string
          availability?: string | null
          brand?: string | null
          brand_logo_url?: string | null
          category?: string | null
          color?: string | null
          commission_rate?: number | null
          condition?: string | null
          created_at?: string | null
          description?: string | null
          external_product_id?: string
          google_category?: Json | null
          gtin?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          is_trending?: boolean | null
          last_synced_at?: string | null
          long_description?: string | null
          manufacturer?: string | null
          material?: string | null
          mpn?: string | null
          name?: string
          price_eur?: number | null
          price_usd?: number | null
          price_zar?: number | null
          product_details?: Json | null
          product_highlights?: Json | null
          sale_price_eur?: number | null
          sale_price_usd?: number | null
          sale_price_zar?: number | null
          size?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: string | null
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          table_name: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      blog_comments: {
        Row: {
          blog_post_id: string
          content: string
          created_at: string
          id: string
          likes_count: number | null
          parent_comment_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          blog_post_id: string
          content: string
          created_at?: string
          id?: string
          likes_count?: number | null
          parent_comment_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          blog_post_id?: string
          content?: string
          created_at?: string
          id?: string
          likes_count?: number | null
          parent_comment_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_comments_blog_post_id_fkey"
            columns: ["blog_post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "blog_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_likes: {
        Row: {
          blog_post_id: string | null
          comment_id: string | null
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          blog_post_id?: string | null
          comment_id?: string | null
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          blog_post_id?: string | null
          comment_id?: string | null
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_likes_blog_post_id_fkey"
            columns: ["blog_post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "blog_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          comments_count: number | null
          content: string
          created_at: string
          excerpt: string | null
          featured_image_url: string | null
          id: string
          likes_count: number | null
          published_at: string | null
          read_time_minutes: number | null
          seo_meta_description: string | null
          seo_meta_title: string | null
          slug: string
          social_shares: Json | null
          status: string
          subtitle: string | null
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
          views_count: number | null
        }
        Insert: {
          comments_count?: number | null
          content: string
          created_at?: string
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          likes_count?: number | null
          published_at?: string | null
          read_time_minutes?: number | null
          seo_meta_description?: string | null
          seo_meta_title?: string | null
          slug: string
          social_shares?: Json | null
          status?: string
          subtitle?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
          views_count?: number | null
        }
        Update: {
          comments_count?: number | null
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          likes_count?: number | null
          published_at?: string | null
          read_time_minutes?: number | null
          seo_meta_description?: string | null
          seo_meta_title?: string | null
          slug?: string
          social_shares?: Json | null
          status?: string
          subtitle?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
          views_count?: number | null
        }
        Relationships: []
      }
      booking_leases: {
        Row: {
          consumer_id: string | null
          consumer_session_id: string
          converted_to_booking_id: string | null
          created_at: string | null
          expires_at: string
          id: string
          participants: number
          selected_date: string
          selected_time: string | null
          status: string | null
          tour_id: string
        }
        Insert: {
          consumer_id?: string | null
          consumer_session_id: string
          converted_to_booking_id?: string | null
          created_at?: string | null
          expires_at: string
          id?: string
          participants: number
          selected_date: string
          selected_time?: string | null
          status?: string | null
          tour_id: string
        }
        Update: {
          consumer_id?: string | null
          consumer_session_id?: string
          converted_to_booking_id?: string | null
          created_at?: string | null
          expires_at?: string
          id?: string
          participants?: number
          selected_date?: string
          selected_time?: string | null
          status?: string | null
          tour_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_leases_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_requests: {
        Row: {
          alternative_dates_offered: Json | null
          alternative_message: string | null
          confirmed_date: string | null
          confirmed_time: string | null
          consumer_id: string | null
          contact_email: string
          contact_name: string
          contact_phone: string | null
          created_at: string | null
          deposit_amount_zar: number | null
          deposit_captured: boolean | null
          expires_at: string | null
          flexibility: string | null
          id: string
          operator_id: string | null
          operator_response_at: string | null
          operator_response_deadline: string | null
          participants: number
          preferred_dates: Json
          special_requirements: string | null
          status: string | null
          stripe_payment_intent_id: string | null
          tour_id: string
          updated_at: string | null
        }
        Insert: {
          alternative_dates_offered?: Json | null
          alternative_message?: string | null
          confirmed_date?: string | null
          confirmed_time?: string | null
          consumer_id?: string | null
          contact_email: string
          contact_name: string
          contact_phone?: string | null
          created_at?: string | null
          deposit_amount_zar?: number | null
          deposit_captured?: boolean | null
          expires_at?: string | null
          flexibility?: string | null
          id?: string
          operator_id?: string | null
          operator_response_at?: string | null
          operator_response_deadline?: string | null
          participants: number
          preferred_dates?: Json
          special_requirements?: string | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          tour_id: string
          updated_at?: string | null
        }
        Update: {
          alternative_dates_offered?: Json | null
          alternative_message?: string | null
          confirmed_date?: string | null
          confirmed_time?: string | null
          consumer_id?: string | null
          contact_email?: string
          contact_name?: string
          contact_phone?: string | null
          created_at?: string | null
          deposit_amount_zar?: number | null
          deposit_captured?: boolean | null
          expires_at?: string | null
          flexibility?: string | null
          id?: string
          operator_id?: string | null
          operator_response_at?: string | null
          operator_response_deadline?: string | null
          participants?: number
          preferred_dates?: Json
          special_requirements?: string | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          tour_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_requests_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
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
      calcom_global_settings: {
        Row: {
          description: string | null
          id: string
          setting_key: string
          setting_value: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          description?: string | null
          id?: string
          setting_key: string
          setting_value: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      calcom_settings: {
        Row: {
          calcom_api_key: string | null
          calcom_username: string | null
          created_at: string | null
          embed_enabled: boolean | null
          event_type_slug: string | null
          id: string
          provider_id: string | null
          updated_at: string | null
        }
        Insert: {
          calcom_api_key?: string | null
          calcom_username?: string | null
          created_at?: string | null
          embed_enabled?: boolean | null
          event_type_slug?: string | null
          id?: string
          provider_id?: string | null
          updated_at?: string | null
        }
        Update: {
          calcom_api_key?: string | null
          calcom_username?: string | null
          created_at?: string | null
          embed_enabled?: boolean | null
          event_type_slug?: string | null
          id?: string
          provider_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calcom_settings_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: true
            referencedRelation: "provider_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chatbot_conversations: {
        Row: {
          created_at: string
          ended_at: string | null
          id: string
          lead_captured: boolean | null
          lead_source: string | null
          messages: Json | null
          products_recommended: Json | null
          session_id: string
          started_at: string
          updated_at: string
          user_email: string | null
        }
        Insert: {
          created_at?: string
          ended_at?: string | null
          id?: string
          lead_captured?: boolean | null
          lead_source?: string | null
          messages?: Json | null
          products_recommended?: Json | null
          session_id: string
          started_at?: string
          updated_at?: string
          user_email?: string | null
        }
        Update: {
          created_at?: string
          ended_at?: string | null
          id?: string
          lead_captured?: boolean | null
          lead_source?: string | null
          messages?: Json | null
          products_recommended?: Json | null
          session_id?: string
          started_at?: string
          updated_at?: string
          user_email?: string | null
        }
        Relationships: []
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
          {
            foreignKeyName: "community_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conscious_media_interactions: {
        Row: {
          channel: string
          consciousness_intent: string | null
          id: string
          interaction_type: string
          practitioner_id: string | null
          product_name: string
          retreat_id: string | null
          timestamp: string
          user_id: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
          wellness_category: string | null
        }
        Insert: {
          channel: string
          consciousness_intent?: string | null
          id?: string
          interaction_type: string
          practitioner_id?: string | null
          product_name: string
          retreat_id?: string | null
          timestamp?: string
          user_id?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          wellness_category?: string | null
        }
        Update: {
          channel?: string
          consciousness_intent?: string | null
          id?: string
          interaction_type?: string
          practitioner_id?: string | null
          product_name?: string
          retreat_id?: string | null
          timestamp?: string
          user_id?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          wellness_category?: string | null
        }
        Relationships: []
      }
      conscious_partner_values: {
        Row: {
          conscious_values: string[] | null
          created_at: string | null
          logo_url: string | null
          partner_description: string | null
          partner_id: string
          partner_name: string
          partner_website: string
          south_african_commitment: string | null
          updated_at: string | null
          values_alignment_score: number | null
        }
        Insert: {
          conscious_values?: string[] | null
          created_at?: string | null
          logo_url?: string | null
          partner_description?: string | null
          partner_id: string
          partner_name: string
          partner_website: string
          south_african_commitment?: string | null
          updated_at?: string | null
          values_alignment_score?: number | null
        }
        Update: {
          conscious_values?: string[] | null
          created_at?: string | null
          logo_url?: string | null
          partner_description?: string | null
          partner_id?: string
          partner_name?: string
          partner_website?: string
          south_african_commitment?: string | null
          updated_at?: string | null
          values_alignment_score?: number | null
        }
        Relationships: []
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
          {
            foreignKeyName: "consumer_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          organization: string | null
          service: string | null
          status: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          organization?: string | null
          service?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          organization?: string | null
          service?: string | null
          status?: string | null
        }
        Relationships: []
      }
      feature_flags: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          display_name: string
          feature_key: string
          id: string
          is_enabled: boolean | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          display_name: string
          feature_key: string
          id?: string
          is_enabled?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          display_name?: string
          feature_key?: string
          id?: string
          is_enabled?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      newsletter_campaigns: {
        Row: {
          click_count: number | null
          created_at: string
          created_by: string | null
          from_email: string | null
          from_name: string | null
          html_content: string
          id: string
          name: string
          open_count: number | null
          preview_text: string | null
          scheduled_send_time: string | null
          sent_count: number | null
          status: Database["public"]["Enums"]["newsletter_status"]
          subject: string
          updated_at: string
        }
        Insert: {
          click_count?: number | null
          created_at?: string
          created_by?: string | null
          from_email?: string | null
          from_name?: string | null
          html_content: string
          id?: string
          name: string
          open_count?: number | null
          preview_text?: string | null
          scheduled_send_time?: string | null
          sent_count?: number | null
          status?: Database["public"]["Enums"]["newsletter_status"]
          subject: string
          updated_at?: string
        }
        Update: {
          click_count?: number | null
          created_at?: string
          created_by?: string | null
          from_email?: string | null
          from_name?: string | null
          html_content?: string
          id?: string
          name?: string
          open_count?: number | null
          preview_text?: string | null
          scheduled_send_time?: string | null
          sent_count?: number | null
          status?: Database["public"]["Enums"]["newsletter_status"]
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          confirmed: boolean | null
          confirmed_at: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          interests: string[] | null
          last_email_sent_at: string | null
          lead_source: string | null
          nurture_sequence_step: number | null
          nurture_started_at: string | null
          source: string | null
          subscribed_at: string
          unsubscribed: boolean | null
          unsubscribed_at: string | null
          updated_at: string
        }
        Insert: {
          confirmed?: boolean | null
          confirmed_at?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          interests?: string[] | null
          last_email_sent_at?: string | null
          lead_source?: string | null
          nurture_sequence_step?: number | null
          nurture_started_at?: string | null
          source?: string | null
          subscribed_at?: string
          unsubscribed?: boolean | null
          unsubscribed_at?: string | null
          updated_at?: string
        }
        Update: {
          confirmed?: boolean | null
          confirmed_at?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          interests?: string[] | null
          last_email_sent_at?: string | null
          lead_source?: string | null
          nurture_sequence_step?: number | null
          nurture_started_at?: string | null
          source?: string | null
          subscribed_at?: string
          unsubscribed?: boolean | null
          unsubscribed_at?: string | null
          updated_at?: string
        }
        Relationships: []
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
          {
            foreignKeyName: "onboarding_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          order_id: string | null
          price_zar: number
          product_id: string | null
          product_name: string
          quantity: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          price_zar: number
          product_id?: string | null
          product_name: string
          quantity?: number
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          price_zar?: number
          product_id?: string | null
          product_name?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          affiliate_click_id: string | null
          affiliate_commission_id: string | null
          affiliate_program_id: string | null
          amount: number
          coverage: string[] | null
          created_at: string
          currency: string
          customer_email: string
          customer_name: string
          data_amount: string | null
          destination: string | null
          esim_activation_code: string | null
          esim_qr_code: string | null
          id: string
          items: Json | null
          notes: string | null
          order_number: string
          payment_method: string | null
          paypal_payer_id: string | null
          product_id: string
          product_name: string
          product_type: string
          roambuddy_order_id: string | null
          status: string
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          subtotal_zar: number | null
          tax_zar: number | null
          total_zar: number | null
          updated_at: string
          user_id: string | null
          validity_days: number | null
        }
        Insert: {
          affiliate_click_id?: string | null
          affiliate_commission_id?: string | null
          affiliate_program_id?: string | null
          amount: number
          coverage?: string[] | null
          created_at?: string
          currency?: string
          customer_email: string
          customer_name: string
          data_amount?: string | null
          destination?: string | null
          esim_activation_code?: string | null
          esim_qr_code?: string | null
          id?: string
          items?: Json | null
          notes?: string | null
          order_number: string
          payment_method?: string | null
          paypal_payer_id?: string | null
          product_id: string
          product_name: string
          product_type?: string
          roambuddy_order_id?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          subtotal_zar?: number | null
          tax_zar?: number | null
          total_zar?: number | null
          updated_at?: string
          user_id?: string | null
          validity_days?: number | null
        }
        Update: {
          affiliate_click_id?: string | null
          affiliate_commission_id?: string | null
          affiliate_program_id?: string | null
          amount?: number
          coverage?: string[] | null
          created_at?: string
          currency?: string
          customer_email?: string
          customer_name?: string
          data_amount?: string | null
          destination?: string | null
          esim_activation_code?: string | null
          esim_qr_code?: string | null
          id?: string
          items?: Json | null
          notes?: string | null
          order_number?: string
          payment_method?: string | null
          paypal_payer_id?: string | null
          product_id?: string
          product_name?: string
          product_type?: string
          roambuddy_order_id?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          subtotal_zar?: number | null
          tax_zar?: number | null
          total_zar?: number | null
          updated_at?: string
          user_id?: string | null
          validity_days?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_affiliate_commission_id_fkey"
            columns: ["affiliate_commission_id"]
            isOneToOne: false
            referencedRelation: "affiliate_commissions"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_website_stats: {
        Row: {
          avg_session_duration: number | null
          bookings_generated: number | null
          bounce_rate: number | null
          commission_earned_wellcoins: number | null
          commission_earned_zar: number | null
          commission_rate: number | null
          commission_status: string | null
          created_at: string | null
          form_submissions: number | null
          id: string
          page_views: number | null
          period_end: string
          period_start: string
          provider_id: string | null
          revenue_generated_zar: number | null
          unique_visitors: number | null
          updated_at: string | null
          website_id: string | null
        }
        Insert: {
          avg_session_duration?: number | null
          bookings_generated?: number | null
          bounce_rate?: number | null
          commission_earned_wellcoins?: number | null
          commission_earned_zar?: number | null
          commission_rate?: number | null
          commission_status?: string | null
          created_at?: string | null
          form_submissions?: number | null
          id?: string
          page_views?: number | null
          period_end: string
          period_start: string
          provider_id?: string | null
          revenue_generated_zar?: number | null
          unique_visitors?: number | null
          updated_at?: string | null
          website_id?: string | null
        }
        Update: {
          avg_session_duration?: number | null
          bookings_generated?: number | null
          bounce_rate?: number | null
          commission_earned_wellcoins?: number | null
          commission_earned_zar?: number | null
          commission_rate?: number | null
          commission_status?: string | null
          created_at?: string | null
          form_submissions?: number | null
          id?: string
          page_views?: number | null
          period_end?: string
          period_start?: string
          provider_id?: string | null
          revenue_generated_zar?: number | null
          unique_visitors?: number | null
          updated_at?: string | null
          website_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_website_stats_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "provider_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_website_stats_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "provider_websites"
            referencedColumns: ["id"]
          },
        ]
      }
      product_comparisons: {
        Row: {
          comparison_name: string | null
          created_at: string
          id: string
          product_ids: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          comparison_name?: string | null
          created_at?: string
          id?: string
          product_ids: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          comparison_name?: string | null
          created_at?: string
          id?: string
          product_ids?: string[]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      product_deals: {
        Row: {
          available_spots: number | null
          claimed_spots: number | null
          created_at: string | null
          deal_price: number
          discount_percent: number | null
          id: string
          is_active: boolean | null
          original_price: number
          product_id: string | null
          valid_until: string | null
        }
        Insert: {
          available_spots?: number | null
          claimed_spots?: number | null
          created_at?: string | null
          deal_price: number
          discount_percent?: number | null
          id?: string
          is_active?: boolean | null
          original_price: number
          product_id?: string | null
          valid_until?: string | null
        }
        Update: {
          available_spots?: number | null
          claimed_spots?: number | null
          created_at?: string | null
          deal_price?: number
          discount_percent?: number | null
          id?: string
          is_active?: boolean | null
          original_price?: number
          product_id?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_deals_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_reviews: {
        Row: {
          created_at: string
          helpful_count: number | null
          id: string
          photos: Json | null
          product_id: string
          rating: number
          review_text: string
          review_title: string
          updated_at: string
          user_id: string | null
          verified_purchase: boolean | null
        }
        Insert: {
          created_at?: string
          helpful_count?: number | null
          id?: string
          photos?: Json | null
          product_id: string
          rating: number
          review_text: string
          review_title: string
          updated_at?: string
          user_id?: string | null
          verified_purchase?: boolean | null
        }
        Update: {
          created_at?: string
          helpful_count?: number | null
          id?: string
          photos?: Json | null
          product_id?: string
          rating?: number
          review_text?: string
          review_title?: string
          updated_at?: string
          user_id?: string | null
          verified_purchase?: boolean | null
        }
        Relationships: []
      }
      product_views: {
        Row: {
          id: string
          product_id: string | null
          referrer_url: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
          viewed_at: string | null
        }
        Insert: {
          id?: string
          product_id?: string | null
          referrer_url?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
          viewed_at?: string | null
        }
        Update: {
          id?: string
          product_id?: string | null
          referrer_url?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_views_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "affiliate_products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          duration: string | null
          features: Json | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          price_wellcoins: number
          price_zar: number
          provider: string
          stock: number | null
          type: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          duration?: string | null
          features?: Json | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          price_wellcoins: number
          price_zar: number
          provider: string
          stock?: number | null
          type: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          duration?: string | null
          features?: Json | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          price_wellcoins?: number
          price_zar?: number
          provider?: string
          stock?: number | null
          type?: string
          updated_at?: string | null
        }
        Relationships: []
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
      provider_media: {
        Row: {
          active: boolean | null
          created_at: string
          description: string | null
          duration_seconds: number | null
          featured: boolean | null
          file_size: number | null
          id: string
          media_type: string
          media_url: string
          provider_id: string
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          featured?: boolean | null
          file_size?: number | null
          id?: string
          media_type: string
          media_url: string
          provider_id: string
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          featured?: boolean | null
          file_size?: number | null
          id?: string
          media_type?: string
          media_url?: string
          provider_id?: string
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "provider_media_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "provider_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_posts: {
        Row: {
          category: string | null
          content: string
          created_at: string
          excerpt: string | null
          featured: boolean | null
          featured_image_url: string | null
          id: string
          provider_id: string
          published: boolean | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string
          excerpt?: string | null
          featured?: boolean | null
          featured_image_url?: string | null
          id?: string
          provider_id: string
          published?: boolean | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          featured?: boolean | null
          featured_image_url?: string | null
          id?: string
          provider_id?: string
          published?: boolean | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "provider_posts_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "provider_profiles"
            referencedColumns: ["id"]
          },
        ]
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
          {
            foreignKeyName: "provider_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_roles: {
        Row: {
          created_at: string | null
          id: string
          permissions: string[]
          provider_id: string
          role: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          permissions?: string[]
          provider_id: string
          role: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          permissions?: string[]
          provider_id?: string
          role?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_roles_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "provider_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_testimonials: {
        Row: {
          approved: boolean | null
          client_image_url: string | null
          client_name: string
          created_at: string
          featured: boolean | null
          id: string
          provider_id: string
          rating: number | null
          service_type: string | null
          testimonial_text: string
          updated_at: string
        }
        Insert: {
          approved?: boolean | null
          client_image_url?: string | null
          client_name: string
          created_at?: string
          featured?: boolean | null
          id?: string
          provider_id: string
          rating?: number | null
          service_type?: string | null
          testimonial_text: string
          updated_at?: string
        }
        Update: {
          approved?: boolean | null
          client_image_url?: string | null
          client_name?: string
          created_at?: string
          featured?: boolean | null
          id?: string
          provider_id?: string
          rating?: number | null
          service_type?: string | null
          testimonial_text?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_testimonials_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "provider_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_websites: {
        Row: {
          about_section: string | null
          auto_publish: boolean | null
          branding_config: Json | null
          contact_section_title: string | null
          created_at: string
          custom_css: string | null
          custom_css_override: string | null
          custom_domain: string | null
          duda_created_at: string | null
          duda_external_id: string | null
          duda_last_published: string | null
          duda_site_name: string | null
          duda_site_url: string | null
          duda_stats: Json | null
          duda_template_id: string | null
          facebook_pixel_id: string | null
          google_analytics_id: string | null
          hero_image_url: string | null
          hero_video_url: string | null
          id: string
          page_subtitle: string | null
          page_title: string
          provider_id: string
          published: boolean | null
          seo_meta_description: string | null
          seo_meta_title: string | null
          services_section_title: string | null
          site_status: string | null
          testimonials_section_title: string | null
          theme_color: string | null
          updated_at: string
        }
        Insert: {
          about_section?: string | null
          auto_publish?: boolean | null
          branding_config?: Json | null
          contact_section_title?: string | null
          created_at?: string
          custom_css?: string | null
          custom_css_override?: string | null
          custom_domain?: string | null
          duda_created_at?: string | null
          duda_external_id?: string | null
          duda_last_published?: string | null
          duda_site_name?: string | null
          duda_site_url?: string | null
          duda_stats?: Json | null
          duda_template_id?: string | null
          facebook_pixel_id?: string | null
          google_analytics_id?: string | null
          hero_image_url?: string | null
          hero_video_url?: string | null
          id?: string
          page_subtitle?: string | null
          page_title?: string
          provider_id: string
          published?: boolean | null
          seo_meta_description?: string | null
          seo_meta_title?: string | null
          services_section_title?: string | null
          site_status?: string | null
          testimonials_section_title?: string | null
          theme_color?: string | null
          updated_at?: string
        }
        Update: {
          about_section?: string | null
          auto_publish?: boolean | null
          branding_config?: Json | null
          contact_section_title?: string | null
          created_at?: string
          custom_css?: string | null
          custom_css_override?: string | null
          custom_domain?: string | null
          duda_created_at?: string | null
          duda_external_id?: string | null
          duda_last_published?: string | null
          duda_site_name?: string | null
          duda_site_url?: string | null
          duda_stats?: Json | null
          duda_template_id?: string | null
          facebook_pixel_id?: string | null
          google_analytics_id?: string | null
          hero_image_url?: string | null
          hero_video_url?: string | null
          id?: string
          page_subtitle?: string | null
          page_title?: string
          provider_id?: string
          published?: boolean | null
          seo_meta_description?: string | null
          seo_meta_title?: string | null
          services_section_title?: string | null
          site_status?: string | null
          testimonials_section_title?: string | null
          theme_color?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_websites_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: true
            referencedRelation: "provider_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      resources: {
        Row: {
          access_level: string | null
          category: string
          created_at: string | null
          description: string | null
          display_order: number | null
          download_count: number | null
          file_size_bytes: number | null
          file_type: string
          file_url: string
          id: string
          is_featured: boolean | null
          is_published: boolean | null
          metadata: Json | null
          published_at: string | null
          search_vector: unknown
          seo_keywords: string[] | null
          subcategory: string | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          access_level?: string | null
          category: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          download_count?: number | null
          file_size_bytes?: number | null
          file_type: string
          file_url: string
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          metadata?: Json | null
          published_at?: string | null
          search_vector?: unknown
          seo_keywords?: string[] | null
          subcategory?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          access_level?: string | null
          category?: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          download_count?: number | null
          file_size_bytes?: number | null
          file_type?: string
          file_url?: string
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          metadata?: Json | null
          published_at?: string | null
          search_vector?: unknown
          seo_keywords?: string[] | null
          subcategory?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      review_helpfulness: {
        Row: {
          created_at: string
          id: string
          is_helpful: boolean
          review_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_helpful: boolean
          review_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_helpful?: boolean
          review_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "review_helpfulness_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "product_reviews"
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
            foreignKeyName: "reviews_reviewee_id_fkey"
            columns: ["reviewee_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      roambuddy_services: {
        Row: {
          active: boolean | null
          category: string | null
          created_at: string
          description: string | null
          destination: string | null
          id: string
          last_synced: string | null
          name: string
          price: number
          service_id: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          category?: string | null
          created_at?: string
          description?: string | null
          destination?: string | null
          id?: string
          last_synced?: string | null
          name: string
          price: number
          service_id: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          category?: string | null
          created_at?: string
          description?: string | null
          destination?: string | null
          id?: string
          last_synced?: string | null
          name?: string
          price?: number
          service_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      scheduled_social_posts: {
        Row: {
          campaign_name: string | null
          content_pillar: Database["public"]["Enums"]["content_pillar"] | null
          content_text: string
          created_at: string
          created_by: string | null
          error_message: string | null
          hashtags: string[] | null
          id: string
          image_url: string | null
          link_url: string | null
          platforms: Database["public"]["Enums"]["social_platform"][]
          posted_at: string | null
          scheduled_date: string
          scheduled_time: string
          status: Database["public"]["Enums"]["post_status"]
          updated_at: string
          zapier_webhook_url: string | null
        }
        Insert: {
          campaign_name?: string | null
          content_pillar?: Database["public"]["Enums"]["content_pillar"] | null
          content_text: string
          created_at?: string
          created_by?: string | null
          error_message?: string | null
          hashtags?: string[] | null
          id?: string
          image_url?: string | null
          link_url?: string | null
          platforms?: Database["public"]["Enums"]["social_platform"][]
          posted_at?: string | null
          scheduled_date: string
          scheduled_time?: string
          status?: Database["public"]["Enums"]["post_status"]
          updated_at?: string
          zapier_webhook_url?: string | null
        }
        Update: {
          campaign_name?: string | null
          content_pillar?: Database["public"]["Enums"]["content_pillar"] | null
          content_text?: string
          created_at?: string
          created_by?: string | null
          error_message?: string | null
          hashtags?: string[] | null
          id?: string
          image_url?: string | null
          link_url?: string | null
          platforms?: Database["public"]["Enums"]["social_platform"][]
          posted_at?: string | null
          scheduled_date?: string
          scheduled_time?: string
          status?: Database["public"]["Enums"]["post_status"]
          updated_at?: string
          zapier_webhook_url?: string | null
        }
        Relationships: []
      }
      security_events: {
        Row: {
          details: Json | null
          event_type: string
          id: string
          resolved: boolean | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          details?: Json | null
          event_type: string
          id?: string
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity: string
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          details?: Json | null
          event_type?: string
          id?: string
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      service_quotes: {
        Row: {
          budget_range: string | null
          company: string | null
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          project_details: string
          service_type: string
          status: string | null
          timeline: string | null
        }
        Insert: {
          budget_range?: string | null
          company?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          phone?: string | null
          project_details: string
          service_type: string
          status?: string | null
          timeline?: string | null
        }
        Update: {
          budget_range?: string | null
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          project_details?: string
          service_type?: string
          status?: string | null
          timeline?: string | null
        }
        Relationships: []
      }
      service_time_slots: {
        Row: {
          created_at: string | null
          day_of_week: number | null
          end_time: string
          id: string
          is_available: boolean | null
          max_bookings_per_slot: number | null
          service_id: string | null
          slot_duration_minutes: number | null
          start_time: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          day_of_week?: number | null
          end_time: string
          id?: string
          is_available?: boolean | null
          max_bookings_per_slot?: number | null
          service_id?: string | null
          slot_duration_minutes?: number | null
          start_time: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          day_of_week?: number | null
          end_time?: string
          id?: string
          is_available?: boolean | null
          max_bookings_per_slot?: number | null
          service_id?: string | null
          slot_duration_minutes?: number | null
          start_time?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_time_slots_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
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
      social_automation_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          setting_key: string
          setting_value: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key: string
          setting_value: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: string
          updated_at?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          created_at: string | null
          department: string | null
          email: string
          id: string
          invited_by: string | null
          is_active: boolean | null
          last_login: string | null
          name: string
          permissions: string[] | null
          role: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          email: string
          id?: string
          invited_by?: string | null
          is_active?: boolean | null
          last_login?: string | null
          name: string
          permissions?: string[] | null
          role?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string | null
          email?: string
          id?: string
          invited_by?: string | null
          is_active?: boolean | null
          last_login?: string | null
          name?: string
          permissions?: string[] | null
          role?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      tour_bookings: {
        Row: {
          booking_date: string
          contact_email: string
          contact_name: string
          contact_phone: string | null
          created_at: string
          id: string
          participants: number
          payment_status: string | null
          roambuddy_booking_id: string | null
          roambuddy_services: Json | null
          special_requirements: string | null
          status: string
          total_price: number
          tour_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          booking_date: string
          contact_email: string
          contact_name: string
          contact_phone?: string | null
          created_at?: string
          id?: string
          participants?: number
          payment_status?: string | null
          roambuddy_booking_id?: string | null
          roambuddy_services?: Json | null
          special_requirements?: string | null
          status?: string
          total_price: number
          tour_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          booking_date?: string
          contact_email?: string
          contact_name?: string
          contact_phone?: string | null
          created_at?: string
          id?: string
          participants?: number
          payment_status?: string | null
          roambuddy_booking_id?: string | null
          roambuddy_services?: Json | null
          special_requirements?: string | null
          status?: string
          total_price?: number
          tour_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tour_bookings_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_categories: {
        Row: {
          active: boolean | null
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          image_url: string | null
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      tour_itineraries: {
        Row: {
          accommodation: string | null
          activities: string[] | null
          created_at: string
          day_number: number
          description: string
          id: string
          location: string | null
          meals_included: string[] | null
          title: string
          tour_id: string
        }
        Insert: {
          accommodation?: string | null
          activities?: string[] | null
          created_at?: string
          day_number: number
          description: string
          id?: string
          location?: string | null
          meals_included?: string[] | null
          title: string
          tour_id: string
        }
        Update: {
          accommodation?: string | null
          activities?: string[] | null
          created_at?: string
          day_number?: number
          description?: string
          id?: string
          location?: string | null
          meals_included?: string[] | null
          title?: string
          tour_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tour_itineraries_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_operator_availability: {
        Row: {
          available_date: string
          booked_capacity: number | null
          created_at: string | null
          end_time: string | null
          external_calendar_sync: string | null
          external_event_id: string | null
          id: string
          max_capacity: number | null
          notes: string | null
          operator_id: string
          start_time: string | null
          status: string | null
          tour_id: string | null
          updated_at: string | null
        }
        Insert: {
          available_date: string
          booked_capacity?: number | null
          created_at?: string | null
          end_time?: string | null
          external_calendar_sync?: string | null
          external_event_id?: string | null
          id?: string
          max_capacity?: number | null
          notes?: string | null
          operator_id: string
          start_time?: string | null
          status?: string | null
          tour_id?: string | null
          updated_at?: string | null
        }
        Update: {
          available_date?: string
          booked_capacity?: number | null
          created_at?: string | null
          end_time?: string | null
          external_calendar_sync?: string | null
          external_event_id?: string | null
          id?: string
          max_capacity?: number | null
          notes?: string | null
          operator_id?: string
          start_time?: string | null
          status?: string | null
          tour_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tour_operator_availability_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_testimonials: {
        Row: {
          approved: boolean | null
          created_at: string
          featured: boolean | null
          id: string
          image_url: string | null
          name: string
          rating: number | null
          testimonial_text: string
          title: string | null
          tour_id: string
          updated_at: string
        }
        Insert: {
          approved?: boolean | null
          created_at?: string
          featured?: boolean | null
          id?: string
          image_url?: string | null
          name: string
          rating?: number | null
          testimonial_text: string
          title?: string | null
          tour_id: string
          updated_at?: string
        }
        Update: {
          approved?: boolean | null
          created_at?: string
          featured?: boolean | null
          id?: string
          image_url?: string | null
          name?: string
          rating?: number | null
          testimonial_text?: string
          title?: string | null
          tour_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tour_testimonials_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tours: {
        Row: {
          active: boolean | null
          booking_mode: string | null
          cancellation_policy: string | null
          category_id: string
          created_at: string
          deposit_amount_zar: number | null
          deposit_percentage: number | null
          destination: string
          difficulty_level: string | null
          duration: string
          exclusions: string[] | null
          featured: boolean | null
          hero_image_url: string | null
          highlights: string[] | null
          id: string
          image_gallery: string[] | null
          inclusions: string[] | null
          max_participants: number
          min_notice_hours: number | null
          operator_id: string | null
          overview: string | null
          price_from: number
          requires_deposit: boolean | null
          slug: string
          subtitle: string | null
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          booking_mode?: string | null
          cancellation_policy?: string | null
          category_id: string
          created_at?: string
          deposit_amount_zar?: number | null
          deposit_percentage?: number | null
          destination: string
          difficulty_level?: string | null
          duration: string
          exclusions?: string[] | null
          featured?: boolean | null
          hero_image_url?: string | null
          highlights?: string[] | null
          id?: string
          image_gallery?: string[] | null
          inclusions?: string[] | null
          max_participants?: number
          min_notice_hours?: number | null
          operator_id?: string | null
          overview?: string | null
          price_from: number
          requires_deposit?: boolean | null
          slug: string
          subtitle?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          booking_mode?: string | null
          cancellation_policy?: string | null
          category_id?: string
          created_at?: string
          deposit_amount_zar?: number | null
          deposit_percentage?: number | null
          destination?: string
          difficulty_level?: string | null
          duration?: string
          exclusions?: string[] | null
          featured?: boolean | null
          hero_image_url?: string | null
          highlights?: string[] | null
          id?: string
          image_gallery?: string[] | null
          inclusions?: string[] | null
          max_participants?: number
          min_notice_hours?: number | null
          operator_id?: string | null
          overview?: string | null
          price_from?: number
          requires_deposit?: boolean | null
          slug?: string
          subtitle?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tours_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "tour_categories"
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
            foreignKeyName: "transactions_related_user_id_fkey"
            columns: ["related_user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_wishlists: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_wishlists_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "affiliate_products"
            referencedColumns: ["id"]
          },
        ]
      }
      uwc_programme_leads: {
        Row: {
          assigned_to: string | null
          channel: string
          cohort: string | null
          country: string | null
          created_at: string
          email: string
          follow_up_count: number | null
          id: string
          institution: string | null
          is_international: boolean | null
          last_contact_date: string | null
          name: string
          next_follow_up_date: string | null
          notes: string | null
          phone: string | null
          source: string | null
          stage: string
          updated_at: string
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          assigned_to?: string | null
          channel: string
          cohort?: string | null
          country?: string | null
          created_at?: string
          email: string
          follow_up_count?: number | null
          id?: string
          institution?: string | null
          is_international?: boolean | null
          last_contact_date?: string | null
          name: string
          next_follow_up_date?: string | null
          notes?: string | null
          phone?: string | null
          source?: string | null
          stage?: string
          updated_at?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          assigned_to?: string | null
          channel?: string
          cohort?: string | null
          country?: string | null
          created_at?: string
          email?: string
          follow_up_count?: number | null
          id?: string
          institution?: string | null
          is_international?: boolean | null
          last_contact_date?: string | null
          name?: string
          next_follow_up_date?: string | null
          notes?: string | null
          phone?: string | null
          source?: string | null
          stage?: string
          updated_at?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
      viator_tours: {
        Row: {
          availability: string | null
          booking_url: string | null
          cancellation_policy: string | null
          category: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          duration: string | null
          exclusions: Json | null
          highlights: Json | null
          id: string
          image_url: string | null
          inclusions: Json | null
          is_active: boolean | null
          last_synced_at: string | null
          location: string | null
          price_from: number | null
          rating: number | null
          review_count: number | null
          title: string
          updated_at: string | null
          viator_product_code: string
        }
        Insert: {
          availability?: string | null
          booking_url?: string | null
          cancellation_policy?: string | null
          category?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          duration?: string | null
          exclusions?: Json | null
          highlights?: Json | null
          id?: string
          image_url?: string | null
          inclusions?: Json | null
          is_active?: boolean | null
          last_synced_at?: string | null
          location?: string | null
          price_from?: number | null
          rating?: number | null
          review_count?: number | null
          title: string
          updated_at?: string | null
          viator_product_code: string
        }
        Update: {
          availability?: string | null
          booking_url?: string | null
          cancellation_policy?: string | null
          category?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          duration?: string | null
          exclusions?: Json | null
          highlights?: Json | null
          id?: string
          image_url?: string | null
          inclusions?: Json | null
          is_active?: boolean | null
          last_synced_at?: string | null
          location?: string | null
          price_from?: number | null
          rating?: number | null
          review_count?: number | null
          title?: string
          updated_at?: string | null
          viator_product_code?: string
        }
        Relationships: []
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
          {
            foreignKeyName: "wants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      website_ai_content: {
        Row: {
          content_type: string
          created_at: string | null
          generated_content: string
          generation_time_ms: number | null
          id: string
          is_applied: boolean | null
          model_used: string | null
          prompt_used: string | null
          provider_id: string | null
          rating: number | null
          tokens_used: number | null
          website_id: string | null
        }
        Insert: {
          content_type: string
          created_at?: string | null
          generated_content: string
          generation_time_ms?: number | null
          id?: string
          is_applied?: boolean | null
          model_used?: string | null
          prompt_used?: string | null
          provider_id?: string | null
          rating?: number | null
          tokens_used?: number | null
          website_id?: string | null
        }
        Update: {
          content_type?: string
          created_at?: string | null
          generated_content?: string
          generation_time_ms?: number | null
          id?: string
          is_applied?: boolean | null
          model_used?: string | null
          prompt_used?: string | null
          provider_id?: string | null
          rating?: number | null
          tokens_used?: number | null
          website_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "website_ai_content_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "provider_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "website_ai_content_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "provider_websites"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      public_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string | null
          user_type: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string | null
          user_type?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string | null
          user_type?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      auto_curate_awin_products: { Args: never; Returns: undefined }
      auto_curate_featured_products: { Args: never; Returns: undefined }
      check_contact_rate_limit: {
        Args: { submitter_email: string }
        Returns: boolean
      }
      check_quote_rate_limit: {
        Args: { submitter_email: string }
        Returns: boolean
      }
      cleanup_expired_leases: { Args: never; Returns: undefined }
      ensure_provider_profile: { Args: { user_id: string }; Returns: undefined }
      generate_confirmation_code: { Args: never; Returns: string }
      generate_order_number: { Args: never; Returns: string }
      get_tour_availability: {
        Args: { p_date: string; p_tour_id: string }
        Returns: {
          available_capacity: number
          end_time: string
          start_time: string
          status: string
          total_capacity: number
        }[]
      }
      has_role: {
        Args: { role: Database["public"]["Enums"]["app_role"]; user_id: string }
        Returns: boolean
      }
      increment_resource_download: {
        Args: { resource_id: string }
        Returns: undefined
      }
      is_admin: { Args: { user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "super_admin" | "user"
      content_pillar: "inspiration" | "education" | "empowerment" | "wellness"
      newsletter_status: "draft" | "scheduled" | "sending" | "sent" | "failed"
      post_status: "draft" | "scheduled" | "posted" | "failed"
      social_platform:
        | "facebook"
        | "instagram"
        | "tiktok"
        | "linkedin"
        | "twitter"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "super_admin", "user"],
      content_pillar: ["inspiration", "education", "empowerment", "wellness"],
      newsletter_status: ["draft", "scheduled", "sending", "sent", "failed"],
      post_status: ["draft", "scheduled", "posted", "failed"],
      social_platform: [
        "facebook",
        "instagram",
        "tiktok",
        "linkedin",
        "twitter",
      ],
    },
  },
} as const
