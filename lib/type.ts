export type CLCOOKIE = string;
export interface GROUP {
  color: number;
  comment_restricted: Boolean;
  description: Boolean;
  edit_only: Boolean;
  group_comment_restricted: Boolean;
  group_like_restricted: Boolean;
  group_message_restricted: Boolean;
  group_type: number;
  id: number;
  is_favorited: Boolean;
  like_restricted: Boolean;
  member_count: {
    deleted: number;
    inaccessible: number;
    student: number;
    teacher: number;
    total: number;
  };
  message_restricted: Boolean;
  name: string;
}
export interface USER {
  id: number;
  name: string;
  icon: string;
  type: number;
}
export interface ATTACHFILE {
  entry_cd: string;
  type: number;
  download_url: string;
  file_name: string;
}
export interface MESSAGEBODY {
  text: string;
  attach: ATTACHFILE[];
}
export interface COMMENT {
  id: number;
  body: MESSAGEBODY;
  user: USER;
  like_count: number;
  liked: Boolean;
  edited: Boolean;
  created_at: string;
}
export interface MESSAGE {
  body: MESSAGEBODY;
  bookmarked: Boolean;
  comment: COMMENT;
  comment_count: number;
  created_at: string;
  edited: Boolean;
  id: number;
  is_mimashita: Boolean;
  is_own_post: Boolean;
  is_read: Boolean;
  like_count: number;
  liked: Boolean;
  mimashita_count: number;
  read_count: number;
  type: number;
}
export interface MESSAGE_DETAIL {
  comments: COMMENT[];
  group: GROUP;
  message: MESSAGE;
}
export interface ACTIVITIE {
    created_at:string
    description:string
    group_id:number
    id:number
    message_id:number
    type:string
}
