ALTER TABLE public.messages
  ADD COLUMN connection_id INTEGER REFERENCES public.connections(id) ON DELETE CASCADE;
