
-- Create tables
CREATE TABLE public.ai_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  system_prompt text NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT ai_settings_pkey PRIMARY KEY (id),
  CONSTRAINT ai_settings_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

CREATE TABLE public.interactions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  message text NULL,
  response text NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT interactions_pkey PRIMARY KEY (id),
  CONSTRAINT interactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

CREATE TABLE public.users (
  id uuid NOT NULL,
  facebook_page_id text NULL,
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);

-- Function to create a user profile
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id)
  values (new.id);
  return new;
end;
$$;

-- Trigger to create a user profile
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Enable RLS for all tables
ALTER TABLE public.ai_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies for ai_settings
CREATE POLICY "Users can select their own ai_settings"
  ON public.ai_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own ai_settings"
  ON public.ai_settings FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policies for interactions
CREATE POLICY "Users can select their own interactions"
  ON public.interactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own interactions"
    ON public.interactions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own interactions"
    ON public.interactions FOR UPDATE
    USING (auth.uid() = user_id);

-- Create policies for users
CREATE POLICY "Users can select their own user data"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

-- Admin access (optional, if you have an admin role)
-- This assumes you have a 'role' in the auth.users metadata
CREATE POLICY "Admins can access all data"
  ON public.ai_settings FOR ALL
  USING (auth.jwt()->>'role' = 'admin');

CREATE POLICY "Admins can access all data"
  ON public.interactions FOR ALL
  USING (auth.jwt()->>'role' = 'admin');

CREATE POLICY "Admins can access all data"
    ON public.users FOR ALL
    USING (auth.jwt()->>'role' = 'admin');
