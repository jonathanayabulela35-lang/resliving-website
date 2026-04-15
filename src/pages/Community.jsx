import { useEffect, useMemo, useRef, useState } from 'react';
import { Newspaper, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ResidenceSelector from '../components/dashboard/ResidenceSelector';
import { useAuth } from '@/lib/AuthContext';
import { api } from '@/lib/api';
import { supabase } from '@/lib/supabase';

function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function Community() {
  const { user } = useAuth();

  const [residences, setResidences] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [posts, setPosts] = useState([]);
  const [type, setType] = useState('news');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [notice, setNotice] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user?.email) loadResidences();
  }, [user?.email]);

  useEffect(() => {
    if (selectedId) {
      loadPosts(selectedId);
    } else {
      setPosts([]);
    }
  }, [selectedId]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const selectedResidence = useMemo(
    () => residences.find((item) => item.id === selectedId),
    [residences, selectedId]
  );

  const loadResidences = async () => {
    try {
      const { data, error } = await supabase
        .from('residences')
        .select('*')
        .or(`owner_email.eq.${user.email},manager_email.eq.${user.email}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const allResidences = (data || []).map((row) => ({
        ...row,
        building_name: row.name,
      }));

      setResidences(allResidences);
      setSelectedId(allResidences.length > 0 ? allResidences[0].id : null);
    } finally {
      setLoading(false);
    }
  };

  const loadPosts = async (residenceId) => {
    try {
      setPostsLoading(true);
      const data = await api.entities.CommunityPost.filter(
        { residence_id: residenceId },
        '-created_date'
      );
      setPosts(data || []);
    } finally {
      setPostsLoading(false);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (previewUrl) URL.revokeObjectURL(previewUrl);

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const publishPost = async () => {
    try {
      if (!selectedId) {
        setNotice('Please select a building first.');
        return;
      }

      if (!title.trim() || !body.trim()) {
        setNotice('Please enter both a title and details.');
        return;
      }

      setPublishing(true);
      setNotice('');

      let image_url = '';

      if (imageFile) {
        const upload = await api.storage.uploadAsset({
          file: imageFile,
          category: 'community',
          residenceId: selectedId,
          userId: user.id,
        });
        image_url = upload.file_url;
      }

      await api.entities.CommunityPost.create({
        residence_id: selectedId,
        type,
        title: title.trim(),
        body: body.trim(),
        image_url,
        posted_by: user.email,
      });

      setType('news');
      setTitle('');
      setBody('');
      setImageFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl('');
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      await loadPosts(selectedId);
      setNotice('Post published successfully.');
    } catch (error) {
      setNotice(error.message || 'Failed to publish post.');
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Community</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Publish news and event posts for your residents.
          </p>
        </div>

        <ResidenceSelector
          residences={residences}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </div>

      <div className="rounded-2xl border border-border bg-background p-5 mb-6">
        <h2 className="text-base font-semibold text-foreground mb-4">
          New Community Post
        </h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">
              Post Type
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setType('news')}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  type === 'news'
                    ? 'bg-primary text-white'
                    : 'border border-border bg-card text-foreground hover:bg-muted'
                }`}
              >
                News
              </button>
              <button
                type="button"
                onClick={() => setType('event')}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  type === 'event'
                    ? 'bg-primary text-white'
                    : 'border border-border bg-card text-foreground hover:bg-muted'
                }`}
              >
                Event
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title"
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">
              Details
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write the news or event details"
              rows={5}
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary resize-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">
              Poster / Image
            </label>
            <div className="flex flex-col gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full rounded-xl border border-border bg-card px-4 py-3 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-muted file:px-3 file:py-2 file:text-sm file:font-medium"
              />

              {previewUrl ? (
                <div className="rounded-xl border border-border p-3">
                  <img
                    src={previewUrl}
                    alt="Community preview"
                    className="w-full max-h-72 object-cover rounded-lg"
                  />
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  <ImageIcon className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                  No image selected
                </div>
              )}
            </div>
          </div>

          {selectedResidence ? (
            <p className="text-xs text-muted-foreground">
              Publishing to{' '}
              <span className="font-medium text-foreground">
                {selectedResidence.building_name || selectedResidence.name}
              </span>
              .
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Select a building to publish a post.
            </p>
          )}

          {notice ? (
            <div className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-foreground">
              {notice}
            </div>
          ) : null}

          <div>
            <Button
              onClick={publishPost}
              disabled={publishing || !selectedId}
              className="bg-destructive hover:bg-destructive/90 text-white"
            >
              {publishing ? 'Publishing...' : 'Publish'}
            </Button>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-base font-semibold text-foreground mb-4">
          Published Posts
        </h2>

        {postsLoading ? (
          <div className="py-8 flex items-center justify-center">
            <div className="w-6 h-6 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center">
            <p className="text-sm font-medium text-foreground">
              No community posts yet
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Published news and events will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="rounded-xl border border-border p-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                          post.type === 'event'
                            ? 'bg-destructive/10 text-destructive'
                            : 'bg-primary/10 text-primary'
                        }`}
                      >
                        {post.type === 'event' ? 'Event' : 'News'}
                      </span>
                    </div>

                    <p className="text-sm font-semibold text-foreground mt-3">
                      {post.title}
                    </p>

                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(post.created_at)}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-foreground mt-3 leading-relaxed whitespace-pre-wrap">
                  {post.body}
                </p>

                {post.image_url ? (
                  <div className="mt-4">
                    <img
                      src={post.image_url}
                      alt={post.title || 'Community post'}
                      className="w-full max-h-80 object-cover rounded-xl border border-border"
                    />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
