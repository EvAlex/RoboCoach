
interface IFirebaseAuthData {
    uid: string;
	provider: string;
	token: string;
	expires: number;
	auth: Object;
	google?: IFirebaseAuthDataGoogle;
    facebook?: IFirebaseAuthDataFacebook;
    github?: IFirebaseAuthDataGithub;
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
