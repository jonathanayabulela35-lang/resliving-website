# ResLiving Website

This project is the Supabase-backed website for ResLiving.

## Environment variables

Create a `.env` file in the project root with:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Run locally

```bash
npm install
npm run dev
```

## Notes

This project expects Supabase tables compatible with the ResLiving backend, especially:

- `residences`
- `units`

And a storage bucket named:

- `app-uploads`

House rules PDFs are uploaded under the `house-rules` folder in that bucket.
