export type Organization = {
  organization_id: number;
  organization_name: string;
  slug: string;
  description: string;
  timezone: string;
  is_active: boolean;
  create_date_time: string;
  update_date_time: string;
  created_by: string;
};

 export type Subject = {
  id: number
  name: string
  category: string
  totalTopics: number
  createdAt: string
  
}

