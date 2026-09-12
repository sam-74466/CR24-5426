-- Run this AFTER creating the tables. Replace the email with your real admin email.
-- Then create that admin user in Supabase Authentication > Users.

CREATE POLICY "Admin can read rescue requests"
ON public.rescue_requests FOR SELECT TO authenticated
USING ((auth.jwt() ->> 'email') = ''carrescuehelp24@gmail.com'');

CREATE POLICY "Admin can update rescue requests"
ON public.rescue_requests FOR UPDATE TO authenticated
USING ((auth.jwt() ->> 'email') = ''carrescuehelp24@gmail.com'')
WITH CHECK ((auth.jwt() ->> 'email') = ''carrescuehelp24@gmail.com'');

CREATE POLICY "Admin can read enquiries"
ON public.enquiries FOR SELECT TO authenticated
USING ((auth.jwt() ->> 'email') = ''carrescuehelp24@gmail.com'');

-- Optional customer table access for admin only:
CREATE POLICY "Admin can read customers"
ON public.customers FOR SELECT TO authenticated
USING ((auth.jwt() ->> 'email') = ''carrescuehelp24@gmail.com'');
