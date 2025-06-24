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

export type User = {
  email: string;
  first_name: string;
  last_name: string;
  user_id: string;
  organization_id: string;
  role: string;
  is_active: boolean;
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

export type SubjectProgress = {
  id: number;
  name: string;
  category: string;
  slug: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  progress: number;
  progressColor: string;
  completedLessons: number;
  totalLessons: number;
};

export type Topic = {
  organization_id: number;
  subject_id: number;
  slug: string;
  id: number;
  topic_name: string;
  is_active: boolean;
  created_by: string;
  create_date_time: string;
  update_date_time: string;
};

export type TopicProgress = {
  id: number;
  name: string;
  category: string;
  slug: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  progress: number;
  progressColor: string;
  completedLessons: number;
  totalLessons: number;
};
