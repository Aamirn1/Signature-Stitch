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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      measurements: {
        Row: {
          chest: number | null
          collar: number | null
          created_at: string
          hip: number | null
          id: string
          inseam: number | null
          is_default: boolean
          label: string
          measurement_photo_url: string | null
          shirt_length: number | null
          shoulder: number | null
          sleeve_length: number | null
          trouser_length: number | null
          trouser_waist: number | null
          updated_at: string
          user_id: string
          waist: number | null
        }
        Insert: {
          chest?: number | null
          collar?: number | null
          created_at?: string
          hip?: number | null
          id?: string
          inseam?: number | null
          is_default?: boolean
          label?: string
          measurement_photo_url?: string | null
          shirt_length?: number | null
          shoulder?: number | null
          sleeve_length?: number | null
          trouser_length?: number | null
          trouser_waist?: number | null
          updated_at?: string
          user_id: string
          waist?: number | null
        }
        Update: {
          chest?: number | null
          collar?: number | null
          created_at?: string
          hip?: number | null
          id?: string
          inseam?: number | null
          is_default?: boolean
          label?: string
          measurement_photo_url?: string | null
          shirt_length?: number | null
          shoulder?: number | null
          sleeve_length?: number | null
          trouser_length?: number | null
          trouser_waist?: number | null
          updated_at?: string
          user_id?: string
          waist?: number | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          advance_amount: number
          created_at: string
          customer_address: string
          customer_city: string
          customer_email: string | null
          customer_name: string
          customer_phone: string
          id: string
          is_reseller: boolean
          items: Json
          notes: string | null
          payment_method: string
          payment_screenshot_url: string | null
          profit_amount: number | null
          remaining_amount: number
          status: string
          subtotal: number
          tracking_number: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          advance_amount: number
          created_at?: string
          customer_address: string
          customer_city: string
          customer_email?: string | null
          customer_name: string
          customer_phone: string
          id?: string
          is_reseller?: boolean
          items: Json
          notes?: string | null
          payment_method?: string
          payment_screenshot_url?: string | null
          profit_amount?: number | null
          remaining_amount: number
          status?: string
          subtotal: number
          tracking_number?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          advance_amount?: number
          created_at?: string
          customer_address?: string
          customer_city?: string
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string
          id?: string
          is_reseller?: boolean
          items?: Json
          notes?: string | null
          payment_method?: string
          payment_screenshot_url?: string | null
          profit_amount?: number | null
          remaining_amount?: number
          status?: string
          subtotal?: number
          tracking_number?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      partner_applications: {
        Row: {
          business_name: string
          city: string
          created_at: string
          id: string
          phone: string
          reason: string | null
          reviewed_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          business_name: string
          city: string
          created_at?: string
          id?: string
          phone: string
          reason?: string | null
          reviewed_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          business_name?: string
          city?: string
          created_at?: string
          id?: string
          phone?: string
          reason?: string | null
          reviewed_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      partner_orders: {
        Row: {
          base_price: number
          created_at: string
          customer_address: string | null
          customer_city: string | null
          customer_name: string | null
          customer_phone: string | null
          final_price: number | null
          id: string
          markup_amount: number
          measurement_id: string | null
          partner_id: string
          product_id: string
          product_name: string
          quantity: number
          status: string
          updated_at: string
        }
        Insert: {
          base_price: number
          created_at?: string
          customer_address?: string | null
          customer_city?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          final_price?: number | null
          id?: string
          markup_amount?: number
          measurement_id?: string | null
          partner_id: string
          product_id: string
          product_name: string
          quantity?: number
          status?: string
          updated_at?: string
        }
        Update: {
          base_price?: number
          created_at?: string
          customer_address?: string | null
          customer_city?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          final_price?: number | null
          id?: string
          markup_amount?: number
          measurement_id?: string | null
          partner_id?: string
          product_id?: string
          product_name?: string
          quantity?: number
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_orders_measurement_id_fkey"
            columns: ["measurement_id"]
            isOneToOne: false
            referencedRelation: "measurements"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_payouts: {
        Row: {
          account_number: string
          account_title: string
          amount: number
          created_at: string
          id: string
          notes: string | null
          partner_id: string
          payment_method: string
          processed_at: string | null
          status: string
        }
        Insert: {
          account_number: string
          account_title: string
          amount: number
          created_at?: string
          id?: string
          notes?: string | null
          partner_id: string
          payment_method?: string
          processed_at?: string | null
          status?: string
        }
        Update: {
          account_number?: string
          account_title?: string
          amount?: number
          created_at?: string
          id?: string
          notes?: string | null
          partner_id?: string
          payment_method?: string
          processed_at?: string | null
          status?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          category_slug: string
          created_at: string | null
          description: string | null
          features: Json | null
          id: string
          image_url: string
          is_active: boolean | null
          name: string
          price: number
          slug: string
          updated_at: string | null
        }
        Insert: {
          category_slug: string
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          image_url: string
          is_active?: boolean | null
          name: string
          price: number
          slug: string
          updated_at?: string | null
        }
        Update: {
          category_slug?: string
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          image_url?: string
          is_active?: boolean | null
          name?: string
          price?: number
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          city: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
