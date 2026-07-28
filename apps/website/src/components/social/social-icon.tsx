import {
  ChatBubbleIcon,
  EnvelopeClosedIcon,
  ExternalLinkIcon,
  GlobeIcon,
  InstagramLogoIcon,
  LinkedInLogoIcon,
  PlayIcon,
  TwitterLogoIcon,
  VideoIcon,
} from "@radix-ui/react-icons";

import { type NormalizedSocialLink } from "@/lib/utils/social-links";

type SocialIconProps = {
  platform: NormalizedSocialLink["platform"];
};

export function SocialIcon({ platform }: SocialIconProps) {
  const iconProps = {
    width: 22,
    height: 22,
    "aria-hidden": true,
  } as const;

  switch (platform) {
    case "instagram":
      return <InstagramLogoIcon {...iconProps} />;
    case "linkedin":
      return <LinkedInLogoIcon {...iconProps} />;
    case "email":
      return <EnvelopeClosedIcon {...iconProps} />;
    case "website":
      return <GlobeIcon {...iconProps} />;
    case "youtube":
      return <PlayIcon {...iconProps} />;
    case "vimeo":
    case "tiktok":
      return <VideoIcon {...iconProps} />;
    case "x":
      return <TwitterLogoIcon {...iconProps} />;
    case "facebook":
    case "threads":
    case "bluesky":
      return <ChatBubbleIcon {...iconProps} />;
    case "behance":
    case "custom":
    case "unknown":
      return <ExternalLinkIcon {...iconProps} />;
  }
}
