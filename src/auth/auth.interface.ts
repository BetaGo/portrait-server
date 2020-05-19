export interface IGithubPlan {
  name: string;
  space: number;
  private_repos: number;
  collaborators: number;
}

export interface IPassword {
  token: string;
  text: string;
}

export interface IAccessTokenPayload {
  username: string;
  sub: number;
}

export interface IGithubUser {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  name?: string;
  company: string;
  blog: string;
  location: string;
  email?: string;
  hireable: boolean;
  bio: string;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  private_gists: number;
  total_private_repos: number;
  owned_private_repos: number;
  disk_usage: number;
  collaborators: number;
  two_factor_authentication: boolean;
  plan: IGithubPlan;
}

export interface IWeiboUser {
  id: number;
  screen_name: string;
  name: string;
  province: string;
  city: string;
  location: string;
  description: string;
  url: string;
  profile_image_url: string;
  domain: string;
  gender: string;
  followers_count: number;
  friends_count: number;
  statuses_count: number;
  favourites_count: number;
  created_at: string;
  following: boolean;
  allow_all_act_msg: boolean;
  geo_enabled: boolean;
  email?: string;
  verified: boolean;
  status: IWeiboStatus;
  allow_all_comment: boolean;
  avatar_large: string;
  verified_reason: string;
  follow_me: boolean;
  online_status: number;
  bi_followers_count: number;
}

export interface IWeiboStatus {
  created_at: string;
  id: number;
  text: string;
  source: string;
  favorited: boolean;
  truncated: boolean;
  in_reply_to_status_id: string;
  in_reply_to_user_id: string;
  in_reply_to_screen_name: string;
  geo?: any;
  mid: string;
  annotations: any[];
  reposts_count: number;
  comments_count: number;
}
