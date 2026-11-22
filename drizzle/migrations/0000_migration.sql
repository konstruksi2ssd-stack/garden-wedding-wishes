CREATE TABLE public.wishes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(btrim(name)) BETWEEN 1 AND 60),
  attend text NOT NULL DEFAULT 'Hadir' CHECK (attend IN ('Hadir', 'Tidak Hadir', 'Masih Ragu')),
  guests integer NOT NULL DEFAULT 1 CHECK (guests BETWEEN 1 AND 10),
  message text NOT NULL CHECK (char_length(btrim(message)) BETWEEN 1 AND 500),
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.wishes TO anon, authenticated;
GRANT ALL ON public.wishes TO service_role;

ALTER TABLE public.wishes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read wishes" ON public.wishes FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can send a wish" ON public.wishes FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE INDEX wishes_created_at_idx ON public.wishes (created_at DESC);

ALTER PUBLICATION supabase_realtime ADD TABLE public.wishes;