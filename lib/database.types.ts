// Auto-genererad från Supabase-projektet "plugg hjälp" (rwfsqjbtyuqvrhbwxmqn).
// Kör om vid schemaändringar: Supabase MCP -> generate_typescript_types,
// eller lokalt: npx supabase gen types typescript --project-id rwfsqjbtyuqvrhbwxmqn

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
    public: {
    Tables: {
      answers: {
        Row: {
          attempt_id: string;
          correct: boolean | null;
          created_at: string;
          id: string;
          question_id: string;
          response_time: number | null;
          selected_answer: string | null;
        };
        Insert: {
          attempt_id: string;
          correct?: boolean | null;
          created_at?: string;
          id?: string;
          question_id: string;
          response_time?: number | null;
          selected_answer?: string | null;
        };
        Update: {
          attempt_id?: string;
          correct?: boolean | null;
          created_at?: string;
          id?: string;
          question_id?: string;
          response_time?: number | null;
          selected_answer?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "answers_attempt_id_fkey";
            columns: ["attempt_id"];
            isOneToOne: false;
            referencedRelation: "attempts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "answers_question_id_fkey";
            columns: ["question_id"];
            isOneToOne: false;
            referencedRelation: "questions";
            referencedColumns: ["id"];
          },
        ];
      };
      assignments: {
        Row: {
          assigned_at: string;
          assigned_by: string;
          due_date: string | null;
          id: string;
          status: Database["public"]["Enums"]["assignment_status"];
          student_id: string;
          study_set_id: string;
        };
        Insert: {
          assigned_at?: string;
          assigned_by: string;
          due_date?: string | null;
          id?: string;
          status?: Database["public"]["Enums"]["assignment_status"];
          student_id: string;
          study_set_id: string;
        };
        Update: {
          assigned_at?: string;
          assigned_by?: string;
          due_date?: string | null;
          id?: string;
          status?: Database["public"]["Enums"]["assignment_status"];
          student_id?: string;
          study_set_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "assignments_assigned_by_fkey";
            columns: ["assigned_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "assignments_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "assignments_study_set_id_fkey";
            columns: ["study_set_id"];
            isOneToOne: false;
            referencedRelation: "study_sets";
            referencedColumns: ["id"];
          },
        ];
      };
      attempts: {
        Row: {
          completed_at: string | null;
          id: string;
          score: number | null;
          started_at: string;
          student_id: string;
          study_set_id: string;
          total_questions: number | null;
        };
        Insert: {
          completed_at?: string | null;
          id?: string;
          score?: number | null;
          started_at?: string;
          student_id: string;
          study_set_id: string;
          total_questions?: number | null;
        };
        Update: {
          completed_at?: string | null;
          id?: string;
          score?: number | null;
          started_at?: string;
          student_id?: string;
          study_set_id?: string;
          total_questions?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "attempts_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "attempts_study_set_id_fkey";
            columns: ["study_set_id"];
            isOneToOne: false;
            referencedRelation: "study_sets";
            referencedColumns: ["id"];
          },
        ];
      };
      chapters: {
        Row: {
          created_at: string;
          id: string;
          subject_id: string;
          title: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          subject_id: string;
          title: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          subject_id?: string;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "chapters_subject_id_fkey";
            columns: ["subject_id"];
            isOneToOne: false;
            referencedRelation: "subjects";
            referencedColumns: ["id"];
          },
        ];
      };
      invitations: {
        Row: {
          accepted_at: string | null;
          admin_id: string;
          created_at: string;
          email: string;
          expires_at: string;
          grade_level: number | null;
          id: string;
          invite_token: string;
          status: Database["public"]["Enums"]["invitation_status"];
          student_name: string;
        };
        Insert: {
          accepted_at?: string | null;
          admin_id: string;
          created_at?: string;
          email: string;
          expires_at: string;
          grade_level?: number | null;
          id?: string;
          invite_token: string;
          status?: Database["public"]["Enums"]["invitation_status"];
          student_name: string;
        };
        Update: {
          accepted_at?: string | null;
          admin_id?: string;
          created_at?: string;
          email?: string;
          expires_at?: string;
          grade_level?: number | null;
          id?: string;
          invite_token?: string;
          status?: Database["public"]["Enums"]["invitation_status"];
          student_name?: string;
        };
        Relationships: [
          {
            foreignKeyName: "invitations_admin_id_fkey";
            columns: ["admin_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          admin_id: string | null;
          created_at: string;
          display_name: string;
          email: string;
          grade_level: number | null;
          id: string;
          role: Database["public"]["Enums"]["user_role"];
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          admin_id?: string | null;
          created_at?: string;
          display_name: string;
          email: string;
          grade_level?: number | null;
          id?: string;
          role: Database["public"]["Enums"]["user_role"];
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          admin_id?: string | null;
          created_at?: string;
          display_name?: string;
          email?: string;
          grade_level?: number | null;
          id?: string;
          role?: Database["public"]["Enums"]["user_role"];
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_admin_id_fkey";
            columns: ["admin_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      question_progress: {
        Row: {
          attempts: number;
          correct_count: number;
          incorrect_count: number;
          last_answered: string | null;
          mastery_level: string;
          question_id: string;
          student_id: string;
        };
        Insert: {
          attempts?: number;
          correct_count?: number;
          incorrect_count?: number;
          last_answered?: string | null;
          mastery_level?: string;
          question_id: string;
          student_id: string;
        };
        Update: {
          attempts?: number;
          correct_count?: number;
          incorrect_count?: number;
          last_answered?: string | null;
          mastery_level?: string;
          question_id?: string;
          student_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "question_progress_question_id_fkey";
            columns: ["question_id"];
            isOneToOne: false;
            referencedRelation: "questions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "question_progress_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      questions: {
        Row: {
          accepted_answers: Json | null;
          answer_options: Json | null;
          confidence_score: number | null;
          correct_answer: string;
          created_at: string;
          difficulty: string | null;
          explanation: string | null;
          grade_level: number | null;
          id: string;
          importance: Database["public"]["Enums"]["importance_level"];
          knowledge_unit: string | null;
          question: string;
          question_type: Database["public"]["Enums"]["question_type"];
          source_material_id: string | null;
          status: Database["public"]["Enums"]["question_status"];
          study_set_id: string;
          verification_status: Database["public"]["Enums"]["verification_status"];
        };
        Insert: {
          accepted_answers?: Json | null;
          answer_options?: Json | null;
          confidence_score?: number | null;
          correct_answer: string;
          created_at?: string;
          difficulty?: string | null;
          explanation?: string | null;
          grade_level?: number | null;
          id?: string;
          importance?: Database["public"]["Enums"]["importance_level"];
          knowledge_unit?: string | null;
          question: string;
          question_type: Database["public"]["Enums"]["question_type"];
          source_material_id?: string | null;
          status?: Database["public"]["Enums"]["question_status"];
          study_set_id: string;
          verification_status?: Database["public"]["Enums"]["verification_status"];
        };
        Update: {
          accepted_answers?: Json | null;
          answer_options?: Json | null;
          confidence_score?: number | null;
          correct_answer?: string;
          created_at?: string;
          difficulty?: string | null;
          explanation?: string | null;
          grade_level?: number | null;
          id?: string;
          importance?: Database["public"]["Enums"]["importance_level"];
          knowledge_unit?: string | null;
          question?: string;
          question_type?: Database["public"]["Enums"]["question_type"];
          source_material_id?: string | null;
          status?: Database["public"]["Enums"]["question_status"];
          study_set_id?: string;
          verification_status?: Database["public"]["Enums"]["verification_status"];
        };
        Relationships: [
          {
            foreignKeyName: "questions_source_material_id_fkey";
            columns: ["source_material_id"];
            isOneToOne: false;
            referencedRelation: "source_material";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "questions_study_set_id_fkey";
            columns: ["study_set_id"];
            isOneToOne: false;
            referencedRelation: "study_sets";
            referencedColumns: ["id"];
          },
        ];
      };
      source_material: {
        Row: {
          created_at: string;
          extracted_text: string | null;
          file_url: string | null;
          id: string;
          material_type: Database["public"]["Enums"]["material_type"];
          processing_status: Database["public"]["Enums"]["processing_status"];
          study_set_id: string;
        };
        Insert: {
          created_at?: string;
          extracted_text?: string | null;
          file_url?: string | null;
          id?: string;
          material_type: Database["public"]["Enums"]["material_type"];
          processing_status?: Database["public"]["Enums"]["processing_status"];
          study_set_id: string;
        };
        Update: {
          created_at?: string;
          extracted_text?: string | null;
          file_url?: string | null;
          id?: string;
          material_type?: Database["public"]["Enums"]["material_type"];
          processing_status?: Database["public"]["Enums"]["processing_status"];
          study_set_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "source_material_study_set_id_fkey";
            columns: ["study_set_id"];
            isOneToOne: false;
            referencedRelation: "study_sets";
            referencedColumns: ["id"];
          },
        ];
      };
      student_preferences: {
        Row: {
          add_support: boolean;
          adhd_support: boolean;
          animation_level: string;
          autism_support: boolean;
          concentration_support: boolean;
          created_at: string;
          dyslexia_support: boolean;
          feedback_mode: string;
          id: string;
          predictable_ui: boolean;
          questions_per_session: number;
          reading_aloud: boolean;
          sound_mode: string;
          student_id: string;
          study_optimization_mode: string | null;
          text_amount: string;
          text_size: string;
          updated_at: string;
          visual_effect_level: string;
        };
        Insert: {
          add_support?: boolean;
          adhd_support?: boolean;
          animation_level?: string;
          autism_support?: boolean;
          concentration_support?: boolean;
          created_at?: string;
          dyslexia_support?: boolean;
          feedback_mode?: string;
          id?: string;
          predictable_ui?: boolean;
          questions_per_session?: number;
          reading_aloud?: boolean;
          sound_mode?: string;
          student_id: string;
          study_optimization_mode?: string | null;
          text_amount?: string;
          text_size?: string;
          updated_at?: string;
          visual_effect_level?: string;
        };
        Update: {
          add_support?: boolean;
          adhd_support?: boolean;
          animation_level?: string;
          autism_support?: boolean;
          concentration_support?: boolean;
          created_at?: string;
          dyslexia_support?: boolean;
          feedback_mode?: string;
          id?: string;
          predictable_ui?: boolean;
          questions_per_session?: number;
          reading_aloud?: boolean;
          sound_mode?: string;
          student_id?: string;
          study_optimization_mode?: string | null;
          text_amount?: string;
          text_size?: string;
          updated_at?: string;
          visual_effect_level?: string;
        };
        Relationships: [
          {
            foreignKeyName: "student_preferences_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      study_sets: {
        Row: {
          admin_id: string;
          chapter_id: string;
          created_at: string;
          exam_date: string | null;
          grade_level: number | null;
          id: string;
          status: Database["public"]["Enums"]["study_set_status"];
          title: string;
          updated_at: string;
        };
        Insert: {
          admin_id: string;
          chapter_id: string;
          created_at?: string;
          exam_date?: string | null;
          grade_level?: number | null;
          id?: string;
          status?: Database["public"]["Enums"]["study_set_status"];
          title: string;
          updated_at?: string;
        };
        Update: {
          admin_id?: string;
          chapter_id?: string;
          created_at?: string;
          exam_date?: string | null;
          grade_level?: number | null;
          id?: string;
          status?: Database["public"]["Enums"]["study_set_status"];
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "study_sets_admin_id_fkey";
            columns: ["admin_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "study_sets_chapter_id_fkey";
            columns: ["chapter_id"];
            isOneToOne: false;
            referencedRelation: "chapters";
            referencedColumns: ["id"];
          },
        ];
      };
      subjects: {
        Row: {
          admin_id: string;
          created_at: string;
          id: string;
          name: string;
        };
        Insert: {
          admin_id: string;
          created_at?: string;
          id?: string;
          name: string;
        };
        Update: {
          admin_id?: string;
          created_at?: string;
          id?: string;
          name?: string;
        };
        Relationships: [
          {
            foreignKeyName: "subjects_admin_id_fkey";
            columns: ["admin_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      accept_invitation: { Args: { p_token: string }; Returns: string };
      current_profile_id: { Args: Record<PropertyKey, never>; Returns: string };
      get_invitation_by_token: {
        Args: { p_token: string };
        Returns: {
          email: string;
          expires_at: string;
          grade_level: number;
          status: Database["public"]["Enums"]["invitation_status"];
          student_name: string;
        }[];
      };
      is_admin: { Args: Record<PropertyKey, never>; Returns: boolean };
    };
    Enums: {
      assignment_status: "assigned" | "started" | "completed";
      importance_level: "high" | "medium" | "low";
      invitation_status: "pending" | "accepted" | "expired" | "cancelled";
      material_type: "image" | "pdf" | "pasted_text";
      processing_status:
        | "uploaded"
        | "processing"
        | "ready"
        | "needs_review"
        | "error";
      question_status: "draft" | "published";
      question_type:
        | "multiple_choice"
        | "true_false"
        | "short_answer"
        | "concept";
      study_set_status: "draft" | "published" | "archived";
      user_role: "admin" | "student";
      verification_status: "verified" | "needs_review" | "rejected";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database["public"];

export type Tables<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Row"];
export type TablesInsert<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Update"];
export type Enums<T extends keyof DefaultSchema["Enums"]> =
  DefaultSchema["Enums"][T];
