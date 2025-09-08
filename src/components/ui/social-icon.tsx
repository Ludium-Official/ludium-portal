import { LinkIcon } from 'lucide-react';
import type React from 'react';

import Codepen from '../../assets/social/codepen.svg?react';
import Codesandbox from '../../assets/social/codesandbox.svg?react';
import Devto from '../../assets/social/devto.svg?react';
import Discord from '../../assets/social/discord.svg?react';
import Facebook from '../../assets/social/facebook.svg?react';
import Farcaster from '../../assets/social/farcaster.svg?react';
import Github from '../../assets/social/github.svg?react';
import Gitlab from '../../assets/social/gitlab.svg?react';
// Import SVGs as React components via SVGR
import Instagram from '../../assets/social/instagram.svg?react';
import Linkedin from '../../assets/social/linkedin.svg?react';
import Medium from '../../assets/social/medium.svg?react';
import Notion from '../../assets/social/notion.svg?react';
import Reddit from '../../assets/social/reddit.svg?react';
import Stackoverflow from '../../assets/social/stackoverflow.svg?react';
import Telegram from '../../assets/social/telegram.svg?react';
import Tiktok from '../../assets/social/tiktok.svg?react';
import Trello from '../../assets/social/trello.svg?react';
import XIcon from '../../assets/social/x.svg?react';
import Youtube from '../../assets/social/youtube.svg?react';

type SocialIconProps = {
  value: string;
  className?: string;
};

const SocialIcon: React.FC<SocialIconProps> = ({ value, className = 'w-5 h-5 text-secondary-foreground' }) => {
  const url = (value || '').toLowerCase();

  const patterns: Array<{ test: RegExp; Icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }> = [
    { test: /instagram\.com/, Icon: Instagram },
    { test: /facebook\.com|fb\.com/, Icon: Facebook },
    { test: /x\.com|twitter\.com/, Icon: XIcon },
    { test: /youtube\.com|youtu\.be/, Icon: Youtube },
    { test: /linkedin\.com/, Icon: Linkedin },
    { test: /github\.com/, Icon: Github },
    { test: /gitlab\.com/, Icon: Gitlab },
    { test: /codepen\.io/, Icon: Codepen },
    { test: /codesandbox\.io/, Icon: Codesandbox },
    { test: /trello\.com/, Icon: Trello },
    { test: /notion\.so|notion\.site/, Icon: Notion },
    { test: /farcaster\.xyz/, Icon: Farcaster },
    { test: /discord\.com|discord\.gg/, Icon: Discord },
    { test: /t\.me|telegram\.org/, Icon: Telegram },
    { test: /tiktok\.com/, Icon: Tiktok },
    { test: /reddit\.com/, Icon: Reddit },
    { test: /medium\.com/, Icon: Medium },
    { test: /dev\.to/, Icon: Devto },
    { test: /stackoverflow\.com/, Icon: Stackoverflow },
  ];

  const match = patterns.find(({ test }) => test.test(url));
  if (!match) {
    return <LinkIcon className={className} />;
  }

  const Icon = match.Icon;
  return <Icon className={className} />;
};

export default SocialIcon;