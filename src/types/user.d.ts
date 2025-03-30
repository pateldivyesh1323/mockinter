import { ObjectId } from "mongoose";

interface SignUpDataInterface {
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

type ExperienceType = {
    title: string;
    startDate: string | number | Date;
    endDate: string | number | Date;
    description: string;
};

type RatingType = {
    user: UserInterface;
    value: number;
    message: string;
};

interface UserInterface {
    email: string;
    image: string;
    isVerified: boolean;
    name: string;
    _id: ObjectId;
    about: string;
    age: number;
    profession: string;
    location: string;
    skills: string[];
    experience: ExperienceType[];
    rating: RatingType[];
    createdAt: string | number | Date;
}
