'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nyawrxdkfqoaxwfkfamj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55YXdyeGRrZnFvYXh3ZmtmYW1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODYxOTE0ODQsImV4cCI6MjAwMTc2NzQ4NH0.c52ycNBp6ViNvgZk6UCZ2z1LKpkHPaBYoYshfYc8Xfc';
const supabase = createClient(supabaseUrl, supabaseKey);

const EditPage = () => {
  const [title, setTitle] = useState('');

  const params = useParams();
  const id = params.id;

  const router = useRouter();

  useEffect(() => {
    const fetchTitle = async () => {
      const { data, error } = await supabase
        .from('todo')
        .select('title')
        .match({ id })
        .single();

      if (error) {
        console.error(error);
      } else {
        setTitle(data?.title || '');
      }
    };

    fetchTitle();
  }, [id]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleUpdate = async () => {
    if (title.trim() !== '') {
      const { data, error } = await supabase
        .from('todo')
        .update({ title })
        .match({ id })
        .single();

      if (error) {
        console.error(error);
      } else {
        router.push('/');
      }
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
    <h1 className="text-2xl font-bold mb-4">Edit Page</h1>
    <input
      type="text"
      value={title}
      onChange={handleTitleChange}
      className="border border-gray-300 px-3 py-2 rounded-md mb-4 w-80 text-black"
    />
    <button
      onClick={handleUpdate}
      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
    >
      更新
    </button>
  </div>
  );
};

export default EditPage;