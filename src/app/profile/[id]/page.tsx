"use client";
import React, { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { useParams } from "next/navigation";
import BasicLayoutWithNavbar from "@/srcapp/components/layouts/BasicLayoutWithNavbar";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/srcapp/components/ui/avatar";
import { Button } from "@/srcapp/components/ui/button";
import { Card, CardContent, CardHeader } from "@/srcapp/components/ui/card";
import { Separator } from "@/srcapp/components/ui/separator";
import { useAuth } from "@/srcapp/Context/AuthContext";
import { UserInterface, RatingType } from "@/src/types/user";
import { CommentRatings } from "@/srcapp/components/ui/rating";
import { GET_USER_MUTATION_KEY } from "@/srcconstants";
import { handleError } from "@/srclib/helpers/errorHandler";
import { getUser } from "@/srcapp/query/authentication";
import { useMutation } from "@tanstack/react-query";
import { Skeleton } from "@/src/app/components/ui/skeleton";
import { Loader2 } from "lucide-react";

const calculateRating = (rating: RatingType[]) => {
    if (!rating || rating.length === 0) return 0;
    const totalRating =
        Array.isArray(rating) && rating.reduce((sum, r) => sum + r.value, 0);
    return totalRating || 0;
};

const formatDate = (date: string | number | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

export default function UserPage() {
    const [userDetails, setUserDetails] = useState<UserInterface | undefined>();
    const [isOwner, setIsOwner] = useState(false);

    const { id } = useParams();
    const { user, isUserLoading } = useAuth();

    const { mutate: getOtherUserMutation, isPending: isOtherUserLoading } =
        useMutation({
            mutationKey: [GET_USER_MUTATION_KEY],
            mutationFn: getUser,
            onSuccess(data) {
                setUserDetails(data.data);
            },
            onError: (error) => {
                handleError(error);
            },
        });

    useEffect(() => {
        if (isUserLoading) return;
        if (user?._id == id) {
            setUserDetails(user);
            setIsOwner(true);
        } else {
            getOtherUserMutation(null, {});
        }
    }, [id, user, isUserLoading, getOtherUserMutation]);

    if (isUserLoading || isOtherUserLoading || !userDetails) {
        return (
            <BasicLayoutWithNavbar>
                <div className="flex items-center justify-center min-h-[80vh]">
                    <div className="flex flex-col items-center space-y-4">
                        <Loader2 className="h-12 w-12 animate-spin" />
                        <p className="text-xl">Loading profile...</p>
                    </div>
                </div>
            </BasicLayoutWithNavbar>
        );
    }

    return (
        <BasicLayoutWithNavbar>
            <div className="container mx-auto px-4 max-w-4xl">
                <Card className="mb-6 overflow-hidden py-0">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-32"></div>
                    <div className="px-6 relative pb-6">
                        <div className="flex flex-col md:flex-row items-start md:items-end -mt-16 mb-4">
                            <Avatar className="h-28 w-28 border-4 border-white shadow-lg">
                                {userDetails?.image ? (
                                    <AvatarImage src={userDetails.image} />
                                ) : (
                                    <AvatarFallback className="text-3xl">
                                        {userDetails?.name
                                            ?.split(" ")
                                            .map((name: string) => name[0])
                                            .join("")}
                                    </AvatarFallback>
                                )}
                            </Avatar>
                            <div className="mt-4 md:mt-0 md:ml-6 pb-2">
                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                    <h1 className="text-3xl font-bold">
                                        {userDetails?.name}
                                    </h1>
                                    {userDetails?.isVerified && (
                                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                            Verified
                                        </span>
                                    )}
                                </div>
                                <p className="text-gray-600">
                                    {userDetails?.profession}
                                </p>
                            </div>
                            {isOwner && (
                                <div className="mt-4 md:mt-0 md:ml-auto">
                                    <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                                        Edit Profile
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        {userDetails?.about && (
                            <Card className="mb-6">
                                <CardHeader>
                                    <h3 className="text-lg font-semibold">
                                        About
                                    </h3>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-700 whitespace-pre-wrap">
                                        {userDetails.about}
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        {userDetails?.experience &&
                            userDetails.experience.length > 0 && (
                                <Card className="mb-6">
                                    <CardHeader>
                                        <h3 className="text-lg font-semibold">
                                            Experience
                                        </h3>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {userDetails.experience.map(
                                                (exp, index) => (
                                                    <div
                                                        key={index}
                                                        className={`${
                                                            index !== 0
                                                                ? "pt-4"
                                                                : ""
                                                        }`}
                                                    >
                                                        {index !== 0 && (
                                                            <Separator className="mb-4" />
                                                        )}
                                                        <h4 className="font-medium text-base">
                                                            {exp.title}
                                                        </h4>
                                                        <div className="flex gap-2 text-sm text-gray-500">
                                                            <span>
                                                                {formatDate(
                                                                    exp.startDate
                                                                )}
                                                            </span>
                                                            {exp.endDate && (
                                                                <>
                                                                    <span>
                                                                        -
                                                                    </span>
                                                                    <span>
                                                                        {formatDate(
                                                                            exp.endDate
                                                                        )}
                                                                    </span>
                                                                </>
                                                            )}
                                                        </div>
                                                        {exp.description && (
                                                            <p className="mt-2 text-gray-700">
                                                                {
                                                                    exp.description
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                    </div>

                    <div className="md:col-span-1">
                        <Card className="mb-6">
                            <CardHeader>
                                <h3 className="text-lg font-semibold">
                                    Information
                                </h3>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {isOwner && (
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Email
                                            </p>
                                            <p className="font-medium">
                                                {userDetails?.email}
                                            </p>
                                        </div>
                                    )}

                                    {userDetails?.age && (
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Age
                                            </p>
                                            <p className="font-medium">
                                                {userDetails.age} years
                                            </p>
                                        </div>
                                    )}

                                    {userDetails?.location && (
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Location
                                            </p>
                                            <p className="font-medium">
                                                {userDetails.location}
                                            </p>
                                        </div>
                                    )}

                                    {userDetails?.rating !== undefined && (
                                        <div className="flex items-center">
                                            <CommentRatings
                                                rating={calculateRating(
                                                    userDetails?.rating
                                                )}
                                                disabled={true}
                                            />
                                        </div>
                                    )}

                                    {userDetails?.createdAt && (
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Joined
                                            </p>
                                            <p className="font-medium">
                                                {formatDate(
                                                    userDetails.createdAt
                                                )}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {userDetails?.skills &&
                            userDetails.skills.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <h3 className="text-lg font-semibold">
                                            Skills
                                        </h3>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2">
                                            {userDetails.skills.map(
                                                (skill, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                                    >
                                                        {skill}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                    </div>
                </div>
            </div>
        </BasicLayoutWithNavbar>
    );
}
