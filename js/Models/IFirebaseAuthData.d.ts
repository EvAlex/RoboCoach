
interface IFirebaseAuthData {
    uid: string;
	provider: string;
	token: string;
	expires: number;
	auth: Object;
	google?: IFirebaseAuthDataGoogle;
    facebook?: IFirebaseAuthDataFacebook;
    github?: IFirebaseAuthDataGithub;
    twitter?: IFirebaseAuthDataTwitter;
}

interface IFirebaseAuthDataGoogle {
    id: string;
	accessToken: string;
    displayName: string;
	cachedUserProfile: IFirebaseAuthDataGoogleCachedUserProfile;
	email?: string;
	profileImageURL: string;
}

interface IFirebaseAuthDataGoogleCachedUserProfile {
	"family name"?: string;
	gender?: string;
	"given name"?: string;
	id?: string;
	link?: string;
	locale?: string;
	name?: string;
	picture?: string;
}

interface IFirebaseAuthDataFacebook {
    id: string;
    accessToken: string;
    displayName: string;
    cachedUserProfile: IFirebaseAuthDataFacebookCachedUserProfile;
    profileImageURL: string;
}

interface IFirebaseAuthDataFacebookCachedUserProfile {
    id: string;
    name: string;
    last_name: string;
    first_name: string;
    gender: string;
    link: string;
    picture: {
        data: {
            is_silhouette: boolean,
            url: string
        }
    };
    age_range: {
        min: number,
        max: number
    };
    locale: string;
    timezone: number;
}

interface IFirebaseAuthDataGithub {
    id: string;
    accessToken: string;
    displayName: string;
    username: string;
    email: string;
    cachedUserProfile: IFirebaseAuthDataGithubCachedUserProfile;
    profileImageURL: string;
}

interface IFirebaseAuthDataGithubCachedUserProfile {
    id: number;
    login: string;
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
    name: string;
    company: string;
    blog: string;
    location: string;
    email: string;
    hireable: string;
    bio: string;
    public_repos: number;
    public_gists: number;
    followers: number;
    following: number;
    created_at: string;
    updated_at: string;
}

interface IFirebaseAuthDataTwitter {
    id: string;
    accessToken: string;
    accessTokenSecret: string;
    displayName: string;
    username: string;
    cachedUserProfile: IFirebaseAuthDataTwitterCachedUserProfile;
    profileImageURL: string;
}

interface IFirebaseAuthDataTwitterCachedUserProfile {
    id: number;
    id_str: string;
    name: string;
    screen_name: string;
    location: string;
    profile_location: string;
    description: string;
    url: string;
    entities: { description: { urls: string[] } };
    protected: boolean;
    followers_count: number;
    friends_count: number;
    listed_count: number;
    created_at: string;
    favourites_count: number;
    utc_offset: number;
    time_zone: string;
    geo_enabled: boolean;
    verified: boolean;
    statuses_count: number;
    lang: string;
    status: {
        created_at: string,
        id: number,
        id_str: string,
        text: string,
        source: string,
        truncated: boolean,
        in_reply_to_status_id: any,
        in_reply_to_status_id_str: any,
        in_reply_to_user_id: any,
        in_reply_to_user_id_str: any,
        in_reply_to_screen_name: any,
        geo: any,
        coordinates: any,
        place: any,
        contributors: any,
        is_quote_status: boolean,
        retweet_count: number,
        favorite_count: number,
        entities: {
            hashtags: string[],
            symbols: string[],
            user_mentions: string[],
            urls: {
                url: string,
                expanded_url: string,
                display_url: string,
                indices: number[]
            }[]
        },
        favorited: boolean,
        retweeted: boolean,
        possibly_sensitive: boolean,
        lang: string
    };
    contributors_enabled: boolean;
    is_translator: boolean;
    is_translation_enabled: boolean;
    profile_background_color: string;
    profile_background_image_url: string;
    profile_background_image_url_https: string;
    profile_background_tile: string;
    profile_image_url: string;
    profile_image_url_https: string;
    profile_link_color: string;
    profile_sidebar_border_color: string;
    profile_sidebar_fill_color: string;
    profile_text_color: string;
    profile_use_background_image: boolean;
    has_extended_profile: boolean;
    default_profile: boolean;
    default_profile_image: boolean;
    following: boolean;
    follow_request_sent: boolean;
    notifications: boolean;
    suspended: boolean;
    needs_phone_verification: boolean
}
