export interface User {
    ID?: number;
    UserNameU?: string;
    PasswordU?: string;
    TitleName?: string;
    FullName?:  string;
}

export interface Admin {
    ID?: number;
    UserNameA?: string;
    PasswordA?: string;
    TitleName?: string;
    FullName?:  string;
    Position?:  string;
}