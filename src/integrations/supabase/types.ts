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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
