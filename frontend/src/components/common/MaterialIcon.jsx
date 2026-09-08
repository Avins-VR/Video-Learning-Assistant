import React from "react";

import {
  MdInfo,
  MdLink,
  MdAnalytics,
  MdDescription,
  MdViewModule,
  MdCheckCircle,
  MdArticle,
  MdDownload,
  MdPlayArrow,
  MdPlayCircle,
  MdStickyNote2,
  MdForum,
  MdQuiz,
  MdRoute,
  MdAccountTree,
  MdBolt,
  MdAutoAwesome,
  MdRadioButtonUnchecked,
  MdError,
  MdCached,
  MdStorage,
} from "react-icons/md";

const icons = {
  info: MdInfo,
  link: MdLink,
  analytics: MdAnalytics,
  description: MdDescription,
  view_module: MdViewModule,
  check_circle: MdCheckCircle,
  article: MdArticle,
  download: MdDownload,
  play_arrow: MdPlayArrow,
  play_circle: MdPlayCircle,
  sticky_note_2: MdStickyNote2,
  forum: MdForum,
  quiz: MdQuiz,
  route: MdRoute,
  account_tree: MdAccountTree,
  bolt: MdBolt,
  auto_awesome: MdAutoAwesome,
  radio_button_unchecked: MdRadioButtonUnchecked,
  error: MdError,
  progress_activity: MdCached,
  database: MdStorage,
};

export default function MaterialIcon({
  name,
  size = 20,
  style = {},
}) {
  const Icon = icons[name];

  if (!Icon) return null;

  return <Icon size={size} style={style} />;
}