import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/src/app/components/ui/avatar";
import {
    Card,
    CardHeader,
    CardContent,
    CardFooter,
} from "@/src/app/components/ui/card";
import { Button } from "@/src/app/components/ui/button";
import Link from "next/link";
import { UserInterface } from "@/srctypes/user";

interface InterviewerCardProps {
    interviewer: UserInterface;
}

export default function InterviewerCard({ interviewer }: InterviewerCardProps) {
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("");
    };

    const calculateExperience = (experience: any[]) => {
        if (!experience || experience.length === 0) return "0 years";

        const totalMonths = experience.reduce((acc, exp) => {
            const startDate = new Date(exp.startDate);
            const endDate = exp.isCurrentlyWorking
                ? new Date()
                : new Date(exp.endDate);
            const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
            const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
            return acc + diffMonths;
        }, 0);

        const years = Math.floor(totalMonths / 12);
        const months = totalMonths % 12;
        return `${years} years${months > 0 ? ` ${months} months` : ""}`;
    };

    return (
        <Card className="hover:shadow-lg transition-shadow w-80 h-96 flex flex-col">
            <CardHeader className="flex flex-row items-center space-x-4">
                <Avatar>
                    <AvatarImage src={interviewer.image} />
                    <AvatarFallback>
                        {getInitials(interviewer.name)}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <h3 className="text-lg font-semibold">
                        {interviewer.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                        {interviewer.profession}
                    </p>
                </div>
            </CardHeader>
            <CardContent className="space-y-2 flex-grow overflow-y-auto">
                {interviewer.skills && interviewer.skills.length > 0 && (
                    <div>
                        <h4 className="text-sm font-medium mb-1">Skills</h4>
                        <div className="flex flex-wrap gap-2">
                            {interviewer.skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="bg-gray-100 px-2 py-1 rounded text-sm"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
                {interviewer.experience &&
                    interviewer.experience.length > 0 && (
                        <div>
                            <h4 className="text-sm font-medium mb-1">
                                Experience
                            </h4>
                            <p className="text-sm text-gray-600">
                                {calculateExperience(interviewer.experience)}
                            </p>
                        </div>
                    )}
            </CardContent>
            <CardFooter>
                <Link href={`/profile/${interviewer._id}`} className="w-full">
                    <Button variant="outline" className="w-full">
                        View Profile
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
