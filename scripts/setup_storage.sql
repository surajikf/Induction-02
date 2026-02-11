
-- Enable Storage (This usually doesn't fail if already enabled, but bucket creation is key)
insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do nothing;

-- Drop existing policies to avoid conflicts (makes the script re-runnable)
drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Public Upload" on storage.objects;
drop policy if exists "Public Manage" on storage.objects;

-- Policy to allow public access to images (VIEW)
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'gallery' );

-- Policy to allow anyone (anon) to upload images (INSERT)
-- Since we use client-side masked auth, we effectively rely on the anon key.
create policy "Public Upload"
  on storage.objects for insert
  with check ( bucket_id = 'gallery' );

-- Policy for Update/Delete (Optional, for CMS management)
create policy "Public Manage"
  on storage.objects for all
  using ( bucket_id = 'gallery' )
  with check ( bucket_id = 'gallery' );
