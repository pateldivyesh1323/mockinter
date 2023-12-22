type InterviewDataType = {
    _id: ObjectId,
    title: string,
    description: string,
    interviewer: ObjectId,
    interviewee?: ObjectId,
    status: string,
    price: number,
    createdAt: string | number | Date
}

type UserType = {
    name: string,
    image: string,
    _id: ObjectId
}

type UserDetailsType = {
    email: string,
    image: string,
    isVerified: boolean,
    name: string,
    _id: ObjectId,
    about: string,
    age: number,
    profession: string,
    location: string
}