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
          affiliate_program_id: string
          affiliate_url: string
          category: string | null
          commission_rate: number | null
          created_at: string | null
          description: string | null
          external_product_id: string
          id: string
          image_url: string | null
          is_active: boolean | null
          last_synced_at: string | null
          name: string
          price_eur: number | null
          price_usd: number | null
          price_zar: number | null
        }
        Insert: {
          affiliate_program_id: string
          affiliate_url: string
          category?: string | null
          commission_rate?: number | null
          created_at?: string | null
          description?: string | null
          external_product_id: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          last_synced_at?: string | null
          name: string
          price_eur?: number | null
          price_usd?: number | null
          price_zar?: number | null
        }
        Update: {
          affiliate_program_id?: string
          affiliate_url?: string
          category?: string | null
          commission_rate?: number | null
          created_at?: string | null
          description?: string | null
          external_product_id?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          last_synced_at?: string | null
          name?: string
          price_eur?: number | null
          price_usd?: number | null
          price_zar?: number | null
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
          contact_section_title: string | null
          created_at: string
          custom_css: string | null
          custom_domain: string | null
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
          testimonials_section_title: string | null
          theme_color: string | null
          updated_at: string
        }
        Insert: {
          about_section?: string | null
          contact_section_title?: string | null
          created_at?: string
          custom_css?: string | null
          custom_domain?: string | null
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
          testimonials_section_title?: string | null
          theme_color?: string | null
          updated_at?: string
        }
        Update: {
          about_section?: string | null
          contact_section_title?: string | null
          created_at?: string
          custom_css?: string | null
          custom_domain?: string | null
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
          category_id: string
          created_at: string
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
          overview: string | null
          price_from: number
          slug: string
          subtitle: string | null
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          category_id: string
          created_at?: string
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
          overview?: string | null
          price_from: number
          slug: string
          subtitle?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          category_id?: string
          created_at?: string
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
          overview?: string | null
          price_from?: number
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
      check_contact_rate_limit: {
        Args: { submitter_email: string }
        Returns: boolean
      }
      check_quote_rate_limit: {
        Args: { submitter_email: string }
        Returns: boolean
      }
      ensure_provider_profile: { Args: { user_id: string }; Returns: undefined }
      generate_order_number: { Args: never; Returns: string }
      is_admin: { Args: { user_id: string }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
