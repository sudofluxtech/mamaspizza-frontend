"use client";

import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Strikethrough, 
  List, 
  ListOrdered, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Link as LinkIcon,
  Image as ImageIcon,
  Palette,
  Highlighter,
  Heading1,
  Heading2,
  Quote,
  Code,
  Undo,
  Redo
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt('Enter URL');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt('Enter image URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
  };

  const setHighlight = (color: string) => {
    editor.chain().focus().setHighlight({ color }).run();
  };

  return (
    <div className="border border-gray-300 rounded-t-md bg-gray-50 p-2 flex flex-wrap gap-1">
      {/* Text Formatting */}
      <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-blue-200' : ''}`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-blue-200' : ''}`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1 rounded hover:bg-gray-200 ${editor.isActive('underline') ? 'bg-blue-200' : ''}`}
          title="Underline"
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-1 rounded hover:bg-gray-200 ${editor.isActive('strike') ? 'bg-blue-200' : ''}`}
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </button>
      </div>

      {/* Headings */}
      <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-1 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 1 }) ? 'bg-blue-200' : ''}`}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-200' : ''}`}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
      </div>

      {/* Lists */}
      <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-blue-200' : ''}`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-blue-200' : ''}`}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
      </div>

      {/* Alignment */}
      <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-1 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'left' }) ? 'bg-blue-200' : ''}`}
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-1 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'center' }) ? 'bg-blue-200' : ''}`}
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-1 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'right' }) ? 'bg-blue-200' : ''}`}
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </button>
      </div>

      {/* Colors */}
      <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
        <div className="relative group">
          <button
            className="p-1 rounded hover:bg-gray-200"
            title="Text Color"
          >
            <Palette className="w-4 h-4" />
          </button>
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md p-2 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
            <div className="grid grid-cols-6 gap-1">
              {['#000000', '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#6b7280', '#ffffff'].map((color) => (
                <button
                  key={color}
                  onClick={() => setColor(color)}
                  className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="relative group">
          <button
            className="p-1 rounded hover:bg-gray-200"
            title="Highlight"
          >
            <Highlighter className="w-4 h-4" />
          </button>
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md p-2 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
            <div className="grid grid-cols-6 gap-1">
              {['#fef3c7', '#fecaca', '#d1fae5', '#dbeafe', '#f3e8ff', '#fce7f3', '#fed7aa', '#fef2f2', '#f0fdf4', '#f0f9ff'].map((color) => (
                <button
                  key={color}
                  onClick={() => setHighlight(color)}
                  className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Links and Media */}
      <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
        <button
          onClick={addLink}
          className="p-1 rounded hover:bg-gray-200"
          title="Add Link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        <button
          onClick={addImage}
          className="p-1 rounded hover:bg-gray-200"
          title="Add Image"
        >
          <ImageIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Other */}
      <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1 rounded hover:bg-gray-200 ${editor.isActive('blockquote') ? 'bg-blue-200' : ''}`}
          title="Quote"
        >
          <Quote className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-1 rounded hover:bg-gray-200 ${editor.isActive('codeBlock') ? 'bg-blue-200' : ''}`}
          title="Code Block"
        >
          <Code className="w-4 h-4" />
        </button>
      </div>

      {/* History */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => editor.chain().focus().undo().run()}
          className="p-1 rounded hover:bg-gray-200"
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          className="p-1 rounded hover:bg-gray-200"
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export function RichTextEditor({ value, onChange, placeholder, className = "" }: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer',
        },
      }),
      Image,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Start writing...',
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none',
      },
    },
    immediatelyRender: false,
  });

  if (!mounted) {
    return (
      <div className={`border border-gray-300 rounded-md ${className}`}>
        <div className="border border-gray-300 rounded-t-md bg-gray-50 p-2 h-10"></div>
        <div className="p-3 min-h-[120px] bg-gray-50 animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className={`border border-gray-300 rounded-md ${className}`}>
      <MenuBar editor={editor} />
      <EditorContent 
        editor={editor} 
        className="p-3 min-h-[120px] focus:outline-none"
        placeholder={placeholder}
      />
    </div>
  );
}