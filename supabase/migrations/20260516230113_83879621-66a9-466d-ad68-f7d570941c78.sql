
-- Replace handle_new_user so first signup becomes admin
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _name TEXT;
  _initials TEXT;
  _has_admin BOOLEAN;
  _role public.app_role;
  _label TEXT;
BEGIN
  _name := COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1));
  _initials := upper(substring(_name from 1 for 1)) ||
               COALESCE(upper(substring(split_part(_name, ' ', 2) from 1 for 1)), '');

  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') INTO _has_admin;
  IF _has_admin THEN
    _role := 'recruiter'; _label := 'Recruiter';
  ELSE
    _role := 'admin'; _label := 'Admin';
  END IF;

  INSERT INTO public.profiles (id, full_name, initials, role_label)
  VALUES (NEW.id, _name, _initials, _label);
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, _role);
  RETURN NEW;
END $$;

-- RPC for admins to change a teammate's role
CREATE OR REPLACE FUNCTION public.set_user_role(target_user uuid, new_role public.app_role)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _admin_count INT;
  _target_is_admin BOOLEAN;
  _label TEXT;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can change roles';
  END IF;

  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = target_user AND role = 'admin')
    INTO _target_is_admin;

  IF _target_is_admin AND new_role <> 'admin' THEN
    SELECT count(*) INTO _admin_count FROM public.user_roles WHERE role = 'admin';
    IF _admin_count <= 1 THEN
      RAISE EXCEPTION 'Cannot demote the last remaining admin';
    END IF;
  END IF;

  DELETE FROM public.user_roles WHERE user_id = target_user;
  INSERT INTO public.user_roles (user_id, role) VALUES (target_user, new_role);

  _label := CASE new_role
    WHEN 'admin' THEN 'Admin'
    WHEN 'manager' THEN 'Manager'
    ELSE 'Recruiter'
  END;
  UPDATE public.profiles SET role_label = _label WHERE id = target_user;
END $$;

REVOKE EXECUTE ON FUNCTION public.set_user_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.set_user_role(uuid, public.app_role) TO authenticated;
