import { BaseLoginProvider } from '../entities/base-login-provider';
import { SocialUser } from '../entities/user';
import { LoginOpt } from '../auth.service';
export declare class FacebookLoginProvider extends BaseLoginProvider {
    private clientId;
    private opt;
    private locale;
    static readonly PROVIDER_ID: string;
    constructor(clientId: string, opt?: LoginOpt, locale?: string);
    initialize(): Promise<SocialUser>;
    signIn(): Promise<SocialUser>;
    signOut(): Promise<any>;
}
