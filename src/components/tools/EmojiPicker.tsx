
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Search } from 'lucide-react';

const emojiList = [
    { emoji: '😀', name: 'grinning face' }, { emoji: '😃', name: 'grinning face with big eyes' }, { emoji: '😄', name: 'grinning face with smiling eyes' },
    { emoji: '😁', name: 'beaming face with smiling eyes' }, { emoji: '😆', name: 'grinning squinting face' }, { emoji: '😅', name: 'grinning face with sweat' },
    { emoji: '🤣', name: 'rolling on the floor laughing' }, { emoji: '😂', name: 'face with tears of joy' }, { emoji: '🙂', name: 'slightly smiling face' },
    { emoji: '🙃', name: 'upside-down face' }, { emoji: '😉', name: 'winking face' }, { emoji: '😊', name: 'smiling face with smiling eyes' },
    { emoji: '😇', name: 'smiling face with halo' }, { emoji: '🥰', name: 'smiling face with hearts' }, { emoji: '😍', name: 'smiling face with heart-eyes' },
    { emoji: '🤩', name: 'star-struck' }, { emoji: '😘', name: 'face blowing a kiss' }, { emoji: '😗', name: 'kissing face' },
    { emoji: '😋', name: 'face savoring food' }, { emoji: '😛', name: 'face with tongue' }, { emoji: '😜', name: 'winking face with tongue' },
    { emoji: '🤪', name: 'zany face' }, { emoji: '😝', name: 'squinting face with tongue' }, { emoji: '🤑', name: 'money-mouth face' },
    { emoji: '🤗', name: 'hugging face' }, { emoji: '🤔', name: 'thinking face' }, { emoji: '🤫', name: 'shushing face' },
    { emoji: '🤭', name: 'face with hand over mouth' }, { emoji: '😐', name: 'neutral face' }, { emoji: '😑', name: 'expressionless face' },
    { emoji: '😶', name: 'face without mouth' }, { emoji: '😏', name: 'smirking face' }, { emoji: '😒', 'name': 'unamused face' },
    { emoji: '🙄', name: 'face with rolling eyes' }, { emoji: '😬', name: 'grimacing face' }, { emoji: '🤥', name: 'lying face' },
    { emoji: '😌', name: 'relieved face' }, { emoji: '😔', name: 'pensive face' }, { emoji: '😪', name: 'sleepy face' },
    { emoji: '🤤', name: 'drooling face' }, { emoji: '😴', name: 'sleeping face' }, { emoji: '😷', name: 'face with medical mask' },
    { emoji: '🤒', name: 'face with thermometer' }, { emoji: '🤕', name: 'face with head-bandage' }, { emoji: '🤢', name: 'nauseated face' },
    { emoji: '🤮', name: 'face vomiting' }, { emoji: '🤧', name: 'sneezing face' }, { emoji: '🥵', name: 'hot face' },
    { emoji: '🥶', name: 'cold face' }, { emoji: '🥴', name: 'woozy face' }, { emoji: '😵', name: 'dizzy face' },
    { emoji: '🤯', name: 'exploding head' }, { emoji: '🤠', name: 'cowboy hat face' }, { emoji: '🥳', name: 'partying face' },
    { emoji: '😎', name: 'smiling face with sunglasses' }, { emoji: '🤓', name: 'nerd face' }, { emoji: '🧐', name: 'face with monocle' },
    { emoji: '😕', name: 'confused face' }, { emoji: '😟', name: 'worried face' }, { emoji: '🙁', name: 'slightly frowning face' },
    { emoji: '😮', name: 'face with open mouth' }, { emoji: '😯', name: 'hushed face' }, { emoji: '😲', name: 'astonished face' },
    { emoji: '😳', name: 'flushed face' }, { emoji: '🥺', name: 'pleading face' }, { emoji: '😦', name: 'frowning face with open mouth' },
    { emoji: '😧', name: 'anguished face' }, { emoji: '😨', name: 'fearful face' }, { emoji: '😰', name: 'anxious face with sweat' },
    { emoji: '😥', name: 'sad but relieved face' }, { emoji: '😢', name: 'crying face' }, { emoji: '😭', name: 'loudly crying face' },
    { emoji: '😱', name: 'face screaming in fear' }, { emoji: '😖', name: 'confounded face' }, { emoji: '😣', name: 'persevering face' },
    { emoji: '😞', name: 'disappointed face' }, { emoji: '😓', name: 'downcast face with sweat' }, { emoji: '😩', name: 'weary face' },
    { emoji: '😫', name: 'tired face' }, { emoji: '🥱', name: 'yawning face' }, { emoji: '😤', name: 'face with steam from nose' },
    { emoji: '😠', name: 'angry face' }, { emoji: '😡', name: 'pouting face' }, { emoji: '🤬', name: 'face with symbols on mouth' },
    { emoji: '😈', name: 'smiling face with horns' }, { emoji: '👿', name: 'angry face with horns' }, { emoji: '💀', name: 'skull' },
    { emoji: '💩', name: 'pile of poo' }, { emoji: '🤡', name: 'clown face' }, { emoji: '👹', name: 'ogre' },
    { emoji: '👺', name: 'goblin' }, { emoji: '👻', name: 'ghost' }, { emoji: '👽', name: 'alien' },
    { emoji: '👾', name: 'alien monster' }, { emoji: '🤖', name: 'robot' }, { emoji: '❤️', name: 'red heart' },
    { emoji: '🧡', name: 'orange heart' }, { emoji: '💛', name: 'yellow heart' }, { emoji: '💚', name: 'green heart' },
    { emoji: '💙', name: 'blue heart' }, { emoji: '💜', name: 'purple heart' }, { emoji: '🖤', name: 'black heart' },
    { emoji: '💔', name: 'broken heart' }, { emoji: '❣️', name: 'heart exclamation' }, { emoji: '💕', name: 'two hearts' },
    { emoji: '💞', name: 'revolving hearts' }, { emoji: '💓', name: 'beating heart' }, { emoji: '💗', name: 'growing heart' },
    { emoji: '💖', name: 'sparkling heart' }, { emoji: '💘', name: 'heart with arrow' }, { emoji: '💝', name: 'heart with ribbon' },
    { emoji: '💟', name: 'heart decoration' }, { emoji: '💯', name: 'hundred points' }, { emoji: '👍', name: 'thumbs up' },
    { emoji: '👎', name: 'thumbs down' }, { emoji: '👌', name: 'ok hand' }, { emoji: '🙏', name: 'folded hands' },
    { emoji: '👋', name: 'waving hand' }, { emoji: '👏', name: 'clapping hands' }, { emoji: '🔥', name: 'fire' },
    { emoji: '✨', name: 'sparkles' }, { emoji: '⭐', name: 'star' }, { emoji: '🎉', name: 'party popper' },
    { emoji: '🚀', name: 'rocket' }, { emoji: '☀️', name: 'sun' }, { emoji: '🌙', name: 'crescent moon' },
];

export default function EmojiPicker() {
  const [search, setSearch] = useState('');
  const { toast } = useToast();

  const filteredEmojis = useMemo(() => {
    return emojiList.filter(e => e.name.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  const handleCopy = (emoji: string) => {
    navigator.clipboard.writeText(emoji);
    toast({
      title: 'Copied!',
      description: `Emoji ${emoji} copied to clipboard.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Emoji Picker</CardTitle>
        <CardDescription>
          Search for an emoji and click to copy it to your clipboard.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for an emoji (e.g., 'heart', 'smile')"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2 max-h-[400px] overflow-y-auto p-2 border rounded-lg">
          {filteredEmojis.map(({ emoji, name }) => (
            <Button
              key={name}
              variant="ghost"
              className="text-3xl h-14 w-14 p-0 rounded-lg hover:bg-accent"
              onClick={() => handleCopy(emoji)}
              title={name}
            >
              {emoji}
            </Button>
          ))}
        </div>
        {filteredEmojis.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
                <p>No emojis found for "{search}"</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
