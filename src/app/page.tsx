import React from "react";
import NavbarOne from "./components/NavbarOne";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardFooter } from "./components/ui/card";

export default function Home(): React.ReactNode {
    return (
        <>
            <NavbarOne />
            <main className="px-4 md:px-8 py-10 max-w-7xl mx-auto">
                {/* Hero Section */}
                <section className="py-8 md:py-16 text-center space-y-6">
                    <h1 className="font-extrabold text-4xl md:text-5xl lg:text-6xl">
                        Platform for{" "}
                        <span className="bg-black text-white rounded px-3 py-1 whitespace-nowrap">
                            Mock Interviews
                        </span>
                    </h1>

                    <p className="text-zinc-600 max-w-3xl mx-auto text-lg md:text-xl font-medium">
                        Targeted towards students and professionals seeking job
                        opportunities. Practice with role-specific mock
                        interviews and book your slots to prepare effectively.
                    </p>

                    <div className="flex flex-wrap gap-4 justify-center pt-4">
                        <Button size="lg" className="px-8 font-semibold">
                            Get Started
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="px-8 font-semibold"
                        >
                            Learn More
                        </Button>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-12 md:py-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                            <CardContent className="pt-6 pb-2">
                                <h2 className="text-2xl font-bold mb-3">
                                    For Job Seekers
                                </h2>
                                <p className="text-zinc-600">
                                    Practice with experienced interviewers from
                                    your industry to prepare for real
                                    interviews.
                                </p>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    variant="ghost"
                                    className="w-full hover:bg-gray-100"
                                >
                                    Book a Session
                                </Button>
                            </CardFooter>
                        </Card>

                        <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                            <CardContent className="pt-6 pb-2">
                                <h2 className="text-2xl font-bold mb-3">
                                    For Interviewers
                                </h2>
                                <p className="text-zinc-600">
                                    Help others grow by conducting mock
                                    interviews in your area of expertise.
                                </p>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    variant="ghost"
                                    className="w-full hover:bg-gray-100"
                                >
                                    Become an Interviewer
                                </Button>
                            </CardFooter>
                        </Card>

                        <Card className="border border-gray-200 hover:shadow-md transition-shadow lg:col-span-1 md:col-span-2">
                            <CardContent className="pt-6 pb-2">
                                <h2 className="text-2xl font-bold mb-3">
                                    Role-specific Interviews
                                </h2>
                                <p className="text-zinc-600">
                                    Choose from various job roles and practice
                                    interviews tailored to specific positions.
                                </p>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    variant="ghost"
                                    className="w-full hover:bg-gray-100"
                                >
                                    Explore Roles
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </section>
            </main>
        </>
    );
}
