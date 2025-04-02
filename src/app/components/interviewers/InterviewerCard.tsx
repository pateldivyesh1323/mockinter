import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/src/app/components/ui/avatar";
import { Card, CardHeader, CardContent } from "@/src/app/components/ui/card";
import Link from "next/link";
import { UserInterface } from "@/srctypes/user";
import { Badge } from "@/src/app/components/ui/badge";
import { Shield, Briefcase, User } from "lucide-react";

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
        <Link href={`/profile/${interviewer._id}`}>
            <Card className="hover:shadow-xl transition-all duration-300 w-full flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden gap-4">
                <CardHeader className="flex flex-row items-center gap-4">
                    <Avatar className="h-16 w-16 border-2 border-primary/10">
                        <AvatarImage src={interviewer.image} />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {getInitials(interviewer.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">
                            {interviewer.name}
                        </h3>
                        <p className="text-sm text-gray-500 font-medium">
                            {interviewer.profession ||
                                "Professional Interviewer"}
                        </p>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3 px-4 py-0! flex-1">
                    <div className="space-y-3">
                        {interviewer.skills &&
                            interviewer.skills.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-semibold mb-1.5 text-gray-700 flex items-center">
                                        <Shield className="h-3.5 w-3.5 mr-1.5 text-primary" />
                                        Skills
                                    </h4>
                                    <div className="flex flex-wrap gap-1.5">
                                        {interviewer.skills
                                            .slice(0, 5)
                                            .map((skill, index) => (
                                                <Badge
                                                    key={index}
                                                    variant="secondary"
                                                    className="bg-primary/10 text-primary border-none font-medium text-xs px-2 py-0.5"
                                                >
                                                    {skill}
                                                </Badge>
                                            ))}
                                        {interviewer.skills.length > 5 && (
                                            <Badge
                                                variant="outline"
                                                className="bg-gray-50 text-xs px-2 py-0.5"
                                            >
                                                +{interviewer.skills.length - 5}{" "}
                                                more
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            )}
                        {interviewer.experience &&
                            interviewer.experience.length > 0 && (
                                <div className="flex gap-2">
                                    <h4 className="text-sm font-semibold mb-1.5 text-gray-700 flex items-center">
                                        <Briefcase className="h-3.5 w-3.5 mr-1.5 text-primary" />
                                        Experience
                                    </h4>
                                    <p className="text-sm font-medium text-gray-700 bg-gray-50 p-1.5 rounded-md">
                                        {calculateExperience(
                                            interviewer.experience
                                        )}
                                    </p>
                                </div>
                            )}
                        {interviewer.about && (
                            <div>
                                <h4 className="text-sm font-semibold mb-1.5 text-gray-700 flex items-center">
                                    <User className="h-3.5 w-3.5 mr-1.5 text-primary" />
                                    About
                                </h4>
                                <p className="text-xs text-gray-600 line-clamp-2">
                                    {interviewer.about}
                                </p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
