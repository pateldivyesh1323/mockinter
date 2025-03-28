export interface SignUpDataInterface {
    name: string;
    email: string;
    password: string;
    role: string;
    dateOfBirth: string;
    location: string;
    skills: string[];
    experience: {
        title: string;
        startDate: string;
    }[];
}

export interface UserInterface {
    name: string;
    email: string;
    role: string;
    dateOfBirth: string;
    location: string;
    skills: string[];
    experience: {
        title: string;
        startDate: string;
    }[];
    image: string;
    _id: string;
}
