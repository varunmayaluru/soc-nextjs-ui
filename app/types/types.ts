export type Organization = {
  id: number;
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
  organization_id: number;
  id: number;
  subject_name: string;
  slug: string;
  is_active: boolean;
  created_by: number;
  create_date_time: string;
  update_date_time: string;
};
