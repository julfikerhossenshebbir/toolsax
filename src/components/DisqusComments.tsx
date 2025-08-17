'use client';

import { DiscussionEmbed } from 'disqus-react';
import { Tool } from '@/lib/types';

interface DisqusCommentsProps {
  tool: Tool;
}

const DisqusComments = ({ tool }: DisqusCommentsProps) => {
  const disqusShortname = 'helloanaroul';
  const disqusConfig = {
    url: `https://toolsax.com/${tool.id}`,
    identifier: tool.id,
    title: tool.name,
  };

  return (
    <div id="comments">
      <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
    </div>
  );
};

export default DisqusComments;