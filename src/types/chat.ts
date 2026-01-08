export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  role: MessageRole;
  content: string;
  timestamp: number;
  imageUrl?: string; // Optional image attachment
}

export interface ChatAction {
  type:
    | 'update_personal_info'
    | 'add_experience'
    | 'update_experience'
    | 'add_education'
    | 'update_education'
    | 'update_skills'
    | 'update_style'
    | 'set_profile_image'
    | 'add_custom_section'
    | 'add_custom_section_item'
    | 'update_section_config'
    | 'update_layout_config'
    | 'reorder_sections'
    | 'set_custom_html';
  payload: any;
}

export interface ChatResponse {
  message: string;
  actions: ChatAction[];
}
