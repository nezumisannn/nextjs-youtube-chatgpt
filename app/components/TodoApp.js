'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nyawrxdkfqoaxwfkfamj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55YXdyeGRrZnFvYXh3ZmtmYW1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODYxOTE0ODQsImV4cCI6MjAwMTc2NzQ4NH0.c52ycNBp6ViNvgZk6UCZ2z1LKpkHPaBYoYshfYc8Xfc';
const supabase = createClient(supabaseUrl, supabaseKey);

const TodoApp = () => {
  const [title, setTitle] = useState('');
  const [todos, setTodos] = useState([]);
  const router = useRouter();

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const fetchTodos = async () => {
    const { data, error } = await supabase.from('todo').select('id, title');
    console.log(data);

    if (error) {
      console.error(error);
    } else {
      setTodos(data);
    }
  };

  const handleTodoSubmit = async () => {
    console.log(title);
    if (title.trim() !== '') {
      const { data, error } = await supabase
        .from('todo')
        .insert([{ title: title }])
        .single();

      if (error) {
        console.error(error);
      } else {
        setTodos([...todos, data]);
        setTitle('');
        fetchTodos();
      }
    }
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('todo').delete().match({ id });
  
    if (error) {
      console.error(error);
    } else {
      // 削除した後の処理を実装する（例えば、再度データを取得して表示するなど）
      // ここでは削除した後に再度データを取得して表示する例を示します
      const { data, error } = await supabase.from('todo').select('id, title');
  
      if (error) {
        console.error(error);
      } else {
        setTodos(data || []);
      }
    }
  };

  const handleEdit = (id) => {
    // idを利用して編集ページに移動する処理を実装する
    // 例えば、Next.jsのrouterを使用してページ遷移する場合は以下のようなコードを記述します
    router.push(`/${id}`);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">TODO アプリ</h1>

      <div className="flex mb-4">
        <input
          type="text"
          className="flex-grow border border-gray-300 p-2 rounded-l text-black"
          placeholder="タイトルを入力してください"
          value={title}
          onChange={handleTitleChange}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-r"
          onClick={handleTodoSubmit}
        >
          登録
        </button>
      </div>

      <table className="w-full">
        <thead>
          <tr>
          <th className="py-2 px-4 bg-gray-200 text-gray-800 font-semibold">ID</th>
      <th className="py-2 px-4 bg-gray-200 text-gray-800 font-semibold">タイトル</th>
      <th className="py-2 px-4 bg-gray-200 text-gray-800 font-semibold">操作</th>
          </tr>
        </thead>
        <tbody>
        {todos && todos.map((todo) => (
    <tr key={todo?.id}>
      <td className="py-2 px-4 border">{todo?.id}</td>
      <td className="py-2 px-4 border">{todo?.title}</td>
      <td className="py-2 px-4 border">
        <button
          className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
          onClick={() => handleEdit(todo?.id)}
        >
          編集
        </button>
        <button
          className="bg-red-500 text-white px-2 py-1 rounded"
          onClick={() => handleDelete(todo?.id)}
        >
          削除
        </button>
      </td>
    </tr>
  ))}
        </tbody>
      </table>
    </div>
  );
};

export default TodoApp;