export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          mobile: string | null;
          country_code: string | null;
          profile_picture_url: string | null;
          subscribe_newsletter: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          mobile?: string | null;
          country_code?: string | null;
          profile_picture_url?: string | null;
          subscribe_newsletter?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          mobile?: string | null;
          country_code?: string | null;
          profile_picture_url?: string | null;
          subscribe_newsletter?: boolean;
          updated_at?: string;
        };
      };
      calendar_events: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          start_time: string;
          end_time: string;
          color: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          start_time: string;
          end_time: string;
          color?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          start_time?: string;
          end_time?: string;
          color?: string;
          updated_at?: string;
        };
      };
      user_preferences: {
        Row: {
          id: string;
          user_id: string;
          personal_info: Record<string, any> | null;
          academic_preferences: Record<string, any> | null;
          goals: Record<string, any> | null;
          budget: Record<string, any> | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          personal_info?: Record<string, any> | null;
          academic_preferences?: Record<string, any> | null;
          goals?: Record<string, any> | null;
          budget?: Record<string, any> | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          personal_info?: Record<string, any> | null;
          academic_preferences?: Record<string, any> | null;
          goals?: Record<string, any> | null;
          budget?: Record<string, any> | null;
          updated_at?: string;
        };
      };
      chat_messages: {
        Row: {
          id: string;
          user_id: string;
          role: "user" | "assistant";
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role: "user" | "assistant";
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          role?: "user" | "assistant";
          content?: string;
        };
      };
      dashboard_stats: {
        Row: {
          id: string;
          user_id: string;
          academics_count: number;
          research_work_count: number;
          competitions_count: number;
          universities_shortlisted: number;
          extracurriculars_count: number;
          summer_courses_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          academics_count?: number;
          research_work_count?: number;
          competitions_count?: number;
          universities_shortlisted?: number;
          extracurriculars_count?: number;
          summer_courses_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          academics_count?: number;
          research_work_count?: number;
          competitions_count?: number;
          universities_shortlisted?: number;
          extracurriculars_count?: number;
          summer_courses_count?: number;
          updated_at?: string;
        };
      };
    };
  };
}

