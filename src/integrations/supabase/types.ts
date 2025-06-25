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
      deliveries: {
        Row: {
          date: string
          destination: string
          driver: string
          id: number
          notes: string | null
          origin: string
          status: string
          time: string
          vehicle: string
        }
        Insert: {
          date: string
          destination: string
          driver: string
          id?: number
          notes?: string | null
          origin: string
          status: string
          time: string
          vehicle: string
        }
        Update: {
          date?: string
          destination?: string
          driver?: string
          id?: number
          notes?: string | null
          origin?: string
          status?: string
          time?: string
          vehicle?: string
        }
        Relationships: []
      }
      drivers: {
        Row: {
          address: string | null
          document_validity: string
          experience: string
          id: number
          license_type: string | null
          name: string
          phone: string | null
          status: string
          vehicles: string[] | null
        }
        Insert: {
          address?: string | null
          document_validity: string
          experience: string
          id?: number
          license_type?: string | null
          name: string
          phone?: string | null
          status: string
          vehicles?: string[] | null
        }
        Update: {
          address?: string | null
          document_validity?: string
          experience?: string
          id?: number
          license_type?: string | null
          name?: string
          phone?: string | null
          status?: string
          vehicles?: string[] | null
        }
        Relationships: []
      }
      inventory: {
        Row: {
          category: string
          id: number
          last_restock: string
          location: string
          name: string
          quantity: number
          reference: string
          status: string
        }
        Insert: {
          category: string
          id?: number
          last_restock: string
          location: string
          name: string
          quantity: number
          reference: string
          status: string
        }
        Update: {
          category?: string
          id?: number
          last_restock?: string
          location?: string
          name?: string
          quantity?: number
          reference?: string
          status?: string
        }
        Relationships: []
      }
      maintenance_tasks: {
        Row: {
          assigned_to: string
          completed_at: string | null
          created_at: string | null
          description: string
          due_date: string
          id: number
          notes: string | null
          priority: string
          status: string
          type: string
          vehicle: string
        }
        Insert: {
          assigned_to: string
          completed_at?: string | null
          created_at?: string | null
          description: string
          due_date: string
          id?: number
          notes?: string | null
          priority: string
          status: string
          type: string
          vehicle: string
        }
        Update: {
          assigned_to?: string
          completed_at?: string | null
          created_at?: string | null
          description?: string
          due_date?: string
          id?: number
          notes?: string | null
          priority?: string
          status?: string
          type?: string
          vehicle?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          amount: string
          client: string
          delivery_date: string
          destination: string
          id: number
          notes: string | null
          origin: string
          priority: string
          status: string
        }
        Insert: {
          amount: string
          client: string
          delivery_date: string
          destination: string
          id?: number
          notes?: string | null
          origin: string
          priority: string
          status: string
        }
        Update: {
          amount?: string
          client?: string
          delivery_date?: string
          destination?: string
          id?: number
          notes?: string | null
          origin?: string
          priority?: string
          status?: string
        }
        Relationships: []
      }
      time_tracking: {
        Row: {
          clock_in_time: string | null
          clock_out_time: string | null
          created_at: string | null
          date: string
          id: string
          updated_at: string | null
          user_email: string | null
          user_id: string
        }
        Insert: {
          clock_in_time?: string | null
          clock_out_time?: string | null
          created_at?: string | null
          date?: string
          id?: string
          updated_at?: string | null
          user_email?: string | null
          user_id: string
        }
        Update: {
          clock_in_time?: string | null
          clock_out_time?: string | null
          created_at?: string | null
          date?: string
          id?: string
          updated_at?: string | null
          user_email?: string | null
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          address: string | null
          cin: string | null
          city: string | null
          email: string
          id: number
          name: string
          role: string
        }
        Insert: {
          address?: string | null
          cin?: string | null
          city?: string | null
          email: string
          id?: number
          name: string
          role: string
        }
        Update: {
          address?: string | null
          cin?: string | null
          city?: string | null
          email?: string
          id?: number
          name?: string
          role?: string
        }
        Relationships: []
      }
      vehicle_positions: {
        Row: {
          created_at: string
          heading: number | null
          id: string
          latitude: number
          longitude: number
          speed: number | null
          timestamp: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          heading?: number | null
          id?: string
          latitude: number
          longitude: number
          speed?: number | null
          timestamp?: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          heading?: number | null
          id?: string
          latitude?: number
          longitude?: number
          speed?: number | null
          timestamp?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_positions_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["registration"]
          },
        ]
      }
      vehicles: {
        Row: {
          driver: string | null
          fuel_level: number
          id: number
          last_maintenance: string
          location: string | null
          next_maintenance: string
          registration: string
          status: string
          type: string
        }
        Insert: {
          driver?: string | null
          fuel_level: number
          id?: number
          last_maintenance: string
          location?: string | null
          next_maintenance: string
          registration: string
          status: string
          type: string
        }
        Update: {
          driver?: string | null
          fuel_level?: number
          id?: number
          last_maintenance?: string
          location?: string | null
          next_maintenance?: string
          registration?: string
          status?: string
          type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      simulate_vehicle_movement: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
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
