import { useState, useEffect } from 'react';
import { MOCK_VIDEOS } from '../data/videos';

const CACHE_KEY = 'bd_vimeo_v3';

function transform(v) {
  const id = String(v.uri?.split('/').pop() || v.resource_key || v.id || '');
  const pictures = v.pictures?.sizes || [];
  const thumb =
    pictures.find(s => s.width >= 1280)?.link ||
    pictures[pictures.length - 1]?.link ||
    '';
  return {
    id,
    title: v.name || '',
    description: v.description || '',
    thumbnail_url: thumb,
    duration: v.duration || 0,
    embed_url: `https://player.vimeo.com/video/${id}`,
    category: 'commercial',
    client: '',
    celebrity: '',
    year: new Date(v.created_time || Date.now()).getFullYear(),
    featured: false,
    grad: ['#1a1612', '#0e0c0a'],
  };
}

export function useVimeoFeed() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    const token = import.meta.env.VITE_VIMEO_TOKEN || '';
    if (!token) {
      setVideos(MOCK_VIDEOS);
      setLoading(false);
      return;
    }

    fetch(
      'https://api.vimeo.com/users/bambaidreams/videos?per_page=25&fields=uri,name,description,pictures,duration,created_time',
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(data => {
        setVideos((data.data || []).map(transform));
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setVideos(MOCK_VIDEOS);
        setLoading(false);
      });
  }, []);

  return { videos, loading, error };
}
