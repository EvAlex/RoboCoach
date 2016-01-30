
interface IFirebaseAuthData {
    uid: string;
	provider: string;
	token: string;
	expires: number;
	auth: Object;
	google?: IFirebaseAuthDataGoogle;
    facebook?: IFirebaseAuthDataFacebook;
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
